using AutoMapper;
using StudyNest.Common.DbEntities.BaseEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudyNest.Common.Models.DTOs.EntityDTO.QuizAttemptAnswerChoice
{
    [AutoMap(typeof(DbEntities.Entities.QuizAttemptAnswerChoice), ReverseMap = true, PreserveReferences = true)]
    public class QuizAttemptAnswerChoiceDTO: BaseEntity<string>
    {
        public string QuizAttemptAnswerId { get; set; }
        public string ChoiceId { get; set; }
    }
}
