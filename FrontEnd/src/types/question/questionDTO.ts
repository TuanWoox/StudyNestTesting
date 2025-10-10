import { ChoiceDTO } from "../choice/choiceDTO";
import { BaseEntity } from "../common/baseEntity";

export interface QuestionDTO extends BaseEntity<string> {
    quizId: string;
    name: string;
    type: string;           // e.g., "mcq" | "msq" | "tf" if you want stricter typing
    explanation: string;
    choices: ChoiceDTO[];
}
