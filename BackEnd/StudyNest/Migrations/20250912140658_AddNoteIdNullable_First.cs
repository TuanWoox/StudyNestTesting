using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudyNest.Migrations
{
    /// <inheritdoc />
    public partial class AddNoteIdNullable_First : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "NoteId",
                table: "Quizzes",
                type: "text",
                nullable: false,
                defaultValue: "");

            //migrationBuilder.AddColumn<string>(
            //    name: "OwnerId",
            //    table: "Quizzes",
            //    type: "text",
            //    nullable: false,
            //    defaultValue: "");

            migrationBuilder.Sql(@"ALTER TABLE ""Quizzes"" DROP COLUMN IF EXISTS ""CreatedBy"";");

            // 3) Tạo index
            migrationBuilder.CreateIndex(
                name: "IX_Quizzes_NoteId",
                table: "Quizzes",
                column: "NoteId");

            migrationBuilder.CreateIndex(
                name: "IX_Quizzes_OwnerId",
                table: "Quizzes",
                column: "OwnerId");

            // 4) Thêm FK
            migrationBuilder.AddForeignKey(
                name: "FK_Quizzes_AspNetUsers_OwnerId",
                table: "Quizzes",
                column: "OwnerId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict); 

            migrationBuilder.AddForeignKey(
                name: "FK_Quizzes_Notes_NoteId",
                table: "Quizzes",
                column: "NoteId",
                principalTable: "Notes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Quizzes_AspNetUsers_OwnerId",
                table: "Quizzes");

            migrationBuilder.DropForeignKey(
                name: "FK_Quizzes_Notes_NoteId",
                table: "Quizzes");

            migrationBuilder.DropIndex(
                name: "IX_Quizzes_OwnerId",
                table: "Quizzes");

            migrationBuilder.DropIndex(
                name: "IX_Quizzes_NoteId",
                table: "Quizzes");

            //migrationBuilder.DropColumn(
            //    name: "OwnerId",
            //    table: "Quizzes");

            migrationBuilder.DropColumn(
                name: "NoteId",
                table: "Quizzes");

        }

    }
}
