using AutoMapper;
using StudyNest.Common.DbEntities.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudyNest.Common.Models.DTOs.EntityDTO.QuizAttemptSnapshot
{
    [AutoMap(typeof(DbEntities.Entities.QuizAttemptSnapshot), ReverseMap = true, PreserveReferences = true)]
    public class QuizAttemptSnapshotDTO
    {
        [Required]
        public string QuizId { get; set; }

        public Quiz Quiz { get; set; }

        //This store a snapshot of the quiz questions at the time of the attempt
        [Column(TypeName = "jsonb")]
        public string QuizQuestions { get; set; }
    }
}
