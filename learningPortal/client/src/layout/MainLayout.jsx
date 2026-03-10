import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/MainLayout.css';

const MainLayout = ({ children }) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const location = useLocation();

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    // Determine if we should show the footer on mobile based on the current page
    // Specifically for "About Us" as requested: "implement footer in about us section"
    const isAboutUsPage = location.pathname === '/about-us';
    const showFooter = !isMobile || isAboutUsPage;

    return (
        <div className="portal-layout">
            <div className="portal-body">
                {!isMobile && (
                    <Sidebar
                        isCollapsed={isSidebarCollapsed}
                        onToggle={toggleSidebar}
                    />
                )}

                <main className={`main-content ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                    <Header isMobile={isMobile} />
                    <div className="page-wrapper">
                        {children}
                    </div>
                </main>
            </div>

            {showFooter && (
                <div className="portal-footer-wrapper">
                    <Footer forceShow={isAboutUsPage && isMobile} />
                </div>
            )}
            {isMobile && <BottomNav />}
        </div>
    );
};

export default MainLayout;
