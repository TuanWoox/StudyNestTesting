using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudyNest.Migrations
{
    /// <inheritdoc />
    public partial class AddQuizAttempAndAllOfItsInvolvedTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "QuizAttemptSnapshot",
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
                    table.PrimaryKey("PK_QuizAttemptSnapshot", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuizAttemptSnapshot_Quizzes_QuizId",
                        column: x => x.QuizId,
                        principalTable: "Quizzes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "QuizAttempt",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    QuizId = table.Column<string>(type: "text", nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: false),
                    QuizAttemptSnapshotId = table.Column<string>(type: "text", nullable: false),
                    EndTime = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    Score = table.Column<int>(type: "integer", nullable: false),
                    IsCompleted = table.Column<bool>(type: "boolean", nullable: false),
                    DateCreated = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    DateModified = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    Deleted = table.Column<bool>(type: "boolean", nullable: false),
                    DateDeleted = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuizAttempt", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuizAttempt_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_QuizAttempt_QuizAttemptSnapshot_QuizAttemptSnapshotId",
                        column: x => x.QuizAttemptSnapshotId,
                        principalTable: "QuizAttemptSnapshot",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_QuizAttempt_Quizzes_QuizId",
                        column: x => x.QuizId,
                        principalTable: "Quizzes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "QuizAttemptAnswer",
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
                    table.PrimaryKey("PK_QuizAttemptAnswer", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuizAttemptAnswer_QuizAttempt_QuizAttemptId",
                        column: x => x.QuizAttemptId,
                        principalTable: "QuizAttempt",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "QuizAttempAnswerChoice",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    QuizAttemptAnswerId = table.Column<string>(type: "text", nullable: false),
                    ChoiceId = table.Column<string>(type: "text", nullable: false),
                    DateCreated = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    DateModified = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    Deleted = table.Column<bool>(type: "boolean", nullable: false),
                    DateDeleted = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuizAttempAnswerChoice", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuizAttempAnswerChoice_QuizAttemptAnswer_QuizAttemptAnswerId",
                        column: x => x.QuizAttemptAnswerId,
                        principalTable: "QuizAttemptAnswer",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_QuizAttempAnswerChoice_Deleted",
                table: "QuizAttempAnswerChoice",
                column: "Deleted");

            migrationBuilder.CreateIndex(
                name: "IX_QuizAttempAnswerChoice_QuizAttemptAnswerId",
                table: "QuizAttempAnswerChoice",
                column: "QuizAttemptAnswerId");

            migrationBuilder.CreateIndex(
                name: "IX_QuizAttempt_Deleted",
                table: "QuizAttempt",
                column: "Deleted");

            migrationBuilder.CreateIndex(
                name: "IX_QuizAttempt_QuizAttemptSnapshotId",
                table: "QuizAttempt",
                column: "QuizAttemptSnapshotId");

            migrationBuilder.CreateIndex(
                name: "IX_QuizAttempt_QuizId",
                table: "QuizAttempt",
                column: "QuizId");

            migrationBuilder.CreateIndex(
                name: "IX_QuizAttempt_UserId",
                table: "QuizAttempt",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_QuizAttemptAnswer_Deleted",
                table: "QuizAttemptAnswer",
                column: "Deleted");

            migrationBuilder.CreateIndex(
                name: "IX_QuizAttemptAnswer_QuizAttemptId",
                table: "QuizAttemptAnswer",
                column: "QuizAttemptId");

            migrationBuilder.CreateIndex(
                name: "IX_QuizAttemptSnapshot_Deleted",
                table: "QuizAttemptSnapshot",
                column: "Deleted");

            migrationBuilder.CreateIndex(
                name: "IX_QuizAttemptSnapshot_QuizId",
                table: "QuizAttemptSnapshot",
                column: "QuizId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "QuizAttempAnswerChoice");

            migrationBuilder.DropTable(
                name: "QuizAttemptAnswer");

            migrationBuilder.DropTable(
                name: "QuizAttempt");

            migrationBuilder.DropTable(
                name: "QuizAttemptSnapshot");
        }
    }
}
