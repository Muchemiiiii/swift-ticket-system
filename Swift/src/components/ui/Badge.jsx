import React from 'react';

export const Badge = ({ children, variant = 'gray' }) => {
  const variants = {
    gray: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600",
    green: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
    yellow: "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
    red: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
    blue: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant] || variants.gray}`}>
      {children}
    </span>
  );
};