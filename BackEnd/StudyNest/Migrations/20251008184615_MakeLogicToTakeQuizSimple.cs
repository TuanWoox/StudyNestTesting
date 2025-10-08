using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudyNest.Migrations
{
    /// <inheritdoc />
    public partial class MakeLogicToTakeQuizSimple : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DraftAnswers",
                table: "QuizAttempts");

            migrationBuilder.DropColumn(
                name: "EndTime",
                table: "QuizAttempts");

            migrationBuilder.DropColumn(
                name: "IsCompleted",
                table: "QuizAttempts");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DraftAnswers",
                table: "QuizAttempts",
                type: "jsonb",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "EndTime",
                table: "QuizAttempts",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)));

            migrationBuilder.AddColumn<bool>(
                name: "IsCompleted",
                table: "QuizAttempts",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }
    }
}
