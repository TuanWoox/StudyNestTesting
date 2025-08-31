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
        public DbSet<Quiz> Quizzes { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<Choice> Choices { get; set; }
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {


        }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

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
