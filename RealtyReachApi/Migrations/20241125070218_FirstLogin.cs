using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RealtyReachApi.Migrations
{
    /// <inheritdoc />
    public partial class FirstLogin : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Professionals_ProfessionalType_ProfessionalTypeId",
                table: "Professionals");

            migrationBuilder.AlterColumn<int>(
                name: "ProfessionalTypeId",
                table: "Professionals",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddColumn<bool>(
                name: "FirstLogin",
                table: "Professionals",
                type: "boolean",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FirstLogin",
                table: "Customers",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "ProfessionalType",
                keyColumn: "ProfessionalTypeId",
                keyValue: 1,
                columns: new[] { "Description", "TypeName" },
                values: new object[] { "Real Estate Professional representing a buyer", "Buyer's Advocate" });

            migrationBuilder.UpdateData(
                table: "ProfessionalType",
                keyColumn: "ProfessionalTypeId",
                keyValue: 3,
                columns: new[] { "Description", "TypeName" },
                values: new object[] { "Legal Professional", "Conveyancer" });

            migrationBuilder.InsertData(
                table: "ProfessionalType",
                columns: new[] { "ProfessionalTypeId", "Description", "TypeName" },
                values: new object[] { 4, "Building and pest inspectors", "Build and Pest" });

            migrationBuilder.AddForeignKey(
                name: "FK_Professionals_ProfessionalType_ProfessionalTypeId",
                table: "Professionals",
                column: "ProfessionalTypeId",
                principalTable: "ProfessionalType",
                principalColumn: "ProfessionalTypeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Professionals_ProfessionalType_ProfessionalTypeId",
                table: "Professionals");

            migrationBuilder.DeleteData(
                table: "ProfessionalType",
                keyColumn: "ProfessionalTypeId",
                keyValue: 4);

            migrationBuilder.DropColumn(
                name: "FirstLogin",
                table: "Professionals");

            migrationBuilder.DropColumn(
                name: "FirstLogin",
                table: "Customers");

            migrationBuilder.AlterColumn<int>(
                name: "ProfessionalTypeId",
                table: "Professionals",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "ProfessionalType",
                keyColumn: "ProfessionalTypeId",
                keyValue: 1,
                columns: new[] { "Description", "TypeName" },
                values: new object[] { "Legal professionals", "Advocate" });

            migrationBuilder.UpdateData(
                table: "ProfessionalType",
                keyColumn: "ProfessionalTypeId",
                keyValue: 3,
                columns: new[] { "Description", "TypeName" },
                values: new object[] { "Building and pest inspectors", "Build and Pest" });

            migrationBuilder.AddForeignKey(
                name: "FK_Professionals_ProfessionalType_ProfessionalTypeId",
                table: "Professionals",
                column: "ProfessionalTypeId",
                principalTable: "ProfessionalType",
                principalColumn: "ProfessionalTypeId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
