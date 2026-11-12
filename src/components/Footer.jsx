import React from 'react';
import { ShieldCheck, Heart, Sparkles, RefreshCw } from 'lucide-react';
import { useGrievances } from '../context/GrievanceContext';

export default function Footer() {
  const { resetToDefault } = useGrievances();

  return (
    <footer className="mt-auto bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="font-semibold text-slate-800 text-sm">GrievEase College Redressal System</span>
            <span className="text-xs text-slate-600 hidden sm:inline">• AI Automated Triage Prototype</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-600">
            <button
              onClick={() => {
                if (window.confirm('Reset all grievance records back to the 20 default mock items?')) {
                  resetToDefault();
                  alert('Reset successfully! 20 default mock grievances restored.');
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 transition-colors"
              title="Reset mock data back to 20 initial college cases"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset 20 Mock Data</span>
            </button>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              Encrypted & Confidential Campus Triage
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
