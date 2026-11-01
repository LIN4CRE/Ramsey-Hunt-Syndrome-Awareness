import React from 'react';
import { ExpenseRecord } from '../types';
import { formatGBP, getCategoryLabel } from '../utils/transparency';
import { X, CheckCircle, FileCheck, Building, Calendar, Hash, ShieldCheck } from 'lucide-react';

interface ReceiptViewerModalProps {
  expense: ExpenseRecord | null;
  onClose: () => void;
}

export const ReceiptViewerModal: React.FC<ReceiptViewerModalProps> = ({
  expense,
  onClose,
}) => {
  if (!expense) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="receipt-modal-title"
    >
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 text-slate-100 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close receipt modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Receipt Header */}
        <div className="flex items-center gap-3 mb-5 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 id="receipt-modal-title" className="text-base font-bold text-white">
                Verified Expense Receipt
              </h2>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                Audited
              </span>
            </div>
            <p className="text-xs text-slate-400">{expense.title}</p>
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 mb-5">
          <div className="space-y-1">
            <span className="text-slate-500 flex items-center gap-1 text-[11px]">
              <Building className="w-3 h-3" /> Vendor / Payee
            </span>
            <div className="font-semibold text-slate-200">{expense.vendor}</div>
          </div>

          <div className="space-y-1">
            <span className="text-slate-500 flex items-center gap-1 text-[11px]">
              <Calendar className="w-3 h-3" /> Date Settled
            </span>
            <div className="font-semibold text-slate-200">{expense.date}</div>
          </div>

          <div className="space-y-1">
            <span className="text-slate-500 flex items-center gap-1 text-[11px]">
              <Hash className="w-3 h-3" /> Receipt Reference
            </span>
            <div className="font-mono text-amber-300 font-medium">{expense.receiptNumber}</div>
          </div>

          <div className="space-y-1">
            <span className="text-slate-500 flex items-center gap-1 text-[11px]">
              Category
            </span>
            <div className="font-medium text-slate-300">{getCategoryLabel(expense.category)}</div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="mb-5">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Itemized Cost Breakdown
          </div>
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/60">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-3 py-2">Item Description</th>
                  <th className="px-3 py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {expense.receiptItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40">
                    <td className="px-3 py-2.5 text-slate-200">{item.item}</td>
                    <td className="px-3 py-2.5 text-right font-mono text-slate-100 font-semibold">
                      {formatGBP(item.costGBP)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-900 font-bold border-t border-slate-700">
                <tr>
                  <td className="px-3 py-2.5 text-slate-200">Total Disbursed</td>
                  <td className="px-3 py-2.5 text-right font-mono text-amber-400 text-sm">
                    {formatGBP(expense.amountGBP)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Audit Sign-off Note */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Governance Verification</span>
          </div>
          <p className="text-slate-400 text-[11px]">
            Approved by: <strong className="text-slate-200">{expense.approvedBy}</strong>. {expense.notes || 'Reconciled against verified bank statements and supplier invoices.'}
          </p>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
          >
            Close Receipt View
          </button>
        </div>
      </div>
    </div>
  );
};
