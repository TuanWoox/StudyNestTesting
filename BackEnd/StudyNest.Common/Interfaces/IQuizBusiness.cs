using StudyNest.Common.DbEntities.Entities;
using StudyNest.Common.Models.DTOs.CoreDTO;
using StudyNest.Common.Models.DTOs.EntityDTO.Quiz;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices.JavaScript;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace StudyNest.Common.Interfaces
{
    public interface IQuizBusiness
    {
        Task<ReturnResult<List<QuizDTO>>> GetAllQuiz();
        Task<ReturnResult<Quiz>> GetQuizDetail(string id);
        Task<ReturnResult<SelectQuizDTO>> GenerateAsync(CreateQuizDTO prompt);
    }
}
    