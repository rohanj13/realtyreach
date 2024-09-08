using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using RealtyReachApi.Models;

namespace RealtyReachApi.Data
{
    public class SharedDbContext : IdentityDbContext<IdentityUser>
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
                .WithOne(rd => rd.job)
                .HasForeignKey<JobDetail>(rd => rd.JobId);

            modelBuilder.Entity<JobDetail>()
                .HasOne(r => r.job)
                .WithOne(r => r.JobDetails)
                .HasForeignKey<JobDetail>(rd => rd.JobId)
                .IsRequired();



            // Customize the ASP.NET Identity table names
            modelBuilder.Entity<IdentityUser>(b =>
            {
                b.ToTable("Users"); // Change the default table name to "Users"
            });

            modelBuilder.Entity<IdentityRole>(b =>
            {
                b.ToTable("Roles"); // Change the default table name to "Roles"
            });

            modelBuilder.Entity<IdentityUserRole<string>>(b =>
            {
                b.ToTable("UserRoles"); // Change the default table name to "UserRoles"
            });

            modelBuilder.Entity<IdentityUserClaim<string>>(b =>
            {
                b.ToTable("UserClaims"); // Change the default table name to "UserClaims"
            });

            modelBuilder.Entity<IdentityUserLogin<string>>(b =>
            {
                b.ToTable("UserLogins"); // Change the default table name to "UserLogins"
            });

            modelBuilder.Entity<IdentityRoleClaim<string>>(b =>
            {
                b.ToTable("RoleClaims"); // Change the default table name to "RoleClaims"
            });

            modelBuilder.Entity<IdentityUserToken<string>>(b =>
            {
                b.ToTable("UserTokens"); // Change the default table name to "UserTokens"
            });

        }
    }
}
