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
    public class UsersController : Controller
    {
        private TestEntities db = new TestEntities();

        public JsonResult GetAll(int? page, string search)
        {
            List<AspNetUser> users;
            if (!string.IsNullOrEmpty(search))
            {
                users = db.AspNetUsers.Where(p => (p.Email.Contains(search)) || (p.PhoneNumber.Contains(search)))
                    .ToList();
            }
            else
            {
                users = db.AspNetUsers.ToList();
            }
            var pager = new Pager(users.Count(), page);
            
            var viewModel = new UserViewModel()
            {
                Users = users.Skip((pager.CurrentPage - 1) * pager.PageSize).Take(pager.PageSize).Select(x => new AspNetUser()
                {
                    Id = x.Id,
                    Email  = x.Email,
                    PhoneNumber = x.PhoneNumber,
                    Designation = x.Designation,
                    DeskFloor = x.DeskFloor,
                    IsVerified = x.IsVerified,
                    UserName = x.UserName,
                    AspNetRoles = x.AspNetRoles.Select(p => new AspNetRole()
                    {
                        Id = p.Id,
                        Name = p.Name
                    }).ToList()
                }),
                Pager = pager
            };
            return Json(viewModel, JsonRequestBehavior.AllowGet);
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
                        PhoneNumber = x.PhoneNumber,
                        UserName = x.UserName
                    }), JsonRequestBehavior.AllowGet);
                }
            }
            Response.StatusCode = (int)HttpStatusCode.BadRequest;
            return Json("Could not find object");
        }

//        public JsonResult GetAll()
//        {
//            var users = db.AspNetUsers.ToList();
//            return Json(
//                users.Select(x => new {
//                    Id = x.Id,
//                    Email = x.Email,
//                    Name = x.Email,
//                    Role = "Admin",
//                    Phone = x.PhoneNumber
//                }), JsonRequestBehavior.AllowGet);
//        }

        [HttpPost]
        public JsonResult AddRole(AspNetUser user, AspNetRole role)
        {
            var User = db.AspNetUsers.First(p => p.Id == user.Id);
            var Role = db.AspNetRoles.First(p => p.Id == role.Id);
            User.AspNetRoles.Add(Role);
            if (db.SaveChanges() > 0)
            {
                return Json("");
            }
            else
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json("Something went wrong");
            }
        }

        [HttpPost]
        public JsonResult RemoveRole(AspNetUser user, AspNetRole role)
        {
            var User = db.AspNetUsers.First(p => p.Id == user.Id);
            var Role = db.AspNetRoles.First(p => p.Id == role.Id);
            User.AspNetRoles.Remove(Role);
            if (db.SaveChanges() > 0)
            {
                return Json("");
            }
            else
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json("Something went wrong");
            }
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
                return Json(new AspNetUser()
                {
                    Email = aspNetUser.Email,
                    AspNetRoles = aspNetUser.AspNetRoles.Select(x => new AspNetRole() {Id = x.Id, Name = x.Name}).ToList(),
                    Id = aspNetUser.Id,
                    UserName = aspNetUser.UserName,
                    FullName = aspNetUser.FullName,
                    PhoneNumber = aspNetUser.PhoneNumber,
                    Designation = aspNetUser.Designation,
                    IsVerified = aspNetUser.IsVerified,
                    DeskFloor = aspNetUser.DeskFloor,
                    BloodGroup = aspNetUser.BloodGroup,
                    EmployeeId = aspNetUser.EmployeeId,
                    Gender = aspNetUser.Gender,
                    NId = aspNetUser.NId,
                    PermanentAddress = aspNetUser.PermanentAddress,
                    PresentAddress = aspNetUser.PresentAddress,
                    Profession = aspNetUser.Profession,
                    ProfilePicUrl = aspNetUser.ProfilePicUrl,
                    UserGroup = aspNetUser.UserGroup,
                    WorkDivision = aspNetUser.WorkDivision,
                    SummaryNote = aspNetUser.SummaryNote
                }, JsonRequestBehavior.AllowGet);
            }
            Response.StatusCode = (int)HttpStatusCode.BadRequest;
            return Json("Could not find object");
        }
        
        // POST: Users/Edit/5
        [HttpPost]
        public JsonResult UpdateUser(AspNetUser aspNetUser)
        {
            if (ModelState.IsValid)
            {
                var User = db.AspNetUsers.FirstOrDefault(x => x.Id == aspNetUser.Id);
                if (User == null)
                {
                    Response.StatusCode = (int) HttpStatusCode.BadRequest;
                    return Json("Invalid Object");
                }

                User.FullName = aspNetUser.FullName;
                User.BloodGroup = aspNetUser.BloodGroup;
                User.Gender= aspNetUser.Gender;
                User.NId = aspNetUser.NId;
                User.PresentAddress = aspNetUser.PresentAddress;
                User.PermanentAddress = aspNetUser.PermanentAddress;
                User.PhoneNumber = aspNetUser.PhoneNumber;
                User.Profession = aspNetUser.Profession;


                db.Entry(User).State = EntityState.Modified;
                try
                {
                    if (db.SaveChanges() > 0)
                    {
                        return Json("");
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
            return Json("");
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
