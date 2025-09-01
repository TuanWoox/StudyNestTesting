using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using StudyNest.Common.DbEntities.BaseEntity;
using StudyNest.Common.DbEntities.Entities;
using StudyNest.Common.DbEntities.Identities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudyNest.Data
{
    public partial class ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, string, IdentityUserClaim<string>,
    ApplicationUserRole, IdentityUserLogin<string>, IdentityRoleClaim<string>, IdentityUserToken<string>>
    {
        public DbSet<Note> Notes { get; set; }
        public DbSet<Folder> Folders { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<NoteTag> NoteTags { get; set; }
        public DbSet<Quiz> Quizzes { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<Choice> Choices { get; set; }
        public DbSet<Setting> Settings { get; set; }
        public DbSet<ImageToDelete> ImageToDeletes { get; set; }
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {


        }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            //Add Global Query Filters for Soft Delete
            foreach (var entityType in builder.Model.GetEntityTypes())
            {
                if (typeof(IDeleted).IsAssignableFrom(entityType.ClrType))
                {
                    entityType.AddSoftDeleteQueryFilter();
                }
            }
            #region Configure ASP.NET Relationships
            // One note can belong to one user, one user can have many notes
            builder.Entity<Note>()
                .HasOne(n => n.Owner)
                .WithMany(u => u.Notes)
                .HasForeignKey(n => n.OwnerId)
                .IsRequired();
            // One note can belong to zero -> one folder, one folder can have 0 -> many notes
            builder.Entity<Note>()
                .HasOne(n => n.Folder)
                .WithMany(f => f.Notes)
                .HasForeignKey(n => n.FolderId)
                .IsRequired(false);
            // Configure the Content property to be stored as JSONB
            builder.Entity<Note>()
                .Property(n => n.Content)
                .HasColumnType("jsonb");
            //One fodcan belong to one user, one user can have many folders
            builder.Entity<Folder>()
                .HasOne(f => f.Owner)
                .WithMany(u => u.Folders)
                .HasForeignKey(f => f.OwnerId)
                .IsRequired();
            //Many-to-Many relationship between Note and Tag via NoteTag
            builder.Entity<NoteTag>(noteTag =>
            {
                noteTag.HasKey(nt => new { nt.NoteId, nt.TagId });
                noteTag.HasOne(nt => nt.Note)
                       .WithMany(n => n.NoteTags)
                       .HasForeignKey(nt => nt.NoteId)
                       .IsRequired();
                noteTag.HasOne(nt => nt.Tag)
                       .WithMany(t => t.NoteTags)
                       .HasForeignKey(nt => nt.TagId)
                       .IsRequired();
            });
            //Many-to-Many relationship between ApplicationUser and ApplicationRole via ApplicationUserRole
            builder.Entity<ApplicationUserRole>(userRole =>
            {
                userRole.HasKey(ur => new { ur.UserId, ur.RoleId });

                userRole.HasOne(ur => ur.User)
                        .WithMany(u => u.UserRoles)
                        .HasForeignKey(ur => ur.UserId)
                        .IsRequired();

                userRole.HasOne(ur => ur.Role)
                        .WithMany(r => r.UserRoles)
                        .HasForeignKey(ur => ur.RoleId)
                        .IsRequired();
            });
            #endregion
        }
        public async Task<int> SaveChangesAsync(bool populatedICreated = true, bool populatedIModified = true, CancellationToken cancellationToken = default)
        {
            var auditEntries = ChangeTracker.Entries().Where(x => x.State != EntityState.Unchanged).ToList();
            foreach (var change in auditEntries)
            {
                switch (change.State)
                {
                    case EntityState.Added:
                        if (change.Entity is ICreated createdEntry && populatedICreated)
                        {
                            createdEntry.DateCreated = DateTimeOffset.UtcNow;
                            createdEntry.DateModified = DateTimeOffset.UtcNow;
                        }
                        break;

                    case EntityState.Modified:
                        if (change.Entity is IModified modified && populatedIModified)
                        {
                            modified.DateModified = DateTimeOffset.UtcNow;
                        }
                        break;
                    case EntityState.Deleted:
                        if (change.Entity is IDeleted deleted)
                        {
                            change.State = EntityState.Modified;
                            deleted.Deleted = true;
                            deleted.DateDeleted = DateTimeOffset.UtcNow;
                        }
                        break;
                }

            }
            var result = await base.SaveChangesAsync(cancellationToken);
            ChangeTracker.Clear();
            return result;
        }
    }
}
