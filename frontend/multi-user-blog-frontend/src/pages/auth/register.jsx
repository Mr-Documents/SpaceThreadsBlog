import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { registerUser } from "../../services/authservice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthLayout from "./authlayout";
import { parseAuthError, getSuccessMessage } from "../../utils/errorMessages";

const RegisterSchema = Yup.object().shape({
  username: Yup.string().required("Username required"),
  email: Yup.string().email("Invalid email").required("Email required"),
  password: Yup.string().min(8, "At least 8 characters").required("Password required"),
  // Role removed - automatically assigned as READER (industry standard)
  
});

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold mb-6 text-center">Create an Account ✨</h2>
      <Formik
        initialValues={{ username: "", email: "", password: "" }}
        validationSchema={RegisterSchema}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          try {
            const response = await registerUser(values);
            console.log("Registration successful:", response);
            setUserEmail(values.email);
            setRegistrationSuccess(true);
            // Don't navigate immediately - show success message first
          } catch (error) {
            console.error("Registration error:", error);
            const errorInfo = parseAuthError(error, 'register');
            
            // Set error on specific field if available, otherwise on email as fallback
            const errorField = errorInfo.field || 'email';
            setErrors({ [errorField]: errorInfo.message });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <>
            {registrationSuccess ? (
              <div className="text-center">
                <div className="bg-gray-800 border border-blue-500/30 rounded-lg p-6 mb-6">
                  <div className="text-blue-400 text-6xl mb-4">✅</div>
                  <h3 className="text-xl font-bold text-blue-400 mb-2">Registration Successful!</h3>
                  <p className="text-gray-300 mb-4">
                    We've sent a verification email to <strong className="text-white">{userEmail}</strong>
                  </p>
                  <div className="bg-gray-700/50 border border-blue-500/20 rounded-lg p-4 mb-4">
                    <p className="text-gray-300 text-sm mb-2">
                      📧 <strong className="text-blue-300">Check your email inbox</strong> and click the verification link to activate your account.
                    </p>
                    <p className="text-amber-300 text-sm">
                      ⚠️ You won't be able to log in until you verify your email address.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/login")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-200 shadow-lg hover:shadow-blue-500/25"
                  >
                    Go to Login Page
                  </button>
                </div>
              </div>
            ) : (
              <Form className="flex flex-col gap-4">
            <div>
              <Field
                type="text"
                name="username"
                placeholder="Username"
                className="w-full border border-gray-600 rounded-lg p-3 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <ErrorMessage name="username" component="div" className="text-red-400 text-sm mt-1" />
            </div>

            <div>
              <Field
                type="email"
                name="email"
                placeholder="Email"
                className="w-full border border-gray-600 rounded-lg p-3 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <ErrorMessage name="email" component="div" className="text-red-400 text-sm mt-1" />
            </div>

            <div>
              <div className="relative">
                <Field
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password (min 8 characters)"
                  className="w-full border border-gray-600 rounded-lg p-3 pr-12 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
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
              <ErrorMessage name="password" component="div" className="text-red-400 text-sm mt-1" />
            </div>

            {/* Role selection removed - all users start as READER (industry standard) */}
            <div className="text-sm text-gray-400 text-center">
              <p>🎉 You'll start as a <strong>Reader</strong> with access to read, comment, and like posts.</p>
              <p>Want to become an Author? Contact an admin after registration!</p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-white rounded-lg py-3 mt-2 hover:bg-gray-700 transition"
            >
              {isSubmitting ? "Registering..." : "Sign Up"}
            </button>
          </Form>
            )}
          </>
        )}
      </Formik>
    </AuthLayout>
  );
}
