import React from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
          <Link 
            to="/posts/create"
            className="mt-4 sm:mt-0 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold px-5 py-2.5 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
            Create New Post
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-700">
            <p className="text-gray-400 text-sm">Total Posts</p>
            <h2 className="text-2xl font-semibold mt-1">18</h2>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-700">
            <p className="text-gray-400 text-sm">Followers</p>
            <h2 className="text-2xl font-semibold mt-1">1,254</h2>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-700">
            <p className="text-gray-400 text-sm">Avg. Views</p>
            <h2 className="text-2xl font-semibold mt-1">3.2K</h2>
          </div>
        </div>

        {/* Recent Posts Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Recent Posts</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((post) => (
              <div
                key={post}
                className="bg-gray-800 hover:bg-gray-750 border border-gray-700 rounded-lg p-5 transition"
              >
                <h3 className="text-lg font-medium">Post Title {post}</h3>
                <p className="text-gray-400 text-sm mt-1">
                  A short description of the post goes here. Well-written intro
                  to entice the reader.
                </p>
                <div className="mt-3 text-sm text-gray-500 flex justify-between items-center">
                  <span>Published: Oct 10, 2025</span>
                  <button className="text-white bg-gray-700 px-3 py-1 rounded hover:bg-gray-600 transition">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}


