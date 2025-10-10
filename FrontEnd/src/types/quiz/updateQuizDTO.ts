export interface UpdateQuizDTO {
  id: string;
  title: string;
  dateCreated?: string;
  dateModified?: string;
  deleted?: boolean;
  questions: QuestionUpsertDTO[];
}

export interface QuestionUpsertDTO {
  id?: string;
  name: string;
  type: "MCQ" | "MSQ" | "TF";
  explanation?: string;
  choices: ChoiceUpsertDTO[];
}

export interface ChoiceUpsertDTO {
  id?: string;
  text: string;
  isCorrect: boolean;
}
