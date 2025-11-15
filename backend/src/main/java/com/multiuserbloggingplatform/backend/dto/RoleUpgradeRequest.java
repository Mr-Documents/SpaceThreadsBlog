package com.multiuserbloggingplatform.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO for users requesting role upgrades
 * Users can apply to become AUTHORS or higher roles
 */
public class RoleUpgradeRequest {
    @NotBlank(message = "Requested role is required")
    private String requestedRole; // AUTHOR, CONTRIBUTOR

    @NotBlank(message = "Reason is required")
    @Size(min = 50, max = 500, message = "Please provide a detailed reason (50-500 characters)")
    private String reason;

    @Size(max = 200, message = "Portfolio URL too long")
    private String portfolioUrl; // Optional

    @Size(max = 1000, message = "Experience description too long")
    private String experience; // Optional

    // Getters and setters
    public String getRequestedRole() { return requestedRole; }
    public void setRequestedRole(String requestedRole) { this.requestedRole = requestedRole; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getPortfolioUrl() { return portfolioUrl; }
    public void setPortfolioUrl(String portfolioUrl) { this.portfolioUrl = portfolioUrl; }

    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }
}
