using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudyNest.Migrations
{
    /// <inheritdoc />
    public partial class UpdateQuestionAndChoiceEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CorrectIndex",
                table: "Questions");

            migrationBuilder.DropColumn(
                name: "CorrectTrueFalse",
                table: "Questions");

            migrationBuilder.DropColumn(
                name: "OrderNo",
                table: "Questions");

            migrationBuilder.DropColumn(
                name: "OrderNo",
                table: "Choices");

            migrationBuilder.AddColumn<bool>(
                name: "IsCorrect",
                table: "Choices",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsCorrect",
                table: "Choices");

            migrationBuilder.AddColumn<int>(
                name: "CorrectIndex",
                table: "Questions",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "CorrectTrueFalse",
                table: "Questions",
                type: "boolean",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "OrderNo",
                table: "Questions",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "OrderNo",
                table: "Choices",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
