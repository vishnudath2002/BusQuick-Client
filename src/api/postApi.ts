import { Post } from '../types/Post';
import { apiClient } from "./apiClient"

export const fetchAllPosts = async () => {
  const response = await apiClient.get('/media/posts',{});
   return response.data;
}

export const createPost = async (post: Post) => {
  const response = await apiClient.post('/media/addPost',{post} );
  return response.data;
}
