import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { QuizService } from '../../../services/quiz.service';

@Component({
  selector: 'app-quiz-end',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './quiz-end.component.html',
  styleUrl: './quiz-end.component.scss',
})
export class QuizEndComponent implements OnInit {
  numberOfPoints: number = 0;
  numberOfQuestions: number = 0;
  @Output() changeStage = new EventEmitter<string>();

  constructor(private quizService: QuizService) {}

  ngOnInit(): void {
    this.getPoints();
  }

  getPoints(): void {
    this.numberOfPoints = this.quizService.numberOfPoints;
    this.numberOfQuestions = this.quizService.numberOfQuestions;
  }

  onShowResults(): void {
    this.quizService.setShowResults(true);
    this.changeStage.emit('quiz');
  }
}
