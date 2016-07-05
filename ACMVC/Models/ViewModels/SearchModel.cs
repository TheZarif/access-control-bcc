using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ACMVC.Models.ViewModels
{
    public class SearchModel
    {
        public DateTime dateFrom { get; set; }
        public DateTime dateTo { get; set; }
        public string dummySearch { get; set; }
    }
}