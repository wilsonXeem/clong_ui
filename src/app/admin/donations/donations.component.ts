import { Component, OnInit } from '@angular/core';
import { DonationService } from '../../core/services/donation.service';

@Component({
  selector: 'app-donations',
  templateUrl: './donations.component.html',
  styleUrls: ['./donations.component.css']
})
export class DonationsComponent implements OnInit {
  donations: any[] = [];
  filteredDonations: any[] = [];
  loading = false;
  error: string | null = null;
  searchTerm = '';
  statusFilter = 'all';
  selectedDonations: Set<string> = new Set();
  filters = { status: '', type: '' };

  constructor(private donationService: DonationService) { }

  ngOnInit(): void {
    this.loadDonations();
  }

  loadDonations(): void {
    this.loading = true;
    this.error = null;
    this.donationService.getDonations(this.filters).subscribe({
      next: (response) => {
        this.donations = response.data.donations;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load donations';
        this.loading = false;
      }
    });
  }

  updateDonationStatus(id: string, event: any): void {
    const status = event.target?.value || event;
    this.donationService.updateDonationStatus(id, status).subscribe({
      next: () => this.loadDonations()
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onStatusFilterChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.donations];

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(donation => 
        (donation.donorName && donation.donorName.toLowerCase().includes(term)) ||
        (donation.donorEmail && donation.donorEmail.toLowerCase().includes(term)) ||
        (donation.reference && donation.reference.toLowerCase().includes(term))
      );
    }

    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(donation => donation.paymentStatus === this.statusFilter);
    }

    this.filteredDonations = filtered;
  }

  toggleDonationSelection(donationId: string): void {
    if (this.selectedDonations.has(donationId)) {
      this.selectedDonations.delete(donationId);
    } else {
      this.selectedDonations.add(donationId);
    }
  }

  toggleSelectAll(): void {
    if (this.selectedDonations.size === this.filteredDonations.length) {
      this.selectedDonations.clear();
    } else {
      this.selectedDonations.clear();
      this.filteredDonations.forEach(donation => this.selectedDonations.add(donation.id));
    }
  }

  isSelected(donationId: string): boolean {
    return this.selectedDonations.has(donationId);
  }

  get isAllSelected(): boolean {
    return this.filteredDonations.length > 0 && this.selectedDonations.size === this.filteredDonations.length;
  }

  get isIndeterminate(): boolean {
    return this.selectedDonations.size > 0 && this.selectedDonations.size < this.filteredDonations.length;
  }

  bulkUpdateStatus(status: string): void {
    if (this.selectedDonations.size === 0) return;

    const updates = Array.from(this.selectedDonations).map(id => 
      this.donationService.updateDonationStatus(id, status)
    );

    Promise.all(updates.map(obs => obs.toPromise()))
      .then(() => {
        this.loadDonations();
        this.selectedDonations.clear();
      })
      .catch(error => {
        console.error('Error updating donations:', error);
      });
  }

  clearSelection(): void {
    this.selectedDonations.clear();
  }

  exportDonations(): void {
    // Export functionality
    console.log('Export donations');
  }

  formatAmount(amount: number): string {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }
}