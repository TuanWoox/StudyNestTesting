using StudyNest.Common.Models.DTOs.EntityDTO.Quizzes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudyNest.Common.Interfaces
{
    public interface ILlmClient
    {
        Task<string> GenerateAsync(string prompt, IReadOnlyList<string> imageUrls);
    }
}
