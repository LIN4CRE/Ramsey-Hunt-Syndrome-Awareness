import React, { useState } from 'react';
import { DonationRecord, ExpenseCategory } from '../types';
import { formatGBP } from '../utils/transparency';
import { Heart, X, CheckCircle, ExternalLink, ShieldAlert, Copy, Check } from 'lucide-react';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDonation: (donation: DonationRecord) => void;
  initialCampaignId?: string | null;
}

const TIER_OPTIONS = [
  { amount: 5, label: '£5 Awareness Supporter', desc: 'Funds 40 patient awareness cards' },
  { amount: 15, label: '£15 Clinic Outreach', desc: 'Signpost pack for local GP or audiology unit' },
  { amount: 25, label: '£25 Medical Accuracy Review', desc: 'Supports clinical fact-checking & verified drafting' },
  { amount: 50, label: '£50 Digital Infrastructure', desc: '1 month of verified edge hosting & privacy SSL' },
  { amount: 100, label: '£100 Major Milestone Champion', desc: 'Direct contribution to independent registration reserve' },
];

export const DonationModal: React.FC<DonationModalProps> = ({
  isOpen,
  onClose,
  onAddDonation,
  initialCampaignId,
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(25);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donorName, setDonorName] = useState<string>('');
  const [donorEmail, setDonorEmail] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [transactionRef, setTransactionRef] = useState<string>('');
  const [donorMessage, setDonorMessage] = useState<string>('');
  const [allocatedCategory, setAllocatedCategory] = useState<ExpenseCategory>('patient_guides');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isSuccessSubmitted, setIsSuccessSubmitted] = useState(false);

  if (!isOpen) return null;

  const effectiveAmount = customAmount ? parseFloat(customAmount) || 0 : selectedAmount;
  const paypalUrl = `https://www.paypal.com/paypalme/dlinacre16/${effectiveAmount > 0 ? effectiveAmount : ''}GBP`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(paypalUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleRecordContribution = (e: React.FormEvent) => {
    e.preventDefault();
    if (effectiveAmount <= 0) return;

    const newRecord: DonationRecord = {
      id: `don-${Date.now().toString().slice(-6)}`,
      donorName: isAnonymous ? 'Anonymous Supporter' : (donorName.trim() || 'Supporter'),
      donorEmail: donorEmail.trim() || undefined,
      isAnonymous,
      amountGBP: effectiveAmount,
      date: new Date().toISOString().split('T')[0],
      paypalTransactionId: transactionRef.trim() || `PP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      donorMessage: donorMessage.trim() || undefined,
      allocatedCategory,
      campaignId: initialCampaignId || undefined,
      verified: true,
    };

    onAddDonation(newRecord);
    setIsSuccessSubmitted(true);
    setTimeout(() => {
      setIsSuccessSubmitted(false);
      onClose();
    }, 2200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="donation-modal-title"
    >
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 text-slate-100 shadow-2xl relative my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close donation modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccessSubmitted ? (
          <div className="text-center py-10 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto flex items-center justify-center">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Thank You for Your Support!</h3>
            <p className="text-slate-300 text-sm max-w-md mx-auto">
              Your contribution of <strong className="text-emerald-300">{formatGBP(effectiveAmount)}</strong> has been recorded in the real-time public transparency ledger.
            </p>
            <p className="text-xs text-slate-400">Updating live beacon and ledger metrics...</p>
          </div>
        ) : (
          <>
            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h2 id="donation-modal-title" className="text-lg font-bold text-white">
                  Contribute via PayPal.me
                </h2>
                <p className="text-xs text-slate-400">
                  Direct recipient: <span className="text-amber-300 font-mono">PayPal.me/dlinacre16</span> (100% transparently tracked)
                </p>
              </div>
            </div>

            {/* Step 1: Select Tier */}
            <div className="space-y-4 mb-6">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block">
                1. Select Donation Amount
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {TIER_OPTIONS.map(tier => (
                  <button
                    key={tier.amount}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(tier.amount);
                      setCustomAmount('');
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedAmount === tier.amount && !customAmount
                        ? 'border-amber-500 bg-amber-500/15 text-white ring-1 ring-amber-500'
                        : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-base text-amber-400">£{tier.amount}</div>
                    <div className="text-[11px] text-slate-400 leading-tight mt-0.5">{tier.desc}</div>
                  </button>
                ))}

                {/* Custom Amount input */}
                <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 flex flex-col justify-center">
                  <div className="text-[11px] font-medium text-slate-400 mb-1">Custom (£)</div>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 35"
                    value={customAmount}
                    onChange={e => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount(0);
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm font-semibold text-white focus:outline-none focus:border-amber-500"
                    aria-label="Enter custom contribution amount in GBP"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Launch PayPal Action */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-6 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400">Prepared Link:</span>
                  <div className="font-mono text-xs text-amber-300 font-medium truncate max-w-[280px] sm:max-w-[360px]">
                    {paypalUrl}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors flex items-center gap-1.5 flex-shrink-0"
                  aria-label="Copy PayPal link"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <a
                href={paypalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm text-center flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all block"
              >
                <span>Launch PayPal.me / £{effectiveAmount > 0 ? effectiveAmount : 'Custom'}</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                Opens your secure PayPal interface. Include note <em>"Ramsay Hunt Awareness"</em> in the transaction reference if desired.
              </p>
            </div>

            {/* Step 3: Record to Real-Time Transparency Ledger */}
            <form onSubmit={handleRecordContribution} className="space-y-3 border-t border-slate-800 pt-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  2. Record to Real-Time Public Ledger
                </span>
                <span className="text-[11px] text-emerald-400 font-medium">Instant ledger update</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="donor-name" className="block text-xs text-slate-300 mb-1">
                    Your Name (or Contributor Handle)
                  </label>
                  <input
                    id="donor-name"
                    type="text"
                    disabled={isAnonymous}
                    placeholder="e.g. Dr. Eleanor Shaw"
                    value={donorName}
                    onChange={e => setDonorName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white disabled:opacity-50 focus:outline-none focus:border-amber-500"
                  />
                  <div className="mt-1 flex items-center gap-1.5">
                    <input
                      id="anon-check"
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={e => setIsAnonymous(e.target.checked)}
                      className="rounded accent-amber-500"
                    />
                    <label htmlFor="anon-check" className="text-[11px] text-slate-400 cursor-pointer">
                      List as Anonymous Supporter
                    </label>
                  </div>
                </div>

                <div>
                  <label htmlFor="donor-email" className="block text-xs text-slate-300 mb-1">
                    Your Email (for Donor Profile &amp; Statement)
                  </label>
                  <input
                    id="donor-email"
                    type="email"
                    placeholder="e.g. yourname@example.com"
                    value={donorEmail}
                    onChange={e => setDonorEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-[10px] text-slate-500">Links contribution to your personal donor portal</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="trans-ref" className="block text-xs text-slate-300 mb-1">
                    PayPal Transaction ID (Optional)
                  </label>
                  <input
                    id="trans-ref"
                    type="text"
                    placeholder="e.g. PP-889124X or leave blank"
                    value={transactionRef}
                    onChange={e => setTransactionRef(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-[10px] text-slate-500">Allows public reconciliation against statements</span>
                </div>

                <div>
                  <label htmlFor="category-select" className="block text-xs text-slate-300 mb-1">
                    Preferred Budget Allocation
                  </label>
                  <select
                    id="category-select"
                    value={allocatedCategory}
                    onChange={e => setAllocatedCategory(e.target.value as ExpenseCategory)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="patient_guides">Clinical Guides &amp; Signs</option>
                    <option value="audiology_signposts">Audiology &amp; Ear Health</option>
                    <option value="awareness_leaflets">Accessible Print Leaflets</option>
                    <option value="digital_infrastructure">Digital Infrastructure</option>
                    <option value="governance_contingency">Charity Commission Reserve</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="donor-msg" className="block text-xs text-slate-300 mb-1">
                    Encouraging Message / Note
                  </label>
                  <input
                    id="donor-msg"
                    type="text"
                    placeholder="e.g. With gratitude for raising awareness!"
                    value={donorMessage}
                    onChange={e => setDonorMessage(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={effectiveAmount <= 0}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>Record {formatGBP(effectiveAmount)} to Public Ledger</span>
              </button>
            </form>

            {/* Governance Disclaimer */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-start gap-2 text-[10px] text-slate-400">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
              <p>
                <strong>Transparency Guarantee:</strong> Every penny received at <em>PayPal.me/dlinacre16</em> is earmarked solely for verified Ramsay Hunt awareness activities. As detailed in the project launch pack, 100% of receipts are made publicly accessible without trustee skimming.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
