using StudyNest.Common.Models.DTOs.EntityDTO.Quiz;
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
            DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull
        };

        // 1) Build the LLM prompt from Editor.js note
        public (string Prompt, IReadOnlyList<string> Images) BuildPrompt(CreateQuizDTO req)
        {
            var (md, images) = FlattenEditorJsNote(req.Note);

            var mcqTarget = req.Count_Mcq;
            var tfTarget = req.Count_Tf;

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
- Language:
  - Detect the dominant language of the Note; write ALL output in that language only.
  - If the Note mixes languages, choose the language with the most tokens.
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
        public SelectQuizDTO Parse(string llmText)
        {
            var json = ExtractJson(llmText);
            json = json.Replace(": True", ": true").Replace(": False", ": false");

            // If model returns a rejection object { eligible:false, ... } throw
            using (var probe = JsonDocument.Parse(json))
            {
                if (probe.RootElement.TryGetProperty("eligible", out var elig) &&
                    elig.ValueKind == JsonValueKind.False)
                {
                    var reason = probe.RootElement.TryGetProperty("reason", out var r) ? r.GetString() : "Ineligible note.";
                    throw new InvalidOperationException($"Rejected by gate: {reason}");
                }
            }

            var dto = JsonSerializer.Deserialize<SelectQuizDTO>(json, JsonOpts)
                      ?? throw new InvalidOperationException("Cannot deserialize quiz JSON.");
            return dto;
        }

        // 3) Normalize & enforce shapes
        public void Normalize(SelectQuizDTO dto, CreateQuizDTO req)
        {
            dto.Title ??= "Generated Quiz";
            if (dto.Questions.Count > (req.Count_Tf + req.Count_Mcq))
                dto.Questions = dto.Questions.Take(req.Count_Tf + req.Count_Mcq).ToList();

            foreach (var q in dto.Questions)
            {
                q.Type = (q.Type ?? "").ToUpperInvariant() == "TF" ? "TF" : "MCQ";
                q.Text = string.IsNullOrWhiteSpace(q.Text) ? "Untitled question" : q.Text.Trim();

                if (q.Type == "MCQ")
                {
                    q.Choices ??= new();
                    q.Choices = q.Choices.Where(c => !string.IsNullOrWhiteSpace(c))
                                         .Select(c => c.Trim())
                                         .Distinct()
                                         .Take(4)
                                         .ToList();

                    while (q.Choices.Count < 4) q.Choices.Add($"Option {q.Choices.Count + 1}");

                    if (q.CorrectIndex is null || q.CorrectIndex < 0 || q.CorrectIndex > 3)
                        q.CorrectIndex = 0;

                    q.CorrectTrueFalse = null;
                }
                else // TF
                {
                    q.Choices = new() { "True", "False" };
                    q.CorrectIndex = null;
                    q.CorrectTrueFalse ??= true;
                }
            }
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

    }
}
