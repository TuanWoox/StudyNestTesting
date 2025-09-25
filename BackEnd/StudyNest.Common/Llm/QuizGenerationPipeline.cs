using StudyNest.Common.DbEntities.Entities;
using StudyNest.Common.Models.DTOs.EntityDTO.Quizzes;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace StudyNest.Common.Llm
{
    public class QuizGenerationPipeline
    {
        private static readonly JsonSerializerOptions JsonOpts = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            PropertyNameCaseInsensitive = true, // chấp nhận Title/title, Questions/questions...
            DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull
        };

        // 1) Build the LLM prompt from Editor.js note
        public (string Prompt, IReadOnlyList<string> Images) BuildPrompt(CreateQuizDTO req)
        {
            var (md, images) = FlattenEditorJsNote(req.Note);
            var language = req.Language;
            var mcqTarget = req.Count_Mcq;
            var tfTarget = req.Count_Tf;
            Console.WriteLine($"mcq: {req.Count_Mcq}; tf: {req.Count_Tf}");
            var schema = @"
{
  ""title"": ""string"",
  ""questions"": [
    {
      ""text"": ""string"",
      ""type"": ""MCQ"" | ""TF"",
      ""choices"": [""string"", ""string"", ""string"", ""string""]?, // MCQ only
      ""correctIndex"": number?,            // MCQ only, 0-based index
      ""correctTrueFalse"": boolean?,       // TF only
      ""explanation"": ""string?""
    }
  ]
}";
            var rules = $@"
- Language: {language}
- Output size & types:
  - Generate EXACTLY {mcqTarget + tfTarget} questions:
    - EXACTLY {mcqTarget} of type ""MCQ""
    - EXACTLY {tfTarget} of type ""TF""
- Difficulty: {req.Difficulty}.
- MCQ:
  - Provide exactly 4 distinct choices.
  - Set ""correctIndex"" as a 0-based index into ""choices"".
- TF:
  - Set ""choices"": [""True"", ""False""] (exactly these two).
  - Set ""correctTrueFalse"" to true or false.
- Explanations ≤ 20 words.
- Return JSON ONLY. No extra keys.";

            var prompt = $@"
Task: From the student's study note, create a quiz in the EXACT JSON shape below.

{schema}

Rules:
{rules}

Note (markdown, derived from the student's Editor.js content):
{md}".Trim();

            return (prompt, images);
        }

        // 2) Parse raw LLM text → QuizDetailsDTO (handles code fences, T/F casing, rejection path)
        public Quiz ParseToQuiz(string llmText, string createdBy)
        {
            if (string.IsNullOrWhiteSpace(createdBy))
                throw new ArgumentException("createdBy is required", nameof(createdBy));

            var json = ExtractJson(llmText);
            json = NormalizeBooleanLiterals(json); // chỉ lower-case True/False literals, không đụng string

            // Nếu model trả rejection { eligible:false, reason:... } => throw
            using (var probe = JsonDocument.Parse(json))
            {
                if (probe.RootElement.TryGetProperty("eligible", out var elig) &&
                    elig.ValueKind == JsonValueKind.False)
                {
                    var reason = probe.RootElement.TryGetProperty("reason", out var r) ? r.GetString() : "Ineligible note.";
                    throw new InvalidOperationException($"Rejected by gate: {reason}");
                }
            }

            var dto = JsonSerializer.Deserialize<LlmQuizDto>(json, JsonOpts)
                      ?? throw new InvalidOperationException("Cannot deserialize quiz JSON.");

            // Map DTO -> Entity
            var quiz = new Quiz
            {
                Title = string.IsNullOrWhiteSpace(dto.Title) ? "Generated Quiz" : dto.Title.Trim(),
                OwnerId = createdBy,
                NoteId = "010e9bf8-db90-4096-bef4-b68c8d71f233",
                Questions = new List<Question>()
            };

            int order = 0;
            foreach (var q in dto.Questions ?? new List<LlmQuestionDto>())
            {
                order++;
                var type = (q.Type ?? "").Trim().ToUpperInvariant();
                type = (type == "TF") ? "TF" : "MCQ";

                var question = new Question
                {
                    Name = string.IsNullOrWhiteSpace(q.Text) ? "Untitled question" : q.Text.Trim(),
                    Type = type,
                    Explanation = (q.Explanation ?? string.Empty).Trim(),
                    OrderNo = order,
                    Choices = new List<Choice>()
                };

                if (type == "MCQ")
                {
                    // Clean + distinct + đủ 4 lựa chọn
                    var choices = (q.Choices ?? new List<string>())
                        .Where(c => !string.IsNullOrWhiteSpace(c))
                        .Select(c => c.Trim())
                        .Distinct()
                        .Take(4)
                        .ToList();

                    while (choices.Count < 4)
                        choices.Add($"Option {choices.Count + 1}");

                    // CorrectIndex 0..3, default 0
                    int idx = (q.CorrectIndex is >= 0 and <= 3) ? q.CorrectIndex.Value : 0;
                    question.CorrectIndex = idx;
                    question.CorrectTrueFalse = null;

                    // Create Choice entities
                    for (int i = 0; i < choices.Count; i++)
                    {
                        question.Choices.Add(new Choice
                        {
                            Text = choices[i],
                            OrderNo = i + 1
                        });
                    }
                }
                else // TF
                {
                    question.CorrectIndex = null;
                    question.CorrectTrueFalse = q.CorrectTrueFalse ?? true; // default true
                                                                            // Giữ choices đồng nhất để FE render dễ
                    question.Choices.Add(new Choice { Text = "True", OrderNo = 1 });
                    question.Choices.Add(new Choice { Text = "False", OrderNo = 2 });
                }

                quiz.Questions.Add(question);
            }

            return quiz;
        }


        // 3) Normalize & enforce shapes
        public void NormalizeQuiz(Quiz quiz, CreateQuizDTO req)
        {
            if (quiz == null) throw new ArgumentNullException(nameof(quiz));

            var mcqTarget = req.Count_Mcq;
            var tfTarget = req.Count_Tf;

            var mcqs = quiz.Questions.Where(q => q.Type == "MCQ").Take(mcqTarget);
            var tfs = quiz.Questions.Where(q => q.Type == "TF").Take(tfTarget);

            var merged = mcqs.Concat(tfs).ToList();
            for (int i = 0; i < merged.Count; i++)
                merged[i].OrderNo = i + 1;

            quiz.Questions = merged;
        }


        // ---------- helpers ----------

        private static string ExtractJson(string s)
        {
            if (string.IsNullOrWhiteSpace(s)) return "{}";
            // Prefer fenced code block
            var m = Regex.Match(s, "```(?:json)?\\s*([\\s\\S]*?)```", RegexOptions.IgnoreCase);
            if (m.Success) return m.Groups[1].Value.Trim();

            // Fallback: substring from first '{' to last '}'
            var i = s.IndexOf('{'); var j = s.LastIndexOf('}');
            return (i >= 0 && j > i) ? s.Substring(i, j - i + 1).Trim() : s.Trim();
        }

        /// <summary>Flatten Editor.js JSON into markdown text + collect image URLs.</summary>
        public static (string markdown, List<string> imageUrls) FlattenEditorJsNote(string noteJson)
        {
            if (string.IsNullOrWhiteSpace(noteJson))
                return ("", new());
            var trimmed = noteJson.Trim();

            // 1) Nếu không mở đầu bằng { hoặc [, coi như plain text
            if (trimmed.Length == 0 || (trimmed[0] != '{' && trimmed[0] != '['))
                return (trimmed, new());

            try
            {
                using var doc = JsonDocument.Parse(trimmed);
                if (!doc.RootElement.TryGetProperty("blocks", out var blocks) ||
                    blocks.ValueKind != JsonValueKind.Array)
                {
                    // Không đúng format Editor.js → coi như plain text
                    return (trimmed, new());
                }

                var sb = new StringBuilder();
                var images = new List<string>();

                foreach (var block in blocks.EnumerateArray())
                {
                    var type = block.GetProperty("type").GetString() ?? "";
                    var data = block.GetProperty("data");

                    switch (type)
                    {
                        case "header":
                            {
                                var level = data.TryGetProperty("level", out var lvl) ? Math.Clamp(lvl.GetInt32(), 1, 6) : 2;
                                var text = CleanInlineHtml(data.GetProperty("text").GetString() ?? "");
                                sb.AppendLine(new string('#', level) + " " + text);
                                sb.AppendLine();
                                break;
                            }
                        case "paragraph":
                            {
                                var text = CleanInlineHtml(data.GetProperty("text").GetString() ?? "");
                                sb.AppendLine(text);
                                sb.AppendLine();
                                break;
                            }
                        case "list":
                            {
                                var style = data.TryGetProperty("style", out var s) ? s.GetString() : "unordered";
                                if (data.TryGetProperty("items", out var items) && items.ValueKind == JsonValueKind.Array)
                                {
                                    int i = 1;
                                    foreach (var item in items.EnumerateArray())
                                    {
                                        var t = CleanInlineHtml(item.GetString() ?? "");
                                        if (style == "ordered") sb.AppendLine($"{i}. {t}");
                                        else sb.AppendLine($"- {t}");
                                        i++;
                                    }
                                    sb.AppendLine();
                                }
                                break;
                            }
                        case "image":
                            {
                                string? url = null;
                                if (data.TryGetProperty("file", out var file) && file.TryGetProperty("url", out var u))
                                    url = u.GetString();

                                if (!string.IsNullOrWhiteSpace(url)) images.Add(url);

                                var caption = data.TryGetProperty("caption", out var c) ? CleanInlineHtml(c.GetString() ?? "") : "";
                                if (!string.IsNullOrWhiteSpace(caption))
                                {
                                    sb.AppendLine($"Image caption: {caption}");
                                    sb.AppendLine();
                                }
                                break;
                            }
                        default:
                            break;
                    }
                }

                return (sb.ToString().Trim(), images);
            }
            catch (JsonException)
            {
                // 3) JSON lỗi → plain text
                return (trimmed, new());
            }
        }

        private static string CleanInlineHtml(string s)
        {
            if (string.IsNullOrEmpty(s)) return s;
            return Regex.Replace(s, "<.*?>", string.Empty)
                        .Replace("&nbsp;", " ")
                        .Trim();
        }
        private static string NormalizeBooleanLiterals(string json)
        {
            if (string.IsNullOrWhiteSpace(json)) return json;
            return Regex.Replace(json,
                @"(?<=:\s*)(True|False)(?=\s*[,}])",
                m => m.Value.ToLowerInvariant(),
                RegexOptions.CultureInvariant);
        }

        private sealed class LlmQuizDto
        {
            public string? Title { get; set; }
            public List<LlmQuestionDto>? Questions { get; set; }
        }

        private sealed class LlmQuestionDto
        {
            public string? Text { get; set; }
            public string? Type { get; set; }              // "MCQ" | "TF"
            public List<string>? Choices { get; set; }     // MCQ
            public int? CorrectIndex { get; set; }         // MCQ
            public bool? CorrectTrueFalse { get; set; }    // TF
            public string? Explanation { get; set; }
        }


    }
}
