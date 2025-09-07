using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.VisualBasic;
using StudyNest.Common.DbEntities.Entities;
using StudyNest.Common.Interfaces;
using StudyNest.Common.Models.DTOs.CoreDTO;
using StudyNest.Common.Models.DTOs.EntityDTO.Quizzes;
using StudyNest.Common.Utils.Extensions;
using StudyNest.Common.Utils.Helper;
using StudyNest.Data;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Security.Policy;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace StudyNest.Business.v1
{
    public class QuizBusiness : IQuizBusiness
    {
        private readonly ILlmQuizGenerator _llm;
        private readonly ApplicationDbContext _context;
        private readonly IUserContext _userContext;
        private readonly int MaxQuestions = 20;
        public QuizBusiness(ILlmQuizGenerator llm, ApplicationDbContext context, IUserContext userContext)
        {
            this._llm = llm;
            this._context = context;
            this._userContext = userContext;
        }

        public async Task<ReturnResult<object>> GenerateAsync(CreateQuizDTO prompt)
        {
            var result = new ReturnResult<object>();
            var total = (prompt?.Count_Mcq ?? 0) + (prompt?.Count_Tf ?? 0);
            if (prompt is null)
            {
                result.Message = ResponseMessage.MESSAGE_ITEM_NOT_EXIST.Replace("{0}", "Request body");
                return result;
            }
            if ((prompt.Count_Mcq < 0) || (prompt.Count_Tf < 0))
            {
                result.Message = "Count_Mcq/Count_Tf must be ≥ 0.";
                return result;
            }
            if (total <= 0)
            {
                result.Message = "Total number of questions must be > 0.";
                return result;
            }
            if (total > MaxQuestions)
            {
                result.Message = $"Total questions must be ≤ {MaxQuestions}.";
                return result;
            }

            try
            {
                var newQuiz = await _llm.GenerateAsync(prompt);
                if (newQuiz is null)
                {
                    result.Message = ResponseMessage.MESSAGE_CREATE_ERROR;
                    return result;
                }

                await _context.AddAsync(newQuiz);
                await _context.SaveChangesAsync();
                result.Result = new {id = newQuiz.Id.ToString() };
            }
            catch (Exception ex)
            {
                result.Message = ResponseMessage.MESSAGE_TECHNICAL_ISSUE;
                StudyNestLogger.Instance.Error(ex);
            }
            return result;
        }

        public async Task<ReturnResult<List<QuizDTO>>> GetAllQuiz()
        {
            var rs = new ReturnResult<List<QuizDTO>>();
            try
            {
                rs.Result = await _context.Quizzes
                    .AsNoTracking()
                    .OrderByDescending(q => q.DateCreated ?? DateTimeOffset.MinValue) 
                    .Select(q => new QuizDTO
                    {
                        Id = q.Id,
                        Title = q.Title,
                        TotalQuestion = q.Questions.Count,
                        DateCreated = (q.DateCreated ?? DateTimeOffset.MinValue).DateTime
                    })
                    .ToListAsync();
                if (rs.Result.Count == 0)
                    rs.Message = ResponseMessage.MESSAGE_COMMON_ITEM_NOT_FOUND;
            }
            catch (Exception ex)
            {
                rs.Message = ResponseMessage.MESSAGE_TECHNICAL_ISSUE;
                StudyNestLogger.Instance.Error(ex);
            }
            return rs;
        }

        public async Task<ReturnResult<Quiz>> GetQuizDetail(string id)
        {
            var rs = new ReturnResult<Quiz>();
            try
            {
                if (string.IsNullOrWhiteSpace(id))
                {
                    rs.Message = ResponseMessage.MESSAGE_ITEM_NOT_EXIST.Replace("{0}", "quiz id");
                    return rs;
                }
                var quiz = await _context.Quizzes
                    .Where(q => q.Id == id)
                    .Include(q => q.Questions)
                        .ThenInclude(qn => qn.Choices)
                    .FirstOrDefaultAsync();
                if (quiz is null)
                {
                    rs.Message = string.Format(ResponseMessage.MESSAGE_ITEM_NOT_FOUND, "quiz", id);
                    return rs;
                }
                rs.Result = quiz;
            }
            catch (Exception ex)
            {
                rs.Message = ResponseMessage.MESSAGE_TECHNICAL_ISSUE;
                StudyNestLogger.Instance.Error(ex);
            }
            return rs;
        }
        public async Task<ReturnResult<bool>> DeleteById(string id)
        {
            var result = new ReturnResult<bool>();
            try
            {
                if (string.IsNullOrWhiteSpace(id))
                {
                    result.Message = ResponseMessage.MESSAGE_ITEM_NOT_EXIST.Replace("{0}", "quiz id");
                    return result;
                }
                var quizToDelete = await _context.Quizzes.Where(x => x.Id == id).ToListAsync();
                if (quizToDelete.Count == 0)
                {
                    result.Message = string.Format(ResponseMessage.MESSAGE_ITEM_NOT_FOUND, "quiz", id);
                    return result;
                }
                _context.RemoveRange(quizToDelete);

                result.Result = await _context.SaveChangesAsync() > 0;

                if (!result.Result)
                    result.Message = ResponseMessage.MESSAGE_TECHNICAL_ISSUE;
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
                result.Message = ResponseMessage.MESSAGE_TECHNICAL_ISSUE;
            }
            return result;
        }
    }
}
