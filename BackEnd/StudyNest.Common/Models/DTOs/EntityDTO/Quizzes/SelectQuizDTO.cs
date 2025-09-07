using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudyNest.Common.Models.DTOs.EntityDTO.Quizzes
{
    public  class SelectQuizDTO
    {
        public string Title { get; set; }
        public List<QuizQuestionDTO> Questions { get; set; } = new();

    }
    public class QuizQuestionDTO
    {
        public string Text { get; set; }
        public string Type { get; set; }
        public List<string> Choices { get; set; } = new();
        public int? CorrectIndex { get; set; }
        public bool? CorrectTrueFalse { get; set; }
        public string Explanation { get; set; } = string.Empty;
    }

}
