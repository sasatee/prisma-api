export interface Comment {
  id?: string;
  content: string;
  postId: number;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
} 