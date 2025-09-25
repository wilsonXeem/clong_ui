import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Donation, CreateDonationRequest, DonationResponse, DonationsListResponse } from '../models/donation.model';

@Injectable({
  providedIn: 'root'
})
export class DonationService {

  constructor(private api: ApiService) { }

  createDonation(data: CreateDonationRequest): Observable<DonationResponse> {
    return this.api.post<DonationResponse>('/donations', data);
  }

  getDonations(filters?: { type?: string; status?: string }): Observable<DonationsListResponse> {
    return this.api.get<DonationsListResponse>('/donations', filters);
  }

  getDonationById(id: string): Observable<{ success: boolean; data: { donation: Donation } }> {
    return this.api.get<{ success: boolean; data: { donation: Donation } }>(`/donations/${id}`);
  }

  updateDonationStatus(id: string, status: string): Observable<{ success: boolean; message: string }> {
    return this.api.patch<{ success: boolean; message: string }>(`/donations/${id}/status`, { status });
  }
}