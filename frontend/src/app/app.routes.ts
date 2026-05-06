import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { AdListComponent } from './components/ad-list/ad-list';
import { AdCreateComponent } from './components/ad-create/ad-create';
import { NotificationListComponent } from './components/notification-list/notification-list';
import { SubscriptionComponent } from './components/subscription/subscription';
import { inject } from '@angular/core';
import { AuthService } from './services/auth';
import { Router } from '@angular/router';

// Simple Route Guard for Auth
const authGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.getToken() ? true : router.createUrlTree(['/login']);
};

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'ads', component: AdListComponent },

  // Seller Only Route
  { path: 'ads/create', component: AdCreateComponent, canActivate: [authGuard] },

  // Buyer Only Routes
  { path: 'subscribe', component: SubscriptionComponent, canActivate: [authGuard] },
  { path: 'notifications', component: NotificationListComponent, canActivate: [authGuard] },

  { path: '', redirectTo: '/ads', pathMatch: 'full' }
];
