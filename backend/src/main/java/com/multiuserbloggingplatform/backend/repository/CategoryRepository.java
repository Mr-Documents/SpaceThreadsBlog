package com.multiuserbloggingplatform.backend.repository;

import com.multiuserbloggingplatform.backend.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    // Find category by name (exact match, case-sensitive)
    Optional<Category> findByName(String name);
    
    // Find category by name (case-insensitive)
    @Query("SELECT c FROM Category c WHERE LOWER(c.name) = LOWER(:name)")
    Optional<Category> findByNameIgnoreCase(@Param("name") String name);
    
    // Find categories by name containing (case-insensitive search)
    @Query("SELECT c FROM Category c WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Category> findByNameContainingIgnoreCase(@Param("name") String name);
    
    // Find category by slug
    Optional<Category> findBySlug(String slug);
    
    // Find categories by description containing (case-insensitive search)
    @Query("SELECT c FROM Category c WHERE LOWER(c.description) LIKE LOWER(CONCAT('%', :description, '%'))")
    List<Category> findByDescriptionContainingIgnoreCase(@Param("description") String description);
    
    // Find all categories ordered by name
    List<Category> findAllByOrderByNameAsc();
    
    // Find all categories ordered by creation date
    List<Category> findAllByOrderByCreatedAtDesc();
    
    // Check if category exists by name (case-insensitive)
    @Query("SELECT COUNT(c) > 0 FROM Category c WHERE LOWER(c.name) = LOWER(:name)")
    boolean existsByNameIgnoreCase(@Param("name") String name);
    
    // Count posts in each category
    @Query("SELECT c, SIZE(c.posts) FROM Category c")
    List<Object[]> findCategoriesWithPostCount();
    
    // Find categories that have posts
    @Query("SELECT DISTINCT c FROM Category c WHERE SIZE(c.posts) > 0")
    List<Category> findCategoriesWithPosts();
    
    // Find categories that have no posts
    @Query("SELECT c FROM Category c WHERE SIZE(c.posts) = 0")
    List<Category> findCategoriesWithoutPosts();
}
