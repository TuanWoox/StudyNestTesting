using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudyNest.Common.Models.DTOs.EntityDTO.Quiz
{
    public class QuizDTO
    {
        [Required]
        public string Id { get; set; }
        [Required]
        public string Title { get; set; }
        public int TotalQuestion { get; set; }
        public DateTime? DateCreated { get; set; }
    }
}
