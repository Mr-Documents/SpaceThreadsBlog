package com.multiuserbloggingplatform.backend.repository;

import com.multiuserbloggingplatform.backend.entity.Comment;
import com.multiuserbloggingplatform.backend.entity.Post;
import com.multiuserbloggingplatform.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    
    // Find comments by post
    List<Comment> findByPost(Post post);
    Page<Comment> findByPost(Post post, Pageable pageable);
    
    // Find comments by author
    List<Comment> findByAuthor(User author);
    Page<Comment> findByAuthor(User author, Pageable pageable);
    
    // Find comments by post ordered by creation date (oldest first)
    List<Comment> findByPostOrderByCreatedAtAsc(Post post);
    
    // Find comments by post ordered by creation date (newest first)
    List<Comment> findByPostOrderByCreatedAtDesc(Post post);
    
    // Find top-level comments (not replies) for a post
    List<Comment> findByPostAndParentCommentIsNull(Post post);
    Page<Comment> findByPostAndParentCommentIsNull(Post post, Pageable pageable);
    
    // Find top-level comments ordered by creation date
    List<Comment> findByPostAndParentCommentIsNullOrderByCreatedAtAsc(Post post);
    List<Comment> findByPostAndParentCommentIsNullOrderByCreatedAtDesc(Post post);
    
    // Find replies to a specific comment
    List<Comment> findByParentComment(Comment parentComment);
    List<Comment> findByParentCommentOrderByCreatedAtAsc(Comment parentComment);
    
    // Find comments by content containing (case-insensitive search)
    @Query("SELECT c FROM Comment c WHERE LOWER(c.content) LIKE LOWER(CONCAT('%', :content, '%'))")
    List<Comment> findByContentContainingIgnoreCase(@Param("content") String content);
    
    // Find comments by author and post
    List<Comment> findByAuthorAndPost(User author, Post post);
    
    // Count comments by post
    long countByPost(Post post);
    
    // Count comments by author
    long countByAuthor(User author);
    
    // Count top-level comments for a post
    long countByPostAndParentCommentIsNull(Post post);
    
    // Count replies to a specific comment
    long countByParentComment(Comment parentComment);
    
    // Find recent comments (ordered by creation date, newest first)
    List<Comment> findAllByOrderByCreatedAtDesc();
    Page<Comment> findAllByOrderByCreatedAtDesc(Pageable pageable);
    
    // Find comments by author ordered by creation date
    List<Comment> findByAuthorOrderByCreatedAtDesc(User author);
    Page<Comment> findByAuthorOrderByCreatedAtDesc(User author, Pageable pageable);
    
    // Search comments by content and post
    @Query("SELECT c FROM Comment c WHERE c.post = :post AND LOWER(c.content) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Comment> searchByContentAndPost(@Param("searchTerm") String searchTerm, @Param("post") Post post);
    
    // Find comments with replies (comments that have child comments)
    @Query("SELECT DISTINCT c FROM Comment c WHERE SIZE(c.replies) > 0")
    List<Comment> findCommentsWithReplies();
    
    // Find comments without replies (leaf comments)
    @Query("SELECT c FROM Comment c WHERE SIZE(c.replies) = 0")
    List<Comment> findCommentsWithoutReplies();
    
    // Get comment thread (parent comment and all its replies)
    @Query("SELECT c FROM Comment c WHERE c.parentComment = :parentComment OR c = :parentComment ORDER BY c.createdAt ASC")
    List<Comment> findCommentThread(@Param("parentComment") Comment parentComment);
}
