using AutoMapper;
using StudyNest.Common.DbEntities.BaseEntity;
using StudyNest.Common.DbEntities.Entities;
using StudyNest.Common.Interfaces;
using StudyNest.Common.Models.DTOs.EntityDTO.Quizzes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudyNest.Common.Models.DTOs.EntityDTO.QuizAttemptSnapshot
{
    [AutoMap(typeof(DbEntities.Entities.QuizAttemptSnapshot), ReverseMap = true, PreserveReferences = true)]
    public class QuizAttemptSnapshotDTO: BaseEntity<string>, IMapFrom<DbEntities.Entities.QuizAttemptSnapshot>
    {
        [Required]
        public string QuizId { get; set; }

        public string QuizQuestions { get; set; }
        public List<Question.QuestionDTO>? QuizQuestionsParsed { get; set; } = new List<Question.QuestionDTO>();
        
    }
}
