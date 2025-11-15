import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/logo.png"; // transparent logo

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-gray-900/90 backdrop-blur-md border-b border-gray-800 shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Left - logo */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt="SpaceThreads"
            className="h-10 w-auto object-contain"
            style={{ imageRendering: "optimizeQuality" }}
          />
          <span className="text-white font-semibold text-lg tracking-wide">
            SpaceThreads
          </span>
        </Link>

        {/* Center - navigation links */}
        <nav className="hidden md:flex items-center gap-8">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              `text-sm transition ${
                isActive ? "text-white font-medium" : "text-gray-300 hover:text-white"
              }`
            }
          >
            Explore
          </NavLink>

          <NavLink
            to="/community"
            className={({ isActive }) =>
              `text-sm transition ${
                isActive ? "text-white font-medium" : "text-gray-300 hover:text-white"
              }`
            }
          >
            Community
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `text-sm transition ${
                isActive ? "text-white font-medium" : "text-gray-300 hover:text-white"
              }`
            }
          >
            About
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `text-sm transition ${
                isActive ? "text-white font-medium" : "text-gray-300 hover:text-white"
              }`
            }
          >
            Contact
          </NavLink>
        </nav>

        {/* Right - CTA buttons */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm text-gray-300 hover:text-white transition"
          >
            Log In
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 text-sm font-medium rounded-md bg-white text-gray-900 hover:opacity-90 transition"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}

