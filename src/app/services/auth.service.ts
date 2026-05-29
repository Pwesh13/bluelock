import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginDto, RegisterDto, AuthResponse } from '../models/auth.model';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //private apiUrl = 'https://localhost:7051/Auth';
  private apiUrl = environment.apiURL + '/Auth';

  constructor(private http: HttpClient, private router: Router) {}

  login(data: LoginDto) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/Login`, data).pipe(
      tap(response => {
        localStorage.setItem('token', response.accessToken);
        localStorage.setItem('user', JSON.stringify(response.user));
      })
    );
  }

  register(data: RegisterDto) {
  return this.http.post<AuthResponse>(`${this.apiUrl}/Register`, data).pipe(
    tap(response => {
      localStorage.setItem('token', response.accessToken);
      localStorage.setItem('user', JSON.stringify(response.user));
    })
  );
}

registerAsAdmin(data: RegisterDto) {
  return this.http.post<AuthResponse>(`${this.apiUrl}/Register`, data);
}

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.roles?.includes('Admin') ?? false;
  }

  isUser(): boolean {
    const user = this.getCurrentUser();
    return user?.roles?.includes('User') ?? false;
  }
}