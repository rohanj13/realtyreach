using System.Runtime.Intrinsics.Arm;
using Microsoft.EntityFrameworkCore;
using RealtyReachApi.Models;

namespace RealtyReachApi.Data
{
    public class SharedDbContext : DbContext
    {
        public SharedDbContext(DbContextOptions<SharedDbContext> options) : base(options) { }

        public DbSet<Job> Jobs { get; set; }
        public DbSet<JobDetail> JobDetails { get; set; }

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
                .WithOne(rd => rd.Job)
                .HasForeignKey<JobDetail>(rd => rd.JobId);

            modelBuilder.Entity<JobDetail>()
                .HasOne(r => r.Job)
                .WithOne(r => r.JobDetails)
                .HasForeignKey<JobDetail>(rd => rd.JobId)
                .IsRequired();
        }
    }
}
