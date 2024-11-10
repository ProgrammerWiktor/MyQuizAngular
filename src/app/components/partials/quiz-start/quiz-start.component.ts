import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Quiz } from '../../../shared/Quiz.interface';
import { AuthenticationService } from '../../../services/authentication.service';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NgIf } from '@angular/common';
import { QuizService } from '../../../services/quiz.service';
import { ConfirmDeleteQuizComponent } from '../confirm-delete-quiz/confirm-delete-quiz.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-quiz-start',
  standalone: true,
  imports: [RouterLink, MatSnackBarModule, NgIf, ConfirmDeleteQuizComponent],
  templateUrl: './quiz-start.component.html',
  styleUrl: './quiz-start.component.scss',
})
export class QuizStartComponent implements OnInit, OnDestroy {
  @Input() quiz!: Quiz;
  @Output() changeStage = new EventEmitter<string>();
  @Output() isLoading = new EventEmitter<void>();
  username: string = '';
  isAuthor: boolean = false;
  isConfirmDelete: boolean = false;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private authenticationService: AuthenticationService,
    private quizService: QuizService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkIsAuthor();
    this.getUsernameOfQuizAuthor();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getUsernameOfQuizAuthor(): void {
    const sub = this.authenticationService
      .getUsername(this.quiz.author)
      .subscribe({
        next: (name) => {
          this.username = name;
          this.isLoading.emit();
        },
        error: () => {
          this.isLoading.emit();
          this.snackBar.open(
            'Nie udało się pobrać nazwy użytkownika autora quizu',
            'OK',
            {
              duration: 5000,
            }
          );
        },
      });

    this.subscriptions.add(sub);
  }

  startQuiz(): void {
    this.changeStage.emit('quiz');
  }

  checkIsAuthor(): void {
    const sub = this.authenticationService
      .isCurrentUserAuthor(this.quiz)
      .subscribe({
        next: (result) => {
          this.isAuthor = result;
        },
        error: () => {
          this.snackBar.open(
            'Nie udało się potwierdzić czy jesteś autorem quizu',
            'OK',
            {
              duration: 5000,
            }
          );
        },
      });

    this.subscriptions.add(sub);
  }

  deleteQuiz(): void {
    const sub = this.quizService.deleteQuizById(this.quiz.id!).subscribe({
      next: () => {
        this.router.navigate(['quiz-list']);
        this.snackBar.open('Quiz został usunięty', 'OK', {
          duration: 5000,
        });
      },
      error: () => {
        this.router.navigate(['quiz-list']);
        this.snackBar.open('Nie udało się usunąć quizu', 'OK', {
          duration: 5000,
        });
      },
    });

    this.subscriptions.add(sub);
  }

  checkIfDeleteQuiz(choice: boolean): void {
    if (choice) {
      this.deleteQuiz();
    } else {
      this.isConfirmDelete = false;
    }
  }

  openConfirmationOfDeletion(): void {
    this.isConfirmDelete = true;
  }
}
