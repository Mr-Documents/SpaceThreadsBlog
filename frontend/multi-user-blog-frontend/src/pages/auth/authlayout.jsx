import { motion } from "framer-motion";
import { Link, useLocation, Outlet } from "react-router-dom";

export default function AuthLayout({ children }) {
  const location = useLocation();
  const isLogin = location.pathname === "/login";

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.4 }}
      className={`min-h-screen flex flex-col justify-between transition-colors duration-500 ${
        isLogin
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black"
          : "bg-gradient-to-br from-gray-900 via-gray-800 to-black"
      }`}
    >
      {/* Main content area */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-20">
        <div
          className={`rounded-2xl shadow-2xl w-[350px] p-8 mb-12 md:mb-16 transition-colors duration-500 ${
            isLogin
              ? "bg-gradient-to-r from-gray-700 to-gray-900 text-gray-300"
              : "bg-gradient-to-r from-gray-900 to-gray-700 text-white"
          }`}
        >
          {children}

          <div className="mt-6 text-center text-sm">
            {isLogin ? (
              <p className="text-gray-300 dark:text-gray-400">
                Don’t have an account?{" "}
                <Link
                  to="/register"
                  className="text-primary font-semibold hover:underline"
                >
                  Sign up
                </Link>
              </p>
            ) : (
              <p className="text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary font-semibold hover:underline"
                >
                  Log in
                </Link>
              </p>
            )}
          </div>
        </div>

        {/* Nested route content */}
        <Outlet />
      </main>

      {/* Footer fixed at the bottom */}
     
    </motion.div>
  );
}









