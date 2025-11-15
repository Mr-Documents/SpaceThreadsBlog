/**
 * Enhanced error message utility for authentication actions
 * Provides clear, specific, and user-friendly error messages
 */

export const parseAuthError = (error, action = 'action') => {
  // Handle network errors
  if (!error.response) {
    return {
      message: "🌐 Network error. Please check your internet connection and try again.",
      type: "network"
    };
  }

  const status = error.response.status;
  const data = error.response.data;
  const backendMessage = data?.message || data?.error || '';
  
  // Handle different HTTP status codes
  switch (status) {
    case 400:
      return parseBadRequestError(backendMessage, action);
    case 401:
      return parseUnauthorizedError(backendMessage, action);
    case 403:
      return parseForbiddenError(backendMessage, action);
    case 404:
      return parseNotFoundError(backendMessage, action);
    case 409:
      return parseConflictError(backendMessage, action);
    case 422:
      return parseValidationError(backendMessage, action);
    case 429:
      return {
        message: "⏰ Too many attempts. Please wait a few minutes before trying again.",
        type: "rate_limit"
      };
    case 500:
      return {
        message: "🔧 Server error. Our team has been notified. Please try again in a few minutes.",
        type: "server_error"
      };
    default:
      return {
        message: backendMessage || `❌ ${action} failed. Please try again.`,
        type: "unknown"
      };
  }
};

const parseBadRequestError = (message, action) => {
  const lowerMessage = message.toLowerCase();
  
  // Registration specific errors
  if (lowerMessage.includes('username') && lowerMessage.includes('already')) {
    return {
      message: "👤 This username is already taken. Please choose a different username.",
      type: "username_exists",
      field: "username"
    };
  }
  
  if (lowerMessage.includes('email') && lowerMessage.includes('already')) {
    return {
      message: "📧 An account with this email already exists. Try logging in instead.",
      type: "email_exists",
      field: "email"
    };
  }
  
  if (lowerMessage.includes('password') && lowerMessage.includes('weak')) {
    return {
      message: "🔒 Password is too weak. Use at least 8 characters with letters and numbers.",
      type: "weak_password",
      field: "password"
    };
  }
  
  if (lowerMessage.includes('invalid email')) {
    return {
      message: "📧 Please enter a valid email address.",
      type: "invalid_email",
      field: "email"
    };
  }
  
  // Password change specific errors
  if (lowerMessage.includes('current password') || lowerMessage.includes('incorrect password')) {
    return {
      message: "🔑 Current password is incorrect. Please check and try again.",
      type: "incorrect_current_password",
      field: "currentPassword"
    };
  }
  
  if (lowerMessage.includes('same password') || lowerMessage.includes('must be different')) {
    return {
      message: "🔄 New password must be different from your current password.",
      type: "same_password",
      field: "newPassword"
    };
  }
  
  if (lowerMessage.includes('passwords do not match') || lowerMessage.includes('confirmation')) {
    return {
      message: "🔗 Password confirmation doesn't match. Please check both fields.",
      type: "password_mismatch",
      field: "confirmPassword"
    };
  }
  
  // Reset password specific errors
  if (lowerMessage.includes('token') && (lowerMessage.includes('invalid') || lowerMessage.includes('expired'))) {
    return {
      message: "⏰ This reset link has expired or is invalid. Please request a new password reset.",
      type: "invalid_token"
    };
  }
  
  return {
    message: message || `❌ Invalid request. Please check your information and try again.`,
    type: "bad_request"
  };
};

const parseUnauthorizedError = (message, action) => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('verify') || lowerMessage.includes('verification')) {
    return {
      message: "📧 Please verify your email address before logging in. Check your inbox for the verification link.",
      type: "email_not_verified",
      field: "email"
    };
  }
  
  if (lowerMessage.includes('credentials') || lowerMessage.includes('invalid')) {
    return {
      message: "🔐 Invalid email or password. Please check your credentials and try again.",
      type: "invalid_credentials",
      field: "email"
    };
  }
  
  if (action === 'login') {
    return {
      message: "🔐 Login failed. Please check your email and password.",
      type: "login_failed",
      field: "email"
    };
  }
  
  return {
    message: "🔒 Authentication required. Please log in to continue.",
    type: "unauthorized"
  };
};

