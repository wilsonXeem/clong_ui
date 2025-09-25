import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Volunteer, VolunteerApplicationRequest, VolunteerResponse, VolunteersListResponse } from '../models/volunteer.model';

@Injectable({
  providedIn: 'root'
})
export class VolunteerService {

  constructor(private api: ApiService) { }

  applyVolunteer(data: VolunteerApplicationRequest): Observable<VolunteerResponse> {
    return this.api.post<VolunteerResponse>('/volunteers/apply', data);
  }

  getVolunteers(filters?: { status?: string }): Observable<VolunteersListResponse> {
    return this.api.get<VolunteersListResponse>('/volunteers', filters);
  }

  getUserVolunteerApplication(): Observable<{ success: boolean; data: { volunteer: Volunteer } }> {
    return this.api.get<{ success: boolean; data: { volunteer: Volunteer } }>('/volunteers/my-application');
  }

  getVolunteerById(id: string): Observable<{ success: boolean; data: { volunteer: Volunteer } }> {
    return this.api.get<{ success: boolean; data: { volunteer: Volunteer } }>(`/volunteers/${id}`);
  }

  updateVolunteerStatus(id: string, status: string): Observable<{ success: boolean; message: string }> {
    return this.api.put<{ success: boolean; message: string }>(`/volunteers/${id}/status`, { status });
  }
}