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
        public DbSet<Professional?> Professionals { get; set; }
        public DbSet<ProfessionalType> ProfessionalTypes { get; set; }
        public DbSet<JobProfessionalLink> JobProfessionalLinks {get; set;}
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            modelBuilder.Entity<Job>()
                .HasOne(j => j.Customer)
                .WithMany(c => c.Jobs)
                .HasForeignKey(j => j.CustomerId);
            
            modelBuilder.Entity<Job>()
                .HasOne(j => j.JobDetails)
                .WithOne(d => d.Job)
                .HasForeignKey<JobDetail>(d => d.JobId);
            
            modelBuilder.Entity<Job>().ToTable("Jobs");
            modelBuilder.Entity<JobDetail>().ToTable("JobDetails");
            
            modelBuilder.Entity<JobProfessionalLink>()
                .HasKey(jp => new { jp.JobDetailId, jp.ProfessionalId });
            
            modelBuilder.Entity<JobProfessionalLink>()
                .HasOne(jp => jp.JobDetail)
                .WithMany(d => d.JobProfessionalLinks)
                .HasForeignKey(jp => jp.JobDetailId);
            
            modelBuilder.Entity<JobProfessionalLink>()
                .HasOne(jp => jp.Professional)
                .WithMany(p => p.JobProfessionalLinks)
                .HasForeignKey(jp => jp.ProfessionalId);

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

            modelBuilder.Entity<ProfessionalType>().HasData(
                new ProfessionalType
                {
                    ProfessionalTypeId = (int)ProfessionalType.ProfessionalTypeEnum.Advocate, TypeName = "Buyer's Advocate",
                    Description = "Real Estate Professional representing a buyer"
                },
                new ProfessionalType
                {
                    ProfessionalTypeId = (int)ProfessionalType.ProfessionalTypeEnum.Broker, TypeName = "Broker",
                    Description = "Real estate brokers"
                },
                new ProfessionalType
                {
                    ProfessionalTypeId = (int)ProfessionalType.ProfessionalTypeEnum.Conveyancer,
                    TypeName = "Conveyancer", Description = "Legal Professional"
                },
                new ProfessionalType
                {
                    ProfessionalTypeId = (int)ProfessionalType.ProfessionalTypeEnum.BuildAndPest,
                    TypeName = "Build and Pest", Description = "Building and pest inspectors"
                }
            );

        }
    }
}
