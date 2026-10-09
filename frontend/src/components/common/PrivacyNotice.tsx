import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const PrivacyNotice: React.FC = () => {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600 flex items-center gap-2.5">
      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
      <div>
        <span className="font-semibold text-slate-800">Privacy Notice:</span> Data uses transparent rule-based heuristics. JobShield operates independently from academic records.
      </div>
    </div>
  );
};
