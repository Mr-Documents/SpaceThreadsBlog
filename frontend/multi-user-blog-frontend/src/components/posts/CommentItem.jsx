import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function CommentItem({ comment, currentUser, onDelete, onUpdate, onReply, depth = 0 }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isExpanded, setIsExpanded] = useState(true);

  const isAuthor = currentUser && comment.author.username === currentUser.username;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // difference in seconds

    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const handleSaveEdit = () => {
    if (editContent.trim() && editContent !== comment.content) {
      onUpdate(comment.id, editContent);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  const hasReplies = comment.replies && comment.replies.length > 0;
  const maxDepth = 5; // Maximum nesting level

  return (
    <div className={`${depth > 0 ? 'ml-8 mt-4' : ''}`}>
      <div className="flex space-x-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-white text-sm">
            {comment.author.name?.[0] || 'U'}
          </div>
        </div>

        {/* Comment Content */}
        <div className="flex-1 min-w-0">
          <div className="bg-gray-700 rounded-lg p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Link
                  to={`/profile/${comment.author.username}`}
                  className="font-medium text-white hover:text-blue-400"
                >
                  {comment.author.name}
                </Link>
                <span className="text-gray-400 text-sm">•</span>
                <span className="text-gray-400 text-sm">{formatDate(comment.createdAt)}</span>
                {comment.updatedAt && comment.updatedAt !== comment.createdAt && (
                  <>
                    <span className="text-gray-400 text-sm">•</span>
                    <span className="text-gray-400 text-sm italic">edited</span>
                  </>
                )}
              </div>

              {/* Actions for comment author */}
              {isAuthor && !isEditing && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-gray-400 hover:text-blue-400 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(comment.id)}
                    className="text-gray-400 hover:text-red-400 text-sm"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            {/* Content */}
            {isEditing ? (
              <div>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows="3"
                />
                <div className="mt-2 flex justify-end space-x-2">
                  <button
                    onClick={handleCancelEdit}
                    className="px-3 py-1 text-sm text-gray-400 hover:text-white transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    disabled={!editContent.trim()}
                    className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition disabled:opacity-50"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-300 whitespace-pre-wrap break-words">{comment.content}</p>
            )}
          </div>

          {/* Action Buttons */}
          {!isEditing && (
            <div className="mt-2 flex items-center space-x-4">
              {currentUser && depth < maxDepth && (
                <button
                  onClick={() => onReply(comment.id)}
                  className="text-sm text-gray-400 hover:text-blue-400 transition"
                >
                  Reply
                </button>
              )}
              
              {hasReplies && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-sm text-gray-400 hover:text-blue-400 transition"
                >
                  {isExpanded ? 'Hide' : 'Show'} {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                </button>
              )}
            </div>
          )}

          {/* Nested Replies */}
          {hasReplies && isExpanded && (
            <div className="mt-4 space-y-4">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  currentUser={currentUser}
                  onDelete={onDelete}
                  onUpdate={onUpdate}
                  onReply={onReply}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
