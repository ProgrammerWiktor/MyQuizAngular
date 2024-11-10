import { NgIf } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication.service';
import { Subscription } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgIf, RouterLink, RouterModule, MatSnackBarModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit, OnDestroy {
  isUserAuthenticated: boolean = false;
  isMobile: boolean = false;
  areMobileItemsShown: boolean = false;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.onWindowResize();
    this.checkIfIsLoggedIn();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  checkIfIsLoggedIn(): void {
    const sub = this.authenticationService
      .getCurrentUser()
      .subscribe((user) => {
        this.isUserAuthenticated = !!user;
      });

    this.subscriptions.add(sub);
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(): void {
    const currentWindowWidth: number = window.innerWidth;

    if (currentWindowWidth <= 700) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }

  toggleMobileItems(): void {
    this.areMobileItemsShown = !this.areMobileItemsShown;
  }

  logout(): void {
    const sub = this.authenticationService.signOut().subscribe({
      next: () => {
        this.router.navigate(['/']);
        this.snackBar.open('Pomyślnie wylogowano', 'OK', {
          duration: 5000,
        });
      },
      error: () => {
        this.snackBar.open('Nie udało się wylogować', 'OK', {
          duration: 5000,
        });
      },
    });

    this.subscriptions.add(sub);
  }
}
