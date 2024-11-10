import { NgIf } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { confirmPasswordValidator } from '../../../validators/confirm-password.validator';
import { AuthenticationService } from '../../../services/authentication.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SpinnerButtonComponent } from '../../partials/spinner-button/spinner-button.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    NgIf,
    RouterModule,
    MatSnackBarModule,
    SpinnerButtonComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnDestroy {
  isPending: boolean = false;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private snakBar: MatSnackBar
  ) {}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  registerForm = new FormGroup(
    {
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    {
      validators: confirmPasswordValidator,
    }
  );

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isPending = true;

      const sub = this.authenticationService
        .signUp({
          username: this.registerForm.value.username!,
          email: this.registerForm.value.email!,
          password: this.registerForm.value.password!,
        })
        .subscribe({
          next: () => {
            this.isPending = false;
            this.router.navigate(['quiz-list']);
            this.snakBar.open('Pomyślnie utworzono nowe konto', 'OK', {
              duration: 5000,
            });
          },
          error: (error) => {
            this.isPending = false;

            if (error.message === 'Username is already taken') {
              this.snakBar.open(
                'Podana nazwa użytkownika jest już zajęta',
                'OK',
                {
                  duration: 5000,
                }
              );
            } else {
              this.snakBar.open('Nie udało się utworzyć nowego konta', 'OK', {
                duration: 5000,
              });
            }
          },
        });

      this.subscriptions.add(sub);
    }
  }
}
