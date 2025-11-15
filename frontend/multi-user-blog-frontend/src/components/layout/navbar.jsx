import React, { useContext, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import NotificationsPanel from "../notifications/notificationpanel";
import logo from "../../assets/logo.png"; // put transparent logo here

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setOpenUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 h-14">
        {/* left: logo */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt="SpaceThreads"
            className="h-15  w-15 "
            style={{ imageRendering: "optimizeQuality" }}
          />
        </Link>

        {/* center: search (large screens) */}
        <div className="hidden md:flex flex-1 justify-center px-4">
          <div className="w-full max-w-xl">
            <label htmlFor="search" className="sr-only">Search posts authors tags</label>
            <div className="relative">
              <input
                id="search"
                type="search"
                placeholder="Search posts, authors, tags..."
                className="w-full bg-gray-800 text-gray-100 placeholder-gray-400 rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
              <svg className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" viewBox="0 0 24 24" fill="none">
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.6"/>
              </svg>
            </div>
          </div>
        </div>

        {/* right: links */}
        <nav className="flex items-center gap-3">
          <Link to="/home" className="hidden sm:inline text-sm text-gray-300 hover:text-white transition">Home</Link>
          
          {user && (
            <Link 
              to="/posts/create" 
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-lg"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
              <span>Create Post</span>
            </Link>
          )}

          <button
            aria-label="Notifications"
            onClick={() => setOpenNotifications((s) => !s)}
            className="relative p-2 rounded-md hover:bg-gray-800 active:scale-95 transition"
          >
            <svg className="w-5 h-5 text-gray-300" viewBox="0 0 24 24" fill="none">
              <path stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5" />
              <path stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center text-xs px-1.5 py-[1px] rounded-full bg-red-500 text-white">3</span>
          </button>

          {openNotifications && <NotificationsPanel onClose={() => setOpenNotifications(false)} />}

          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setOpenUserMenu(!openUserMenu)}
                className="flex items-center gap-2 p-1 rounded-md hover:bg-gray-800 transition"
              >
                <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-sm">{user.name?.[0] || "U"}</div>
                <span className="hidden md:inline text-sm text-gray-200">{user.name}</span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {openUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                  <div className="py-1">
                    <Link
                      to="/posts/create"
                      className="md:hidden block px-4 py-2 text-sm text-blue-400 hover:bg-gray-700 transition font-medium"
                      onClick={() => setOpenUserMenu(false)}
                    >
                      ✍️ Create Post
                    </Link>
                    <hr className="border-gray-700 my-1 md:hidden" />
                    <Link
                      to={`/profile/${user.username}`}
                      className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition"
                      onClick={() => setOpenUserMenu(false)}
                    >
                      👤 View Profile
                    </Link>
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition"
                      onClick={() => setOpenUserMenu(false)}
                    >
                      📊 Dashboard
                    </Link>
                    <hr className="border-gray-700 my-1" />
                    <Link
                      to="/change-password"
                      className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition"
                      onClick={() => setOpenUserMenu(false)}
                    >
                      🔐 Change Password
                    </Link>
                    <hr className="border-gray-700 my-1" />
                    <button
                      onClick={() => {
                        logout();
                        setOpenUserMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition"
                    >
                      🚪 Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-3 py-1 text-sm rounded-md text-gray-200 hover:bg-gray-800 transition">Login</Link>
              <Link to="/register" className="px-3 py-1 bg-white text-gray-900 rounded-md text-sm font-medium hover:opacity-95 transition">Get Started</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
