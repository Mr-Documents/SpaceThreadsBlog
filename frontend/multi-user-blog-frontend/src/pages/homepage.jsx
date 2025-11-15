import React, { useContext } from "react";
import Sidebar from "../components/layout/sidebar";
import Feed from "../components/posts/feedstab";
import FloatingWriteButton from "../components/layout/floatingwritebutton";
import { AuthContext } from "../context/AuthContext";

export default function Homepage() {
  const { user } = useContext(AuthContext);

  return (
    <div className="pt-14 bg-gray-900 min-h-screen text-gray-100">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] gap-8 py-8">
          <main>
            <div className="mb-6">
              <h1 className="text-3xl font-semibold text-white">For you</h1>
              <p className="text-sm text-gray-400 mt-1">Personalized articles and updates from people you follow.</p>
            </div>

            <Feed />
          </main>

          <Sidebar user={user} />
        </div>
      </div>

      <FloatingWriteButton />
    </div>
  );
}
