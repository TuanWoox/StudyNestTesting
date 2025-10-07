using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.VisualBasic;
using StudyNest.Business.Repository;
using StudyNest.Common.DbEntities.Entities;
using StudyNest.Common.Interfaces;
using StudyNest.Common.Models.DTOs.CoreDTO;
using StudyNest.Common.Models.DTOs.EntityDTO.Quizzes;
using StudyNest.Common.Models.Paging;
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
        private readonly IRepository<Quiz, string> _repository;
        private readonly int MaxQuestions = 20;
        public QuizBusiness(ILlmQuizGenerator llm, ApplicationDbContext context, IUserContext userContext, IRepository<Quiz,string> repository)
        {
            this._llm = llm;
            this._context = context;
            this._userContext = userContext;
            this._repository = repository;
        }

        public async Task<ReturnResult<object>> GenerateAsync(CreateQuizDTO dto)
        {
            var result = new ReturnResult<object>();
            var total = (dto?.Count_Mcq ?? 0) + (dto?.Count_Tf ?? 0);
            if (dto is null)
            {
                result.Message = ResponseMessage.MESSAGE_ITEM_NOT_EXIST.Replace("{0}", "Request body");
                return result;
            }
            if ((dto.Count_Mcq < 0) || (dto.Count_Tf < 0))
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
            var note = await _context.Notes.Where(n => n.Id == dto.NoteId).FirstOrDefaultAsync();
            if (note == null)
            {
                result.Message = "Note not found.";
                return result;
            }
            dto.NoteContent = note.Content;

            try
            {
                var newQuiz = await _llm.GenerateAsync(dto);
                if (newQuiz is null || newQuiz.Questions == null || newQuiz.Questions.Count == 0)
                {
                    result.Message = "The note is insufficient or meaningless. Quiz was not created.";
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

        public async Task<ReturnResult<PagedData<QuizListDTO, string>>> GetAllQuizByUserId(Page<string> page, bool isExported = false)
        {
            var rs = new ReturnResult<PagedData<QuizListDTO, string>>();
            try
            {
                var query = _context.Quizzes
                    .Where(n => n.OwnerId == _userContext.UserId)
                    .AsNoTracking()
                    .OrderByDescending(q => q.DateCreated ?? DateTimeOffset.MinValue)
                    .AsQueryable();
                rs.Result = await _repository.GetPagingAsync<Page<string>, QuizListDTO>(query, page, isExported);
                if (rs.Result.Page.TotalElements == 0)
                {
                    rs.Message = ResponseMessage.MESSAGE_ALL_ITEM_NOT_FOUND;
                }
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
