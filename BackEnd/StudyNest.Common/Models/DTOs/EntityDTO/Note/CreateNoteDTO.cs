using AutoMapper;
using StudyNest.Common.Attributes;
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
    public class CreateNoteDTO: BaseKey
    {
        [TrimmedRequired]
        public string Title { get; set; }
        [TrimmedRequired]
        public string Content { get; set; }
        [TrimmedRequired]
        public string Status { get; set; }
        [Trim]
        public string FolderId { get; set; }
        [TrimList]
        [KebabCase]
        public List<string> TagsNames { get; set; } = new List<string>();
        public string OwnerId { get; set; }
    }
}
