using StudyNest.Common.DbEntities.BaseEntity;
using StudyNest.Common.DbEntities.Identities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace StudyNest.Common.DbEntities.Entities
{
    public class QuizStar: BaseEntity<string>
    {
        public string UserId { get; set; }
        [JsonIgnore]
        public ApplicationUser User { get; set; }
        public string QuizId { get; set; }
        public Quiz Quiz { get; set; }
    }
}
