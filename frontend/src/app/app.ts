import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private authService = inject(AuthService);
  private router = inject(Router);

  get isLoggedIn(): boolean {
    return !!this.authService.getToken();
  }

  get isBuyer(): boolean {
    return this.authService.getRole() === 'buyer';
  }

  get isSeller(): boolean {
    return this.authService.getRole() === 'seller';
  }

  get userName(): string {
    return this.authService.getName() || 'User';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
