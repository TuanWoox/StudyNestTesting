using StudyNest.Common.DbEntities.BaseEntity;
using StudyNest.Common.Utils.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudyNest.Common.DbEntities.Entities
{
    public class QuizJob : BaseEntity<string>
    {
        [Required]
        public string UserId { get; set; }

        [Required]
        public string NoteId { get; set; }

        public string NoteTitle { get; set; }

        public string? HangfireJobId { get; set; }

        public QuizJobStatus Status { get; set; } = QuizJobStatus.Queued;

        public string? ResultQuizId { get; set; }

        public string? ErrorMessage { get; set; }
    }
}
