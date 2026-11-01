import React, { useState } from 'react';
import { CampaignGoal, DonationRecord, ExpenseCategory } from '../types';
import { formatGBP, computeCampaignProgress, getCategoryLabel } from '../utils/transparency';
import {
  Target,
  PlusCircle,
  TrendingUp,
  Calendar,
  Users,
  CheckCircle,
  Heart,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface CampaignGoalTrackerProps {
  campaigns: CampaignGoal[];
  donations: DonationRecord[];
  onOpenDonate: (campaignId?: string) => void;
  onSelectCampaignForImpact?: (campaignId: string) => void;
  onAddCampaign: (newCampaign: CampaignGoal) => void;
}

export const CampaignGoalTracker: React.FC<CampaignGoalTrackerProps> = ({
  campaigns,
  donations,
  onOpenDonate,
  onSelectCampaignForImpact,
  onAddCampaign,
}) => {
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState('500');
  const [newCategory, setNewCategory] = useState<ExpenseCategory>('awareness_leaflets');
  const [newDeadline, setNewDeadline] = useState('2026-12-31');
  const [newDescription, setNewDescription] = useState('');
  const [newBeneficiary, setNewBeneficiary] = useState('');

  const filteredCampaigns = campaigns.filter(c => {
    if (selectedCategoryFilter !== 'all' && c.category !== selectedCategoryFilter) return false;
    return true;
  });

  const totalCampaignTarget = campaigns.reduce((sum, c) => sum + c.targetGBP, 0);
  const totalCampaignRaised = campaigns.reduce((sum, c) => {
    const p = computeCampaignProgress(c, donations);
    return sum + p.raisedGBP;
  }, 0);
  const overallPercent = totalCampaignTarget > 0 ? Math.min(100, Math.round((totalCampaignRaised / totalCampaignTarget) * 100)) : 0;

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    const targetVal = parseFloat(newTarget);
    if (!newTitle.trim() || isNaN(targetVal) || targetVal <= 0) return;

    const colors: Record<ExpenseCategory, string> = {
      patient_guides: '#38bdf8',
      audiology_signposts: '#818cf8',
      awareness_leaflets: '#34d399',
      digital_infrastructure: '#f59e0b',
      volunteer_coordination: '#ec4899',
      governance_contingency: '#a855f7',
    };

    const newCamp: CampaignGoal = {
      id: `camp-${Date.now().toString().slice(-4)}`,
      title: newTitle.trim(),
      slug: newTitle.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      targetGBP: targetVal,
      currentGBP: 0,
      category: newCategory,
      deadline: newDeadline || '2026-12-31',
      description: newDescription.trim() || 'Community-backed Ramsay Hunt awareness and patient support campaign.',
      status: 'active',
      colorHex: colors[newCategory] || '#38bdf8',
      donorCount: 0,
      beneficiaryGroup: newBeneficiary.trim() || 'Patients & medical professionals',
    };

    onAddCampaign(newCamp);
    setShowAddGoalModal(false);
    setNewTitle('');
    setNewTarget('500');
    setNewDescription('');
    setNewBeneficiary('');
  };

  return (
    <div className="pt-20 pb-24 px-4 sm:px-6 max-w-7xl mx-auto space-y-8 text-slate-100">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
              <Target className="w-3.5 h-3.5" />
              <span>Real-Time Donation Goal Tracker</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Transparent Fundraising Goals &amp; Campaign Drives
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Every pound donated through <strong className="text-amber-400">PayPal.me/dlinacre16</strong> is transparently routed toward specific, measurable project goals. Track live progress, funding velocity, and beneficiary impact.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 flex-shrink-0">
            <button
              onClick={() => setShowAddGoalModal(true)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer border border-slate-700"
            >
              <PlusCircle className="w-4 h-4 text-cyan-400" />
              <span>Create Goal Drive</span>
            </button>
            <button
              onClick={() => onOpenDonate()}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Heart className="w-4 h-4" />
              <span>Fund Active Drive</span>
            </button>
          </div>
        </div>

        {/* Overall Platform Progress Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs mb-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-200">Total Campaign Target Allocation:</span>
              <span className="font-mono text-emerald-400 font-bold text-sm">
                {formatGBP(totalCampaignRaised)} / {formatGBP(totalCampaignTarget)}
              </span>
            </div>
            <div className="text-slate-400">
              <strong className="text-white">{overallPercent}%</strong> of active campaign goals funded
            </div>
          </div>

          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-amber-500 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${overallPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 text-xs">
          <span className="text-slate-400 text-xs font-medium pl-1">Category:</span>
          {(
            [
              { id: 'all', label: 'All Drives' },
              { id: 'awareness_leaflets', label: 'Leaflets' },
              { id: 'patient_guides', label: 'Clinical Guides' },
              { id: 'audiology_signposts', label: 'Audiology' },
              { id: 'governance_contingency', label: 'Registration Buffer' },
            ] as const
          ).map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategoryFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-colors cursor-pointer whitespace-nowrap ${
                selectedCategoryFilter === tab.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-400 font-medium">
          Showing {filteredCampaigns.length} Active {filteredCampaigns.length === 1 ? 'Campaign' : 'Campaigns'}
        </div>
      </div>

      {/* Campaign Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCampaigns.map(camp => {
          const progress = computeCampaignProgress(camp, donations);
          return (
            <div
              key={camp.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-6 shadow-xl flex flex-col justify-between transition-all group"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: camp.colorHex }}
                    />
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      {getCategoryLabel(camp.category)}
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    {camp.status === 'active' ? 'Active Drive' : 'Funded'}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors leading-snug">
                  {camp.title}
                </h3>

                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {camp.description}
                </p>

                {/* Beneficiary Pill */}
                <div className="mt-3 text-[11px] text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  <span>Beneficiary: <strong className="text-slate-100">{camp.beneficiaryGroup}</strong></span>
                </div>

                {/* Progress Graphical Bar */}
                <div className="mt-5 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-emerald-400 font-bold text-sm">
                      {formatGBP(progress.raisedGBP)}
                    </span>
                    <span className="text-slate-400">
                      Target: <strong className="text-slate-200">{formatGBP(camp.targetGBP)}</strong>
                    </span>
                  </div>

                  <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${progress.percent}%`,
                        backgroundColor: camp.colorHex,
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-semibold text-white">{progress.percent}% funded</span>
                    <span>
                      {progress.remainingGBP > 0
                        ? `${formatGBP(progress.remainingGBP)} to goal`
                        : 'Goal fully reached!'}
                    </span>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    <span>{progress.donorCount} Verified Contributors</span>
                  </div>
                  <div className="flex items-center gap-1.5 justify-end">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>Deadline: {camp.deadline}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-800">
                {onSelectCampaignForImpact && (
                  <button
                    onClick={() => onSelectCampaignForImpact(camp.id)}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>View Impact</span>
                    <ArrowRight className="w-3 h-3 text-cyan-400" />
                  </button>
                )}
                <button
                  onClick={() => onOpenDonate(camp.id)}
                  className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5" />
                  <span>Support (PayPal.me)</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Admin Modal: Create New Campaign Goal */}
      {showAddGoalModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="new-goal-title"
        >
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 text-slate-100 shadow-2xl relative">
            <h3 id="new-goal-title" className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-cyan-400" />
              <span>Create New Fundraising Goal Drive</span>
            </h3>

            <form onSubmit={handleCreateCampaign} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Campaign Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hospital ENT & Audiology Display Stands"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Target Amount (£ GBP)</label>
                  <input
                    type="number"
                    min="10"
                    required
                    value={newTarget}
                    onChange={e => setNewTarget(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Target Deadline</label>
                  <input
                    type="date"
                    required
                    value={newDeadline}
                    onChange={e => setNewDeadline(e.target.value)}
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
                    <option value="governance_contingency">Charity Commission Reserve</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Beneficiary Group</label>
                  <input
                    type="text"
                    placeholder="e.g. Outpatient waiting rooms"
                    value={newBeneficiary}
                    onChange={e => setNewBeneficiary(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Drive Description &amp; Purpose</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe what these funds will specifically deliver and how outcomes are verified."
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddGoalModal(false)}
                  className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                >
                  Publish Goal Drive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
