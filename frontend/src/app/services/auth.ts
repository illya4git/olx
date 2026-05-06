import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  register(data: any) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(credentials: any) {
    return this.http.post<{token: string, user: any}>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        localStorage.setItem('auth_token', res.token);
        localStorage.setItem('user_role', res.user.role);
        localStorage.setItem('user_name', res.user.name); // Store user name
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  getRole(): string | null {
    return localStorage.getItem('user_role');
  }

  getName(): string | null {
    return localStorage.getItem('user_name'); // Retrieve user name
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_name'); // Clear user name
  }
}
