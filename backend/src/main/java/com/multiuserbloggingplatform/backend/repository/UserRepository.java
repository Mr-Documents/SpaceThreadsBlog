package com.multiuserbloggingplatform.backend.repository;

import com.multiuserbloggingplatform.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Optional<User> findByVerificationToken(String verificationToken);
    Optional<User> findByResetPasswordToken(String resetPasswordToken);
    
    // Find users by email verification status
    List<User> findByEmailVerified(Boolean emailVerified);
    
    // Count verified users
    long countByEmailVerified(Boolean emailVerified);
}
