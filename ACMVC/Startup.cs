using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(ACMVC.Startup))]
namespace ACMVC
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
