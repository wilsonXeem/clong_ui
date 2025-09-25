import { Injectable } from '@angular/core';

declare let gtag: Function;

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor() { }

  trackEvent(action: string, category: string, label?: string, value?: number): void {
    if (typeof gtag !== 'undefined') {
      gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value
      });
    }
  }

  trackPageView(url: string, title?: string): void {
    if (typeof gtag !== 'undefined') {
      gtag('config', 'GA_TRACKING_ID', {
        page_path: url,
        page_title: title
      });
    }
  }

  trackDonation(amount: number, currency: string = 'USD'): void {
    this.trackEvent('donation', 'engagement', 'donation_completed', amount);
    
    if (typeof gtag !== 'undefined') {
      gtag('event', 'purchase', {
        transaction_id: Date.now().toString(),
        value: amount,
        currency: currency,
        items: [{
          item_id: 'donation',
          item_name: 'Donation',
          category: 'donation',
          quantity: 1,
          price: amount
        }]
      });
    }
  }

  trackEventRegistration(eventId: string, eventTitle: string): void {
    this.trackEvent('event_registration', 'engagement', eventTitle);
  }

  trackNewsletterSignup(): void {
    this.trackEvent('newsletter_signup', 'engagement', 'newsletter_subscription');
  }
}
