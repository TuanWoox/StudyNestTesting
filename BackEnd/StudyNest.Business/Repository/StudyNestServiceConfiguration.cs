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
using StudyNest.Business.Services.Llm.Abtractions;
using StudyNest.Business.Services.Llm;
using StudyNest.Business.Services.Llm.Providers;

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
            services.AddScoped<IQuizBusiness, QuizBusiness>();
            services.AddScoped<ILlmQuizGenerator, LlmQuizGenerator>();
            services.AddScoped<QuizGenerationPipeline>();
            services.AddHttpClient<ILlmClient, GeminiClient>();
            return services;
        }
    }
    
}
