import React from "react";
import { Link } from "react-router-dom";

export default function FloatingWriteButton() {
  return (
    <div className="fixed right-6 bottom-6 z-40 group">
      <Link
        to="/posts/create"
        className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 transform group-hover:gap-4"
        aria-label="Create new post"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
        </svg>
        <span className="font-semibold text-sm">Create Post</span>
      </Link>
      
      {/* Tooltip on hover */}
      <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
          Write a new blog post
        </div>
      </div>
    </div>
  );
}
