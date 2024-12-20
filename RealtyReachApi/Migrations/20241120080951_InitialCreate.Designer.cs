﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using RealtyReachApi.Data;

#nullable disable

namespace RealtyReachApi.Migrations
{
    [DbContext(typeof(SharedDbContext))]
    [Migration("20241120080951_InitialCreate")]
    partial class InitialCreate
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.7")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("RealtyReachApi.Models.Admin", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("userId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("Admins");
                });

            modelBuilder.Entity("RealtyReachApi.Models.Customer", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Email")
                        .HasColumnType("text");

                    b.Property<string>("FirstName")
                        .HasColumnType("text");

                    b.Property<string>("LastName")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("Customers");
                });

            modelBuilder.Entity("RealtyReachApi.Models.Job", b =>
                {
                    b.Property<int>("JobId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("JobId"));

                    b.Property<string>("AdditionalDetails")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("JobTitle")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("JobType")
                        .IsRequired()
                        .HasMaxLength(10)
                        .HasColumnType("character varying(10)");

                    b.Property<int>("Status")
                        .HasColumnType("integer");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("JobId");

                    b.ToTable("Jobs", (string)null);
                });

            modelBuilder.Entity("RealtyReachApi.Models.JobDetail", b =>
                {
                    b.Property<int>("JobDetailId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("JobDetailId"));

                    b.Property<int>("BudgetMax")
                        .HasColumnType("integer");

                    b.Property<int>("BudgetMin")
                        .HasColumnType("integer");

                    b.Property<string>("ContactEmail")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("ContactPhone")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("JobId")
                        .HasColumnType("integer");

                    b.Property<string>("JourneyProgress")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Postcode")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("PropertyType")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("PurchaseType")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string[]>("SelectedProfessionals")
                        .IsRequired()
                        .HasColumnType("text[]");

                    b.HasKey("JobDetailId");

                    b.HasIndex("JobId")
                        .IsUnique();

                    b.ToTable("JobDetails", (string)null);
                });

            modelBuilder.Entity("RealtyReachApi.Models.Professional", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("ABN")
                        .HasColumnType("text");

                    b.Property<string>("CompanyName")
                        .HasColumnType("text");

                    b.Property<string>("Email")
                        .HasColumnType("text");

                    b.Property<string>("FirstName")
                        .HasColumnType("text");

                    b.Property<string>("LastName")
                        .HasColumnType("text");

                    b.Property<string>("LicenseNumber")
                        .HasColumnType("text");

                    b.Property<bool>("VerificationStatus")
                        .HasColumnType("boolean");

                    b.HasKey("Id");

                    b.ToTable("Professionals");
                });

            modelBuilder.Entity("RealtyReachApi.Models.JobDetail", b =>
                {
                    b.HasOne("RealtyReachApi.Models.Job", "job")
                        .WithOne("JobDetails")
                        .HasForeignKey("RealtyReachApi.Models.JobDetail", "JobId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("job");
                });

            modelBuilder.Entity("RealtyReachApi.Models.Job", b =>
                {
                    b.Navigation("JobDetails")
                        .IsRequired();
                });
#pragma warning restore 612, 618
        }
    }
}
