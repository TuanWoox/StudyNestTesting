using StudyNest.Common.Models.DTOs.CoreDTO;
using StudyNest.Common.Models.DTOs.EntityDTO.QuizAttemptAnswer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudyNest.Common.Interfaces
{
    public interface IQuizAttemptAnswerBusiness
    {
        public Task<ReturnResult<QuizAttemptAnswerDTO>> CreateQuizAttemptAnswer(CreateQuizAttemptAnswerDTO newEntity);
    }
}
