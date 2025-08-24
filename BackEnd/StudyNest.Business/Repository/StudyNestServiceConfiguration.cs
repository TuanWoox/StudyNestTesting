using System;
using System.Collections.Generic;
using System.ComponentModel.Design;
using System.Linq;
using System.Text;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Http; 
using System.Threading.Tasks;
using StudyNest.Common.Interfaces;
using StudyNest.Business.v1;

namespace StudyNest.Business.Repository
{
    public static class StudyNestServiceConfiguration
    {
        public static IServiceCollection RegisterStudyNestService(this IServiceCollection services)
        {
            services.AddHttpClient();
            services.AddScoped(typeof(IRepository<,>), typeof(Repository<,>));
            services.AddScoped<IUserBusiness, UserBusiness>();
            services.AddScoped<IAuthBusiness, AuthBusiness>();
            return services;
        }
    }
    
}
