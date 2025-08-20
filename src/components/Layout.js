import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        setIsMenuOpen(false);
        navigate('/login');
    };

    return (
        <div className="app-container">
            <Navbar
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
                handleLogout={handleLogout}
            />

            <div className={`main-content ${isMenuOpen ? 'menu-open' : ''}`}>
                <div className="content">
                    <Outlet />
                </div>
            </div>

            <div className="bottom-left-menu">
                <button onClick={handleLogout}>Çıkış</button>
            </div>
        </div>
    );
};

export default Layout;
