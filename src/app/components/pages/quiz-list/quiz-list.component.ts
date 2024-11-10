import { Component, OnDestroy, OnInit } from '@angular/core';
import { QuizItemComponent } from '../../partials/quiz-item/quiz-item.component';
import { NgFor, NgIf } from '@angular/common';
import { QuizService } from '../../../services/quiz.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Quiz } from '../../../shared/Quiz.interface';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { QuizFilterComponent } from '../../partials/quiz-filter/quiz-filter.component';
import { AuthenticationService } from '../../../services/authentication.service';
import { Subscription, switchMap } from 'rxjs';
import { LoadingComponent } from '../../partials/loading/loading.component';

@Component({
  selector: 'app-quiz-list',
  standalone: true,
  imports: [
    QuizItemComponent,
    NgFor,
    MatSnackBarModule,
    MatProgressSpinner,
    NgIf,
    QuizFilterComponent,
    LoadingComponent,
  ],
  templateUrl: './quiz-list.component.html',
  styleUrl: './quiz-list.component.scss',
})
export class QuizListComponent implements OnInit, OnDestroy {
  quizzes: Quiz[] = [];
  isLoading: boolean = true;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private quizService: QuizService,
    private snackBar: MatSnackBar,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.getQuizzes();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getQuizzes(): void {
    const sub = this.quizService.getFilter().subscribe({
      next: (filter) => {
        if (filter === 'Users') {
          this.getQuizzesByUser();
        } else {
          this.getAllQuizzes();
        }
      },
      error: () => {
        this.snackBar.open('Nie udało się pobrać listy quizów', 'OK', {
          duration: 5000,
        });
      },
    });

    this.subscriptions.add(sub);
  }

  getAllQuizzes(): void {
    this.isLoading = true;

    const sub = this.quizService.getQuizzes().subscribe({
      next: (data: Quiz[]) => {
        this.quizzes = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Nie udało się pobrać listy quizów', 'OK', {
          duration: 5000,
        });
      },
    });

    this.subscriptions.add(sub);
  }

  getQuizzesByUser(): void {
    this.isLoading = true;

    const sub = this.authenticationService
      .getCurrentUserUid()
      .pipe(switchMap((uid) => this.quizService.getQuizzesByUser(uid)))
      .subscribe({
        next: (quizzes: Quiz[]) => {
          this.quizzes = quizzes;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.snackBar.open('Nie udało się pobrać listy twoich quizów', 'OK', {
            duration: 5000,
          });
        },
      });

    this.subscriptions.add(sub);
  }
}
