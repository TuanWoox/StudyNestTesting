using AutoMapper;
using Microsoft.EntityFrameworkCore;
using StudyNest.Business.Repository;
using StudyNest.Common.DbEntities.Entities;
using StudyNest.Common.Interfaces;
using StudyNest.Common.Models.DTOs.CoreDTO;
using StudyNest.Common.Models.DTOs.EntityDTO.Question;
using StudyNest.Common.Models.DTOs.EntityDTO.QuizAttemptAnswer;
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
    public class QuizAttemptAnswerBusiness: IQuizAttemptAnswerBusiness
    {
        ApplicationDbContext _context;
        IUserContext _userContext;
        IRepository<QuizAttemptAnswer, string> _repository;
        IMapper _mapper;

        public QuizAttemptAnswerBusiness(ApplicationDbContext context, IUserContext userContext, IRepository<QuizAttemptAnswer, string> repository, IMapper mapper) 
        { 
            this._context = context;
            this._userContext = userContext;
            this._repository = repository;
            this._mapper = mapper;
        }
        public async Task<ReturnResult<QuizAttemptAnswerDTO>> CreateQuizAttemptAnswer(CreateQuizAttemptAnswerDTO newEntity)
        {
            ReturnResult<QuizAttemptAnswerDTO> result = new ReturnResult<QuizAttemptAnswerDTO>();
            try
            {
                var existingAttempt = await _context.QuizAttempts.Where(x => x.Id == newEntity.QuizAttemptId
                                                                    && x.UserId == _userContext.UserId
                                                                    && x.EndTime > DateTimeOffset.UtcNow
                                                                    )
                                                                 .Include(x => x.QuizAttemptSnapshot)
                                                                 .ThenInclude(x => x.Quiz)
                                                                 .AsNoTracking()
                                                                 .FirstOrDefaultAsync();
                var existingAttemptAnswer = await _context.QuizAttemptAnswers.Where(x => x.QuizAttemptId == newEntity.QuizAttemptId
                                                                                && x.SnapshotQuestionId == newEntity.SnapShotQuestionId)
                                                                            .FirstOrDefaultAsync();


                // Check if the attempt exists and belongs to the user
                if (existingAttempt != null && existingAttempt.QuizAttemptSnapshot.Quiz.OwnerId == _userContext.UserId)
                {
                    if (existingAttemptAnswer == null)
                    {
                        var jsonString = existingAttempt.QuizAttemptSnapshot.QuizQuestions;
                        if (!string.IsNullOrEmpty(jsonString))
                        {
                            //Always is not null because of the check above
                            List<QuestionDTO> parsedQuestions = JsonSerializer.Deserialize<List<QuestionDTO>>(jsonString)!;

                            // Check if the SnapshotQuestionId exists in the quiz attempt snapshot
                            var question = parsedQuestions.FirstOrDefault(x => x.Id == newEntity.SnapShotQuestionId);
                            if (question != null)
                            {
                                List<string> correctAnswerIds = question.Choices.Where(c => c.IsCorrect).Select(c => c.Id).ToList();
                                List<string> providedAnswerIds = newEntity.QuizAttemptAnswerChoices.Select(c => c.ChoiceId).ToList();

                                // Validate that all provided choice IDs exist in the question's choices
                                var validChoiceIds = question.Choices.Select(c => c.Id).ToList();
                                var invalidChoices = providedAnswerIds.Except(validChoiceIds).ToList();

                                if (invalidChoices.Any())
                                {
                                    result.Message = string.Format(ResponseMessage.MESSAGE_ITEM_NOT_FOUND, "choice(s)", string.Join(", ", invalidChoices));
                                    return result;
                                }

                                // Determine if the provided answers are correct
                                bool isCorrect = correctAnswerIds.Count == newEntity.QuizAttemptAnswerChoices.Count && !correctAnswerIds.Except(providedAnswerIds).Any();
                                QuizAttemptAnswer attemptAnswer = new QuizAttemptAnswer
                                {
                                    QuizAttemptId = newEntity.QuizAttemptId,
                                    SnapshotQuestionId = newEntity.SnapShotQuestionId,
                                    IsCorrect = isCorrect,
                                };
                                // Create the QuizAttemptAnswer first to get its Id
                                var savedResult = await _repository.CreateAsync(attemptAnswer);
                                if (savedResult.Message == null)
                                {
                                    List<QuizAttemptAnswerChoice> attemptAnswerChoices = new List<QuizAttemptAnswerChoice>();
                                    // Now create QuizAttempAnswerChoice entries
                                    foreach (var choiceId in providedAnswerIds)
                                    {
                                        QuizAttemptAnswerChoice answerChoice = new QuizAttemptAnswerChoice
                                        {
                                            QuizAttemptAnswerId = savedResult.Result.Id,
                                            ChoiceId = choiceId
                                        };
                                        attemptAnswerChoices.Add(answerChoice);
                                    }
                                    await _context.AddRangeAsync(attemptAnswerChoices);
                                    await _context.SaveChangesAsync();
                                    // Assign the choices to the savedResult for returning
                                    savedResult.Result.QuizAttemptAnswerChoices = attemptAnswerChoices;
                                    // Mapping the result to DTO, so that EF navigation properties are not exposed
                                    result.Result = _mapper.Map<QuizAttemptAnswerDTO>(savedResult.Result);

                                }
                            }
                            else
                            {
                                result.Message = string.Format(ResponseMessage.MESSAGE_ITEM_NOT_FOUND, "question in quiz snapshot", newEntity.SnapShotQuestionId);
                            }
                        }
                        else
                        {
                            result.Message = string.Format(ResponseMessage.MESSAGE_ITEM_NOT_FOUND, "questions in quiz snapshot", newEntity.QuizAttemptId);
                        }

                    }
                    else
                    {
                        result.Message = string.Format(ResponseMessage.MESSAGE_ITEM_EXIST, "Answer for this question");
                    }
                    
                }
                else
                {
                    result.Message = string.Format(ResponseMessage.MESSAGE_ITEM_NOT_FOUND, "quiz attempt", newEntity.QuizAttemptId);
                }

            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);
            }
            return result;
        }
    }
}
