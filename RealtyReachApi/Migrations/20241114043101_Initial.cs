using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace RealtyReachApi.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
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
                    LastName = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Customers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Jobs",
                columns: table => new
                {
                    JobId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    JobType = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    AdditionalDetails = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsMatched = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Jobs", x => x.JobId);
                });

            migrationBuilder.CreateTable(
                name: "ProfessionalTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TypeName = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProfessionalTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "JobDetails",
                columns: table => new
                {
                    JobDetailId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    JobId = table.Column<int>(type: "integer", nullable: false),
                    LocationOrPostCode = table.Column<string>(type: "text", nullable: false),
                    PurchaseType = table.Column<string>(type: "text", nullable: false),
                    PropertyType = table.Column<string>(type: "text", nullable: false),
                    JourneyProgress = table.Column<string>(type: "text", nullable: false),
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
                name: "Professionals",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: true),
                    FirstName = table.Column<string>(type: "text", nullable: true),
                    LastName = table.Column<string>(type: "text", nullable: true),
                    ABN = table.Column<string>(type: "text", nullable: true),
                    LicenseNumber = table.Column<string>(type: "text", nullable: true),
                    VerificationStatus = table.Column<bool>(type: "boolean", nullable: false),
                    CompanyName = table.Column<string>(type: "text", nullable: true),
                    ProfessionalTypeId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Professionals", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Professionals_ProfessionalTypes_ProfessionalTypeId",
                        column: x => x.ProfessionalTypeId,
                        principalTable: "ProfessionalTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "JobDetailProfessionalType",
                columns: table => new
                {
                    JobDetailId = table.Column<int>(type: "integer", nullable: false),
                    ProfessionalTypeId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JobDetailProfessionalType", x => new { x.JobDetailId, x.ProfessionalTypeId });
                    table.ForeignKey(
                        name: "FK_JobDetailProfessionalType_JobDetails_JobDetailId",
                        column: x => x.JobDetailId,
                        principalTable: "JobDetails",
                        principalColumn: "JobDetailId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_JobDetailProfessionalType_ProfessionalTypes_ProfessionalTyp~",
                        column: x => x.ProfessionalTypeId,
                        principalTable: "ProfessionalTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_JobDetailProfessionalType_ProfessionalTypeId",
                table: "JobDetailProfessionalType",
                column: "ProfessionalTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_JobDetails_JobId",
                table: "JobDetails",
                column: "JobId",
                unique: true);

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
                name: "Customers");

            migrationBuilder.DropTable(
                name: "JobDetailProfessionalType");

            migrationBuilder.DropTable(
                name: "Professionals");

            migrationBuilder.DropTable(
                name: "JobDetails");

            migrationBuilder.DropTable(
                name: "ProfessionalTypes");

            migrationBuilder.DropTable(
                name: "Jobs");
        }
    }
}
