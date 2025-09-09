using StudyNest.Common.DbEntities.BaseEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace StudyNest.Common.DbEntities.Entities
{
    public class NoteTag: IModified, IDeleted, ICreated
    {
        public string NoteId { get; set; }
        public Note Note { get; set; }
        public string TagId { get; set; }
        public Tag Tag { get; set; }
        public DateTimeOffset? DateCreated { get; set; }
        public DateTimeOffset? DateModified { get; set; }
        public bool Deleted { get; set; }
        public DateTimeOffset? DateDeleted { get; set; }
    }
}
