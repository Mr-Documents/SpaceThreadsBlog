# Quick Start Testing Guide

## Start the Application

### Terminal 1 - Backend
```bash
cd backend
.\mvnw.cmd spring-boot:run
```
Wait for: `Started BackendApplication in X seconds`

### Terminal 2 - Frontend
```bash
cd frontend/multi-user-blog-frontend
npm run dev
```
Access at: http://localhost:5173 (or the port shown)

## Quick Test Flow (5 Minutes)

### 1. Register/Login (1 min)
- Go to http://localhost:5173/register
- Create test account
- Verify email (check console logs for token)
- Login at http://localhost:5173/login

### 2. Create a Post (2 min)
- Click "Create Post" button or go to `/posts/create`
- Fill in:
  - Title: "My First Blog Post"
  - Content: "This is test content for my blog..."
  - Upload a cover image (optional)
  - Select category if available
  - Add tags: "test, blog, demo"
- Click "Publish Post"
- Verify redirect to post detail page

### 3. View & Interact (1 min)
- See your post on detail page
- Click the heart icon to like it
- Scroll down to comments section
- Add a comment: "Great post!"
- Verify comment appears

### 4. Edit & Update (1 min)
- On the post detail page, click "Edit"
- Change the title to "My Updated Blog Post"
- Modify content
- Click "Update Post"
- Verify changes appear

### 5. Test Comments (Optional)
- Add another comment
- Click "Edit" on your comment
- Modify it and save
- Click "Reply" to create nested comment
- Try deleting a comment

### 6. Test Delete (Optional - Caution!)
- On post detail page, click "Delete"
- Confirm deletion
- Verify redirect to dashboard
- Check that post is gone from feed

## Expected Results

✅ **All operations should work smoothly**
- Fast loading (< 2 seconds per page)
- No console errors
- Proper authentication checks
- Data persists after refresh
- Clean UI with dark theme

## Troubleshooting

**Backend not starting?**
- Check MySQL is running
- Verify application.properties database config
- Ensure port 8080 is free

**Frontend not connecting?**
- Verify backend is on port 8080
- Check browser console for CORS errors
- Clear localStorage and retry: `localStorage.clear()`

**Can't create posts?**
- Ensure you're logged in
- Check JWT token exists: `localStorage.getItem('st_token')`
- Verify backend authentication is working

**Images not uploading?**
- Check backend uploads directory exists
- Verify file size < 10MB
- Ensure correct file type (jpg, png, gif, webp)

## API Test with Postman (Optional)

Import: `Multi-User-Blogging-Platform-Complete.postman_collection.json`

Key collections:
1. Authentication
2. Posts CRUD
3. Comments CRUD
4. Media Upload

## Database Quick Check

```sql
-- Check if posts exist
SELECT id, title, author_id, published FROM posts;

-- Check if comments exist
SELECT id, content, post_id, author_id FROM comments;

-- Check users
SELECT id, username, email FROM users;
```

## Success Indicators

🟢 **Everything Working:**
- Posts appear in feed
- Can create/edit/delete posts
- Comments load and save
- Images display correctly
- No console errors
- Smooth navigation

🔴 **Issues to Fix:**
- 401 errors → Authentication problem
- 404 errors → Backend endpoints not running
- 500 errors → Check backend logs
- Blank pages → Check console errors
- CORS errors → Backend CORS config

---

**Happy Testing! 🚀**

Your complete CRUD blog platform is now ready for action.
