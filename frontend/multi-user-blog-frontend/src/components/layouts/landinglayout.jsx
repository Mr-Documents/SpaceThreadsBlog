import React from "react";
import LandingNavbar from "../components/layout/landingnavbar";
import { Outlet } from "react-router-dom";

export default function LandingLayout() {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <LandingNavbar />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
}
