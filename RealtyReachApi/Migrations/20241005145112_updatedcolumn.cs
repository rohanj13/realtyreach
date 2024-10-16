using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RealtyReachApi.Migrations
{
    /// <inheritdoc />
    public partial class updatedcolumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "LocationOrPostCode",
                table: "JobDetails",
                newName: "Postcode");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Postcode",
                table: "JobDetails",
                newName: "LocationOrPostCode");
        }
    }
}
