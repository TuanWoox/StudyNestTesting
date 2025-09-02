using StudyNest.Common.Models.Paging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudyNest.Common.Models.DTOs.EntityDTO.Tag
{
    public class PageTag
    {
        public Page<string> page { get; set; }
        public bool OwnData { get; set; }
    }
}
