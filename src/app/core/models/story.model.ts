export interface Story {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  authorId?: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateStoryRequest {
  title: string;
  content: string;
  category?: string;
  imageUrl?: string;
  isPublic?: boolean;
}

export interface StoryResponse {
  success: boolean;
  message: string;
  data: {
    story: Story;
  };
}

export interface StoriesListResponse {
  success: boolean;
  data: {
    stories: Story[];
  };
}