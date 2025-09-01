using AutoMapper;
using StudyNest.Common.DbEntities.BaseEntity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudyNest.Common.Models.DTOs.EntityDTO.Folder
{
    [AutoMap(typeof(DbEntities.Entities.Folder), ReverseMap = true, PreserveReferences = true)]
    public class UpdateFolderDTO: BaseKey
    {
        [Required]
        public string FolderName { get; set; }
    }
}
