import React from 'react';
import { TransparencySummary } from '../types';
import { formatGBP } from '../utils/transparency';
import {
  ShieldCheck,
  HeartHandshake,
  FileText,
  Layers,
  Target,
  FileCheck2,
  User,
  Heart,
} from 'lucide-react';

export type ActiveNavTab =
  | 'beacon'
  | 'goals'
  | 'impact'
  | 'donors'
  | 'ledger'
  | 'reports'
  | 'awareness';

interface NavigationHeaderProps {
  summary: TransparencySummary;
  activeTab: ActiveNavTab;
  onSelectTab: (tab: ActiveNavTab) => void;
  onOpenDonate: () => void;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  summary,
  activeTab,
  onSelectTab,
  onOpenDonate,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-slate-950/95 border-b border-slate-800 text-slate-100 select-none shadow-xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-shrink-0">
          <button
            onClick={() => onSelectTab('beacon')}
            className="flex items-center gap-2 text-left cursor-pointer focus:outline-none"
            aria-label="Return to 3D Beacon"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-bold text-xs sm:text-base flex-shrink-0">
              RH
            </div>
            <div className="min-w-0 hidden lg:block">
              <div className="flex items-center gap-1.5">
                <h1 className="font-semibold text-xs sm:text-sm tracking-tight truncate text-slate-100">
                  Ramsay Hunt Awareness
                </h1>
                <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                  <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
                  100% Transparent
                </span>
              </div>
              <p className="text-[10px] text-slate-400 truncate">
                PayPal.me/dlinacre16 • Real-Time Financial Tracking
              </p>
            </div>
          </button>
        </div>

        {/* Tab Switcher */}
        <nav
          className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 overflow-x-auto max-w-[calc(100vw-130px)] sm:max-w-none scrollbar-none"
          aria-label="Main Navigation"
        >
          <button
            onClick={() => onSelectTab('beacon')}
            className={`px-2 sm:px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1 whitespace-nowrap cursor-pointer ${
              activeTab === 'beacon'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
            aria-label="View 3D Beacon"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">3D Beacon</span>
          </button>

          <button
            onClick={() => onSelectTab('goals')}
            className={`px-2 sm:px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1 whitespace-nowrap cursor-pointer ${
              activeTab === 'goals'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
            aria-label="View Donation Goals"
          >
            <Target className="w-3.5 h-3.5 text-cyan-400" />
            <span>Goals</span>
          </button>

          <button
            onClick={() => onSelectTab('impact')}
            className={`px-2 sm:px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1 whitespace-nowrap cursor-pointer ${
              activeTab === 'impact'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
            aria-label="View Impact Reports"
          >
            <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Impact</span>
          </button>

          <button
            onClick={() => onSelectTab('donors')}
            className={`px-2 sm:px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1 whitespace-nowrap cursor-pointer ${
              activeTab === 'donors'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
            aria-label="View Donor Profiles"
          >
            <User className="w-3.5 h-3.5 text-indigo-400" />
            <span>Donors</span>
          </button>

          <button
            onClick={() => onSelectTab('ledger')}
            className={`px-2 sm:px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1 whitespace-nowrap cursor-pointer ${
              activeTab === 'ledger'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
            aria-label="View Real-Time Financial Ledger"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Ledger</span>
          </button>

          <button
            onClick={() => onSelectTab('reports')}
            className={`px-2 sm:px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1 whitespace-nowrap cursor-pointer ${
              activeTab === 'reports'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
            aria-label="View Governance and Reports"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reports</span>
          </button>

          <button
            onClick={() => onSelectTab('awareness')}
            className={`px-2 sm:px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1 whitespace-nowrap cursor-pointer ${
              activeTab === 'awareness'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
            aria-label="View Ramsay Hunt Awareness Hub and Story"
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Story</span>
          </button>
        </nav>

        {/* Direct PayPal Support Button */}
        <button
          onClick={onOpenDonate}
          className="px-2.5 sm:px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-[11px] sm:text-xs tracking-wide shadow-md shadow-amber-500/20 transition-all flex items-center gap-1 sm:gap-1.5 flex-shrink-0 cursor-pointer"
          aria-label="Donate via PayPal.me/dlinacre16"
        >
          <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-slate-950" />
          <span>Support</span>
        </button>
      </div>
    </header>
  );
};
