using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.IO;
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

        public JsonResult GetAll(int? page, string search, string selectedFilter)
        {
            var filter = false;
            var isEmployee = false;

            switch (selectedFilter)
            {
                case "employee":
                    isEmployee = true;
                    filter = true;
                    break;
                case "visitor":
                    filter = true;
                    break;
            }

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

            if (filter)
            {
                users = users.Where(p => p.IsEmployee == isEmployee).ToList();
            }

            var pager = new Pager(users.Count(), page);
            
            var viewModel = new UserViewModel()
            {
                Users = users.Skip((pager.CurrentPage - 1) * pager.PageSize).Take(pager.PageSize).Select(x => new AspNetUser()
                {
                    Id = x.Id,
                    Email  = x.Email,
                    PhoneNumber = x.PhoneNumber,
                    FullName = x.FullName,
                    DeskFloor = x.DeskFloor,
                    IsEmployee = x.IsEmployee,
                    IsVerified = x.IsVerified,
                    UserName = x.UserName,
                    AspNetRoles = x.AspNetRoles.Select(p => new AspNetRole() { Id = p.Id, Name = p.Name }).ToList()
                }).ToList(),
                Pager = pager
            };
            return Json(viewModel, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetByDesignation()
        {
            List<Designation> designations = db.Designations.OrderByDescending(x => x.Order).ToList();
            List<AspNetUser> users;

            designations = designations.Select(x => new Designation()
            {
                Id = x.Id,
                Name = x.Name,
                AspNetUsers = x.AspNetUsers.Select( u => new AspNetUser()
                {
                    Id = u.Id,
                    FullName = u.FullName,
                    PhoneNumber = u.PhoneNumber,
                    Email = u.Email, 
                    ProfilePicUrl = u.ProfilePicUrl
                }).ToList()
            }).ToList();
            
            
            return Json(designations, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult AddAccessZone(String userId, AccessZone accessZone)
        {
            if (userId != null && accessZone != null)
            {
                var user = db.AspNetUsers.Find(userId);
                if (user != null)
                {
                    user.EmployeeAccessZoneMaps.Add(new EmployeeAccessZoneMap() { UserId = userId, AccessZone = accessZone });
                    if (db.SaveChanges() > 0)
                    {
                        return Json("");
                    }
                }
            }

            Response.StatusCode = (int)HttpStatusCode.BadRequest;
            return Json("Could not find object");
        }

        [HttpPost]
        public JsonResult RemoveAccessZone(String userId, AccessZone accessZone)
        {
            if (userId != null && accessZone != null)
            {
                var user = db.AspNetUsers.Find(userId);
                if (user != null)
                {
                    user.EmployeeAccessZoneMaps.Add(new EmployeeAccessZoneMap() { UserId = userId, AccessZone = accessZone });
                    if (db.SaveChanges() > 0)
                    {
                        return Json("");
                    }
                }
            }

            Response.StatusCode = (int)HttpStatusCode.BadRequest;
            return Json("Could not find object");
        }

        [HttpPost]
        public JsonResult SearchUser(String searchModel)
        {
            if (!string.IsNullOrEmpty(searchModel))
            {
                var results = db.AspNetUsers.Where(p => p.Email.Contains(searchModel) || p.FullName.Contains(searchModel) || p.PhoneNumber.Contains(searchModel) ).Take(5);
                if (results != null)
                {
                    return Json(
                        results.Select(x => new {
                        Id = x.Id,
                        Email = x.Email,
                        PhoneNumber = x.PhoneNumber,
                        UserName = x.UserName,
                        Designation = new {Name = x.Designation.Name},
                        FullName = x.FullName,
                        DisplayName = "[" + x.FullName + "] [" + x.Email + "] [" + x.Designation.Name + "]"
                    }), JsonRequestBehavior.AllowGet);
                }
            }
            Response.StatusCode = (int)HttpStatusCode.BadRequest;
            return Json("Could not find object");
        }

        [HttpPost]
        public JsonResult SearchVisitor(String searchModel)
        {
            if (!string.IsNullOrEmpty(searchModel))
            {
                var results = db.AspNetUsers.Where(p => p.IsEmployee == false && (p.Email.Contains(searchModel) || p.FullName.Contains(searchModel) || p.PhoneNumber.Contains(searchModel))).Take(5);
                if (results.Any())
                {
                    return Json(
                        results.Select(x => new {
                            Id = x.Id,
                            Email = x.Email,
                            PhoneNumber = x.PhoneNumber,
                            FullName = x.FullName,
                            DisplayName = "[" + x.FullName + "] [" + x.Email + "] [" + x.PhoneNumber+ "]"
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

        [HttpPost]
        public JsonResult EditType(AspNetUser user, bool isEmployee)
        {
            var User = db.AspNetUsers.First(p => p.Id == user.Id);
            User.IsEmployee = isEmployee;

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
                    Designation = aspNetUser.Designation != null?  new Designation() {Id = aspNetUser.Designation.Id, Name = aspNetUser.Designation.Name, Order = aspNetUser.Designation.Order} : null,
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
                    SummaryNote = aspNetUser.SummaryNote,
                    IsEmployee = aspNetUser.IsEmployee
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

        [HttpPost]
        public JsonResult UpdateUserOfficial(AspNetUser aspNetUser)
        {
            if (aspNetUser == null) throw new ArgumentNullException(nameof(aspNetUser));
            if (ModelState.IsValid)
            {
                var User = db.AspNetUsers.FirstOrDefault(x => x.Id == aspNetUser.Id);
                if (User == null)
                {
                    Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    return Json("Invalid Object");
                }
//                User.EmployeeAccessZoneMaps.Add();
                User.IsEmployee = aspNetUser.IsEmployee;
                User.EmployeeId = aspNetUser.EmployeeId;
                User.DesignationId = aspNetUser.Designation.Id;
                User.RoomNo = aspNetUser.RoomNo;
                User.WorkDivision = aspNetUser.WorkDivision;
                User.SummaryNote = aspNetUser.SummaryNote;


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


        [HttpPost]
        public JsonResult UploadFile(String id)
        {
            if (Request.Files != null && Request.Files.Count > 0 && !string.IsNullOrEmpty(id))
            {
                var User = db.AspNetUsers.Find(id);

                var file = Request.Files[0];
                var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
                var fileSrc = Path.Combine(Server.MapPath("~/UploadedFiles"), fileName);

                try
                {
                    file.SaveAs(Path.Combine(Server.MapPath("~/UploadedFiles"), fileName));
                    var oldFile = User.ProfilePicUrl;
                    if (System.IO.File.Exists(oldFile))
                    {
                        System.IO.File.Delete(oldFile);
                    }
                    User.ProfilePicUrl = fileSrc;
                    db.Entry(User).State = EntityState.Modified;
                    if (db.SaveChanges() > 0)
                    {
                        return Json(fileSrc);
                    }
                    else
                    {
                        Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                        return Json("Database Error");
                    }
                }
                catch
                {
                    Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    return Json("Couldn't save file");
                }
            }
            Response.StatusCode = (int)HttpStatusCode.BadRequest;
            return Json("");
        }

        public JsonResult ProfileCompletionPercent(string userId)
        {
            AspNetUser User = db.AspNetUsers.Find(userId);
            int count = 0, total = 9, percent;

            if (User.BloodGroup != null) count++;
            if (User.FullName != null) count++;
            if (User.Gender != null) count++;
            if (User.NId != null) count++;
            if (User.PhoneNumber != null) count++;
            if (User.PermanentAddress != null) count++;
            if (User.PresentAddress != null) count++;
            if (User.Profession != null) count++;
            if (User.ProfilePicUrl != null) count++;

            percent = (int)(count / (float)total * 100);

            return Json(percent, JsonRequestBehavior.AllowGet);

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
