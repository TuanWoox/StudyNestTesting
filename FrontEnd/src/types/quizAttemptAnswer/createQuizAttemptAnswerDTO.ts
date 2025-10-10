import { CreateQuizAttemptAnswerChoice } from "../quizAttemptAnswerChoice/createQuizAttemptAnswerChoiceDTO";

export interface CreateQuizAttemptAnswerDTO {
    quizAttemptId?: string;
    snapShotQuestionId: string;
    QuizAttemptAnswerChoices: CreateQuizAttemptAnswerChoice[]
}