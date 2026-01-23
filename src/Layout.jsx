import React, { useState, useEffect } from 'react';
import { Header, Footer, SideBar } from './components/index';
import { Outlet, useNavigate } from 'react-router-dom';
import { getAuthService, getServiceMode } from './services/serviceProvider';
import localStorageService from './services/localStorageService';
import { STORAGE_KEYS } from './services/localStorageService';
import { Loader } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';

function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const authService = getAuthService();
        const mode = getServiceMode();

        const currentPath = window.location.pathname;
        const isProfilePage = currentPath.includes("/profile") || currentPath.includes("/userprofile");

        const userData = await authService.getCurrentUser();
        if (userData) {
          setIsLogin(userData);
          // Check for onboarding
          const onboardingDone = localStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE) === 'true';
          if (!onboardingDone && !isProfilePage) {
            navigate("/onboarding");
          }
        } else if (mode === 'local') {
          // In guest mode without a user, still allow access
          setIsLogin({ name: 'Guest', $id: 'guest' });
          const onboardingDone = localStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE) === 'true';
          if (!onboardingDone && !isProfilePage) {
            navigate("/onboarding");
          }
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.log(error);
        // Check if in guest mode before redirecting
        const mode = getServiceMode();
        if (mode === 'local') {
          setIsLogin({ name: 'Guest', $id: 'guest' });
        } else {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [navigate]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  if (loading) {
    return (
      <div className="flex justify-center items-center bg-gray-100 dark:bg-dark-900 transition-colors" style={{ height: '100vh' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return isLogin ? (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-dark-900 transition-colors">
      <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="md:flex bg-gray-100 dark:bg-dark-900 md:pr-5 flex-grow transition-colors">
        <SideBar isSidebarOpen={isSidebarOpen} />
        <main className="flex-grow">
          <div className="md:flex-1">
            <Outlet />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  ) : null;
}

export default Layout;

