using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ACMVC.DAL;

namespace ACMVC.Models.ViewModels
{
    public class ViewModel<T>
    {
        public IEnumerable<T> Items { get; set; }
        public Pager Pager { get; set; }
    }
}