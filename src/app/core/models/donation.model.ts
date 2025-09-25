export interface Donation {
  id: string;
  userId?: string;
  programId?: string;
  amount: number;
  donorName?: string;
  donorEmail?: string;
  isAnonymous: boolean;
  paymentStatus: string;
  paymentReference?: string;
  createdAt: Date;
}

export interface CreateDonationRequest {
  userId?: string;
  programId?: string;
  amount: number;
  donorName?: string;
  donorEmail?: string;
  isAnonymous?: boolean;
  paymentReference?: string;
}

export interface DonationResponse {
  success: boolean;
  message: string;
  data: Donation;
}

export interface DonationsListResponse {
  success: boolean;
  data: {
    donations: Donation[];
  };
}