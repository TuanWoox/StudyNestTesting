using StudyNest.Common.DbEntities.BaseEntity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudyNest.Common.DbEntities.Entities
{
    [Table("Choices")]
    public class Choice : BaseEntity<string>
    {
        public string? QuestionId { get; set; }  // FK → Question
        public string Text { get; set; } = string.Empty;
        public int OrderNo { get; set; }

        // Navigation
        public Question? Question { get; set; }
    }
}
