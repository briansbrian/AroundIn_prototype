
import React from 'react';

const LoadingSpinner: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => {
  return (
    <div className={`animate-spin rounded-full border-4 border-t-teal-500 border-gray-200 ${className}`} />
  );
};

export default LoadingSpinner;