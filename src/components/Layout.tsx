import React from 'react';
import { ArrowLeft, Heart } from 'lucide-react';
import { useAssessment } from '../contexts/AssessmentContext';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  showBack?: boolean;
  onBack?: () => void;
}

export default function Layout({ children, title, showBack = false, onBack }: LayoutProps) {
  const { dispatch } = useAssessment();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      dispatch({ type: 'SET_STEP', payload: 'home' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center">
          {showBack && (
            <button
              onClick={handleBack}
              className="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
          )}
          <div className="flex items-center space-x-3">
            <Heart className="w-6 h-6 text-red-500" />
            <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          </div>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}