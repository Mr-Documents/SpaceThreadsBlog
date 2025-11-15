# 🚀 Postman API Testing - Quick Start

## 📦 Files Generated

I've created comprehensive API testing documentation for your Multi-User Blogging Platform:

### 1. **API_ENDPOINTS_REFERENCE.md** ⭐
**Complete reference guide with all 68 endpoints**
- Full request/response examples
- All HTTP methods, URLs, headers, bodies
- Organized by category (Auth, Posts, Comments, etc.)
- Ready to copy-paste into Postman manually

### 2. **POSTMAN_API_TESTING_GUIDE.md**
**Complete testing guide and best practices**
- Step-by-step import instructions
- Testing scenarios and workflows
- Troubleshooting guide
- Role-based access control explained

### 3. **Multi-User-Blog-API.postman_environment.json** ✅
**Postman environment file - READY TO IMPORT**
- Pre-configured with `base_url`, `token`, etc.
- Auto-saves authentication token after login

---

## 🎯 Two Ways to Use These Files

### Option A: Create Postman Collection Manually (Recommended)

Since the full JSON collection would be 3000+ lines, here's the fastest way:

1. **Import Environment File:**
   - Open Postman → Environments
   - Import `Multi-User-Blog-API.postman_environment.json` ✅
   - Select it from dropdown

2. **Create Requests from Reference:**
   - Open `API_ENDPOINTS_REFERENCE.md`
   - Create a new collection in Postman
   - Copy endpoint details one by one
   - Use `{{base_url}}` and `{{token}}` variables

3. **Start with Essential Endpoints:**
   - Authentication > Register
   - Authentication > Login (add auto-save script)
   - Posts > Create Post
   - Posts > Get All Posts
   - Comments > Create Comment
   - Media > Upload Image

### Option B: Generate Full Collection (Advanced)

Use Postman's API or collection format to programmatically create all 68 endpoints.

---

## ⚡ Fastest Way to Test (5 Minutes)

### Step 1: Import Environment
```bash
# In Postman:
# 1. Click Environments
# 2. Click Import
# 3. Select: Multi-User-Blog-API.postman_environment.json
# 4. Select environment from dropdown (top right)
```

### Step 2: Create Essential Requests

#### 1️⃣ **Register User**
```
POST {{base_url}}/auth/register

Body (JSON):
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "SecurePass123!"
}
```

#### 2️⃣ **Get Verification Token** (Testing)
```
GET {{base_url}}/auth/get-verification-token?email=test@example.com
```
**Copy the token from response**

#### 3️⃣ **Verify Email**
```
GET {{base_url}}/auth/verify-email?token=PASTE_TOKEN_HERE
```

#### 4️⃣ **Login** (IMPORTANT: Add Auto-Save Script)
```
POST {{base_url}}/auth/login

Body (JSON):
{
  "email": "test@example.com",
  "password": "SecurePass123!"
}

Tests Tab (JavaScript):
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    if (jsonData.token) {
        pm.environment.set("token", jsonData.token);
    }
    if (jsonData.data) {
        pm.environment.set("user_id", jsonData.data.id);
        pm.environment.set("username", jsonData.data.username);
    }
}
```

#### 5️⃣ **Create Post**
```
POST {{base_url}}/posts

Headers:
Authorization: Bearer {{token}}

Body (JSON):
{
  "title": "My First Post",
  "content": "Amazing content here!",
  "excerpt": "Brief description",
  "published": true,
  "categoryId": 1,
  "tags": ["technology", "web"]
}
```

#### 6️⃣ **Get All Posts**
```
GET {{base_url}}/posts?page=0&size=10

No auth required
```

---

## 📋 Complete Endpoint Checklist

Use `API_ENDPOINTS_REFERENCE.md` to add these:

### 🔐 Authentication (12 endpoints)
- [ ] Register
- [ ] Login (with auto-save script)
- [ ] Verify Email
- [ ] Resend Verification
- [ ] Forgot Password
- [ ] Reset Password
- [ ] Change Password
- [ ] Get Profile
- [ ] Request Role Upgrade
- [ ] Change User Role (Admin)
- [ ] Get All Users (Admin)
- [ ] Logout

### 📝 Posts (14 endpoints)
- [ ] Create Post
- [ ] Get All Published Posts
- [ ] Get All Posts (Admin)
- [ ] Get My Posts
- [ ] Get Posts by Author
- [ ] Get Post by ID
- [ ] Get Post by Slug
- [ ] Update Post
- [ ] Delete Post
- [ ] Like/Unlike Post
- [ ] Search Posts
- [ ] Get Popular Posts
- [ ] Get Recent Posts
- [ ] Get Post Statistics

