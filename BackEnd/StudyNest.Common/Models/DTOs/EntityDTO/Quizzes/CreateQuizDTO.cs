using Microsoft.AspNetCore.Antiforgery;
using StudyNest.Common.Attributes;
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
        [TrimmedRequired]
        public string NoteId { get; set; } = string.Empty;
        public int Count_Mcq { get; set; } = 5;
        public int Count_Tf { get; set; } = 5;
        public int Count_Msq { get; set; } = 5;
        public string Language { get; set; } = "English";
        public string Difficulty { get; set; } = "medium";
        public string NoteContent { get; set; } = "";
    }
}
