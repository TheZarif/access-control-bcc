using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using ACMVC.DAL;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace ACMVC.Controllers
{
    public class RolesController : Controller
    {
        private TestEntities db = new TestEntities();


        

        public JsonResult GetAll()
        {
            var Roles = db.AspNetRoles.ToList();
            return Json(
                Roles.Select(x => new {
                    Id = x.Id,
                    Name = x.Name
                }), JsonRequestBehavior.AllowGet);
        }

        // GET: Roles/Details/5
        public JsonResult Details(string id)
        {
            if (id == null)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json("Could not find object", JsonRequestBehavior.AllowGet);
            }
            AspNetRole role = db.AspNetRoles.Find(id);
            if (role == null)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json("Could not find object", JsonRequestBehavior.AllowGet);
            }
            return Json(new AspNetRole { Id = role.Id, Name = role.Name}, JsonRequestBehavior.AllowGet);
        }

       
        // POST: Roles/Create        
        [HttpPost]
        public JsonResult Create(AspNetRole aspNetRole)
        {
            var guid = Guid.NewGuid();
            aspNetRole.Id = guid.ToString();
            if (ModelState.IsValid)
            {
                db.AspNetRoles.Add(aspNetRole);
                db.SaveChanges();
                return Json(aspNetRole);
            }

            Response.StatusCode = (int)HttpStatusCode.BadRequest;
            return Json("Invalid Model State");
        }

        // POST: Roles/Edit/5        
        [HttpPost]
        public JsonResult Edit(AspNetRole aspNetRole)
        {
            if (ModelState.IsValid)
            {
                db.Entry(aspNetRole).State = EntityState.Modified;
                db.SaveChanges();
                return Json(aspNetRole);
            }
            Response.StatusCode = (int)HttpStatusCode.BadRequest;
            return Json("Invalid Model State");
        }
       
        // POST: Roles/Delete/5
        [HttpPost]
        public JsonResult Delete(string id)
        {
            AspNetRole aspNetRole = db.AspNetRoles.Find(id);
            if(aspNetRole == null)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(new { jobId = -1 });
            }
            db.AspNetRoles.Remove(aspNetRole);
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
