using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudyNest.Migrations
{
    /// <inheritdoc />
    public partial class AddQuizAttemptAndAllOfItsInvolvedTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsBeingConvertToSnapShot",
                table: "Quizzes",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "QuizAttemptSnapshots",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    QuizId = table.Column<string>(type: "text", nullable: false),
                    QuizQuestions = table.Column<string>(type: "jsonb", nullable: false),
                    DateCreated = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    DateModified = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    Deleted = table.Column<bool>(type: "boolean", nullable: false),
                    DateDeleted = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuizAttemptSnapshots", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuizAttemptSnapshots_Quizzes_QuizId",
                        column: x => x.QuizId,
                        principalTable: "Quizzes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "QuizAttempts",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    QuizId = table.Column<string>(type: "text", nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: false),
                    QuizAttemptSnapshotId = table.Column<string>(type: "text", nullable: false),
                    EndTime = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    Score = table.Column<int>(type: "integer", nullable: false),
                    IsCompleted = table.Column<bool>(type: "boolean", nullable: false),
                    DraftAnswers = table.Column<string>(type: "jsonb", nullable: false),
                    DateCreated = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    DateModified = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    Deleted = table.Column<bool>(type: "boolean", nullable: false),
                    DateDeleted = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuizAttempts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuizAttempts_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_QuizAttempts_QuizAttemptSnapshots_QuizAttemptSnapshotId",
                        column: x => x.QuizAttemptSnapshotId,
                        principalTable: "QuizAttemptSnapshots",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_QuizAttempts_Quizzes_QuizId",
                        column: x => x.QuizId,
                        principalTable: "Quizzes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "QuizAttemptAnswers",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    QuizAttemptId = table.Column<string>(type: "text", nullable: false),
                    SnapshotQuestionId = table.Column<string>(type: "text", nullable: false),
                    IsCorrect = table.Column<bool>(type: "boolean", nullable: false),
                    DateCreated = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    DateModified = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    Deleted = table.Column<bool>(type: "boolean", nullable: false),
                    DateDeleted = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuizAttemptAnswers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuizAttemptAnswers_QuizAttempts_QuizAttemptId",
                        column: x => x.QuizAttemptId,
                        principalTable: "QuizAttempts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            // ✅ Corrected table name here
            migrationBuilder.CreateTable(
                name: "QuizAttemptAnswerChoices",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    QuizAttemptAnswerId = table.Column<string>(type: "text", nullable: true),
                    ChoiceId = table.Column<string>(type: "text", nullable: false),
                    DateCreated = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    DateModified = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    Deleted = table.Column<bool>(type: "boolean", nullable: false),
                    DateDeleted = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuizAttemptAnswerChoices", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuizAttemptAnswerChoices_QuizAttemptAnswers_QuizAttemptAnswerId",
                        column: x => x.QuizAttemptAnswerId,
                        principalTable: "QuizAttemptAnswers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_QuizAttemptAnswerChoices_Deleted",
                table: "QuizAttemptAnswerChoices",
                column: "Deleted");

            migrationBuilder.CreateIndex(
                name: "IX_QuizAttemptAnswerChoices_QuizAttemptAnswerId",
                table: "QuizAttemptAnswerChoices",
                column: "QuizAttemptAnswerId");

            migrationBuilder.CreateIndex(
                name: "IX_QuizAttemptAnswers_Deleted",
                table: "QuizAttemptAnswers",
                column: "Deleted");

            migrationBuilder.CreateIndex(
                name: "IX_QuizAttemptAnswers_QuizAttemptId",
                table: "QuizAttemptAnswers",
                column: "QuizAttemptId");

            migrationBuilder.CreateIndex(
                name: "IX_QuizAttempts_Deleted",
                table: "QuizAttempts",
                column: "Deleted");

            migrationBuilder.CreateIndex(
                name: "IX_QuizAttempts_QuizAttemptSnapshotId",
                table: "QuizAttempts",
                column: "QuizAttemptSnapshotId");

            migrationBuilder.CreateIndex(
                name: "IX_QuizAttempts_QuizId",
                table: "QuizAttempts",
                column: "QuizId");

            migrationBuilder.CreateIndex(
                name: "IX_QuizAttempts_UserId",
                table: "QuizAttempts",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_QuizAttemptSnapshots_Deleted",
                table: "QuizAttemptSnapshots",
                column: "Deleted");

            migrationBuilder.CreateIndex(
                name: "IX_QuizAttemptSnapshots_QuizId",
                table: "QuizAttemptSnapshots",
                column: "QuizId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // ✅ Corrected name here too
            migrationBuilder.DropTable(
                name: "QuizAttemptAnswerChoices");

            migrationBuilder.DropTable(
                name: "QuizAttemptAnswers");

            migrationBuilder.DropTable(
                name: "QuizAttempts");

            migrationBuilder.DropTable(
                name: "QuizAttemptSnapshots");

            migrationBuilder.DropColumn(
                name: "IsBeingConvertToSnapShot",
                table: "Quizzes");
        }
    }
}
