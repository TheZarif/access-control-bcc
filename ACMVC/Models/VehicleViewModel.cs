using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ACMVC.DAL;

namespace ACMVC.Models
{
    public class VehicleViewModel
    {
        public IEnumerable<VehicleInfo> Vehicles { get; set; }
        public Pager Pager { get; set; }
    }
}