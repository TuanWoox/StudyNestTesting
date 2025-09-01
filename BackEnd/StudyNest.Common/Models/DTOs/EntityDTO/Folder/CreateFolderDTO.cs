using AutoMapper;
using StudyNest.Common.DbEntities.BaseEntity;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace StudyNest.Common.Models.DTOs.EntityDTO.Folder
{
    [AutoMap(typeof(DbEntities.Entities.Folder), ReverseMap = true, PreserveReferences = true)]
    public class CreateFolderDTO: BaseKey
    {
        [Required]
        public string FolderName { get; set; }
        public string OwnerId { get; set; }
    }
}
