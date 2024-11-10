import { Answer } from "./Answer.interface";

export interface Question {
  text: string;
  answers: Answer[];
}
