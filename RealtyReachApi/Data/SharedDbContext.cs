using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using RealtyReachApi.Models;

namespace RealtyReachApi.Data
{
    public class SharedDbContext : DbContext
    {
        public SharedDbContext(DbContextOptions<SharedDbContext> options) : base(options) { }

        public DbSet<Job?> Jobs { get; set; }
        public DbSet<JobDetail> JobDetails { get; set; }
        public DbSet<Admin> Admins { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Professional> Professionals { get; set; }
        public DbSet<ProfessionalType> ProfessionalTypes { get; set; }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure the relationship between Job and JobDetail (one-to-one)
            modelBuilder.Entity<Job>()
                .HasOne(j => j.JobDetails)
                .WithOne(jd => jd.AssociatedJob)
                .HasForeignKey<JobDetail>(jd => jd.JobId);
            
            // Configure the many-to-many relationship between Job and Professional via JobProfessionalLink
            modelBuilder.Entity<JobProfessionalLink>()
                .HasKey(jp => new { jp.JobId, jp.ProfessionalId });
            
            modelBuilder.Entity<ProfessionalType>().HasData(
                new ProfessionalType { Id = (int)ProfessionalType.ProfessionalTypeEnum.Advocate, TypeName = "Advocate", Description = "Legal professionals" },
                new ProfessionalType { Id = (int)ProfessionalType.ProfessionalTypeEnum.Broker, TypeName = "Broker", Description = "Real estate brokers" },
                new ProfessionalType { Id = (int)ProfessionalType.ProfessionalTypeEnum.BuildAndPest, TypeName = "Build and Pest", Description = "Building and pest inspectors" }
            );
        }
    }
}
