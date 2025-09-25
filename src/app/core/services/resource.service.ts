import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Resource, CreateResourceRequest, ResourceResponse, ResourcesListResponse } from '../models/resource.model';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {
  private baseUrl = environment.apiUrl || 'http://localhost:3000/api';

  constructor(
    private api: ApiService,
    private http: HttpClient
  ) { }

  createResource(data: CreateResourceRequest, file: File): Observable<ResourceResponse> {
    const formData = new FormData();
    formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    if (data.category) formData.append('category', data.category);
    if (data.isPublic !== undefined) formData.append('isPublic', data.isPublic.toString());
    formData.append('file', file);

    return this.http.post<ResourceResponse>(`${this.baseUrl}/resources`, formData);
  }

  getResources(filters?: { category?: string }): Observable<ResourcesListResponse> {
    return this.api.get<ResourcesListResponse>('/resources', filters);
  }

  getUserResources(): Observable<ResourcesListResponse> {
    return this.api.get<ResourcesListResponse>('/resources/user');
  }

  getResourceById(id: string): Observable<{ success: boolean; data: { resource: Resource } }> {
    return this.api.get<{ success: boolean; data: { resource: Resource } }>(`/resources/${id}`);
  }

  updateResource(id: string, data: Partial<CreateResourceRequest>): Observable<ResourceResponse> {
    return this.api.put<ResourceResponse>(`/resources/${id}`, data);
  }

  deleteResource(id: string): Observable<{ success: boolean; message: string }> {
    return this.api.delete<{ success: boolean; message: string }>(`/resources/${id}`);
  }
}