# Frontend API Documentation - Authentication System

## Base URL
```
http://localhost:8080/api/v1/auth
```

## Overview
The authentication system supports user registration, email verification, login, and account management with role-based access (ADMIN, AUTHOR, READER).

## API Endpoints

### 1. User Registration
**Endpoint:** `POST /register`

**Request Body:**
```json
{
  "username": "string (required, not blank)",
  "email": "string (required, valid email format)",
  "password": "string (required, minimum 8 characters)",
  "role": "string (required, one of: ADMIN, AUTHOR, READER)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Registration successful! Please check your email to verify your account.",
  "data": {
    "username": "johndoe",
    "role": "AUTHOR"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Registration failed",
  "error": "Username or email already exists"
}
```

### 2. User Login
**Endpoint:** `POST /login`

**Request Body:**
```json
{
  "email": "string (required, valid email format)",
  "password": "string (required)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "role": "AUTHOR",
    "emailVerified": true,
    "createdAt": "2024-10-09T18:00:00"
  }
}
```

**Error Responses (400):**
```json
// Invalid credentials
{
  "success": false,
  "message": "Login failed",
  "error": "Invalid email or password"
}

// Email not verified
{
  "success": false,
  "message": "Login failed",
  "error": "Please verify your email before logging in. Check your inbox for the verification link."
}
```

### 3. Email Verification
**Endpoint:** `GET /verify-email?token={verificationToken}`

**Query Parameters:**
- `token`: Verification token received via email

**Success Response (200):**
```json
{
  "success": true,
  "message": "Email verified successfully! Welcome to our platform. You can now log in.",
  "data": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "role": "AUTHOR",
    "emailVerified": true,
    "createdAt": "2024-10-09T18:00:00"
  }
}
```

**Error Responses (400):**
```json
// Invalid token
{
  "success": false,
  "message": "Email verification failed",
  "error": "Invalid verification token"
}

// Expired token
{
  "success": false,
  "message": "Verification failed",
  "error": "Verification token has expired. Please register again."
}
```

### 4. Resend Verification Email
**Endpoint:** `POST /resend-verification`

**Request Body:**
```json
{
  "email": "string (required, valid email format)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Verification email sent! Please check your inbox.",
  "data": {
    "username": "johndoe",
    "role": "AUTHOR"
  }
}
```

**Error Responses (400):**
```json
// User not found
{
  "success": false,
  "message": "Failed to resend verification email",
  "error": "User not found"
}

// Already verified
{
  "success": false,
  "message": "Resend failed",
  "error": "Email is already verified"
}
```

## Data Models

### UserData Object
```typescript
interface UserData {
  id?: number;
  username: string;
  email?: string;
  role: string; // "ADMIN" | "AUTHOR" | "READER"
  emailVerified?: boolean;
  createdAt?: string; // ISO 8601 format
}
```

### ApiResponse Object
```typescript
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  token?: string; // Only present in login success response
  data?: T;
  error?: string; // Only present in error responses
}
```

## Authentication Flow

### Registration Flow
1. User submits registration form
2. Backend validates input and creates unverified user
3. Backend sends verification email
4. User clicks verification link in email
5. Backend verifies token and activates account
6. User can now log in

### Login Flow
1. User submits login credentials (email + password)
2. Backend validates credentials
3. Backend checks if email is verified
4. If verified, backend returns JWT token and user data
5. Frontend stores token for authenticated requests

## Frontend Implementation Guidelines

### 1. Form Validation
Implement client-side validation matching backend requirements:
- **Username:** Required, not blank
- **Email:** Required, valid email format
- **Password:** Required, minimum 8 characters
- **Role:** Required, dropdown with options: ADMIN, AUTHOR, READER

### 2. Error Handling
Always check the `success` field in responses:
```javascript
if (response.success) {
  // Handle success case
  const userData = response.data;
  const token = response.token; // For login
} else {
  // Handle error case
  const errorMessage = response.error || response.message;
  // Display error to user
}
```

### 3. Token Management
- Store JWT token securely (localStorage/sessionStorage)
- Include token in Authorization header for protected requests:
  ```
  Authorization: Bearer {token}
  ```
- Handle token expiration and redirect to login

### 4. User Experience
- Show loading states during API calls
- Display success/error messages clearly
- Redirect after successful registration to login page
- Redirect after successful login to dashboard
- Handle email verification flow gracefully

### 5. Role-Based UI
Use the `role` field from UserData to show/hide features:
- **ADMIN:** Full access to all features
- **AUTHOR:** Can create and manage own content
- **READER:** Read-only access

## Testing Endpoints (Remove in Production)

### Get Verification Token
**Endpoint:** `GET /get-verification-token?email={email}`
- Use this to get verification tokens during development

### Clear All Users
**Endpoint:** `DELETE /clear-all-users`
- Use this to reset test data during development

## CORS Configuration
The backend is configured with `@CrossOrigin(origins = "*")` for development. Update this for production to specify allowed origins.

## Environment Variables
Make sure your backend has these configured:
- `spring.mail.username`: Email service username
- `app.base.url`: Base URL for verification links (e.g., http://localhost:8080)

## Security Notes
- Passwords are bcrypt hashed
- JWT tokens are used for authentication
- Email verification is required before login
- Verification tokens expire after 24 hours
- All endpoints validate input using Bean Validation
