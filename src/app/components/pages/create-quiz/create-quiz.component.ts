import { Component, OnDestroy, QueryList, ViewChildren } from '@angular/core';
import { QuestionAddAnswerComponent } from '../../partials/question-add-answer/question-add-answer.component';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { Quiz } from '../../../shared/Quiz.interface';
import { Question } from '../../../shared/Question.interface';
import { QuizService } from '../../../services/quiz.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthenticationService } from '../../../services/authentication.service';
import { catchError, of, Subscription, switchMap } from 'rxjs';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-create-quiz',
  standalone: true,
  imports: [
    QuestionAddAnswerComponent,
    FormsModule,
    NgFor,
    NgIf,
    MatSnackBarModule,
    MatProgressSpinner,
  ],
  templateUrl: './create-quiz.component.html',
  styleUrl: './create-quiz.component.scss',
})
export class CreateQuizComponent implements OnDestroy {
  @ViewChildren(QuestionAddAnswerComponent)
  questionComponents!: QueryList<QuestionAddAnswerComponent>;

  quiz: Quiz = {
    title: '',
    description: '',
    questions: [],
    author: '',
  };

  isLoading: boolean = false;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private quizService: QuizService,
    private authenticationService: AuthenticationService,
    private snackBar: MatSnackBar
  ) {}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  addQuestion(): void {
    if (!this.quiz.questions) {
      this.quiz.questions = [];
    }

    this.quiz.questions.push({
      text: '',
      answers: [{ text: '', isCorrect: false }],
    });
  }

  deleteQuestion(): void {
    if (this.quiz.questions && this.quiz.questions.length > 0) {
      this.quiz.questions.pop();
    }
  }

  setQuestions(index: number, changes: Question): void {
    if (this.quiz.questions) {
      this.quiz.questions[index] = {
        text: changes.text,
        answers: changes.answers,
      };
    }
  }

  checkValidity(): boolean {
    if (!this.quiz.title.trim()) {
      this.snackBar.open('Tytuł quizu jest wymagany', 'OK', {
        duration: 5000,
      });
      return false;
    }

    if (!this.quiz.description.trim()) {
      this.snackBar.open('Opis quizu jest wymagany', 'OK', {
        duration: 5000,
      });
      return false;
    }

    if (this.quiz.questions?.length === 0) {
      this.snackBar.open('Musisz dodać przynajmniej jedno pytanie', 'OK', {
        duration: 5000,
      });
      return false;
    }

    for (const question of this.quiz.questions!) {
      if (!question.text.trim()) {
        this.snackBar.open('Treść każdego pytania jest wymagana', 'OK', {
          duration: 5000,
        });
        return false;
      }

      if (question.answers.length === 0) {
        this.snackBar.open(
          'Każde pytanie musi mieć przynajmniej jedną odpowiedź',
          'OK',
          {
            duration: 5000,
          }
        );
        return false;
      }

      for (const answer of question.answers) {
        if (!answer.text.trim()) {
          this.snackBar.open('Treść każdej odpowiedzi jest wymagana', 'OK', {
            duration: 5000,
          });
          return false;
        }
      }
    }

    return true;
  }

  resetInputs(): void {
    this.quiz.title = '';
    this.quiz.description = '';
    this.quiz.questions = [];
  }

  emitQuestionChanges(): void {
    this.questionComponents.forEach((component, index) => {
      if (this.quiz.questions) {
        this.quiz.questions[index].text = component.text;
        this.quiz.questions[index].answers = component.answers;
      }
    });
  }

  submitQuiz(): void {
    this.isLoading = true;
    this.emitQuestionChanges();

    if (!this.checkValidity()) {
      return;
    }

    const sub = this.authenticationService
      .getCurrentUser()
      .pipe(
        switchMap((user) => {
          if (user?.uid) {
            this.quiz.author = user.uid;
            return this.quizService.addQuiz(this.quiz);
          } else {
            this.snackBar.open('Nie udało się dodać nowego quizu', 'OK', {
              duration: 5000,
            });
            this.isLoading = false;
            return of(null);
          }
        }),
        catchError(() => {
          this.isLoading = false;
          this.snackBar.open('Nie udało się dodać nowego quizu', 'OK', {
            duration: 5000,
          });
          return of(null);
        })
      )
      .subscribe((result) => {
        this.isLoading = false;
        if (result) {
          this.snackBar.open('Pomyślnie dodano nowy quiz', 'OK', {
            duration: 5000,
          });
          this.resetInputs();
        }
      });

    this.subscriptions.add(sub);
  }
}
