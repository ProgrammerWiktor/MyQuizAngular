import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Quiz } from '../../../shared/Quiz.interface';
import { AuthenticationService } from '../../../services/authentication.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-quiz-item',
  standalone: true,
  imports: [],
  templateUrl: './quiz-item.component.html',
  styleUrl: './quiz-item.component.scss',
})
export class QuizItemComponent implements OnInit, OnDestroy {
  @Input() quiz!: Quiz;
  username: string = '';
  private subscriptions: Subscription = new Subscription();

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUsername();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getUsername(): void {
    const sub = this.authenticationService
      .getUsername(this.quiz.author)
      .subscribe((name) => {
        this.username = name;
      });

    this.subscriptions.add(sub);
  }

  goToQuiz(): void {
    this.router.navigate(['/quiz', this.quiz.id]);
  }
}
