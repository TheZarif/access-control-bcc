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
    public class UsersController : Controller
    {
        private TestEntities db = new TestEntities();



        // GET: Users
        public ActionResult Index()
        {
            return View(db.AspNetUsers.ToList());
        }

        [HttpPost]
        public JsonResult SearchUser(UserSearchModel searchModel)
        {
            if (!string.IsNullOrEmpty(searchModel.email) || !string.IsNullOrEmpty(searchModel.phone))
            {
                var results = db.AspNetUsers.Where(p => (p.Email.Contains(searchModel.email) || p.PhoneNumber.Contains(searchModel.phone)));
                if (results != null)
                {
                    return Json(
                        results.Select(x => new {
                        Id = x.Id,
                        Email = x.Email,
                        PhoneNumber = x.PhoneNumber
                    }), JsonRequestBehavior.AllowGet);
                }
            }
            Response.StatusCode = (int)HttpStatusCode.BadRequest;
            return Json("Could not find object");
        }

        // GET: Users/Details/5
        public JsonResult Details(string id)
        {
            if (id == null)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json("");
            }
            AspNetUser aspNetUser = db.AspNetUsers.Find(id);
            if (aspNetUser != null)
            {
                return Json(aspNetUser, JsonRequestBehavior.AllowGet);
            }
            Response.StatusCode = (int)HttpStatusCode.BadRequest;
            return Json("Could not find object");
        }

        // GET: Users/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Users/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "Id,Email,EmailConfirmed,PasswordHash,SecurityStamp,PhoneNumber,PhoneNumberConfirmed,TwoFactorEnabled,LockoutEndDateUtc,LockoutEnabled,AccessFailedCount,UserName,Gender,BloodGroup,NId,ProfilePicUrl,PresentAddress,PresentDistrict,PresentDivision,PermanentAddress,PermanentDistrict,PermanentDivision,Profession,SummaryNote,UserGroup,EmployeeId,Designation,DeskFloor,RoomNo,WorkDivision,IsVerified")] AspNetUser aspNetUser)
        {
            if (ModelState.IsValid)
            {
                db.AspNetUsers.Add(aspNetUser);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(aspNetUser);
        }

        // GET: Users/Edit/5
        public ActionResult Edit(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            AspNetUser aspNetUser = db.AspNetUsers.Find(id);
            if (aspNetUser == null)
            {
                return HttpNotFound();
            }
            return View(aspNetUser);
        }

        // POST: Users/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "Id,Email,EmailConfirmed,PasswordHash,SecurityStamp,PhoneNumber,PhoneNumberConfirmed,TwoFactorEnabled,LockoutEndDateUtc,LockoutEnabled,AccessFailedCount,UserName,Gender,BloodGroup,NId,ProfilePicUrl,PresentAddress,PresentDistrict,PresentDivision,PermanentAddress,PermanentDistrict,PermanentDivision,Profession,SummaryNote,UserGroup,EmployeeId,Designation,DeskFloor,RoomNo,WorkDivision,IsVerified")] AspNetUser aspNetUser)
        {
            if (ModelState.IsValid)
            {
                db.Entry(aspNetUser).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(aspNetUser);
        }

        // GET: Users/Delete/5
        public ActionResult Delete(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            AspNetUser aspNetUser = db.AspNetUsers.Find(id);
            if (aspNetUser == null)
            {
                return HttpNotFound();
            }
            return View(aspNetUser);
        }

        // POST: Users/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(string id)
        {
            AspNetUser aspNetUser = db.AspNetUsers.Find(id);
            db.AspNetUsers.Remove(aspNetUser);
            db.SaveChanges();
            return RedirectToAction("Index");
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
