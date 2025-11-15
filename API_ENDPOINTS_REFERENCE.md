# 🔥 Complete API Endpoints Reference - Multi-User Blogging Platform

## Base URL
```
http://localhost:8080/api/v1
```

---

## 🔐 AUTHENTICATION ENDPOINTS (11 endpoints)

### 1. Register User
- **POST** `/auth/register`
- **Auth Required:** No
- **Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```
- **Response:** Success message, user data

### 2. Login
- **POST** `/auth/login`
- **Auth Required:** No
- **Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```
- **Response:** JWT token, user data
- **Note:** Save the `token` from response for authenticated requests

### 3. Verify Email
- **GET** `/auth/verify-email?token={verification_token}`
- **Auth Required:** No
- **Response:** Email verification success

### 4. Resend Verification Email
- **POST** `/auth/resend-verification`
- **Auth Required:** No
- **Body:**
```json
{
  "email": "john@example.com"
}
```

### 5. Logout
- **POST** `/auth/logout`
- **Auth Required:** Yes
- **Headers:** `Authorization: Bearer {token}`

### 6. Forgot Password
- **POST** `/auth/forgot-password`
- **Auth Required:** No
- **Body:**
```json
{
  "email": "john@example.com"
}
```

### 7. Reset Password
- **POST** `/auth/reset-password`
- **Auth Required:** No
- **Body:**
```json
{
  "token": "reset-token-from-email",
  "newPassword": "NewSecure123!",
  "confirmPassword": "NewSecure123!"
}
```

### 8. Change Password
- **POST** `/auth/change-password`
- **Auth Required:** Yes
- **Body:**
```json
{
  "currentPassword": "SecurePass123!",
  "newPassword": "NewSecure456!",
  "confirmPassword": "NewSecure456!"
}
```

### 9. Get User Profile
- **GET** `/auth/profile`
- **Auth Required:** Yes
- **Response:** Current user's profile data

### 10. Request Role Upgrade
- **POST** `/auth/request-role-upgrade`
- **Auth Required:** Yes
- **Body:**
```json
{
  "requestedRole": "AUTHOR",
  "reason": "I want to publish blog posts"
}
```

### 11. Change User Role (Admin Only)
- **POST** `/auth/admin/change-user-role`
- **Auth Required:** Yes (ADMIN or SUPER_ADMIN)
- **Body:**
```json
{
  "username": "johndoe",
  "newRole": "EDITOR"
}
```
- **Roles:** SUBSCRIBER, CONTRIBUTOR, AUTHOR, EDITOR, ADMIN, SUPER_ADMIN

### 12. Get All Users (Admin Only)
- **GET** `/auth/admin/users`
- **Auth Required:** Yes (ADMIN or SUPER_ADMIN)
- **Response:** List of all users

---

## 📝 POSTS ENDPOINTS (14 endpoints)

### 1. Create Post
- **POST** `/posts`
- **Auth Required:** Yes (CONTRIBUTOR+)
- **Body:**
```json
{
  "title": "My First Blog Post",
  "content": "This is the full content with **markdown** support!",
  "excerpt": "A brief description of the post",
  "coverImage": "http://localhost:8080/api/v1/media/images/image_20251020_123456_abc123.jpg",
  "published": true,
  "categoryId": 1,
  "tags": ["technology", "web-development", "java"]
}
```

### 2. Get All Published Posts
- **GET** `/posts?page=0&size=10&sortBy=createdAt&sortDir=desc`
- **Auth Required:** No
- **Query Params:**
  - `page` (0-indexed, default: 0)
  - `size` (1-100, default: 10)
  - `sortBy` (createdAt, title, likeCount, viewCount)
  - `sortDir` (asc, desc)

### 3. Get All Posts (Admin/Editor)
- **GET** `/posts/all?page=0&size=10&sortBy=createdAt&sortDir=desc`
- **Auth Required:** Yes (EDITOR+)
- **Note:** Includes drafts and unpublished posts

