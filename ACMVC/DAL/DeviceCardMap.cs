//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace ACMVC.DAL
{
    using System;
    using System.Collections.Generic;
    
    public partial class DeviceCardMap
    {
        public int Id { get; set; }
        public int DeviceId { get; set; }
        public int CardId { get; set; }
        public int StatusId { get; set; }
        public System.DateTime AssignTime { get; set; }
        public System.DateTime ExpireTime { get; set; }
        public string Note { get; set; }
    
        public virtual CardInfo CardInfo { get; set; }
        public virtual Device Device { get; set; }
        public virtual Status Status { get; set; }
    }
}
