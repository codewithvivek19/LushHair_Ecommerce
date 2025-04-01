import React from 'react';

type LoadingSpinnerProps = {
  className?: string;
  size?: 'small' | 'medium' | 'large';
};

export function LoadingSpinner({ 
  className = '', 
  size = 'medium' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'h-4 w-4 border-2',
    medium: 'h-8 w-8 border-2',
    large: 'h-12 w-12 border-4',
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div 
        className={`animate-spin rounded-full border-b-primary ${sizeClasses[size]}`}
        aria-hidden="true"
      ></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
} 