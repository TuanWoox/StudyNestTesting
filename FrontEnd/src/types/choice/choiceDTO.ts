import { BaseEntity } from "../common/baseEntity";


export interface ChoiceDTO extends BaseEntity<string> {
    questionId: string;
    text: string;
    isCorrect: boolean;
}
