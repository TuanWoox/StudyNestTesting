export interface QuizList {
  key: string;
  id: string;
  title: string;
  totalQuestion: number;
  dateCreated: Date;
}

export interface QuizDetail {
  id: string;
  title: string;
  createdBy: string;
  dateCreated: Date;
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
