using StudyNest.Common.DbEntities.Entities;
using StudyNest.Common.Models.DTOs.CoreDTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudyNest.Common.Interfaces
{
    public interface IQuizAttemptSnapshotBusiness
    {
        public Task<ReturnResult<QuizAttemptSnapshot>> CreateSnapShot(string quizId);
    }
}
