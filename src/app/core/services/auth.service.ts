import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { ApiService } from './api.service';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private tokenKey = 'auth_token';

  constructor(private api: ApiService) {
    this.loadStoredUser();
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('/users/register', data).pipe(
      tap(response => {
        if (response.success) {
          this.setAuthData(response.data.token, response.data.user);
        }
      })
    );
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('/users/login', data).pipe(
      tap(response => {
        if (response.success) {
          this.setAuthData(response.data.token, response.data.user);
        }
      })
    );
  }

  getProfile(): Observable<{ success: boolean; data: User }> {
    return this.api.get<{ success: boolean; data: User }>('/users/profile');
  }

  updateProfile(data: Partial<User>): Observable<{ success: boolean; data: User }> {
    return this.api.put<{ success: boolean; data: User }>('/users/profile', data).pipe(
      tap(response => {
        if (response.success) {
          this.currentUserSubject.next(response.data);
        }
      })
    );
  }

  getAllUsers(): Observable<{ success: boolean; data: User[] }> {
    return this.api.get<{ success: boolean; data: User[] }>('/users');
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('current_user');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private setAuthData(token: string, user: User): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem('current_user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private loadStoredUser(): void {
    const storedUser = localStorage.getItem('current_user');
    if (storedUser && this.getToken()) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }
}
