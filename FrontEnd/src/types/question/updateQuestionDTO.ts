import { ChoiceDTO } from "./createQuestionDTO";

export interface UpdateQuestionDTO {
  id?: string;
  quizId: string;
  name: string;
  type: "MCQ" | "MSQ" | "TF";
  explanation?: string;
  choices: ChoiceDTO[];
  imageUrl: string | undefined;
}
