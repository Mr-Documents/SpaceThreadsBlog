package com.multiuserbloggingplatform.backend.dto;

import com.multiuserbloggingplatform.backend.entity.Comment;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class CommentResponse {
    
    private Long id;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Author information as nested object
    private AuthorInfo author;
    
    // Post information
    private Long postId;
    
    // Parent comment information (for nested comments)
    private Long parentId;
    
    // Nested replies
    private List<CommentResponse> replies;
    
    // Nested class for author info
    public static class AuthorInfo {
        private Long id;
        private String username;
        private String name;
        
        public AuthorInfo() {}
        
        public AuthorInfo(Long id, String username, String name) {
            this.id = id;
            this.username = username;
            this.name = name;
        }
        
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }

    // Constructors
    public CommentResponse() {}

    public CommentResponse(Comment comment) {
        this.id = comment.getId();
        this.content = comment.getContent();
        this.createdAt = comment.getCreatedAt();
        this.updatedAt = comment.getUpdatedAt();
        
        // Author information as nested object
        if (comment.getAuthor() != null) {
            this.author = new AuthorInfo(
                comment.getAuthor().getId(),
                comment.getAuthor().getUsername(),
                comment.getAuthor().getUsername() // Using username as name
            );
        }
        
        // Post information
        if (comment.getPost() != null) {
            this.postId = comment.getPost().getId();
        }
        
        // Parent comment information
        if (comment.getParentComment() != null) {
            this.parentId = comment.getParentComment().getId();
        }
        
        // Nested replies
        if (comment.getReplies() != null && !comment.getReplies().isEmpty()) {
            this.replies = comment.getReplies().stream()
                    .map(CommentResponse::new)
                    .collect(Collectors.toList());
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public AuthorInfo getAuthor() { return author; }
    public void setAuthor(AuthorInfo author) { this.author = author; }

    public Long getPostId() { return postId; }
    public void setPostId(Long postId) { this.postId = postId; }

    public Long getParentId() { return parentId; }
    public void setParentId(Long parentId) { this.parentId = parentId; }

    public List<CommentResponse> getReplies() { return replies; }
    public void setReplies(List<CommentResponse> replies) { this.replies = replies; }
}
