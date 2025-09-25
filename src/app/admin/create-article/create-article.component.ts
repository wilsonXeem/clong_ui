import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ArticleService } from '../../core/services/article.service';

@Component({
  selector: 'app-create-article',
  templateUrl: './create-article.component.html',
  styleUrls: ['./create-article.component.css']
})
export class CreateArticleComponent implements OnInit {
  articleForm: FormGroup;
  contentType: 'article' | 'blog' = 'article';
  isEdit = false;
  loading = false;
  articleId?: number;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private articleService: ArticleService
  ) {
    this.articleForm = this.fb.group({
      title: ['', Validators.required],
      slug: ['', Validators.required],
      excerpt: [''],
      content: ['', Validators.required],
      isPublished: [false]
    });
  }

  ngOnInit() {
    // Determine content type from route or query params
    const url = this.router.url;
    if (url.includes('/blogs/')) {
      this.contentType = 'blog';
    } else {
      this.route.queryParams.subscribe(params => {
        this.contentType = params['type'] || 'article';
      });
    }

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.articleId = +params['id'];
        this.loadArticle();
      }
    });

    this.articleForm.get('title')?.valueChanges.subscribe(title => {
      if (title && !this.isEdit) {
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        this.articleForm.patchValue({ slug }, { emitEvent: false });
      }
    });
  }

  loadArticle() {
    if (this.articleId) {
      this.articleService.getArticleById(this.articleId.toString()).subscribe(response => {
        if (response.success) {
          this.articleForm.patchValue(response.data.article);
        }
      });
    }
  }

  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit() {
    if (this.articleForm.valid) {
      this.loading = true;
      const formData = new FormData();
      
      Object.keys(this.articleForm.value).forEach(key => {
        formData.append(key, this.articleForm.value[key]);
      });
      
      formData.append('type', this.contentType);
      
      if (this.selectedFile) {
        formData.append('featuredImage', this.selectedFile);
      }

      let request;
      if (this.isEdit) {
        request = this.articleService.updateArticle(this.articleId!.toString(), formData);
      } else {
        request = this.contentType === 'blog' 
          ? this.articleService.createBlog(formData)
          : this.articleService.createArticle(formData);
      }

      request.subscribe({
        next: () => {
          this.router.navigate(['/admin/articles']);
        },
        error: (error) => {
          console.error('Error saving:', error);
          this.loading = false;
        }
      });
    }
  }

  goBack() {
    this.location.back();
  }
}