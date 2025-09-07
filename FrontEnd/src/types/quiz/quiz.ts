export interface QuizList {
  id: string;
  title: string;
  totalQuestion: number;
  dateCreated: string;
}

export interface QuizDetail {
  id: string;
  title: string;
  createdBy: string;
  dateCreated: string;
  questions: Question[];
}

export interface Question {
  id: string;
  name: string;
  type: "MCQ" | "TF";
  correctIndex?: number;
  correctTrueFalse?: boolean;
  explanation: string;
  orderNo: number;
  choices: Choice[];
}

export interface Choice {
  id: string;
  text: string;
  orderNo: number;
}
