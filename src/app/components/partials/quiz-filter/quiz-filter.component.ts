import { NgClass } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { QuizService } from '../../../services/quiz.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-quiz-filter',
  standalone: true,
  imports: [NgClass],
  templateUrl: './quiz-filter.component.html',
  styleUrl: './quiz-filter.component.scss',
})
export class QuizFilterComponent implements OnInit, OnDestroy {
  filter: string = 'All';
  private subscriptions: Subscription = new Subscription();

  constructor(private quizService: QuizService) {}

  ngOnInit(): void {
    this.getFilter();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getFilter(): void {
    const sub = this.quizService.getFilter().subscribe((filter) => {
      this.filter = filter;
    });

    this.subscriptions.add(sub);
  }

  setFilter(newFilter: string): void {
    this.quizService.setFilter(newFilter);
  }
}
