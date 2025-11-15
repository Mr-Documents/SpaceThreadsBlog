package com.multiuserbloggingplatform.backend.dto;

import com.multiuserbloggingplatform.backend.entity.Tag;
import java.time.LocalDateTime;

public class TagResponse {
    
    private Long id;
    private String name;
    private String slug;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long postCount;

    // Constructors
    public TagResponse() {}

    public TagResponse(Tag tag) {
        this.id = tag.getId();
        this.name = tag.getName();
        this.slug = tag.getSlug();
        this.createdAt = tag.getCreatedAt();
        this.updatedAt = tag.getUpdatedAt();
        
        // Post count
        if (tag.getPosts() != null) {
            this.postCount = (long) tag.getPosts().size();
        } else {
            this.postCount = 0L;
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Long getPostCount() { return postCount; }
    public void setPostCount(Long postCount) { this.postCount = postCount; }
}
