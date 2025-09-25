export interface NewsletterSubscriber {
  id: string;
  email: string;
  isActive: boolean;
  subscribedAt: Date;
  unsubscribedAt?: Date;
}

export interface NewsletterResponse {
  success: boolean;
  message: string;
}

export interface SubscribersResponse {
  success: boolean;
  data: {
    subscribers: NewsletterSubscriber[];
  };
}