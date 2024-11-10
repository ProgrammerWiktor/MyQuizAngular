import { Routes } from '@angular/router';
import { LandingPageComponent } from './components/pages/landing-page/landing-page.component';
import { LoginComponent } from './components/pages/login/login.component';
import { RegisterComponent } from './components/pages/register/register.component';
import { QuizListComponent } from './components/pages/quiz-list/quiz-list.component';
import { ResetPasswordComponent } from './components/pages/reset-password/reset-password.component';
import { authenticationGuard } from './guards/authentication.guard';
import { CreateQuizComponent } from './components/pages/create-quiz/create-quiz.component';
import { ProfileComponent } from './components/pages/profile/profile.component';
import { QuizComponent } from './components/pages/quiz/quiz.component';
import { PageNotFoundComponent } from './components/pages/page-not-found/page-not-found.component';
import { AboutComponent } from './components/pages/about/about.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'quiz-list', component: QuizListComponent, canActivate: [authenticationGuard] },
  { path: 'create-quiz', component: CreateQuizComponent, canActivate: [authenticationGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authenticationGuard] },
  { path: 'quiz/:id', component: QuizComponent, canActivate: [authenticationGuard] },
  { path: 'notFound', component: PageNotFoundComponent },
  { path: 'about', component: AboutComponent },
  { path: '**', redirectTo: 'notFound' },
];
