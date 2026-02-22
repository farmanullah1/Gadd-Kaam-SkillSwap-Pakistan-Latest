// src/components/admin/AdminLayout.js
import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import '../../styles/admin.css';
import { LayoutDashboard, Users, Briefcase, Flag, LogOut } from 'lucide-react';
import Navbar from '../Navbar'; // Import the main Navbar


const AdminLayout = () => {
  const navigate = useNavigate();
  // Get user from local storage to pass to Navbar
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <>
      {/* 1. Use the Main Site Navbar */}
      <Navbar onLogout={handleLogout} user={user} />

      <div className="admin-layout">
        {/* 2. Admin Sidebar (Left) */}
        <aside className="admin-sidebar">
          <div className="admin-brand">
            <h2>Admin Panel</h2>
          </div>

          <nav className="admin-nav">
            <NavLink to="/admin" className={({isActive}) => isActive ? 'active' : ''} end>
               <LayoutDashboard size={22} /> <span>Overview</span>
            </NavLink>
            <NavLink to="/admin/users" className={({isActive}) => isActive ? 'active' : ''}>
               <Users size={22} /> <span>Manage Users</span>
            </NavLink>
            <NavLink to="/admin/skills" className={({isActive}) => isActive ? 'active' : ''}>
               <Briefcase size={22} /> <span>Manage Skills</span>
            </NavLink>
            <NavLink to="/admin/reports" className={({isActive}) => isActive ? 'active' : ''}>
               <Flag size={22} /> <span>Manage Reports</span>
            </NavLink>
          </nav>

          <div className="admin-sidebar-bottom">
            <button className="btn-logout" onClick={handleLogout}>
              <LogOut size={20} /> <span>Log out</span>
            </button>
          </div>
        </aside>

        {/* 3. Main Content Area */}
        <main className="admin-content">
          <section className="admin-main">
            <Outlet />
          </section>
        </main>
      </div>
    </>
  );
};

export default AdminLayout;