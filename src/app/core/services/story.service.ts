import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Story, CreateStoryRequest, StoryResponse, StoriesListResponse } from '../models/story.model';

@Injectable({
  providedIn: 'root'
})
export class StoryService {

  constructor(private api: ApiService) { }

  createStory(data: CreateStoryRequest): Observable<StoryResponse> {
    return this.api.post<StoryResponse>('/stories', data);
  }

  createStoryWithFormData(formData: FormData): Observable<StoryResponse> {
    return this.api.postFormData<StoryResponse>('/stories', formData);
  }

  getStories(filters?: { category?: string; featured?: boolean }): Observable<StoriesListResponse> {
    return this.api.get<StoriesListResponse>('/stories', filters);
  }

  getUserStories(): Observable<StoriesListResponse> {
    return this.api.get<StoriesListResponse>('/stories/user');
  }

  getStoryById(id: string): Observable<{ success: boolean; data: { story: Story } }> {
    return this.api.get<{ success: boolean; data: { story: Story } }>(`/stories/${id}`);
  }

  updateStory(id: string, data: Partial<CreateStoryRequest>): Observable<StoryResponse> {
    return this.api.put<StoryResponse>(`/stories/${id}`, data);
  }

  updateStoryWithFormData(id: string, formData: FormData): Observable<StoryResponse> {
    return this.api.putFormData<StoryResponse>(`/stories/${id}`, formData);
  }

  deleteStory(id: string): Observable<{ success: boolean; message: string }> {
    return this.api.delete<{ success: boolean; message: string }>(`/stories/${id}`);
  }
}