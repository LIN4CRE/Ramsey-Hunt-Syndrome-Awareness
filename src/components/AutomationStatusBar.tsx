import React, { useState, useEffect } from 'react';
import { sound } from '../utils/audio';
import { AutomatedAuditReport } from '../utils/automation';
import {
  Activity,
  ShieldCheck,
  Zap,
  Volume2,
  VolumeX,
  RefreshCw,
  CheckCircle,
  Sparkles,
} from 'lucide-react';

interface AutomationStatusBarProps {
  onSimulateInflow: () => void;
  auditReport: AutomatedAuditReport;
  onRunAudit: () => void;
  lastSimulatedDonorName?: string | null;
}

export const AutomationStatusBar: React.FC<AutomationStatusBarProps> = ({
  onSimulateInflow,
  auditReport,
  onRunAudit,
  lastSimulatedDonorName,
}) => {
  const [isMuted, setIsMuted] = useState(sound.getMuted());
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const toggleSound = () => {
    const next = !isMuted;
    sound.setMuted(next);
    setIsMuted(next);
    if (!next) {
      sound.playSoftClick();
    }
  };

  const handleSimulate = () => {
    setIsSyncing(true);
    sound.playDonationChime();
    onSimulateInflow();
    setToastMessage('Live PayPal webhook received! Auto-reconciled and allocated.');

    setTimeout(() => {
      setIsSyncing(false);
    }, 800);

    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  return (
    <>
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 bg-gradient-to-r from-emerald-950 to-slate-900 border border-emerald-500/60 text-slate-100 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Automated PayPal Inflow</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/30 text-emerald-300">Verified</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Persistent Docked Automation Status Bar */}
      <div className="bg-slate-950 border-t border-slate-800 text-slate-300 text-xs py-2 px-4 select-none">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left: Engine Status Badges */}
          <div className="flex items-center gap-3 text-[11px]">
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>PayPal Webhook Listener: <strong>Active</strong></span>
            </div>

            <span className="text-slate-700 hidden sm:inline">•</span>

            <div className="hidden sm:flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Audit Score: <strong className="text-cyan-300">{auditReport.overallScore}/100 ({auditReport.status})</strong></span>
            </div>

            <span className="text-slate-700 hidden md:inline">•</span>

            <div className="hidden md:flex items-center gap-1 font-mono text-[10px] text-slate-400">
              <span>Checksum:</span>
              <span className="text-amber-400">{auditReport.auditHash}</span>
            </div>
          </div>

          {/* Right: Automation Controls */}
          <div className="flex items-center gap-2">
            {/* Quick Simulate Inflow Button */}
            <button
              onClick={handleSimulate}
              disabled={isSyncing}
              className="px-2.5 py-1 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 hover:text-white font-medium text-[11px] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
              aria-label="Simulate Live PayPal Contribution"
              title="Simulates automated incoming PayPal IPN webhook with instant ledger allocation and 3D pulse"
            >
              <Zap className={`w-3.5 h-3.5 text-amber-400 ${isSyncing ? 'animate-bounce' : ''}`} />
              <span>Simulate PayPal Inflow (+£25)</span>
            </button>

            {/* Run Automated Audit Button */}
            <button
              onClick={onRunAudit}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-[11px] font-medium transition-colors flex items-center gap-1 cursor-pointer"
              aria-label="Run Automated Compliance Audit"
            >
              <RefreshCw className="w-3 h-3 text-cyan-400" />
              <span className="hidden sm:inline">Verify Ledger</span>
            </button>

            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label={isMuted ? 'Unmute procedural sound effects' : 'Mute procedural sound effects'}
              title={isMuted ? 'Enable procedural audio' : 'Mute procedural audio'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
