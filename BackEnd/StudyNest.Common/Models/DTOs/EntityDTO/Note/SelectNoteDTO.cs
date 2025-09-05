using AutoMapper;
using StudyNest.Common.DbEntities.BaseEntity;
using StudyNest.Common.DbEntities.Entities;
using StudyNest.Common.DbEntities.Identities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace StudyNest.Common.Models.DTOs.EntityDTO.Note
{
    [AutoMap(typeof(DbEntities.Entities.Note), ReverseMap = true, PreserveReferences = true)]
    public class SelectNoteDTO: BaseEntity<string>
    {
        [Required]
        public string Title { get; set; }
        [Required]
        public string Content { get; set; }
        [Required]
        public string Status { get; set; }
        // Mapping to owner
        public string OwnerId { get; set; }
        public ApplicationUser Owner { get; set; }
        //Mapping to Folder
        public string FolderId { get; set; }
        public DbEntities.Entities.Folder Folder { get; set; }
        //Mapping to Tags
        public ICollection<NoteTag> NoteTags { get; set; } = new List<NoteTag>();
    }
}
