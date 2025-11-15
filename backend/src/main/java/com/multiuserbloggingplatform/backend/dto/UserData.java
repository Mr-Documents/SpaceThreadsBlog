package com.multiuserbloggingplatform.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.LocalDateTime;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserData {
    private Long id;
    private String username;
    private String email;
    private String role;
    private Boolean emailVerified;
    private LocalDateTime createdAt;

    // Constructors
    public UserData() {}

    public UserData(String username, String role) {
        this.username = username;
        this.role = role;
    }

    public UserData(Long id, String username, String email, String role, Boolean emailVerified, LocalDateTime createdAt) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
        this.emailVerified = emailVerified;
        this.createdAt = createdAt;
    }

    // Static factory method
    public static UserData fromUser(com.multiuserbloggingplatform.backend.entity.User user) {
        return new UserData(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getRole(),
            user.getEmailVerified(),
            user.getCreatedAt()
        );
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Boolean getEmailVerified() { return emailVerified; }
    public void setEmailVerified(Boolean emailVerified) { this.emailVerified = emailVerified; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
