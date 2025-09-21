import React from 'react';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          {/* Spinner */}
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          
          {/* Floating elements around spinner */}
          <div className="absolute -top-2 -left-2 text-purple-400 animate-bounce" style={{animationDelay: '0s'}}>
            💙
          </div>
          <div className="absolute -top-2 -right-2 text-blue-400 animate-bounce" style={{animationDelay: '0.5s'}}>
            🌟
          </div>
          <div className="absolute -bottom-2 -left-2 text-green-400 animate-bounce" style={{animationDelay: '1s'}}>
            🧠
          </div>
          <div className="absolute -bottom-2 -right-2 text-purple-400 animate-bounce" style={{animationDelay: '1.5s'}}>
            ✨
          </div>
        </div>
        
        <p className="text-gray-600 font-medium">{message}</p>
        <p className="text-gray-400 text-sm mt-2">Thank you for your patience 💙</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;