using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ACMVC.DAL;
using ACMVC.Models;

namespace ACMVC.Controllers
{
    public class VehicleLogsController : Controller
    {
        private TestEntities db = new TestEntities();

        [HttpGet]
        public JsonResult AddVehicleLog(int vehicleId, DateTime time, bool isEntry, string tagNumber)
        {
            var log = new VehicleLog
            {
                TagNumber = tagNumber,
                Time = time,
                VehicleId = vehicleId,
                IsEntry = isEntry
            };
            db.VehicleLogs.Add(log);
            db.SaveChanges();
            return Json("", JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetAll(int? page)
        {
            List<VehicleLog> logs = db.VehicleLogs.ToList();
            var pager = new Pager(logs.Count(), page);

            var viewModel = new
            {
                VehicleLogs = logs.Skip((pager.CurrentPage - 1) * pager.PageSize).Take(pager.PageSize),
                Pager = pager
            };
            return Json(viewModel, JsonRequestBehavior.AllowGet);
        }

    }
}
