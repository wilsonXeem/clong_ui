import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Article, CreateArticleRequest, ArticleResponse, ArticlesListResponse } from '../models/article.model';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private api: ApiService) { }

  createArticle(data: CreateArticleRequest | FormData): Observable<ArticleResponse> {
    return this.api.post<ArticleResponse>('/articles', data);
  }

  createBlog(data: CreateArticleRequest | FormData): Observable<ArticleResponse> {
    return this.api.post<ArticleResponse>('/blogs', data);
  }

  getArticles(): Observable<ArticlesListResponse> {
    return this.api.get<ArticlesListResponse>('/articles');
  }

  getBlogs(): Observable<ArticlesListResponse> {
    return this.api.get<ArticlesListResponse>('/blogs');
  }

  getPublishedArticles(): Observable<ArticlesListResponse> {
    return this.api.get<ArticlesListResponse>('/articles?published=true');
  }

  getPublishedBlogs(): Observable<ArticlesListResponse> {
    return this.api.get<ArticlesListResponse>('/blogs?published=true');
  }

  getArticleBySlug(slug: string): Observable<{ success: boolean; data: Article }> {
    return this.api.get<{ success: boolean; data: Article }>(`/articles/${slug}`);
  }

  getArticleById(id: string): Observable<{ success: boolean; data: { article: Article } }> {
    return this.api.get<{ success: boolean; data: { article: Article } }>(`/articles/${id}`);
  }

  updateArticle(id: string, data: Partial<CreateArticleRequest> | FormData): Observable<ArticleResponse> {
    return this.api.put<ArticleResponse>(`/articles/${id}`, data);
  }

  deleteArticle(id: string): Observable<{ success: boolean; message: string }> {
    return this.api.delete<{ success: boolean; message: string }>(`/articles/${id}`);
  }

  publishArticle(id: string): Observable<{ success: boolean; message: string }> {
    return this.api.patch<{ success: boolean; message: string }>(`/articles/${id}/publish`, {});
  }
}