# 📮 Postman API Testing Guide - Multi-User Blogging Platform

## 🚀 Quick Start

### Step 1: Import the Collection
1. Open **Postman**
2. Click **Import** button (top left)
3. Select **Multi-User-Blog-API.postman_collection.json**
4. Collection will appear in your Collections sidebar

### Step 2: Import the Environment
1. Click the **Environments** tab (left sidebar)
2. Click **Import**
3. Select **Multi-User-Blog-API.postman_environment.json**
4. Select the environment from the dropdown (top right)

### Step 3: Start Testing!
Your collection is ready to use. The environment is configured with:
- `base_url`: http://localhost:8080/api/v1
- `token`: (auto-saved after login)
- `user_id`: (auto-saved after login)
- `username`: (auto-saved after login)

---

## 📋 API Endpoint Overview

### **Total Endpoints: 65+**

| Category | Endpoints | Authentication Required |
|----------|-----------|------------------------|
| **Authentication** | 11 | Mixed (login/register = No, others = Yes) |
| **Posts** | 14 | Mixed (read = No, write = Yes) |
| **Comments** | 10 | Mixed (read = No, write = Yes) |
| **Categories** | 6 | Mixed (read = No, write = Yes) |
| **Tags** | 8 | Mixed (read = No, write = Yes) |
| **Media** | 4 | Yes (all require auth) |
| **Contact** | 1 | No |

---

## 🔐 Authentication Flow

### **Recommended Testing Sequence:**

#### 1. **Register a New User**
```
POST /api/v1/auth/register
Body: {
  "username": "testuser",
  "email": "test@example.com",
  "password": "SecurePass123!"
}
```
✅ Response: Registration successful message

#### 2. **Get Verification Token** (Testing Endpoint)
```
GET /api/v1/auth/get-verification-token?email=test@example.com
```
✅ Response: Returns verification token

#### 3. **Verify Email**
```
GET /api/v1/auth/verify-email?token={verification_token}
```
✅ Response: Email verified successfully

#### 4. **Login**
```
POST /api/v1/auth/login
Body: {
  "email": "test@example.com",
  "password": "SecurePass123!"
}
```
✅ **Token is automatically saved to environment variables!**

#### 5. **Access Protected Endpoints**
All subsequent requests will use the token automatically via `{{token}}` variable.

---

## 🎯 Testing Scenarios

### **Scenario 1: Complete Blog Post Workflow**

1. **Login** → Token saved
2. **Create Post** (POST `/posts`)
   ```json
   {
     "title": "My First Post",
     "content": "This is amazing content!",
     "published": true,
     "categoryId": 1,
     "tags": ["technology", "web"]
   }
   ```
3. **Get My Posts** (GET `/posts/my-posts`)
4. **Update Post** (PUT `/posts/{id}`)
5. **Like Post** (POST `/posts/{id}/like`)
6. **Add Comment** (POST `/comments/post/{postId}`)
7. **Delete Post** (DELETE `/posts/{id}`)

### **Scenario 2: Content Discovery**

1. **Get Popular Posts** (GET `/posts/popular`)
2. **Search Posts** (GET `/posts/search?q=technology`)
3. **Get Posts by Category** (GET `/categories/{id}/posts`)
4. **Get Posts by Tag** (GET `/tags/{id}/posts`)
5. **Get Popular Tags** (GET `/tags/popular`)

### **Scenario 3: User Management**

1. **Get Profile** (GET `/auth/profile`)
2. **Change Password** (POST `/auth/change-password`)
3. **Get Post Stats** (GET `/posts/stats`)
4. **Get Comment Stats** (GET `/comments/stats`)

### **Scenario 4: Media Upload**

1. **Upload Cover Image** (POST `/media/upload/image`)
   - Use form-data with key: `file`, value: (select image)
2. **Use returned URL** in post creation
3. **Delete Media** if needed (DELETE `/media/images/{filename}`)

---

## ⚙️ Environment Variables

The environment file contains these variables:

