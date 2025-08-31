using StudyNest.Common.Models.DTOs.EntityDTO.Quiz;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudyNest.Business.Services.Llm.Abtractions
{
    public interface ILlmClient
    {
        Task<string> GenerateAsync(string prompt, IReadOnlyList<string> imageUrls);
    }
}
