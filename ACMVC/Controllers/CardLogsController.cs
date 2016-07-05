using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using ACMVC.DAL;
using ACMVC.Models.ViewModels;

namespace ACMVC.Controllers
{
    public class CardLogsController : Controller
    {
        private TestEntities db = new TestEntities();

        // GET: CardLogs
        [HttpPost]
        public JsonResult GetAll(SearchModel sModel)
        {
            var cardLog = sModel.dateFrom != null ? db.CardLogs.Where(x => sModel.dateFrom <= DbFunctions.TruncateTime(x.Time)).ToList() : db.CardLogs.ToList();
            cardLog = sModel.dateTo != null ? db.CardLogs.Where(x => sModel.dateTo >= DbFunctions.TruncateTime(x.Time)).ToList() : cardLog;

            return Json(
                cardLog.Select(x => new CardLog{
                    Id = x.Id,
                    CardId = x.CardId,
                    CardInfo = new CardInfo()
                    {
                        Id = x.CardInfo.Id,
                        IdNumber = x.CardInfo.IdNumber,
                        Number = x.CardInfo.Number
                    },
                    DeviceId = x.DeviceId,
                    Device = new Device()
                    {
                        Id = x.Device.Id,
                        Name = x.Device.Name
                    },
                    Time = x.Time
                }), JsonRequestBehavior.AllowGet);
        }

        // GET: CardLogs/Details/5
        public JsonResult Details(int? id)
        {
            if (id == null)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json("Could not find object", JsonRequestBehavior.AllowGet);
            }
            CardLog CardLog = db.CardLogs.Find(id);
            if (CardLog == null)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json("Could not find object", JsonRequestBehavior.AllowGet);
            }
            return Json(new CardLog {
                Id = CardLog.Id,
                CardId = CardLog.CardId,
                Time = CardLog.Time,
                CardInfo = new CardInfo {
                    Id = CardLog.Id,
                    IdNumber = CardLog.CardInfo.IdNumber,
                    Number = CardLog.CardInfo.Number
                },
                DeviceId = CardLog.DeviceId,
                Device = new Device
                {
                    Id = CardLog.Device.Id,
                    Name = CardLog.Device.Name
                } }, JsonRequestBehavior.AllowGet);
        }


        // POST: CardLogs/Create
        [HttpPost]
        public JsonResult Create(CardLog cardLog)
        {
            cardLog.Time = DateTime.Now;
            if (ModelState.IsValid)
            {
                db.CardLogs.Add(cardLog);
                db.SaveChanges();
                return Json(cardLog);
            }
            Response.StatusCode = (int)HttpStatusCode.BadRequest;
            return Json("Invalid Model State");
        }
             
        // POST: CardLogs/Edit/5
        [HttpPost]
        public JsonResult Edit(CardLog cardLog)
        {
            if (ModelState.IsValid)
            {
                db.Entry(cardLog).State = EntityState.Modified;
                db.SaveChanges();
                return Json(cardLog);
            }
            Response.StatusCode = (int)HttpStatusCode.BadRequest;
            return Json("Invalid Model State");
        }

        // POST: CardLogs/Delete/5
        [HttpPost]
        public ActionResult Delete(int id)
        {
            CardLog cardLog= db.CardLogs.Find(id);
            if (cardLog == null)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(new { jobId = -1 });
            }
            db.CardLogs.Remove(cardLog);
            db.SaveChanges();
            return Json(cardLog);
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
