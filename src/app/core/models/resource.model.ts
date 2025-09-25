export interface Resource {
  id: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileType: string;
  category?: string;
  isPublic: boolean;
  uploadedBy?: string;
  createdAt: Date;
  imageUrl?: string;
  type?: string;
}

export interface CreateResourceRequest {
  title: string;
  description?: string;
  fileType: string;
  category?: string;
  isPublic?: boolean;
}

export interface ResourceResponse {
  success: boolean;
  message: string;
  data: Resource;
}

export interface ResourcesListResponse {
  success: boolean;
  data: {
    resources: Resource[];
  };
}