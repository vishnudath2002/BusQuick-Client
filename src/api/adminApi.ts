import { apiClient } from "./apiClient";

interface UserListParams {
  role: string;
  searchQuery?: string;
  page?: number;
  limit?: number;
}

export const userLists = async ({ role, searchQuery = '', page = 1, limit = 10 }: UserListParams) => {
  const response = await apiClient.get('/admin/userlist', {
    params: {
      role,
      searchQuery,
      page,
      limit,
    },
  });
  return response.data;
};
  
  
  export const ownerLists = async () => {
    const response = await apiClient.get('/admin/ownerlist');
    return response.data;
  }
  
  
  export const adminLogin = async (email: string, password: string) => {
    const response = await apiClient.post('/admin/login', { email, password });
    return response.data;
  };

  
  export const userBlockToggle = async (userId: string) => {
     const response = await apiClient.post(`/admin/toggle-block/${userId}`);
     return response.data;
  }