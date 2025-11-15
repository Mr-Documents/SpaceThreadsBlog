import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../../context/AuthContext";
import { parseAuthError, getSuccessMessage } from "../../utils/errorMessages";

const ChangePasswordSchema = Yup.object().shape({
  currentPassword: Yup.string().required("Current password is required"),
  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required("Please confirm your new password"),
});

export default function ChangePassword() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changeSuccess, setChangeSuccess] = useState(false);

  if (changeSuccess) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-gray-800 border border-gray-700 rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <div className="text-blue-400 text-6xl mb-4">✅</div>
            <h3 className="text-xl font-bold text-blue-400 mb-2">Password Changed Successfully!</h3>
            <p className="text-gray-300 mb-4">
              Your password has been updated successfully.
            </p>
            <p className="text-gray-400 text-sm mb-6">
              For security reasons, you may need to log in again.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-200"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => navigate("/profile")}
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition duration-200"
              >
                Go to Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800 border border-gray-700 rounded-2xl shadow-xl p-8">
        {/* Title */}
        <h1 className="text-3xl font-semibold text-white text-center mb-2">
          Change Password
        </h1>
        <p className="text-gray-400 text-sm text-center mb-8">
          Update your account password for better security.
        </p>

        <Formik
          initialValues={{ currentPassword: "", newPassword: "", confirmPassword: "" }}
          validationSchema={ChangePasswordSchema}
          onSubmit={async (values, { setSubmitting, setErrors }) => {
            try {
              const response = await fetch("http://localhost:8080/api/v1/auth/change-password", {
                method: "POST",
                headers: { 
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                  currentPassword: values.currentPassword,
                  newPassword: values.newPassword,
                  confirmPassword: values.confirmPassword
                }),
              });

              if (response.ok) {
                setChangeSuccess(true);
              } else {
                const errorData = await response.json();
                const errorInfo = parseAuthError({ response: { status: response.status, data: errorData } }, 'change_password');
                
                // Set error on specific field if available, otherwise on newPassword as fallback
                const errorField = errorInfo.field || 'newPassword';
                setErrors({ [errorField]: errorInfo.message });
              }
            } catch (error) {
              console.error("Change password error:", error);
              const errorInfo = parseAuthError(error, 'change_password');
              setErrors({ newPassword: errorInfo.message });
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-5">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <Field
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    placeholder="Enter your current password"
                    className="w-full px-4 py-2 pr-12 bg-gray-900 text-gray-100 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition"
                  >
                    {showCurrentPassword ? (
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
                <ErrorMessage name="currentPassword" component="div" className="text-red-400 text-sm mt-1" />
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Field
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    placeholder="Enter your new password (min 8 characters)"
                    className="w-full px-4 py-2 pr-12 bg-gray-900 text-gray-100 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition"
                  >
                    {showNewPassword ? (
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

              {/* Confirm New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Field
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm your new password"
                    className="w-full px-4 py-2 pr-12 bg-gray-900 text-gray-100 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
              <div className="bg-gray-900/50 border border-blue-500/20 rounded-lg p-3 text-sm text-gray-300">
                <p className="font-medium text-blue-300 mb-1">Password Requirements:</p>
                <ul className="text-xs space-y-1">
                  <li>• At least 8 characters long</li>
                  <li>• Must be different from current password</li>
                  <li>• New password and confirmation must match</li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2 rounded-md font-medium text-white bg-blue-600 hover:bg-blue-700 transition ${
                  isSubmitting && "opacity-70 cursor-not-allowed"
                }`}
              >
                {isSubmitting ? "Changing Password..." : "Change Password"}
              </button>
            </Form>
          )}
        </Formik>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-400">
          <button
            onClick={() => navigate(-1)}
            className="hover:text-white transition font-medium"
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
}
