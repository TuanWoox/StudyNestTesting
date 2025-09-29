using AutoMapper;
using StudyNest.Common.Attributes;
using StudyNest.Common.DbEntities.BaseEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudyNest.Common.Models.DTOs.EntityDTO.Setting
{
    [AutoMap(typeof(DbEntities.Entities.Setting), ReverseMap = true, PreserveReferences = true)]
    public class UpdateSettingDTO: BaseKey
    {
        [TrimmedRequired]
        public string Key { get; set; }
        [TrimmedRequired]
        public string Group { get; set; }
        [TrimmedRequired]
        public string Value { get; set; }
        public string Description { get; set; }
        public int SettingLevel { get; set; }
    }
}
