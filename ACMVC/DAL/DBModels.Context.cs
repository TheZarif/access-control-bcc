﻿//------------------------------------------------------------------------------
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
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class TestEntities : DbContext
    {
        public TestEntities()
            : base("name=TestEntities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<AccessZone> AccessZones { get; set; }
        public virtual DbSet<AspNetRole> AspNetRoles { get; set; }
        public virtual DbSet<AspNetUser> AspNetUsers { get; set; }
        public virtual DbSet<CardInfo> CardInfoes { get; set; }
        public virtual DbSet<CardLog> CardLogs { get; set; }
        public virtual DbSet<Device> Devices { get; set; }
        public virtual DbSet<DeviceCardMap> DeviceCardMaps { get; set; }
        public virtual DbSet<EmployeeAccessZoneMap> EmployeeAccessZoneMaps { get; set; }
        public virtual DbSet<Status> Status { get; set; }
        public virtual DbSet<UserCardMap> UserCardMaps { get; set; }
        public virtual DbSet<VehicleInfo> VehicleInfoes { get; set; }
        public virtual DbSet<Appointment> Appointments { get; set; }
        public virtual DbSet<AppointmentStatu> AppointmentStatus { get; set; }
        public virtual DbSet<DeviceType> DeviceTypes { get; set; }
    }
}
