import { Component, OnInit } from '@angular/core';
import { Story } from '../../core/models/story.model';
import { StoryService } from '../../core/services/story.service';

@Component({
  selector: 'app-stories',
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.css']
})
export class StoriesComponent implements OnInit {
  stories: Story[] = [];
  loading = true;
  error: string | null = null;

  constructor(private storyService: StoryService) { }

  ngOnInit(): void {
    this.loadStories();
  }

  loadStories(): void {
    this.loading = true;
    this.error = null;
    this.storyService.getStories().subscribe({
      next: (response) => {
        this.stories = response.data.stories.filter(story => story.isPublished);
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load stories';
        this.loading = false;
        console.error('Error loading stories:', error);
      }
    });
  }

  getExcerpt(content: string, maxLength: number = 150): string {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + '...';
  }
}
