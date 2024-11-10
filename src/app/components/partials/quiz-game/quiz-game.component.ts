import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Question } from '../../../shared/Question.interface';
import { Answer } from '../../../shared/Answer.interface';
import { QuizService } from '../../../services/quiz.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-quiz-game',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, MatSnackBarModule],
  templateUrl: './quiz-game.component.html',
  styleUrl: './quiz-game.component.scss',
})
export class QuizGameComponent implements OnInit, OnDestroy {
  @Input() questions!: Question[];
  @Output() changeStage = new EventEmitter<string>();
  currentQuestion: number = 0;
  showResults: boolean = false;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private quizService: QuizService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initialize();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  initialize(): void {
    this.showResults = this.quizService.showResults;

    if (!this.showResults) {
      this.quizService.userAnswers = this.questions.map((question) =>
        question.answers.map(() => false)
      );
    }
  }

  nextQuestion(): void {
    if (this.currentQuestion < this.questions.length - 1) {
      this.currentQuestion++;
    }
  }

  previousQestion(): void {
    if (this.currentQuestion > 0) {
      this.currentQuestion--;
    }
  }

  selectAnswer(answerIndex: number): void {
    this.quizService.userAnswers[this.currentQuestion][answerIndex] =
      !this.quizService.userAnswers[this.currentQuestion][answerIndex];
  }

  getAnswerClass(answerIndex: number, answer: Answer): string {
    if (
      this.quizService.userAnswers[this.currentQuestion][answerIndex] &&
      answer.isCorrect
    ) {
      return 'correct';
    }

    if (
      this.quizService.userAnswers[this.currentQuestion][answerIndex] &&
      !answer.isCorrect
    ) {
      return 'incorrect';
    }

    if (
      !this.quizService.userAnswers[this.currentQuestion][answerIndex] &&
      answer.isCorrect
    ) {
      return 'unselected-correct';
    }

    return '';
  }

  getCheckedClass(answerIndex: number): boolean {
    if (this.quizService.userAnswers[this.currentQuestion][answerIndex]) {
      return true;
    } else {
      return false;
    }
  }

  finishQuiz(): void {
    this.quizService.calculateResult(this.questions);

    const sub = this.quizService.updateUserStatistics().subscribe({
      next: () => {
        this.quizService.setShowResults(true);
        this.changeStage.emit('end');
      },
      error: () => {
        this.quizService.setShowResults(true);
        this.changeStage.emit('end');
        this.snackBar.open('Nie udało się zaktualizować statystyk', 'OK', {
          duration: 5000,
        });
      },
    });

    this.subscriptions.add(sub);
  }

  goToSummary(): void {
    this.changeStage.emit('end');
  }
}
