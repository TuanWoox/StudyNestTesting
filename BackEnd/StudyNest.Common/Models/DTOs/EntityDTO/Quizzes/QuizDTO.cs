using StudyNest.Common.DbEntities.Entities;
using StudyNest.Common.Interfaces;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudyNest.Common.Models.DTOs.EntityDTO.Quizzes
{
    public class QuizDTO : IMapFrom<Quiz>
    {
        [Required]
        public string Id { get; set; }
        [Required]
        public string Title { get; set; }
        public int TotalQuestion { get; set; }
        public DateTime? DateCreated { get; set; }
    }
}
