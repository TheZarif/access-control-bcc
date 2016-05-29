using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ACMVC.DAL;

namespace ACMVC.Models.ViewModels
{
    public class UserViewModel
    {
        public IEnumerable<AspNetUser> Users { get; set; }
        public Pager Pager { get; set; }
    }
}