using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.Extensions.Configuration;
using Microsoft.VisualBasic;
using StudyNest.Business.Services.Llm.Abtractions;
using StudyNest.Common.Models.DTOs.EntityDTO.Quiz;
using StudyNest.Common.Utils.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;

namespace StudyNest.Business.Services.Llm.Providers
{
    public class GeminiClient : ILlmClient
    {
        private readonly HttpClient _http;
        private readonly IConfiguration _cfg;

        public GeminiClient(HttpClient httpClient, IConfiguration cfg)
        {
            this._http = httpClient;
            this._cfg = cfg;
        }

        public async Task<string> GenerateAsync(string prompt, IReadOnlyList<string> imageUrls)
        {
            var apiKey = _cfg["ApiKeys:Gemini"];
            if (string.IsNullOrWhiteSpace(apiKey))
            {
                throw new InvalidOperationException("Missing ApiKeys:Gemini in configuration.");
            }
            var model = "gemini-2.0-flash";
            var endpoint = $"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={apiKey}";

            var parts = new List<object> { new { text = prompt } };
            foreach (var url in imageUrls ?? Array.Empty<string>())
            {
                parts.Add(new
                {
                    fileData = new { fileUri = url, mimeType = InferImageMimeType(url) }
                });
            }
            var payload = new
            {
                contents = new[] { new { role = "user", parts } },
                generationConfig = new
                {
                    responseMimeType = "application/json"
                }

            };

            for (int attempt = 0; attempt < 3; attempt++)
            {
                try
                {
                    using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(10));
                    using var req = new HttpRequestMessage(HttpMethod.Post, endpoint)
                    {
                        Content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json")
                    };
                    using var res = await _http.SendAsync(req, cts.Token);
                    var body = await res.Content.ReadAsStringAsync(cts.Token);

                    res.EnsureSuccessStatusCode();

                    using var doc = JsonDocument.Parse(body);
                    var candidates = doc.RootElement.GetProperty("candidates");
                    var partsOut = candidates[0].GetProperty("content").GetProperty("parts");

                    var sb = new StringBuilder();
                    foreach (var p in partsOut.EnumerateArray())
                    {
                        if (p.TryGetProperty("text", out var t))
                            sb.Append(t.GetString());
                    }

                    return sb.ToString().Trim();

                }
                catch (Exception ex) when (attempt < 2)
                {
                    StudyNestLogger.Instance.Warn("Retrying Gemini request...");
                    StudyNestLogger.Instance.Error("Error while Gemini request: " + ex);
                    await Task.Delay(1000);
                }
                catch (Exception ex)
                {
                    StudyNestLogger.Instance.Error("Gemini request failed.");
                    throw new Exception("Error while Gemini request: " + ex);
                }

            }

            throw new ApplicationException("Gemini request failed after retries.");
        }
        private static string InferImageMimeType(string url)
        {
            var lower = (url ?? "").Split('?')[0].ToLowerInvariant();
            if (lower.EndsWith(".png")) return "image/png";
            if (lower.EndsWith(".webp")) return "image/webp";
            if (lower.EndsWith(".gif")) return "image/gif";
            if (lower.EndsWith(".bmp")) return "image/bmp";
            if (lower.EndsWith(".svg")) return "image/svg+xml";
            if (lower.EndsWith(".jpg") || lower.EndsWith(".jpeg") || lower.Contains("/image/upload/")) return "image/jpeg";
            return "image/jpeg";
        }


    }
}
