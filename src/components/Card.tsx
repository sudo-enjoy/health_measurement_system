import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-md border border-gray-200 p-6 ${className}`}>
      {children}
    </div>
  );
}