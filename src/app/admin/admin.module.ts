import { NgModule } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


import { AdminRoutingModule } from './admin-routing.module';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ArticlesComponent } from './articles/articles.component';
import { EventsComponent } from './events/events.component';
import { ProgramsComponent } from './programs/programs.component';
import { StoriesComponent } from './stories/stories.component';
import { ResourcesComponent } from './resources/resources.component';
import { VolunteersComponent } from './volunteers/volunteers.component';
import { ContactsComponent } from './contacts/contacts.component';
import { UploadsComponent } from './uploads/uploads.component';
import { DonationsComponent } from './donations/donations.component';
import { EventRegistrationsComponent } from './event-registrations/event-registrations.component';
import { AdminEventDetailComponent } from './event-detail/event-detail.component';
import { NewsletterComponent } from './newsletter/newsletter.component';
import { UsersComponent } from './users/users.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { SettingsComponent } from './settings/settings.component';
import { AdminNavbarComponent } from './shared/admin-navbar/admin-navbar.component';
import { CreateArticleComponent } from './create-article/create-article.component';
import { BlogsComponent } from './blogs/blogs.component';
import { UserDialogComponent } from './users/user-dialog.component';


@NgModule({
  declarations: [
    LoginComponent,
    DashboardComponent,
    ArticlesComponent,
    BlogsComponent,
    CreateArticleComponent,
    EventsComponent,
    ProgramsComponent,
    StoriesComponent,
    ResourcesComponent,
    VolunteersComponent,
    ContactsComponent,
    UploadsComponent,
    DonationsComponent,
    EventRegistrationsComponent,
    AdminEventDetailComponent,
    NewsletterComponent,
    UsersComponent,
    UserDialogComponent,
    AnalyticsComponent,
    SettingsComponent,
    AdminNavbarComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,

  ],
  providers: [
    TitleCasePipe
  ],
  exports: [
    AdminNavbarComponent
  ]
})
export class AdminModule { }
