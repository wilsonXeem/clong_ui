import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../../core/services/event.service';
import { Event } from '../../core/models/event.model';

@Component({
  selector: 'app-admin-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class AdminEventDetailComponent implements OnInit {
  event: Event | null = null;
  registrations: any[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService
  ) { }

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.loadEventDetails(eventId);
    }
  }

  loadEventDetails(id: string): void {
    this.eventService.getEventById(id).subscribe({
      next: (response) => {
        this.event = response.data.event;
        this.loadRegistrations(id);
      },
      error: () => {
        this.error = 'Failed to load event';
        this.loading = false;
      }
    });
  }

  loadRegistrations(id: string): void {
    this.eventService.getEventRegistrations(id).subscribe({
      next: (response) => {
        this.registrations = response.data.registrations;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}