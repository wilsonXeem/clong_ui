import { Component, OnInit } from '@angular/core';
import { EventService } from '../../core/services/event.service';
import { StoryService } from '../../core/services/story.service';
import { ProgramService } from '../../core/services/program.service';
import { Event } from '../../core/models/event.model';
import { Story } from '../../core/models/story.model';
import { Program } from '../../core/models/program.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  upcomingEvents: Event[] = [];
  featuredStory: Story | null = null;
  programs: Program[] = [];
  loading = true;
  
  constructor(
    private eventService: EventService,
    private storyService: StoryService,
    private programService: ProgramService
  ) { }

  ngOnInit(): void {
    this.loadHomeData();
  }

  loadHomeData(): void {
    this.loadUpcomingEvents();
    this.loadFeaturedStory();
    this.loadPrograms();
  }

  loadUpcomingEvents(): void {
    this.eventService.getEvents().subscribe({
      next: (response) => {
        const allEvents = response.data.events;
        this.upcomingEvents = allEvents
          .filter(event => new Date(event.eventDate) > new Date())
          .slice(0, 2);
      },
      error: (error) => console.error('Error loading events:', error)
    });
  }

  loadFeaturedStory(): void {
    this.storyService.getStories().subscribe({
      next: (response) => {
        const stories = response.data.stories;
        this.featuredStory = stories.find(story => story.isPublished) || stories[0] || null;
      },
      error: (error) => console.error('Error loading stories:', error)
    });
  }

  loadPrograms(): void {
    this.programService.getPrograms().subscribe({
      next: (response) => {
        this.programs = response.data.programs.slice(0, 4);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading programs:', error);
        this.loading = false;
      }
    });
  }

}
