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
        private readonly TestEntities _db = new TestEntities();

        public JsonResult GetAll()
        {
            var statuses = _db.Status.ToList();

            return Json(
                statuses.Select(x => new {
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
            Status status = _db.Status.Find(id);
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
                _db.Status.Add(status);
                _db.SaveChanges();
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
                _db.Entry(status).State = EntityState.Modified;
                _db.SaveChanges();
                return Json(status);
            }
            Response.StatusCode = (int)HttpStatusCode.BadRequest;
            return Json("Invalid Model State");
        }

        // POST: Status/Delete/5
        [HttpPost]
        public ActionResult Delete(int id)
        {
            Status status = _db.Status.Find(id);
            if (status == null)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(new { jobId = -1 });
            }
            _db.Status.Remove(status);
            _db.SaveChanges();
            return Json("");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
