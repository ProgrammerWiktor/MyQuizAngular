import { Component, OnDestroy } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SpinnerButtonComponent } from '../../partials/spinner-button/spinner-button.component';
import { NgIf } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    NgIf,
    SpinnerButtonComponent,
    ReactiveFormsModule,
    RouterModule,
    MatSnackBarModule,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent implements OnDestroy {
  isPending: boolean = false;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private authenticationService: AuthenticationService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  resetPasswordForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  onSubmit(): void {
    if (this.resetPasswordForm.valid) {
      this.isPending = true;

      const sub = this.authenticationService
        .recoverPasswordWithEmail(this.resetPasswordForm.value.email!)
        .subscribe({
          next: () => {
            this.isPending = false;
            this.router.navigate(['login']);
            this.snackBar.open(
              'Wysłano wiadomość email z linkiem do resetowania hasła',
              'OK',
              {
                duration: 5000,
              }
            );
          },
          error: () => {
            this.isPending = false;
            this.snackBar.open(
              'Nie udało się wysłać wiadomości z linkiem do resetowania hasła',
              'OK',
              {
                duration: 5000,
              }
            );
          },
        });

      this.subscriptions.add(sub);
    }
  }
}
