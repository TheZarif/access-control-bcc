using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using ACMVC.DAL;

namespace ACMVC.Controllers
{
    public class ZonesController : Controller
    {
        private TestEntities db = new TestEntities();

        public JsonResult GetAll()
        {
            var accessZone = db.AccessZones.ToList();
            return Json(
                accessZone.Select(x => new {
                    Id = x.Id,
                    Name = x.Name,
                    Floor = x.Floor,
                    Description = x.Description
                }), JsonRequestBehavior.AllowGet);
        }

        // GET: Zones/Details/5
        public JsonResult Details(int? id)
        {
            if (id == null)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json("Could not find object", JsonRequestBehavior.AllowGet);
            }
            AccessZone zone = db.AccessZones.Find(id);
            if (zone == null)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json("Could not find object", JsonRequestBehavior.AllowGet);
            }
            return Json(new AccessZone { Id = zone.Id, Name = zone.Name, Description = zone.Description, Floor = zone.Floor }, JsonRequestBehavior.AllowGet);
        }

        
        // POST: Zones/Create        
        [HttpPost]
        public JsonResult Create(AccessZone accessZone)
        {
            if (ModelState.IsValid)
            {
                db.AccessZones.Add(accessZone);
                db.SaveChanges();
                return Json(accessZone);
            }
            Response.StatusCode = (int)HttpStatusCode.BadRequest;
            return Json("Invalid Model State");
        }
            
        // POST: Zones/Edit/5
        [HttpPost]
        public JsonResult Edit(AccessZone accessZone)
        {
            if (ModelState.IsValid)
            {
                db.Entry(accessZone).State = EntityState.Modified;
                db.SaveChanges();
                return Json(accessZone);
            }
            Response.StatusCode = (int)HttpStatusCode.BadRequest;
            return Json("Invalid Model State");
        }

        // POST: Zones/Delete/5
        [HttpPost]
        public ActionResult Delete(int id)
        {
            AccessZone accessZone = db.AccessZones.Find(id);
            if (accessZone == null)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(new { jobId = -1 });
            }
            db.AccessZones.Remove(accessZone);
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
