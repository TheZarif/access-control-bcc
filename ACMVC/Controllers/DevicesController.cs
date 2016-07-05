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
    public class DevicesController : Controller
    {
        private TestEntities db = new TestEntities();

        public JsonResult GetAll()
        {
            var Devices = db.Devices.ToList();
            return Json(
                Devices.Select(x => new Device(){
                    Id = x.Id,
                    Name = x.Name,
                    IP = x.IP,
                    Port = x.Port,
                    DeviceTypeId = x.DeviceTypeId,
                    DeviceType = new DeviceType() { Id = x.DeviceType.Id, Name = x.DeviceType.Name},
                    DeviceSDK= x.DeviceSDK,
                    DUser = x.DUser,
                    DPass = x.DPass,
                    AccessZoneId = x.AccessZoneId,
                    AccessZone = new AccessZone() { Id = x.AccessZone.Id,  Name = x.AccessZone.Name}
                }), JsonRequestBehavior.AllowGet);
        }

        // GET: Devices/Details/5
        public JsonResult Details(int? id)
        {
            if (id == null)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json("Could not find object", JsonRequestBehavior.AllowGet);
            }
            Device device = db.Devices.Find(id);
            if (device == null)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json("Could not find object", JsonRequestBehavior.AllowGet);                
            }
            return Json(
                    new Device
                    {
                        Id = device.Id,
                        Name = device.Name,
                        IP = device.IP,
                        Port = device.Port,
                        DeviceTypeId = device.DeviceTypeId,
                        DeviceType = new DeviceType() { Id = device.DeviceType.Id, Name = device.DeviceType.Name },
                        DeviceSDK = device.DeviceSDK,
                        DUser = device.DUser,
                        DPass = device.DPass,
                        AccessZone = new AccessZone() { Id = device.AccessZone.Id, Name = device.AccessZone.Name }
                    }, JsonRequestBehavior.AllowGet);
        }

        // POST: Devices/Create
        [HttpPost]
        public JsonResult Create(Device device)
        {
            if (ModelState.IsValid)
            {
                db.Devices.Add(device);
                db.SaveChanges();
                return Json(device);
            }

            Response.StatusCode = (int)HttpStatusCode.BadRequest;
            return Json("Invalid Model State");
        }
       
        // POST: Devices/Edit/5
        [HttpPost]        
        public JsonResult Edit(Device device)
        {
            if (ModelState.IsValid)
            {
                db.Entry(device).State = EntityState.Modified;
                db.SaveChanges();
                return Json(device);
            }
            Response.StatusCode = (int)HttpStatusCode.BadRequest;
            return Json("Invalid Model State");
        }
        
        // POST: Devices/Delete/5
        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(int id)
        {
            Device device = db.Devices.Find(id);
            if (device == null)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(new { jobId = -1 });
            }
            db.Devices.Remove(device);
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
