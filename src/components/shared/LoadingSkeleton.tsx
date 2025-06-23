import React from 'react';

interface LoadingSkeletonProps {
  count?: number; // Number of skeleton lines/items to render
  height?: string; // Height of each skeleton line/item, e.g., 'h-4', 'h-8'
  className?: string; // Additional Tailwind CSS classes for the skeleton container
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  count = 1,
  height = 'h-4',
  className = 'w-full',
}) => {
  return (
    <div className={`animate-pulse space-y-2 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={`bg-gray-200 rounded ${height}`}></div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;