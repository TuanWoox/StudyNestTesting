using StudyNest.Common.DbEntities.BaseEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudyNest.Common.DbEntities.Entities
{
    public class NoteTag: BaseEntity<string>
    {
        public string NoteId { get; set; }
        public Note Note { get; set; }
        public string TagId { get; set; }
        public Tag Tag { get; set; }
    }
}
