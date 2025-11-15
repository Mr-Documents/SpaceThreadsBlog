package com.multiuserbloggingplatform.backend.entity;

/**
 * User Role Hierarchy - Following Industry Standards
 * Based on WordPress, Medium, Ghost, and Substack patterns
 */
public enum UserRole {
    // Lowest privilege - Default for all new registrations
    READER("READER", 1, "Can read posts, comment, like, and follow authors"),
    
    // Content creation roles
    CONTRIBUTOR("CONTRIBUTOR", 2, "Can create and edit drafts, cannot publish directly"),
    AUTHOR("AUTHOR", 3, "Can create, edit, publish, and delete their own posts"),
    EDITOR("EDITOR", 4, "Can manage all content, moderate comments, manage categories/tags"),
    
    // Administrative roles
    ADMIN("ADMIN", 5, "Can manage users, posts, comments, and site settings for their site"),
    SUPER_ADMIN("SUPER_ADMIN", 6, "Platform-wide access, can manage everything across all sites");

    private final String roleName;
    private final int hierarchyLevel;
    private final String description;

    UserRole(String roleName, int hierarchyLevel, String description) {
        this.roleName = roleName;
        this.hierarchyLevel = hierarchyLevel;
        this.description = description;
    }

    public String getRoleName() {
        return roleName;
    }

    public int getHierarchyLevel() {
        return hierarchyLevel;
    }

    public String getDescription() {
        return description;
    }

    /**
     * Check if this role has higher or equal privileges than another role
     */
    public boolean hasPrivilegeLevel(UserRole requiredRole) {
        return this.hierarchyLevel >= requiredRole.hierarchyLevel;
    }

    /**
     * Get default role for new user registration
     */
    public static UserRole getDefaultRole() {
        return READER;
    }

    /**
     * Check if role can be self-assigned during registration
     */
    public boolean isSelfAssignable() {
        return this == READER; // Only READER can be self-assigned
    }

    @Override
    public String toString() {
        return roleName;
    }
}
