using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;
using StudyNest.Business.Repository;
using StudyNest.Common.Utils.Configuration;
using StudyNest.Data;
using StudyNest.Middleware;
using System.Text.Json.Serialization;
using Asp.Versioning; 
using Asp.Versioning.ApiExplorer;



namespace StudyNest
{
    public class Startup
    {
        public static IConfiguration Configuration { get; set; }

        private readonly IWebHostEnvironment env;

        public Startup(IConfiguration configuration, IWebHostEnvironment env)
        {
            Configuration = configuration;
            this.env = env;
        }

        public void ConfigureServices(IServiceCollection services)
        {
 
            services.AddEndpointsApiExplorer();

            AddAPIVersioning(services);

            services.Configure<KestrelServerOptions>(options =>
            {
                options.AllowSynchronousIO = true;
            });
            services.Configure<IISServerOptions>(options =>
            {
                options.AllowSynchronousIO = true;
            });

            AddCorsDomain(services);
            AddControllerWithNewtonsoftJson(services);
            ConfigureJwt(services);
            ConfigureDatabase(services);
            ConfigurePolicy(services);
            ConfigureScopedServices(services);
            AddSwaggerService(services);
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IApiVersionDescriptionProvider provider)
        {
            #region Development Configuration
            app.UseCors("CorsPolicy");
            if (env.IsDevelopment())
            {
                app.UseSwagger();

                app.UseSwaggerUI(options =>
                {
                    foreach (var description in provider.ApiVersionDescriptions)
                    {
                        options.SwaggerEndpoint($"/swagger/{description.GroupName}/swagger.json", description.GroupName.ToUpperInvariant());
                    }
                    options.ConfigObject.AdditionalItems.Add("persistAuthorization", "true");

                });
            }
            #endregion

            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseWebSockets();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }

        #region Add Api Versioning
        private void AddAPIVersioning(IServiceCollection services)
        {
            var apiVersioningBuilder = services.AddApiVersioning(options =>
            {
                options.ReportApiVersions = true;
                options.DefaultApiVersion = new ApiVersion(1, 0);
                options.AssumeDefaultVersionWhenUnspecified = true;
            }).AddApiExplorer(options =>
            {
                options.GroupNameFormat = "'v'VVV";
                options.SubstituteApiVersionInUrl = true;
            });
        }
        #endregion

        #region AddCorsDomain
        private void AddCorsDomain(IServiceCollection services)
        {
            services.AddCors(opt =>
            {
                opt.AddPolicy("CorsPolicy", builderCors =>
                {
                    var corsLst = Configuration.GetSection("AllowCors").GetChildren().Select(x => x.Value).ToArray();
                    builderCors
                       .WithOrigins(corsLst)
                       .SetIsOriginAllowedToAllowWildcardSubdomains()
                       .AllowAnyMethod()
                       .AllowAnyHeader();

                });
            });
        }
        #endregion

        #region Add Controlller and NewtonsoftJson to it
        private void AddControllerWithNewtonsoftJson(IServiceCollection services)
        {
            services.AddControllers()
                    .AddNewtonsoftJson(options =>
                    {
                        options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                        options.SerializerSettings.NullValueHandling = NullValueHandling.Ignore;
                        options.SerializerSettings.PreserveReferencesHandling = PreserveReferencesHandling.Objects;
                    })
                    .AddJsonOptions(options =>
                    {
                        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
                    });
        }
        #endregion

        #region Configure JWT
        private void ConfigureJwt(IServiceCollection services)
        {
            
        }
        #endregion

        #region Configure Database
        private void ConfigureDatabase(IServiceCollection services)
        {
            var connectionString = Configuration.GetConnectionString("DefaultConnection");

            services.AddDbContext<ApplicationDbContext>(options =>
            {
                options.UseNpgsql(connectionString, npgsqlOptions =>
                {
                    npgsqlOptions.MigrationsAssembly("StudyNest");
                    npgsqlOptions.EnableRetryOnFailure(
                        maxRetryCount: 5,
                        maxRetryDelay: TimeSpan.FromSeconds(30),
                        errorCodesToAdd: null);
                });
            });
        }
        #endregion

        #region Configure Policy
        private void ConfigurePolicy(IServiceCollection services)
        {
            // Allows access to HttpContext in services via IHttpContextAccessor outside controllers
            services.AddHttpContextAccessor();
            // Registers AutoMapper with the custom mapping profile. used to map DTO to real entity and vice versa
            services.AddAutoMapper(cfg =>
            {
                cfg.AddProfile(new StudyNestMapper());
            });
        }
        #endregion

        #region Configure Dependency Injection
        private void ConfigureScopedServices(IServiceCollection services)
        {
            services.RegisterStudyNestService();
        }
        #endregion

        #region Configure Swwagger
        private void AddSwaggerService(IServiceCollection services)
        {
            services.AddSwaggerGen(c =>
            {
                OpenApiSecurityScheme securityDefinition = new OpenApiSecurityScheme()
                {
                    Name = "Bearer",
                    BearerFormat = "JWT",
                    Scheme = "bearer",
                    Description = "Use auth/login to earn your JWT token. Then, please Enter your JWT token to here",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.Http,
                };
                c.AddSecurityDefinition("jwt_auth", securityDefinition);

                c.AddSecurityRequirement(new OpenApiSecurityRequirement()
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "jwt_auth"
                            },
                        },
                        new List<string>()
                    }
                });
            });
            services.ConfigureOptions<ConfigureSwaggerOptions>();

        }
        #endregion

    }

}
