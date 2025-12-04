export interface QuizList {
  id: string;
  title: string;
  totalQuestion: number;
  dateCreated: string;
  noteTitle: string;
  difficulty: string;
}

export interface QuizDetail {
  id: string;
  title: string;
  createdBy: string;
  difficulty: string;
  dateCreated: string;
  questions: Question[];
  isPublic: boolean;
  friendlyURL: string | undefined;
  owner: Owner | undefined;
  quizStars: QuizStar[];
}

export interface Question {
  id: string;
  name: string;
  type: "MCQ" | "TF" | "MSQ";
  explanation: string;
  choices: Choice[];
  imageUrl?: string;
}

export interface Choice {
  questionId: string;
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Owner {
  id: string;
  email: string;
  userName: string;
}


export interface QuizStar {
  userId: string;
  quizId: string;
}