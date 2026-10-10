import React from 'react';

export function Skeleton({ className = 'h-3.5 bg-zinc-100 rounded-md' }) {
  return <div className={`animate-pulse ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="p-5 rounded-xl bg-white border border-zinc-200/80 space-y-3">
      <div className="flex justify-between items-center">
        <Skeleton className="h-2.5 w-1/3 bg-zinc-100" />
        <Skeleton className="h-7 w-7 rounded-lg bg-zinc-100" />
      </div>
      <Skeleton className="h-7 w-1/2 bg-zinc-100" />
      <Skeleton className="h-2.5 w-2/3 bg-zinc-100" />
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <div className="bg-white border border-zinc-200/80 rounded-xl p-4 space-y-3.5">
      <div className="flex justify-between">
        <Skeleton className="h-8 w-48 bg-zinc-100" />
        <Skeleton className="h-8 w-24 bg-zinc-100" />
      </div>
      <div className="space-y-2.5">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex gap-4 items-center">
            {Array.from({ length: cols }).map((_, c) => (
              <Skeleton key={c} className="h-3 flex-1 bg-zinc-100" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
