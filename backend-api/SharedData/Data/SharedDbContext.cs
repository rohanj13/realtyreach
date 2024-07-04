using Microsoft.EntityFrameworkCore;
using SharedData.Models;

namespace SharedData.Data
{
    public class SharedDbContext : DbContext
    {
        public SharedDbContext(DbContextOptions<SharedDbContext> options)
            : base(options)
        {
        }

        public DbSet<Request> Requests { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Request>()
                .Property(r => r.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            modelBuilder.Entity<Request>()
                .Property(r => r.UpdatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
        }
    }
}
