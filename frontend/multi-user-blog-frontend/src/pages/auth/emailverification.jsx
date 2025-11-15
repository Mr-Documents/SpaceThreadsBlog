import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import AuthLayout from "./authlayout";
import { parseAuthError, getSuccessMessage } from "../../utils/errorMessages";

export default function EmailVerification() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("");

  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setVerificationStatus("error");
        setMessage("🔗 Invalid verification link. No token provided.");
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/api/v1/auth/verify-email?token=${token}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
          const data = await response.json();
          setVerificationStatus("success");
          const successInfo = getSuccessMessage('email_verified');
          setMessage(successInfo.message);
        } else {
          const errorData = await response.json();
          const errorInfo = parseAuthError({ response: { status: response.status, data: errorData } }, 'email_verification');
          setVerificationStatus("error");
          setMessage(errorInfo.message);
        }
      } catch (error) {
        console.error("Email verification error:", error);
        const errorInfo = parseAuthError(error, 'email_verification');
        setVerificationStatus("error");
        setMessage(errorInfo.message);
      }
    };

    verifyEmail();
  }, [token]);

  if (verificationStatus === "verifying") {
    return (
      <AuthLayout>
        <div className="text-center">
          <div className="animate-spin text-blue-400 text-6xl mb-4">⏳</div>
          <h2 className="text-2xl font-bold mb-4 text-blue-400">Verifying Your Email...</h2>
          <p className="text-gray-300">
            Please wait while we verify your email address.
          </p>
        </div>
      </AuthLayout>
    );
  }

  if (verificationStatus === "success") {
    return (
      <AuthLayout>
        <div className="text-center">
          <div className="bg-gray-800 border border-blue-500/30 rounded-lg p-6 mb-6">
            <div className="text-blue-400 text-6xl mb-4">✅</div>
            <h3 className="text-xl font-bold text-blue-400 mb-2">Email Verified Successfully!</h3>
            <p className="text-gray-300 mb-4">
              {message}
            </p>
            <div className="bg-gray-700/50 border border-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-gray-300 text-sm mb-2">
                🎉 <strong className="text-blue-300">Your account is now active!</strong>
              </p>
              <p className="text-gray-300 text-sm">
                You can now log in and start using SpaceThreads.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate("/login")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-200 shadow-lg hover:shadow-blue-500/25"
              >
                Go to Login
              </button>
              <button
                onClick={() => navigate("/")}
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition duration-200"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </AuthLayout>
    );
  }

  if (verificationStatus === "error") {
    return (
      <AuthLayout>
        <div className="text-center">
          <div className="bg-gray-800 border border-red-500/30 rounded-lg p-6 mb-6">
            <div className="text-red-400 text-6xl mb-4">❌</div>
            <h3 className="text-xl font-bold text-red-400 mb-2">Email Verification Failed</h3>
            <p className="text-gray-300 mb-4">
              {message}
            </p>
            <div className="bg-gray-700/50 border border-red-500/20 rounded-lg p-4 mb-4">
              <p className="text-gray-300 text-sm mb-2">
                ⚠️ <strong className="text-red-300">This could happen if:</strong>
              </p>
              <ul className="text-gray-400 text-sm text-left space-y-1">
                <li>• The verification link has expired</li>
                <li>• The link has already been used</li>
                <li>• The link is invalid or corrupted</li>
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-200 text-center"
              >
                Try Registration Again
              </Link>
              <button
                onClick={async () => {
                  const email = prompt("Enter your email to resend verification:");
                  if (email) {
                    try {
                      const response = await fetch("http://localhost:8080/api/v1/auth/resend-verification", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email }),
                      });

                      if (response.ok) {
                        alert("📧 Verification email sent! Check your inbox for the new verification link.");
                      } else {
                        const errorData = await response.json();
                        const errorInfo = parseAuthError({ response: { status: response.status, data: errorData } }, 'resend_verification');
                        alert(errorInfo.message);
                      }
                    } catch (error) {
                      const errorInfo = parseAuthError(error, 'resend_verification');
                      alert(errorInfo.message);
                    }
                  }
                }}
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition duration-200"
              >
                Resend Verification
              </button>
            </div>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return null;
}
