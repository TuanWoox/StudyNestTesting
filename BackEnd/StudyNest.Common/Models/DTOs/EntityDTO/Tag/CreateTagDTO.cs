using AutoMapper;
using StudyNest.Common.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudyNest.Common.Models.DTOs.EntityDTO.Tag
{
    [AutoMap(typeof(DbEntities.Entities.Tag), ReverseMap = true, PreserveReferences = true)]
    public class CreateTagDTO
    {
        [TrimmedRequired]
        public string Name { get; set; }
    }
}
