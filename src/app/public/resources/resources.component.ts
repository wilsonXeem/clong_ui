import { Component, OnInit } from '@angular/core';
import { ResourceService } from '../../core/services/resource.service';
import { Resource } from '../../core/models/resource.model';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.css']
})
export class ResourcesComponent implements OnInit {
  resources: Resource[] = [];
  loading = false;
  error: string | null = null;

  constructor(private resourceService: ResourceService) { }

  ngOnInit(): void {
    this.loadResources();
  }

  loadResources(): void {
    this.loading = true;
    this.error = null;
    
    this.resourceService.getResources().subscribe({
      next: (response) => {
        this.resources = response.data.resources;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load resources. Please try again later.';
        this.loading = false;
        console.error('Error loading resources:', error);
      }
    });
  }
}
