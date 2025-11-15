import React, { useState } from "react";
import { Link } from "react-router-dom";
import { parseAuthError, getSuccessMessage } from "../../utils/errorMessages";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const successInfo = getSuccessMessage('forgot_password');
        setMessage(successInfo.message);
      } else {
        const errorData = await response.json();
        const errorInfo = parseAuthError({ response: { status: response.status, data: errorData } }, 'forgot_password');
        setError(errorInfo.message);
      }
    } catch (err) {
      const errorInfo = parseAuthError(err, 'forgot_password');
      setError(errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800 border border-gray-700 rounded-2xl shadow-xl p-8">
        {/* Title */}
        <h1 className="text-3xl font-semibold text-white text-center mb-2">
          Forgot Password
        </h1>
        <p className="text-gray-400 text-sm text-center mb-8">
          Enter your account email and we’ll send you a reset link.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 text-gray-100 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-gray-500 transition"
              placeholder="you@example.com"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center bg-gray-900/50 py-2 rounded-md border border-gray-800">
              {error}
            </p>
          )}
          {message && (
            <div className="bg-green-800/20 border border-green-500/30 rounded-md p-4 mb-4">
              <p className="text-green-400 text-sm text-center mb-3">
                {message}
              </p>
              <div className="bg-gray-800/50 border border-blue-500/20 rounded-md p-3">
                <p className="text-blue-300 text-xs mb-2">
                  🔧 <strong>For Testing:</strong> If you don't receive the email, you can get the reset link manually:
                </p>
                <button
                  onClick={async () => {
                    try {
                      const response = await fetch(`http://localhost:8080/api/v1/auth/get-reset-token?email=${email}`);
                      const data = await response.json();
                      if (response.ok) {
                        const resetUrl = `http://localhost:5177/reset-password?token=${data.data}`;
                        window.open(resetUrl, '_blank');
                      } else {
                        // Show specific error message
                        if (data.message && data.message.includes('not found')) {
                          alert(`❌ No account found with email: ${email}\n\nPlease check your email address or register for a new account first.`);
                        } else if (data.message && data.message.includes('No reset token')) {
                          alert(`⚠️ No reset token found for ${email}\n\nPlease click "Send Reset Link" first to generate a reset token.`);
                        } else {
                          alert(`❌ ${data.message || 'Failed to get reset token'}\n\nPlease try requesting a password reset again.`);
                        }
                      }
                    } catch (err) {
                      alert('🌐 Network error. Please check your connection and try again.');
                    }
                  }}
                  className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition"
                >
                  Get Reset Link
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md font-medium text-gray-900 bg-white hover:opacity-90 transition ${
              loading && "opacity-70 cursor-not-allowed"
            }`}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-400">
          <Link
            to="/login"
            className="hover:text-white transition font-medium"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