const parseForbiddenError = (message, action) => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('token') && lowerMessage.includes('expired')) {
    return {
      message: "⏰ Your session has expired. Please log in again.",
      type: "session_expired"
    };
  }
  
  if (action === 'change_password') {
    return {
      message: "🔒 You don't have permission to change this password. Please log in again.",
      type: "permission_denied"
    };
  }
  
  return {
    message: "🚫 You don't have permission to perform this action.",
    type: "forbidden"
  };
};

const parseNotFoundError = (message, action) => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('user') || lowerMessage.includes('account')) {
    if (action === 'login') {
      return {
        message: "👤 No account found with this email. Please check your email or register for a new account.",
        type: "user_not_found",
        field: "email"
      };
    }
    
    if (action === 'forgot_password') {
      return {
        message: "📧 No account found with this email address. Please check the email or register for a new account.",
        type: "user_not_found",
        field: "email"
      };
    }
  }
  
  if (lowerMessage.includes('token')) {
    return {
      message: "🔗 This verification or reset link is invalid. Please request a new one.",
      type: "token_not_found"
    };
  }
  
  return {
    message: message || "❓ The requested resource was not found.",
    type: "not_found"
  };
};

const parseConflictError = (message, action) => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('username')) {
    return {
      message: "👤 This username is already taken. Please choose a different username.",
      type: "username_conflict",
      field: "username"
    };
  }
  
  if (lowerMessage.includes('email')) {
    return {
      message: "📧 An account with this email already exists. Try logging in instead.",
      type: "email_conflict",
      field: "email"
    };
  }
  
  return {
    message: message || "⚠️ This information is already in use. Please try different details.",
    type: "conflict"
  };
};

const parseValidationError = (message, action) => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('email')) {
    return {
      message: "📧 Please enter a valid email address.",
      type: "validation_error",
      field: "email"
    };
  }
  
  if (lowerMessage.includes('password')) {
    return {
      message: "🔒 Password must be at least 8 characters long.",
      type: "validation_error",
      field: "password"
    };
  }
  
  if (lowerMessage.includes('username')) {
    return {
      message: "👤 Username must be at least 3 characters long and contain only letters, numbers, and underscores.",
      type: "validation_error",
      field: "username"
    };
  }
  
  return {
    message: message || "📝 Please check your information and try again.",
    type: "validation_error"
  };
};

// Success message utility
export const getSuccessMessage = (action, data = {}) => {
  switch (action) {
    case 'register':
      return {
        title: "Registration Successful! 🎉",
        message: `We've sent a verification email to ${data.email}. Please check your inbox and click the verification link to activate your account.`,
        type: "success"
      };
    
    case 'login':
      return {
        title: "Welcome back! 👋",
        message: `Successfully logged in as ${data.username || data.name}.`,
        type: "success"
      };
    
    case 'forgot_password':
      return {
        title: "Reset Email Sent! 📧",
        message: "Password reset instructions have been sent to your email. Please check your inbox and follow the link to reset your password.",
        type: "success"
      };
    
    case 'reset_password':
      return {
        title: "Password Reset Successful! 🔐",
        message: "Your password has been successfully updated. You can now log in with your new password.",
        type: "success"
      };
    
    case 'change_password':
      return {
        title: "Password Changed! ✅",
        message: "Your password has been successfully updated. For security, you may need to log in again on other devices.",
        type: "success"
      };
    
    case 'email_verified':
      return {
        title: "Email Verified! 🎉",
        message: "Your email address has been successfully verified. You can now access all features of your account.",
        type: "success"
      };
    
    default:
      return {
        title: "Success! ✅",
        message: "Operation completed successfully.",
        type: "success"
      };
  }
};
