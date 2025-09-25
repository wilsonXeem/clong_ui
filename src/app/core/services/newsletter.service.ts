import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { NewsletterResponse, SubscribersResponse } from '../models/newsletter.model';

@Injectable({
  providedIn: 'root'
})
export class NewsletterService {

  constructor(private api: ApiService) { }

  subscribe(email: string): Observable<NewsletterResponse> {
    return this.api.post<NewsletterResponse>('/newsletter/subscribe', { email });
  }

  unsubscribe(email: string): Observable<NewsletterResponse> {
    return this.api.post<NewsletterResponse>('/newsletter/unsubscribe', { email });
  }

  getSubscribers(): Observable<SubscribersResponse> {
    return this.api.get<SubscribersResponse>('/newsletter/subscribers');
  }

  deleteSubscriber(id: string): Observable<{ success: boolean; message: string }> {
    return this.api.delete<{ success: boolean; message: string }>(`/newsletter/subscribers/${id}`);
  }
}
