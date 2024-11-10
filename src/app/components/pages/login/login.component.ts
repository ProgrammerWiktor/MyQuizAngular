import { NgIf } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SpinnerButtonComponent } from '../../partials/spinner-button/spinner-button.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    NgIf,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    SpinnerButtonComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnDestroy {
  isLogging: boolean = false;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLogging = true;

      const sub = this.authenticationService
        .signIn({
          email: this.loginForm.value.email!,
          password: this.loginForm.value.password!,
        })
        .subscribe({
          next: () => {
            this.isLogging = false;
            this.router.navigate(['quiz-list']);
            this.snackBar.open('Pomyślnie zalogowano', 'OK', {
              duration: 5000,
            });
          },
          error: () => {
            this.isLogging = false;
            this.snackBar.open('Nie udało się zalogować', 'OK', {
              duration: 5000,
            });
          },
        });

      this.subscriptions.add(sub);
    }
  }
}