### 4. Get My Posts
- **GET** `/posts/my-posts?page=0&size=10`
- **Auth Required:** Yes
- **Response:** All posts created by authenticated user

### 5. Get Posts by Author
- **GET** `/posts/author/{username}?page=0&size=10`
- **Auth Required:** No
- **Example:** `/posts/author/johndoe?page=0&size=10`

### 6. Get Post by ID
- **GET** `/posts/{id}`
- **Auth Required:** No
- **Example:** `/posts/123`
- **Note:** Increments view count

### 7. Get Post by Slug
- **GET** `/posts/slug/{slug}`
- **Auth Required:** No
- **Example:** `/posts/slug/my-first-blog-post-20251020`

### 8. Update Post
- **PUT** `/posts/{id}`
- **Auth Required:** Yes (Author or EDITOR+)
- **Body:** Same as Create Post
- **Note:** Authors can only update their own posts

### 9. Delete Post
- **DELETE** `/posts/{id}`
- **Auth Required:** Yes (Author or EDITOR+)
- **Note:** Authors can only delete their own posts

### 10. Like/Unlike Post
- **POST** `/posts/{id}/like`
- **Auth Required:** Yes
- **Note:** Toggle - if liked, unlikes; if not liked, likes

### 11. Search Posts
- **GET** `/posts/search?q=technology&page=0&size=10`
- **Auth Required:** No
- **Query Params:**
  - `q` (search query - searches title, content, excerpt)
  - `page`, `size`, `sortBy`, `sortDir`

### 12. Get Popular Posts
- **GET** `/posts/popular?limit=10`
- **Auth Required:** No
- **Query Params:**
  - `limit` (1-50, default: 10)
- **Note:** Sorted by views + likes

### 13. Get Recent Posts
- **GET** `/posts/recent?limit=10`
- **Auth Required:** No
- **Query Params:**
  - `limit` (1-50, default: 10)

### 14. Get Post Statistics
- **GET** `/posts/stats`
- **Auth Required:** Yes
- **Response:**
```json
{
  "totalPosts": 25,
  "publishedPosts": 20,
  "draftPosts": 5,
  "totalViews": 1523,
  "totalLikes": 342
}
```

---

## 💬 COMMENTS ENDPOINTS (10 endpoints)

### 1. Create Comment
- **POST** `/comments/post/{postId}`
- **Auth Required:** Yes
- **Body:**
```json
{
  "content": "Great post! Very informative.",
  "parentId": null
}
```
- **Note:** Set `parentId` to null for top-level comment

### 2. Create Reply to Comment
- **POST** `/comments/post/{postId}`
- **Auth Required:** Yes
- **Body:**
```json
{
  "content": "Thanks for your feedback!",
  "parentId": 5
}
```
- **Note:** Set `parentId` to comment ID you're replying to

### 3. Get Comments for Post (Paginated)
- **GET** `/comments/post/{postId}?page=0&size=10&sortBy=createdAt&sortDir=asc`
- **Auth Required:** No
- **Note:** Returns top-level comments only

### 4. Get All Comments for Post (Nested)
- **GET** `/comments/post/{postId}/all`
- **Auth Required:** No
- **Note:** Returns all comments with nested replies (up to 5 levels deep)

### 5. Get Comment by ID
- **GET** `/comments/{id}`
- **Auth Required:** No

### 6. Update Comment
- **PUT** `/comments/{id}?content=Updated content here`
- **Auth Required:** Yes (Comment author only)
- **Query Params:**
  - `content` (new comment text)

### 7. Delete Comment
- **DELETE** `/comments/{id}`
- **Auth Required:** Yes (Comment author, post author, or EDITOR+)

### 8. Get Comments by User
- **GET** `/comments/user/{username}?page=0&size=10`
- **Auth Required:** No
- **Example:** `/comments/user/johndoe?page=0&size=10`

### 9. Get My Comments
- **GET** `/comments/my-comments?page=0&size=10`
- **Auth Required:** Yes

