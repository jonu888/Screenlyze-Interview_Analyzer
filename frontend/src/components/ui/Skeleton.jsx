import React from 'react';

const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200 dark:bg-gray-700 ${className}`}
      {...props}
    />
  );
};

export const SkeletonCard = () => (
  <div className="rounded-lg border p-4 shadow-sm">
    <Skeleton className="h-4 w-3/4 mb-4" />
    <Skeleton className="h-4 w-1/2 mb-2" />
    <Skeleton className="h-4 w-2/3" />
  </div>
);

export const SkeletonTable = ({ rows = 5 }) => (
  <div className="space-y-3">
    <Skeleton className="h-10 w-full" />
    {[...Array(rows)].map((_, i) => (
      <Skeleton key={i} className="h-16 w-full" />
    ))}
  </div>
);

export const SkeletonProfile = () => (
  <div className="space-y-4">
    <div className="flex items-center space-x-4">
      <Skeleton className="h-16 w-16 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-3/4" />
  </div>
);

export const SkeletonChart = () => (
  <div className="bg-white rounded shadow p-4">
    <Skeleton className="h-4 w-1/3 mb-4" />
    <div className="flex items-center justify-center">
      <Skeleton className="h-40 w-40 rounded-full" />
    </div>
    <div className="flex justify-center mt-4 space-x-4">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-20" />
    </div>
  </div>
);

export const SkeletonFileUpload = () => (
  <div className="space-y-4">
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
      <div className="flex flex-col items-center justify-center space-y-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
    <div className="space-y-2">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
    <Skeleton className="h-10 w-1/3" />
  </div>
);

export const SkeletonVideoPlayer = () => (
  <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
    <Skeleton className="absolute inset-0" />
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
      <Skeleton className="h-4 w-1/4" />
    </div>
  </div>
);

export const SkeletonAnalysisResult = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SkeletonChart />
      <SkeletonChart />
    </div>
    <div className="space-y-4">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  </div>
);

export const SkeletonAuthForm = () => (
  <div className="space-y-6 bg-white p-8 rounded-lg shadow-md">
    <div className="space-y-2">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-4 w-2/3" />
    </div>
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
    <div className="flex items-center justify-between">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-4 w-1/4" />
    </div>
  </div>
);

export const SkeletonNavbar = () => (
  <nav className="bg-white shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16 items-center">
        <div className="flex items-center">
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="flex items-center space-x-4">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    </div>
  </nav>
);

export default Skeleton; 