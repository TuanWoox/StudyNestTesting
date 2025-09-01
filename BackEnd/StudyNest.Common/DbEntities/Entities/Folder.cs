using StudyNest.Common.DbEntities.BaseEntity;
using StudyNest.Common.DbEntities.Identities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudyNest.Common.DbEntities.Entities
{
    public class Folder: BaseEntity<string>
    {
        [Required]
        public string FolderName { get; set; }
        public string OwnerId { get; set; }
        public ApplicationUser Owner { get; set; }
        public ICollection<Note> Notes { get; set; } = new List<Note>();
    }
}
