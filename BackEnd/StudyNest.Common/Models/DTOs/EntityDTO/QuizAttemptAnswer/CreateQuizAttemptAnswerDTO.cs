using StudyNest.Common.Attributes;
using StudyNest.Common.Models.DTOs.EntityDTO.QuizAttemptAnswerChoice;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudyNest.Common.Models.DTOs.EntityDTO.QuizAttemptAnswer
{
    public class CreateQuizAttemptAnswerDTO
    {
        public string QuizAttemptId { get; set; }
        [TrimmedRequired]
        public string SnapShotQuestionId { get; set; }
        [Required]
        public List<CreateQuizAttemptAnswerChoice> QuizAttemptAnswerChoices { get; set; }
    }
}
