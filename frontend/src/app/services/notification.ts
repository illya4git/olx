import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private http = inject(HttpClient);

  // Matches "зберегтиКритеріюПошуку"[cite: 2]
  subscribeToCriteria(criteria: any) {
    return this.http.post(`${environment.apiUrl}/search-criteria`, criteria);
  }

  // Matches "переглянутиСповіщення"[cite: 2]
  getNotifications() {
    return this.http.get<any[]>(`${environment.apiUrl}/notifications`);
  }

  // Matches "помітитиЯкПереглянуте"[cite: 2]
  markAsViewed(id: number) {
    return this.http.patch(`${environment.apiUrl}/notifications/${id}/view`, {});
  }
}
