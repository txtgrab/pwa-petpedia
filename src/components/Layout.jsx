import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import BottomNav from './BottomNav';

const Layout = () => {
  return (
    <>
      {}
      <Navbar />

      {}
      <main className="app-container">
        {}
        <Outlet />
      </main>

      {}
      <BottomNav />
    </>
  );
};

export default Layout;