using StudyNest.Common.DbEntities.BaseEntity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudyNest.Common.DbEntities.Entities
{
    public class QuizAttemptAnswer: BaseEntity<string>
    {
        [Required]
        public string QuizAttemptId { get; set; }
        public QuizAttempt QuizAttempt { get; set; }
        //Store reference to the snapshot question id to avoid issues if the question is deleted or modified later
        [Required]
        public string SnapshotQuestionId { get; set; }
        public bool IsCorrect { get; set; }
        public ICollection<QuizAttempAnswerChoice> QuizAttemptAnswerChoices { get; set; } = new List<QuizAttempAnswerChoice>();

    }
}
