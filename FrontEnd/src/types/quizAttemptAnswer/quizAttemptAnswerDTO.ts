import { BaseEntity } from "../common/baseEntity";
import { QuizAttemptAnswerChoiceDTO } from "../quizAttemptAnswerChoice/quizAttemptAnswerChoiceDTO";

export interface QuizAttemptAnswerDTO extends BaseEntity<string> {
    quizAttemptId: string;
    snapshotQuestionId: string;
    isCorrect: boolean;
    quizAttemptAnswerChoices: QuizAttemptAnswerChoiceDTO[];
}
