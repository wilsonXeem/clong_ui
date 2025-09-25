export interface Volunteer {
  id: string;
  userId: string;
  skills?: string;
  availability?: string;
  interests?: string;
  experience?: string;
  motivation?: string;
  status: 'pending' | 'approved' | 'rejected' | 'active';
  createdAt: Date;
  updatedAt: Date;
}

export interface VolunteerApplicationRequest {
  skills: string;
  availability: string;
  interests: string;
  experience?: string;
  motivation?: string;
}

export interface VolunteerResponse {
  success: boolean;
  message: string;
  data: Volunteer;
}

export interface VolunteersListResponse {
  success: boolean;
  data: {
    volunteers: Volunteer[];
  };
}