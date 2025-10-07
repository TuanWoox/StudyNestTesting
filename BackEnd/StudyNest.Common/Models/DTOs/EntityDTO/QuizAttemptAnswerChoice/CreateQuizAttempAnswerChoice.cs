using StudyNest.Common.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudyNest.Common.Models.DTOs.EntityDTO.QuizAttemptAnswerChoice
{
    public class CreateQuizAttempAnswerChoice
    {
        [TrimmedRequired]
        public string ChoiceId { get; set; }
    }
}
