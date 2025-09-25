export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  type: 'article' | 'blog';
  authorId: string;
  isPublished: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateArticleRequest {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  type?: 'article' | 'blog';
}

export interface ArticleResponse {
  success: boolean;
  message: string;
  data: Article;
}

export interface ArticlesListResponse {
  success: boolean;
  data: Article[];
}