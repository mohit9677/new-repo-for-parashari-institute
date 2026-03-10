import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import HeaderLogo from './HeaderLogo';
import '../styles/Header.css';

const Header = ({ isMobile }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const userName = user?.name || 'User';

    return (
        <header className="main-header">
            <div className="header-inner">
                <div className="header-left">
                    <button
                        className="header-back-btn"
                        onClick={() => navigate(-1)}
                        title="Go Back"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <HeaderLogo size={40} />
                </div>

                <div className="header-right">
                    <div className="user-greeting">
                        <span className="welcome-text">Welcome,</span>
                        <span className="user-name">{userName}</span>
                    </div>

                    <div className="header-actions">
                        <button className="header-icon-btn profile-btn" title="Profile">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        </button>

                        <button className="header-icon-btn logout-btn" onClick={logout} title="Logout">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
