import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ArticleService } from '../../core/services/article.service';
import { Article } from '../../core/models/article.model';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit {
  articles: Article[] = [];
  blogs: Article[] = [];
  filteredArticles: Article[] = [];
  filteredBlogs: Article[] = [];
  loading = false;
  error: string | null = null;
  activeTab: 'articles' | 'blogs' = 'articles';
  searchTerm = '';
  statusFilter = 'all';
  selectedItems: Set<string> = new Set();
  selectedArticles: Set<string> = new Set();
  showCreateForm = false;
  editingArticle: Article | null = null;
  articleForm: any = {};
  selectedFile: File | null = null;

  constructor(
    private articleService: ArticleService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadArticles();
  }

  setActiveTab(tab: 'articles' | 'blogs'): void {
    this.activeTab = tab;
  }

  loadArticles(): void {
    this.loading = true;
    this.error = null;

    this.articleService.getArticles().subscribe({
      next: (response) => {
        this.articles = response.data || [];
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load articles';
        this.loading = false;
        console.error('Error loading articles:', error);
      }
    });
  }

  deleteItem(id: string): void {
    if (confirm('Are you sure you want to delete this item?')) {
      this.articleService.deleteArticle(id).subscribe({
        next: () => {
          this.loadArticles();
        },
        error: (error) => {
          console.error('Error deleting item:', error);
          alert('Failed to delete item. Please try again.');
        }
      });
    }
  }

  publishItem(id: string): void {
    this.articleService.publishArticle(id).subscribe({
      next: () => {
        this.loadArticles();
      },
      error: (error) => {
        console.error('Error publishing item:', error);
        alert('Failed to publish item. Please try again.');
      }
    });
  }

  editItem(id: string): void {
    this.router.navigate(['/admin/articles/edit', id]);
  }

  openCreateForm(): void {
    this.showCreateForm = true;
    this.editingArticle = null;
    this.resetForm();
  }

  closeForm(): void {
    this.showCreateForm = false;
    this.editingArticle = null;
    this.resetForm();
  }

  resetForm(): void {
    this.articleForm = {
      title: '',
      content: '',
      excerpt: '',
      isPublished: false
    };
    this.selectedFile = null;
  }

  openEditForm(article: Article): void {
    this.editingArticle = article;
    this.articleForm = {
      title: article.title,
      content: article.content,
      excerpt: article.excerpt || '',
      isPublished: article.isPublished
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
    Object.keys(this.articleForm).forEach(key => {
      if (this.articleForm[key] !== null && this.articleForm[key] !== '') {
        formData.append(key, this.articleForm[key]);
      }
    });
    
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
    
    if (this.editingArticle) {
      this.articleService.updateArticle(this.editingArticle.id, formData).subscribe({
        next: () => {
          this.loadArticles();
          this.closeForm();
        }
      });
    } else {
      this.articleService.createArticle(formData).subscribe({
        next: () => {
          this.loadArticles();
          this.closeForm();
        }
      });
    }
  }

  deleteArticle(article: Article): void {
    if (confirm('Delete this article?')) {
      this.articleService.deleteArticle(article.id).subscribe({
        next: () => {
          this.articles = this.articles.filter(a => a.id !== article.id);
          this.selectedArticles.delete(article.id);
          this.applyFilters();
        }
      });
    }
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onStatusFilterChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredArticles = this.filterItems(this.articles);
    this.filteredBlogs = this.filterItems(this.blogs);
  }

  private filterItems(items: Article[]): Article[] {
    let filtered = [...items];

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(term) ||
        item.content.toLowerCase().includes(term)
      );
    }

    if (this.statusFilter !== 'all') {
      const isPublished = this.statusFilter === 'published';
      filtered = filtered.filter(item => item.isPublished === isPublished);
    }

    return filtered;
  }

  get currentItems(): Article[] {
    return this.activeTab === 'articles' ? this.filteredArticles : this.filteredBlogs;
  }

  toggleArticleSelection(articleId: string): void {
    if (this.selectedArticles.has(articleId)) {
      this.selectedArticles.delete(articleId);
    } else {
      this.selectedArticles.add(articleId);
    }
  }

  toggleSelectAll(): void {
    if (this.selectedArticles.size === this.filteredArticles.length) {
      this.selectedArticles.clear();
    } else {
      this.selectedArticles.clear();
      this.filteredArticles.forEach(article => this.selectedArticles.add(article.id));
    }
  }

  isSelected(articleId: string): boolean {
    return this.selectedArticles.has(articleId);
  }

  get isAllSelected(): boolean {
    return this.filteredArticles.length > 0 && this.selectedArticles.size === this.filteredArticles.length;
  }

  get isIndeterminate(): boolean {
    return this.selectedArticles.size > 0 && this.selectedArticles.size < this.filteredArticles.length;
  }

  bulkToggleStatus(): void {
    if (this.selectedArticles.size === 0) return;

    const updates = Array.from(this.selectedArticles).map(id => {
      const article = this.articles.find(a => a.id === id);
      if (article) {
        const formData = new FormData();
        formData.append('isPublished', (!article.isPublished).toString());
        return this.articleService.updateArticle(id, formData);
      }
      return null;
    }).filter(Boolean);

    Promise.all(updates.map(obs => obs?.toPromise()))
      .then(() => {
        this.loadArticles();
        this.selectedArticles.clear();
      })
      .catch(error => {
        console.error('Error updating articles:', error);
      });
  }

  bulkDelete(): void {
    if (this.selectedArticles.size === 0) return;

    const count = this.selectedArticles.size;
    if (confirm(`Are you sure you want to delete ${count} selected article(s)?`)) {
      const deletions = Array.from(this.selectedArticles).map(id => 
        this.articleService.deleteArticle(id)
      );

      Promise.all(deletions.map(obs => obs.toPromise()))
        .then(() => {
          this.articles = this.articles.filter(a => !this.selectedArticles.has(a.id));
          this.selectedArticles.clear();
          this.applyFilters();
        })
        .catch(error => {
          console.error('Error deleting articles:', error);
        });
    }
  }

  clearSelection(): void {
    this.selectedArticles.clear();
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }
}
