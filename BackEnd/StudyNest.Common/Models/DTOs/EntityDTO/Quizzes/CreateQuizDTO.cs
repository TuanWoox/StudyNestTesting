using Microsoft.AspNetCore.Antiforgery;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudyNest.Common.Models.DTOs.EntityDTO.Quizzes
{
    public class CreateQuizDTO
    {
        [Required]
        public string Note { get; set; } = string.Empty;
        [Required]
        public int Count_Mcq { get; set; } = 5;
        [Required]
        public int Count_Tf { get; set; } = 5;
        public string Difficulty { get; set; } = "medium";
    }
}
