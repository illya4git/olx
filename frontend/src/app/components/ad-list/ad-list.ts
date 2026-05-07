import { Component, inject, OnInit } from '@angular/core';
import { AdService } from '../../services/ad';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-ad-list',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="max-w-6xl mx-auto p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Каталог нерухомості</h1>
      </div>

      <div class="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-8">
        <div class="flex flex-col md:flex-row gap-4 items-end">

          <div class="w-full md:w-2/5">
            <label class="block text-sm font-medium text-gray-700 mb-1">Пошук за ключовим словом</label>
            <input type="text" [(ngModel)]="filters.keyword" (keyup.enter)="loadAds()" placeholder="Напр. квартира в центрі, балкон..." class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border">
          </div>

          <div class="w-full md:w-1/5">
            <label class="block text-sm font-medium text-gray-700 mb-1">Мін. ціна ($)</label>
            <input type="number" [(ngModel)]="filters.min_price" (keyup.enter)="loadAds()" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border">
          </div>

          <div class="w-full md:w-1/5">
            <label class="block text-sm font-medium text-gray-700 mb-1">Мін. площа (м²)</label>
            <input type="number" [(ngModel)]="filters.min_area" (keyup.enter)="loadAds()" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border">
          </div>

          <div class="w-full md:w-1/5">
            <button (click)="loadAds()" [disabled]="isLoading" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition-colors disabled:bg-blue-400">
              Шукати
            </button>
          </div>
        </div>
      </div>

      @if (isLoading) {
        <div class="flex flex-col justify-center items-center py-20 gap-4">
          <svg class="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-gray-500 text-lg font-medium">Завантаження оголошень...</p>
        </div>
      } @else {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (ad of ads; track ad.id) {

            <a [routerLink]="['/ad', ad.id]" class="block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">

              <div class="h-48 bg-gray-100 w-full relative overflow-hidden">
                @if (ad.images && ad.images.length > 0) {
                  <img [src]="ad.images[0]" alt="Ad thumbnail" class="w-full h-full object-cover">
                } @else {
                  <div class="flex items-center justify-center w-full h-full text-gray-300">
                    <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  </div>
                }

                <span class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-bold px-2.5 py-1 rounded shadow-sm">
                  {{ ad.status === 'published' ? 'Активне' : ad.status }}
                </span>
              </div>

              <div class="p-5">
                <div class="mb-2">
                  <h3 class="text-xl font-bold text-gray-900 truncate" [title]="ad.title">{{ ad.title }}</h3>
                </div>
                <p class="text-gray-500 text-sm mb-4 line-clamp-1" [title]="ad.address">{{ ad.address }}</p>

                <div class="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                  <span class="text-2xl font-bold text-blue-600">\${{ ad.price }}</span>
                  <span class="text-gray-600 flex items-center gap-1 font-medium">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
                    {{ ad.area }} м²
                  </span>
                </div>
              </div>
            </a>

          } @empty {
            <div class="col-span-full flex flex-col items-center justify-center text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <svg class="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <p class="text-xl text-gray-600 font-medium">Оголошень не знайдено</p>
              <p class="text-gray-500 mt-2 text-sm">Спробуйте змінити критерії пошуку.</p>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class AdListComponent implements OnInit {
  private adService = inject(AdService);

  ads: any[] = [];
  // Added keyword to the default filters object
  filters: any = { keyword: '', min_price: null, min_area: null };
  isLoading = true;

  ngOnInit() {
    this.loadAds();
  }

  loadAds() {
    this.isLoading = true;

    // Create a clean copy of filters to send to the backend
    // This prevents sending empty strings when the user clears the search box
    const queryParams: any = {};
    if (this.filters.keyword) queryParams.keyword = this.filters.keyword;
    if (this.filters.min_price) queryParams.min_price = this.filters.min_price;
    if (this.filters.min_area) queryParams.min_area = this.filters.min_area;

    this.adService.getAds(queryParams).subscribe({
      next: (res) => {
        this.ads = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load ads', err);
        this.isLoading = false;
      }
    });
  }
}
