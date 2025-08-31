using StudyNest.Common.Models.DTOs.EntityDTO.Quiz;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudyNest.Common.Interfaces
{
    public interface ILlmQuizGenerator
    {
        Task<SelectQuizDTO> GenerateAsync(CreateQuizDTO request);

    }
}
