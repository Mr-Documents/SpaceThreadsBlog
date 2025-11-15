import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import postService from '../../services/postService';
import commentService from '../../services/commentService';
import CommentSection from '../../components/posts/CommentSection';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    loadPost();
  }, [id]);

  const loadPost = async () => {
    try {
      setIsLoading(true);
      const response = await postService.getPostById(id);
      if (response.success) {
        setPost(response.data);
      } else {
        setError('Failed to load post');
      }
    } catch (error) {
      console.error('Failed to load post:', error);
      setError('Failed to load post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await postService.deletePost(id);
      if (response.success) {
        navigate('/dashboard', { state: { message: 'Post deleted successfully' } });
      } else {
        alert(response.message || 'Failed to delete post');
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert(error.response?.data?.message || 'Failed to delete post');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setIsLiking(true);
    try {
      const response = await postService.toggleLike(id);
      if (response.success) {
        setPost(response.data);
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const isAuthor = user && post && post.author.username === user.username;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
          <p className="text-gray-400 mb-6">{error || 'Post not found'}</p>
          <button
            onClick={() => navigate('/home')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-200"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Post Header */}
        <article className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          {/* Cover Image */}
          {post.coverImage && (
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-96 object-cover"
            />
          )}

          <div className="p-8">
            {/* Title */}
            <h1 className="text-4xl font-bold text-white mb-4">{post.title}</h1>

            {/* Author and Meta Info */}
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-700">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-gray-700 flex items-center justify-center text-white text-lg">
                  {post.author.name?.[0] || 'U'}
                </div>
                <div>
                  <Link 
                    to={`/profile/${post.author.username}`}
                    className="text-lg font-medium text-white hover:text-blue-400"
                  >
                    {post.author.name}
                  </Link>
                  <p className="text-sm text-gray-400">
                    {formatDate(post.createdAt)} • {post.viewCount || 0} views
                  </p>
                </div>
              </div>

              {/* Edit/Delete Buttons for Author */}
              {isAuthor && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate(`/posts/edit/${id}`)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition duration-200"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            {/* Category and Tags */}
            <div className="flex items-center space-x-4 mb-6">
              {post.category && (
                <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
                  {post.category.name}
                </span>
              )}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-full"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Excerpt */}
            {post.excerpt && (
              <div className="mb-6 p-4 bg-gray-700 rounded-lg">
                <p className="text-gray-300 italic">{post.excerpt}</p>
              </div>
            )}

            {/* Content */}
            <div className="prose prose-invert max-w-none mb-8">
              <div 
                className="text-gray-300 leading-relaxed whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>

            {/* Like and Share Section */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-700">
              <div className="flex items-center space-x-6">
                <button
                  onClick={handleLike}
                  disabled={isLiking}
                  className="flex items-center space-x-2 text-gray-400 hover:text-red-500 transition duration-200"
                >
                  <svg className="w-6 h-6" fill={post.liked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>{post.likeCount || 0} Likes</span>
                </button>

                <div className="flex items-center space-x-2 text-gray-400">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>{post.commentCount || 0} Comments</span>
                </div>
              </div>

              <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition duration-200">
                Share
              </button>
            </div>
          </div>
        </article>

        {/* Comment Section */}
        <div className="mt-8">
          <CommentSection postId={id} />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">Delete Post</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition duration-200 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
