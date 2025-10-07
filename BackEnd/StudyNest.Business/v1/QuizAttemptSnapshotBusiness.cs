using AutoMapper;
using Microsoft.EntityFrameworkCore;
using StudyNest.Business.Repository;
using StudyNest.Common.DbEntities.Entities;
using StudyNest.Common.Interfaces;
using StudyNest.Common.Models.DTOs.CoreDTO;
using StudyNest.Common.Models.DTOs.EntityDTO.Choice;
using StudyNest.Common.Models.DTOs.EntityDTO.Question;
using StudyNest.Common.Utils.Extensions;
using StudyNest.Common.Utils.Helper;
using StudyNest.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace StudyNest.Business.v1
{
    public class QuizAttemptSnapshotBusiness: IQuizAttemptSnapshotBusiness
    {
        ApplicationDbContext _context;
        IRepository<QuizAttemptSnapshot, string> _repository;
        IMapper _mapper;
        public QuizAttemptSnapshotBusiness(ApplicationDbContext context, IRepository<QuizAttemptSnapshot, string> repository, IMapper mapper) 
        {
            this._context = context;
            this._repository = repository;
            this._mapper = mapper;
        }
        public async Task<ReturnResult<QuizAttemptSnapshot>> CreateSnapShot(string quizId)
        {
            ReturnResult<QuizAttemptSnapshot> result = new ReturnResult<QuizAttemptSnapshot>();
            try
            {
                var existingQuiz = await _context.Quizzes.Where(x => x.Id == quizId.Trim())
                                                .Include(x => x.Questions)
                                                .ThenInclude(q => q.Choices)
                                                .FirstOrDefaultAsync();
                                                
                if(existingQuiz != null)
                {
                    var questionsDto = _mapper.Map<List<QuestionDTO>>(existingQuiz.Questions);

                    var quizSnapShot = new QuizAttemptSnapshot()
                    {
                        QuizId = existingQuiz.Id,
                        QuizQuestions = JsonSerializer.Serialize(questionsDto)
                    };

                    result = await _repository.CreateAsync(quizSnapShot);
                    existingQuiz.IsBeingConvertToSnapShot = false;
                    _context.Quizzes.Update(existingQuiz);
                    await _context.SaveChangesAsync();
                }
                else
                {
                    result.Message = string.Format(ResponseMessage.MESSAGE_ITEM_NOT_FOUND, "quiz", quizId);
                }
            }
            catch(Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
            }
            return result;
        }
    }
}
