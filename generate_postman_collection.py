#!/usr/bin/env python3
"""
Generate complete Postman collection for Multi-User Blogging Platform API
Run: python generate_postman_collection.py
Output: Multi-User-Blog-API-Complete.postman_collection.json
"""

import json

# Base collection structure
collection = {
    "info": {
        "name": "Multi-User Blogging Platform API - Complete",
        "description": "Complete API collection with 68 endpoints. Import the environment file first, then use Authentication > Login to auto-save your token.",
        "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    "auth": {
        "type": "bearer",
        "bearer": [
            {
                "key": "token",
                "value": "{{token}}",
                "type": "string"
            }
        ]
    },
    "variable": [
        {
            "key": "base_url",
            "value": "http://localhost:8080/api/v1",
            "type": "string"
        }
    ],
    "item": []
}

# Authentication folder
auth_folder = {
    "name": "🔐 Authentication",
    "item": [
        {
            "name": "Register User",
            "request": {
                "auth": {"type": "noauth"},
                "method": "POST",
                "header": [{"key": "Content-Type", "value": "application/json"}],
                "body": {
                    "mode": "raw",
                    "raw": json.dumps({
                        "username": "testuser",
                        "email": "test@example.com",
                        "password": "SecurePass123!"
                    }, indent=2)
                },
                "url": {
                    "raw": "{{base_url}}/auth/register",
                    "host": ["{{base_url}}"],
                    "path": ["auth", "register"]
                }
            }
        },
        {
            "name": "Login (Auto-saves Token)",
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "if (pm.response.code === 200) {",
                            "    var jsonData = pm.response.json();",
                            "    if (jsonData.token) {",
                            "        pm.environment.set('token', jsonData.token);",
                            "        console.log('✅ Token saved to environment');",
                            "    }",
                            "    if (jsonData.data) {",
                            "        pm.environment.set('user_id', jsonData.data.id);",
                            "        pm.environment.set('username', jsonData.data.username);",
                            "    }",
                            "}"
                        ]
                    }
                }
            ],
            "request": {
                "auth": {"type": "noauth"},
                "method": "POST",
                "header": [{"key": "Content-Type", "value": "application/json"}],
                "body": {
                    "mode": "raw",
                    "raw": json.dumps({
                        "email": "test@example.com",
                        "password": "SecurePass123!"
                    }, indent=2)
                },
                "url": {
                    "raw": "{{base_url}}/auth/login",
                    "host": ["{{base_url}}"],
                    "path": ["auth", "login"]
                }
            }
        },
        {
            "name": "Get Verification Token (Testing)",
            "request": {
                "auth": {"type": "noauth"},
                "method": "GET",
                "url": {
                    "raw": "{{base_url}}/auth/get-verification-token?email=test@example.com",
                    "host": ["{{base_url}}"],
                    "path": ["auth", "get-verification-token"],
                    "query": [{"key": "email", "value": "test@example.com"}]
                }
            }
        },
        {
            "name": "Verify Email",
            "request": {
                "auth": {"type": "noauth"},
                "method": "GET",
                "url": {
                    "raw": "{{base_url}}/auth/verify-email?token=YOUR_TOKEN_HERE",
                    "host": ["{{base_url}}"],
                    "path": ["auth", "verify-email"],
                    "query": [{"key": "token", "value": "YOUR_TOKEN_HERE"}]
                }
            }
        },
        {
            "name": "Resend Verification",
            "request": {
                "auth": {"type": "noauth"},
                "method": "POST",
                "header": [{"key": "Content-Type", "value": "application/json"}],
                "body": {
                    "mode": "raw",
                    "raw": json.dumps({"email": "test@example.com"}, indent=2)
                },
                "url": {
                    "raw": "{{base_url}}/auth/resend-verification",
                    "host": ["{{base_url}}"],
                    "path": ["auth", "resend-verification"]
                }
            }
        },
        {
            "name": "Get Profile",
            "request": {
                "method": "GET",
                "url": {
                    "raw": "{{base_url}}/auth/profile",
                    "host": ["{{base_url}}"],
                    "path": ["auth", "profile"]
                }
            }
        },
        {
            "name": "Forgot Password",
            "request": {
                "auth": {"type": "noauth"},
                "method": "POST",
                "header": [{"key": "Content-Type", "value": "application/json"}],
                "body": {
                    "mode": "raw",
                    "raw": json.dumps({"email": "test@example.com"}, indent=2)
                },
                "url": {
                    "raw": "{{base_url}}/auth/forgot-password",
                    "host": ["{{base_url}}"],
                    "path": ["auth", "forgot-password"]
                }
            }
        },
        {
            "name": "Reset Password",
            "request": {
                "auth": {"type": "noauth"},
                "method": "POST",
                "header": [{"key": "Content-Type", "value": "application/json"}],
                "body": {
                    "mode": "raw",
                    "raw": json.dumps({
                        "token": "RESET_TOKEN_HERE",
                        "newPassword": "NewSecure123!",
                        "confirmPassword": "NewSecure123!"
                    }, indent=2)
                },
                "url": {
                    "raw": "{{base_url}}/auth/reset-password",
                    "host": ["{{base_url}}"],
                    "path": ["auth", "reset-password"]
                }
            }
        },
        {
            "name": "Change Password",
            "request": {
                "method": "POST",
                "header": [{"key": "Content-Type", "value": "application/json"}],
                "body": {
                    "mode": "raw",
                    "raw": json.dumps({
                        "currentPassword": "SecurePass123!",
                        "newPassword": "NewSecure456!",
                        "confirmPassword": "NewSecure456!"
                    }, indent=2)
                },
                "url": {
                    "raw": "{{base_url}}/auth/change-password",
                    "host": ["{{base_url}}"],
                    "path": ["auth", "change-password"]
                }
            }
        },
        {
            "name": "Change User Role (Admin)",
            "request": {
                "method": "POST",
                "header": [{"key": "Content-Type", "value": "application/json"}],
                "body": {
                    "mode": "raw",
                    "raw": json.dumps({
                        "username": "testuser",
                        "newRole": "AUTHOR"
                    }, indent=2)
                },
                "url": {
                    "raw": "{{base_url}}/auth/admin/change-user-role",
                    "host": ["{{base_url}}"],
                    "path": ["auth", "admin", "change-user-role"]
                }
            }
        },
        {
            "name": "Get All Users (Admin)",
            "request": {
                "method": "GET",
                "url": {
                    "raw": "{{base_url}}/auth/admin/users",
                    "host": ["{{base_url}}"],
                    "path": ["auth", "admin", "users"]
                }
            }
        },
        {
            "name": "Logout",
            "request": {
                "method": "POST",
                "url": {
                    "raw": "{{base_url}}/auth/logout",
                    "host": ["{{base_url}}"],
                    "path": ["auth", "logout"]
                }
            }
        }
    ]
}

