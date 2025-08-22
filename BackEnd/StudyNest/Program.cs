using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using StudyNest.Common.Utils.Extensions;
using StudyNest.Data;
using System.Threading.Tasks;
namespace StudyNest
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            try
            {
                StudyNestLogger.Instance.Debug("Server Started");
                var webHost = CreateHostBuilder(args).Build();
                //Create a new scope
                using (var scope = webHost.Services.CreateScope())
                {
                    var myDbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                    await myDbContext.Database.MigrateAsync();
                }

                await webHost.RunAsync();
            }
            catch (Exception ex)
            {
                StudyNestLogger.Instance.Error(ex);

                StudyNestLogger.Instance.Debug("Wait 10s to reconnect");
                Thread.Sleep(10000);
                await Main(args);
            }

        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
