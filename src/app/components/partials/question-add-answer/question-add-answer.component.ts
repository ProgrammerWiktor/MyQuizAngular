import { NgClass, NgFor } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Answer } from '../../../shared/Answer.interface';
import { Question } from '../../../shared/Question.interface';

@Component({
  selector: 'app-question-add-answer',
  standalone: true,
  imports: [NgFor, FormsModule, NgClass],
  templateUrl: './question-add-answer.component.html',
  styleUrl: './question-add-answer.component.scss',
})
export class QuestionAddAnswerComponent {
  @Input() numberOfQuestion!: number;
  @Output() setQuestion = new EventEmitter<Question>();

  text: string = '';
  answers: Answer[] = [
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
  ];

  addAnswer() {
    this.answers.push({ text: '', isCorrect: false });
  }

  setAnswerCorrectness(index: number) {
    this.answers[index].isCorrect = !this.answers[index].isCorrect;
  }

  removeAnswer(index: number) {
    this.answers.splice(index, 1);
  }
}
