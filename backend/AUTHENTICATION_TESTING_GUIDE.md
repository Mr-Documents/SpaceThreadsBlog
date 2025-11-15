# Authentication Testing Guide

## Overview
This guide provides comprehensive testing instructions for all authentication endpoints in the Multi-User Blogging Platform.

## Available Endpoints

### 1. User Registration
- **POST** `/api/v1/auth/register`
- **Body**: `{ "username": "testuser", "email": "test@example.com", "password": "password123", "role": "AUTHOR" }`
- **Response**: Registration success with verification email sent

### 2. Email Verification
- **GET** `/api/v1/auth/verify-email?token={verificationToken}`
- **Purpose**: Verify user email address
- **Note**: Check console logs for verification token during testing

### 3. User Login
- **POST** `/api/v1/auth/login`
- **Body**: `{ "email": "test@example.com", "password": "password123" }`
- **Response**: JWT token for authenticated requests

### 4. User Logout
- **POST** `/api/v1/auth/logout`
- **Headers**: `Authorization: Bearer {token}`
- **Purpose**: Clear user session

### 5. Get User Profile
- **GET** `/api/v1/auth/profile`
- **Headers**: `Authorization: Bearer {token}`
- **Response**: Current user profile information

### 6. Change Password (Authenticated)
- **POST** `/api/v1/auth/change-password`
- **Headers**: `Authorization: Bearer {token}`
- **Body**: 
```json
{
    "currentPassword": "password123",
    "newPassword": "newpassword123",
    "confirmPassword": "newpassword123"
}
```

### 7. Forgot Password
- **POST** `/api/v1/auth/forgot-password`
- **Body**: `{ "email": "test@example.com" }`
- **Purpose**: Request password reset token
- **Note**: Check console logs for reset token during testing

### 8. Reset Password
- **POST** `/api/v1/auth/reset-password`
- **Body**: 
```json
{
    "token": "{resetToken}",
    "newPassword": "resetpassword123",
    "confirmPassword": "resetpassword123"
}
```

### 9. Resend Verification Email
- **POST** `/api/v1/auth/resend-verification`
- **Body**: `{ "email": "test@example.com" }`
- **Purpose**: Resend email verification if expired

## Testing with Postman

### Setup
1. Import the provided Postman collection: `Multi-User-Blogging-Platform-Auth.postman_collection.json`
2. Set environment variable `baseUrl` to `http://localhost:8080`
3. Start your Spring Boot application

### Testing Flow

#### Complete Registration & Login Flow:
1. **Register User** → Creates new user account
2. **Get Verification Token** → Retrieve token from test endpoint
3. **Verify Email** → Activate user account
4. **Login User** → Get JWT token (automatically saved to environment)
5. **Get Profile** → Test authenticated endpoint

#### Password Management Flow:
1. **Change Password** → Update password while logged in
2. **Forgot Password** → Request reset token
3. **Reset Password** → Use token to set new password

#### Utility Endpoints:
- **Test Endpoint** → Verify controller is working
- **Clear All Users** → Reset database for testing

## Console Logs for Testing

During testing, check the console for important information:

### Email Verification:
```
=== EMAIL VERIFICATION ===
To: test@example.com
Username: testuser
Verification URL: http://localhost:8080/api/v1/auth/verify-email?token=abc123
Token: abc123
========================
```

### Password Reset:
```
=== PASSWORD RESET EMAIL ===
To: test@example.com
Username: testuser
Reset URL: http://localhost:8080/reset-password?token=xyz789
Token: xyz789
============================
```

## Security Features

### Token Expiration:
- **Verification Token**: 24 hours
- **Password Reset Token**: 1 hour
- **JWT Token**: Configured in application properties

### Password Requirements:
- Minimum 8 characters
- Must match confirmation field

### Email Verification:
- Required before login
- Prevents unauthorized access

## Error Handling

Common error responses:
- `400 Bad Request`: Validation errors, expired tokens
- `401 Unauthorized`: Invalid credentials, missing token
- `404 Not Found`: User not found

## Production Notes

### Remove Before Production:
- `/get-verification-token` endpoint
- `/clear-all-users` endpoint
- Console logging of sensitive tokens

### Configure:
- Real SMTP settings for email delivery
- Secure JWT secret key
- Appropriate token expiration times
- CORS settings for frontend domain

## Standup Presentation Checklist

✅ **User Registration** - Complete with email verification
✅ **User Login** - JWT-based authentication
✅ **User Logout** - Session management
✅ **Password Reset** - Forgot/reset password flow
✅ **Change Password** - Authenticated password update
✅ **User Profile** - Get user information
✅ **Email Verification** - Account activation
✅ **Security Features** - Token expiration, validation
✅ **Postman Collection** - Ready for API testing
✅ **Error Handling** - Comprehensive error responses
