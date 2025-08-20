import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import '../styles/layout.css';
import '../styles/navbar.css';

const DESKTOP_BP = 992;

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth >= DESKTOP_BP;
        }
        return false;
    });

    const toggleMenu = () => setIsMenuOpen(v => !v);

    const handleLogout = () => {
        setIsMenuOpen(false);
        navigate('/login');
    };

    useEffect(() => {
        if (window.innerWidth < DESKTOP_BP) {
            setIsMenuOpen(false);
        }
    }, [location.pathname]);

    useEffect(() => {
        const container = document.querySelector('.app-container');
        if (!container) return;
        container.classList.toggle('nav-open', isMenuOpen);
    }, [isMenuOpen]);

    // Ekran boyutu değişince: desktop'a geçince aç, mobile geçince kapa
    useEffect(() => {
        const onResize = () => {
            const shouldOpen = window.innerWidth >= DESKTOP_BP;
            setIsMenuOpen(prev => (shouldOpen ? true : false));
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    return (
        <nav className="navbar" role="navigation" aria-label="Ana menü">
            <button
                className="menu-toggle"
                onClick={toggleMenu}
                aria-label="Menüyü Aç/Kapat"
                aria-expanded={isMenuOpen}
                aria-controls="side-nav"
                type="button"
            >
                <i className="fas fa-bars" aria-hidden="true" />
            </button>

            <div id="side-nav" className={`nav-left ${isMenuOpen ? 'active' : ''}`}>
                <NavLink to="/campaigns" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                    <i className="fas fa-bullhorn" aria-hidden="true" /> Kampanyalar
                </NavLink>

                <NavLink to="/scheduled-tasks" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                    <i className="fas fa-clock" aria-hidden="true" /> Zamanlı İşlemler
                </NavLink>

                <NavLink to="/bundle-messages" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                    <i className="fas fa-box" aria-hidden="true" /> Bundle Metinleri
                </NavLink>

                <NavLink to="/screen-messages" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                    <i className="fas fa-tv" aria-hidden="true" /> Ekran Metinleri
                </NavLink>

                <NavLink to="/preferences" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                    <i className="fas fa-sliders-h" aria-hidden="true" /> Tercihler
                </NavLink>

                <button onClick={handleLogout} className="logout-button" type="button">
                    <i className="fas fa-sign-out-alt" aria-hidden="true" /> Çıkış
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
