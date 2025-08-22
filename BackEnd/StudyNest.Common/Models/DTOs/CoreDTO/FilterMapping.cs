using StudyNest.Common.Utils.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudyNest.Common.Models.DTOs.CoreDTO
{
    public class FilterMapping : ICloneable
    {
        public string Prop { get; set; }
        public object Value { get; set; }
        public object FilterOperator { get; set; }
        public StudyNestFilterType FilterType { get; set; } = StudyNestFilterType.Text;
        public string DynamicProperty { get; set; }
        public string Delimiter { get; set; }

        public object Clone()
        {
            return MemberwiseClone();
        }
    }
}
