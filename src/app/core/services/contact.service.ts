import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { CreateContactRequest, Contact, ContactResponse, ContactsListResponse } from '../models/contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private api: ApiService) { }

  createContact(data: CreateContactRequest): Observable<ContactResponse> {
    return this.api.post<ContactResponse>('/contacts', data);
  }

  sendMessage(data: CreateContactRequest): Observable<ContactResponse> {
    return this.api.post<ContactResponse>('/contacts', data);
  }

  getContacts(): Observable<ContactsListResponse> {
    return this.api.get<ContactsListResponse>('/contacts');
  }

  markAsRead(id: string): Observable<{ success: boolean; message: string }> {
    return this.api.patch<{ success: boolean; message: string }>(`/contacts/${id}/read`, {});
  }
}