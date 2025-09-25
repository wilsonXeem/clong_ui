import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './public/home/home.component';
import { AboutComponent } from './public/about/about.component';
import { ArticlesComponent } from './public/articles/articles.component';
import { ArticleDetailComponent } from './public/article-detail/article-detail.component';
import { ContactComponent } from './public/contact/contact.component';
import { DonateComponent } from './public/donate/donate.component';
import { EventsComponent } from './public/events/events.component';
import { EventDetailComponent } from './public/event-detail/event-detail.component';
import { ProgramsComponent } from './public/programs/programs.component';
import { ResourcesComponent } from './public/resources/resources.component';
import { StoriesComponent } from './public/stories/stories.component';
import { VolunteerComponent } from './public/volunteer/volunteer.component';
import { LoginComponent } from './public/auth/login/login.component';
import { RegisterComponent } from './public/auth/register/register.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'articles', component: ArticlesComponent },
  { path: 'articles/:slug', component: ArticleDetailComponent },
  { path: 'blog', component: ArticlesComponent },
  { path: 'blog/:slug', component: ArticleDetailComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'donate', component: DonateComponent },
  { path: 'events', component: EventsComponent },
  { path: 'events/:id', component: EventDetailComponent },
  { path: 'programs', component: ProgramsComponent },
  { path: 'resources', component: ResourcesComponent },
  { path: 'stories', component: StoriesComponent },
  { path: 'volunteer', component: VolunteerComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'admin', 
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
