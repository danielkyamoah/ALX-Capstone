import React from "react";
import { NavLink, useLocation } from "react-router-dom";

const MobileNavbar = () => {
  const location = useLocation();

  const navLinkClasses = (path) =>
    `flex flex-col items-center p-2 text-sm font-medium transition-colors duration-200
    ${
      location.pathname === path
        ? "text-blue-400"
        : "text-gray-400 hover:text-white"
    }`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 shadow-lg md:hidden z-50">
      <div className="flex justify-around h-16">
        <NavLink to="/" className={navLinkClasses("/")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mb-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m0 0l-7 7-7-7m7 7v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001 1h3v-3m10 0a1 1 0 01-1 1h-3v-3"
            />
          </svg>
          Home
        </NavLink>
        <NavLink to="/search" className={navLinkClasses("/search")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mb-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          Search
        </NavLink>
      </div>
    </nav>
  );
};

export default MobileNavbar;
