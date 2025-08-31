using StudyNest.Business.Services.Llm.Abtractions;
using StudyNest.Common.Models.DTOs.EntityDTO.Quiz;
using StudyNest.Common.Utils.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudyNest.Business.Services.Llm
{
    public class LlmQuizGenerator : ILlmQuizGenerator
    {
        private readonly ILlmClient _client;
        private readonly QuizGenerationPipeline _pipe;

        public LlmQuizGenerator(ILlmClient client, QuizGenerationPipeline pipe)
        {
            _client = client;
            _pipe = pipe;
        }

        public async Task<SelectQuizDTO> GenerateAsync(CreateQuizDTO request)
        {
            try
            {
                var (prompt, images) = _pipe.BuildPrompt(request);
                var raw = await _client.GenerateAsync(prompt, images);
                var dto = _pipe.Parse(raw);
                _pipe.Normalize(dto, request);
                return dto;
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error("Unexpected error in LLM GenerateAsync.");
                throw new Exception("An unexpected error occurred while generating quiz.", ex);
            }
        }

    }
}
