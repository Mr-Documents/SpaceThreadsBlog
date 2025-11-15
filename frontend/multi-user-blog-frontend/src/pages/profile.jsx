import React from "react";
import { useParams } from "react-router-dom";

export default function Profile() {
  const { username } = useParams();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Cover Section */}
      <div className="relative h-48 bg-gradient-to-r from-gray-800 to-gray-700">
        <div className="absolute bottom-0 left-0 right-0 px-6 sm:px-10 pb-4 flex items-end gap-4">
          <img
            src={`https://api.dicebear.com/9.x/initials/svg?seed=${username}`}
            alt={username}
            className="h-24 w-24 rounded-full border-4 border-gray-900 shadow-lg"
          />
          <div>
            <h1 className="text-2xl font-semibold">{username}</h1>
            <p className="text-gray-400 text-sm">@{username}</p>
          </div>
        </div>
      </div>

      {/* Bio + Stats */}
      <div className="max-w-5xl mx-auto px-6 sm:px-10 py-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-800 pb-6">
          <p className="max-w-2xl text-gray-300">
            Passionate writer and creative storyteller. I share insights about
            design, tech, and creativity every week.
          </p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <button className="bg-white text-gray-900 px-4 py-2 rounded-md font-medium hover:bg-gray-200 transition">
              Follow
            </button>
            <button className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition">
              Message
            </button>
          </div>
        </div>

        {/* User’s Posts */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Posts by {username}</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((p) => (
              <div
                key={p}
                className="bg-gray-800 border border-gray-700 rounded-lg p-5 hover:bg-gray-750 transition"
              >
                <h3 className="text-lg font-medium">Exploring Post {p}</h3>
                <p className="text-gray-400 text-sm mt-1">
                  A short summary of the article goes here. Captivating and
                  concise.
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
