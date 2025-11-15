package com.multiuserbloggingplatform.backend.dto;

import com.multiuserbloggingplatform.backend.entity.Post;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class PostResponse {
    
    private Long id;
    private String title;
    private String content;
    private String excerpt;
    private String slug;
    private String coverImage;
    private Boolean published;
    private Long viewCount;
    private Long likeCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime publishedAt;
    
    // Author information as nested object
    private AuthorInfo author;
    
    // Category information as nested object
    private CategoryInfo category;
    
    // Tags as nested objects
    private List<TagInfo> tags;
    
    // Comment count
    private Integer commentCount;
    
    // Nested classes for structured data
    public static class AuthorInfo {
        private Long id;
        private String username;
        private String name;
        private String email;
        
        public AuthorInfo() {}
        
        public AuthorInfo(Long id, String username, String name, String email) {
            this.id = id;
            this.username = username;
            this.name = name;
            this.email = email;
        }
        
        // Getters and Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }
    
    public static class CategoryInfo {
        private Long id;
        private String name;
        private String slug;
        
        public CategoryInfo() {}
        
        public CategoryInfo(Long id, String name, String slug) {
            this.id = id;
            this.name = name;
            this.slug = slug;
        }
        
        // Getters and Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        
        public String getSlug() { return slug; }
        public void setSlug(String slug) { this.slug = slug; }
    }
    
    public static class TagInfo {
        private Long id;
        private String name;
        private String slug;
        
        public TagInfo() {}
        
        public TagInfo(Long id, String name, String slug) {
            this.id = id;
            this.name = name;
            this.slug = slug;
        }
        
        // Getters and Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        
        public String getSlug() { return slug; }
        public void setSlug(String slug) { this.slug = slug; }
    }

    // Constructors
    public PostResponse() {}

    public PostResponse(Post post) {
        this.id = post.getId();
        this.title = post.getTitle();
        this.content = post.getContent();
        this.excerpt = post.getExcerpt();
        this.slug = post.getSlug();
        this.coverImage = post.getCoverImage();
        this.published = post.getPublished();
        this.viewCount = post.getViewCount();
        this.likeCount = post.getLikeCount();
        this.createdAt = post.getCreatedAt();
        this.updatedAt = post.getUpdatedAt();
        this.publishedAt = post.getPublishedAt();
        
        // Author information as nested object
        if (post.getAuthor() != null) {
            this.author = new AuthorInfo(
                post.getAuthor().getId(),
                post.getAuthor().getUsername(),
                post.getAuthor().getUsername(), // Using username as name since User entity doesn't have name field
                post.getAuthor().getEmail()
            );
        }
        
        // Category information as nested object
        if (post.getCategory() != null) {
            this.category = new CategoryInfo(
                post.getCategory().getId(),
                post.getCategory().getName(),
                post.getCategory().getSlug()
            );
        }
        
        // Tags as nested objects
        if (post.getTags() != null) {
            this.tags = post.getTags().stream()
                    .map(tag -> new TagInfo(tag.getId(), tag.getName(), tag.getSlug()))
                    .collect(Collectors.toList());
        }
        
        // Comment count
        if (post.getComments() != null) {
            this.commentCount = post.getComments().size();
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getExcerpt() { return excerpt; }
    public void setExcerpt(String excerpt) { this.excerpt = excerpt; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getCoverImage() { return coverImage; }
    public void setCoverImage(String coverImage) { this.coverImage = coverImage; }

    public Boolean getPublished() { return published; }
    public void setPublished(Boolean published) { this.published = published; }

    public Long getViewCount() { return viewCount; }
    public void setViewCount(Long viewCount) { this.viewCount = viewCount; }

    public Long getLikeCount() { return likeCount; }
    public void setLikeCount(Long likeCount) { this.likeCount = likeCount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public LocalDateTime getPublishedAt() { return publishedAt; }
    public void setPublishedAt(LocalDateTime publishedAt) { this.publishedAt = publishedAt; }

    public AuthorInfo getAuthor() { return author; }
    public void setAuthor(AuthorInfo author) { this.author = author; }

    public CategoryInfo getCategory() { return category; }
    public void setCategory(CategoryInfo category) { this.category = category; }

    public List<TagInfo> getTags() { return tags; }
    public void setTags(List<TagInfo> tags) { this.tags = tags; }

    public Integer getCommentCount() { return commentCount; }
    public void setCommentCount(Integer commentCount) { this.commentCount = commentCount; }
}
