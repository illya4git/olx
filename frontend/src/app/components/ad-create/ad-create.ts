import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdService } from '../../services/ad';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ad-create',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100 mt-10">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">Створити нове оголошення</h2>

      <!-- Status Messages -->
      @if (errorMessage) {
        <div class="mb-6 p-3 bg-red-50 text-red-700 rounded-md text-sm border border-red-200">
          {{ errorMessage }}
        </div>
      }
      @if (successMessage) {
        <div class="mb-6 p-3 bg-green-50 text-green-700 rounded-md text-sm border border-green-200">
          {{ successMessage }}
        </div>
      }

      <form [formGroup]="adForm" (ngSubmit)="onSubmit()" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Назва</label>
          <input formControlName="title" type="text" class="w-full rounded-md border-gray-300 border p-2 focus:ring-blue-500 focus:border-blue-500" placeholder="напр. апартаменти на двох">
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Ціна ($)</label>
            <input formControlName="price" type="number" class="w-full rounded-md border-gray-300 border p-2 focus:ring-blue-500 focus:border-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Площа (м²)</label>
            <input formControlName="area" type="number" class="w-full rounded-md border-gray-300 border p-2 focus:ring-blue-500 focus:border-blue-500">
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Адреса</label>
          <input formControlName="address" type="text" class="w-full rounded-md border-gray-300 border p-2 focus:ring-blue-500 focus:border-blue-500">
        </div>
        <div class="pt-4">
          <button type="submit" [disabled]="adForm.invalid || isLoading"
                  class="w-full flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md transition-colors cursor-pointer disabled:bg-blue-300 disabled:cursor-not-allowed">
            @if (isLoading) {
              <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Публікуємо...
            } @else {
            Оприлюднити оголошення
          }
          </button>
        </div>
      </form>
    </div>
  `
})
export class AdCreateComponent {
  private fb = inject(FormBuilder);
  private adService = inject(AdService);
  private router = inject(Router);

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  adForm = this.fb.group({
    title: ['', Validators.required],
    price: ['', [Validators.required, Validators.min(0)]],
    area: ['', [Validators.required, Validators.min(0)]],
    address: ['', Validators.required]
  });

  onSubmit() {
    if (this.adForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      this.adService.createAd(this.adForm.value).subscribe({
        next: () => {
          this.successMessage = 'Оголошення успішно створено! Перенаправлення...';
          setTimeout(() => this.router.navigate(['/ads']), 1500);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'Не вдалося створити оголошення. Спробуйте ще раз.';
          console.error('Ad creation failed', err);
        }
      });
    }
  }
}
