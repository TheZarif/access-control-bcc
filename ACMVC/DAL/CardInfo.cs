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
    
    public partial class CardInfo
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public CardInfo()
        {
            this.CardLogs = new HashSet<CardLog>();
            this.DeviceCardMaps = new HashSet<DeviceCardMap>();
            this.UserCardMaps = new HashSet<UserCardMap>();
        }
    
        public int Id { get; set; }
        public string Number { get; set; }
        public string Notes { get; set; }
        public int StatusId { get; set; }
    
        public virtual Status Status { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<CardLog> CardLogs { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<DeviceCardMap> DeviceCardMaps { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<UserCardMap> UserCardMaps { get; set; }
    }
}
