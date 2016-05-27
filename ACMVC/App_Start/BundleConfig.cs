using System.Web;
using System.Web.Optimization;

namespace ACMVC
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {


            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/vendors").Include(
                        "~/Scripts/angular.min.js",
                        "~/Scripts/toastr.js",
                        "~/Scripts/angular-route.js",
                        "~/Scripts/angular-ui/ui-bootstrap.js",
                        "~/Scripts/angular-ui/ui-bootstrap-tpls.js"
                        ));

            bundles.Add(new ScriptBundle("~/bundles/spa").Include(
                       "~/Scripts/App/modules/common.core.js",
                       "~/Scripts/App/modules/common.ui.js",
                       "~/Scripts/App/layouts/*.js",
                       "~/Scripts/App/notificationService.js",
                       "~/Scripts/App/app.js",
                       "~/Scripts/App/rootCtrl.js",
                       "~/Scripts/App/Status/*.js",
                       "~/Scripts/App/Card/*.js",
                       "~/Scripts/App/AccessZone/*.js",
                       "~/Scripts/App/Device/*.js",
                       "~/Scripts/App/CardLog/*.js",
                       "~/Scripts/App/UserCard/*.js",
                       "~/Scripts/App/DeviceCard/*.js",
                       "~/Scripts/App/User/*.js",
                       "~/Scripts/App/Vehicle/*.js",
                       "~/Scripts/App/Role/*.js"

                ));

            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));



            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js"
                      //,"~/Scripts/respond.js"
                      ));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css",
                      "~/Content/toastr.min.css",
                      "~/Content/ui-bootstrap-csp.css"
                      ));
        }
    }
}
