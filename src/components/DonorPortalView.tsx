import React, { useState } from 'react';
import { DonorProfile, DonationRecord, RecurringDonation, CampaignGoal } from '../types';
import { formatGBP, computeDonorStats, getCategoryLabel } from '../utils/transparency';
import {
  User,
  Heart,
  Repeat,
  History,
  ShieldCheck,
  CheckCircle,
  PauseCircle,
  PlayCircle,
  XCircle,
  Download,
  Calendar,
  ExternalLink,
  Award,
  Sparkles,
} from 'lucide-react';

interface DonorPortalViewProps {
  donorProfiles: DonorProfile[];
  donations: DonationRecord[];
  recurringDonations: RecurringDonation[];
  campaigns: CampaignGoal[];
  onToggleRecurringStatus: (id: string, newStatus: 'active' | 'paused' | 'cancelled') => void;
  onOpenDonate: (campaignId?: string) => void;
  onAddRecurring: (newRecurring: RecurringDonation) => void;
}

export const DonorPortalView: React.FC<DonorPortalViewProps> = ({
  donorProfiles,
  donations,
  recurringDonations,
  campaigns,
  onToggleRecurringStatus,
  onOpenDonate,
  onAddRecurring,
}) => {
  const [selectedDonorId, setSelectedDonorId] = useState<string>(donorProfiles[0]?.id || 'donor-bell');
  const [showRecurringModal, setShowRecurringModal] = useState(false);

  // New recurring gift form state
  const [recAmount, setRecAmount] = useState('25');
  const [recFrequency, setRecFrequency] = useState<'monthly' | 'quarterly' | 'annual'>('monthly');
  const [recCampaignId, setRecCampaignId] = useState(campaigns[0]?.id || 'camp-01');

  const activeDonor = donorProfiles.find(d => d.id === selectedDonorId) || donorProfiles[0];
  const donorStats = computeDonorStats(activeDonor?.email || '', donations, recurringDonations);

  const handleDownloadPersonalStatement = () => {
    const lines = [
      `DONOR CONTRIBUTION STATEMENT - RAMSAY HUNT AWARENESS INITIATIVE`,
      `Contributor: ${activeDonor.name} (${activeDonor.email})`,
      `Statement Date: ${new Date().toLocaleDateString('en-GB')}`,
      `Account Reference: PayPal.me/dlinacre16`,
      `-------------------------------------------------------`,
      `Total Lifetime Contributed: ${formatGBP(donorStats.totalDonatedGBP)}`,
      `Total Completed Transactions: ${donorStats.donationCount}`,
      `Active Recurring Giving: ${formatGBP(donorStats.monthlyRecurringGBP)}/month`,
      `-------------------------------------------------------`,
      `TRANSACTION HISTORY:`,
      `Date,Amount_GBP,PayPal_Transaction_ID,Allocation,Status`,
      ...donorStats.donorDonations.map(
        d =>
          `${d.date},${d.amountGBP.toFixed(2)},${d.paypalTransactionId || 'N/A'},${d.allocatedCategory || 'general'},Verified`
      ),
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${activeDonor.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-donation-history.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateRecurring = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(recAmount);
    if (isNaN(amountVal) || amountVal <= 0) return;

    const matchedCamp = campaigns.find(c => c.id === recCampaignId);
    const newRec: RecurringDonation = {
      id: `rec-${Date.now().toString().slice(-4)}`,
      donorEmail: activeDonor.email,
      donorName: activeDonor.name,
      amountGBP: amountVal,
      frequency: recFrequency,
      startDate: new Date().toISOString().split('T')[0],
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'active',
      campaignId: recCampaignId,
      campaignTitle: matchedCamp?.title || 'General Awareness',
      paypalSubscriptionId: `I-SUB-${Math.floor(100000 + Math.random() * 900000)}X`,
    };

    onAddRecurring(newRec);
    setShowRecurringModal(false);
  };

  return (
    <div className="pt-20 pb-24 px-4 sm:px-6 max-w-6xl mx-auto space-y-8 text-slate-100">
      {/* Profile Selector & Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-cyan-500/20 flex-shrink-0">
              {activeDonor.name
                .split(' ')
                .map(n => n[0])
                .join('')
                .slice(0, 2)}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {activeDonor.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                  <Award className="w-3 h-3 text-amber-400" />
                  {activeDonor.badge}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {activeDonor.email} • Supporter since {activeDonor.joinedDate}
              </p>
              {activeDonor.bio && (
                <p className="text-xs text-slate-300 mt-1 italic">
                  "{activeDonor.bio}"
                </p>
              )}
            </div>
          </div>

          {/* Profile Switcher dropdown */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="text-xs">
              <label htmlFor="donor-profile-select" className="text-slate-400 block mb-1">
                View As Contributor:
              </label>
              <select
                id="donor-profile-select"
                value={selectedDonorId}
                onChange={e => setSelectedDonorId(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                {donorProfiles.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.badge})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleDownloadPersonalStatement}
              className="mt-4 sm:mt-5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Statement</span>
            </button>
          </div>
        </div>

        {/* Lifetime Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-800">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
            <div className="text-xs text-slate-400 mb-1">Total Donated Lifetime</div>
            <div className="text-2xl font-bold text-emerald-400 font-mono tracking-tight">
              {formatGBP(donorStats.totalDonatedGBP)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Processed directly via PayPal.me
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
            <div className="text-xs text-slate-400 mb-1">Completed Contributions</div>
            <div className="text-2xl font-bold text-white font-mono tracking-tight">
              {donorStats.donationCount} {donorStats.donationCount === 1 ? 'gift' : 'gifts'}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              100% receipted &amp; reconciled
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
            <div className="text-xs text-slate-400 mb-1">Active Recurring Support</div>
            <div className="text-2xl font-bold text-cyan-300 font-mono tracking-tight">
              {formatGBP(donorStats.monthlyRecurringGBP)}
              <span className="text-xs font-sans text-slate-400 font-normal">/mo</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {donorStats.activeRecurring.length} scheduled gift plan
            </div>
          </div>
        </div>
      </div>

      {/* Recurring Donations Management Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Repeat className="w-5 h-5 text-amber-400" />
              <span>Manage Recurring Contributions</span>
            </h3>
            <p className="text-xs text-slate-400">
              Sustained recurring gifts provide predictable resources for continuous leaflet re-orders and patient signposts.
            </p>
          </div>

          <button
            onClick={() => setShowRecurringModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 cursor-pointer flex-shrink-0"
          >
            <Heart className="w-4 h-4" />
            <span>Set Up Recurring Gift</span>
          </button>
        </div>

        {/* List of Recurring Schedules */}
        {recurringDonations.filter(
          r => r.donorEmail.toLowerCase() === activeDonor.email.toLowerCase()
        ).length === 0 ? (
          <div className="bg-slate-950 rounded-2xl p-6 text-center text-slate-400 text-xs border border-slate-800/80 space-y-3">
            <p>You do not currently have any active recurring gifts under this profile.</p>
            <button
              onClick={() => setShowRecurringModal(true)}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 font-medium text-xs transition-colors"
            >
              Start a Monthly £15 Awareness Gift
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recurringDonations
              .filter(r => r.donorEmail.toLowerCase() === activeDonor.email.toLowerCase())
              .map(rec => (
                <div
                  key={rec.id}
                  className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-base font-bold text-amber-400">
                        {formatGBP(rec.amountGBP)} / {rec.frequency}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                          rec.status === 'active'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : rec.status === 'paused'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-rose-950 text-rose-300 border border-rose-800'
                        }`}
                      >
                        {rec.status}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-slate-200">
                      {rec.campaignTitle}
                    </div>

                    <div className="space-y-1 text-[11px] text-slate-400 pt-1">
                      <div>PayPal Subscription ID: <span className="font-mono text-slate-300">{rec.paypalSubscriptionId}</span></div>
                      <div>Next Scheduled Billing: <span className="text-slate-300">{rec.nextBillingDate}</span></div>
                    </div>
                  </div>

                  {/* Actions to pause / resume / cancel */}
                  <div className="flex items-center gap-2 pt-3 border-t border-slate-800 text-xs">
                    {rec.status === 'active' && (
                      <button
                        onClick={() => onToggleRecurringStatus(rec.id, 'paused')}
                        className="flex-1 py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <PauseCircle className="w-3.5 h-3.5" />
                        <span>Pause Gift</span>
                      </button>
                    )}

                    {rec.status === 'paused' && (
                      <button
                        onClick={() => onToggleRecurringStatus(rec.id, 'active')}
                        className="flex-1 py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-emerald-400 font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <PlayCircle className="w-3.5 h-3.5" />
                        <span>Resume Gift</span>
                      </button>
                    )}

                    {rec.status !== 'cancelled' && (
                      <button
                        onClick={() => onToggleRecurringStatus(rec.id, 'cancelled')}
                        className="py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-rose-400 font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancel</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Integrated PayPal Transaction History */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <History className="w-5 h-5 text-cyan-400" />
              <span>PayPal Transaction History</span>
            </h3>
            <p className="text-xs text-slate-400">
              Verified records processed through PayPal.me/dlinacre16 matched with public transparency entries.
            </p>
          </div>

          <span className="text-xs text-slate-400">
            {donorStats.donorDonations.length} {donorStats.donorDonations.length === 1 ? 'Record' : 'Records'}
          </span>
        </div>

        {donorStats.donorDonations.length === 0 ? (
          <div className="bg-slate-950 p-6 rounded-2xl text-center text-slate-400 text-xs border border-slate-800 space-y-3">
            <p>No transactions found for this profile. Make your first contribution via PayPal.me.</p>
            <button
              onClick={() => onOpenDonate()}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
            >
              Donate Now
            </button>
          </div>
        ) : (
          <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">PayPal Transaction ID</th>
                  <th className="py-3 px-4">Allocation Drive</th>
                  <th className="py-3 px-4 text-center">Audit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {donorStats.donorDonations.map(don => (
                  <tr key={don.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-300">{don.date}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400 text-sm">
                      {formatGBP(don.amountGBP)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {don.paypalTransactionId || 'PayPal Direct'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-[11px]">
                        {don.allocatedCategory ? getCategoryLabel(don.allocatedCategory) : 'General Awareness'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Verified</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Set Up Recurring Gift Modal */}
      {showRecurringModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="recurring-modal-title"
        >
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-slate-100 shadow-2xl relative">
            <h3 id="recurring-modal-title" className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Repeat className="w-5 h-5 text-amber-400" />
              <span>Set Up Recurring Awareness Support</span>
            </h3>

            <form onSubmit={handleCreateRecurring} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Monthly Gift Amount (£ GBP)</label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {['10', '15', '25', '50'].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setRecAmount(amt)}
                      className={`py-2 rounded-xl border text-center font-bold ${
                        recAmount === amt
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      £{amt}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min="1"
                  required
                  value={recAmount}
                  onChange={e => setRecAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                  placeholder="Custom amount"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Billing Cadence</label>
                <select
                  value={recFrequency}
                  onChange={e => setRecFrequency(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annual">Annual</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Allocated Campaign Drive</label>
                <select
                  value={recCampaignId}
                  onChange={e => setRecCampaignId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                >
                  {campaigns.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400">
                Processed with zero admin fees through PayPal.me/dlinacre16. You can pause or cancel at any time in this portal.
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowRecurringModal(false)}
                  className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold"
                >
                  Confirm Recurring Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
