import { BaseEntity } from "../common/baseEntity";
import { QuestionDTO } from "../question/questionDTO";

export interface QuizAttemptSnapshotDTO extends BaseEntity<string> {
    quizId: string;
    quizQuestionsParsed: QuestionDTO[];
}