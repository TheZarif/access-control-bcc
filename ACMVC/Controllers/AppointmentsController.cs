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
using Microsoft.AspNet.Identity;

namespace ACMVC.Controllers
{
    public class AppointmentsController : Controller
    {
        private TestEntities db = new TestEntities();

//        // GET: Appointments
//        public ActionResult Index()
//        {
//            var appointments = db.Appointments.Include(a => a.AspNetUser).Include(a => a.AspNetUser1).Include(a => a.AppointmentStatu);
//            return View(appointments.ToList());
//        }

        public JsonResult GetAll(int? page, string search) 
        {
            var userId = System.Web.HttpContext.Current.User.Identity.GetUserId();

            var appointments = db.Appointments.Where(p => p.UserTo == userId || p.UserBy == userId).ToList();
            if (!string.IsNullOrEmpty(search))
            {
                appointments = appointments.Where(p => p.Purpose.Contains(search)).ToList();
            }
            var pager = new Pager(appointments.Count(), page);

            var viewModel = new AppointmentPagerViewModel()
            {
                Appointments = appointments.Skip((pager.CurrentPage - 1) * pager.PageSize).Take(pager.PageSize).Select(x => new Appointment()
                {
                    Id = x.Id,
                    Purpose = x.Purpose,
                    Remarks = x.Remarks,
                    RequestDetails = x.RequestDetails,
                    Time = x.Time,
                    UserTo = x.UserTo,
                    UserBy = x.UserBy,
                    AppointmentStatusId = x.AppointmentStatusId,
                    AppointmentStatu = new AppointmentStatu()
                    {
                        Id = x.AppointmentStatu.Id,
                        Name = x.AppointmentStatu.Name
                    },
                    AspNetUserBy = new AspNetUser()
                    {
                        Id = x.AspNetUserBy.Id,
                        UserName = x.AspNetUserBy.UserName,
                        Email = x.AspNetUserBy.Email
                    },
                    AspNetUserTo = new AspNetUser()
                    {
                        Id = x.AspNetUserTo.Id,
                        UserName = x.AspNetUserTo.UserName,
                        Email = x.AspNetUserTo.Email
                    }
                }),
                Pager = pager
            };

            return Json(viewModel, JsonRequestBehavior.AllowGet);
        }

        // GET: Appointments/Details/5
        public JsonResult Details(int? id)
        {
            if (id == null)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json("No ID entered");
            }
            Appointment appointment = db.Appointments.Find(id);
            if (appointment == null)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json("Could not find object");
            }
            return Json(appointment);
        }


        // POST: Appointments/Create
        [HttpPost]
        public ActionResult Create(Appointment appointment)
        {
            var userId = System.Web.HttpContext.Current.User.Identity.GetUserId();

            appointment.UserBy = userId;
            appointment.AppointmentStatusId = 1;
            if (ModelState.IsValid)
            {
                db.Appointments.Add(appointment);
                try
                {
                    if (db.SaveChanges() > 0)
                    {
                        return Json(appointment);
                    }
                    else
                    {
                        Response.StatusCode = (int)HttpStatusCode.BadRequest;
                        return Json("Could not find object");
                    }

                }
                catch (System.Data.Entity.Validation.DbEntityValidationException dbEx)
                {
                    Exception raise = dbEx;
                    foreach (var validationErrors in dbEx.EntityValidationErrors)
                    {
                        foreach (var validationError in validationErrors.ValidationErrors)
                        {
                            string message = string.Format("{0}:{1}",
                                validationErrors.Entry.Entity.ToString(),
                                validationError.ErrorMessage);
                            // raise a new exception nesting
                            // the current instance as InnerException
                            raise = new InvalidOperationException(message, raise);
                        }
                    }
                    throw raise;
                }
            }
            Response.StatusCode = (int)HttpStatusCode.BadRequest;
            return Json("Could not find object");
        }

        // POST: Appointments/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "Id,UserBy,UserTo,Purpose,RequestDetails,Remarks,Time,AppointmentStatusId")] Appointment appointment)
        {
            if (ModelState.IsValid)
            {
                db.Entry(appointment).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.UserBy = new SelectList(db.AspNetUsers, "Id", "Email", appointment.UserBy);
            ViewBag.UserTo = new SelectList(db.AspNetUsers, "Id", "Email", appointment.UserTo);
            ViewBag.AppointmentStatusId = new SelectList(db.AppointmentStatus, "Id", "Name", appointment.AppointmentStatusId);
            return View(appointment);
        }

        [HttpPost]
        public ActionResult ApproveAppointment(Appointment appointment)
        {
            var userId = System.Web.HttpContext.Current.User.Identity.GetUserId();
            if (appointment.UserTo != userId)
            {
                Response.StatusCode = (int) HttpStatusCode.Forbidden;
                return Json("Sorry, you are not authorized to do that.");
            }
            var Appointment = db.Appointments.Find(appointment.Id);
            Appointment.Remarks = appointment.Remarks;
//            Appointment.Time = appointment.Time;
            Appointment.Time = DateTime.Now;
            Appointment.AppointmentStatusId = appointment.AppointmentStatusId;
            if (ModelState.IsValid)
            {
                db.Entry(Appointment).State = EntityState.Modified;
                if (db.SaveChanges() > 0)
                {
                    return Json(appointment);
                }
            }
            Response.StatusCode = (int)HttpStatusCode.BadRequest;
            return Json("Could not find object");
        }

        // GET: Appointments/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Appointment appointment = db.Appointments.Find(id);
            if (appointment == null)
            {
                return HttpNotFound();
            }
            return View(appointment);
        }

        // POST: Appointments/Delete/5
        [HttpPost]
        public JsonResult Delete(int id)
        {
            Appointment appointment = db.Appointments.Find(id);
            db.Appointments.Remove(appointment);
            if (db.SaveChanges() > 0)
            {
                return Json("");
            }
            else
            {
                Response.StatusCode = (int) HttpStatusCode.BadRequest;
                return Json("");
            }
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
