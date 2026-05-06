import { Component, inject, OnInit } from '@angular/core';
import { AdService } from '../../services/ad';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ad-list',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="max-w-6xl mx-auto p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Каталог нерухомості</h1>
      </div>

      <!-- Search Filters -->
      <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-wrap gap-4 items-end">
        <div class="flex-1 min-w-[200px]">
          <label class="block text-sm font-medium text-gray-700 mb-1">Мін. ціна ($)</label>
          <input type="number" [(ngModel)]="filters.min_price" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border">
        </div>
        <div class="flex-1 min-w-[200px]">
          <label class="block text-sm font-medium text-gray-700 mb-1">Мін. площа (м²)</label>
          <input type="number" [(ngModel)]="filters.min_area" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border">
        </div>
        <button (click)="loadAds()" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition-colors">
          Шукати
        </button>
      </div>

      <!-- Ads Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (ad of ads; track ad.id) {
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div class="p-5">
              <div class="flex justify-between items-start mb-2">
                <h3 class="text-xl font-bold text-gray-900 truncate">{{ ad.title }}</h3>
                <span class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">{{ ad.status }}</span>
              </div>
              <p class="text-gray-500 text-sm mb-4 line-clamp-2">{{ ad.address }}</p>
              <div class="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                <span class="text-2xl font-bold text-blue-600">\${{ ad.price }}</span>
                <span class="text-gray-600 flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
                  {{ ad.area }} м²
                </span>
              </div>
            </div>
          </div>
        } @empty {
          <div class="col-span-full text-center py-12 text-gray-500">
            За вашим запитом не знайдено оголошень.
          </div>
        }
      </div>
    </div>
  `
})
export class AdListComponent implements OnInit {
  private adService = inject(AdService);
  ads: any[] = [];
  filters: any = { min_price: null, min_area: null };

  ngOnInit() {
    this.loadAds();
  }

  loadAds() {
    this.adService.getAds(this.filters).subscribe(res => this.ads = res);
  }
}
