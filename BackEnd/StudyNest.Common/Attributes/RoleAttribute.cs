using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;
using StudyNest.Common.DbEntities.Identities;
using StudyNest.Common.Utils.Enums;
using StudyNest.Common.Utils.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudyNest.Common.Attributes
{
    /// <summary>
    /// Role-based authorization attribute for UserRole enum (admin, mentor, mentee)
    /// Admin has full permissions by default
    /// </summary>
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = false, Inherited = true)]
    public class RoleAuthorizeAttribute : AuthorizeAttribute, IAsyncAuthorizationFilter
    {
        private readonly UserRoleEnum[] _allowedRoles;
        private readonly bool _adminFullAccess;

        public RoleAuthorizeAttribute(params UserRoleEnum[] allowedRoles)
        {
            _allowedRoles = allowedRoles ?? new UserRoleEnum[0];
        }

        public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
        {
            var user = context.HttpContext.User;
            if (!user.Identity.IsAuthenticated)
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            var userManager = context.HttpContext.RequestServices.GetService<UserManager<ApplicationUser>>();
            if (userManager == null)
            {
                context.Result = new StatusCodeResult(StatusCodes.Status500InternalServerError);
                return;
            }

            var userId = user.GetUserId();
            var applicationUser = await userManager.FindByIdAsync(userId.ToString());

            if (applicationUser == null)
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            var userRoles = await userManager.GetRolesAsync(applicationUser);

            if (userRoles.Contains(nameof(UserRoleEnum.admin)))
            {
                return; // Admin can access everything
            }

            var hasPermission = _allowedRoles.Any(role => userRoles.Contains(role.ToString()));

            if (!hasPermission)
            {
                context.Result = new StatusCodeResult(StatusCodes.Status403Forbidden);
                return;
            }
        }
    }
}
