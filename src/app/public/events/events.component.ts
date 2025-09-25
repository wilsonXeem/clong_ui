import { Component, OnInit } from '@angular/core';
import { Event } from '../../core/models/event.model';
import { EventService } from '../../core/services/event.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  events: Event[] = [];
  pastEvents: Event[] = [];
  upcomingEvents: Event[] = [];
  loading = true;
  error: string | null = null;
  activeTab: 'upcoming' | 'past' = 'upcoming';

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading = true;
    this.error = null;
    this.eventService.getEvents().subscribe({
      next: (response) => {
        this.events = response.data.events;
        this.separateEvents();
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load events';
        this.loading = false;
        console.error('Error loading events:', error);
      }
    });
  }

  isUpcoming(event: Event): boolean {
    if (!event.eventDate) return false;
    return new Date(event.eventDate) > new Date();
  }

  isOngoing(event: Event): boolean {
    // Since we don't have endDate, consider events as ongoing on the same day
    if (!event.eventDate) return false;
    const now = new Date();
    const eventDate = new Date(event.eventDate);
    return eventDate.toDateString() === now.toDateString();
  }

  isCompleted(event: Event): boolean {
    if (!event.eventDate) return false;
    const eventDate = new Date(event.eventDate);
    const now = new Date();
    return eventDate < now && eventDate.toDateString() !== now.toDateString();
  }

  getEventStatus(event: Event): string {
    if (this.isOngoing(event)) return 'Ongoing';
    if (this.isUpcoming(event)) return 'Upcoming';
    return 'Completed';
  }

  getRegistrationPercentage(event: Event): number {
    if (!event.maxAttendees || event.maxAttendees === 0) return 0;
    return Math.min((event.currentAttendees / event.maxAttendees) * 100, 100);
  }

  isRegistrationOpen(event: Event): boolean {
    if (this.isCompleted(event) || !event.isActive) return false;
    if (!event.maxAttendees) return true;
    return event.currentAttendees < event.maxAttendees;
  }

  separateEvents(): void {
    this.upcomingEvents = this.events.filter(event => this.isUpcoming(event) || this.isOngoing(event));
    this.pastEvents = this.events.filter(event => this.isCompleted(event));
  }

  switchTab(tab: 'upcoming' | 'past'): void {
    this.activeTab = tab;
  }

  shareEvent(event: Event): void {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href
      }).catch(console.error);
    } else {
      const shareText = `${event.title} - ${event.description}\n\nLearn more: ${window.location.href}`;
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Event details copied to clipboard!');
      }).catch(() => {
        alert('Unable to share. Please copy the URL manually.');
      });
    }
  }
}
