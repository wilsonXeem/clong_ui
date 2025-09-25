import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ArticleService } from '../../core/services/article.service';
import { Article } from '../../core/models/article.model';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css']
})
export class BlogsComponent implements OnInit {
  blogs: Article[] = [];
  filteredBlogs: Article[] = [];
  loading = false;
  error: string | null = null;
  searchTerm = '';
  statusFilter = 'all';
  selectedBlogs: Set<string> = new Set();
  showCreateForm = false;
  editingBlog: Article | null = null;
  blogForm: any = {};
  selectedFile: File | null = null;

  constructor(
    private articleService: ArticleService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.loading = true;
    this.error = null;

    this.articleService.getBlogs().subscribe({
      next: (response) => {
        this.blogs = response.data || [];
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load blogs';
        this.loading = false;
        console.error('Error loading blogs:', error);
      }
    });
  }

  openCreateForm(): void {
    this.showCreateForm = true;
    this.editingBlog = null;
    this.resetForm();
  }

  closeForm(): void {
    this.showCreateForm = false;
    this.editingBlog = null;
    this.resetForm();
  }

  resetForm(): void {
    this.blogForm = {
      title: '',
      content: '',
      excerpt: '',
      isPublished: false
    };
    this.selectedFile = null;
  }

  openEditForm(blog: Article): void {
    this.editingBlog = blog;
    this.blogForm = {
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt || '',
      isPublished: blog.isPublished
    };
    this.selectedFile = null;
    this.showCreateForm = true;
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] || null;
  }

  onImageError(event: any): void {
    event.target.src = '/assets/images/placeholder.jpg';
  }

  onSubmit(): void {
    const formData = new FormData();
    Object.keys(this.blogForm).forEach(key => {
      if (this.blogForm[key] !== null && this.blogForm[key] !== '') {
        formData.append(key, this.blogForm[key]);
      }
    });
    
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
    
    if (this.editingBlog) {
      this.articleService.updateArticle(this.editingBlog.id, formData).subscribe({
        next: () => {
          this.loadBlogs();
          this.closeForm();
        }
      });
    } else {
      this.articleService.createBlog(formData).subscribe({
        next: () => {
          this.loadBlogs();
          this.closeForm();
        }
      });
    }
  }

  deleteBlog(blog: Article): void {
    if (confirm('Delete this blog?')) {
      this.articleService.deleteArticle(blog.id).subscribe({
        next: () => {
          this.blogs = this.blogs.filter(b => b.id !== blog.id);
          this.selectedBlogs.delete(blog.id);
          this.applyFilters();
        }
      });
    }
  }

  publishBlog(id: string): void {
    this.articleService.publishArticle(id).subscribe({
      next: () => {
        this.loadBlogs();
      },
      error: (error) => {
        console.error('Error publishing blog:', error);
        alert('Failed to publish blog. Please try again.');
      }
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onStatusFilterChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.blogs];

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(blog => 
        blog.title.toLowerCase().includes(term) ||
        blog.content.toLowerCase().includes(term)
      );
    }

    if (this.statusFilter !== 'all') {
      const isPublished = this.statusFilter === 'published';
      filtered = filtered.filter(blog => blog.isPublished === isPublished);
    }

    this.filteredBlogs = filtered;
  }

  toggleBlogSelection(blogId: string): void {
    if (this.selectedBlogs.has(blogId)) {
      this.selectedBlogs.delete(blogId);
    } else {
      this.selectedBlogs.add(blogId);
    }
  }

  toggleSelectAll(): void {
    if (this.selectedBlogs.size === this.filteredBlogs.length) {
      this.selectedBlogs.clear();
    } else {
      this.selectedBlogs.clear();
      this.filteredBlogs.forEach(blog => this.selectedBlogs.add(blog.id));
    }
  }

  isSelected(blogId: string): boolean {
    return this.selectedBlogs.has(blogId);
  }

  get isAllSelected(): boolean {
    return this.filteredBlogs.length > 0 && this.selectedBlogs.size === this.filteredBlogs.length;
  }

  get isIndeterminate(): boolean {
    return this.selectedBlogs.size > 0 && this.selectedBlogs.size < this.filteredBlogs.length;
  }

  bulkToggleStatus(): void {
    if (this.selectedBlogs.size === 0) return;

    const updates = Array.from(this.selectedBlogs).map(id => {
      const blog = this.blogs.find(b => b.id === id);
      if (blog) {
        const formData = new FormData();
        formData.append('isPublished', (!blog.isPublished).toString());
        return this.articleService.updateArticle(id, formData);
      }
      return null;
    }).filter(Boolean);

    Promise.all(updates.map(obs => obs?.toPromise()))
      .then(() => {
        this.loadBlogs();
        this.selectedBlogs.clear();
      })
      .catch(error => {
        console.error('Error updating blogs:', error);
      });
  }

  bulkDelete(): void {
    if (this.selectedBlogs.size === 0) return;

    const count = this.selectedBlogs.size;
    if (confirm(`Are you sure you want to delete ${count} selected blog(s)?`)) {
      const deletions = Array.from(this.selectedBlogs).map(id => 
        this.articleService.deleteArticle(id)
      );

      Promise.all(deletions.map(obs => obs.toPromise()))
        .then(() => {
          this.blogs = this.blogs.filter(b => !this.selectedBlogs.has(b.id));
          this.selectedBlogs.clear();
          this.applyFilters();
        })
        .catch(error => {
          console.error('Error deleting blogs:', error);
        });
    }
  }

  clearSelection(): void {
    this.selectedBlogs.clear();
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }
}