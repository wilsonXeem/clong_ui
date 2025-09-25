import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { ArticleService } from '../../core/services/article.service';
import { EventService } from '../../core/services/event.service';
import { DonationService } from '../../core/services/donation.service';
import { VolunteerService } from '../../core/services/volunteer.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  stats = {
    articles: 0,
    events: 0,
    donations: 0,
    volunteers: 0
  };
  loading = true;

  constructor(
    private authService: AuthService,
    private articleService: ArticleService,
    private eventService: EventService,
    private donationService: DonationService,
    private volunteerService: VolunteerService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadStats();
  }

  private loadStats(): void {
    this.loading = true;
    
    Promise.all([
      this.articleService.getArticles().toPromise(),
      this.eventService.getEvents().toPromise(),
      this.donationService.getDonations().toPromise(),
      this.volunteerService.getVolunteers().toPromise()
    ]).then(([articles, events, donations, volunteers]) => {
      this.stats = {
        articles: articles?.data?.length || 0,
        events: events?.data?.events?.length || 0,
        donations: donations?.data?.donations?.length || 0,
        volunteers: volunteers?.data?.volunteers?.length || 0
      };
    }).catch(error => {
      console.error('Error loading stats:', error);
    }).finally(() => {
      this.loading = false;
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
