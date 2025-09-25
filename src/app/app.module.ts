import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './core/services/token.interceptor';

import { AppRoutingModule } from './app-routing.module';
import { AdminModule } from './admin/admin.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { CardComponent } from './shared/card/card.component';
import { NewsletterSignupComponent } from './shared/newsletter-signup/newsletter-signup.component';
import { PaymentFormComponent } from './shared/payment-form/payment-form.component';
import { CountdownTimerComponent } from './shared/countdown-timer/countdown-timer.component';
import { HomeComponent } from './public/home/home.component';
import { AboutComponent } from './public/about/about.component';
import { ArticlesComponent } from './public/articles/articles.component';
import { ArticleDetailComponent } from './public/article-detail/article-detail.component';
import { EventsComponent } from './public/events/events.component';
import { EventDetailComponent } from './public/event-detail/event-detail.component';
import { ProgramsComponent } from './public/programs/programs.component';
import { StoriesComponent } from './public/stories/stories.component';
import { ResourcesComponent } from './public/resources/resources.component';
import { VolunteerComponent } from './public/volunteer/volunteer.component';
import { ContactComponent } from './public/contact/contact.component';
import { DonateComponent } from './public/donate/donate.component';
import { LoginComponent } from './public/auth/login/login.component';
import { RegisterComponent } from './public/auth/register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    CardComponent,
    NewsletterSignupComponent,
    PaymentFormComponent,
    CountdownTimerComponent,
    HomeComponent,
    AboutComponent,
    ArticlesComponent,
    ArticleDetailComponent,
    EventsComponent,
    EventDetailComponent,
    ProgramsComponent,
    StoriesComponent,
    ResourcesComponent,
    VolunteerComponent,
    ContactComponent,
    DonateComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AdminModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
