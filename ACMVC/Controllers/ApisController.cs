using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ACMVC.DAL;
using ACMVC.Models;

namespace ACMVC.Controllers
{
    public class ApisController : Controller
    {
        private TestEntities db = new TestEntities();

        [HttpGet]
        public ActionResult GetDevices(int? id)
        {
            var devices = db.Devices.ToList();

            if (id != null)
            {
                var device = devices.FirstOrDefault(d => d.Id == id);
                return Content(getDeviceRow(device));
            }
            var result = "[";
            foreach (var device in devices)
            {
                result += getDeviceRow(device);
            }
            result += "]";
            return Content(result);
        }

        private string getDeviceRow(Device device)
        {
            return string.Format("[{0},{1},{2},{3},{4},{5},{6},{7},{8},{9}]",
                    device.Id, device.AccessZoneId, device.DUser, device.DPass, device.DeviceSDK, device.DeviceTypeId, device.IP, device.Name, device.Port, device.StatusId);
        }

        [HttpGet]
        public ActionResult GetDeviceCards(int? statusId)
        {
            List<DeviceCardMap> deviceCards;
            if (statusId == null)
                deviceCards = db.DeviceCardMaps.ToList();
            else
                deviceCards = db.DeviceCardMaps.Where(dc => dc.StatusId == statusId).ToList();
            var result = "[";
            foreach (var deviceCard in deviceCards)
            {
                result += string.Format("[{0},{1},{2},{3},{4},{5},{6},{7}]",
                    deviceCard.Id, deviceCard.CardId, deviceCard.CardInfo.Number, deviceCard.CardInfo.IdNumber,
                    deviceCard.DeviceId, deviceCard.AssignTime, deviceCard.ExpireTime, deviceCard.StatusId);
            }
            result += "]";
            return Content(result);
        }

        [HttpGet]
        public ActionResult SetDeviceCardStatus(int deviceId, string cardNo, Statuses status)
        {
            var card = db.CardInfoes.FirstOrDefault(c => c.Number == cardNo);
            var device = db.Devices.Find(deviceId);
            var dbStatus = db.Status.Find((int)status);
            var deviceCards = db.DeviceCardMaps.Where(dc => dc.DeviceId == deviceId && dc.CardId == card.Id).ToList();

            string error = null;
            if (card == null) error = "Invalid card Id";
            else if (device == null) error = "Invalid device Id";
            else if ( dbStatus == null) error = "Invalid status Id";
            else if (deviceCards.Count == 0) error = "No entry exists for card and device";
            if (error != null) return Content(string.Format("Invalid request: {0}", error));

            foreach (var item in deviceCards)
            {
                item.StatusId = (int)status;
            }
            db.SaveChanges();
            return Content(string.Format("{0} rows affected", deviceCards.Count));
        }

        [HttpGet]
        public ActionResult InsertCardLog(int deviceId, string cardNo, DateTime time)
        {
            var device = db.Devices.Find(deviceId);
            var card = db.CardInfoes.FirstOrDefault(c => c.Number == cardNo);

            string error = null;
            if (card == null) error = "Invalid card Id";
            else if (device == null) error = "Invalid device Id";
            if (error != null) return Content(string.Format("Invalid request: {0}", error));

            db.CardLogs.Add(new CardLog
            {
                DeviceId = deviceId,
                CardId = card.Id,
                Time = time
            });

            db.SaveChanges();
            return Content("Card Log added");
        }
    }
}