using AutoMapper;
using Hangfire;
using Microsoft.EntityFrameworkCore;
using StudyNest.Business.Repository;
using StudyNest.Common.DbEntities.Entities;
using StudyNest.Common.Interfaces;
using StudyNest.Common.Models.DTOs.CoreDTO;
using StudyNest.Common.Models.DTOs.EntityDTO.Question;
using StudyNest.Common.Models.DTOs.EntityDTO.QuizAttempt;
using StudyNest.Common.Models.Paging;
using StudyNest.Common.Utils.Extensions;
using StudyNest.Common.Utils.Helper;
using StudyNest.Data;
using System.Text.Json;

namespace StudyNest.Business.v1
{
    public class QuizAttemptBusiness: IQuizAttemptBusiness
    {
        ApplicationDbContext _dbContext;
        IRepository<QuizAttempt, string> _repository;
        IUserContext _userContext;
        IQuizAttemptSnapshotBusiness _quizAttemptSnapshotBusiness;
        IMapper _mapper;
        public QuizAttemptBusiness(ApplicationDbContext dbContext, IRepository<QuizAttempt, string> repository, IUserContext userContext,
            IQuizAttemptSnapshotBusiness quizAttemptSnapshotBusiness, IMapper mapper)
        {
            this._dbContext = dbContext;
            this._repository = repository;
            this._userContext = userContext;
            this._quizAttemptSnapshotBusiness = quizAttemptSnapshotBusiness;
            this._mapper = mapper;  
        }
        public async Task<ReturnResult<PagedData<SelectQuizAttemptDTO, string>>> GetPaging(Page<string> page, bool isExported = false)
        {
            ReturnResult<PagedData<SelectQuizAttemptDTO, string>> result = new ReturnResult<PagedData<SelectQuizAttemptDTO, string>>();
            try
            {
                var query = _dbContext.QuizAttempts.AsNoTracking()
                    .Where(x => x.UserId == _userContext.UserId)
                    .OrderByDescending(x => x.DateCreated)
                    .AsQueryable();
                var pagedData = await _repository.GetPagingAsync<Page<string>, SelectQuizAttemptDTO>(query, page, isExported);
                result.Result = pagedData;
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                StudyNestLogger.Instance.Error(ex);
            }
            return result;
        }
        public async Task<ReturnResult<QuizAttemptDTO>> GetOneById(string id)
        {
            ReturnResult<QuizAttemptDTO> result = new ReturnResult<QuizAttemptDTO>();
            try
            {
                var existingQuizAttempt = await _dbContext.QuizAttempts.Where(x => x.Id == id.Trim()
                                                                        && x.UserId == _userContext.UserId)
                                                                       .Include(x => x.QuizAttemptAnswers)
                                                                       .ThenInclude(x => x.QuizAttemptAnswerChoices)
                                                                       .FirstOrDefaultAsync();
                if(existingQuizAttempt != null)
                {
                    result.Result = _mapper.Map<QuizAttemptDTO>(existingQuizAttempt);
                }
                else
                {
                    result.Message = string.Format(ResponseMessage.MESSAGE_ITEM_NOT_FOUND, "quiz attempt", id);
                }
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                StudyNestLogger.Instance.Error(ex);
            }
            return result;
        }
        public async Task<ReturnResult<QuizAttemptDTO>> CreateQuizAttempt(CreateQuizAttemptDTO newEntity)
        {
            ReturnResult<QuizAttemptDTO> result = new ReturnResult<QuizAttemptDTO>();
            try
            {
                // Find any not finished attempt for this user and this quiz, as long as the complete time is under the now time
                var notFinishedAttempt = await _dbContext.QuizAttempts
                    .Where(x => x.QuizId == newEntity.QuizId
                             && x.UserId == _userContext.UserId
                             && x.EndTime > DateTimeOffset.UtcNow
                             && x.IsCompleted == false
                     )
                    .AsNoTracking()
                    .FirstOrDefaultAsync();

                if (notFinishedAttempt == null)
                {
                    //Find the existing quiz
                    var existingQuiz = await _dbContext.Quizzes
                        .Where(x => x.Id == newEntity.QuizId)
                        .AsNoTracking()
                        .FirstOrDefaultAsync();

                    if (existingQuiz != null)
                    {
                        if (existingQuiz.OwnerId == _userContext.UserId)
                        {
                            if (existingQuiz.IsBeingConvertToSnapShot)
                            {
                                result.Message = "This quiz is being converted to snapshot. Please try again later.";
                            }
                            else
                            {
                                // Find the latest snapshot for this quiz
                                var latestSnapshot = await _dbContext.QuizAttemptSnapshots
                                    .Where(x => x.QuizId == newEntity.QuizId)
                                    .OrderByDescending(x => x.DateCreated)
                                    .AsNoTracking()
                                    .FirstOrDefaultAsync();

                                if (latestSnapshot == null)
                                {
                                    var createdResult = await _quizAttemptSnapshotBusiness.CreateSnapShot(newEntity.QuizId);
                                    if (createdResult.Result != null)
                                    {
                                        latestSnapshot = createdResult.Result;
                                    }
                                    else
                                    {
                                        result.Message = createdResult.Message;
                                    }
                                }

                                if (latestSnapshot != null)
                                {
                                    var quizAttempt = new QuizAttempt()
                                    {
                                        QuizId = newEntity.QuizId,
                                        UserId = _userContext.UserId,
                                        EndTime = DateTimeOffset.UtcNow.AddMinutes(newEntity.DurationInMinutes),
                                        QuizAttemptSnapshotId = latestSnapshot.Id.ToString(),
                                    };
                                    var savedResult = await _repository.CreateAsync(quizAttempt);
                                    if(savedResult.Message == null)
                                    {
                                        result.Result = _mapper.Map<QuizAttemptDTO>(savedResult.Result);
                                        // Schedule a background job to submit the quiz attempt when the time is up
                                        BackgroundJob.Schedule(() => SubmitQuizAttempt(result.Result.Id, _userContext.UserId), quizAttempt.EndTime.UtcDateTime);
                                    }
                                }
                            }
                        }
                        else
                        {
                            result.Message = "You are forbidden to create quiz attempt for this quiz";
                        }
                    }
                    else
                    {
                        result.Message = string.Format(ResponseMessage.MESSAGE_ITEM_NOT_FOUND, "quiz", newEntity.QuizId);
                    }
                }
                else
                {
                    result.Message = "You have an unfinished attempt for this quiz.";
                }
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                StudyNestLogger.Instance.Error(ex);
            }
            return result;
        }
        public async Task<ReturnResult<QuizAttemptDTO>> SubmitQuizAttempt(string quizAttemptId, string userId = "")
        {
            ReturnResult<QuizAttemptDTO> result = new ReturnResult<QuizAttemptDTO>();
            try 
            {
                if(string.IsNullOrEmpty(userId)) 
                {
                    userId = _userContext.UserId;
                }
                var existingAttempt = await _dbContext.QuizAttempts.Where(x => x.Id == quizAttemptId && x.UserId == userId && x.IsCompleted == false)                                  
                                                                .Include(x => x.QuizAttemptSnapshot)
                                                                .Include(x => x.QuizAttemptAnswers)
                                                                .FirstOrDefaultAsync();
                
                if (existingAttempt != null)
                {
                    var jsonString = existingAttempt.QuizAttemptSnapshot.QuizQuestions;
                    if (!string.IsNullOrEmpty(jsonString))
                    {
                        //We are sure to put ! because we have check above
                        List<QuestionDTO> parsedQuestions = JsonSerializer.Deserialize<List<QuestionDTO>>(jsonString)!;
                        // Calculate the score ( Percentage of correct answers)
                        int totalQuestions = parsedQuestions.Count;
                        int correctAnswers = existingAttempt.QuizAttemptAnswers.Where( x => x.IsCorrect).Count();   
                        int score = (int)Math.Round((double)(correctAnswers * 100) / totalQuestions);
                        // Update the QuizAttempt
                        existingAttempt.Score = score;
                        existingAttempt.IsCompleted = true;
                        // Update the QuizAttemptAnswers to set IsCorrect field and Score field
                        var updateResult = await _repository.UpdateAsync(existingAttempt);
                        if (updateResult.Result != null)
                        {
                            result.Result = _mapper.Map<QuizAttemptDTO>(updateResult.Result);
                        }
                        else
                        {
                            result.Message = updateResult.Message;
                        }
                    }
                    else
                    {
                        result.Message = "Quiz attempt snapshot is empty.";
                    }
                }
                else
                {
                    result.Message = string.Format(ResponseMessage.MESSAGE_ITEM_NOT_FOUND, "quiz attempt", quizAttemptId);
                }
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                StudyNestLogger.Instance.Error(ex);
            }
            return result;
        }
    }
}
