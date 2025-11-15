import React from "react";

export default function Community() {
  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">The SpaceThreads Community</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Our community is the heart of everything — where readers become collaborators, and
            creators become friends. Engage in meaningful discussions, share insights, and grow
            together.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-800 rounded-2xl p-8 shadow-md hover:shadow-xl transition">
            <h2 className="text-2xl font-semibold mb-3">💬 Forums & Discussions</h2>
            <p className="text-gray-400 text-sm">
              Join active conversations on technology, design, writing, and the future of digital
              creativity.
            </p>
          </div>

          <div className="bg-gray-800 rounded-2xl p-8 shadow-md hover:shadow-xl transition">
            <h2 className="text-2xl font-semibold mb-3">👩‍🚀 Creator Spotlight</h2>
            <p className="text-gray-400 text-sm">
              We highlight inspiring writers, developers, and artists who make the SpaceThreads
              galaxy shine.
            </p>
          </div>

          <div className="bg-gray-800 rounded-2xl p-8 shadow-md hover:shadow-xl transition">
            <h2 className="text-2xl font-semibold mb-3">🪙 Reward System</h2>
            <p className="text-gray-400 text-sm">
              Earn recognition, badges, and rewards for meaningful contributions, collaborations,
              and mentorship.
            </p>
          </div>
        </div>

        <div className="mt-20 text-center">
          <h3 className="text-2xl font-semibold mb-4">Ready to Join the Galaxy?</h3>
          <p className="text-gray-400 mb-6">
            Connect with thousands of creators shaping the future of open publishing.
          </p>
          <a
            href="/register"
            className="inline-block px-6 py-3 bg-white text-gray-900 font-medium rounded-md hover:opacity-90 transition"
          >
            Join the Community
          </a>
        </div>
      </div>
    </div>
  );
}
