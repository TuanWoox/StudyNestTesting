using AutoMapper;
using StudyNest.Common.DbEntities.BaseEntity;
using StudyNest.Common.DbEntities.Entities;
using StudyNest.Common.DbEntities.Identities;
using System.Text.Json.Serialization;

namespace StudyNest.Common.Models.DTOs.EntityDTO.Folder
{
    [AutoMap(typeof(DbEntities.Entities.Folder), ReverseMap = true, PreserveReferences = true)]
    public class SelectFolderDTO: BaseEntity<string>
    {
        public string FolderName { get; set; }
        public string OwnerId { get; set; }
        public ICollection<DbEntities.Entities.Note> Notes { get; set; } = new List<DbEntities.Entities.Note>();
    }
}
