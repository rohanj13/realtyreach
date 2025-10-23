using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace RealtyReachApi.Migrations
{
    /// <inheritdoc />
    public partial class INITIALCREATE : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Admins",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    userId = table.Column<string>(type: "text", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Admins", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Customers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: true),
                    FirstName = table.Column<string>(type: "text", nullable: true),
                    LastName = table.Column<string>(type: "text", nullable: true),
                    FirstLogin = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Customers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ProfessionalTypes",
                columns: table => new
                {
                    ProfessionalTypeId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TypeName = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProfessionalTypes", x => x.ProfessionalTypeId);
                });

            migrationBuilder.CreateTable(
                name: "Suburbs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Postcode = table.Column<string>(type: "text", nullable: false),
                    Locality = table.Column<string>(type: "text", nullable: false),
                    Region = table.Column<string>(type: "text", nullable: false),
                    State = table.Column<string>(type: "text", nullable: false),
                    Longitude = table.Column<double>(type: "double precision", nullable: false),
                    Latitude = table.Column<double>(type: "double precision", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Suburbs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Jobs",
                columns: table => new
                {
                    JobId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CustomerId = table.Column<Guid>(type: "uuid", nullable: false),
                    JobTitle = table.Column<string>(type: "text", nullable: false),
                    JobType = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    AdditionalDetails = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Jobs", x => x.JobId);
                    table.ForeignKey(
                        name: "FK_Jobs_Customers_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Customers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Professionals",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ProfessionalTypeId = table.Column<int>(type: "integer", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: true),
                    FirstName = table.Column<string>(type: "text", nullable: true),
                    LastName = table.Column<string>(type: "text", nullable: true),
                    ABN = table.Column<string>(type: "text", nullable: true),
                    LicenseNumber = table.Column<string>(type: "text", nullable: true),
                    VerificationStatus = table.Column<bool>(type: "boolean", nullable: false),
                    CompanyName = table.Column<string>(type: "text", nullable: true),
                    Regions = table.Column<List<string>>(type: "text[]", nullable: true),
                    States = table.Column<int[]>(type: "integer[]", nullable: true),
                    Specialisations = table.Column<int[]>(type: "integer[]", nullable: true),
                    FirstLogin = table.Column<bool>(type: "boolean", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Professionals", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Professionals_ProfessionalTypes_ProfessionalTypeId",
                        column: x => x.ProfessionalTypeId,
                        principalTable: "ProfessionalTypes",
                        principalColumn: "ProfessionalTypeId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "JobDetails",
                columns: table => new
                {
                    JobDetailId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    JobId = table.Column<int>(type: "integer", nullable: false),
                    Regions = table.Column<List<string>>(type: "text[]", nullable: true),
                    States = table.Column<int[]>(type: "integer[]", nullable: true),
                    Specialisations = table.Column<int[]>(type: "integer[]", nullable: true),
                    PurchaseType = table.Column<string>(type: "text", nullable: false),
                    PropertyType = table.Column<string>(type: "text", nullable: false),
                    JourneyProgress = table.Column<string>(type: "text", nullable: false),
                    SelectedProfessionals = table.Column<string[]>(type: "text[]", nullable: false),
                    SuggestedProfessionalIds = table.Column<Guid[]>(type: "uuid[]", nullable: true),
                    BudgetMin = table.Column<int>(type: "integer", nullable: false),
                    BudgetMax = table.Column<int>(type: "integer", nullable: false),
                    ContactEmail = table.Column<string>(type: "text", nullable: false),
                    ContactPhone = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JobDetails", x => x.JobDetailId);
                    table.ForeignKey(
                        name: "FK_JobDetails_Jobs_JobId",
                        column: x => x.JobId,
                        principalTable: "Jobs",
                        principalColumn: "JobId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "JobDetailProfessionalType",
                columns: table => new
                {
                    JobDetailsJobDetailId = table.Column<int>(type: "integer", nullable: false),
                    ProfessionalTypesProfessionalTypeId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JobDetailProfessionalType", x => new { x.JobDetailsJobDetailId, x.ProfessionalTypesProfessionalTypeId });
                    table.ForeignKey(
                        name: "FK_JobDetailProfessionalType_JobDetails_JobDetailsJobDetailId",
                        column: x => x.JobDetailsJobDetailId,
                        principalTable: "JobDetails",
                        principalColumn: "JobDetailId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_JobDetailProfessionalType_ProfessionalTypes_ProfessionalTyp~",
                        column: x => x.ProfessionalTypesProfessionalTypeId,
                        principalTable: "ProfessionalTypes",
                        principalColumn: "ProfessionalTypeId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "JobProfessionalLink",
                columns: table => new
                {
                    JobDetailId = table.Column<int>(type: "integer", nullable: false),
                    ProfessionalId = table.Column<Guid>(type: "uuid", nullable: false),
                    SelectionDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    AssignedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JobProfessionalLink", x => new { x.JobDetailId, x.ProfessionalId });
                    table.ForeignKey(
                        name: "FK_JobProfessionalLink_JobDetails_JobDetailId",
                        column: x => x.JobDetailId,
                        principalTable: "JobDetails",
                        principalColumn: "JobDetailId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_JobProfessionalLink_Professionals_ProfessionalId",
                        column: x => x.ProfessionalId,
                        principalTable: "Professionals",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "ProfessionalTypes",
                columns: new[] { "ProfessionalTypeId", "Description", "TypeName" },
                values: new object[,]
                {
                    { 1, "Real Estate Professional representing a buyer", "Buyer's Advocate" },
                    { 2, "Real estate brokers", "Broker" },
                    { 3, "Legal Professional", "Conveyancer" },
                    { 4, "Building and pest inspectors", "Build and Pest" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_JobDetailProfessionalType_ProfessionalTypesProfessionalType~",
                table: "JobDetailProfessionalType",
                column: "ProfessionalTypesProfessionalTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_JobDetails_JobId",
                table: "JobDetails",
                column: "JobId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_JobProfessionalLink_ProfessionalId",
                table: "JobProfessionalLink",
                column: "ProfessionalId");

            migrationBuilder.CreateIndex(
                name: "IX_Jobs_CustomerId",
                table: "Jobs",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_Professionals_ProfessionalTypeId",
                table: "Professionals",
                column: "ProfessionalTypeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Admins");

            migrationBuilder.DropTable(
                name: "JobDetailProfessionalType");

            migrationBuilder.DropTable(
                name: "JobProfessionalLink");

            migrationBuilder.DropTable(
                name: "Suburbs");

            migrationBuilder.DropTable(
                name: "JobDetails");

            migrationBuilder.DropTable(
                name: "Professionals");

            migrationBuilder.DropTable(
                name: "Jobs");

            migrationBuilder.DropTable(
                name: "ProfessionalTypes");

            migrationBuilder.DropTable(
                name: "Customers");
        }
    }
}
