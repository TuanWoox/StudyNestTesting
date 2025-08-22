using Microsoft.AspNetCore.Identity;
using StudyNest.Common.DbEntities.BaseEntity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudyNest.Common.DbEntities.Identities
{
    public class ApplicationRole: IdentityRole, IBaseKey<string>, ICreated, IDeleted, IModified
    {
        public string DisplayName { get; set; }

        public virtual ICollection<ApplicationUserRole> UserRoles { get; set; }
        public virtual ICollection<RolePermission> RolePermissions { get; set; }

        public virtual DateTimeOffset? DateCreated { get; set; }

        public virtual DateTimeOffset? DateModified { get; set; }

        public virtual bool Deleted { get; set; }
        public virtual DateTimeOffset? DateDeleted { get; set; }
    }
}
