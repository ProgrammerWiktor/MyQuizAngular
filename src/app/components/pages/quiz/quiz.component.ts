import { Component, OnDestroy, OnInit } from '@angular/core';
import { Quiz } from '../../../shared/Quiz.interface';
import { QuizService } from '../../../services/quiz.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { QuizStartComponent } from '../../partials/quiz-start/quiz-start.component';
import { QuizGameComponent } from '../../partials/quiz-game/quiz-game.component';
import { QuizEndComponent } from '../../partials/quiz-end/quiz-end.component';
import { NgClass, NgIf } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { LoadingComponent } from '../../partials/loading/loading.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [
    MatSnackBarModule,
    QuizStartComponent,
    QuizGameComponent,
    QuizEndComponent,
    NgIf,
    MatProgressSpinner,
    NgClass,
    LoadingComponent,
  ],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.scss',
})
export class QuizComponent implements OnInit, OnDestroy {
  quiz?: Quiz;
  quizId: string = '';
  stage: string = 'start';
  isLoading: boolean = true;
  isLoadingUsername: boolean = true;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private quizService: QuizService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.quizId = this.route.snapshot.paramMap.get('id')!;
    this.getQuiz();
  }

  ngOnDestroy(): void {
    this.quizService.reset();
    this.subscriptions.unsubscribe();
  }

  getQuiz(): void {
    const sub = this.quizService.getQuizById(this.quizId).subscribe({
      next: (quiz) => {
        this.quiz = quiz;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.router.navigate(['/notFound']);
        this.snackBar.open(
          'Quiz nie istnieje lub nie udało się go pobrać',
          'OK',
          {
            duration: 5000,
          }
        );
      },
    });

    this.subscriptions.add(sub);
  }

  onChangeStage(newStage: string): void {
    this.stage = newStage;
  }

  onIsLoading(): void {
    this.isLoadingUsername = false;
  }
}
