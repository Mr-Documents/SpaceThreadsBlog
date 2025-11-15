package com.multiuserbloggingplatform.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * DTO for admin role management
 * Only admins can change user roles (industry standard)
 */
public class ChangeUserRoleRequest {
    @NotBlank(message = "User email is required")
    @Email(message = "Valid email required")
    private String userEmail;

    @NotBlank(message = "New role is required")
    private String newRole; // READER, CONTRIBUTOR, AUTHOR, EDITOR, ADMIN

    @NotBlank(message = "Reason is required")
    private String reason; // Why the role is being changed

    // Getters and setters
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getNewRole() { return newRole; }
    public void setNewRole(String newRole) { this.newRole = newRole; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
