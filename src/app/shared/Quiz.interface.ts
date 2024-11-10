import { Question } from "./Question.interface";

export interface Quiz {
  id?: string;
  title: string;
  description: string;
  questions: Question[] | null;
  author: string;
}
