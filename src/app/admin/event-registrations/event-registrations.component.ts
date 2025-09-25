import { Component, OnInit } from '@angular/core';
import { EventService } from '../../core/services/event.service';

@Component({
  selector: 'app-event-registrations',
  templateUrl: './event-registrations.component.html',
  styleUrls: ['./event-registrations.component.css']
})
export class EventRegistrationsComponent implements OnInit {
  registrations: any[] = [];
  events: any[] = [];
  loading = false;
  selectedEvent = '';

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
    this.loadEvents();
    this.loadRegistrations();
  }

  loadEvents(): void {
    this.eventService.getEvents().subscribe({
      next: (response) => this.events = response.data.events
    });
  }

  loadRegistrations(): void {
    this.loading = true;
    // Assuming there's a registration service
    this.loading = false;
  }

  filterByEvent(): void {
    this.loadRegistrations();
  }
}