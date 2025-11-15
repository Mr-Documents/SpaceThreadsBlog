package com.multiuserbloggingplatform.backend.service;

import com.multiuserbloggingplatform.backend.dto.CreatePostRequest;
import com.multiuserbloggingplatform.backend.dto.UpdatePostRequest;
import com.multiuserbloggingplatform.backend.dto.PostResponse;
import com.multiuserbloggingplatform.backend.entity.Post;
import com.multiuserbloggingplatform.backend.entity.User;
import com.multiuserbloggingplatform.backend.entity.Category;
import com.multiuserbloggingplatform.backend.entity.Tag;
import com.multiuserbloggingplatform.backend.repository.PostRepository;
import com.multiuserbloggingplatform.backend.repository.UserRepository;
import com.multiuserbloggingplatform.backend.repository.CategoryRepository;
import com.multiuserbloggingplatform.backend.repository.TagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private TagRepository tagRepository;

    // Create a new post
    public PostResponse createPost(CreatePostRequest request, String username) {
        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        Post post = new Post();
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setExcerpt(request.getExcerpt());
        post.setCoverImage(request.getCoverImage());
        post.setPublished(request.getPublished());
        post.setAuthor(author);

        // Generate slug and excerpt if not provided
        post.generateSlug();
        if (post.getExcerpt() == null || post.getExcerpt().trim().isEmpty()) {
            post.generateExcerpt();
        }

        // Set category if provided
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found: " + request.getCategoryId()));
            post.setCategory(category);
        }

        // Handle tags
        if (request.getTags() != null && !request.getTags().isEmpty()) {
            List<Tag> tags = request.getTags().stream()
                    .map(tagName -> {
                        Optional<Tag> existingTag = tagRepository.findByName(tagName);
                        if (existingTag.isPresent()) {
                            return existingTag.get();
                        } else {
                            Tag newTag = new Tag();
                            newTag.setName(tagName);
                            return tagRepository.save(newTag);
                        }
                    })
                    .collect(Collectors.toList());
            post.setTags(tags);
        }

        Post savedPost = postRepository.save(post);
        return new PostResponse(savedPost);
    }

    // Get all published posts with pagination
    public Page<PostResponse> getPublishedPosts(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Post> posts = postRepository.findByPublishedTrue(pageable);
        return posts.map(PostResponse::new);
    }

    // Get all posts (for admin/editor)
    public Page<PostResponse> getAllPosts(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Post> posts = postRepository.findAll(pageable);
        return posts.map(PostResponse::new);
    }

    // Get posts by author
    public Page<PostResponse> getPostsByAuthor(String username, int page, int size, String sortBy, String sortDir) {
        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Post> posts = postRepository.findByAuthor(author, pageable);
        return posts.map(PostResponse::new);
    }

    // Get post by ID
    public PostResponse getPostById(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found: " + id));
        
        // Increment view count
        post.incrementViewCount();
        postRepository.save(post);
        
        return new PostResponse(post);
    }

    // Get post by slug
    public PostResponse getPostBySlug(String slug) {
        Post post = postRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Post not found: " + slug));
        
        // Increment view count
        post.incrementViewCount();
        postRepository.save(post);
        
        return new PostResponse(post);
    }

    // Update post
    public PostResponse updatePost(Long id, UpdatePostRequest request, String username) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found: " + id));

        // Check if user is the author or has permission to edit
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
        
        if (!post.getAuthor().getId().equals(user.getId()) && 
            !canEditOthersPosts(user.getRole())) {
            throw new RuntimeException("You don't have permission to edit this post");
        }

        // Update fields if provided
        if (request.getTitle() != null) {
            post.setTitle(request.getTitle());
            post.generateSlug(); // Regenerate slug if title changes
        }
        if (request.getContent() != null) {
            post.setContent(request.getContent());
        }
        if (request.getExcerpt() != null) {
            post.setExcerpt(request.getExcerpt());
        } else if (request.getContent() != null) {
            post.generateExcerpt(); // Regenerate excerpt if content changes
        }
        if (request.getCoverImage() != null) {
            post.setCoverImage(request.getCoverImage());
        }
        if (request.getPublished() != null) {
            post.setPublished(request.getPublished());
        }

        // Update category if provided
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found: " + request.getCategoryId()));
            post.setCategory(category);
        }

        // Update tags if provided
        if (request.getTags() != null) {
            List<Tag> tags = request.getTags().stream()
                    .map(tagName -> {
                        Optional<Tag> existingTag = tagRepository.findByName(tagName);
                        if (existingTag.isPresent()) {
                            return existingTag.get();
                        } else {
                            Tag newTag = new Tag();
                            newTag.setName(tagName);
                            return tagRepository.save(newTag);
                        }
                    })
                    .collect(Collectors.toList());
            post.setTags(tags);
        }

        post.setUpdatedAt(LocalDateTime.now());
        Post savedPost = postRepository.save(post);
        return new PostResponse(savedPost);
    }

    // Delete post
    public void deletePost(Long id, String username) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found: " + id));

        // Check if user is the author or has permission to delete
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
        
        if (!post.getAuthor().getId().equals(user.getId()) && 
            !canEditOthersPosts(user.getRole())) {
            throw new RuntimeException("You don't have permission to delete this post");
        }

        postRepository.delete(post);
    }

    // Like/Unlike post
    public PostResponse toggleLike(Long id, String username) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found: " + id));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        // For now, just increment/decrement like count
        // In a real implementation, you'd track which users liked which posts
        post.incrementLikeCount();
        
        Post savedPost = postRepository.save(post);
        return new PostResponse(savedPost);
    }

    // Search posts
    public Page<PostResponse> searchPosts(String searchTerm, int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Post> posts = postRepository.searchByTitleOrContent(searchTerm, pageable);
        return posts.map(PostResponse::new);
    }

    // Get popular posts (by view count)
    public List<PostResponse> getPopularPosts(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        Page<Post> posts = postRepository.findByPublishedTrueOrderByViewCountDesc(pageable);
        return posts.getContent().stream()
                .map(PostResponse::new)
                .collect(Collectors.toList());
    }

    // Get recent posts
    public List<PostResponse> getRecentPosts(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        Page<Post> posts = postRepository.findByPublishedTrueOrderByCreatedAtDesc(pageable);
        return posts.getContent().stream()
                .map(PostResponse::new)
                .collect(Collectors.toList());
    }

    // Get user's post statistics
    public PostStatsResponse getUserPostStats(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        long totalPosts = postRepository.countByAuthor(user);
        long publishedPosts = postRepository.countByAuthorAndPublished(user, true);
        long draftPosts = totalPosts - publishedPosts;

        return new PostStatsResponse(totalPosts, publishedPosts, draftPosts);
    }

    // Helper method for role-based permissions
    private boolean canEditOthersPosts(String role) {
        return "ADMIN".equals(role) || "EDITOR".equals(role);
    }

    // Get posts by category
    public Page<PostResponse> getPostsByCategory(Category category, Pageable pageable) {
        Page<Post> posts = postRepository.findByCategoryAndPublished(category, true, pageable);
        return posts.map(PostResponse::new);
    }

    // Get posts by tag
    public Page<PostResponse> getPostsByTag(Tag tag, Pageable pageable) {
        // This would require a custom query in the repository
        // For now, we'll implement a simple approach
        List<Post> allPosts = postRepository.findByPublishedTrue();
        List<Post> tagPosts = allPosts.stream()
                .filter(post -> post.getTags().contains(tag))
                .collect(Collectors.toList());
        
        // Convert to Page (simplified implementation)
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), tagPosts.size());
        List<Post> pageContent = tagPosts.subList(start, end);
        
        return new org.springframework.data.domain.PageImpl<>(
                pageContent.stream().map(PostResponse::new).collect(Collectors.toList()),
                pageable,
                tagPosts.size()
        );
    }

    // Inner class for post statistics
    public static class PostStatsResponse {
        private long totalPosts;
        private long publishedPosts;
        private long draftPosts;

        public PostStatsResponse(long totalPosts, long publishedPosts, long draftPosts) {
            this.totalPosts = totalPosts;
            this.publishedPosts = publishedPosts;
            this.draftPosts = draftPosts;
        }

        // Getters
        public long getTotalPosts() { return totalPosts; }
        public long getPublishedPosts() { return publishedPosts; }
        public long getDraftPosts() { return draftPosts; }
    }
}
