import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        <div className="content">
          <Outlet />
        </div>
      </div>
      {/* Sol alt menü */}
      <div className="bottom-left-menu">
        <button onClick={handleLogout}>Çıkış</button>
      </div>
    </div>
  );
};

function handleLogout() {
}

export default Layout; 