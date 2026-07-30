import React from 'react';

export const Badge = ({ children, variant = 'gray' }) => {
  const variants = {
    gray: "bg-gray-100 text-gray-700 border-gray-200",
    green: "bg-green-100 text-green-700 border-green-200",
    yellow: "bg-yellow-100 text-yellow-700 border-yellow-200",
    red: "bg-red-100 text-red-700 border-red-200",
    blue: "bg-blue-100 text-blue-700 border-blue-200"
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant] || variants.gray}`}>
      {children}
    </span>
  );
};
