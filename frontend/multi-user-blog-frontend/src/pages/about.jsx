import React from "react";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-6 py-20">
      <div className="max-w-4xl text-center space-y-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white">About SpaceThreads</h1>
        <p className="text-gray-300 text-lg leading-relaxed">
          SpaceThreads is a modern multi-user blogging universe — where creativity, technology, and
          community collide. Designed for writers, developers, and storytellers, our platform
          empowers voices across galaxies to connect, inspire, and share ideas freely.
        </p>

        <div className="grid md:grid-cols-3 gap-6 pt-10">
          <div className="bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-3">🌌 Our Mission</h2>
            <p className="text-gray-400 text-sm">
              To create a space where authentic voices thrive through quality content and meaningful
              interactions — without noise or distraction.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-3">🚀 Our Vision</h2>
            <p className="text-gray-400 text-sm">
              Building a global network for creative thinkers — writers, coders, designers, and
              dreamers — to collaborate and grow together.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-3">🪐 Our Values</h2>
            <p className="text-gray-400 text-sm">
              Creativity, openness, community, and impact — we believe in content that enlightens,
              not just entertains.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