| Variable | Description | Auto-Set |
|----------|-------------|----------|
| `base_url` | API base URL (http://localhost:8080/api/v1) | No |
| `token` | JWT authentication token | Yes (after login) |
| `user_id` | Logged-in user ID | Yes (after login) |
| `username` | Logged-in username | Yes (after login) |
| `post_id` | Last created post ID | Manual |
| `comment_id` | Last created comment ID | Manual |
| `category_id` | Last created category ID | Manual |
| `tag_id` | Last created tag ID | Manual |

### **Using Variables in Requests:**
```
{{base_url}}/posts
Authorization: Bearer {{token}}
```

---

## 📂 Collection Structure

```
Multi-User Blogging Platform API/
├── 🔐 Authentication/
│   ├── Register User
│   ├── Login (auto-saves token)
│   ├── Verify Email
│   ├── Resend Verification
│   ├── Forgot Password
│   ├── Reset Password
│   ├── Change Password
│   ├── Get Profile
│   ├── Request Role Upgrade
│   ├── Change User Role (Admin)
│   ├── Get All Users (Admin)
│   └── Logout
│
├── 📝 Posts/
│   ├── Create Post
│   ├── Get All Published Posts
│   ├── Get All Posts (Admin)
│   ├── Get My Posts
│   ├── Get Posts by Author
│   ├── Get Post by ID
│   ├── Get Post by Slug
│   ├── Update Post
│   ├── Delete Post
│   ├── Like/Unlike Post
│   ├── Search Posts
│   ├── Get Popular Posts
│   ├── Get Recent Posts
│   └── Get Post Statistics
│
├── 💬 Comments/
│   ├── Create Comment
│   ├── Create Reply to Comment
│   ├── Get Comments for Post (Paginated)
│   ├── Get All Comments for Post (Nested)
│   ├── Get Comment by ID
│   ├── Update Comment
│   ├── Delete Comment
│   ├── Get Comments by User
│   ├── Get My Comments
│   ├── Get Recent Comments
│   ├── Get Comment Count for Post
│   └── Get Comment Statistics
│
├── 📁 Categories/
│   ├── Get All Categories
│   ├── Get Category by ID
│   ├── Get Category by Slug
│   ├── Get Posts by Category
│   ├── Create Category (Admin/Editor)
│   ├── Update Category (Admin/Editor)
│   └── Delete Category (Admin)
│
├── 🏷️ Tags/
│   ├── Get All Tags
│   ├── Get Popular Tags
│   ├── Get Tag by ID
│   ├── Get Tag by Slug
│   ├── Get Posts by Tag
│   ├── Search Tags
│   ├── Create Tag (Admin/Editor)
│   ├── Update Tag (Admin/Editor)
│   └── Delete Tag (Admin)
│
├── 📷 Media/
│   ├── Upload Image
│   ├── Upload File
│   ├── Get Image
│   ├── Get File
│   └── Delete Media
│
└── 📧 Contact/
    └── Submit Contact Form
```

---

## 🔑 Role-Based Access Control

### **User Roles Hierarchy** (Level 1-6):

1. **SUBSCRIBER** (Level 1) - Read-only, can like/comment
2. **CONTRIBUTOR** (Level 2) - Create posts (drafts only)
3. **AUTHOR** (Level 3) - Create & publish own posts
4. **EDITOR** (Level 4) - Edit all posts, moderate comments
5. **ADMIN** (Level 5) - Full access, user management
6. **SUPER_ADMIN** (Level 6) - Complete system control

### **Testing Different Roles:**

1. Register multiple users
2. Use Admin account to upgrade roles:
   ```
   POST /api/v1/auth/admin/change-user-role
   {
     "username": "testuser",
     "newRole": "AUTHOR"
   }
   ```
3. Test endpoint access with different role tokens

---

## 🛠️ Common Query Parameters

### **Pagination:**
- `page` - Page number (0-indexed, default: 0)
- `size` - Items per page (1-100, default: 10)
- `sortBy` - Field to sort by (e.g., createdAt, title)
- `sortDir` - Sort direction (asc/desc, default: desc)

**Example:**
```
GET /api/v1/posts?page=0&size=20&sortBy=createdAt&sortDir=desc
```

### **Search:**
- `q` - Search query string
- `limit` - Maximum results

**Example:**
```
GET /api/v1/posts/search?q=technology&page=0&size=10
```

---

## 🧪 Testing Best Practices

### **1. Sequential Testing:**
- Start with Authentication (register → verify → login)
- Then test CRUD operations (create → read → update → delete)
- Finally test advanced features (search, stats, popular)

### **2. Data Cleanup:**
- Use DELETE endpoints to clean up test data
- Or use the `/auth/clear-all-users` endpoint (testing only)

### **3. Error Testing:**
- Try endpoints without authentication
- Test with invalid IDs
- Test with missing required fields
- Test with role restrictions

### **4. Automation:**
- Save common workflows as Collections
- Use Pre-request Scripts for setup
- Use Tests tab for assertions

---

## 📊 Expected Response Formats

### **Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* ... response data ... */ }
}
```

### **Error Response:**
```json
{
  "success": false,
  "message": "Operation failed",
  "error": "Detailed error message"
}
```

### **Paginated Response:**
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": {
    "content": [ /* ... items ... */ ],
    "totalElements": 50,
    "totalPages": 5,
    "number": 0,
    "size": 10,
    "first": true,
    "last": false
  }
}
```

