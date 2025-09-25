import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Event } from '../../core/models/event.model';
import { EventService } from '../../core/services/event.service';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  event: Event | null = null;
  loading = true;
  error: string | null = null;
  showRegistrationForm = false;
  registrationData = {
    attendeeName: '',
    attendeeEmail: '',
    attendeePhone: ''
  };

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService
  ) { }

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.loadEvent(eventId);
    }
  }

  loadEvent(id: string): void {
    this.eventService.getEventById(id).subscribe({
      next: (response) => {
        this.event = response.data.event;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load event';
        this.loading = false;
      }
    });
  }

  showRegistration(): void {
    this.showRegistrationForm = true;
  }

  submitRegistration(): void {
    if (!this.event || !this.registrationData.attendeeName.trim() || !this.registrationData.attendeeEmail.trim()) {
      alert('Please fill in all required fields.');
      return;
    }
    
    this.eventService.registerForEvent(this.event.id, this.registrationData).subscribe({
      next: () => {
        alert('Successfully registered for event!');
        this.showRegistrationForm = false;
        this.registrationData = { attendeeName: '', attendeeEmail: '', attendeePhone: '' };
        this.loadEvent(this.event!.id);
      },
      error: () => {
        alert('Registration failed. Please try again.');
      }
    });
  }

  cancelRegistration(): void {
    this.showRegistrationForm = false;
    this.registrationData = { attendeeName: '', attendeeEmail: '', attendeePhone: '' };
  }

}
