using System.Runtime.Intrinsics.Arm;
using Microsoft.EntityFrameworkCore;
using RealtyReachApi.Models;

namespace RealtyReachApi.Data
{
    public class SharedDbContext : DbContext
    {
        public SharedDbContext(DbContextOptions<SharedDbContext> options) : base(options) { }

        public DbSet<Request> Requests { get; set; }
        public DbSet<RequestDetail> RequestDetails { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Request>().ToTable("Requests");
            modelBuilder.Entity<RequestDetail>().ToTable("RequestDetails");

            modelBuilder.Entity<Request>()
                .HasKey(r => r.RequestId);

            modelBuilder.Entity<RequestDetail>()
                .HasKey(rd => rd.RequestDetailId);

            modelBuilder.Entity<Request>()
                .HasOne(rd => rd.RequestDetails)
                .WithOne(rd => rd.Request)
                .HasForeignKey<RequestDetail>(rd => rd.RequestId);

            modelBuilder.Entity<RequestDetail>()
                .HasOne(r => r.Request)
                .WithOne(r => r.RequestDetails)
                .HasForeignKey<RequestDetail>(rd => rd.RequestId)
                .IsRequired();
        }
    }
}