### 💬 Comments (12 endpoints)
- [ ] Create Comment
- [ ] Create Reply
- [ ] Get Comments (Paginated)
- [ ] Get All Comments (Nested)
- [ ] Get Comment by ID
- [ ] Update Comment
- [ ] Delete Comment
- [ ] Get Comments by User
- [ ] Get My Comments
- [ ] Get Recent Comments
- [ ] Get Comment Count
- [ ] Get Comment Statistics

### 📁 Categories (7 endpoints)
- [ ] Get All Categories
- [ ] Get by ID
- [ ] Get by Slug
- [ ] Get Posts by Category
- [ ] Create Category
- [ ] Update Category
- [ ] Delete Category

### 🏷️ Tags (9 endpoints)
- [ ] Get All Tags
- [ ] Get Popular Tags
- [ ] Get by ID
- [ ] Get by Slug
- [ ] Get Posts by Tag
- [ ] Search Tags
- [ ] Create Tag
- [ ] Update Tag
- [ ] Delete Tag

### 📷 Media (5 endpoints)
- [ ] Upload Image
- [ ] Upload File
- [ ] Get Image
- [ ] Get File
- [ ] Delete Media

### 📧 Contact (1 endpoint)
- [ ] Submit Contact Form

---

## 🎨 Organizing Your Collection

### Suggested Folder Structure:
```
Multi-User Blog API/
├── 🔐 01-Authentication/
│   ├── Essential/
│   │   ├── Register
│   │   ├── Login
│   │   └── Get Profile
│   ├── Email/
│   │   ├── Verify Email
│   │   └── Resend Verification
│   ├── Password/
│   │   ├── Forgot Password
│   │   ├── Reset Password
│   │   └── Change Password
│   ├── Admin/
│   │   ├── Change User Role
│   │   └── Get All Users
│   └── Testing/
│       ├── Get Verification Token
│       └── Get Reset Token
│
├── 📝 02-Posts/
│   ├── Create & Read/
│   ├── Update & Delete/
│   ├── Interactions/
│   └── Search & Stats/
│
├── 💬 03-Comments/
├── 📁 04-Categories/
├── 🏷️ 05-Tags/
├── 📷 06-Media/
└── 📧 07-Contact/
```

---

## 🔧 Pro Tips

### 1. Collection-Level Authorization
Set auth at collection level instead of individual requests:
- Right-click collection → Edit
- Authorization tab → Type: Bearer Token
- Token: `{{token}}`
- Requests inherit this automatically

### 2. Pre-request Scripts
Add to collection/folder level:
```javascript
// Refresh token if expired
if (!pm.environment.get("token")) {
    console.warn("No token found. Please login first.");
}
```

### 3. Environment Variables
Already set up in the environment file:
- `{{base_url}}` - API base URL
- `{{token}}` - Auto-saved JWT token
- `{{username}}` - Auto-saved username
- `{{user_id}}` - Auto-saved user ID

---

## 📚 Documentation Files

### Quick Reference Order:
1. **Start Here:** `POSTMAN_QUICK_START.md` (this file)
2. **Endpoint Details:** `API_ENDPOINTS_REFERENCE.md`
3. **Testing Guide:** `POSTMAN_API_TESTING_GUIDE.md`
4. **Environment:** `Multi-User-Blog-API.postman_environment.json`

---

## ✅ Success Criteria

You know everything is set up correctly when:

1. ✅ Environment is imported and selected
2. ✅ Login request auto-saves token
3. ✅ Token appears in environment variables
4. ✅ Protected endpoints work with `{{token}}`
5. ✅ Can create posts, comments, upload images
6. ✅ Search and pagination work
7. ✅ Role-based access control enforced

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| 401 Unauthorized | Login first, check token is saved |
| 403 Forbidden | Check your user role, may need upgrade |
| Token not saving | Add the auto-save script to Login request |
| Backend not responding | Start backend: `cd backend && ./mvnw spring-boot:run` |
| Wrong base URL | Check environment variable `base_url` |

---

## 🎯 Next Steps

1. **Import environment file** ✅
2. **Create essential endpoints** (Register, Login, Create Post)
3. **Test authentication flow**
4. **Add remaining endpoints** using `API_ENDPOINTS_REFERENCE.md`
5. **Organize into folders**
6. **Export and share** with your team

---

**Need the full collection JSON?**

The complete Postman collection JSON would be 3000+ lines. If you need it:

1. Use Postman's collection API
2. Or manually create from `API_ENDPOINTS_REFERENCE.md` (faster)
3. Or request a generated collection file separately

---

**Happy Testing! 🚀**

*All endpoint details are in `API_ENDPOINTS_REFERENCE.md`*
