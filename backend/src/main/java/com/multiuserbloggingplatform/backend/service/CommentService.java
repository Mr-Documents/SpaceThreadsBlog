package com.multiuserbloggingplatform.backend.service;

import com.multiuserbloggingplatform.backend.dto.CreateCommentRequest;
import com.multiuserbloggingplatform.backend.dto.CommentResponse;
import com.multiuserbloggingplatform.backend.entity.Comment;
import com.multiuserbloggingplatform.backend.entity.Post;
import com.multiuserbloggingplatform.backend.entity.User;
import com.multiuserbloggingplatform.backend.repository.CommentRepository;
import com.multiuserbloggingplatform.backend.repository.PostRepository;
import com.multiuserbloggingplatform.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    // Create a new comment
    public CommentResponse createComment(Long postId, CreateCommentRequest request, String username) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found: " + postId));

        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        Comment comment = new Comment();
        comment.setContent(request.getContent());
        comment.setPost(post);
        comment.setAuthor(author);

        // Handle parent comment for nested replies
        if (request.getParentCommentId() != null) {
            Comment parentComment = commentRepository.findById(request.getParentCommentId())
                    .orElseThrow(() -> new RuntimeException("Parent comment not found: " + request.getParentCommentId()));
            
            // Ensure parent comment belongs to the same post
            if (!parentComment.getPost().getId().equals(postId)) {
                throw new RuntimeException("Parent comment does not belong to this post");
            }
            
            comment.setParentComment(parentComment);
        }

        Comment savedComment = commentRepository.save(comment);
        return new CommentResponse(savedComment);
    }

    // Get comments for a post
    public Page<CommentResponse> getCommentsForPost(Long postId, int page, int size, String sortBy, String sortDir) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found: " + postId));

        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        // Get only top-level comments (no parent)
        Page<Comment> comments = commentRepository.findByPostAndParentCommentIsNull(post, pageable);
        return comments.map(CommentResponse::new);
    }

    // Get all comments for a post (including nested)
    public List<CommentResponse> getAllCommentsForPost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found: " + postId));

        // Get only top-level comments, nested replies will be included in the response
        List<Comment> topLevelComments = commentRepository.findByPostAndParentCommentIsNullOrderByCreatedAtAsc(post);
        
        return topLevelComments.stream()
                .map(CommentResponse::new)
                .collect(Collectors.toList());
    }

    // Get comment by ID
    public CommentResponse getCommentById(Long id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found: " + id));
        
        return new CommentResponse(comment);
    }

    // Update comment
    public CommentResponse updateComment(Long id, String content, String username) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found: " + id));

        // Check if user is the author or has permission to edit
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
        
        if (!comment.getAuthor().getId().equals(user.getId()) && 
            !canModerateComments(user.getRole())) {
            throw new RuntimeException("You don't have permission to edit this comment");
        }

        comment.setContent(content);
        comment.setUpdatedAt(LocalDateTime.now());
        
        Comment savedComment = commentRepository.save(comment);
        return new CommentResponse(savedComment);
    }

    // Delete comment
    public void deleteComment(Long id, String username) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found: " + id));

        // Check if user is the author or has permission to delete
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
        
        if (!comment.getAuthor().getId().equals(user.getId()) && 
            !canModerateComments(user.getRole())) {
            throw new RuntimeException("You don't have permission to delete this comment");
        }

        // If this comment has replies, we might want to keep it but mark as deleted
        // For now, we'll do a hard delete
        commentRepository.delete(comment);
    }

    // Get comments by user
    public Page<CommentResponse> getCommentsByUser(String username, int page, int size, String sortBy, String sortDir) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Comment> comments = commentRepository.findByAuthor(user, pageable);
        return comments.map(CommentResponse::new);
    }

    // Get recent comments
    public List<CommentResponse> getRecentComments(int limit) {
        Pageable pageable = PageRequest.of(0, limit, Sort.by("createdAt").descending());
        Page<Comment> comments = commentRepository.findAll(pageable);
        
        return comments.getContent().stream()
                .map(CommentResponse::new)
                .collect(Collectors.toList());
    }

    // Get comment count for a post
    public long getCommentCountForPost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found: " + postId));
        
        return commentRepository.countByPost(post);
    }

    // Get user's comment statistics
    public CommentStatsResponse getUserCommentStats(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        long totalComments = commentRepository.countByAuthor(user);
        
        return new CommentStatsResponse(totalComments);
    }

    // Helper method for role-based permissions
    private boolean canModerateComments(String role) {
        return "ADMIN".equals(role) || "EDITOR".equals(role);
    }

    // Inner class for comment statistics
    public static class CommentStatsResponse {
        private long totalComments;

        public CommentStatsResponse(long totalComments) {
            this.totalComments = totalComments;
        }

        // Getter
        public long getTotalComments() { return totalComments; }
    }
}
