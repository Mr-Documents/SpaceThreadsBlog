package com.multiuserbloggingplatform.backend.controller;

import com.multiuserbloggingplatform.backend.dto.LoginRequest;
import com.multiuserbloggingplatform.backend.dto.RegisterRequest;
import com.multiuserbloggingplatform.backend.dto.AuthResponse;
import com.multiuserbloggingplatform.backend.dto.ApiResponse;
import com.multiuserbloggingplatform.backend.dto.UserData;
import com.multiuserbloggingplatform.backend.dto.ResendVerificationRequest;
import com.multiuserbloggingplatform.backend.dto.ForgotPasswordRequest;
import com.multiuserbloggingplatform.backend.dto.ResetPasswordRequest;
import com.multiuserbloggingplatform.backend.dto.ChangePasswordRequest;
import com.multiuserbloggingplatform.backend.dto.ChangeUserRoleRequest;
import com.multiuserbloggingplatform.backend.dto.RoleUpgradeRequest;
// Swagger imports temporarily removed for compilation
import com.multiuserbloggingplatform.backend.entity.User;
import com.multiuserbloggingplatform.backend.repository.UserRepository;
import com.multiuserbloggingplatform.backend.service.CustomUserDetailsService;
import com.multiuserbloggingplatform.backend.service.EmailService;
import com.multiuserbloggingplatform.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private CustomUserDetailsService userDetailsService;
    @Autowired
    private EmailService emailService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserData>> register(@Validated @RequestBody RegisterRequest registerRequest) {
        try {
            if (userRepository.findByUsername(registerRequest.getUsername()).isPresent()
                    || userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Registration failed", "Username or email already exists"));
            }

            // Generate verification token
            String verificationToken = UUID.randomUUID().toString();
            
            User user = new User();
            user.setUsername(registerRequest.getUsername());
            user.setEmail(registerRequest.getEmail());
            user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
            user.setRole("READER"); // All new users start as READER (industry standard)
            user.setEmailVerified(false);
            user.setVerificationToken(verificationToken);
            user.setVerificationTokenExpiresAt(LocalDateTime.now().plusDays(1)); // 24 hours
            user.setCreatedAt(LocalDateTime.now());
            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);

            // Send verification email
            emailService.sendVerificationEmail(user.getEmail(), user.getUsername(), verificationToken);

            UserData userData = new UserData(user.getUsername(), user.getRole());
            return ResponseEntity.ok(ApiResponse.success(
                "Registration successful! Please check your email to verify your account.", 
                userData));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Registration failed", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<UserData>> login(@Validated @RequestBody LoginRequest loginRequest) {
        try {
            // Look up username by email
            User user = userRepository.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new RuntimeException("Invalid email or password"));

            // Check if email is verified
            if (!user.isEmailVerified()) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Login failed", "Please verify your email before logging in. Check your inbox for the verification link."));
            }

            // Authenticate using username and password
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getUsername(), loginRequest.getPassword())
            );
            SecurityContextHolder.getContext().setAuthentication(auth);

            String token = jwtUtil.generateToken(user);

            UserData userData = UserData.fromUser(user);
            return ResponseEntity.ok(ApiResponse.successWithToken("Login successful", token, userData));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Login failed", e.getMessage()));
        }
    }

    @GetMapping("/verify-email")
    public ResponseEntity<ApiResponse<UserData>> verifyEmail(@RequestParam("token") String token) {
        try {
            User user = userRepository.findByVerificationToken(token)
                    .orElseThrow(() -> new RuntimeException("Invalid verification token"));

            // Check if token is expired
            if (user.isVerificationTokenExpired()) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Verification failed", "Verification token has expired. Please register again."));
            }

            // Verify the user
            user.setEmailVerified(true);
            user.setVerificationToken(null);
            user.setVerificationTokenExpiresAt(null);
            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);

            // Send welcome email
            emailService.sendWelcomeEmail(user.getEmail(), user.getUsername());

            UserData userData = UserData.fromUser(user);
            return ResponseEntity.ok(ApiResponse.success(
                "Email verified successfully! Welcome to our platform. You can now log in.", 
                userData));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Email verification failed", e.getMessage()));
        }
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<ApiResponse<UserData>> resendVerification(@Validated @RequestBody ResendVerificationRequest request) {
        try {
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (user.isEmailVerified()) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Resend failed", "Email is already verified"));
            }

            // Generate new verification token
            String verificationToken = UUID.randomUUID().toString();
            user.setVerificationToken(verificationToken);
            user.setVerificationTokenExpiresAt(LocalDateTime.now().plusDays(1));
            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);

            // Send new verification email
            emailService.sendVerificationEmail(request.getEmail(), user.getUsername(), verificationToken);

            UserData userData = new UserData(user.getUsername(), user.getRole());
            return ResponseEntity.ok(ApiResponse.success(
                "Verification email sent! Please check your inbox.", 
                userData));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to resend verification email", e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout() {
        try {
            // Clear the security context
            SecurityContextHolder.clearContext();
            
            return ResponseEntity.ok(ApiResponse.success(
                "Logout successful", 
                "You have been successfully logged out"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Logout failed", e.getMessage()));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<String>> forgotPassword(@Validated @RequestBody ForgotPasswordRequest request) {
        try {
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found with this email address"));

            // Generate reset token
            String resetToken = UUID.randomUUID().toString();
            user.setResetPasswordToken(resetToken);
            user.setResetPasswordTokenExpiresAt(LocalDateTime.now().plusHours(1)); // 1 hour expiry
            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);

            // Send password reset email
            emailService.sendPasswordResetEmail(user.getEmail(), user.getUsername(), resetToken);

            return ResponseEntity.ok(ApiResponse.success(
                "Password reset email sent", 
                "Please check your email for password reset instructions"));
        } catch (Exception e) {
            // Don't reveal if email exists or not for security
            return ResponseEntity.ok(ApiResponse.success(
                "Password reset email sent", 
                "If an account with this email exists, you will receive password reset instructions"));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<String>> resetPassword(@Validated @RequestBody ResetPasswordRequest request) {
        try {
            // Validate password confirmation
            if (!request.getNewPassword().equals(request.getConfirmPassword())) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Password reset failed", "Passwords do not match"));
            }

            User user = userRepository.findByResetPasswordToken(request.getToken())
                    .orElseThrow(() -> new RuntimeException("Invalid reset token"));

            // Check if token is expired
            if (user.isResetPasswordTokenExpired()) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Password reset failed", "Reset token has expired. Please request a new password reset"));
            }

            // Update password
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            user.setResetPasswordToken(null);
            user.setResetPasswordTokenExpiresAt(null);
            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);

            // Send confirmation email
            emailService.sendPasswordChangeConfirmationEmail(user.getEmail(), user.getUsername());

            return ResponseEntity.ok(ApiResponse.success(
                "Password reset successful", 
                "Your password has been successfully updated. You can now log in with your new password"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Password reset failed", e.getMessage()));
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<String>> changePassword(
            @Validated @RequestBody ChangePasswordRequest request,
            Authentication authentication) {
        try {
            // Check if authentication is null
            if (authentication == null) {
                return ResponseEntity.status(401)
                        .body(ApiResponse.error("Authentication required", "User not authenticated"));
            }

            // Validate password confirmation
            if (!request.getNewPassword().equals(request.getConfirmPassword())) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Password change failed", "Passwords do not match"));
            }

            // Get current user
            String username = authentication.getName();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Verify current password
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Password change failed", "Current password is incorrect"));
            }

            // Update password
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);

            // Send confirmation email
            emailService.sendPasswordChangeConfirmationEmail(user.getEmail(), user.getUsername());

            return ResponseEntity.ok(ApiResponse.success(
                "Password changed successfully", 
                "Your password has been successfully updated"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Password change failed", e.getMessage()));
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserData>> getProfile(Authentication authentication) {
        try {
            String username = authentication.getName();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            UserData userData = UserData.fromUser(user);
            return ResponseEntity.ok(ApiResponse.success("Profile retrieved successfully", userData));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to get profile", e.getMessage()));
        }
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Auth controller is working!");
    }

    // TEST ENDPOINT - Simplified reset for demo
    @PostMapping("/demo-reset-password")
    public ResponseEntity<ApiResponse<String>> demoResetPassword(@RequestBody String jsonBody) {
        try {
            // Simple JSON parsing for demo
            String token = jsonBody.substring(jsonBody.indexOf("\"token\":\"") + 9);
            token = token.substring(0, token.indexOf("\""));
            
            String newPassword = jsonBody.substring(jsonBody.indexOf("\"newPassword\":\"") + 15);
            newPassword = newPassword.substring(0, newPassword.indexOf("\""));
            
            User user = userRepository.findByResetPasswordToken(token)
                    .orElseThrow(() -> new RuntimeException("Invalid reset token"));

            // Update password
            user.setPassword(passwordEncoder.encode(newPassword));
            user.setResetPasswordToken(null);
            user.setResetPasswordTokenExpiresAt(null);
            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);

            return ResponseEntity.ok(ApiResponse.success(
                "Password reset successful (DEMO)", 
                "Your password has been successfully updated. You can now log in with your new password"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Password reset failed", e.getMessage()));
        }
    }

    // TEST ENDPOINT - Remove in production
    @GetMapping("/get-reset-token")
    public ResponseEntity<ApiResponse<String>> getResetToken(@RequestParam("email") String email) {
        try {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            String token = user.getResetPasswordToken();
            if (token == null) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("No token found", "No reset token exists for this user. Request password reset first."));
            }
            
            return ResponseEntity.ok(ApiResponse.success("Reset token retrieved", token));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to get token", e.getMessage()));
        }
    }

    // TEST ENDPOINT - Remove in production
    @GetMapping("/get-verification-token")
    public ResponseEntity<ApiResponse<String>> getVerificationToken(@RequestParam("email") String email) {
        try {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            if (user.isEmailVerified()) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("User already verified", "Email is already verified"));
            }
            
            String token = user.getVerificationToken();
            if (token == null) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("No token found", "No verification token exists for this user"));
            }
            
            return ResponseEntity.ok(ApiResponse.success("Verification token retrieved", token));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to get token", e.getMessage()));
        }
    }

    // TEST ENDPOINT - Remove in production
    @DeleteMapping("/clear-all-users")
    public ResponseEntity<ApiResponse<String>> clearAllUsers() {
        try {
            long userCount = userRepository.count();
            userRepository.deleteAll();
            return ResponseEntity.ok(ApiResponse.success(
                "All test data cleared", 
                "Deleted " + userCount + " users and related data"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to clear data", e.getMessage()));
        }
    }

    // ============ ROLE MANAGEMENT ENDPOINTS (Industry Standard) ============

    @PostMapping("/request-role-upgrade")
    public ResponseEntity<ApiResponse<String>> requestRoleUpgrade(
            @Validated @RequestBody RoleUpgradeRequest request,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Validate requested role
            if (!request.getRequestedRole().equals("AUTHOR") && 
                !request.getRequestedRole().equals("CONTRIBUTOR")) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Invalid role request", 
                              "Only AUTHOR and CONTRIBUTOR roles can be requested"));
            }

            // In a real application, this would create a role upgrade request record
            // For now, we'll just send an email to admins
            emailService.sendRoleUpgradeRequest(user.getEmail(), user.getUsername(), 
                                              request.getRequestedRole(), request.getReason());

            return ResponseEntity.ok(ApiResponse.success(
                "Role upgrade request submitted successfully", 
                "Admins will review your request and respond via email"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to submit role upgrade request", e.getMessage()));
        }
    }

    @PostMapping("/admin/change-user-role")
    public ResponseEntity<ApiResponse<UserData>> changeUserRole(
            @Validated @RequestBody ChangeUserRoleRequest request,
            Authentication authentication) {
        try {
            String adminUsername = authentication.getName();
            User admin = userRepository.findByUsername(adminUsername)
                    .orElseThrow(() -> new RuntimeException("Admin not found"));

            // Check if user has admin privileges
            if (!admin.getRole().equals("ADMIN") && !admin.getRole().equals("SUPER_ADMIN")) {
                return ResponseEntity.status(403)
                        .body(ApiResponse.error("Access denied", "Only admins can change user roles"));
            }

            // Find target user
            User targetUser = userRepository.findByEmail(request.getUserEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Validate new role
            String[] validRoles = {"READER", "CONTRIBUTOR", "AUTHOR", "EDITOR", "ADMIN"};
            boolean isValidRole = false;
            for (String role : validRoles) {
                if (role.equals(request.getNewRole())) {
                    isValidRole = true;
                    break;
                }
            }
            
            if (!isValidRole) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Invalid role", "Role must be one of: READER, CONTRIBUTOR, AUTHOR, EDITOR, ADMIN"));
            }

            // Prevent non-super-admins from creating other admins
            if (request.getNewRole().equals("ADMIN") && !admin.getRole().equals("SUPER_ADMIN")) {
                return ResponseEntity.status(403)
                        .body(ApiResponse.error("Access denied", "Only Super Admins can assign Admin role"));
            }

            // Update user role
            String oldRole = targetUser.getRole();
            targetUser.setRole(request.getNewRole());
            targetUser.setUpdatedAt(LocalDateTime.now());
            userRepository.save(targetUser);

            // Send notification email
            emailService.sendRoleChangeNotification(targetUser.getEmail(), targetUser.getUsername(), 
                                                   oldRole, request.getNewRole(), request.getReason());

            UserData userData = new UserData(targetUser.getId(), targetUser.getUsername(), 
                                           targetUser.getEmail(), targetUser.getRole(), 
                                           targetUser.isEmailVerified(), targetUser.getCreatedAt());
            
            return ResponseEntity.ok(ApiResponse.success(
                "User role updated successfully", userData));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to change user role", e.getMessage()));
        }
    }

    @GetMapping("/admin/users")
    public ResponseEntity<ApiResponse<java.util.List<UserData>>> getAllUsers(Authentication authentication) {
        try {
            String adminUsername = authentication.getName();
            User admin = userRepository.findByUsername(adminUsername)
                    .orElseThrow(() -> new RuntimeException("Admin not found"));

            // Check if user has admin privileges
            if (!admin.getRole().equals("ADMIN") && !admin.getRole().equals("SUPER_ADMIN")) {
                return ResponseEntity.status(403)
                        .body(ApiResponse.error("Access denied", "Only admins can view all users"));
            }

            java.util.List<User> users = userRepository.findAll();
            java.util.List<UserData> userDataList = users.stream()
                    .map(user -> new UserData(user.getId(), user.getUsername(), user.getEmail(), 
                                            user.getRole(), user.isEmailVerified(), user.getCreatedAt()))
                    .collect(java.util.stream.Collectors.toList());

            return ResponseEntity.ok(ApiResponse.success("Users retrieved successfully", userDataList));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve users", e.getMessage()));
        }
    }
}
