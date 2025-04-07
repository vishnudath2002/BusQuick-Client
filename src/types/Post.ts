export type Category = 'Updates' | 'Feedback' | 'Promotions';

export interface Post {
  id: number;
  author: string;
  avatar: string;
  content: string;
  description: string;
  category: Category;
  likes: string[];
  comments: Comment[];
  liked: boolean;
}
  
export interface Comment {
  commentId: string;
  content: string;
  timestamp: Date;
  userId: string;
}