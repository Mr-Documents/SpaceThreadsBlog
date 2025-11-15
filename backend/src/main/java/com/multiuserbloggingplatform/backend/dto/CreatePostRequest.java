package com.multiuserbloggingplatform.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

public class CreatePostRequest {
    
    @NotBlank(message = "Post title is required")
    @Size(min = 5, max = 200, message = "Title must be between 5 and 200 characters")
    private String title;

    @NotBlank(message = "Post content is required")
    @Size(min = 10, message = "Content must be at least 10 characters")
    private String content;

    @Size(max = 300, message = "Excerpt cannot exceed 300 characters")
    private String excerpt;

    private String coverImage;

    private Boolean published = false;

    private Long categoryId;

    private List<String> tags;

    // Constructors
    public CreatePostRequest() {}

    public CreatePostRequest(String title, String content, String excerpt, Boolean published) {
        this.title = title;
        this.content = content;
        this.excerpt = excerpt;
        this.published = published;
    }

    // Getters and Setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getExcerpt() { return excerpt; }
    public void setExcerpt(String excerpt) { this.excerpt = excerpt; }

    public String getCoverImage() { return coverImage; }
    public void setCoverImage(String coverImage) { this.coverImage = coverImage; }

    public Boolean getPublished() { return published; }
    public void setPublished(Boolean published) { this.published = published; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
}
