import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-4 border-primary1 border-t-transparent rounded-full animate-spin" />
      <p className="mt-4 text-lg font-medium text-gray-600">Cargando...</p>
    </div>
  );
};

export default LoadingSpinner; 