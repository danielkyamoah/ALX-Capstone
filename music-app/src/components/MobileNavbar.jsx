import React from "react";
import { NavLink, useLocation } from "react-router-dom";

const MobileNavbar = () => {
  const location = useLocation();

  const navLinkClasses = (path) =>
    `flex items-center justify-center p-3 transition-colors duration-200
    ${
      location.pathname === path
        ? "text-[#6773D2]"
        : "text-gray-400 hover:text-white"
    }`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#FF9FB2] shadow-lg md:hidden z-50">
      <div className="flex justify-around h-16">
        <NavLink to="/" className={navLinkClasses("/")} aria-label="Home">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
            />
          </svg>
        </NavLink>
        <NavLink
          to="/search"
          className={navLinkClasses("/search")}
          aria-label="Search"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
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
        </NavLink>
      </div>
    </nav>
  );
};

export default MobileNavbar;