### 10. Get Recent Comments
- **GET** `/comments/recent?limit=10`
- **Auth Required:** No
- **Query Params:**
  - `limit` (1-50, default: 10)

### 11. Get Comment Count for Post
- **GET** `/comments/post/{postId}/count`
- **Auth Required:** No
- **Response:** Number of comments on the post

### 12. Get Comment Statistics
- **GET** `/comments/stats`
- **Auth Required:** Yes
- **Response:**
```json
{
  "totalComments": 156,
  "repliesReceived": 42,
  "commentsThisWeek": 18
}
```

---

## 📁 CATEGORIES ENDPOINTS (6 endpoints)

### 1. Get All Categories
- **GET** `/categories`
- **Auth Required:** No
- **Response:** List of all categories sorted by name

### 2. Get Category by ID
- **GET** `/categories/{id}`
- **Auth Required:** No

### 3. Get Category by Slug
- **GET** `/categories/slug/{slug}`
- **Auth Required:** No
- **Example:** `/categories/slug/technology`

### 4. Get Posts by Category
- **GET** `/categories/{id}/posts?page=0&size=10&sortBy=createdAt&sortDir=desc`
- **Auth Required:** No

### 5. Create Category
- **POST** `/categories`
- **Auth Required:** Yes (EDITOR+ or ADMIN)
- **Body:**
```json
{
  "name": "Technology",
  "description": "Posts about tech and programming"
}
```
- **Note:** Slug is auto-generated from name

### 6. Update Category
- **PUT** `/categories/{id}`
- **Auth Required:** Yes (EDITOR+ or ADMIN)
- **Body:** Same as Create Category

### 7. Delete Category
- **DELETE** `/categories/{id}`
- **Auth Required:** Yes (ADMIN only)
- **Note:** Cannot delete if category has associated posts

---

## 🏷️ TAGS ENDPOINTS (8 endpoints)

### 1. Get All Tags
- **GET** `/tags`
- **Auth Required:** No
- **Response:** List of all tags sorted by name

### 2. Get Popular Tags
- **GET** `/tags/popular?limit=20`
- **Auth Required:** No
- **Query Params:**
  - `limit` (1-100, default: 20)
- **Note:** Sorted by post count

### 3. Get Tag by ID
- **GET** `/tags/{id}`
- **Auth Required:** No

### 4. Get Tag by Slug
- **GET** `/tags/slug/{slug}`
- **Auth Required:** No
- **Example:** `/tags/slug/web-development`

### 5. Get Posts by Tag
- **GET** `/tags/{id}/posts?page=0&size=10&sortBy=createdAt&sortDir=desc`
- **Auth Required:** No

### 6. Search Tags
- **GET** `/tags/search?q=java&limit=20`
- **Auth Required:** No
- **Query Params:**
  - `q` (search query)
  - `limit` (1-100, default: 20)

### 7. Create Tag
- **POST** `/tags?name=JavaScript`
- **Auth Required:** Yes (EDITOR+ or ADMIN)
- **Query Params:**
  - `name` (tag name)
- **Note:** Slug is auto-generated

### 8. Update Tag
- **PUT** `/tags/{id}?name=TypeScript`
- **Auth Required:** Yes (EDITOR+ or ADMIN)
- **Query Params:**
  - `name` (new tag name)

### 9. Delete Tag
- **DELETE** `/tags/{id}`
- **Auth Required:** Yes (ADMIN only)
- **Note:** Cannot delete if tag has associated posts

---

## 📷 MEDIA ENDPOINTS (4 endpoints)

### 1. Upload Image
- **POST** `/media/upload/image`
- **Auth Required:** Yes
- **Content-Type:** `multipart/form-data`
- **Form Data:**
  - Key: `file`
  - Value: (Select image file)
- **Allowed Types:** JPEG, PNG, GIF, WebP
- **Max Size:** 10MB
- **Response:**
```json
{
  "filename": "image_20251020_123456_abc123.jpg",
  "originalName": "my-photo.jpg",
  "url": "http://localhost:8080/api/v1/media/images/image_20251020_123456_abc123.jpg",
  "size": "2048576",
  "type": "image/jpeg"
}
```

