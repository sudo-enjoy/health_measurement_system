import React from 'react';
import { X, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'error' | 'success' | 'warning' | 'info';
  showIcon?: boolean;
}

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  type = 'info',
  showIcon = true 
}: ModalProps) {
  if (!isOpen) return null;

  const getIcon = () => {
    if (!showIcon) return null;
    
    switch (type) {
      case 'error':
        return <AlertTriangle className="w-8 h-8 text-red-500" />;
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-8 h-8 text-yellow-500" />;
      default:
        return <Info className="w-8 h-8 text-blue-500" />;
    }
  };

  const getColorClasses = () => {
    switch (type) {
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative w-full max-w-md mx-4 p-6 rounded-2xl shadow-2xl border-2 ${getColorClasses()} transform transition-all duration-300 scale-100`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        {/* Content */}
        <div className="text-center">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            {getIcon()}
          </div>
          
          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            {title}
          </h3>
          
          {/* Message */}
          <p className="text-gray-700 mb-6 leading-relaxed">
            {message}
          </p>
          
          {/* Action Button */}
          <button
            onClick={onClose}
            className={`w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-200 transform hover:scale-105 ${
              type === 'error' ? 'bg-red-500 hover:bg-red-600' :
              type === 'success' ? 'bg-green-500 hover:bg-green-600' :
              type === 'warning' ? 'bg-yellow-500 hover:bg-yellow-600' :
              'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            了解しました
          </button>
        </div>
      </div>
    </div>
  );
}
