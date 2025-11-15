package com.multiuserbloggingplatform.backend.controller;

import com.multiuserbloggingplatform.backend.dto.ApiResponse;
import com.multiuserbloggingplatform.backend.dto.TagResponse;
import com.multiuserbloggingplatform.backend.dto.PostResponse;
import com.multiuserbloggingplatform.backend.entity.Tag;
import com.multiuserbloggingplatform.backend.repository.TagRepository;
import com.multiuserbloggingplatform.backend.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/tags")
@Validated
@CrossOrigin(origins = "http://localhost:5177")
public class TagController {

    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private PostService postService;

    // Get all tags
    @GetMapping
    public ResponseEntity<ApiResponse<List<TagResponse>>> getAllTags() {
        try {
            List<Tag> tags = tagRepository.findAll(Sort.by("name").ascending());
            List<TagResponse> tagResponses = tags.stream()
                    .map(TagResponse::new)
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(ApiResponse.success(
                "Tags retrieved successfully", 
                tagResponses
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve tags", e.getMessage()));
        }
    }

    // Get popular tags (by post count)
    @GetMapping("/popular")
    public ResponseEntity<ApiResponse<List<TagResponse>>> getPopularTags(
            @RequestParam(defaultValue = "20") @Min(1) @Max(100) int limit) {
        try {
            Pageable pageable = PageRequest.of(0, limit);
            Page<Tag> tags = tagRepository.findAllByOrderByPostCountDesc(pageable);
            List<TagResponse> tagResponses = tags.getContent().stream()
                    .map(TagResponse::new)
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(ApiResponse.success(
                "Popular tags retrieved successfully", 
                tagResponses
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve popular tags", e.getMessage()));
        }
    }

    // Get tag by ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TagResponse>> getTagById(@PathVariable Long id) {
        try {
            Tag tag = tagRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Tag not found: " + id));
            
            return ResponseEntity.ok(ApiResponse.success(
                "Tag retrieved successfully", 
                new TagResponse(tag)
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve tag", e.getMessage()));
        }
    }

    // Get tag by slug
    @GetMapping("/slug/{slug}")
    public ResponseEntity<ApiResponse<TagResponse>> getTagBySlug(@PathVariable String slug) {
        try {
            Tag tag = tagRepository.findBySlug(slug)
                    .orElseThrow(() -> new RuntimeException("Tag not found: " + slug));
            
            return ResponseEntity.ok(ApiResponse.success(
                "Tag retrieved successfully", 
                new TagResponse(tag)
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve tag", e.getMessage()));
        }
    }

    // Get posts by tag
    @GetMapping("/{id}/posts")
    public ResponseEntity<ApiResponse<Page<PostResponse>>> getPostsByTag(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        try {
            Tag tag = tagRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Tag not found: " + id));

            Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                    Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
            Pageable pageable = PageRequest.of(page, size, sort);
            
            Page<PostResponse> posts = postService.getPostsByTag(tag, pageable);
            return ResponseEntity.ok(ApiResponse.success(
                "Tag posts retrieved successfully", 
                posts
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve tag posts", e.getMessage()));
        }
    }

    // Search tags by name
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<TagResponse>>> searchTags(
            @RequestParam String q,
            @RequestParam(defaultValue = "20") @Min(1) @Max(100) int limit) {
        try {
            Pageable pageable = PageRequest.of(0, limit);
            Page<Tag> tags = tagRepository.findByNameContainingIgnoreCase(q, pageable);
            List<TagResponse> tagResponses = tags.getContent().stream()
                    .map(TagResponse::new)
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(ApiResponse.success(
                "Tag search results retrieved successfully", 
                tagResponses
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to search tags", e.getMessage()));
        }
    }

    // Create tag (Admin/Editor only)
    @PostMapping
    public ResponseEntity<ApiResponse<TagResponse>> createTag(
            @RequestParam String name,
            Authentication authentication) {
        try {
            // Check if tag name already exists
            if (tagRepository.findByName(name).isPresent()) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Tag creation failed", "Tag with this name already exists"));
            }

            Tag tag = new Tag();
            tag.setName(name);
            
            // Generate slug from name
            String slug = name.toLowerCase()
                    .replaceAll("[^a-z0-9\\s-]", "")
                    .replaceAll("\\s+", "-")
                    .replaceAll("-+", "-")
                    .replaceAll("^-|-$", "");
            tag.setSlug(slug);
            
            tag.setCreatedAt(LocalDateTime.now());
            tag.setUpdatedAt(LocalDateTime.now());

            Tag savedTag = tagRepository.save(tag);
            return ResponseEntity.ok(ApiResponse.success(
                "Tag created successfully", 
                new TagResponse(savedTag)
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to create tag", e.getMessage()));
        }
    }

    // Update tag (Admin/Editor only)
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TagResponse>> updateTag(
            @PathVariable Long id,
            @RequestParam String name,
            Authentication authentication) {
        try {
            Tag tag = tagRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Tag not found: " + id));

            // Check if new name conflicts with existing tag (excluding current)
            tagRepository.findByName(name)
                    .ifPresent(existingTag -> {
                        if (!existingTag.getId().equals(id)) {
                            throw new RuntimeException("Tag with this name already exists");
                        }
                    });

            tag.setName(name);
            
            // Regenerate slug if name changed
            String slug = name.toLowerCase()
                    .replaceAll("[^a-z0-9\\s-]", "")
                    .replaceAll("\\s+", "-")
                    .replaceAll("-+", "-")
                    .replaceAll("^-|-$", "");
            tag.setSlug(slug);
            
            tag.setUpdatedAt(LocalDateTime.now());

            Tag savedTag = tagRepository.save(tag);
            return ResponseEntity.ok(ApiResponse.success(
                "Tag updated successfully", 
                new TagResponse(savedTag)
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to update tag", e.getMessage()));
        }
    }

    // Delete tag (Admin only)
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteTag(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            Tag tag = tagRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Tag not found: " + id));

            // Check if tag has posts
            if (tag.getPosts() != null && !tag.getPosts().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Cannot delete tag", "Tag has associated posts. Please remove tag from posts first."));
            }

            tagRepository.delete(tag);
            return ResponseEntity.ok(ApiResponse.success(
                "Tag deleted successfully", 
                "Tag with ID " + id + " has been deleted"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to delete tag", e.getMessage()));
        }
    }
}
