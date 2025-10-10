export interface CreateQuestionDTO {
  quizId: string;
  name: string;
  type: "MCQ" | "MSQ" | "TF";
  explanation?: string;
  choices: ChoiceDTO[];
}

export interface ChoiceDTO {
  id?: string;
  text: string;
  isCorrect: boolean;
}
