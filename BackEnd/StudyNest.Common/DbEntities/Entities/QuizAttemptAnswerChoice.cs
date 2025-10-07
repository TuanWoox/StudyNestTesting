using StudyNest.Common.DbEntities.BaseEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudyNest.Common.DbEntities.Entities
{
    public class QuizAttemptAnswerChoice: BaseEntity<string>
    {
        public string QuizAttemptAnswerId { get; set; }
        public QuizAttemptAnswer QuizAttemptAnswer { get; set; }
        public string ChoiceId { get; set; }
    }
}
