import { Component, OnInit } from '@angular/core';
import { VolunteerService } from '../../core/services/volunteer.service';
import { Volunteer } from '../../core/models/volunteer.model';

@Component({
  selector: 'app-volunteers',
  templateUrl: './volunteers.component.html',
  styleUrls: ['./volunteers.component.css']
})
export class VolunteersComponent implements OnInit {
  volunteers: Volunteer[] = [];
  filteredVolunteers: Volunteer[] = [];
  loading = false;
  selectedStatus = 'all';
  searchTerm = '';

  constructor(private volunteerService: VolunteerService) { }

  ngOnInit(): void {
    this.loadVolunteers();
  }

  loadVolunteers(): void {
    this.loading = true;
    this.volunteerService.getVolunteers().subscribe({
      next: (response) => {
        this.volunteers = response.data.volunteers;
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  updateStatus(id: string, status: string): void {
    this.volunteerService.updateVolunteerStatus(id, status).subscribe({
      next: () => {
        this.loadVolunteers();
      }
    });
  }

  onStatusFilter(status: string): void {
    this.selectedStatus = status;
    this.applyFilters();
  }

  onSearch(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = this.volunteers;
    
    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(v => v.status === this.selectedStatus);
    }
    
    if (this.searchTerm) {
      filtered = filtered.filter(v => 
        v.skills?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        v.interests?.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    
    this.filteredVolunteers = filtered;
  }

  getStatusClass(status: string): string {
    const classes = {
      'pending': 'status-pending',
      'approved': 'status-approved', 
      'rejected': 'status-rejected',
      'active': 'status-active'
    };
    return classes[status as keyof typeof classes] || '';
  }
}
