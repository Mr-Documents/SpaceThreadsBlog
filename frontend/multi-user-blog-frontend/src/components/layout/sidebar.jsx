import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar({ user }) {
  return (
    <aside className="hidden lg:block w-72 sticky top-16 h-[calc(100vh-4rem)] overflow-auto pr-6">
      <div className="bg-gray-900 border border-gray-800 rounded-md p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-12 w-12 rounded-full bg-gray-700 flex items-center justify-center text-white text-lg">A</div>
          <div>
            <div className="text-sm font-semibold text-gray-100">Welcome{user?.name ? `, ${user.name}` : ""}</div>
            <div className="text-xs text-gray-400">Share stories. Build followers.</div>
          </div>
        </div>

        <Link to="/write" className="block w-full text-center py-2 bg-white text-gray-900 rounded-md font-semibold mb-4">Write a Post</Link>

        <div className="mb-4">
          <h4 className="text-xs text-gray-400 uppercase tracking-wide mb-2">Trending</h4>
          <ul className="flex flex-col gap-2">
            <li className="text-sm text-gray-200 hover:text-white">Design tokens in 2025</li>
            <li className="text-sm text-gray-200 hover:text-white">Rust for web servers</li>
            <li className="text-sm text-gray-200 hover:text-white">AI writing tips</li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs text-gray-400 uppercase tracking-wide mb-2">Popular tags</h4>
          <div className="flex flex-wrap gap-2">
            {["design","web","product","life","ai"].map(t => (
              <Link key={t} to={`/tag/${t}`} className="text-xs px-2 py-1 rounded bg-gray-800 text-gray-300 hover:bg-gray-700">#{t}</Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
