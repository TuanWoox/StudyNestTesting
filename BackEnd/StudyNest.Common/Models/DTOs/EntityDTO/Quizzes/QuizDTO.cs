using AutoMapper;
using StudyNest.Common.DbEntities.BaseEntity;
using StudyNest.Common.DbEntities.Entities;
using StudyNest.Common.DbEntities.Identities;


namespace StudyNest.Common.Models.DTOs.EntityDTO.Quizzes
{
    [AutoMap(typeof(DbEntities.Entities.Quiz), ReverseMap = true, PreserveReferences = true)]
    public class QuizDTO: BaseEntity<string>
    {
        public string Title { get; set; } = string.Empty;
        public string Difficulty { get; set; } = "medium";
        public string OwnerId { get; set; }
        public ApplicationUserDTO Owner { get; set; }
        public string? NoteId { get; set; }
        public DbEntities.Entities.Note? Note { get; set; }
        public bool IsBeingConvertToSnapShot { get; set; } = false;
        public bool IsPublic { get; set; } = false;
        public string? FriendlyURL { get; set; } = string.Empty;
        public ICollection<DbEntities.Entities.Question> Questions { get; set; } = new List<DbEntities.Entities.Question>();
        public ICollection<DbEntities.Entities.QuizAttemptSnapshot> QuizAttemptSnapshots { get; set; } = new List<DbEntities.Entities.QuizAttemptSnapshot>();
        public ICollection<QuizStar> QuizStars { get; set; } = new List<QuizStar>();
    }

    [AutoMap(typeof(ApplicationUser), ReverseMap = true, PreserveReferences = true)]
    public class ApplicationUserDTO
    {
        public string Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
    }
}
