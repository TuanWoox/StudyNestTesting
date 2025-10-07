using AutoMapper;
using StudyNest.Common.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudyNest.Common.Models.DTOs.EntityDTO.QuizAttempt
{
    public class CreateQuizAttemptDTO
    {
        [TrimmedRequired]
        public string QuizId { get; set; }
        
        [Range(1, 60, ErrorMessage = "Duration must be between 1 and 60 minutes.")]
        public int DurationInMinutes { get; set; } = 0; // 0 means no time limit
    }
}
