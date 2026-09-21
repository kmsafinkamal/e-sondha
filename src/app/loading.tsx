import React from 'react';

export default function Loading() {
  return (
    <div className="page-enter min-h-[50vh] flex flex-col items-center justify-center p-8">
      <div className="flex flex-col items-center gap-3">
        {/* Minimalist spinning ceramic ring */}
        <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
        <span className="font-label-caps text-[10px] tracking-widest uppercase text-outline/80">
          Loading atelier...
        </span>
      </div>
    </div>
  );
}
