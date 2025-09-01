using StudyNest.Common.DbEntities.BaseEntity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudyNest.Common.DbEntities.Entities
{
    public class Setting: BaseEntity<string>
    {
        [Required]
        public string Key { get; set; }
        [Required]
        public string Value { get; set; }
        public string Description { get; set; }
        public int SettingLevel { get; set; }
    }
}
