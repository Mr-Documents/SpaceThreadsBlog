import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { loginUser } from "../../services/authservice";
import AuthLayout from "./authlayout";
import { parseAuthError, getSuccessMessage } from "../../utils/errorMessages";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email required"),
  password: Yup.string().required("Password required"),
  rememberMe: Yup.boolean(),
});

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold mb-6 text-center">Welcome Back 👋</h2>

      <Formik
        initialValues={{ email: "", password: "", rememberMe: false }}
        validationSchema={LoginSchema}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          try {
            const res = await loginUser(values);
            login(res.user, res.token);

            // ✅ Remember Me functionality
            if (values.rememberMe) {
              localStorage.setItem("rememberedEmail", values.email);
            } else {
              localStorage.removeItem("rememberedEmail");
            }

            navigate("/home");
          } catch (error) {
            console.error("Login error:", error);
            const errorInfo = parseAuthError(error, 'login');
            
            // Set error on specific field if available, otherwise on email as fallback
            const errorField = errorInfo.field || 'email';
            setErrors({ [errorField]: errorInfo.message });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-4">
            {/* Email */}
            <div>
              <Field
                type="email"
                name="email"
                placeholder="Email"
                className="w-full border border-gray-600 rounded-lg p-3 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-400 text-sm mt-1"
              />
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <Field
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  className="w-full border border-gray-600 rounded-lg p-3 pr-12 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition"
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-400 text-sm mt-1"
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <Field
                  type="checkbox"
                  name="rememberMe"
                  className="accent-primary h-4 w-4"
                />
                <span className="text-gray-300">Remember me</span>
              </label>

              <Link
                to="/forgot-password"
                className="text-primary hover:underline text-sm text-gray-400 hover:text-white"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-black rounded-lg py-3 mt-2 hover:bg-gray-700 text-white transition"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </Form>
        )}
      </Formik>
    </AuthLayout>
  );
}

