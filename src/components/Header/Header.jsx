import React from "react";
import { Dumbbell, Menu, X, UserRound, Sun, Moon } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

function Header({ isSidebarOpen, toggleSidebar }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="bg-emerald-600 dark:bg-dark-900 text-white shadow-lg transition-colors">
      <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="absolute right-0 mr-2 md:hidden hover:text-emerald-200 transition-colors"
          >
            {isSidebarOpen ? (
              <X className="mr-1.5" size={24} />
            ) : (
              <Menu className="mr-1.5" size={24} />
            )}
          </button>
          <div className="p-1.5 bg-white/20 rounded-lg mr-2">
            <Dumbbell className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold">Fitness World</h1>
        </div>

        <nav className="flex items-center space-x-4">


          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-yellow-300" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          {/* Profile Link */}
          <Link to="/userprofile" className="hidden md:block">
            <div className="bg-emerald-100 dark:bg-emerald-900 rounded-full p-2 hover:bg-emerald-200 dark:hover:bg-emerald-800 transition-colors">
              <UserRound className="w-6 h-6 text-emerald-700 dark:text-emerald-300" />
            </div>
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