---

## 🐛 Troubleshooting

### **Problem: Token not being saved after login**
✅ **Solution:** Check the Tests tab in Login request. Ensure script is present:
```javascript
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    pm.environment.set("token", jsonData.token);
}
```

### **Problem: 401 Unauthorized errors**
✅ **Solution:** 
- Ensure you're logged in
- Check token is in environment variables
- Verify email before login
- Token might be expired (login again)

### **Problem: 403 Forbidden errors**
✅ **Solution:** Your user role doesn't have permission for this endpoint. Upgrade role via admin.

### **Problem: Backend not running**
✅ **Solution:** Start backend: `cd backend && ./mvnw spring-boot:run`

### **Problem: File upload not working**
✅ **Solution:** 
- Use form-data (not JSON)
- Key must be "file"
- Select file from your system
- Ensure file is under 10MB

---

## 🎓 Advanced Tips

### **1. Use Collection Variables**
Save commonly used IDs:
```javascript
// In Tests tab after creating a post
pm.collectionVariables.set("post_id", pm.response.json().data.id);
```

### **2. Chain Requests**
Use pre-request scripts to call other endpoints:
```javascript
// Get a fresh token before each request
pm.sendRequest({
    url: pm.environment.get("base_url") + "/auth/login",
    method: 'POST',
    header: { 'Content-Type': 'application/json' },
    body: { /* ... login credentials ... */ }
}, function (err, res) {
    pm.environment.set("token", res.json().token);
});
```

### **3. Bulk Testing**
Use Collection Runner:
1. Click on collection
2. Click "Run" button
3. Select requests to run
4. Configure iterations and delays
5. Run all tests automatically

---

## 📝 Quick Reference Card

### **Most Common Endpoints:**

```bash
# Authentication
POST   /auth/register              # Sign up
POST   /auth/login                 # Sign in (saves token)
GET    /auth/profile               # Get my info

# Posts
POST   /posts                      # Create post
GET    /posts                      # List all posts
GET    /posts/{id}                 # Get single post
PUT    /posts/{id}                 # Update post
DELETE /posts/{id}                 # Delete post
POST   /posts/{id}/like            # Like/unlike

# Comments
POST   /comments/post/{postId}     # Add comment
GET    /comments/post/{postId}/all # Get all comments
PUT    /comments/{id}               # Edit comment
DELETE /comments/{id}               # Delete comment

# Media
POST   /media/upload/image         # Upload image
POST   /media/upload/file          # Upload file
```

---

## ✅ Success Checklist

Before considering API fully tested:

- [ ] Can register new user
- [ ] Can verify email
- [ ] Can login and token is saved
- [ ] Can create a post
- [ ] Can upload and use cover image
- [ ] Can add tags and category
- [ ] Can like own and others' posts
- [ ] Can comment on posts
- [ ] Can reply to comments (nested)
- [ ] Can edit own content
- [ ] Can delete own content
- [ ] Can search posts
- [ ] Can view statistics
- [ ] Can change password
- [ ] Admin can manage user roles
- [ ] All pagination works
- [ ] All error responses are clear

---

## 📞 Support

If you encounter issues:
1. Check this guide's Troubleshooting section
2. Verify backend is running (`http://localhost:8080`)
3. Check Postman Console for detailed error logs
4. Ensure all required fields are provided

---

**Happy Testing! 🚀**

Generated for: Multi-User Blogging Platform API v1.0
Last Updated: October 2025
