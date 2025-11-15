import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useContext } from "react";

import { AuthProvider, AuthContext } from "./context/AuthContext";

// Layouts
import LandingNavbar from "./components/layout/landingnavbar";
import HomeNavbar from "./components/layout/navbar"; // renamed as HomeNavbar for clarity
import Footer from "./components/layout/footer";

// Pages

import Home from "./pages/home";
import Homepage from "./pages/homepage";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import Dashboard from "./pages/dashboard";
import Profile from "./pages/profile";
import About from "./pages/about";
import Contact from "./pages/contact";
import Community from "./pages/community";
import ForgotPassword from "./pages/auth/forgotpassword";
import ResetPassword from "./pages/auth/resetpassword";
import EmailVerification from "./pages/auth/emailverification";
import ChangePassword from "./pages/auth/changepassword";
import CreatePost from "./pages/posts/CreatePost";
import EditPost from "./pages/posts/EditPost";
import PostDetail from "./pages/posts/PostDetail";

function AnimatedRoutes() {
  const location = useLocation();
  const { user } = useContext(AuthContext);

  // Determine which navbar to show
  const isLandingRoute = ["/", "/login", "/register", "/about", "/contact", "/community", "/forgot-password", "/reset-password", "/verify-email"].includes(location.pathname);

  return (
    <>
      {/* The Navbar Switches */}
      {isLandingRoute ? <LandingNavbar /> : <HomeNavbar />}

      {/* The Page Transitions */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* The Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/community" element={<Community />} /> 

          {/* Authentication Routes */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<EmailVerification />} />

          {/* The Protected Routes */}
          <Route path="/home" element={<Homepage />} />
          <Route path="/explore" element={<Homepage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/change-password" element={<ChangePassword />} />

          {/* Post Routes */}
          <Route path="/posts/create" element={<CreatePost />} />
          <Route path="/posts/edit/:id" element={<EditPost />} />
          <Route path="/posts/:id" element={<PostDetail />} />

        </Routes>
      </AnimatePresence>

      {/* General Footer, works everywhere */}
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-900 text-white">
          <main className="flex-1">
            <AnimatedRoutes />
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}
