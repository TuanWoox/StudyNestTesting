using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using StudyNest.Common.DbEntities.Identities;
using StudyNest.Common.Interfaces;
using StudyNest.Common.Models.DTOs.CoreDTO;
using StudyNest.Common.Models.DTOs.EntityDTO.User;
using StudyNest.Common.Utils.Extensions;
using StudyNest.Data;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Configuration;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace StudyNest.Business.v1
{
    public class AuthBusiness: IAuthBusiness
    {
        private readonly IConfiguration configuration;
        private readonly UserManager<ApplicationUser> userManager;
        private readonly ApplicationDbContext _appDbContext;
        private readonly RoleManager<ApplicationRole> roleManager;
        public AuthBusiness(
            IConfiguration configuration,
            UserManager<ApplicationUser> userManager,
            RoleManager<ApplicationRole> roleManager,
            ApplicationDbContext applicationDbContext
        )
        {
            this.configuration = configuration;
            this.userManager = userManager;
            this.roleManager = roleManager;
            _appDbContext = applicationDbContext;
        }

        public async Task<ReturnResult<string>> Login(UserLogin model)
        {
            ReturnResult<string> result = new ReturnResult<string>();
            try
            {
                ApplicationUser? existingUser = null;
                //Check by email
                if (new EmailAddressAttribute().IsValid(model.UserNameOrEmail))
                {
                    existingUser = await userManager.FindByEmailAsync(model.UserNameOrEmail);
                }
                //Check by username
                else existingUser = await userManager.FindByNameAsync(model.UserNameOrEmail);
                if (existingUser == null) result.Message = "User Not Found";
                //Validate The Password
                var isPasswordValid = await userManager.CheckPasswordAsync(existingUser, model.Password);
                if (!isPasswordValid)
                {
                    result.Message = "Password is incorrect";

                } else result.Result = await GenerateJwtToken(existingUser, model.RememberMe);
            }
            catch (Exception ex)
            {
                result.Message = "An error occurred during login.";
                StudyNestLogger.Instance.Error(ex);
                
            }
            return result;
        }


        private async Task<string> GenerateJwtToken(ApplicationUser user, bool rememberMe)
        {

            var roles = await userManager.GetRolesAsync(user);
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(configuration["Jwt:Key"]);
            //Add Key Value For JWT, Id, UserName and Email
            var myClaim = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new(ClaimTypes.Name, user.UserName ?? string.Empty),
                new(ClaimTypes.Email, user.Email ?? string.Empty)
            };
            //Add Role Value For JWT, many role
            foreach (var role in roles)
            {
                myClaim.Add(new Claim(ClaimTypes.Role, role));
            }
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(myClaim),
                Expires = rememberMe ? DateTime.UtcNow.AddDays(365) : DateTime.UtcNow.AddDays(30),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
