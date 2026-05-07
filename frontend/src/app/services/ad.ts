import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface Ad {
  id?: number;
  seller_id: number;
  title: string;
  price: number;
  area: number;
  address: string;
  status: string;
  description: string;
  seller_contact: string;
  images: string[];
}
@Injectable({ providedIn: 'root' })
export class AdService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/advertisements`;

  // Matches "здійснити пошук оголошень"[cite: 2]
  getAds(filters?: any) {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) params = params.append(key, filters[key]);
      });
    }
    return this.http.get<any[]>(this.apiUrl, { params });
  }

  getAdById(id: number) {
    return this.http.get<Ad>(`${this.apiUrl}/${id}`);
  }

  // Matches "створитиОголошення"[cite: 2]
  createAd(data: any) {
    return this.http.post(this.apiUrl, data);
  }

  updateAd(id: number, data: any) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }
}
