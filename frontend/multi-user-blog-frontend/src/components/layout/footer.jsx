import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

export default function Footer() {
  const location = useLocation();
  const isDark = location.pathname === "/register";

  return (
    <footer
      className={`w-full border-t transition-colors duration-700 ${
        isDark
          ? "bg-gray-900 border-gray-800 text-gray-300"
          : "bg-gray-800 border-gray-800 text-gray-300"
      }`}
    >
      <div className="container mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/*The Branding */}
        <div>
          <h2
            className={`text-2xl font-bold mb-3 ${
              isDark ? "text-white" : "text-white"
            }`}
          >
            <i>SpaceThreads</i>
          </h2>
          <p className="text-sm leading-relaxed">
            A multi-user blogging platform for writers, creators, and readers.
            Share your stories, connect with others, and grow your voice.
          </p>
        </div>

        {/* Resource*/}
        <div>
          <h3
            className={`text-lg font-semibold mb-3 ${
              isDark ? "text-white" : "text-white"
            }`}
          >
            Resources
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                to="/about"
                className="hover:underline hover:text-primary transition-colors"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="/blog"
                className="hover:underline hover:text-primary transition-colors"
              >
                Blog
              </Link>
            </li>
            <li>
              <Link
                to="/authors"
                className="hover:underline hover:text-primary transition-colors"
              >
                Authors
              </Link>
            </li>
          </ul>
        </div>

        {/*Support*/}
        <div>
          <h3
            className={`text-lg font-semibold mb-3 ${
              isDark ? "text-white" : "white"
            }`}
          >
            Support
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                to="/contact"
                className="hover:underline hover:text-primary transition-colors"
              >
                Contact Us
              </Link>
            </li>
            <li>
              <Link
                to="/privacy"
                className="hover:underline hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                to="/terms"
                className="hover:underline hover:text-primary transition-colors"
              >
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>

        {/*Follow Us*/}
        <div>
          <h3
            className={`text-lg font-semibold mb-3 ${
              isDark ? "text-white" : "text-white"
            }`}
          >
            Follow Us
          </h3>
          <div className="flex gap-4">
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-full border transition-all ${
                isDark
                  ? "border-gray-700 hover:bg-gray-800 hover:text-white"
                  : "border-gray-300 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <FaGithub size={18} />
            </a>
            <a
              href="https://linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-full border transition-all ${
                isDark
                  ? "border-gray-700 hover:bg-gray-800 hover:text-white"
                  : "border-gray-300 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <FaLinkedin size={18} />
            </a>
            <a
              href="https://twitter.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-full border transition-all ${
                isDark
                  ? "border-gray-700 hover:bg-gray-800 hover:text-white"
                  : "border-gray-300 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <FaTwitter size={18} />
            </a>
          </div>
        </div>
      </div>

      {/*Bottom Bar*/}
      <div
        className={`border-t text-sm text-center py-4 ${
          isDark ? "border-gray-800 text-gray-500" : "border-gray-200 text-gray-500"
        }`}
      >
        © {new Date().getFullYear()} <span className="font-medium">Blogify</span>. All rights reserved.
      </div>
    </footer>
  );
}
