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


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Job>().ToTable("Jobs");
            modelBuilder.Entity<JobDetail>().ToTable("JobDetails");

            modelBuilder.Entity<Job>()
                .HasKey(r => r.JobId);

            modelBuilder.Entity<JobDetail>()
                .HasKey(rd => rd.JobDetailId);

            modelBuilder.Entity<Job>()
                .HasOne(rd => rd.JobDetails)
                .WithOne(rd => rd.job)
                .HasForeignKey<JobDetail>(rd => rd.JobId);

            modelBuilder.Entity<JobDetail>()
                .HasOne(r => r.job)
                .WithOne(r => r.JobDetails)
                .HasForeignKey<JobDetail>(rd => rd.JobId)
                .IsRequired();

        }
    }
}
