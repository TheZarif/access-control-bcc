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
            
            List<Official> officials = new List<Official>();
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
               
                officialViewModels.Add(officialViewModel);
            }
            officialListViewModel.Officials = officialViewModels;
            return View("OfficialsList", officialListViewModel);
        }


    }
}