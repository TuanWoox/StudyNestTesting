using StudyNest.Common.DbEntities.BaseEntity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudyNest.Common.DbEntities.Entities
{
    public class Tag: BaseEntity<string>
    {
        [Required]
        public string Name { get; set; }
        //Mappping to Notes
        public ICollection<NoteTag> NoteTags { get; set; } = new List<NoteTag>();

    }
}
