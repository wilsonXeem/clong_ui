import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ArticlesComponent } from './articles/articles.component';
import { BlogsComponent } from './blogs/blogs.component';
import { CreateArticleComponent } from './create-article/create-article.component';
import { ContactsComponent } from './contacts/contacts.component';
import { EventsComponent } from './events/events.component';
import { ProgramsComponent } from './programs/programs.component';
import { ResourcesComponent } from './resources/resources.component';
import { StoriesComponent } from './stories/stories.component';
import { UploadsComponent } from './uploads/uploads.component';
import { VolunteersComponent } from './volunteers/volunteers.component';
import { DonationsComponent } from './donations/donations.component';
import { EventRegistrationsComponent } from './event-registrations/event-registrations.component';
import { AdminEventDetailComponent } from './event-detail/event-detail.component';
import { NewsletterComponent } from './newsletter/newsletter.component';
import { UsersComponent } from './users/users.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { SettingsComponent } from './settings/settings.component';
import { AuthGuard } from '../core/guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: '', 
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'articles', component: ArticlesComponent },
      { path: 'blogs', component: BlogsComponent },
      { path: 'articles/create', component: CreateArticleComponent },
      { path: 'articles/edit/:id', component: CreateArticleComponent },
      { path: 'blogs/create', component: CreateArticleComponent },
      { path: 'blogs/edit/:id', component: CreateArticleComponent },
      { path: 'contacts', component: ContactsComponent },
      { path: 'events', component: EventsComponent },
      { path: 'events/:id', component: AdminEventDetailComponent },
      { path: 'programs', component: ProgramsComponent },
      { path: 'resources', component: ResourcesComponent },
      { path: 'stories', component: StoriesComponent },
      { path: 'uploads', component: UploadsComponent },
      { path: 'volunteers', component: VolunteersComponent },
      { path: 'donations', component: DonationsComponent },
      { path: 'event-registrations', component: EventRegistrationsComponent },
      { path: 'newsletter', component: NewsletterComponent },
      { path: 'users', component: UsersComponent },
      { path: 'analytics', component: AnalyticsComponent },
      { path: 'settings', component: SettingsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
