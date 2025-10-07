using StudyNest.Common.DbEntities.BaseEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudyNest.Common.DbEntities.Entities
{
    public class QuizAttempAnswerChoice: BaseEntity<string>
    {
        public QuizAttemptAnswer QuizAttemptAnswer { get; set; }
        public string ChoiceId { get; set; }
    }
}
