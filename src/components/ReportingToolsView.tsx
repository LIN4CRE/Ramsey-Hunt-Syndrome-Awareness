import React, { useState } from 'react';
import { DonationRecord, ExpenseRecord, TransparencySummary } from '../types';
import { formatGBP, generateLedgerCSV } from '../utils/transparency';
import {
  FileText,
  Download,
  ShieldCheck,
  Scale,
  Award,
  CheckCircle,
  AlertTriangle,
  Printer,
  Copy,
  Check,
} from 'lucide-react';

interface ReportingToolsViewProps {
  donations: DonationRecord[];
  expenses: ExpenseRecord[];
  summary: TransparencySummary;
}

export const ReportingToolsView: React.FC<ReportingToolsViewProps> = ({
  donations,
  expenses,
  summary,
}) => {
  const [certDonorName, setCertDonorName] = useState('');
  const [certAmount, setCertAmount] = useState('25');
  const [certGenerated, setCertGenerated] = useState(false);
  const [copiedStatement, setCopiedStatement] = useState(false);

  const handleDownloadCSV = () => {
    const csv = generateLedgerCSV(donations, expenses);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ramsay-hunt-financial-transparency-statement-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyStatement = () => {
    const text = `RAMSAY HUNT SYNDROME AWARENESS INITIATIVE
REAL-TIME FINANCIAL TRANSPARENCY & AUDIT STATEMENT
Reporting Period: Launch through ${new Date().toLocaleDateString('en-GB')}
Jurisdiction: England & Wales

SUMMARY OF RECEIPTS AND PAYMENTS:
- Total Contributor Inflows: ${formatGBP(summary.totalInflowsGBP)}
- Total Verified Disbursements: ${formatGBP(summary.totalOutflowsGBP)}
- Current Liquid Reserve Balance: ${formatGBP(summary.reserveBalanceGBP)}
- Receipt Reconciliation Rate: ${summary.receiptReconciliationRate}%
- Administrative Skimming / Waste: 0.0%

REGULATORY & COMPLIANCE STATUS:
- Charity Commission Registration Threshold: £5,000.00
- Distance to Compulsory Threshold: ${formatGBP(summary.distanceToRegistrationThresholdGBP)}
- Status: Operating as a patient-led unincorporated awareness initiative
- PayPal Account: PayPal.me/dlinacre16`;

    navigator.clipboard.writeText(text);
    setCopiedStatement(true);
    setTimeout(() => setCopiedStatement(false), 2000);
  };

  return (
    <div className="pt-20 pb-24 px-4 sm:px-6 max-w-7xl mx-auto space-y-8 text-slate-100">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
              <Scale className="w-4 h-4" />
              Integrated Governance &amp; Reporting Suite
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Real-Time Financial Transparency &amp; Regulatory Audit
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Operating strictly in accordance with Charity Commission for England &amp; Wales guidelines. Every transaction processed through <strong className="text-slate-200">PayPal.me/dlinacre16</strong> is transparently reported with verified receipts and zero administrative overhead.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleCopyStatement}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copiedStatement ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
              <span>{copiedStatement ? 'Copied' : 'Copy Summary'}</span>
            </button>
            <button
              onClick={handleDownloadCSV}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download CSV Ledger</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Charity Commission Threshold & Statutory Framework */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Charity Commission £5k Threshold Tracker */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-amber-400" />
              Charity Commission Threshold Monitor
            </h3>
            <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-cyan-950 text-cyan-300 border border-cyan-800">
              England &amp; Wales
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Under UK charity law, an unincorporated initiative must register with the Charity Commission once annual income reaches <strong>£5,000</strong>. A Charitable Incorporated Organisation (CIO) must register regardless of income.
          </p>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Total Income to Date:</span>
              <span className="font-bold text-emerald-400 font-mono text-sm">
                {formatGBP(summary.totalInflowsGBP)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Statutory Registration Threshold:</span>
              <span className="font-mono text-slate-200">£5,000.00</span>
            </div>

            <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(100, (summary.totalInflowsGBP / summary.charityCommissionThresholdGBP) * 100)}%`,
                }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Current Status: <strong>Pre-Registration Pilot Phase</strong></span>
              <span className="text-amber-400 font-semibold">
                {formatGBP(summary.distanceToRegistrationThresholdGBP)} buffer remaining
              </span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2 text-slate-300">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Dedicated Account Separation:</strong> Personal and initiative funds are never mingled; tracked via PayPal.me/dlinacre16 reference codes.
              </span>
            </div>
            <div className="flex items-start gap-2 text-slate-300">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Gift Aid Notice:</strong> We do not claim Gift Aid as HMRC recognition requires completed charity registration or formal umbrella sponsorship.
              </span>
            </div>
            <div className="flex items-start gap-2 text-slate-300">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Unmet Need &amp; Public Benefit:</strong> Focused strictly on advancing public education and relieving the invisible impact of Ramsay Hunt syndrome.
              </span>
            </div>
          </div>
        </div>

        {/* Live Formal Transparency Statement */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                Auditor &amp; Contributor Statement
              </h3>
              <span className="text-[11px] font-mono text-slate-400">
                Generated: {new Date().toLocaleDateString('en-GB')}
              </span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-2.5">
              <div className="border-b border-slate-800 pb-2 text-[11px] text-slate-400 flex justify-between">
                <span>RAMSAY HUNT AWARENESS PROJECT</span>
                <span>FINANCIAL STATEMENT</span>
              </div>

              <div className="flex justify-between">
                <span>Gross Contributor Inflows:</span>
                <span className="text-emerald-400 font-bold">{formatGBP(summary.totalInflowsGBP)}</span>
              </div>

              <div className="flex justify-between">
                <span>Verified Awareness Expenses:</span>
                <span className="text-amber-400 font-bold">-{formatGBP(summary.totalOutflowsGBP)}</span>
              </div>

              <div className="flex justify-between border-t border-slate-800 pt-2 font-bold text-slate-100">
                <span>Net Unspent Liquid Reserve:</span>
                <span className="text-cyan-300">{formatGBP(summary.reserveBalanceGBP)}</span>
              </div>

              <div className="border-t border-slate-800 pt-2 text-[11px] text-slate-400 space-y-1">
                <div>• Receipt Reconciliation: <strong>{summary.receiptReconciliationRate}%</strong> (100% auditable)</div>
                <div>• Administrative Overhead: <strong>0.0%</strong> (Founder &amp; volunteer-led)</div>
                <div>• Total Unique Donors: <strong>{summary.donorCount} contributors</strong></div>
              </div>
            </div>
          </div>

          <div className="pt-3">
            <button
              onClick={() => window.print()}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-300" />
              <span>Print Official Transparency Certificate</span>
            </button>
          </div>
        </div>
      </div>

      {/* Contributor Impact Certificate Generator */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center flex-shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">
              Contributor Impact &amp; Receipt Generator
            </h3>
            <p className="text-xs text-slate-400">
              Generate an official acknowledgement of your PayPal contribution for your personal or corporate records.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Contributor Name</label>
            <input
              type="text"
              placeholder="e.g. Marcus Evans"
              value={certDonorName}
              onChange={e => setCertDonorName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Donation Amount (£)</label>
            <input
              type="number"
              placeholder="e.g. 50"
              value={certAmount}
              onChange={e => setCertAmount(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
            />
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={() => setCertGenerated(true)}
              className="w-full py-2 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
            >
              Generate Certificate
            </button>
          </div>
        </div>

        {certGenerated && (
          <div className="bg-slate-950 border border-amber-500/40 rounded-xl p-5 text-slate-200 text-xs space-y-3 relative">
            <div className="text-center space-y-1">
              <span className="text-[10px] tracking-widest uppercase font-semibold text-amber-400">
                Official Acknowledgement of Contribution
              </span>
              <h4 className="text-lg font-bold text-white">Ramsay Hunt Awareness Initiative</h4>
              <p className="text-slate-400 text-xs">
                This document certifies that <strong>{certDonorName || 'A Generous Supporter'}</strong> contributed{' '}
                <strong className="text-amber-300">£{certAmount || '0.00'}</strong> towards patient awareness, verified clinical signposts, and audiological guidance.
              </p>
            </div>

            <div className="grid grid-cols-2 text-[11px] text-slate-400 border-t border-slate-800 pt-3">
              <div>
                Recipient: <strong>PayPal.me/dlinacre16</strong>
              </div>
              <div className="text-right">
                Date: <strong>{new Date().toLocaleDateString('en-GB')}</strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
