import React from 'react';
import { Sparkles, Home, BarChart2, BarChart3, Clock, User, BookOpen, PlayCircle, LogOut, Utensils, Brain, DollarSign, Briefcase, MessageSquare, Dumbbell } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getAuthService, setGuestMode } from '../../services/serviceProvider';

function SideBar({ isSidebarOpen }) {
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      const authService = getAuthService();
      await authService.logout();
      setGuestMode(false);
      navigate('/');
    } catch (error) {
      console.log("logout fails :: ", error);
    }
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center px-4 py-2 hover:text-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400 rounded-lg transition-colors duration-300 no-underline ${isActive ? 'text-emerald-700 bg-emerald-100 dark:bg-emerald-900/50 dark:text-emerald-400 font-medium' : 'text-gray-600 dark:text-gray-400'
    }`;

  return (
    <div className={`md:w-64 h-auto md:mr-0 pt-8 bg-gray-100 dark:bg-dark-900 transition-colors ${isSidebarOpen ? 'block' : 'hidden'} md:block border-r border-gray-200 dark:border-gray-800`}>
      <div className="px-6 mb-8 flex items-center gap-3">
        <Sparkles className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
        <span className="font-black text-lg text-gray-800 dark:text-white tracking-tight leading-none">You Got This!</span>
      </div>
      <nav className="flex flex-col space-y-2 pl-4 no-underline">
        <NavLink to="/dashboard" className={navLinkClass}>
          <Home className="mr-3 h-5 w-5" />
          Dashboard
        </NavLink>

        <NavLink to="/visuals" className={navLinkClass}>
          <BarChart3 className="mr-3 h-5 w-5" />
          Visuals
        </NavLink>

        <NavLink to="/profile" className={navLinkClass}>
          <User className="mr-3 h-5 w-5" />
          Profile
        </NavLink>

        <NavLink to="/exercises" className={navLinkClass}>
          <BookOpen className="mr-3 h-5 w-5" />
          Exercises
        </NavLink>

        <NavLink to="/programs" className={navLinkClass}>
          <PlayCircle className="mr-3 h-5 w-5" />
          Programs
        </NavLink>

        <NavLink to="/nutrition" className={navLinkClass}>
          <Utensils className="mr-3 h-5 w-5" />
          Nutrition
        </NavLink>


        <NavLink to="/mindfulness" className={navLinkClass}>
          <Brain className="mr-3 h-5 w-5" />
          Mindfulness
        </NavLink>

        <NavLink to="/financial" className={navLinkClass}>
          <DollarSign className="mr-3 h-5 w-5" />
          Financial
        </NavLink>

        <NavLink to="/intellectual" className={navLinkClass}>
          <BookOpen className="mr-3 h-5 w-5" />
          Intellectual
        </NavLink>

        <NavLink to="/career" className={navLinkClass}>
          <Briefcase className="mr-3 h-5 w-5" />
          Career
        </NavLink>

        <NavLink to="/advisor" className={navLinkClass}>
          <MessageSquare className="mr-3 h-5 w-5" />
          Advisor
        </NavLink>

        <NavLink to="/workout" className={navLinkClass}>
          <Dumbbell className="mr-3 h-5 w-5" />
          Workout
        </NavLink>

        <NavLink to="/history" className={navLinkClass}>
          <Clock className="mr-3 h-5 w-5" />
          History
        </NavLink>

        <button
          onClick={handleLogOut}
          className="flex items-center px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-300 no-underline text-left w-full mt-4"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </button>
      </nav>
    </div>
  );
}

export default SideBar;