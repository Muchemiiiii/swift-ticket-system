import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Ticket, Shield, Home, BarChart3, Settings, Users, FileText } from 'lucide-react';

const ADMIN_NAV = [
  { to: '/admin', label: 'Dashboard', icon: <BarChart3 className="w-4 h-4" />, end: true },
  { to: '/admin/tickets', label: 'Tickets', icon: <FileText className="w-4 h-4" /> },
  { to: '/admin/users', label: 'Users', icon: <Users className="w-4 h-4" /> },
  { to: '/admin/reports', label: 'Reports', icon: <BarChart3 className="w-4 h-4" /> },
  { to: '/admin/settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
];

export const AdminLayout = () => {
  const location = useLocation();

  const isActive = (path, end = false) => {
    if (end) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-2">
                <div className="bg-gray-900 dark:bg-white p-2 rounded-lg">
                  <Ticket className="w-5 h-5 text-white dark:text-gray-900" />
                </div>
                <span className="font-bold text-xl text-gray-900 dark:text-white tracking-tight">Swift</span>
              </Link>
              <span className="text-gray-300 dark:text-gray-700">|</span>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Admin</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/">
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <Home className="w-4 h-4" />
                  User View
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 min-h-[calc(100vh-64px)]">
          <nav className="p-4 space-y-1">
            {ADMIN_NAV.map(item => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.to, item.end)
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
