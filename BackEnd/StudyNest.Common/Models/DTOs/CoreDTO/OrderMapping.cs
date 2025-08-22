using StudyNest.Common.Utils.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudyNest.Common.Models.DTOs.CoreDTO
{
    public class OrderMapping : ICloneable
    {
        public string Sort { get; set; }
        public SortOrderType SortDir { get; set; }
        public string DynamicProperty { get; set; }
        public string Delimiter { get; set; }
        public string DataType { get; set; }
        public object Clone()
        {
            return MemberwiseClone();
        }
    }
}
