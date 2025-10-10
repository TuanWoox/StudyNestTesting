using Asp.Versioning; 
using Asp.Versioning.ApiExplorer;
using CloudinaryDotNet;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Microsoft.Win32;
using Newtonsoft.Json;
using StudyNest.Business.Repository;
using StudyNest.Business.v1;
using StudyNest.Common.DbEntities.Identities;
using StudyNest.Common.Interfaces;
using StudyNest.Common.Utils.Configuration;
using StudyNest.Common.Utils.Extensions;
using StudyNest.Data;
using StudyNest.Infrastructures.Hangfire;
using StudyNest.Middleware;
using System.Text.Json.Serialization;
using System.Threading.Tasks;


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

            services.AddHangfireSetup(Configuration);
            HangfireConfiguration.ConfigureGlobalFilters();

            AddCorsDomain(services);
            AddControllerWithNewtonsoftJson(services);
            ConfigureAuthService(services);
            ConfigureDatabase(services);
            ConfigurePolicy(services);
            AddSwaggerService(services);
            ConfigureCloudinary(services);
            ConfigureScopedServices(services);
        }

        public async void Configure(IApplicationBuilder app, IWebHostEnvironment env, IApiVersionDescriptionProvider provider)
        {
            #region Development Configuration
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
            app.UseCors("CorsPolicy");
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseWebSockets();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            app.AddHangfireDashBoardSetup(Configuration);
            await InitData(app.ApplicationServices);
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
                    });
        }
        #endregion

        #region Configure Auth And JWT
        private void ConfigureAuthService(IServiceCollection services)
        {
            // Configure the antiforgery service to expect the CSRF token in a custom header named "X-XSRF-TOKEN"
            services.AddAntiforgery(options => options.HeaderName = "X-XSRF-TOKEN");
            // Add authentication services and specify that JWT Bearer is the default scheme
            services.AddAuthentication(x =>
            {
                // Set the default scheme used to authenticate users
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                // Set the default scheme used when authentication fails (e.g., for returning 401 Unauthorized)
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                // Configure how JWT tokens should be validated
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    // Require that the token contains a valid "iss" (issuer) claim
                    ValidateIssuer = false,
                    // Require that the token contains a valid "aud" (audience) claim
                    ValidateAudience = false,
                    // Ensure the token has not expired
                    ValidateLifetime = true,
                    // Ensure the token was signed with a valid and trusted signing key
                    ValidateIssuerSigningKey = true,
                    // Set the expected issuer (e.g., your application or auth server domain)
                    ValidIssuer = Configuration["Jwt:Issuer"],
                    // Set the expected audience (e.g., the client app or API consumers)
                    ValidAudience = Configuration["Jwt:Audience"],
                    // Set the secret key used to validate the signature of the token
                    IssuerSigningKey = new SymmetricSecurityKey(
                        System.Text.Encoding.UTF8.GetBytes(Configuration["Jwt:Key"]))
                };
                // Customize how the token is retrieved from incoming requests
                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        // Try to read the token from the query string (useful for WebSockets or SignalR)
                        var accessToken = context.Request.Query["access_token"];
                        // If a token is found in the query string, use it
                        if (!string.IsNullOrEmpty(accessToken))
                        {
                            context.Token = accessToken;
                        }
                        return Task.CompletedTask;
                    }
                };
            });
            // Configure Identity with strong password rules and email confirmation
            IdentityBuilder builder = services.AddIdentityCore<ApplicationUser>(opt =>
            {
                opt.Password.RequiredLength = 6;
                opt.Password.RequireDigit = true;
                opt.Password.RequireNonAlphanumeric = true;
                opt.Password.RequireUppercase = true;
                opt.Password.RequireLowercase = true;
                // Require email confirmation before login
                opt.SignIn.RequireConfirmedEmail = true;
            }).AddRoles<ApplicationRole>();
            // Add support for custom roles
            builder = new IdentityBuilder(builder.UserType, typeof(ApplicationRole), builder.Services);
            // Set token (e.g., email confirmation, reset password) expiration time
            int expiredToken = int.TryParse(Configuration.GetSection("TokenLifespan").Value, out int parsedValue) ? parsedValue : 10;
            builder.Services.Configure<DataProtectionTokenProviderOptions>(o => o.TokenLifespan = TimeSpan.FromMinutes(expiredToken));
            // Register Identity services
            builder.AddEntityFrameworkStores<ApplicationDbContext>();
            builder.AddRoleValidator<RoleValidator<ApplicationRole>>();
            builder.AddRoleManager<RoleManager<ApplicationRole>>();
            builder.AddSignInManager<SignInManager<ApplicationUser>>();
            builder.AddTokenProvider<DataProtectorTokenProvider<ApplicationUser>>(TokenOptions.DefaultProvider);
            // Configure SignalR for real-time communication
            services.AddSignalR(hubOptions =>
            {
                hubOptions.EnableDetailedErrors = true;
                hubOptions.KeepAliveInterval = TimeSpan.FromSeconds(5);
            });
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
            services.AddAutoMapper((serviceProvider, cfg) =>
            {
                cfg.LicenseKey = Configuration.GetValue<string>("AutoMapper:LicenseKey");
            }, typeof(StudyNestMapper).Assembly);
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

        #region Configure Cloudinary
        public void ConfigureCloudinary(IServiceCollection services)
        {
            var cloudName = Configuration.GetValue<string>("CloudinarySettings:CloudName");
            var apiKey = Configuration.GetValue<string>("CloudinarySettings:ApiKey");
            var apiSecret = Configuration.GetValue<string>("CloudinarySettings:ApiSecret");
            // Ensure none of them are null/empty
            if (!new[] { cloudName, apiKey, apiSecret }.Any(string.IsNullOrEmpty))
            {
                var account = new Account(cloudName, apiKey, apiSecret);
                var cloudinary = new Cloudinary(account);
                services.AddSingleton(cloudinary);
            }
        }
        #endregion

        #region Init Default Data 
        private async Task InitData(IServiceProvider serviceProvider)
        {
            try
            {
                using (var scope = serviceProvider.CreateScope())
                {
                    var userBusiness = scope.ServiceProvider.GetRequiredService<IUserBusiness>();
                    await userBusiness.InitData();
                }
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);

            }
        }
        #endregion
    
    }

}
