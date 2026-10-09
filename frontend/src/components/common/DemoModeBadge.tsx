import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const DemoModeBadge: React.FC = () => {
  return (
    <div
      title="System Active • Verified"
      className="inline-flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300/60 text-xs font-medium shadow-2xs transition-all"
    >
      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
      <ShieldCheck className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-emerald-600 shrink-0" />
      <span className="hidden sm:inline">System Active • Verified</span>
    </div>
  );
};
