using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using RealtyReachApi.Models;

namespace RealtyReachApi.Data
{
    public class SharedDbContext : DbContext
    {
        public SharedDbContext(DbContextOptions<SharedDbContext> options) : base(options) { }

        public DbSet<Job> Jobs { get; set; }
        public DbSet<JobDetail> JobDetails { get; set; }
        public DbSet<Admin> Admins { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Professional> Professionals { get; set; }
        public DbSet<ProfessionalType> ProfessionalTypes { get; set; }
        public DbSet<JobDetailProfessionalType> JobProfessionalTypes { get; set; }
        public DbSet<JobDetailProfessionalType> JobDetailProfessionalTypes { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<JobDetailProfessionalType>()
                .HasKey(jdpt => new { jdpt.JobDetailId, jdpt.ProfessionalTypeId });
            modelBuilder.Entity<JobDetailProfessionalType>()
                .HasOne(jdpt => jdpt.JobDetail)
                .WithMany(jd => jd.JobDetailProfessionalTypes)
                .HasForeignKey(jdpt => jdpt.JobDetailId);
            modelBuilder.Entity<JobDetailProfessionalType>()
                .HasOne(jdpt => jdpt.ProfessionalType)
                .WithMany(pt => pt.JobDetailProfessionalTypes)
                .HasForeignKey(jdpt => jdpt.ProfessionalTypeId);
        }
    }
}
