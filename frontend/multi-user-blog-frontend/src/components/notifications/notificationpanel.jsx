import React from "react";

export default function NotificationsPanel({ onClose }) {
  return (
    <div
      role="dialog"
      aria-label="Notifications"
      className="absolute right-4 top-14 w-80 bg-gray-900 border border-gray-800 rounded-md shadow-lg text-gray-100 overflow-hidden z-50"
    >
      <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
        <strong className="text-sm">Notifications</strong>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-200">Close</button>
      </div>
      <ul className="max-h-64 overflow-y-auto">
        <li className="px-4 py-3 hover:bg-gray-800 transition">
          <div className="text-xs text-gray-300">New comment on your post</div>
          <div className="text-sm">“Great deck on dark mode!” — Ava</div>
          <div className="text-xs text-gray-500 mt-1">2h ago</div>
        </li>
        <li className="px-4 py-3 hover:bg-gray-800 transition">
          <div className="text-xs text-gray-300">New follower</div>
          <div className="text-sm">Kai started following you</div>
          <div className="text-xs text-gray-500 mt-1">1d ago</div>
        </li>
        <li className="px-4 py-3 hover:bg-gray-800 transition">
          <div className="text-xs text-gray-300">Post approved</div>
          <div className="text-sm">Your draft “Designing for Dark” was published</div>
          <div className="text-xs text-gray-500 mt-1">3d ago</div>
        </li>
      </ul>
      <div className="px-4 py-2 border-t border-gray-800 text-center text-sm text-gray-400">
        View all
      </div>
    </div>
  );
}
