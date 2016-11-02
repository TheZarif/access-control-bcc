using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using ACMVC.DAL;
using ACMVC.Models;

namespace ACMVC.Controllers
{
    public class VehicleController : Controller
    {
        private TestEntities db = new TestEntities();

        public JsonResult GetAll(int? page, string search)
        {
            List<VehicleInfo> vehicles;
            if (!string.IsNullOrEmpty(search))
            {
                vehicles = db.VehicleInfoes.Where(p => (p.VehicleNo.Contains(search)) || (p.OwnerName.Contains(search)))
                    .ToList();

            }
            else
            {
                vehicles = db.VehicleInfoes.ToList();
            }
            var pager  = new Pager(vehicles.Count(), page);

            var viewModel = new VehicleViewModel()
            {
                Vehicles = vehicles.Skip((pager.CurrentPage - 1) * pager.PageSize).Take(pager.PageSize),
                Pager = pager
            };
            return Json(viewModel, JsonRequestBehavior.AllowGet);
        }

        // GET: Vehicle/Details/5
        public JsonResult Details(long? id)
        {
            if (id == null)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json("Could not find object", JsonRequestBehavior.AllowGet);
            }
            VehicleInfo vehicleInfo = db.VehicleInfoes.Find(id);
            if (vehicleInfo == null)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json("Could not find object", JsonRequestBehavior.AllowGet);
            }
            return Json(vehicleInfo);
        }


        // POST: Vehicle/Create
        [HttpPost]
        public ActionResult Create(VehicleInfo vehicleInfo)
        {
            if (ModelState.IsValid)
            {
                db.VehicleInfoes.Add(vehicleInfo);
                db.SaveChanges();
                return Json(vehicleInfo);
            }
            Response.StatusCode = (int)HttpStatusCode.BadRequest;
            return Json("Invalid Model State");
        }


        // POST: Vehicle/Edit/5
        [HttpPost]
        public JsonResult Edit(VehicleInfo vehicleInfo)
        {
            if (ModelState.IsValid)
            {
                db.Entry(vehicleInfo).State = EntityState.Modified;
                db.SaveChanges();
                return Json(vehicleInfo);
            }
            Response.StatusCode = (int)HttpStatusCode.BadRequest;
            return Json("Invalid Model State");
        }

       

        // POST: Vehicle/Delete/5
        [HttpPost]
        public JsonResult Delete(long id)
        {
            VehicleInfo vehicleInfo = db.VehicleInfoes.Find(id);
            if (vehicleInfo == null)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(new { jobId = -1 });
            }
            db.VehicleInfoes.Remove(vehicleInfo);
            db.SaveChanges();
            return Json("");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
