import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-spinner-button',
  standalone: true,
  imports: [MatProgressSpinnerModule, NgIf],
  templateUrl: './spinner-button.component.html',
  styleUrl: './spinner-button.component.scss',
})
export class SpinnerButtonComponent {
  @Input() isProgress: boolean = false;
  @Input() text: string = '';
}
