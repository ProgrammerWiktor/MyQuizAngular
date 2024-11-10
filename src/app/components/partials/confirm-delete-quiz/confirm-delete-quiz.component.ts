import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-confirm-delete-quiz',
  standalone: true,
  imports: [MatProgressSpinner, NgIf],
  templateUrl: './confirm-delete-quiz.component.html',
  styleUrl: './confirm-delete-quiz.component.scss',
})
export class ConfirmDeleteQuizComponent {
  @Input() quizTitle: string = '';
  @Output() choice: EventEmitter<boolean> = new EventEmitter<boolean>();
  isPending: boolean = false;

  emitChoice(choice: boolean): void {
    this.isPending = true;
    this.choice.emit(choice);
  }
}
