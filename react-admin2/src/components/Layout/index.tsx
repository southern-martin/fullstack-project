import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
    const [loaded, setLoaded] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [sidebarToggle, setSidebarToggle] = useState(false);

    useEffect(() => {
        // Load dark mode from localStorage
        const savedDarkMode = localStorage.getItem('darkMode');
        if (savedDarkMode) {
            setDarkMode(JSON.parse(savedDarkMode));
        }

        // Hide preloader after 500ms
        const timer = setTimeout(() => {
            setLoaded(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // Save dark mode to localStorage
        localStorage.setItem('darkMode', JSON.stringify(darkMode));

        // Toggle dark class on document
        if (darkMode) {
            document.documentElement.classList.add('dark');
            document.body.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
            document.body.classList.remove('dark');
        }
    }, [darkMode]);

    return (
        <div className={`flex h-screen overflow-hidden ${darkMode ? 'dark bg-gray-900' : ''}`}>
            {/* Preloader */}
            {loaded && (
                <div className="fixed left-0 top-0 z-999999 flex h-screen w-screen items-center justify-center bg-white dark:bg-black">
                    <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-brand-500 border-t-transparent"></div>
                </div>
            )}

            {/* Sidebar */}
            <Sidebar
                sidebarToggle={sidebarToggle}
                setSidebarToggle={setSidebarToggle}
            />

            {/* Main Content */}
            <div className="relative flex flex-1 flex-col overflow-hidden">
                {/* Header */}
                <Header
                    darkMode={darkMode}
                    setDarkMode={setDarkMode}
                    sidebarToggle={sidebarToggle}
                    setSidebarToggle={setSidebarToggle}
                />

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto">
                    <div className="p-4 mx-auto max-w-screen-2xl md:p-6">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;