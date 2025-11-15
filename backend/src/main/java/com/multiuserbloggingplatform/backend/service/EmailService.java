package com.multiuserbloggingplatform.backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.base.url}")
    private String baseUrl;

    public void sendVerificationEmail(String toEmail, String username, String verificationToken) {
        try {
            // Create verification URL
            String verificationUrl = baseUrl + "/api/v1/auth/verify-email?token=" + verificationToken;
            
            // FOR TESTING: Log the verification URL
            System.out.println("=== EMAIL VERIFICATION ===");
            System.out.println("To: " + toEmail);
            System.out.println("Username: " + username);
            System.out.println("Verification URL: " + verificationUrl);
            System.out.println("Token: " + verificationToken);
            System.out.println("========================");
            
            // Uncomment below for actual email sending
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Verify Your Email - Multi-User Blogging Platform");

            // Create email content using Thymeleaf template
            Context context = new Context();
            context.setVariable("username", username);
            context.setVariable("verificationUrl", verificationUrl);

            String htmlContent = templateEngine.process("email-verification", context);
            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send verification email", e);
        }
    }

    public void sendWelcomeEmail(String toEmail, String username) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Welcome to Multi-User Blogging Platform!");

            Context context = new Context();
            context.setVariable("username", username);
            context.setVariable("loginUrl", baseUrl + "/login");

            String htmlContent = templateEngine.process("welcome-email", context);
            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send welcome email", e);
        }
    }

    public void sendPasswordResetEmail(String toEmail, String username, String resetToken) {
        try {
            // Create reset URL
            String resetUrl = baseUrl + "/reset-password?token=" + resetToken;
            
            // FOR TESTING: Log the reset URL
            System.out.println("=== PASSWORD RESET EMAIL ===");
            System.out.println("To: " + toEmail);
            System.out.println("Username: " + username);
            System.out.println("Reset URL: " + resetUrl);
            System.out.println("Token: " + resetToken);
            System.out.println("Attempting to send email...");
            
            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

                helper.setFrom(fromEmail);
                helper.setTo(toEmail);
                helper.setSubject("Password Reset Request - SpaceThreads");

                // Create email content using Thymeleaf template
                Context context = new Context();
                context.setVariable("username", username);
                context.setVariable("resetUrl", resetUrl);

                String htmlContent = templateEngine.process("password-reset-email", context);
                helper.setText(htmlContent, true);

                mailSender.send(message);
                System.out.println("✅ Email sent successfully!");
            } catch (Exception emailError) {
                System.out.println("❌ Failed to send email: " + emailError.getMessage());
                System.out.println("📧 Email delivery failed, but reset token is still valid.");
                System.out.println("🔗 User can use the 'Get Reset Link' button to access the reset page.");
                // Don't throw exception - let the password reset continue even if email fails
            }
            System.out.println("============================");
            
        } catch (Exception e) {
            System.out.println("❌ Email service error: " + e.getMessage());
            // Don't throw exception - password reset should work even if email fails
        }
    }

    public void sendPasswordChangeConfirmationEmail(String toEmail, String username) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Password Changed Successfully - Multi-User Blogging Platform");

            Context context = new Context();
            context.setVariable("username", username);
            context.setVariable("loginUrl", baseUrl + "/login");

            String htmlContent = templateEngine.process("password-change-confirmation", context);
            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send password change confirmation email", e);
        }
    }

    /**
     * Send role upgrade request notification to admins
     */
    public void sendRoleUpgradeRequest(String userEmail, String username, String requestedRole, String reason) {
        // In development, just log the request
        System.out.println("=== ROLE UPGRADE REQUEST ===");
        System.out.println("User: " + username + " (" + userEmail + ")");
        System.out.println("Requested Role: " + requestedRole);
        System.out.println("Reason: " + reason);
        System.out.println("Admin Action Required: Review and approve/deny this request");
        System.out.println("============================");
        
        // In production, this would send an email to all admins
        // For now, we'll just log it for testing purposes
    }

    /**
     * Send role change notification to user
     */
    public void sendRoleChangeNotification(String userEmail, String username, String oldRole, String newRole, String reason) {
        // In development, just log the notification
        System.out.println("=== ROLE CHANGE NOTIFICATION ===");
        System.out.println("User: " + username + " (" + userEmail + ")");
        System.out.println("Role Changed: " + oldRole + " → " + newRole);
        System.out.println("Reason: " + reason);
        System.out.println("Congratulations on your new role!");
        System.out.println("================================");
        
        // In production, this would send a proper email notification
        // For now, we'll just log it for testing purposes
    }
}
