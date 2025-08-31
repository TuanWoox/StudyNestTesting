using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.VisualBasic;
using StudyNest.Common.DbEntities.Entities;
using StudyNest.Common.Interfaces;
using StudyNest.Common.Models.DTOs.CoreDTO;
using StudyNest.Common.Models.DTOs.EntityDTO.Quiz;
using StudyNest.Common.Utils.Extensions;
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

        public QuizBusiness(ILlmQuizGenerator llm, ApplicationDbContext context)
        {
            this._llm = llm;
            this._context = context;
        }

        public async Task<ReturnResult<SelectQuizDTO>> GenerateAsync(CreateQuizDTO prompt)
        {
            var result = new ReturnResult<SelectQuizDTO>();
            try
            {
                var quiz = await _llm.GenerateAsync(prompt);
                var quizId = Guid.NewGuid().ToString();
                var newQuiz = new Quiz()
                {
                    //Id = quizId,
                    Title = quiz.Title,
                    Questions = quiz.Questions.Select((q, index) => new Question
                    {
                        //Id = Guid.NewGuid().ToString(),
                        //QuizId = quizId,
                        Name = q.Text,
                        Type = q.Type,
                        Explanation = q.Explanation,
                        OrderNo = index + 1,
                        CorrectIndex = q.Type == "MCQ" ? q.CorrectIndex : null,
                        CorrectTrueFalse = q.Type == "TF" ? q.CorrectTrueFalse : null,
                        Choices = q.Choices.Select((c, choiceIndex) => new Choice
                        {
                            //Id = Guid.NewGuid().ToString(),
                            Text = c,
                            OrderNo = choiceIndex + 1
                        }).ToList()
                    }).ToList()
                };
                
                await _context.AddAsync(newQuiz);
                await _context.SaveChangesAsync();
                result.Result = quiz;
            }
            catch (Exception ex)
            {
                result.Message = "An error occurred during generating quiz.";
                StudyNestLogger.Instance.Error(ex);
            }
            return result;
        }

        public async Task<ReturnResult<List<QuizDTO>>> GetAllQuiz()
        {
            var rs = new ReturnResult<List<QuizDTO>> { Result = new List<QuizDTO>()};
            try
            {
                var quizList = await _context.Quizzes.Include(q => q.Questions).ToListAsync();
                foreach(var quiz in quizList)
                {
                    var quizDTO = new QuizDTO()
                    {
                        Id = quiz.Id,
                        Title = quiz.Title,
                        TotalQuestion = quiz.Questions.Count,
                        DateCreated = quiz.DateCreated.GetValueOrDefault().DateTime
                    };  
                    rs.Result.Add(quizDTO);
                }
            }
            catch (Exception ex)
            {
                rs.Message = "An error occurred during fetching quizzes.";
                StudyNestLogger.Instance.Error(ex);
            }
            return rs;
        }
        public async Task<ReturnResult<Quiz>> GetQuizDetail(string id)
        {
            var rs = new ReturnResult<Quiz>();
            try
            {
                var quiz = await _context.Quizzes
                    .Where(q => q.Id == id)
                    .Include(q => q.Questions)
                        .ThenInclude(qn => qn.Choices)
                    .FirstOrDefaultAsync();
                rs.Result = quiz;
            }
            catch (Exception ex)
            {
                rs.Message = "An error occurred during fetching quizzes.";
                StudyNestLogger.Instance.Error(ex);
            }
            return rs;
        }
    }
}
