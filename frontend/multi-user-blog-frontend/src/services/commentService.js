import api from './api';

const commentService = {
  // Create a new comment
  createComment: async (postId, commentData) => {
    const response = await api.post(`/comments/post/${postId}`, commentData);
    return response.data;
  },

  // Get comments for a post
  getCommentsForPost: async (postId, page = 0, size = 10, sortBy = 'createdAt', sortDir = 'asc') => {
    const response = await api.get(`/comments/post/${postId}`, {
      params: { page, size, sortBy, sortDir }
    });
    return response.data;
  },

  // Get all comments for a post (including nested)
  getAllCommentsForPost: async (postId) => {
    const response = await api.get(`/comments/post/${postId}/all`);
    return response.data;
  },

  // Get comment by ID
  getCommentById: async (id) => {
    const response = await api.get(`/comments/${id}`);
    return response.data;
  },

  // Update comment
  updateComment: async (id, content) => {
    const response = await api.put(`/comments/${id}`, null, {
      params: { content }
    });
    return response.data;
  },

  // Delete comment
  deleteComment: async (id) => {
    const response = await api.delete(`/comments/${id}`);
    return response.data;
  },

  // Get current user's comments
  getMyComments: async (page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc') => {
    const response = await api.get('/comments/my-comments', {
      params: { page, size, sortBy, sortDir }
    });
    return response.data;
  },

  // Get comment count for a post
  getCommentCount: async (postId) => {
    const response = await api.get(`/comments/post/${postId}/count`);
    return response.data;
  }
};

export default commentService;
