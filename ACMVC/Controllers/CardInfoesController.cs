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
    public class CardInfoesController : Controller
    {
        private TestEntities db = new TestEntities();

        // GET: CardInfoes
        public ActionResult Index()
        {
            var cardInfoes = db.CardInfoes.Include(c => c.Status);
            return View(cardInfoes.ToList());
        }

        public JsonResult GetAll()
        {
            var cardInfoes = db.CardInfoes.Include(c => c.Status);
            return Json(cardInfoes.Select(x => new {
                Id = x.Id,
                Number = x.Number,
                Notes = x.Notes,               
                StatusId = x.StatusId,
                StatusType = x.Status.Type
            }), JsonRequestBehavior.AllowGet);
        }

        // GET: CardInfoes/Details/5
        public JsonResult Details(int? id)
        {
            if (id == null)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json("Could not find object", JsonRequestBehavior.AllowGet);
            }
            CardInfo card = db.CardInfoes.Find(id);
            if (card == null)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json("Could not find object", JsonRequestBehavior.AllowGet);
            }
            return Json(new CardInfo
            {
                Id = card.Id,
                Number = card.Number,
                Notes = card.Notes,
                Status = new Status { Id = card.Status.Id, Type = card.Status.Type, Description = card.Status.Description }
            }, 
            JsonRequestBehavior.AllowGet);

        }

        // POST: CardInfoes/Create       
        [HttpPost]
        public JsonResult Create(CardInfo cardInfo)
        {
            if (ModelState.IsValid)
            {
                db.CardInfoes.Add(cardInfo);
                db.SaveChanges();
                return Json(cardInfo);
            }

            Response.StatusCode = (int)HttpStatusCode.BadRequest;
            return Json("Invalid Model State");
        }

       
        // POST: CardInfoes/Edit/5
        [HttpPost]
        public ActionResult Edit(CardInfo cardInfo)
        {
            if (ModelState.IsValid)
            {
                db.Entry(cardInfo).State = EntityState.Modified;
                db.SaveChanges();
                return Json(cardInfo);
            }
            Response.StatusCode = (int)HttpStatusCode.BadRequest;
            return Json("Invalid Model State");
        }
        
        // POST: CardInfoes/Delete/5
        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(int id)
        {
            CardInfo cardInfo = db.CardInfoes.Find(id);
            if (cardInfo == null)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(new { jobId = -1 });
            }
            db.CardInfoes.Remove(cardInfo);
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
