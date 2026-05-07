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

      @if (errorMessage) {
        <div class="mb-6 p-3 bg-red-50 text-red-700 rounded-md text-sm border border-red-200">{{ errorMessage }}</div>
      }
      @if (successMessage) {
        <div class="mb-6 p-3 bg-green-50 text-green-700 rounded-md text-sm border border-green-200">{{ successMessage }}</div>
      }

      <form [formGroup]="adForm" (ngSubmit)="onSubmit()" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Назва</label>
          <input formControlName="title" type="text" class="w-full rounded-md border-gray-300 border p-2 focus:ring-blue-500 focus:border-blue-500">
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

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Опис</label>
          <textarea formControlName="description" rows="4" class="w-full rounded-md border-gray-300 border p-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Контакти продавця</label>
            <input formControlName="seller_contact" type="text" class="w-full rounded-md border-gray-300 border p-2 focus:ring-blue-500 focus:border-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Фотографії</label>
            <input type="file" multiple accept="image/*" (change)="onFileSelect($event)"
                   class="w-full rounded-md border-gray-300 border p-[5px] text-sm focus:ring-blue-500 focus:border-blue-500 bg-white">
          </div>
        </div>

        @if (selectedFiles.length > 0) {
          <p class="text-sm text-gray-500">Вибрано файлів: {{ selectedFiles.length }}</p>
        }

        <div class="pt-4">
          <button type="submit" [disabled]="adForm.invalid || isLoading"
                  class="w-full flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md transition-colors cursor-pointer disabled:bg-blue-300 disabled:cursor-not-allowed">
            @if (isLoading) {
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
  selectedFiles: File[] = []; // Array to hold actual file objects

  // Removed 'images' from the Reactive Form, as we handle it manually
  adForm = this.fb.group({
    title: ['', Validators.required],
    price: ['', [Validators.required, Validators.min(0)]],
    area: ['', [Validators.required, Validators.min(0)]],
    address: ['', Validators.required],
    description: ['', Validators.required],
    seller_contact: ['', Validators.required]
  });

  // Captures files when the user selects them
  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
    }
  }

  onSubmit() {
    if (this.adForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      // Initialize FormData instead of a standard JSON object
      const formData = new FormData();
      const formValue = this.adForm.value;

      // 1. Append text fields
      Object.keys(formValue).forEach(key => {
        const value = formValue[key as keyof typeof formValue];
        if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      });

      // 2. Append files. Notice the 'images[]' notation.
      // This tells Laravel to expect an array of files.
      this.selectedFiles.forEach(file => {
        formData.append('images[]', file);
      });

      // Send the FormData to the service
      this.adService.createAd(formData).subscribe({
        next: () => {
          this.successMessage = 'Оголошення успішно створено! Перенаправлення...';
          setTimeout(() => this.router.navigate(['/']), 1500);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'Не вдалося створити оголошення. Перевірте розмір зображень.';
          console.error('Ad creation failed', err);
        }
      });
    }
  }
}
