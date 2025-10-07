using AutoMapper;
using StudyNest.Common.DbEntities.BaseEntity;
using StudyNest.Common.DbEntities.Entities;
using StudyNest.Common.Models.DTOs.EntityDTO.QuizAttemptAnswerChoice;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudyNest.Common.Models.DTOs.EntityDTO.QuizAttemptAnswer
{
    [AutoMap(typeof(DbEntities.Entities.QuizAttemptAnswer), ReverseMap = true, PreserveReferences = true)]
    public class QuizAttemptAnswerDTO: BaseEntity<string>
    {
        [Required]
        public string QuizAttemptId { get; set; }
        [Required]
        public string SnapshotQuestionId { get; set; }
        public bool IsCorrect { get; set; }
        public List<QuizAttemptAnswerChoiceDTO> QuizAttemptAnswerChoices { get; set; } = new List<QuizAttemptAnswerChoiceDTO>();
    }
}
