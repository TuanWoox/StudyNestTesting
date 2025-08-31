using StudyNest.Common.DbEntities.BaseEntity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudyNest.Common.DbEntities.Entities
{
    [Table("Quizzes")]
    public class Quiz : BaseEntity <string>
    {
        [Required]
        public string Title { get; set; } = string.Empty;
        [Required]
        public string CreatedBy { get; set; } = string.Empty;
        public ICollection<Question> Questions { get; set; } = new List<Question>();

    }
}
