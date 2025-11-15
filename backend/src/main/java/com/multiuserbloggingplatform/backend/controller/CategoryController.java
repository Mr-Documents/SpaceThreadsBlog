package com.multiuserbloggingplatform.backend.controller;

import com.multiuserbloggingplatform.backend.dto.ApiResponse;
import com.multiuserbloggingplatform.backend.dto.CreateCategoryRequest;
import com.multiuserbloggingplatform.backend.dto.CategoryResponse;
import com.multiuserbloggingplatform.backend.dto.PostResponse;
import com.multiuserbloggingplatform.backend.entity.Category;
import com.multiuserbloggingplatform.backend.repository.CategoryRepository;
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

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/categories")
@Validated
@CrossOrigin(origins = "http://localhost:5177")
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private PostService postService;

    // Get all categories
    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAllCategories() {
        try {
            List<Category> categories = categoryRepository.findAll(Sort.by("name").ascending());
            List<CategoryResponse> categoryResponses = categories.stream()
                    .map(CategoryResponse::new)
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(ApiResponse.success(
                "Categories retrieved successfully", 
                categoryResponses
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve categories", e.getMessage()));
        }
    }

    // Get category by ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> getCategoryById(@PathVariable Long id) {
        try {
            Category category = categoryRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Category not found: " + id));
            
            return ResponseEntity.ok(ApiResponse.success(
                "Category retrieved successfully", 
                new CategoryResponse(category)
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve category", e.getMessage()));
        }
    }

    // Get category by slug
    @GetMapping("/slug/{slug}")
    public ResponseEntity<ApiResponse<CategoryResponse>> getCategoryBySlug(@PathVariable String slug) {
        try {
            Category category = categoryRepository.findBySlug(slug)
                    .orElseThrow(() -> new RuntimeException("Category not found: " + slug));
            
            return ResponseEntity.ok(ApiResponse.success(
                "Category retrieved successfully", 
                new CategoryResponse(category)
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve category", e.getMessage()));
        }
    }

    // Get posts by category
    @GetMapping("/{id}/posts")
    public ResponseEntity<ApiResponse<Page<PostResponse>>> getPostsByCategory(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        try {
            Category category = categoryRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Category not found: " + id));

            Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                    Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
            Pageable pageable = PageRequest.of(page, size, sort);
            
            Page<PostResponse> posts = postService.getPostsByCategory(category, pageable);
            return ResponseEntity.ok(ApiResponse.success(
                "Category posts retrieved successfully", 
                posts
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve category posts", e.getMessage()));
        }
    }

    // Create category (Admin/Editor only)
    @PostMapping
    public ResponseEntity<ApiResponse<CategoryResponse>> createCategory(
            @Valid @RequestBody CreateCategoryRequest request,
            Authentication authentication) {
        try {
            // Check if category name already exists
            if (categoryRepository.findByName(request.getName()).isPresent()) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Category creation failed", "Category with this name already exists"));
            }

            Category category = new Category();
            category.setName(request.getName());
            category.setDescription(request.getDescription());
            
            // Generate slug from name
            String slug = request.getName().toLowerCase()
                    .replaceAll("[^a-z0-9\\s-]", "")
                    .replaceAll("\\s+", "-")
                    .replaceAll("-+", "-")
                    .replaceAll("^-|-$", "");
            category.setSlug(slug);
            
            category.setCreatedAt(LocalDateTime.now());
            category.setUpdatedAt(LocalDateTime.now());

            Category savedCategory = categoryRepository.save(category);
            return ResponseEntity.ok(ApiResponse.success(
                "Category created successfully", 
                new CategoryResponse(savedCategory)
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to create category", e.getMessage()));
        }
    }

    // Update category (Admin/Editor only)
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CreateCategoryRequest request,
            Authentication authentication) {
        try {
            Category category = categoryRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Category not found: " + id));

            // Check if new name conflicts with existing category (excluding current)
            categoryRepository.findByName(request.getName())
                    .ifPresent(existingCategory -> {
                        if (!existingCategory.getId().equals(id)) {
                            throw new RuntimeException("Category with this name already exists");
                        }
                    });

            category.setName(request.getName());
            category.setDescription(request.getDescription());
            
            // Regenerate slug if name changed
            String slug = request.getName().toLowerCase()
                    .replaceAll("[^a-z0-9\\s-]", "")
                    .replaceAll("\\s+", "-")
                    .replaceAll("-+", "-")
                    .replaceAll("^-|-$", "");
            category.setSlug(slug);
            
            category.setUpdatedAt(LocalDateTime.now());

            Category savedCategory = categoryRepository.save(category);
            return ResponseEntity.ok(ApiResponse.success(
                "Category updated successfully", 
                new CategoryResponse(savedCategory)
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to update category", e.getMessage()));
        }
    }

    // Delete category (Admin only)
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteCategory(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            Category category = categoryRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Category not found: " + id));

            // Check if category has posts
            if (category.getPosts() != null && !category.getPosts().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Cannot delete category", "Category has associated posts. Please move or delete posts first."));
            }

            categoryRepository.delete(category);
            return ResponseEntity.ok(ApiResponse.success(
                "Category deleted successfully", 
                "Category with ID " + id + " has been deleted"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to delete category", e.getMessage()));
        }
    }
}
