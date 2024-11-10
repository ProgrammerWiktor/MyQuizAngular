import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LinkButtonComponent } from '../../partials/link-button/link-button.component';
import { NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [RouterLink, LinkButtonComponent, NgIf],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  subscriptions: Subscription = new Subscription();

  constructor(private authenticationService: AuthenticationService) {}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnInit(): void {
    const sub = this.authenticationService
      .getCurrentUser()
      .subscribe((user) => {
        this.isLoggedIn = !!user;
      });

    this.subscriptions.add(sub);
  }
}
