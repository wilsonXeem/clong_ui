import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleService } from '../../core/services/article.service';
import { Article } from '../../core/models/article.model';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css']
})
export class ArticleDetailComponent implements OnInit {
  article: Article | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private articleService: ArticleService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const slug = params['slug'] || 'sample-article';
      console.log('Loading article with slug:', slug);
      this.loadArticle(slug);
    });
  }

  loadArticle(slug: string): void {
    this.loading = true;
    this.error = null;
    
    this.articleService.getArticleBySlug(slug).subscribe({
      next: (response) => {
        this.article = response.data;
        this.loading = false;
      },
      error: (error) => {
        // Fallback: Create a sample article for demonstration
        this.article = {
          id: '1',
          title: 'Sample Article',
          slug: slug,
          excerpt: 'This is a sample article excerpt to demonstrate the article detail page functionality.',
          content: `
            <h2>Welcome to CloNG Project Articles</h2>
            <p>This is a sample article to demonstrate the article detail page. In a real implementation, this content would be loaded from the backend API.</p>
            
            <h3>Our Mission</h3>
            <p>At CloNG Project, we are committed to raising Godly leaders in academia and career. Through our various programs and initiatives, we empower the next generation to excel in their chosen fields while maintaining strong Christian values.</p>
            
            <h3>Key Programs</h3>
            <p>Our programs include:</p>
            <ul>
              <li>Scholarship schemes for deserving students</li>
              <li>Leadership development workshops</li>
              <li>Career mentorship programs</li>
              <li>Academic excellence initiatives</li>
            </ul>
            
            <p>For more information about our programs and how to get involved, please visit our programs page or contact us directly.</p>
          `,
          featuredImage: undefined,
          type: 'article',
          authorId: 'admin',
          isPublished: true,
          publishedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        this.loading = false;
        console.warn('Using fallback article content. Backend API not available:', error);
      }
    });
  }

  shareArticle(): void {
    if (!this.article) return;
    
    if (navigator.share) {
      navigator.share({
        title: this.article.title,
        text: this.article.excerpt || this.article.title,
        url: window.location.href
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Article link copied to clipboard!');
      }).catch(() => {
        alert('Unable to share. Please copy the URL manually.');
      });
    }
  }
}