### 2. Upload File
- **POST** `/media/upload/file`
- **Auth Required:** Yes
- **Content-Type:** `multipart/form-data`
- **Form Data:**
  - Key: `file`
  - Value: (Select file)
- **Allowed Types:** PDF, Word (.doc, .docx), Text (.txt), ZIP
- **Max Size:** 10MB

### 3. Get Image
- **GET** `/media/images/{filename}`
- **Auth Required:** No
- **Example:** `/media/images/image_20251020_123456_abc123.jpg`
- **Response:** Binary image data

### 4. Get File
- **GET** `/media/files/{filename}`
- **Auth Required:** No
- **Example:** `/media/files/file_20251020_123456_def456.pdf`
- **Response:** Binary file data (with download header)

### 5. Delete Media
- **DELETE** `/media/{type}/{filename}`
- **Auth Required:** Yes
- **Example:** `/media/images/image_20251020_123456_abc123.jpg`
- **Path Params:**
  - `type` (images or files)
  - `filename` (exact filename)

---

## 📧 CONTACT ENDPOINT (1 endpoint)

### 1. Submit Contact Form
- **POST** `/contact`
- **Auth Required:** No
- **Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "I have a question about your platform..."
}
```
- **Response:** Success confirmation message

---

## 🧪 TESTING ENDPOINTS (Development Only - Remove in Production)

### 1. Get Verification Token
- **GET** `/auth/get-verification-token?email=test@example.com`
- **Auth Required:** No
- **Response:** Returns verification token for testing

### 2. Get Reset Password Token
- **GET** `/auth/get-reset-token?email=test@example.com`
- **Auth Required:** No
- **Response:** Returns password reset token for testing

### 3. Clear All Users
- **DELETE** `/auth/clear-all-users`
- **Auth Required:** No
- **Response:** Deletes all users (for testing cleanup)

### 4. Test Auth Controller
- **GET** `/auth/test`
- **Auth Required:** No
- **Response:** "Auth controller is working!"

---

## 📊 Response Format Standards

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { /* ... actual data ... */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Operation failed",
  "error": "Detailed error description"
}
```

### Paginated Response
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": {
    "content": [ /* ... array of items ... */ ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 10
    },
    "totalElements": 50,
    "totalPages": 5,
    "number": 0,
    "size": 10,
    "first": true,
    "last": false,
    "empty": false
  }
}
```

---

## 🔑 Authorization Header Format

For endpoints that require authentication, include:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📝 Common HTTP Status Codes

- **200 OK** - Request successful
- **201 Created** - Resource created successfully
- **400 Bad Request** - Invalid request data
- **401 Unauthorized** - Missing or invalid authentication token
- **403 Forbidden** - Insufficient permissions
- **404 Not Found** - Resource not found
- **409 Conflict** - Resource already exists
- **500 Internal Server Error** - Server error

---

## 🎯 Quick Testing Workflow

1. **Register** → POST `/auth/register`
2. **Get Token** → GET `/auth/get-verification-token?email=your@email.com`
3. **Verify** → GET `/auth/verify-email?token=TOKEN`
4. **Login** → POST `/auth/login` (save the token!)
5. **Create Post** → POST `/posts` (use token)
6. **Upload Image** → POST `/media/upload/image` (use token)
7. **Add Comment** → POST `/comments/post/{postId}` (use token)
8. **Like Post** → POST `/posts/{id}/like` (use token)
9. **Search** → GET `/posts/search?q=keyword`
10. **View Stats** → GET `/posts/stats` (use token)

---

**Total Endpoints: 68**
- Authentication: 12 (including 3 testing endpoints)
- Posts: 14
- Comments: 12
- Categories: 7
- Tags: 9
- Media: 5
- Contact: 1
- Testing: 4 (development only)

---

Generated: October 2025  
Platform: Multi-User Blogging Platform API v1.0
