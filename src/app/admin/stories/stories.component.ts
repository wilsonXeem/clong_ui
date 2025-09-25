import { Component, OnInit } from '@angular/core';
import { Story, CreateStoryRequest } from '../../core/models/story.model';
import { StoryService } from '../../core/services/story.service';

@Component({
  selector: 'app-stories',
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.css']
})
export class StoriesComponent implements OnInit {
  stories: Story[] = [];
  filteredStories: Story[] = [];
  loading = true;
  error: string | null = null;
  showCreateForm = false;
  editingStory: Story | null = null;
  searchTerm = '';
  statusFilter = 'all';

  newStory: CreateStoryRequest = {
    title: '',
    content: '',
    category: '',
    imageUrl: '',
    isPublic: true
  } as CreateStoryRequest;

  selectedFile: File | null = null;

  constructor(private storyService: StoryService) { }

  ngOnInit(): void {
    this.loadStories();
  }

  loadStories(): void {
    this.loading = true;
    this.error = null;
    this.storyService.getStories().subscribe({
      next: (response) => {
        this.stories = response.data.stories;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load stories';
        this.loading = false;
        console.error('Error loading stories:', error);
      }
    });
  }

  createStory(): void {
    if (!this.newStory.title || !this.newStory.content) return;
    
    const formData = new FormData();
    formData.append('title', this.newStory.title);
    formData.append('content', this.newStory.content);
    formData.append('isPublished', this.newStory.isPublic ? 'true' : 'false');
    
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
    
    this.storyService.createStoryWithFormData(formData).subscribe({
      next: (response) => {
        this.stories.unshift(response.data.story);
        this.applyFilters();
        this.resetForm();
        this.showCreateForm = false;
      },
      error: (error) => {
        console.error('Error creating story:', error);
      }
    });
  }

  editStory(story: Story): void {
    this.editingStory = story;
    this.newStory = {
      title: story.title,
      content: story.content,
      imageUrl: story.imageUrl || '',
      category: '',
      isPublic: story.isPublished
    };
    this.selectedFile = null; // Reset file selection for editing
    this.showCreateForm = true;
  }

  updateStory(): void {
    if (!this.editingStory || !this.newStory.title || !this.newStory.content) return;
    
    const formData = new FormData();
    formData.append('title', this.newStory.title);
    formData.append('content', this.newStory.content);
    formData.append('isPublished', this.newStory.isPublic ? 'true' : 'false');
    
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
    
    this.storyService.updateStoryWithFormData(this.editingStory.id, formData).subscribe({
      next: (response) => {
        const index = this.stories.findIndex(s => s.id === this.editingStory!.id);
        if (index !== -1) {
          this.stories[index] = response.data.story;
        }
        this.applyFilters();
        this.resetForm();
        this.showCreateForm = false;
        this.editingStory = null;
      },
      error: (error) => {
        console.error('Error updating story:', error);
      }
    });
  }

  deleteStory(id: string): void {
    if (!confirm('Are you sure you want to delete this story?')) return;
    
    this.storyService.deleteStory(id).subscribe({
      next: () => {
        this.stories = this.stories.filter(s => s.id !== id);
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error deleting story:', error);
      }
    });
  }

  resetForm(): void {
    this.newStory = {
      title: '',
      content: '',
      category: '',
      imageUrl: '',
      isPublic: true
    };
    this.selectedFile = null;
  }

  cancelEdit(): void {
    this.resetForm();
    this.showCreateForm = false;
    this.editingStory = null;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.selectedFile = file;
    } else {
      this.selectedFile = null;
      if (file) {
        alert('Please select a valid image file.');
      }
    }
  }

  onSearch(): void {
    this.applyFilters();
  }

  onStatusFilter(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.stories];

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(story => 
        story.title.toLowerCase().includes(term) ||
        story.content.toLowerCase().includes(term)
      );
    }

    if (this.statusFilter !== 'all') {
      const isPublished = this.statusFilter === 'published';
      filtered = filtered.filter(story => story.isPublished === isPublished);
    }

    this.filteredStories = filtered;
  }

  getExcerpt(content: string, maxLength: number = 100): string {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + '...';
  }
}
