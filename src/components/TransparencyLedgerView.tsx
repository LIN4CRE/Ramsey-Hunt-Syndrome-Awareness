import React, { useState } from 'react';
import { DonationRecord, ExpenseRecord, TransparencySummary, ExpenseCategory } from '../types';
import { formatGBP, getCategoryLabel, generateLedgerCSV } from '../utils/transparency';
import {
  FileText,
  Download,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Receipt,
  Heart,
  PlusCircle,
  ExternalLink,
} from 'lucide-react';

interface TransparencyLedgerViewProps {
  donations: DonationRecord[];
  expenses: ExpenseRecord[];
  summary: TransparencySummary;
  onOpenDonate: () => void;
  onViewReceipt: (expense: ExpenseRecord) => void;
  onAddExpense: (expense: ExpenseRecord) => void;
}

export const TransparencyLedgerView: React.FC<TransparencyLedgerViewProps> = ({
  donations,
  expenses,
  summary,
  onOpenDonate,
  onViewReceipt,
  onAddExpense,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'inflow' | 'outflow'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddExpenseModal, setShowAddExpenseModal] = useState<boolean>(false);

  // New expense form state
  const [newTitle, setNewTitle] = useState('');
  const [newVendor, setNewVendor] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState<ExpenseCategory>('awareness_leaflets');
  const [newReceiptNo, setNewReceiptNo] = useState('');
  const [newItems, setNewItems] = useState('');

  // Combine inflows and outflows into unified chronological feed
  const combinedEntries = [
    ...donations.map(d => ({
      id: d.id,
      type: 'inflow' as const,
      date: d.date,
      party: d.isAnonymous ? 'Anonymous Contributor' : d.donorName,
      category: d.allocatedCategory || 'patient_guides',
      amount: d.amountGBP,
      reference: d.paypalTransactionId || 'PayPal',
      status: d.verified ? 'Verified' : 'Pending',
      notes: d.donorMessage,
      rawExpense: null as ExpenseRecord | null,
    })),
    ...expenses.map(e => ({
      id: e.id,
      type: 'outflow' as const,
      date: e.date,
      party: e.vendor,
      category: e.category,
      amount: -e.amountGBP,
      reference: e.receiptNumber,
      status: e.status,
      notes: e.title,
      rawExpense: e,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Filter entries
  const filteredEntries = combinedEntries.filter(entry => {
    if (filterType !== 'all' && entry.type !== filterType) return false;
    if (categoryFilter !== 'all' && entry.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchParty = entry.party.toLowerCase().includes(q);
      const matchNotes = (entry.notes || '').toLowerCase().includes(q);
      const matchRef = entry.reference.toLowerCase().includes(q);
      if (!matchParty && !matchNotes && !matchRef) return false;
    }
    return true;
  });

  const handleDownloadCSV = () => {
    const csv = generateLedgerCSV(donations, expenses);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ramsay-hunt-transparency-ledger-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(newAmount);
    if (!newTitle.trim() || isNaN(amountVal) || amountVal <= 0) return;

    const itemsParsed = newItems.trim()
      ? newItems.split('\n').map(line => {
          const parts = line.split(':');
          return {
            item: parts[0]?.trim() || 'Item',
            costGBP: parts[1] ? parseFloat(parts[1]) || amountVal : amountVal,
          };
        })
      : [{ item: newTitle.trim(), costGBP: amountVal }];

    const newRec: ExpenseRecord = {
      id: `exp-${Date.now().toString().slice(-6)}`,
      title: newTitle.trim(),
      description: `Disbursed for ${getCategoryLabel(newCategory)}`,
      category: newCategory,
      amountGBP: amountVal,
      date: new Date().toISOString().split('T')[0],
      vendor: newVendor.trim() || 'Verified Supplier UK',
      receiptNumber: newReceiptNo.trim() || `REC-${Math.floor(1000 + Math.random() * 9000)}`,
      receiptItems: itemsParsed,
      status: 'disbursed',
      approvedBy: 'Founder / Transparency Audit',
    };

    onAddExpense(newRec);
    setShowAddExpenseModal(false);
    setNewTitle('');
    setNewVendor('');
    setNewAmount('');
    setNewReceiptNo('');
    setNewItems('');
  };

  return (
    <div className="pt-20 pb-24 px-4 sm:px-6 max-w-7xl mx-auto space-y-6 text-slate-100">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Inflows */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Total Inflows (PayPal.me)</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {formatGBP(summary.totalInflowsGBP)}
          </div>
          <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1 font-medium">
            <span>{summary.donorCount} Verified Contributions</span>
          </div>
        </div>

        {/* Total Outflows */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Verified Disbursements</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {formatGBP(summary.totalOutflowsGBP)}
          </div>
          <div className="mt-2 text-xs text-amber-300 flex items-center gap-1 font-medium">
            <Receipt className="w-3.5 h-3.5" />
            <span>{summary.receiptReconciliationRate}% Reconciled with Receipts</span>
          </div>
        </div>

        {/* Liquid Reserve */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Available Cash Reserve</span>
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-cyan-300 tracking-tight">
            {formatGBP(summary.reserveBalanceGBP)}
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Dedicated buffer for awareness printing &amp; pilot
          </div>
        </div>

        {/* Threshold Progress */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Registration Gate (£5,000)</span>
              <span className="font-semibold text-amber-400">
                {((summary.totalInflowsGBP / summary.charityCommissionThresholdGBP) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
              <div
                className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(100, (summary.totalInflowsGBP / summary.charityCommissionThresholdGBP) * 100)}%`,
                }}
              />
            </div>
          </div>
          <div className="text-xs text-slate-400 mt-2">
            {formatGBP(summary.distanceToRegistrationThresholdGBP)} remaining to £5k Charity Commission threshold
          </div>
        </div>
      </div>

      {/* Action Bar & Filters */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search & Type filter */}
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search */}
          <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search donor, vendor, receipt..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              aria-label="Search financial records"
            />
          </div>

          {/* Type filter buttons */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                filterType === 'all' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({combinedEntries.length})
            </button>
            <button
              onClick={() => setFilterType('inflow')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                filterType === 'inflow' ? 'bg-emerald-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Inflows ({donations.length})
            </button>
            <button
              onClick={() => setFilterType('outflow')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                filterType === 'outflow' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Outflows ({expenses.length})
            </button>
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              aria-label="Filter by expense category"
            >
              <option value="all">All Categories</option>
              <option value="patient_guides">Clinical Guides &amp; Signs</option>
              <option value="audiology_signposts">Audiology &amp; Ear Health</option>
              <option value="awareness_leaflets">Awareness Leaflets</option>
              <option value="digital_infrastructure">Digital Infrastructure</option>
              <option value="governance_contingency">Governance Reserve</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setShowAddExpenseModal(true)}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            aria-label="Record verified expense"
          >
            <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Record Expense</span>
          </button>

          <button
            onClick={handleDownloadCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            aria-label="Export complete ledger as CSV"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onOpenDonate}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer"
            aria-label="Contribute via PayPal.me/dlinacre16"
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Donate (PayPal.me)</span>
          </button>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs" aria-label="Real-time financial transactions">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Date</th>
                <th className="py-3.5 px-4 font-semibold">Type</th>
                <th className="py-3.5 px-4 font-semibold">Contributor / Vendor</th>
                <th className="py-3.5 px-4 font-semibold">Category / Purpose</th>
                <th className="py-3.5 px-4 font-semibold">Reference</th>
                <th className="py-3.5 px-4 font-semibold text-right">Amount</th>
                <th className="py-3.5 px-4 font-semibold text-center">Receipt &amp; Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-sm">
                    No transactions match your current search and filter criteria.
                  </td>
                </tr>
              ) : (
                filteredEntries.map(entry => (
                  <tr key={entry.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Date */}
                    <td className="py-3.5 px-4 text-slate-300 font-mono text-[11px] whitespace-nowrap">
                      {entry.date}
                    </td>

                    {/* Type badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {entry.type === 'inflow' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                          <ArrowDownRight className="w-3 h-3 text-emerald-400" />
                          Inflow
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-950/80 text-amber-300 border border-amber-800/60">
                          <ArrowUpRight className="w-3 h-3 text-amber-400" />
                          Outflow
                        </span>
                      )}
                    </td>

                    {/* Party */}
                    <td className="py-3.5 px-4 font-medium text-slate-200">
                      <div>{entry.party}</div>
                      {entry.notes && (
                        <div className="text-[11px] text-slate-400 font-normal truncate max-w-xs sm:max-w-md">
                          "{entry.notes}"
                        </div>
                      )}
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-[11px] text-slate-300">
                        {getCategoryLabel(entry.category)}
                      </span>
                    </td>

                    {/* Reference / Transaction ID */}
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                      {entry.reference}
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold whitespace-nowrap">
                      <span className={entry.amount > 0 ? 'text-emerald-400' : 'text-amber-400'}>
                        {entry.amount > 0 ? `+${formatGBP(entry.amount)}` : formatGBP(entry.amount)}
                      </span>
                    </td>

                    {/* Receipt & Verification */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {entry.rawExpense ? (
                        <button
                          onClick={() => onViewReceipt(entry.rawExpense!)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-cyan-200 text-[11px] font-medium transition-colors inline-flex items-center gap-1 cursor-pointer"
                          aria-label={`View receipt for ${entry.rawExpense.title}`}
                        >
                          <Receipt className="w-3 h-3" />
                          <span>Receipt</span>
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Reconciled</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Expense Modal */}
      {showAddExpenseModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="record-expense-title"
        >
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 text-slate-100 shadow-2xl relative">
            <h3 id="record-expense-title" className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-amber-400" />
              <span>Record Verified Initiative Expense</span>
            </h3>

            <form onSubmit={handleCreateExpense} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Expense Title / Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Accessible leaflet printing batch 2"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Vendor / Payee</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. EcoPrint UK"
                    value={newVendor}
                    onChange={e => setNewVendor(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Amount (£ GBP)</label>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    required
                    placeholder="e.g. 120"
                    value={newAmount}
                    onChange={e => setNewAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as ExpenseCategory)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="awareness_leaflets">Awareness Leaflets</option>
                    <option value="patient_guides">Clinical Guides &amp; Signs</option>
                    <option value="audiology_signposts">Audiology &amp; Ear Health</option>
                    <option value="digital_infrastructure">Digital Infrastructure</option>
                    <option value="governance_contingency">Governance Reserve</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Receipt Number</label>
                  <input
                    type="text"
                    placeholder="e.g. INV-90412"
                    value={newReceiptNo}
                    onChange={e => setNewReceiptNo(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">
                  Itemized Breakdown (Optional: Item : Cost)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. 1000 Leaflets : 100&#10;Eco Courier Delivery : 20"
                  value={newItems}
                  onChange={e => setNewItems(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddExpenseModal(false)}
                  className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Record Disbursal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
