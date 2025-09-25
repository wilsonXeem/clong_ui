import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Event, EventRegistration, CreateEventRequest, EventResponse, EventsListResponse, EventRegistrationsResponse } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private api: ApiService) { }

  createEvent(data: FormData): Observable<EventResponse> {
    return this.api.post<EventResponse>('/events', data);
  }

  getEvents(filters?: { upcoming?: boolean; location?: string }): Observable<EventsListResponse> {
    return this.api.get<EventsListResponse>('/events', filters);
  }

  getEventById(id: string): Observable<{ success: boolean; data: { event: Event } }> {
    return this.api.get<{ success: boolean; data: { event: Event } }>(`/events/${id}`);
  }

  updateEvent(id: string, data: FormData): Observable<EventResponse> {
    return this.api.put<EventResponse>(`/events/${id}`, data);
  }

  deleteEvent(id: string): Observable<{ success: boolean; message: string }> {
    return this.api.delete<{ success: boolean; message: string }>(`/events/${id}`);
  }

  registerForEvent(id: string, registrationData: any): Observable<{ success: boolean; message: string }> {
    return this.api.post<{ success: boolean; message: string }>(`/events/${id}/register`, registrationData);
  }

  getEventRegistrations(id: string): Observable<EventRegistrationsResponse> {
    return this.api.get<EventRegistrationsResponse>(`/events/${id}/registrations`);
  }
}