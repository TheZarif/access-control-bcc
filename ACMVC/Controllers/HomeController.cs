using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using ACMVC.DAL;
using ACMVC.Models;
using ACMVC.Models.ViewModels;
using ACMVC.ViewModels;

namespace ACMVC.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
        public ActionResult dash()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
        //public ActionResult OfficialsList()
        //{
        //    ViewBag.Message = "Your contact page.";

        //    return View();
        //}
        public ActionResult OfficialsList()
        {
            OfficialListViewModel officialListViewModel = new OfficialListViewModel();

            TestEntities testEntities = new TestEntities();
            List<Designation> designations = testEntities.Designations.OrderByDescending(x => x.Order).ToList();
           
           designations = designations.Select(x => new Designation()
            {
                Id = x.Id,
                Name = x.Name,
                AspNetUsers = x.AspNetUsers.Select(u => new AspNetUser()
                {
                    Id = u.Id,
                    FullName = u.FullName,
                    PhoneNumber = u.PhoneNumber,
                    Email = u.Email,
                    ProfilePicUrl = u.ProfilePicUrl
                }).ToList()
            }).ToList();
            
            //List<AspNetUser> users = testEntities.AspNetUsers.ToList();
            List<Official> officials = new List<Official>();
            //var filter = false;
            //var isEmployee = false;
            //if (filter)
            //{
            //    users = users.Where(p => p.IsEmployee == isEmployee).ToList();
            //}
            List<OfficialViewModel> officialViewModels = new List<OfficialViewModel>();
            foreach (var item in designations)
            {
                OfficialViewModel officialViewModel = new OfficialViewModel();
                List<AspNetUser> aspNetUsers = new List<AspNetUser>();
                officialViewModel.Designation = item.Name;
                aspNetUsers = item.AspNetUsers.ToList();
                foreach (var userinfo in aspNetUsers)
                {
                    officialViewModel.OfficialName = userinfo.FullName;
                    officialViewModel.Email = userinfo.Email;
                    officialViewModel.Phone = userinfo.PhoneNumber;
                }
                //officialViewModel.OfficialName = "Atib";//item.FullName;
                //officialViewModel.Designation = "Jr";//item.Designation.ToString();
                //officialViewModel.Email = "at@test.com";//item.Email;
                //officialViewModel.Phone = "01671172387";//item.PhoneNumber;
                officialViewModels.Add(officialViewModel);
            }

            officialListViewModel.Officials = officialViewModels;

            return View("OfficialsList", officialListViewModel);

            //var pager = new Pager(users.Count(), 1);

            //var viewModel = new UserViewModel()
            //{
            //    Users = users.Skip((pager.CurrentPage - 1) * pager.PageSize).Take(pager.PageSize).Select(x => new AspNetUser()
            //    {
            //        Id = x.Id,
            //        Email = x.Email,
            //        PhoneNumber = x.PhoneNumber,
            //        FullName = x.FullName,
            //        DeskFloor = x.DeskFloor,
            //        IsEmployee = x.IsEmployee,
            //        IsVerified = x.IsVerified,
            //        EmployeeAccessZoneMaps = x.EmployeeAccessZoneMaps.Select(m => new EmployeeAccessZoneMap
            //        {
            //            Id = m.Id,
            //            UserId = m.UserId,
            //            AccessZone = new AccessZone
            //            {
            //                Id = m.AccessZoneId,
            //                Name = m.AccessZone.Name
            //            }
            //        }).ToList(),
            //        UserName = x.UserName,
            //        AspNetRoles = x.AspNetRoles.Select(p => new AspNetRole() { Id = p.Id, Name = p.Name }).ToList()
            //    }).ToList(),
            //    Pager = pager
            //};

            //List<EmployeeViewModel> empViewModels = new List<EmployeeViewModel>();

            //foreach (Employee emp in employees)
            //{
            //    EmployeeViewModel empViewModel = new EmployeeViewModel();
            //    empViewModel.EmployeeName = emp.FirstName + " " + emp.LastName;
            //    empViewModel.Salary = emp.Salary.ToString("C");
            //    if (emp.Salary > 15000)
            //    {
            //        empViewModel.SalaryColor = "yellow";
            //    }
            //    else
            //    {
            //        empViewModel.SalaryColor = "green";
            //    }
            //    empViewModels.Add(empViewModel);
            //}
            //employeeListViewModel.Employees = empViewModels;
            //return View("EmployeeList", employeeListViewModel);
        }


    }
}