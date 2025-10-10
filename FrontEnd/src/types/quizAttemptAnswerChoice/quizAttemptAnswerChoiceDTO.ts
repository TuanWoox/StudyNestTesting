import { BaseEntity } from "../common/baseEntity";

export interface QuizAttemptAnswerChoiceDTO extends BaseEntity<string> {
    quizAttemptAnswerId: string;
    choiceId: string;
}
