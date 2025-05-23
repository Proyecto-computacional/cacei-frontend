import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-[9999]">
      <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center transform transition-all">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-500/20 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <p className="mt-6 text-lg font-medium text-gray-700">Cargando...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner; 