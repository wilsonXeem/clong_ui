export interface UploadResponse {
  success: boolean;
  message: string;
  data: {
    imageUrl: string;
    publicId: string;
  };
}