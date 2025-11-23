using StudyNest.Common.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudyNest.Common.Models.DTOs.EntityDTO.FeedBack
{
    public class UpdateFeedBackDTO
    {
        [TrimmedRequired]
        public string Id { get; set; }
        public int Rating { get; set; } = 0;
        [TrimmedRequired]
        public string Category { get; set; }
        [TrimmedRequired]
        public string Description { get; set; }
    }
}
