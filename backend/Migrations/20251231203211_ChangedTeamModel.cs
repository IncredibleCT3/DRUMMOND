using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class ChangedTeamModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Team",
                keyColumn: "Name",
                keyValue: null,
                column: "Name",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Team",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Abbreviation",
                table: "Team",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "City",
                table: "Team",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Conference",
                table: "Team",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Division",
                table: "Team",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "FullName",
                table: "Team",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "TeamId",
                table: "Team",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Abbreviation",
                table: "Team");

            migrationBuilder.DropColumn(
                name: "City",
                table: "Team");

            migrationBuilder.DropColumn(
                name: "Conference",
                table: "Team");

            migrationBuilder.DropColumn(
                name: "Division",
                table: "Team");

            migrationBuilder.DropColumn(
                name: "FullName",
                table: "Team");

            migrationBuilder.DropColumn(
                name: "TeamId",
                table: "Team");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Team",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");
        }
    }
}
