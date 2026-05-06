import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-[80vh] flex items-center justify-center">
      <div class="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 class="text-2xl font-bold text-center text-gray-900 mb-8">Вхід</h2>

        <!-- Status Messages -->
        @if (errorMessage) {
          <div class="mb-6 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
            {{ errorMessage }}
          </div>
        }
        @if (successMessage) {
          <div class="mb-6 p-3 bg-green-50 text-green-700 rounded-lg text-sm border border-green-200">
            {{ successMessage }}
          </div>
        }

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Електронна пошта</label>
            <input formControlName="email" type="email" class="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-blue-500 focus:border-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
            <input formControlName="password" type="password" class="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-blue-500 focus:border-blue-500">
          </div>

          <button type="submit" [disabled]="loginForm.invalid || isLoading"
                  class="w-full flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed mt-4">
            @if (isLoading) {
              <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Входимо...
            } @else {
            Увійти
          }
          </button>
        </form>
        <p class="text-center text-sm text-gray-600 mt-6">
          Нема акаунту? <a routerLink="/register" class="text-blue-600 hover:underline font-medium cursor-pointer">Зареєструйтеся</a>
        </p>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.successMessage = 'Успішний вхід! Перенаправляємо...';
          setTimeout(() => this.router.navigate(['/ads']), 1000);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'Невдалий вхід. Перевірте введені дані.';
          console.error('Login failed', err);
        }
      });
    }
  }
}
