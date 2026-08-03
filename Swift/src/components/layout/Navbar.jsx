import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Ticket, FileText, BookOpen, Settings, Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { dark, toggle } = useTheme();
  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: '/', label: 'Home', icon: <Ticket className="w-4 h-4" /> },
    { to: '/create', label: 'Report Issue', icon: <FileText className="w-4 h-4" /> },
    { to: '/status', label: 'Ticket Status', icon: <Settings className="w-4 h-4" /> },
    { to: '/kb', label: 'Resolution Details', icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm dark:shadow-gray-700/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Ticket className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white tracking-tight">Swift</span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(link.to)
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggle}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
              aria-label="Toggle theme"
            >
              {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggle}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
              aria-label="Toggle theme"
            >
              {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-3 space-y-1">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive(link.to)
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};