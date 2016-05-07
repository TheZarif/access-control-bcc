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
    public class StatusController : Controller
    {
        private TestEntities db = new TestEntities();

        // GET: Status
        public ActionResult Index()
        {
            return View(db.Status.ToList());
        }


        public JsonResult GetAll()
        {
            var Statuses = db.Status.ToList();
            return Json(
                Statuses.Select(x => new {
                    Id = x.Id,
                    Type = x.Type,
                    Description = x.Description
                }), JsonRequestBehavior.AllowGet);
        } 

        // GET: Status/Details/5
        public JsonResult Details(int? id)
        {
            if (id == null)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json("Could not find object", JsonRequestBehavior.AllowGet);
            }
            Status status = db.Status.Find(id);
            if (status == null)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json("Could not find object", JsonRequestBehavior.AllowGet);
            }
            return Json(new Status { Id = status.Id, Type = status.Type, Description = status.Description}, JsonRequestBehavior.AllowGet);
        }

        // POST: Status/Create 
        [HttpPost]
        public JsonResult Create(Status status)
        {
            if (ModelState.IsValid)
            {
                db.Status.Add(status);
                db.SaveChanges();
                return Json(status);
            }

            Response.StatusCode = (int)HttpStatusCode.BadRequest;
            return Json("Invalid Model State");
        }



        // POST: Status/Edit/5
        [HttpPost]
        public JsonResult Edit(Status status)
        {
            if (ModelState.IsValid)
            {
                db.Entry(status).State = EntityState.Modified;
                db.SaveChanges();
                return Json(status);
            }
            Response.StatusCode = (int)HttpStatusCode.BadRequest;
            return Json("Invalid Model State");
        }

        // POST: Status/Delete/5
        [HttpPost]
        public ActionResult Delete(int id)
        {
            Status status = db.Status.Find(id);
            if (status == null)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(new { jobId = -1 });
            }
            db.Status.Remove(status);
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
