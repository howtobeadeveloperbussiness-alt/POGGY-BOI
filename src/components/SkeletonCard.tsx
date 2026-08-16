import React from 'react';

interface SkeletonCardProps {
  variant?: 'project' | 'service' | 'current';
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ variant = 'project' }) => {
  if (variant === 'service') {
    return (
      <div className="rounded-2xl glass-panel p-7 animate-pulse border border-white/5">
        <div className="w-10 h-10 rounded-xl bg-slate-800/80 mb-5" />
        <div className="h-5 w-2/3 bg-slate-800/80 rounded-md mb-3" />
        <div className="h-4 w-full bg-slate-800/50 rounded-md mb-2" />
        <div className="h-4 w-4/5 bg-slate-800/50 rounded-md mb-4" />
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-slate-800/60 rounded-full" />
          <div className="h-6 w-20 bg-slate-800/60 rounded-full" />
        </div>
      </div>
    );
  }

  if (variant === 'current') {
    return (
      <div className="rounded-2xl glass-panel p-8 animate-pulse border border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-4">
            <div className="h-6 w-24 bg-slate-800/80 rounded-full" />
            <div className="h-10 w-3/4 bg-slate-800/80 rounded-lg" />
            <div className="h-4 w-full bg-slate-800/50 rounded-md" />
            <div className="h-4 w-5/6 bg-slate-800/50 rounded-md" />
            <div className="h-3 w-full bg-slate-800/60 rounded-full mt-6" />
          </div>
          <div className="lg:col-span-7 aspect-[16/10] bg-slate-800/60 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl glass-panel overflow-hidden animate-pulse border border-white/5">
      <div className="aspect-[4/3] bg-slate-800/80 w-full" />
      <div className="p-6 space-y-3">
        <div className="flex justify-between items-center">
          <div className="h-4 w-20 bg-slate-800/80 rounded-full" />
          <div className="h-4 w-16 bg-slate-800/60 rounded-md" />
        </div>
        <div className="h-6 w-3/4 bg-slate-800/80 rounded-md" />
        <div className="h-4 w-full bg-slate-800/50 rounded-md" />
        <div className="flex gap-2 pt-2">
          <div className="h-6 w-14 bg-slate-800/60 rounded-full" />
          <div className="h-6 w-16 bg-slate-800/60 rounded-full" />
        </div>
      </div>
    </div>
  );
};
