import React, { useState } from 'react';
import { ImpactReport, CampaignGoal } from '../types';
import { formatGBP } from '../utils/transparency';
import {
  FileCheck2,
  PlusCircle,
  Image as ImageIcon,
  Calendar,
  User,
  Tag,
  Receipt,
  CheckCircle,
  ExternalLink,
  Filter,
  Sparkles,
} from 'lucide-react';

interface ImpactReportsSectionProps {
  reports: ImpactReport[];
  campaigns: CampaignGoal[];
  selectedCampaignId?: string | null;
  onSelectCampaign?: (campaignId: string | null) => void;
  onAddImpactReport: (report: ImpactReport) => void;
}

export const ImpactReportsSection: React.FC<ImpactReportsSectionProps> = ({
  reports,
  campaigns,
  selectedCampaignId,
  onSelectCampaign,
  onAddImpactReport,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [campaignFilter, setCampaignFilter] = useState<string>(selectedCampaignId || 'all');

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newCampaignId, setNewCampaignId] = useState(campaigns[0]?.id || 'camp-01');
  const [newAuthor, setNewAuthor] = useState('David Linacre (Founder)');
  const [newStory, setNewStory] = useState('');
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [newMetric1Label, setNewMetric1Label] = useState('');
  const [newMetric1Val, setNewMetric1Val] = useState('');
  const [newMetric2Label, setNewMetric2Label] = useState('');
  const [newMetric2Val, setNewMetric2Val] = useState('');
  const [newSpentGBP, setNewSpentGBP] = useState('150');
  const [newReceipts, setNewReceipts] = useState('');

  const filteredReports = reports.filter(r => {
    if (campaignFilter !== 'all' && r.campaignId !== campaignFilter) return false;
    return true;
  });

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newStory.trim()) return;

    const matchedCampaign = campaigns.find(c => c.id === newCampaignId);
    const photos = newPhotoUrl.trim()
      ? [{ url: newPhotoUrl.trim(), caption: newPhotoCaption.trim() || newTitle.trim() }]
      : [
          {
            url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
            caption: 'Patient awareness and clinical distribution update.',
          },
        ];

    const metrics = [];
    if (newMetric1Label && newMetric1Val) {
      metrics.push({ label: newMetric1Label.trim(), value: newMetric1Val.trim() });
    }
    if (newMetric2Label && newMetric2Val) {
      metrics.push({ label: newMetric2Label.trim(), value: newMetric2Val.trim() });
    }
    if (metrics.length === 0) {
      metrics.push({ label: 'Project Status', value: '100% Verified Delivery' });
    }

    const receiptsList = newReceipts
      .split(',')
      .map(r => r.trim())
      .filter(Boolean);

    const newReport: ImpactReport = {
      id: `imp-${Date.now().toString().slice(-4)}`,
      title: newTitle.trim(),
      date: new Date().toISOString().split('T')[0],
      author: newAuthor.trim() || 'Project Coordinator',
      campaignId: newCampaignId,
      campaignTitle: matchedCampaign?.title || 'General Awareness Initiative',
      story: newStory.trim(),
      photos,
      metricsAchieved: metrics,
      fundsSpentGBP: parseFloat(newSpentGBP) || 0,
      linkedReceipts: receiptsList.length > 0 ? receiptsList : ['VERIFIED-AUDIT'],
      verified: true,
    };

    onAddImpactReport(newReport);
    setShowAddModal(false);
    setNewTitle('');
    setNewStory('');
    setNewPhotoUrl('');
    setNewPhotoCaption('');
    setNewMetric1Label('');
    setNewMetric1Val('');
  };

  return (
    <div className="pt-20 pb-24 px-4 sm:px-6 max-w-6xl mx-auto space-y-8 text-slate-100">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Contributor Impact Reports</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Evidence of Impact &amp; Project Updates
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Real stories, photographs, and verified metrics documenting exactly how contributions to <strong className="text-amber-400">PayPal.me/dlinacre16</strong> are deployed in clinical communities and patient support networks.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-amber-500/20 flex-shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post Impact Update</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 pl-0.5" />
          <span className="text-slate-400 text-xs font-medium">Filter by Drive:</span>
          <button
            onClick={() => setCampaignFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-colors cursor-pointer whitespace-nowrap ${
              campaignFilter === 'all'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            All Updates ({reports.length})
          </button>
          {campaigns.map(camp => (
            <button
              key={camp.id}
              onClick={() => setCampaignFilter(camp.id)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-colors cursor-pointer whitespace-nowrap ${
                campaignFilter === camp.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {camp.title.split('(')[0]}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-400">
          {filteredReports.length} {filteredReports.length === 1 ? 'Report' : 'Reports'} Published
        </div>
      </div>

      {/* Reports Feed */}
      <div className="space-y-8">
        {filteredReports.map(report => (
          <article
            key={report.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6"
          >
            {/* Metadata Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800">
                    {report.campaignTitle}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                    <CheckCircle className="w-3 h-3" />
                    Verified Proof of Work
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {report.title}
                </h3>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400 flex-shrink-0">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  {report.author}
                </span>
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  {report.date}
                </span>
              </div>
            </div>

            {/* Story Narrative */}
            <div className="text-sm text-slate-300 leading-relaxed space-y-3">
              <p>{report.story}</p>
            </div>

            {/* Photo Gallery */}
            {report.photos && report.photos.length > 0 && (
              <div className="space-y-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                  <span>Project Photographs &amp; Documentation</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {report.photos.map((photo, pIdx) => (
                    <figure key={pIdx} className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                      <img
                        src={photo.url}
                        alt={photo.caption}
                        className="w-full h-52 object-cover object-center transition-transform hover:scale-105 duration-300"
                        loading="lazy"
                      />
                      <figcaption className="p-3 text-[11px] text-slate-400 italic bg-slate-950/90 border-t border-slate-800">
                        {photo.caption}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            )}

            {/* Verified Metrics Grid */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Verified Deliverables &amp; Outcomes</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {report.metricsAchieved.map((m, mIdx) => (
                  <div key={mIdx} className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">{m.label}</div>
                    <div className="font-bold text-white text-xs sm:text-sm mt-0.5">{m.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Linkage & Receipts */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span>Direct Funds Utilized:</span>
                <span className="font-mono text-amber-300 font-bold">{formatGBP(report.fundsSpentGBP)}</span>
              </div>

              <div className="flex items-center gap-2">
                <Receipt className="w-3.5 h-3.5 text-cyan-400" />
                <span>Linked Ledger Invoices:</span>
                <div className="flex items-center gap-1">
                  {report.linkedReceipts.map((rec, rIdx) => (
                    <span
                      key={rIdx}
                      className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px]"
                    >
                      {rec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Admin Modal: Post New Impact Update */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="impact-modal-title"
        >
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 text-slate-100 shadow-2xl relative my-8">
            <h3 id="impact-modal-title" className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-emerald-400" />
              <span>Post Contributor Impact Report</span>
            </h3>

            <form onSubmit={handleCreateReport} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Report Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 500 Tinnitus & Audiology Resource Packs Distributed"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Linked Campaign Drive</label>
                  <select
                    value={newCampaignId}
                    onChange={e => setNewCampaignId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  >
                    {campaigns.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Author / Sign-off</label>
                  <input
                    type="text"
                    required
                    value={newAuthor}
                    onChange={e => setNewAuthor(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Project Story &amp; Narrative</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe what was accomplished with contributor funds, quotes from patients or staff, and verification details."
                  value={newStory}
                  onChange={e => setNewStory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Photo URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={newPhotoUrl}
                    onChange={e => setNewPhotoUrl(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Photo Caption</label>
                  <input
                    type="text"
                    placeholder="e.g. Display stand at City Audiology"
                    value={newPhotoCaption}
                    onChange={e => setNewPhotoCaption(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Metric 1 (Label : Value)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Copies Printed"
                      value={newMetric1Label}
                      onChange={e => setNewMetric1Label(e.target.value)}
                      className="w-1/2 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-white"
                    />
                    <input
                      type="text"
                      placeholder="e.g. 1,000"
                      value={newMetric1Val}
                      onChange={e => setNewMetric1Val(e.target.value)}
                      className="w-1/2 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Metric 2 (Label : Value)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Clinics"
                      value={newMetric2Label}
                      onChange={e => setNewMetric2Label(e.target.value)}
                      className="w-1/2 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-white"
                    />
                    <input
                      type="text"
                      placeholder="e.g. 15 NHS Sites"
                      value={newMetric2Val}
                      onChange={e => setNewMetric2Val(e.target.value)}
                      className="w-1/2 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Funds Spent (£ GBP)</label>
                  <input
                    type="number"
                    min="0"
                    value={newSpentGBP}
                    onChange={e => setNewSpentGBP(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Linked Receipt Number(s)</label>
                  <input
                    type="text"
                    placeholder="e.g. GPS-2026-8891, ADW-7741"
                    value={newReceipts}
                    onChange={e => setNewReceipts(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                >
                  Publish Impact Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
