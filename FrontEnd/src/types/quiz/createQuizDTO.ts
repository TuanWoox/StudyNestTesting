export interface CreateQuizDTO {
  noteId: string;
  count_Mcq: number;
  count_Tf: number;
  count_Msq: number;
  language: string;
  difficulty: string;
  noteContent: string;
}
