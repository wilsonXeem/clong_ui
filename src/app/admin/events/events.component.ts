import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EventService } from '../../core/services/event.service';
import { Event } from '../../core/models/event.model';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  events: Event[] = [];
  filteredEvents: Event[] = [];
  loading = false;
  error: string | null = null;
  showForm = false;
  showCreateForm = false;
  eventForm: any = {};
  editingEvent: Event | null = null;
  selectedFile: File | null = null;
  searchTerm = '';
  statusFilter = 'all';
  selectedEvents: Set<string> = new Set();
  showRegistrations = false;
  selectedEventRegistrations: any[] = [];
  selectedEventTitle = '';

  constructor(
    private eventService: EventService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.resetForm();
  }

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading = true;
    this.error = null;
    this.eventService.getEvents().subscribe({
      next: (response) => {
        this.events = response.data.events;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load events';
        this.loading = false;
        console.error('Error loading events:', error);
      }
    });
  }

  openCreateForm(): void {
    this.showCreateForm = true;
    this.editingEvent = null;
    this.resetForm();
  }

  closeForm(): void {
    this.showCreateForm = false;
    this.editingEvent = null;
    this.resetForm();
  }

  resetForm(): void {
    this.eventForm = {
      title: '',
      description: '',
      eventDate: '',
      location: '',
      maxAttendees: null,
      isActive: true
    };
    this.selectedFile = null;
  }

  openEditForm(event: Event): void {
    this.editingEvent = event;
    this.eventForm = {
      title: event.title,
      description: event.description,
      eventDate: new Date(event.eventDate).toISOString().slice(0, 16),
      location: event.location,
      maxAttendees: event.maxAttendees,
      isActive: true
    };
    this.selectedFile = null;
    this.showCreateForm = true;
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] || null;
  }

  onImageError(event: any): void {
    event.target.src = '/assets/images/placeholder.jpg';
  }

  onSubmit(): void {
    const formData = new FormData();
    Object.keys(this.eventForm).forEach(key => {
      if (this.eventForm[key] !== null && this.eventForm[key] !== '') {
        formData.append(key, this.eventForm[key]);
      }
    });
    
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
    
    if (this.editingEvent) {
      this.eventService.updateEvent(this.editingEvent.id, formData).subscribe({
        next: () => {
          this.loadEvents();
          this.closeForm();
        }
      });
    } else {
      this.eventService.createEvent(formData).subscribe({
        next: () => {
          this.loadEvents();
          this.closeForm();
        }
      });
    }
  }

  deleteEvent(event: Event): void {
    if (confirm('Delete this event?')) {
      this.eventService.deleteEvent(event.id).subscribe({
        next: () => {
          this.events = this.events.filter(e => e.id !== event.id);
          this.selectedEvents.delete(event.id);
          this.applyFilters();
        }
      });
    }
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onStatusFilterChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.events];

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(term) ||
        event.description.toLowerCase().includes(term) ||
        (event.location && event.location.toLowerCase().includes(term))
      );
    }

    if (this.statusFilter !== 'all') {
      const now = new Date();
      if (this.statusFilter === 'upcoming') {
        filtered = filtered.filter(event => new Date(event.eventDate) > now);
      } else if (this.statusFilter === 'past') {
        filtered = filtered.filter(event => new Date(event.eventDate) <= now);
      }
    }

    this.filteredEvents = filtered;
  }

  toggleEventSelection(eventId: string): void {
    if (this.selectedEvents.has(eventId)) {
      this.selectedEvents.delete(eventId);
    } else {
      this.selectedEvents.add(eventId);
    }
  }

  toggleSelectAll(): void {
    if (this.selectedEvents.size === this.filteredEvents.length) {
      this.selectedEvents.clear();
    } else {
      this.selectedEvents.clear();
      this.filteredEvents.forEach(event => this.selectedEvents.add(event.id));
    }
  }

  isSelected(eventId: string): boolean {
    return this.selectedEvents.has(eventId);
  }

  get isAllSelected(): boolean {
    return this.filteredEvents.length > 0 && this.selectedEvents.size === this.filteredEvents.length;
  }

  get isIndeterminate(): boolean {
    return this.selectedEvents.size > 0 && this.selectedEvents.size < this.filteredEvents.length;
  }

  bulkDelete(): void {
    if (this.selectedEvents.size === 0) return;

    const count = this.selectedEvents.size;
    if (confirm(`Are you sure you want to delete ${count} selected event(s)?`)) {
      const deletions = Array.from(this.selectedEvents).map(id => 
        this.eventService.deleteEvent(id)
      );

      Promise.all(deletions.map(obs => obs.toPromise()))
        .then(() => {
          this.events = this.events.filter(e => !this.selectedEvents.has(e.id));
          this.selectedEvents.clear();
          this.applyFilters();
        })
        .catch(error => {
          console.error('Error deleting events:', error);
          alert('Failed to delete some events');
        });
    }
  }

  clearSelection(): void {
    this.selectedEvents.clear();
  }

  bulkToggleStatus(): void {
    if (this.selectedEvents.size === 0) return;

    const updates = Array.from(this.selectedEvents).map(id => {
      const event = this.events.find(e => e.id === id);
      if (event) {
        const formData = new FormData();
        formData.append('isActive', (!event.isActive).toString());
        return this.eventService.updateEvent(id, formData);
      }
      return null;
    }).filter(Boolean);

    Promise.all(updates.map(obs => obs?.toPromise()))
      .then(() => {
        this.loadEvents();
        this.selectedEvents.clear();
      })
      .catch(error => {
        console.error('Error updating events:', error);
      });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }

  formatDateTime(date: Date): string {
    return new Date(date).toLocaleString();
  }

  isUpcoming(date: Date): boolean {
    return new Date(date) > new Date();
  }

  viewRegistrations(event: Event): void {
    this.selectedEventTitle = event.title;
    this.eventService.getEventRegistrations(event.id).subscribe({
      next: (response) => {
        this.selectedEventRegistrations = response.data.registrations;
        this.showRegistrations = true;
      },
      error: () => {
        alert('Failed to load registrations');
      }
    });
  }

  closeRegistrations(): void {
    this.showRegistrations = false;
    this.selectedEventRegistrations = [];
  }

  viewEventDetails(event: Event): void {
    this.router.navigate(['/admin/events', event.id]);
  }
}
