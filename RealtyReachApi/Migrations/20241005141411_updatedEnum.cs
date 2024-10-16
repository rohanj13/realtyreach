using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RealtyReachApi.Migrations
{
    /// <inheritdoc />
    public partial class updatedEnum : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Location",
                table: "JobDetails",
                newName: "Postcode");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
