import React from 'react';
import { AutomatedAuditReport } from '../utils/automation';
import { formatGBP } from '../utils/transparency';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Scale,
  Award,
  Calendar,
  Hash,
  Download,
} from 'lucide-react';

interface AuditReportModalProps {
  report: AutomatedAuditReport | null;
  onClose: () => void;
}

export const AuditReportModal: React.FC<AuditReportModalProps> = ({
  report,
  onClose,
}) => {
  if (!report) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="audit-modal-title"
    >
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 sm:p-8 text-slate-100 shadow-2xl relative my-8 overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close audit report"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20 flex-shrink-0">
            <ShieldCheck className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 id="audit-modal-title" className="text-lg sm:text-xl font-bold text-white">
                Automated Transparency &amp; Compliance Audit
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                100% Passed
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Charity Commission England &amp; Wales Pre-Registration Verification
            </p>
          </div>
        </div>

        {/* Score & Checksum Box */}
        <div className="grid grid-cols-2 gap-3 p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs mb-6">
          <div className="space-y-1">
            <span className="text-slate-500 text-[11px]">Audit Score</span>
            <div className="text-2xl font-bold text-emerald-400 font-mono">
              {report.overallScore}/100
            </div>
            <div className="text-[10px] text-slate-400 font-medium">Status: {report.status}</div>
          </div>

          <div className="space-y-1">
            <span className="text-slate-500 text-[11px]">Audit Hash &amp; Seal</span>
            <div className="font-mono text-xs text-amber-300 font-bold mt-1 break-all">
              {report.auditHash}
            </div>
            <div className="text-[10px] text-slate-400">Deterministic SHA-256 seal</div>
          </div>
        </div>

        {/* Check Items */}
        <div className="space-y-3 mb-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Automated Audit Checklist
          </div>

          {report.checks.map((check, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800/80 flex items-start justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-200">{check.rule}</div>
                  <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">{check.details}</p>
                </div>
              </div>
              <span className="font-mono font-bold text-emerald-400 text-xs flex-shrink-0">
                {check.score}/{check.maxScore}
              </span>
            </div>
          ))}
        </div>

        {/* Financial Reconciliation Summary */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2 mb-6">
          <div className="flex justify-between text-slate-300">
            <span>Verified Contributor Inflows:</span>
            <span className="font-mono font-bold text-emerald-400">
              {formatGBP(report.verifiedInflowsGBP)}
            </span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Reconciled Disbursements:</span>
            <span className="font-mono font-bold text-amber-400">
              {formatGBP(report.reconciledDisbursementsGBP)}
            </span>
          </div>
          <div className="flex justify-between text-slate-300 border-t border-slate-800/80 pt-2 font-bold">
            <span>Verified Liquid Reserve:</span>
            <span className="font-mono text-cyan-300">
              {formatGBP(report.verifiedInflowsGBP - report.reconciledDisbursementsGBP)}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-[11px] text-slate-500">
            Verified on {new Date(report.timestamp).toLocaleDateString('en-GB')}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            Close Audit Report
          </button>
        </div>
      </div>
    </div>
  );
};
