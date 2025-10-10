using AutoMapper;
using StudyNest.Common.DbEntities.BaseEntity;
using StudyNest.Common.Models.DTOs.EntityDTO.Choice;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudyNest.Common.Models.DTOs.EntityDTO.Question
{
    [AutoMap(typeof(DbEntities.Entities.Question), ReverseMap = true, PreserveReferences = true)]
    public class QuestionDTO: BaseEntity<string>
    {
        public string QuizId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;  // mcq/msq/tf
        public string Explanation { get; set; } = string.Empty;
        public List<ChoiceDTO> Choices { get; set; }
    }
}
