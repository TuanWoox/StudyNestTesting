using Hangfire;
using Hangfire.Storage;
using Hangfire.Storage.Monitoring;
using Microsoft.EntityFrameworkCore;
using StudyNest.Common.Interfaces;
using StudyNest.Common.Models.DTOs.CoreDTO;
using StudyNest.Common.Models.DTOs.EntityDTO.Quizzes;
using StudyNest.Common.Utils.Enums;
using StudyNest.Common.Utils.Extensions;
using StudyNest.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudyNest.Business.v1
{
    public class QuizJobBusiness : IQuizJobBusiness
    {
        private readonly IMonitoringApi _api = JobStorage.Current.GetMonitoringApi();
        private readonly IUserContext _userContext;
        private readonly ApplicationDbContext _context;
        public QuizJobBusiness(IUserContext userContext, ApplicationDbContext context)
        {
            _userContext = userContext;
            _context = context;
        }
        public async Task<ReturnResult<List<QuizJobDTO>>> GetProcessingQuizJob()
        {
            var rs = new ReturnResult<List<QuizJobDTO>>();
            try
            {
                var jobs = await _context.QuizJobs
                    .AsNoTracking()
                    .Where(x => x.UserId == _userContext.UserId &&
                               (x.Status == QuizJobStatus.Queued || x.Status == QuizJobStatus.Processing))
                    .OrderByDescending(x => x.DateCreated)
                    .Take(10)
                    .Select(x => new QuizJobDTO
                    {
                        JobId = x.Id,
                        UserId = x.UserId,
                        NoteTitle = x.NoteTitle,
                        Status = "processing",
                        Timestamp = (x.DateCreated ?? DateTimeOffset.UtcNow).ToString("o"),
                        CreatedAt = (x.DateCreated ?? DateTimeOffset.UtcNow).DateTime
                    })
                    .ToListAsync();

                rs.Result = jobs;
            }
            catch (Exception ex)
            {
                rs.Result = new List<QuizJobDTO>();
                rs.Message = "Unable to fetch processing jobs.";
                StudyNestLogger.Instance.Error(ex);
            }

            return rs;
        }

        public async Task<ReturnResult<List<QuizJobDTO>>> GetRecentQuizJob(long sinceEpochMs)
        {
            var rs = new ReturnResult<List<QuizJobDTO>>();
            try
            {
                var since = DateTimeOffset.FromUnixTimeMilliseconds(sinceEpochMs);

                var jobs = await _context.QuizJobs
                    .AsNoTracking()
                    .Where(x => x.UserId == _userContext.UserId &&
                               (x.Status == QuizJobStatus.Success || x.Status == QuizJobStatus.Failed) &&
                               x.DateModified >= since)
                    .OrderByDescending(x => x.DateModified)
                    .Take(10)
                    .Select(x => new QuizJobDTO
                    {
                        JobId = x.Id,
                        UserId = x.UserId,
                        NoteTitle = x.NoteTitle,
                        Status = x.Status == QuizJobStatus.Success ? "success" : "error",
                        QuizId = x.ResultQuizId,
                        ErrorMessage = x.ErrorMessage,
                        Timestamp = (x.DateModified ?? DateTimeOffset.UtcNow).ToString("o"),
                        CreatedAt = (x.DateModified ?? DateTimeOffset.UtcNow).DateTime
                    })
                    .ToListAsync();

                rs.Result = jobs;
            }
            catch (Exception ex)
            {
                rs.Result = new List<QuizJobDTO>();
                rs.Message = "Unable to fetch recent jobs.";
                StudyNestLogger.Instance.Error(ex);
            }

            return rs;
        }
    }

}
