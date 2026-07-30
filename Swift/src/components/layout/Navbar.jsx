import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Ticket, FileText, BookOpen, Settings, LogOut, ChevronDown } from 'lucide-react';

export const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!currentUser) return null;

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleColor = {
    user:    'bg-blue-100 text-blue-700',
    support: 'bg-purple-100 text-purple-700',
    manager: 'bg-emerald-100 text-emerald-700',
  };

  const roleLabel = {
    user:    'End User',
    support: 'IT Support',
    manager: 'Manager',
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo + nav links */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Ticket className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">Swift</span>
            </Link>

            <div className="hidden md:flex space-x-1">
              {currentUser.role === 'user' && (
                <>
                  <NavLink to="/" active={isActive('/')} icon={<Ticket className="w-4 h-4" />}>My Tickets</NavLink>
                  <NavLink to="/create" active={isActive('/create')} icon={<FileText className="w-4 h-4" />}>New Ticket</NavLink>
                </>
              )}
              {currentUser.role === 'support' && (
                <NavLink to="/" active={isActive('/')} icon={<Ticket className="w-4 h-4" />}>Ticket Queue</NavLink>
              )}
              {currentUser.role === 'manager' && (
                <NavLink to="/" active={isActive('/')} icon={<Settings className="w-4 h-4" />}>Reports</NavLink>
              )}
              <NavLink to="/kb" active={isActive('/kb')} icon={<BookOpen className="w-4 h-4" />}>Knowledge Base</NavLink>
            </div>
          </div>

          {/* User menu */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                id="navbar-user-menu"
                onClick={() => setMenuOpen(v => !v)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center select-none">
                  {currentUser.avatar || currentUser.name?.slice(0, 2).toUpperCase()}
                </div>

                <div className="hidden sm:flex flex-col items-start leading-tight">
                  <span className="text-sm font-medium text-gray-900">{currentUser.name}</span>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${roleColor[currentUser.role]}`}>
                    {roleLabel[currentUser.role]}
                  </span>
                </div>

                <ChevronDown size={16} className={`text-gray-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown */}
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20">
                    <div className="px-4 py-2.5 border-b border-gray-100">
                      <p className="text-xs text-gray-500">Signed in as</p>
                      <p className="text-sm font-medium text-gray-900 truncate">{currentUser.email}</p>
                    </div>
                    <button
                      id="navbar-logout-btn"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={15} />
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, active, icon, children }) => (
  <Link
    to={to}
    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      active
        ? 'bg-blue-50 text-blue-700'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`}
  >
    {icon}
    {children}
  </Link>
);
