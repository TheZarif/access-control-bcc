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
    public class DeviceCardMapsController : Controller
    {
        private TestEntities db = new TestEntities();

        // GET: DeviceCardMaps
        public JsonResult GetAll()
        {
            var deviceCardMaps = db.DeviceCardMaps.ToList();
            return Json(
                deviceCardMaps.Select(x=> new
                {
                    Id = x.Id,
                    DeviceId = x.DeviceId, 
                    DeviceName = x.Device.Name,
                    CardId = x.CardId,
                    CardIdNumber = x.CardInfo.IdNumber,
                    StatusId = x.StatusId,
                    StatusType = x.Status.Type,
                    AssignTime = x.AssignTime,
                    ExpireTime = x.ExpireTime
                }), JsonRequestBehavior.AllowGet);
        }

        // GET: DeviceCardMaps/Details/5
        /*public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            DeviceCardMap deviceCardMap = db.DeviceCardMaps.Find(id);
            if (deviceCardMap == null)
            {
                return HttpNotFound();
            }
            return View(deviceCardMap);
        }*/


        // POST: DeviceCardMaps/Create
        [HttpPost]
        public JsonResult Create(DeviceCardMap deviceCardMap)
        {
            DateTime nowTime = DateTime.Now;
            DateTime endOfDay = DateTime.Today.AddDays(1);
            deviceCardMap.AssignTime = nowTime;
            deviceCardMap.ExpireTime = endOfDay;
            if (ModelState.IsValid)
            {
                db.DeviceCardMaps.Add(deviceCardMap);
                db.SaveChanges();
                return Json(deviceCardMap);
            }
            Response.StatusCode = (int)HttpStatusCode.BadRequest;
            return Json("Invalid Model State");
        }

      
        // POST: DeviceCardMaps/Edit/5
        [HttpPost]
        public JsonResult Edit(DeviceCardMap deviceCardMap)
        {
            if (ModelState.IsValid)
            {
                db.Entry(deviceCardMap).State = EntityState.Modified;
                db.SaveChanges();
                return Json(deviceCardMap);
            }
            Response.StatusCode = (int)HttpStatusCode.BadRequest;
            return Json("Invalid Model State");
        }

        // POST: DeviceCardMaps/Delete/5
        [HttpPost]
        public JsonResult Delete(int id)
        {
            DeviceCardMap deviceCardMap = db.DeviceCardMaps.Find(id);
            if (deviceCardMap == null)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(new { jobId = -1 });
            }
            db.DeviceCardMaps.Remove(deviceCardMap);
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
