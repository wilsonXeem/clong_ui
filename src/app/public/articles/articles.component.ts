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
  loading = false;
  error: string | null = null;
  contentType: 'article' | 'blog' = 'article';
  pageTitle = 'Articles';

  constructor(
    private articleService: ArticleService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.determineContentType();
    this.loadContent();
  }

  private determineContentType(): void {
    const url = this.router.url;
    if (url.includes('/blog')) {
      this.contentType = 'blog';
      this.pageTitle = 'Blog';
    } else {
      this.contentType = 'article';
      this.pageTitle = 'Articles';
    }
  }

  loadContent(): void {
    this.loading = true;
    this.error = null;
    
    const service$ = this.contentType === 'blog' 
      ? this.articleService.getPublishedBlogs()
      : this.articleService.getPublishedArticles();

    service$.subscribe({
      next: (response) => {
        this.articles = response.data;
        this.loading = false;
      },
      error: (error) => {
        this.error = `Failed to load ${this.contentType}s. Please try again later.`;
        this.loading = false;
        console.error(`Error loading ${this.contentType}s:`, error);
      }
    });
  }
}
