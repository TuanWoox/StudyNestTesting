using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudyNest.Common.Utils.Enums
{
    public enum StudyNestDateTimeFilterOperator
    {
        IsBefore,
        IsBeforeOrEqual,
        IsAfter,
        IsAfterOrEqual,
        IsEqualTo,
        IsNotEqualTo,
        Between,
        Quarter
    }
}
