using AutoMapper;
using StudyNest.Common.DbEntities.BaseEntity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudyNest.Common.Models.DTOs.EntityDTO.Choice
{
    [AutoMap(typeof(DbEntities.Entities.Choice), ReverseMap = true, PreserveReferences = true)]
    public class ChoiceDTO: BaseEntity<string>
    {
        [Required]
        public string QuestionId { get; set; } = string.Empty;
        public string Text { get; set; } = string.Empty;
        public bool IsCorrect { get; set; }
    }
}
