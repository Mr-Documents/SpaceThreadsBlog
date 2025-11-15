import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import AuthLayout from "./authlayout";
import { parseAuthError, getSuccessMessage } from "../../utils/errorMessages";

const ResetPasswordSchema = Yup.object().shape({
  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required("Please confirm your password"),
});

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
    }
  }, [token]);

  if (!tokenValid) {
    return (
      <AuthLayout>
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold mb-4 text-red-400">Invalid Reset Link</h2>
          <p className="text-gray-300 mb-6">
            This password reset link is invalid or has expired.
          </p>
          <Link
            to="/forgot-password"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-200"
          >
            Request New Reset Link
          </Link>
        </div>
      </AuthLayout>
    );
  }

  if (resetSuccess) {
    return (
      <AuthLayout>
        <div className="text-center">
          <div className="bg-gray-800 border border-blue-500/30 rounded-lg p-6 mb-6">
            <div className="text-blue-400 text-6xl mb-4">✅</div>
            <h3 className="text-xl font-bold text-blue-400 mb-2">Password Reset Successful!</h3>
            <p className="text-gray-300 mb-4">
              Your password has been successfully updated.
            </p>
            <p className="text-gray-400 text-sm mb-6">
              You can now log in with your new password.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-200 shadow-lg hover:shadow-blue-500/25"
            >
              Go to Login
            </button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold mb-6 text-center">Reset Your Password 🔐</h2>
      <p className="text-gray-400 text-sm text-center mb-6">
        Enter your new password below to complete the reset process.
      </p>

      <Formik
        initialValues={{ newPassword: "", confirmPassword: "" }}
        validationSchema={ResetPasswordSchema}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          try {
            // Debug logging
            console.log("Form values:", values);
            console.log("Token:", token);
            console.log("Payload:", {
              token: token,
              newPassword: values.newPassword,
              confirmPassword: values.confirmPassword
            });

            const response = await fetch("http://localhost:8080/api/v1/auth/reset-password", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                token: token,
                newPassword: values.newPassword,
                confirmPassword: values.confirmPassword
              }),
            });

            if (response.ok) {
              setResetSuccess(true);
            } else {
              const errorData = await response.json();
              console.log("Error response:", errorData);
              
              const errorInfo = parseAuthError({ response: { status: response.status, data: errorData } }, 'reset_password');
              
              if (errorInfo.type === 'invalid_token') {
                setTokenValid(false);
                return;
              }
              
              // Handle validation errors specifically
              if (response.status === 400 && errorData.message) {
                if (errorData.message.includes('New password is required')) {
                  setErrors({ newPassword: "🔒 Please enter a new password (minimum 8 characters)" });
                } else if (errorData.message.includes('Password confirmation is required')) {
                  setErrors({ confirmPassword: "🔗 Please confirm your password" });
                } else if (errorData.message.includes('Password must be at least 8 characters')) {
                  setErrors({ newPassword: "🔒 Password must be at least 8 characters long" });
                } else if (errorData.message.includes('do not match')) {
                  setErrors({ confirmPassword: "🔗 Passwords do not match" });
                } else {
                  // Set error on specific field if available, otherwise on newPassword as fallback
                  const errorField = errorInfo.field || 'newPassword';
                  setErrors({ [errorField]: errorInfo.message });
                }
              } else {
                // Set error on specific field if available, otherwise on newPassword as fallback
                const errorField = errorInfo.field || 'newPassword';
                setErrors({ [errorField]: errorInfo.message });
              }
            }
          } catch (error) {
            console.error("Reset password error:", error);
            const errorInfo = parseAuthError(error, 'reset_password');
            setErrors({ newPassword: errorInfo.message });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-4">
            {/* New Password */}
            <div>
              <div className="relative">
                <Field
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  placeholder="New Password (min 8 characters)"
                  className="w-full border border-gray-600 rounded-lg p-3 pr-12 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <ErrorMessage name="newPassword" component="div" className="text-red-400 text-sm mt-1" />
            </div>

            {/* Confirm Password */}
            <div>
              <div className="relative">
                <Field
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm New Password"
                  className="w-full border border-gray-600 rounded-lg p-3 pr-12 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition"
                >
                  {showConfirmPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <ErrorMessage name="confirmPassword" component="div" className="text-red-400 text-sm mt-1" />
            </div>

            {/* Password Requirements */}
            <div className="bg-gray-800/50 border border-blue-500/20 rounded-lg p-3 text-sm text-gray-300">
              <p className="font-medium text-blue-300 mb-1">Password Requirements:</p>
              <ul className="text-xs space-y-1">
                <li>• At least 8 characters long</li>
                <li>• Passwords must match</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 mt-2 transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Resetting Password..." : "Reset Password"}
            </button>

            <div className="text-center mt-4">
              <Link
                to="/login"
                className="text-gray-400 hover:text-white text-sm transition"
              >
                Back to Login
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </AuthLayout>
  );
}
