import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../services/authentication.service';
import { Subscription, switchMap } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserStatistics } from '../../../shared/UserStatistics.interface';
import { NgIf } from '@angular/common';
import { LoadingComponent } from '../../partials/loading/loading.component';
import { QuizService } from '../../../services/quiz.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatSnackBarModule, NgIf, LoadingComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit, OnDestroy {
  username: string = '';
  isUsernameLoading: boolean = false;
  isStatisticsLoading: boolean = false;
  isResetPasswordLoading: boolean = false;
  userStatistics: UserStatistics = {
    numberOfCorrectAnswers: 0,
    numberOfIncorrectAnswers: 0,
    numberOfQuizzesTaken: 0,
  };
  private subscriptions: Subscription = new Subscription();

  constructor(
    private authenticationService: AuthenticationService,
    private quizService: QuizService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getUsername();
    this.getStatistics();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  sendEmail(): void {
    window.location.href = 'mailto:wiktor7530@windowslive.com';
  }

  resetPassword(): void {
    this.isResetPasswordLoading = true;

    const sub = this.authenticationService
      .getCurrentUser()
      .pipe(
        switchMap((user) =>
          this.authenticationService.recoverPasswordWithEmail(user?.email!)
        )
      )
      .subscribe({
        next: () => {
          this.isResetPasswordLoading = false;
          this.snackBar.open('Wysłano email z linkiem do zmiany hasła', 'OK', {
            duration: 5000,
          });
        },
        error: () => {
          this.isResetPasswordLoading = false;
          this.snackBar.open(
            'Nie udało się wysłać maila z linkiem do zmiany hasła',
            'OK',
            {
              duration: 5000,
            }
          );
        },
      });
    
    this.subscriptions.add(sub);
  }

  getUsername(): void {
    this.isUsernameLoading = true;

    const sub = this.authenticationService
      .getCurrentUserUid()
      .pipe(switchMap((uid) => this.authenticationService.getUsername(uid)))
      .subscribe({
        next: (username) => {
          this.username = username;
          this.isUsernameLoading = false;
        },
        error: () => {
          this.isUsernameLoading = false;
          this.snackBar.open('Nie udało się pobrać nazwy użytkownika', 'OK', {
            duration: 5000,
          });
        },
      });
    
    this.subscriptions.add(sub);
  }

  getStatistics(): void {
    this.isStatisticsLoading = true;

    const sub = this.quizService.getCurrentUserStatistics().subscribe({
      next: (stats: UserStatistics) => {
        this.userStatistics = stats;
        this.isStatisticsLoading = false;
      },
      error: () => {
        this.isStatisticsLoading = false;
        this.snackBar.open('Nie udało się pobrać statystyk konta', 'OK', {
          duration: 5000,
        });
      },
    });
    
    this.subscriptions.add(sub);
  }

  getPercentOfCorrectAnswers(): number {
    return +(
      (this.userStatistics.numberOfCorrectAnswers /
        (this.userStatistics.numberOfCorrectAnswers +
          this.userStatistics.numberOfIncorrectAnswers)) *
      100
    ).toFixed(2);
  }

  getTheCorrectSpellingOfQuizWord(): string {
    const quizzesTaken = this.userStatistics.numberOfQuizzesTaken;

    if (quizzesTaken === 1) {
      return 'quiz';
    } else if (quizzesTaken >= 2 && quizzesTaken <= 4) {
      return 'quizy';
    } else {
      return 'quizów';
    }
  }
}
