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
    [Table("Questions")]
    public class Question : BaseEntity<string>
    {
        [Required]
        public string QuizId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;  // mcq/msq/tf
        public string Explanation { get; set; } = string.Empty;
        public Quiz? Quiz { get; set; }
        public string? ImageUrl { get; set; } = string.Empty;
        public ICollection<Choice> Choices { get; set; } = new List<Choice>();
    }
}
