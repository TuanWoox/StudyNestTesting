using AutoMapper;
using StudyNest.Common.DbEntities.BaseEntity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudyNest.Common.Models.DTOs.EntityDTO.Setting
{
    [AutoMap(typeof(DbEntities.Entities.Setting), ReverseMap = true, PreserveReferences = true)]
    public class SelectSettingDTO: BaseEntity<string>
    {
        [Required]
        public string Key { get; set; }
        [Required]
        public string Group { get; set; }
        [Required]
        public string Value { get; set; }
        public string Description { get; set; }
        public int SettingLevel { get; set; }
    }
}
