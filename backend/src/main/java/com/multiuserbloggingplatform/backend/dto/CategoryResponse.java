package com.multiuserbloggingplatform.backend.dto;

import com.multiuserbloggingplatform.backend.entity.Category;
import java.time.LocalDateTime;

public class CategoryResponse {
    
    private Long id;
    private String name;
    private String description;
    private String slug;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long postCount;

    // Constructors
    public CategoryResponse() {}

    public CategoryResponse(Category category) {
        this.id = category.getId();
        this.name = category.getName();
        this.description = category.getDescription();
        this.slug = category.getSlug();
        this.createdAt = category.getCreatedAt();
        this.updatedAt = category.getUpdatedAt();
        
        // Post count
        if (category.getPosts() != null) {
            this.postCount = (long) category.getPosts().size();
        } else {
            this.postCount = 0L;
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Long getPostCount() { return postCount; }
    public void setPostCount(Long postCount) { this.postCount = postCount; }
}
