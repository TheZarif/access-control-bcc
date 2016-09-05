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
using ACMVC.Models.ViewModels;

namespace ACMVC.Controllers
{
    public class DeviceCardMapsController : Controller
    {
        private TestEntities db = new TestEntities();

        // GET: DeviceCardMaps
        public JsonResult GetAll(int? page, string search)
        {
            List<DeviceCardMap> deviceCardMaps;
            if (!string.IsNullOrEmpty(search))
            {
                deviceCardMaps = db.DeviceCardMaps
                    .Where(dc => (dc.CardInfo.IdNumber.Contains(search) || dc.Device.Name.Contains(search))).ToList();
            }
            else
            {
                deviceCardMaps = db.DeviceCardMaps.ToList();
            }
            var pager = new Pager(deviceCardMaps.Count(), page);
            var viewModel = new ViewModel<DeviceCardMap>
            {
                Items = deviceCardMaps
                    .Select(x => new DeviceCardMap
                    {
                        Id = x.Id,
                        DeviceId = x.DeviceId,
                        Device = new Device {Id = x.DeviceId, Name = x.Device.Name},
                        CardInfo = new CardInfo {Id = x.CardId, IdNumber = x.CardInfo.IdNumber},
                        StatusId = x.StatusId,
                        Status = new Status {Id = x.StatusId, Type = x.Status.Type},
                        AssignTime = x.AssignTime,
                        ExpireTime = x.ExpireTime
                    })
                    .Skip((pager.CurrentPage - 1)*pager.PageSize).Take(pager.PageSize),
                Pager = pager
            };
            return Json(viewModel, JsonRequestBehavior.AllowGet);
        }
        
        // POST: DeviceCardMaps/Create
        [HttpPost]
        public JsonResult Create(DeviceCardMap deviceCardMap)
        {
            if (deviceCardMap.ExpireTime == DateTime.MinValue)
            {
                deviceCardMap.ExpireTime = DateTime.MaxValue;
            }
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
            var dbDeviceCard = db.DeviceCardMaps.Find(deviceCardMap.Id);
            if (dbDeviceCard != null && ModelState.IsValid)
            {
                dbDeviceCard.AssignTime = deviceCardMap.AssignTime;
                dbDeviceCard.ExpireTime = deviceCardMap.ExpireTime;
                dbDeviceCard.StatusId = deviceCardMap.StatusId;
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

        [HttpGet]
        public string GetDeviceCard()
        {
            var str = "";
            var deviceCards = db.DeviceCardMaps.Where(dc => dc.StatusId != 1 ).ToList();
            foreach (var deviceCard in deviceCards)
            {
                str+= deviceCard.DeviceId + "," + deviceCard.CardInfo.Number + "," + deviceCard.AssignTime + "," + deviceCard.ExpireTime + ";";
                deviceCard.StatusId = 1;
            }
            db.SaveChanges();

            return str;
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
