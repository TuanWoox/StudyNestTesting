using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;
using StudyNest.Common.DbEntities.Entities;
using StudyNest.Common.Interfaces;
using StudyNest.Common.Models.DTOs.CoreDTO;
using StudyNest.Common.Models.DTOs.EntityDTO.Question;
using StudyNest.Common.Models.DTOs.EntityDTO.QuizAttemptSnapshot;
using StudyNest.Common.Models.DTOs.ViewDTO.QuizStatistic;
using StudyNest.Common.Utils.Extensions;
using StudyNest.Common.Utils.Helper;
using StudyNest.Data;
using System.Text.Json;

namespace StudyNest.Business.v1
{
    public class QuizStatisticsBusiness: IQuizStatisticsBusiness
    {
        ApplicationDbContext _context;
        IMapper _mapper;
        public QuizStatisticsBusiness(ApplicationDbContext context, IMapper mapper)
        {
            this._context = context;
            this._mapper = mapper;
        }
        public async Task<ReturnResult<QuizStatisticsDTO>> GetOneById(string quizId, DateFilter dateFilter)
        {
            ReturnResult<QuizStatisticsDTO> result = new ReturnResult<QuizStatisticsDTO>();
            try
            {
                if (dateFilter == null || dateFilter.DateFrom == null || dateFilter.DateTo == null || dateFilter.DateTo > dateFilter.DateFrom.Value.AddMonths(1))
                {
                    result.Message = "DateFilter is invalid";
                    return result;
                }

                var existingQuiz = await _context.Quizzes.Where(q => q.Id == quizId)
                                                          .Include(q => q.QuizAttemptSnapshots)
                                                         .ThenInclude(x => x.QuizAttempts.Where(at =>
                                                          at.DateCreated >= dateFilter.DateFrom.Value.AddDays(-1) &&
                                                          at.DateCreated <= dateFilter.DateTo.Value.AddDays(1)))
                                                          .ThenInclude(x => x.QuizAttemptAnswers)
                                                          .AsNoTracking()
                                                          .FirstOrDefaultAsync();
                if (existingQuiz != null)
                {

                    var quizStats = new QuizStatisticsDTO
                    {
                        QuizId = existingQuiz.Id,
                        QuizTitle = existingQuiz.Title
                    };

                    // Choose snapshots that have quiz attempts
                    var snapshots = existingQuiz.QuizAttemptSnapshots.Where(s => s.QuizAttempts.Any()).Select(s => new
                    {
                        s.QuizAttempts,
                        Questions = JsonSerializer.Deserialize<List<QuestionDTO>>(s.QuizQuestions),
                        s.DateCreated
                    }).ToList();
                    var totalQuestions = snapshots.Sum(s => s.Questions?.Count()) ?? 0;
                    var allAttempts = snapshots.SelectMany(s => s.QuizAttempts).OrderBy(a => a.DateCreated).ToList();
                    var allScores = allAttempts.Select(a => a.Score).ToList();
                    List<QuizScore> allScoresList = allAttempts.Select(a => new QuizScore
                    {
                        DateCreated = a.DateCreated,
                        Score = a.Score
                    }).ToList();
                    // Attempt Summary
                    var totalRight = allAttempts.SelectMany(a => a.QuizAttemptAnswers).Count(ans => ans.IsCorrect);

                    var questionErrorCounts = allAttempts.SelectMany(at => at.QuizAttemptAnswers)
                                                        .Where(a => !a.IsCorrect && a.QuizAttempt != null)
                                                        .GroupBy(a => new { a.SnapshotQuestionId, SnapshotId = a.QuizAttempt.QuizAttemptSnapshotId })
                                                        .Select(g => new QuestionErrorCount
                                                        {
                                                            Question = snapshots.Where(s => s.QuizAttempts?.Any(qa => qa.Id == g.First().QuizAttemptId) ?? false)
                                                                                .OrderBy(s => s)
                                                                                .SelectMany(s => s.Questions ?? new List<QuestionDTO>())
                                                                                .FirstOrDefault(q => q.Id == g.Key.SnapshotQuestionId) ?? new QuestionDTO(),
                                                            WrongCounts = g.Count()
                                                        })
                                                        .ToList();


                    quizStats.AttemptSummary = new QuizAttemptSummaryDTO
                    {
                        TotalAttempts = allAttempts.Count,
                        Scores = allScoresList,
                        TotalRightQuestion = totalRight,
                        TotalWrongQuestion = totalQuestions - totalRight,
                        QuestionErrorCounts = questionErrorCounts

                    };
                    //Score Statistics
                    quizStats.ScoreStatistics = new QuizScoreStatisticsDTO
                    {
                        AverageScore = allScores.DefaultIfEmpty(0).Average(),
                        BestScore = allScores.DefaultIfEmpty(0).Max(),
                        WorstScore = allScores.DefaultIfEmpty(0).Min(),
                        LatestScore = allAttempts.LastOrDefault()?.Score ?? 0,
                    };

                    result.Result = quizStats;
                }
                else
                {
                    result.Message = string.Format(ResponseMessage.MESSAGE_ITEM_NOT_FOUND, "quiz", quizId);
                }
            }
            catch(Exception ex)
            {
                result.Message = ex.Message;
                StudyNestLogger.Instance.Error(ex);
            }
            return result;
        }
    }
}