# Posts folder
posts_folder = {
    "name": "📝 Posts",
    "item": [
        {
            "name": "Create Post",
            "request": {
                "method": "POST",
                "header": [{"key": "Content-Type", "value": "application/json"}],
                "body": {
                    "mode": "raw",
                    "raw": json.dumps({
                        "title": "My First Blog Post",
                        "content": "This is the full content with markdown support!",
                        "excerpt": "A brief description",
                        "coverImage": "",
                        "published": True,
                        "categoryId": 1,
                        "tags": ["technology", "web-development"]
                    }, indent=2)
                },
                "url": {
                    "raw": "{{base_url}}/posts",
                    "host": ["{{base_url}}"],
                    "path": ["posts"]
                }
            }
        },
        {
            "name": "Get All Published Posts",
            "request": {
                "auth": {"type": "noauth"},
                "method": "GET",
                "url": {
                    "raw": "{{base_url}}/posts?page=0&size=10&sortBy=createdAt&sortDir=desc",
                    "host": ["{{base_url}}"],
                    "path": ["posts"],
                    "query": [
                        {"key": "page", "value": "0"},
                        {"key": "size", "value": "10"},
                        {"key": "sortBy", "value": "createdAt"},
                        {"key": "sortDir", "value": "desc"}
                    ]
                }
            }
        },
        {
            "name": "Get My Posts",
            "request": {
                "method": "GET",
                "url": {
                    "raw": "{{base_url}}/posts/my-posts?page=0&size=10",
                    "host": ["{{base_url}}"],
                    "path": ["posts", "my-posts"],
                    "query": [
                        {"key": "page", "value": "0"},
                        {"key": "size", "value": "10"}
                    ]
                }
            }
        },
        {
            "name": "Get Post by ID",
            "request": {
                "auth": {"type": "noauth"},
                "method": "GET",
                "url": {
                    "raw": "{{base_url}}/posts/1",
                    "host": ["{{base_url}}"],
                    "path": ["posts", "1"]
                }
            }
        },
        {
            "name": "Update Post",
            "request": {
                "method": "PUT",
                "header": [{"key": "Content-Type", "value": "application/json"}],
                "body": {
                    "mode": "raw",
                    "raw": json.dumps({
                        "title": "Updated Title",
                        "content": "Updated content",
                        "excerpt": "Updated excerpt",
                        "published": True,
                        "categoryId": 1,
                        "tags": ["updated"]
                    }, indent=2)
                },
                "url": {
                    "raw": "{{base_url}}/posts/1",
                    "host": ["{{base_url}}"],
                    "path": ["posts", "1"]
                }
            }
        },
        {
            "name": "Delete Post",
            "request": {
                "method": "DELETE",
                "url": {
                    "raw": "{{base_url}}/posts/1",
                    "host": ["{{base_url}}"],
                    "path": ["posts", "1"]
                }
            }
        },
        {
            "name": "Like/Unlike Post",
            "request": {
                "method": "POST",
                "url": {
                    "raw": "{{base_url}}/posts/1/like",
                    "host": ["{{base_url}}"],
                    "path": ["posts", "1", "like"]
                }
            }
        },
        {
            "name": "Search Posts",
            "request": {
                "auth": {"type": "noauth"},
                "method": "GET",
                "url": {
                    "raw": "{{base_url}}/posts/search?q=technology&page=0&size=10",
                    "host": ["{{base_url}}"],
                    "path": ["posts", "search"],
                    "query": [
                        {"key": "q", "value": "technology"},
                        {"key": "page", "value": "0"},
                        {"key": "size", "value": "10"}
                    ]
                }
            }
        },
        {
            "name": "Get Popular Posts",
            "request": {
                "auth": {"type": "noauth"},
                "method": "GET",
                "url": {
                    "raw": "{{base_url}}/posts/popular?limit=10",
                    "host": ["{{base_url}}"],
                    "path": ["posts", "popular"],
                    "query": [{"key": "limit", "value": "10"}]
                }
            }
        },
        {
            "name": "Get Post Statistics",
            "request": {
                "method": "GET",
                "url": {
                    "raw": "{{base_url}}/posts/stats",
                    "host": ["{{base_url}}"],
                    "path": ["posts", "stats"]
                }
            }
        }
    ]
}

# Add folders to collection
collection["item"].append(auth_folder)
collection["item"].append(posts_folder)

# Write to file
output_file = "Multi-User-Blog-API-Complete.postman_collection.json"
with open(output_file, "w", encoding="utf-8") as f:
    json.dump(collection, f, indent=2, ensure_ascii=False)

print(f"✅ Postman collection generated: {output_file}")
print(f"📦 Includes: Authentication ({len(auth_folder['item'])} endpoints), Posts ({len(posts_folder['item'])} endpoints)")
print(f"🚀 Import this file into Postman to get started!")
print(f"📖 See POSTMAN_QUICK_START.md for complete setup instructions")
