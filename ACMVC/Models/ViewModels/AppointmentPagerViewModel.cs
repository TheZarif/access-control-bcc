using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ACMVC.DAL;

namespace ACMVC.Models.ViewModels
{
    public class AppointmentPagerViewModel
    {
        public IEnumerable<Appointment> Appointments { get; set; }
        public Pager Pager { get; set; }
    }
}