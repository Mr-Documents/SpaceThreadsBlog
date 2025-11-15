package com.multiuserbloggingplatform.backend.repository;

import com.multiuserbloggingplatform.backend.entity.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TagRepository extends JpaRepository<Tag, Long> {
    
    // Find tag by name (case-sensitive)
    Optional<Tag> findByName(String name);
    
    // Find tag by name (case-insensitive)
    @Query("SELECT t FROM Tag t WHERE LOWER(t.name) = LOWER(:name)")
    Optional<Tag> findByNameIgnoreCase(@Param("name") String name);
    
    // Find tags by name containing (case-insensitive search)
    @Query("SELECT t FROM Tag t WHERE LOWER(t.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Tag> findByNameContainingIgnoreCase(@Param("name") String name);
    
    // Find all tags ordered by name
    List<Tag> findAllByOrderByNameAsc();
    
    // Find all tags ordered by creation date
    List<Tag> findAllByOrderByCreatedAtDesc();
    
    // Check if tag exists by name (case-insensitive)
    @Query("SELECT COUNT(t) > 0 FROM Tag t WHERE LOWER(t.name) = LOWER(:name)")
    boolean existsByNameIgnoreCase(@Param("name") String name);
    
    // Find tags that have posts
    @Query("SELECT DISTINCT t FROM Tag t WHERE SIZE(t.posts) > 0")
    List<Tag> findTagsWithPosts();
    
    // Find tags that have no posts
    @Query("SELECT t FROM Tag t WHERE SIZE(t.posts) = 0")
    List<Tag> findTagsWithoutPosts();
    
    // Count posts for each tag
    @Query("SELECT t, SIZE(t.posts) FROM Tag t")
    List<Object[]> findTagsWithPostCount();
    
    // Find most popular tags (by post count)
    @Query("SELECT t FROM Tag t ORDER BY SIZE(t.posts) DESC")
    List<Tag> findMostPopularTags();
    
    // Find tags by post count greater than specified value
    @Query("SELECT t FROM Tag t WHERE SIZE(t.posts) > :count")
    List<Tag> findTagsWithPostCountGreaterThan(@Param("count") int count);
    
    // Find tags used in a specific post
    @Query("SELECT t FROM Tag t JOIN t.posts p WHERE p.id = :postId")
    List<Tag> findTagsByPostId(@Param("postId") Long postId);
    
    // Find tag by slug
    Optional<Tag> findBySlug(String slug);
    
    // Find tags by name containing with pagination
    @Query("SELECT t FROM Tag t WHERE LOWER(t.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    Page<Tag> findByNameContainingIgnoreCase(@Param("name") String name, Pageable pageable);
    
    // Find all tags ordered by post count (descending) with pagination
    @Query("SELECT t FROM Tag t ORDER BY SIZE(t.posts) DESC")
    Page<Tag> findAllByOrderByPostCountDesc(Pageable pageable);
}
