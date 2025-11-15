package com.multiuserbloggingplatform.backend.controller;

import com.multiuserbloggingplatform.backend.dto.ApiResponse;
import com.multiuserbloggingplatform.backend.dto.CreateCommentRequest;
import com.multiuserbloggingplatform.backend.dto.CommentResponse;
import com.multiuserbloggingplatform.backend.service.CommentService;
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
@RequestMapping("/api/v1/comments")
@Validated
@CrossOrigin(origins = "http://localhost:5177")
public class CommentController {

    @Autowired
    private CommentService commentService;

    // Create a new comment on a post
    @PostMapping("/post/{postId}")
    public ResponseEntity<ApiResponse<CommentResponse>> createComment(
            @PathVariable Long postId,
            @Valid @RequestBody CreateCommentRequest request,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            CommentResponse comment = commentService.createComment(postId, request, username);
            return ResponseEntity.ok(ApiResponse.success(
                "Comment created successfully", 
                comment
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to create comment", e.getMessage()));
        }
    }

    // Get comments for a post with pagination
    @GetMapping("/post/{postId}")
    public ResponseEntity<ApiResponse<Page<CommentResponse>>> getCommentsForPost(
            @PathVariable Long postId,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        try {
            Page<CommentResponse> comments = commentService.getCommentsForPost(postId, page, size, sortBy, sortDir);
            return ResponseEntity.ok(ApiResponse.success(
                "Comments retrieved successfully", 
                comments
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve comments", e.getMessage()));
        }
    }

    // Get all comments for a post (including nested replies)
    @GetMapping("/post/{postId}/all")
    public ResponseEntity<ApiResponse<List<CommentResponse>>> getAllCommentsForPost(
            @PathVariable Long postId) {
        try {
            List<CommentResponse> comments = commentService.getAllCommentsForPost(postId);
            return ResponseEntity.ok(ApiResponse.success(
                "All comments retrieved successfully", 
                comments
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve comments", e.getMessage()));
        }
    }

    // Get comment by ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CommentResponse>> getCommentById(@PathVariable Long id) {
        try {
            CommentResponse comment = commentService.getCommentById(id);
            return ResponseEntity.ok(ApiResponse.success(
                "Comment retrieved successfully", 
                comment
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve comment", e.getMessage()));
        }
    }

    // Update comment
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CommentResponse>> updateComment(
            @PathVariable Long id,
            @RequestParam String content,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            CommentResponse comment = commentService.updateComment(id, content, username);
            return ResponseEntity.ok(ApiResponse.success(
                "Comment updated successfully", 
                comment
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to update comment", e.getMessage()));
        }
    }

    // Delete comment
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteComment(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            commentService.deleteComment(id, username);
            return ResponseEntity.ok(ApiResponse.success(
                "Comment deleted successfully", 
                "Comment with ID " + id + " has been deleted"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to delete comment", e.getMessage()));
        }
    }

    // Get comments by user
    @GetMapping("/user/{username}")
    public ResponseEntity<ApiResponse<Page<CommentResponse>>> getCommentsByUser(
            @PathVariable String username,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        try {
            Page<CommentResponse> comments = commentService.getCommentsByUser(username, page, size, sortBy, sortDir);
            return ResponseEntity.ok(ApiResponse.success(
                "User comments retrieved successfully", 
                comments
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve user comments", e.getMessage()));
        }
    }

    // Get current user's comments
    @GetMapping("/my-comments")
    public ResponseEntity<ApiResponse<Page<CommentResponse>>> getMyComments(
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            Page<CommentResponse> comments = commentService.getCommentsByUser(username, page, size, sortBy, sortDir);
            return ResponseEntity.ok(ApiResponse.success(
                "Your comments retrieved successfully", 
                comments
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve your comments", e.getMessage()));
        }
    }

    // Get recent comments
    @GetMapping("/recent")
    public ResponseEntity<ApiResponse<List<CommentResponse>>> getRecentComments(
            @RequestParam(defaultValue = "10") @Min(1) @Max(50) int limit) {
        try {
            List<CommentResponse> comments = commentService.getRecentComments(limit);
            return ResponseEntity.ok(ApiResponse.success(
                "Recent comments retrieved successfully", 
                comments
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve recent comments", e.getMessage()));
        }
    }

    // Get comment count for a post
    @GetMapping("/post/{postId}/count")
    public ResponseEntity<ApiResponse<Long>> getCommentCountForPost(@PathVariable Long postId) {
        try {
            long count = commentService.getCommentCountForPost(postId);
            return ResponseEntity.ok(ApiResponse.success(
                "Comment count retrieved successfully", 
                count
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve comment count", e.getMessage()));
        }
    }

    // Get user's comment statistics
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<CommentService.CommentStatsResponse>> getUserCommentStats(
            Authentication authentication) {
        try {
            String username = authentication.getName();
            CommentService.CommentStatsResponse stats = commentService.getUserCommentStats(username);
            return ResponseEntity.ok(ApiResponse.success(
                "Comment statistics retrieved successfully", 
                stats
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve comment statistics", e.getMessage()));
        }
    }
}
