import React from "react";
import { Sun as SunIcon, Menu, X, UserRound, Sun, Moon } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

function Header({ isSidebarOpen, toggleSidebar }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className={`${isDark ? 'bg-dark-900' : 'shimmer-gradient'} text-white shadow-lg transition-colors`}>
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
            <SunIcon className="h-7 w-7 text-yellow-300 animate-throb" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
            <h1 className="text-2xl font-bold">You Got This!</h1>
            <span className="text-xs sm:text-sm text-white/70 hidden sm:inline">An Optimal Life</span>
          </div>
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
            <div className="bg-white/20 dark:bg-emerald-900 rounded-full p-2 hover:bg-white/30 dark:hover:bg-emerald-800 transition-colors">
              <UserRound className="w-6 h-6 text-white dark:text-emerald-300" />
            </div>
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
