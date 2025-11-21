import React from 'react';

const SkeletonLoader = ({ type = 'card' }) => {
  if (type === 'question') {
    return (
      <div className="space-y-4 p-6 bg-base-200 rounded-xl">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="bg-base-300/60 h-4 w-16 rounded-xl animate-pulse"></div>
            <div className="bg-base-300/60 h-4 w-12 rounded-xl animate-pulse"></div>
          </div>
          <div className="bg-base-300/60 h-6 w-6 rounded-full animate-pulse"></div>
        </div>
        <div className="bg-base-300/60 h-6 w-3/4 mb-4 rounded-xl animate-pulse"></div>
        <div className="space-y-2 mb-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-base-300/60 h-10 w-full rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default SkeletonLoader;
