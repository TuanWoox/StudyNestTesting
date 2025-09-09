using StudyNest.Common.DbEntities.Entities;
using StudyNest.Common.Interfaces;
using StudyNest.Common.Models.DTOs.EntityDTO.Quizzes;
using StudyNest.Common.Utils.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudyNest.Common.Llm
{
    public class LlmQuizGenerator : ILlmQuizGenerator
    {
        private readonly ILlmClient _client;
        private readonly QuizGenerationPipeline _pipe;
        private readonly IUserContext _user;

        public LlmQuizGenerator(ILlmClient client, QuizGenerationPipeline pipe, IUserContext userContext)
        {
            _client = client;
            _pipe = pipe;
            this._user = userContext;
        }

        public async Task<Quiz> GenerateAsync(CreateQuizDTO request)
        {
            try
            {
                var (prompt, images) = _pipe.BuildPrompt(request);
                var raw = await _client.GenerateAsync(prompt, images);

                var quizEntity = _pipe.ParseToQuiz(raw, _user.UserId);
                _pipe.NormalizeQuiz(quizEntity, request);
                return quizEntity;
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error("Unexpected error in LLM GenerateAsync.");
                throw new Exception("An unexpected error occurred while generating quiz.", ex);
            }
        }

    }
}
