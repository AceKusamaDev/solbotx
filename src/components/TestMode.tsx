'use client';

import { useState } from 'react';

interface TestModeProps {
  children: React.ReactNode;
}

export default function TestMode({ children }: TestModeProps) {
  const [isTestMode, setIsTestMode] = useState(true);
  const [showTestBanner, setShowTestBanner] = useState(true);
  
  // Toggle test mode
  const toggleTestMode = () => {
    setIsTestMode(!isTestMode);
  };
  
  // Close test banner
  const closeBanner = () => {
    setShowTestBanner(false);
  };
  
  return (
    <div className="relative">
      {showTestBanner && (
        <div className={`fixed top-0 left-0 right-0 z-50 p-4 ${isTestMode ? 'bg-yellow-600' : 'bg-red-600'}`}>
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-white font-medium">
                {isTestMode 
                  ? 'Demo Mode - This is a demonstration version' 
                  : 'Live Mode - This would execute real trades in a production environment'}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTestMode}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  isTestMode 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                }`}
              >
                {isTestMode ? 'Switch to Live Mode' : 'Switch to Demo Mode'}
              </button>
              <button
                onClick={closeBanner}
                className="text-white hover:text-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Main content */}
      <div className={showTestBanner ? 'pt-16' : ''}>
        {children}
      </div>
    </div>
  );
}
