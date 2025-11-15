import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import commentService from '../../services/commentService';
import CommentItem from './CommentItem';

export default function CommentSection({ postId }) {
  const { user } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    try {
      setIsLoading(true);
      const response = await commentService.getAllCommentsForPost(postId);
      if (response.success) {
        // Organize comments into tree structure
        const commentMap = new Map();
        const rootComments = [];

        // First pass: create map of all comments
        response.data.forEach(comment => {
          commentMap.set(comment.id, { ...comment, replies: [] });
        });

        // Second pass: organize into tree structure
        response.data.forEach(comment => {
          const commentNode = commentMap.get(comment.id);
          if (comment.parentId) {
            const parent = commentMap.get(comment.parentId);
            if (parent) {
              parent.replies.push(commentNode);
            }
          } else {
            rootComments.push(commentNode);
          }
        });

        setComments(rootComments);
      }
    } catch (error) {
      console.error('Failed to load comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await commentService.createComment(postId, {
        content: newComment,
        parentId: replyingTo
      });

      if (response.success) {
        setNewComment('');
        setReplyingTo(null);
        loadComments(); // Reload comments to show new one
      }
    } catch (error) {
      console.error('Failed to create comment:', error);
      alert('Failed to post comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      const response = await commentService.deleteComment(commentId);
      if (response.success) {
        loadComments(); // Reload comments
      }
    } catch (error) {
      console.error('Failed to delete comment:', error);
      alert('Failed to delete comment. Please try again.');
    }
  };

  const handleUpdateComment = async (commentId, newContent) => {
    try {
      const response = await commentService.updateComment(commentId, newContent);
      if (response.success) {
        loadComments(); // Reload comments
      }
    } catch (error) {
      console.error('Failed to update comment:', error);
      alert('Failed to update comment. Please try again.');
    }
  };

  const handleReply = (commentId) => {
    setReplyingTo(commentId);
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Comments</h2>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl p-6">
      <h2 className="text-2xl font-bold text-white mb-6">
        Comments ({comments.length})
      </h2>

      {/* Comment Form */}
      {user ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <div className="flex items-start space-x-4">
            <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-white flex-shrink-0">
              {user.name?.[0] || 'U'}
            </div>
            <div className="flex-1">
              {replyingTo && (
                <div className="mb-2 flex items-center justify-between bg-gray-700 px-3 py-2 rounded text-sm">
                  <span className="text-gray-300">Replying to comment...</span>
                  <button
                    type="button"
                    onClick={cancelReply}
                    className="text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              )}
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                rows="3"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
              <div className="mt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || !newComment.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-gray-700 rounded-lg text-center">
          <p className="text-gray-300 mb-3">You need to be logged in to comment</p>
          <a
            href="/login"
            className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200"
          >
            Login to Comment
          </a>
        </div>
      )}

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p>No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUser={user}
              onDelete={handleDeleteComment}
              onUpdate={handleUpdateComment}
              onReply={handleReply}
            />
          ))}
        </div>
      )}
    </div>
  );
}
