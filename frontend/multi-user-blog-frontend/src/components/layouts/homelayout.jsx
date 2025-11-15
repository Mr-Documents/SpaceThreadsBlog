import React from "react";
import HomeNavbar from "../components/layout/navbar";
import { Outlet } from "react-router-dom";

export default function HomeLayout() {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <HomeNavbar />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
}
