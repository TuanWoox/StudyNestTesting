export interface QuizJobDTO {
  jobId: string;
  userId: string;
  noteTitle: string;
  status: "queued" | "processing" | "success" | "failed";
  timestamp: string;
  quizId?: string;
  errorMessage?: string;
  isViewed?: boolean;
  createdAt: number;
}
