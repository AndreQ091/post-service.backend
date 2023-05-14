import { IPost } from '@lib/post';

export class PostResponse implements Omit<IPost, 'isPublished'> {
  id: string;
  title: string;
  message: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}
