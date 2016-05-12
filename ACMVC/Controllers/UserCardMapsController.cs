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
    public class UserCardsController : Controller
    {
        private TestEntities db = new TestEntities();

        // GET: UserCardMaps/getall
        public JsonResult GetAll()
        {
            var UserCardMaps = db.UserCardMaps.ToList();

            return Json(
                UserCardMaps.Select(x => new {
                    Id = x.Id,
                    CardId = x.CardId,
                    CardNumber = x.CardInfo.Number,
                    UserId = x.UserId,
                    Email = x.AspNetUser.Email,
                    IssueDate = x.IssueDate,
                    RevocationDate = x.RevocationDate,
                    StatusId = x.StatusId,
                    StatusType = x.Status.Type,
                    Notes = x.Notes
                }), JsonRequestBehavior.AllowGet);
        }     
                

        // POST: UserCardMaps/Create
        [HttpPost]
        public JsonResult Create(UserCardMap userCardMap)
        {
            DateTime nowTime = DateTime.Now;
            DateTime maxTime = DateTime.MaxValue;
            userCardMap.IssueDate = nowTime;
            userCardMap.RevocationDate = maxTime;

            if (ModelState.IsValid)
            {
                db.UserCardMaps.Add(userCardMap);
                db.SaveChanges();
                return Json(userCardMap);
            }

            Response.StatusCode = (int)HttpStatusCode.BadRequest;
            return Json("Invalid Model State");
        }

        // POST: UserCardMaps/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        public JsonResult Edit(UserCardMap userCardMap)
        {
            if (ModelState.IsValid)
            {
                db.Entry(userCardMap).State = EntityState.Modified;
                db.SaveChanges();
                return Json(userCardMap);
            }
            Response.StatusCode = (int)HttpStatusCode.BadRequest;
            return Json("Invalid Model State");
        }

        // POST: UserCardMaps/Delete/5
        [HttpPost]
        public ActionResult Delete(int id)
        {
            UserCardMap userCardMap = db.UserCardMaps.Find(id);
            if(userCardMap == null)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(new { jobId = -1 });
            }
            db.UserCardMaps.Remove(userCardMap);
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
