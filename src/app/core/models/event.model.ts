export interface Event {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  location?: string;
  eventDate: Date;
  maxAttendees?: number;
  currentAttendees: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  registrationDate: Date;
  status: string;
}

export interface CreateEventRequest {
  title: string;
  description: string;
  eventDate: Date;
  location: string;
  maxAttendees?: number;
  imageUrl?: string;
}

export interface EventResponse {
  success: boolean;
  message: string;
  data: Event;
}

export interface EventsListResponse {
  success: boolean;
  data: {
    events: Event[];
  };
}

export interface EventRegistrationsResponse {
  success: boolean;
  data: {
    registrations: EventRegistration[];
  };
}
