import api from './api';

const postService = {
  // Create a new post
  createPost: async (postData) => {
    const response = await api.post('/posts', postData);
    return response.data;
  },

  // Get all published posts with pagination
  getPosts: async (page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc') => {
    const response = await api.get('/posts', {
      params: { page, size, sortBy, sortDir }
    });
    return response.data;
  },

  // Get post by ID
  getPostById: async (id) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  // Get post by slug
  getPostBySlug: async (slug) => {
    const response = await api.get(`/posts/slug/${slug}`);
    return response.data;
  },

  // Get current user's posts
  getMyPosts: async (page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc') => {
    const response = await api.get('/posts/my-posts', {
      params: { page, size, sortBy, sortDir }
    });
    return response.data;
  },

  // Get posts by author
  getPostsByAuthor: async (username, page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc') => {
    const response = await api.get(`/posts/author/${username}`, {
      params: { page, size, sortBy, sortDir }
    });
    return response.data;
  },

  // Update post
  updatePost: async (id, postData) => {
    const response = await api.put(`/posts/${id}`, postData);
    return response.data;
  },

  // Delete post
  deletePost: async (id) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },

  // Like/Unlike post
  toggleLike: async (id) => {
    const response = await api.post(`/posts/${id}/like`);
    return response.data;
  },

  // Search posts
  searchPosts: async (query, page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc') => {
    const response = await api.get('/posts/search', {
      params: { q: query, page, size, sortBy, sortDir }
    });
    return response.data;
  },

  // Get popular posts
  getPopularPosts: async (limit = 10) => {
    const response = await api.get('/posts/popular', {
      params: { limit }
    });
    return response.data;
  },

  // Get recent posts
  getRecentPosts: async (limit = 10) => {
    const response = await api.get('/posts/recent', {
      params: { limit }
    });
    return response.data;
  },

  // Get user post statistics
  getUserPostStats: async () => {
    const response = await api.get('/posts/stats');
    return response.data;
  }
};

export default postService;
