import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Program, CreateProgramRequest, ProgramResponse, ProgramsListResponse } from '../models/program.model';

@Injectable({
  providedIn: 'root'
})
export class ProgramService {

  constructor(private api: ApiService) { }

  createProgram(data: CreateProgramRequest): Observable<ProgramResponse> {
    return this.api.post<ProgramResponse>('/programs', data);
  }

  getPrograms(filters?: { isActive?: boolean }): Observable<ProgramsListResponse> {
    return this.api.get<ProgramsListResponse>('/programs', filters);
  }

  getProgramById(id: string): Observable<{ success: boolean; data: { program: Program } }> {
    return this.api.get<{ success: boolean; data: { program: Program } }>(`/programs/${id}`);
  }

  updateProgram(id: string, data: Partial<Program>): Observable<ProgramResponse> {
    return this.api.put<ProgramResponse>(`/programs/${id}`, data);
  }

  deleteProgram(id: string): Observable<{ success: boolean; message: string }> {
    return this.api.delete<{ success: boolean; message: string }>(`/programs/${id}`);
  }

  createProgramWithFile(formData: FormData): Observable<{ success: boolean; data: { program: Program } }> {
    return this.api.postFormData<{ success: boolean; data: { program: Program } }>('/programs', formData);
  }
}