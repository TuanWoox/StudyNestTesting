using AutoMapper;
using StudyNest.Common.Attributes;
using StudyNest.Common.DbEntities.BaseEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace StudyNest.Common.Models.DTOs.EntityDTO.Tag
{
    [AutoMap(typeof(DbEntities.Entities.Tag), ReverseMap = true, PreserveReferences = true)]
    public class UpdateTagDTO: BaseKey
    {
        [TrimmedRequired]
        public string Name { get; set; }
    }
}
