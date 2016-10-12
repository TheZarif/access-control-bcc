using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ACMVC.DAL;

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


    }
}