using AutoMapper;
using StudyNest.Common.DbEntities.BaseEntity;
using StudyNest.Common.DbEntities.Entities;
using StudyNest.Common.DbEntities.Identities;
using StudyNest.Common.Models.DTOs.EntityDTO.QuizAttemptAnswer;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudyNest.Common.Models.DTOs.EntityDTO.QuizAttempt
{
    [AutoMap(typeof(DbEntities.Entities.QuizAttempt), ReverseMap = true, PreserveReferences = true)]
    public class QuizAttemptDTO: BaseEntity<string>
    {
        [Required]
        public string QuizId { get; set; }
        [Required]
        public string UserId { get; set; }
        [Required]
        public string QuizAttemptSnapshotId { get; set; }
        public QuizAttemptAnswerDTO QuizAttemptSnapshot { get; set; }
        public DateTimeOffset EndTime { get; set; }
        public int Score { get; set; }
        public bool IsCompleted { get; set; }
        public List<QuizAttemptAnswerDTO> QuizAttemptAnswers { get; set; } = new List<QuizAttemptAnswerDTO>();
    }
}
