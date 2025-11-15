package com.multiuserbloggingplatform.backend.repository;

import com.multiuserbloggingplatform.backend.entity.Post;
import com.multiuserbloggingplatform.backend.entity.User;
import com.multiuserbloggingplatform.backend.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {
    
    // Find posts by author
    List<Post> findByAuthor(User author);
    Page<Post> findByAuthor(User author, Pageable pageable);
    
    // Find posts by category
    List<Post> findByCategory(Category category);
    Page<Post> findByCategory(Category category, Pageable pageable);
    
    // Find published posts
    List<Post> findByPublishedTrue();
    Page<Post> findByPublishedTrue(Pageable pageable);
    
    // Find posts by published status
    List<Post> findByPublished(Boolean published);
    Page<Post> findByPublished(Boolean published, Pageable pageable);
    
    // Find posts by title containing (case-insensitive search)
    @Query("SELECT p FROM Post p WHERE LOWER(p.title) LIKE LOWER(CONCAT('%', :title, '%'))")
    List<Post> findByTitleContainingIgnoreCase(@Param("title") String title);
    
    // Find posts by content containing (case-insensitive search)
    @Query("SELECT p FROM Post p WHERE LOWER(p.content) LIKE LOWER(CONCAT('%', :content, '%'))")
    List<Post> findByContentContainingIgnoreCase(@Param("content") String content);
    
    // Find posts by author and published status
    List<Post> findByAuthorAndPublished(User author, Boolean published);
    Page<Post> findByAuthorAndPublished(User author, Boolean published, Pageable pageable);
    
    // Find posts by category and published status
    List<Post> findByCategoryAndPublished(Category category, Boolean published);
    Page<Post> findByCategoryAndPublished(Category category, Boolean published, Pageable pageable);
    
    // Find posts ordered by creation date (most recent first)
    List<Post> findAllByOrderByCreatedAtDesc();
    Page<Post> findAllByOrderByCreatedAtDesc(Pageable pageable);
    
    // Find published posts ordered by creation date
    List<Post> findByPublishedTrueOrderByCreatedAtDesc();
    Page<Post> findByPublishedTrueOrderByCreatedAtDesc(Pageable pageable);
    
    // Find posts ordered by view count (most viewed first)
    List<Post> findAllByOrderByViewCountDesc();
    Page<Post> findAllByOrderByViewCountDesc(Pageable pageable);
    
    // Find published posts ordered by view count
    List<Post> findByPublishedTrueOrderByViewCountDesc();
    Page<Post> findByPublishedTrueOrderByViewCountDesc(Pageable pageable);
    
    // Count posts by author
    long countByAuthor(User author);
    
    // Count published posts by author
    long countByAuthorAndPublished(User author, Boolean published);
    
    // Count posts by category
    long countByCategory(Category category);
    
    // Search posts by title or content
    @Query("SELECT p FROM Post p WHERE LOWER(p.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(p.content) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Post> searchByTitleOrContent(@Param("searchTerm") String searchTerm);
    
    @Query("SELECT p FROM Post p WHERE LOWER(p.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(p.content) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Post> searchByTitleOrContent(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    // Find post by slug
    Optional<Post> findBySlug(String slug);
    
    // Find posts ordered by like count (most liked first)
    List<Post> findAllByOrderByLikeCountDesc();
    Page<Post> findAllByOrderByLikeCountDesc(Pageable pageable);
    
    // Find published posts ordered by like count
    List<Post> findByPublishedTrueOrderByLikeCountDesc();
    Page<Post> findByPublishedTrueOrderByLikeCountDesc(Pageable pageable);
    
    // Find posts with eager loading of author and category
    @Query("SELECT p FROM Post p JOIN FETCH p.author LEFT JOIN FETCH p.category WHERE p.published = true ORDER BY p.createdAt DESC")
    List<Post> findPublishedPostsWithAuthorAndCategory();
    
    @Query("SELECT p FROM Post p JOIN FETCH p.author LEFT JOIN FETCH p.category WHERE p.published = true ORDER BY p.createdAt DESC")
    Page<Post> findPublishedPostsWithAuthorAndCategory(Pageable pageable);
}
