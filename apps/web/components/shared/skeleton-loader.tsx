import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width,
  height,
  rounded = 'md',
}) => {
  const roundedClass = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-xl',
    full: 'rounded-full',
  }[rounded];

  return (
    <div
      className={`skeleton-shimmer ${roundedClass} ${className}`}
      style={{
        width: width !== undefined ? width : '100%',
        height: height !== undefined ? height : '1rem',
      }}
    />
  );
};

export const SchemeCardSkeleton: React.FC = () => {
  return (
    <div className="card-container p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2 w-3/4">
          <Skeleton height={24} width="70%" />
          <Skeleton height={16} width="40%" />
        </div>
        <Skeleton height={28} width={80} rounded="full" />
      </div>
      <Skeleton height={40} width="100%" />
      <div className="pt-2 flex justify-between items-center">
        <Skeleton height={20} width="35%" />
        <Skeleton height={36} width={120} rounded="md" />
      </div>
    </div>
  );
};

export const RoadmapTimelineSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {[1, 2].map((i) => (
        <div key={i} className="card-container p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton height={32} width={32} rounded="full" />
            <Skeleton height={24} width="45%" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <Skeleton height={90} rounded="lg" />
            <Skeleton height={90} rounded="lg" />
          </div>
        </div>
      ))}
    </div>
  );
};
