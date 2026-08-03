import React from 'react';

export const Input = ({ label, className = '', ...props }) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}
      <input 
        className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
        {...props}
      />
    </div>
  );
};

export const TextArea = ({ label, className = '', ...props }) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}
      <textarea 
        className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[100px] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
        {...props}
      />
    </div>
  );
};