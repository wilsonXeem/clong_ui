import { Component, OnInit } from '@angular/core';
import { NewsletterService } from '../../core/services/newsletter.service';

@Component({
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.css']
})
export class NewsletterComponent implements OnInit {
  subscribers: any[] = [];
  loading = false;

  constructor(private newsletterService: NewsletterService) { }

  ngOnInit(): void {
    this.loadSubscribers();
  }

  loadSubscribers(): void {
    this.loading = true;
    this.newsletterService.getSubscribers().subscribe({
      next: (response) => {
        this.subscribers = response.data.subscribers;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  deleteSubscriber(id: string): void {
    if (confirm('Delete this subscriber?')) {
      this.newsletterService.deleteSubscriber(id).subscribe({
        next: () => this.loadSubscribers()
      });
    }
  }
}