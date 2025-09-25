import { Component, OnInit } from '@angular/core';
import { NewsletterService } from '../../core/services/newsletter.service';

@Component({
  selector: 'app-newsletter-signup',
  templateUrl: './newsletter-signup.component.html',
  styleUrls: ['./newsletter-signup.component.css']
})
export class NewsletterSignupComponent implements OnInit {
  email: string = '';
  isSubmitting: boolean = false;
  showSuccess: boolean = false;

  constructor(private newsletterService: NewsletterService) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.email && this.isValidEmail(this.email)) {
      this.isSubmitting = true;
      
      this.newsletterService.subscribe(this.email).subscribe({
        next: (response) => {
          this.showSuccess = true;
          this.email = '';
          this.isSubmitting = false;
          setTimeout(() => {
            this.showSuccess = false;
          }, 3000);
        },
        error: (error) => {
          console.error('Newsletter subscription failed:', error);
          this.isSubmitting = false;
        }
      });
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
