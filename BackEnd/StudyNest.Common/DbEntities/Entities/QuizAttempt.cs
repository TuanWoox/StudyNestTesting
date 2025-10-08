using StudyNest.Common.DbEntities.BaseEntity;
using StudyNest.Common.DbEntities.Identities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudyNest.Common.DbEntities.Entities
{
    public class QuizAttempt: BaseEntity<string>
    {
        [Required]
        public string QuizId { get; set; }
        public Quiz Quiz { get; set; }
        [Required]
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }
        [Required]
        public string QuizAttemptSnapshotId { get; set; }
        public QuizAttemptSnapshot  QuizAttemptSnapshot { get; set; }
        public DateTimeOffset EndTime { get; set; }
        public int Score { get; set; }
        public bool IsCompleted { get; set; }
        //Store draft answers as json in case the user wants to resume later and it supports for us to implement background job to auto save and calculate score
        [Column(TypeName = "jsonb")]
        public string DraftAnswers { get; set; }
        public ICollection<QuizAttemptAnswer> QuizAttemptAnswers { get; set; } = new List<QuizAttemptAnswer>();
    }
}
