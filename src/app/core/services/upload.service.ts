import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UploadResponse } from '../models/upload.model';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private baseUrl = environment.apiUrl || 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  uploadImage(file: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('image', file);
    
    return this.http.post<UploadResponse>(`${this.baseUrl}/upload/image`, formData);
  }
}
