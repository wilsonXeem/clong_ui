import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private api: ApiService) {}

  updateUserRole(userId: string, role: string): Observable<{ success: boolean; message: string; data: User }> {
    return this.api.put<{ success: boolean; message: string; data: User }>(`/users/${userId}/role`, { role });
  }

  toggleUserStatus(userId: string): Observable<{ success: boolean; message: string; data: User }> {
    return this.api.put<{ success: boolean; message: string; data: User }>(`/users/${userId}/toggle-status`, {});
  }

  deleteUser(userId: string): Observable<{ success: boolean; message: string; data: { id: string; email: string } }> {
    return this.api.delete<{ success: boolean; message: string; data: { id: string; email: string } }>(`/users/${userId}`);
  }
}