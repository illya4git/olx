import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationService } from '../../services/notification';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100 mt-10">
      <div class="flex items-center gap-3 mb-6">
        <div class="p-2 bg-blue-100 text-blue-600 rounded-lg">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-800">Підписка на нові об'єкти</h2>
      </div>

      <p class="text-gray-600 mb-6">Отримуйте сповіщення, коли з'являється нерухомість, що відповідає вашим критеріям.</p>

      <form [formGroup]="subForm" (ngSubmit)="onSubmit()" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Мін. ціна</label>
            <input formControlName="min_price" type="number" class="w-full rounded-md border-gray-300 border p-2">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Макс. ціна</label>
            <input formControlName="max_price" type="number" class="w-full rounded-md border-gray-300 border p-2">
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Мінімальна площа (м²)</label>
          <input formControlName="min_area" type="number" class="w-full rounded-md border-gray-300 border p-2">
        </div>

        <div class="pt-4">
          <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-md transition-colors">
            Створити підписку
          </button>
        </div>

        @if (successMessage) {
          <div class="mt-4 p-3 bg-green-50 text-green-700 rounded-md text-sm text-center">
            {{ successMessage }}
          </div>
        }
      </form>
    </div>
  `
})
export class SubscriptionComponent {
  private fb = inject(FormBuilder);
  private notificationService = inject(NotificationService);

  successMessage = '';

  subForm = this.fb.group({
    min_price: [null],
    max_price: [null],
    min_area: [null]
  });

  onSubmit() {
    this.notificationService.subscribeToCriteria(this.subForm.value).subscribe(() => {
      this.successMessage = 'Підписку успішно створено!';
      this.subForm.reset();
      setTimeout(() => this.successMessage = '', 3000);
    });
  }
}
