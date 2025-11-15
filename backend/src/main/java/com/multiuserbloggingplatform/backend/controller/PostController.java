package com.multiuserbloggingplatform.backend.controller;

import com.multiuserbloggingplatform.backend.dto.ApiResponse;
import com.multiuserbloggingplatform.backend.dto.CreatePostRequest;
import com.multiuserbloggingplatform.backend.dto.UpdatePostRequest;
import com.multiuserbloggingplatform.backend.dto.PostResponse;
import com.multiuserbloggingplatform.backend.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import java.util.List;

@RestController
@RequestMapping("/api/v1/posts")
@Validated
@CrossOrigin(origins = "http://localhost:5177")
public class PostController {

    @Autowired
    private PostService postService;

    // Create a new post
    @PostMapping
    public ResponseEntity<ApiResponse<PostResponse>> createPost(
            @Valid @RequestBody CreatePostRequest request,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            PostResponse post = postService.createPost(request, username);
            return ResponseEntity.ok(ApiResponse.success(
                "Post created successfully", 
                post
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to create post", e.getMessage()));
        }
    }

    // Get all published posts with pagination
    @GetMapping
    public ResponseEntity<ApiResponse<Page<PostResponse>>> getPublishedPosts(
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        try {
            Page<PostResponse> posts = postService.getPublishedPosts(page, size, sortBy, sortDir);
            return ResponseEntity.ok(ApiResponse.success(
                "Posts retrieved successfully", 
                posts
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve posts", e.getMessage()));
        }
    }

    // Get all posts (admin/editor only)
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<Page<PostResponse>>> getAllPosts(
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            Authentication authentication) {
        try {
            Page<PostResponse> posts = postService.getAllPosts(page, size, sortBy, sortDir);
            return ResponseEntity.ok(ApiResponse.success(
                "All posts retrieved successfully", 
                posts
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve posts", e.getMessage()));
        }
    }

    // Get posts by author
    @GetMapping("/author/{username}")
    public ResponseEntity<ApiResponse<Page<PostResponse>>> getPostsByAuthor(
            @PathVariable String username,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        try {
            Page<PostResponse> posts = postService.getPostsByAuthor(username, page, size, sortBy, sortDir);
            return ResponseEntity.ok(ApiResponse.success(
                "Author posts retrieved successfully", 
                posts
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve author posts", e.getMessage()));
        }
    }

    // Get current user's posts
    @GetMapping("/my-posts")
    public ResponseEntity<ApiResponse<Page<PostResponse>>> getMyPosts(
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            Page<PostResponse> posts = postService.getPostsByAuthor(username, page, size, sortBy, sortDir);
            return ResponseEntity.ok(ApiResponse.success(
                "Your posts retrieved successfully", 
                posts
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve your posts", e.getMessage()));
        }
    }

    // Get post by ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PostResponse>> getPostById(@PathVariable Long id) {
        try {
            PostResponse post = postService.getPostById(id);
            return ResponseEntity.ok(ApiResponse.success(
                "Post retrieved successfully", 
                post
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve post", e.getMessage()));
        }
    }

    // Get post by slug
    @GetMapping("/slug/{slug}")
    public ResponseEntity<ApiResponse<PostResponse>> getPostBySlug(@PathVariable String slug) {
        try {
            PostResponse post = postService.getPostBySlug(slug);
            return ResponseEntity.ok(ApiResponse.success(
                "Post retrieved successfully", 
                post
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve post", e.getMessage()));
        }
    }

    // Update post
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PostResponse>> updatePost(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePostRequest request,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            PostResponse post = postService.updatePost(id, request, username);
            return ResponseEntity.ok(ApiResponse.success(
                "Post updated successfully", 
                post
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to update post", e.getMessage()));
        }
    }

    // Delete post
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deletePost(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            postService.deletePost(id, username);
            return ResponseEntity.ok(ApiResponse.success(
                "Post deleted successfully", 
                "Post with ID " + id + " has been deleted"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to delete post", e.getMessage()));
        }
    }

    // Like/Unlike post
    @PostMapping("/{id}/like")
    public ResponseEntity<ApiResponse<PostResponse>> toggleLike(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            PostResponse post = postService.toggleLike(id, username);
            return ResponseEntity.ok(ApiResponse.success(
                "Post like toggled successfully", 
                post
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to toggle like", e.getMessage()));
        }
    }

    // Search posts
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<PostResponse>>> searchPosts(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        try {
            Page<PostResponse> posts = postService.searchPosts(q, page, size, sortBy, sortDir);
            return ResponseEntity.ok(ApiResponse.success(
                "Search results retrieved successfully", 
                posts
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to search posts", e.getMessage()));
        }
    }

    // Get popular posts
    @GetMapping("/popular")
    public ResponseEntity<ApiResponse<List<PostResponse>>> getPopularPosts(
            @RequestParam(defaultValue = "10") @Min(1) @Max(50) int limit) {
        try {
            List<PostResponse> posts = postService.getPopularPosts(limit);
            return ResponseEntity.ok(ApiResponse.success(
                "Popular posts retrieved successfully", 
                posts
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve popular posts", e.getMessage()));
        }
    }

    // Get recent posts
    @GetMapping("/recent")
    public ResponseEntity<ApiResponse<List<PostResponse>>> getRecentPosts(
            @RequestParam(defaultValue = "10") @Min(1) @Max(50) int limit) {
        try {
            List<PostResponse> posts = postService.getRecentPosts(limit);
            return ResponseEntity.ok(ApiResponse.success(
                "Recent posts retrieved successfully", 
                posts
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve recent posts", e.getMessage()));
        }
    }

    // Get user's post statistics
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<PostService.PostStatsResponse>> getUserPostStats(
            Authentication authentication) {
        try {
            String username = authentication.getName();
            PostService.PostStatsResponse stats = postService.getUserPostStats(username);
            return ResponseEntity.ok(ApiResponse.success(
                "Post statistics retrieved successfully", 
                stats
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve post statistics", e.getMessage()));
        }
    }
}
