using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudyNest.Migrations
{
    /// <inheritdoc />
    public partial class RemoveKeyFromNoteTag : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Id",
                table: "NoteTags");

            migrationBuilder.CreateIndex(
                name: "IX_Tags_Deleted",
                table: "Tags",
                column: "Deleted");

            migrationBuilder.CreateIndex(
                name: "IX_Settings_Deleted",
                table: "Settings",
                column: "Deleted");

            migrationBuilder.CreateIndex(
                name: "IX_Quizzes_Deleted",
                table: "Quizzes",
                column: "Deleted");

            migrationBuilder.CreateIndex(
                name: "IX_Questions_Deleted",
                table: "Questions",
                column: "Deleted");

            migrationBuilder.CreateIndex(
                name: "IX_NoteTags_Deleted",
                table: "NoteTags",
                column: "Deleted");

            migrationBuilder.CreateIndex(
                name: "IX_Notes_Deleted",
                table: "Notes",
                column: "Deleted");

            migrationBuilder.CreateIndex(
                name: "IX_ImageToDeletes_Deleted",
                table: "ImageToDeletes",
                column: "Deleted");

            migrationBuilder.CreateIndex(
                name: "IX_Folders_Deleted",
                table: "Folders",
                column: "Deleted");

            migrationBuilder.CreateIndex(
                name: "IX_Choices_Deleted",
                table: "Choices",
                column: "Deleted");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_Deleted",
                table: "AspNetUsers",
                column: "Deleted");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_Deleted",
                table: "AspNetUserRoles",
                column: "Deleted");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoles_Deleted",
                table: "AspNetRoles",
                column: "Deleted");

            migrationBuilder.CreateIndex(
                name: "IX_aspnetrolepermissions_Deleted",
                table: "aspnetrolepermissions",
                column: "Deleted");

            migrationBuilder.CreateIndex(
                name: "IX_aspnetpermissions_Deleted",
                table: "aspnetpermissions",
                column: "Deleted");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Tags_Deleted",
                table: "Tags");

            migrationBuilder.DropIndex(
                name: "IX_Settings_Deleted",
                table: "Settings");

            migrationBuilder.DropIndex(
                name: "IX_Quizzes_Deleted",
                table: "Quizzes");

            migrationBuilder.DropIndex(
                name: "IX_Questions_Deleted",
                table: "Questions");

            migrationBuilder.DropIndex(
                name: "IX_NoteTags_Deleted",
                table: "NoteTags");

            migrationBuilder.DropIndex(
                name: "IX_Notes_Deleted",
                table: "Notes");

            migrationBuilder.DropIndex(
                name: "IX_ImageToDeletes_Deleted",
                table: "ImageToDeletes");

            migrationBuilder.DropIndex(
                name: "IX_Folders_Deleted",
                table: "Folders");

            migrationBuilder.DropIndex(
                name: "IX_Choices_Deleted",
                table: "Choices");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_Deleted",
                table: "AspNetUsers");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUserRoles_Deleted",
                table: "AspNetUserRoles");

            migrationBuilder.DropIndex(
                name: "IX_AspNetRoles_Deleted",
                table: "AspNetRoles");

            migrationBuilder.DropIndex(
                name: "IX_aspnetrolepermissions_Deleted",
                table: "aspnetrolepermissions");

            migrationBuilder.DropIndex(
                name: "IX_aspnetpermissions_Deleted",
                table: "aspnetpermissions");

            migrationBuilder.AddColumn<string>(
                name: "Id",
                table: "NoteTags",
                type: "text",
                nullable: true);
        }
    }
}
