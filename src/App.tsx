import React, { useState, useEffect, useMemo } from 'react';
import {
  INITIAL_DONATIONS,
  INITIAL_EXPENSES,
  INITIAL_MILESTONES,
  INITIAL_CAMPAIGNS,
  INITIAL_IMPACT_REPORTS,
  INITIAL_DONOR_PROFILES,
  INITIAL_RECURRING_DONATIONS,
  computeTransparencySummary,
  formatGBP,
} from './utils/transparency';
import {
  simulateIncomingPayPalDonation,
  performAutomatedAudit,
  AutomatedAuditReport,
} from './utils/automation';
import { sound } from './utils/audio';
import {
  DonationRecord,
  ExpenseRecord,
  MilestoneItem,
  CampaignGoal,
  ImpactReport,
  DonorProfile,
  RecurringDonation,
} from './types';
import { ThreeBeaconScene } from './components/ThreeBeaconScene';
import { NavigationHeader, ActiveNavTab } from './components/NavigationHeader';
import { CollapsibleDock } from './components/CollapsibleDock';
import { DonationModal } from './components/DonationModal';
import { ReceiptViewerModal } from './components/ReceiptViewerModal';
import { TransparencyLedgerView } from './components/TransparencyLedgerView';
import { ReportingToolsView } from './components/ReportingToolsView';
import { AwarenessHubView } from './components/AwarenessHubView';
import { CampaignGoalTracker } from './components/CampaignGoalTracker';
import { ImpactReportsSection } from './components/ImpactReportsSection';
import { DonorPortalView } from './components/DonorPortalView';
import { AutomationStatusBar } from './components/AutomationStatusBar';
import { AuditReportModal } from './components/AuditReportModal';
import { Target, ArrowRight, Heart } from 'lucide-react';

export default function App() {
  // State with localStorage persistence
  const [donations, setDonations] = useState<DonationRecord[]>(() => {
    try {
      const stored = localStorage.getItem('rh_donations');
      return stored ? JSON.parse(stored) : INITIAL_DONATIONS;
    } catch {
      return INITIAL_DONATIONS;
    }
  });

  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() => {
    try {
      const stored = localStorage.getItem('rh_expenses');
      return stored ? JSON.parse(stored) : INITIAL_EXPENSES;
    } catch {
      return INITIAL_EXPENSES;
    }
  });

  const [campaigns, setCampaigns] = useState<CampaignGoal[]>(() => {
    try {
      const stored = localStorage.getItem('rh_campaigns');
      return stored ? JSON.parse(stored) : INITIAL_CAMPAIGNS;
    } catch {
      return INITIAL_CAMPAIGNS;
    }
  });

  const [impactReports, setImpactReports] = useState<ImpactReport[]>(() => {
    try {
      const stored = localStorage.getItem('rh_impact_reports');
      return stored ? JSON.parse(stored) : INITIAL_IMPACT_REPORTS;
    } catch {
      return INITIAL_IMPACT_REPORTS;
    }
  });

  const [donorProfiles, setDonorProfiles] = useState<DonorProfile[]>(() => {
    try {
      const stored = localStorage.getItem('rh_donor_profiles');
      return stored ? JSON.parse(stored) : INITIAL_DONOR_PROFILES;
    } catch {
      return INITIAL_DONOR_PROFILES;
    }
  });

  const [recurringDonations, setRecurringDonations] = useState<RecurringDonation[]>(() => {
    try {
      const stored = localStorage.getItem('rh_recurring_donations');
      return stored ? JSON.parse(stored) : INITIAL_RECURRING_DONATIONS;
    } catch {
      return INITIAL_RECURRING_DONATIONS;
    }
  });

  // Active navigation tab (default to patient-led awareness hub)
  const [activeTab, setActiveTab] = useState<ActiveNavTab>('awareness');

  // Modals & Navigation filters
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [donateCampaignId, setDonateCampaignId] = useState<string | null>(null);
  const [activeReceiptExpense, setActiveReceiptExpense] = useState<ExpenseRecord | null>(null);
  const [filterCampaignForImpact, setFilterCampaignForImpact] = useState<string | null>(null);
  const [activeAuditModal, setActiveAuditModal] = useState<AutomatedAuditReport | null>(null);

  // 3D Scene Interactive Controls
  const [isDockCollapsed, setIsDockCollapsed] = useState(false);
  const [explodedFactor, setExplodedFactor] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [cameraPreset, setCameraPreset] = useState<'hero' | 'nerve' | 'core' | 'overhead'>('hero');
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(null);
  const [pulseTrigger, setPulseTrigger] = useState<number>(0);
  const [lastSimulatedDonor, setLastSimulatedDonor] = useState<string | null>(null);

  // Synchronize localStorage on modifications
  useEffect(() => {
    try {
      localStorage.setItem('rh_donations', JSON.stringify(donations));
    } catch (e) {
      console.warn('Unable to persist donations', e);
    }
  }, [donations]);

  useEffect(() => {
    try {
      localStorage.setItem('rh_expenses', JSON.stringify(expenses));
    } catch (e) {
      console.warn('Unable to persist expenses', e);
    }
  }, [expenses]);

  useEffect(() => {
    try {
      localStorage.setItem('rh_campaigns', JSON.stringify(campaigns));
    } catch (e) {
      console.warn('Unable to persist campaigns', e);
    }
  }, [campaigns]);

  useEffect(() => {
    try {
      localStorage.setItem('rh_impact_reports', JSON.stringify(impactReports));
    } catch (e) {
      console.warn('Unable to persist impact reports', e);
    }
  }, [impactReports]);

  useEffect(() => {
    try {
      localStorage.setItem('rh_recurring_donations', JSON.stringify(recurringDonations));
    } catch (e) {
      console.warn('Unable to persist recurring donations', e);
    }
  }, [recurringDonations]);

  // Compute live transparency summary
  const summary = useMemo(() => {
    return computeTransparencySummary(donations, expenses, 2000, 5000);
  }, [donations, expenses]);

  // Compute live automated audit report
  const auditReport = useMemo(() => {
    return performAutomatedAudit(expenses, summary.totalInflowsGBP, summary.totalOutflowsGBP);
  }, [expenses, summary]);

  // Reconcile milestone spending based on current expenses
  const milestones: MilestoneItem[] = useMemo(() => {
    return INITIAL_MILESTONES.map(m => {
      const categorySpent = expenses
        .filter(e => e.category === m.category)
        .reduce((sum, e) => sum + e.amountGBP, 0);
      return {
        ...m,
        spentGBP: categorySpent > 0 ? categorySpent : m.spentGBP,
      };
    });
  }, [expenses]);

  // Keyboard shortcut listener ('h' or 'H' to toggle dock in 3D view)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'h' || e.key === 'H') {
        setIsDockCollapsed(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenDonate = (campaignId?: string) => {
    sound.playSoftClick();
    setDonateCampaignId(campaignId || null);
    setIsDonateOpen(true);
  };

  const handleAddDonation = (newDonation: DonationRecord) => {
    setDonations(prev => [newDonation, ...prev]);
    sound.playDonationChime();
    setPulseTrigger(prev => prev + 1);

    // If new donor email, link to profiles
    if (newDonation.donorEmail && !donorProfiles.some(p => p.email.toLowerCase() === newDonation.donorEmail?.toLowerCase())) {
      const newProfile: DonorProfile = {
        id: `donor-${Date.now().toString().slice(-4)}`,
        name: newDonation.donorName,
        email: newDonation.donorEmail,
        isAnonymous: newDonation.isAnonymous,
        joinedDate: newDonation.date,
        badge: 'Verified Contributor',
      };
      setDonorProfiles(prev => [...prev, newProfile]);
    }
  };

  const handleSimulatePayPalInflow = () => {
    const newDonation = simulateIncomingPayPalDonation(campaigns, 25);
    setLastSimulatedDonor(newDonation.donorName);
    handleAddDonation(newDonation);
  };

  const handleAddExpense = (newExpense: ExpenseRecord) => {
    setExpenses(prev => [newExpense, ...prev]);
  };

  const handleAddCampaign = (newCamp: CampaignGoal) => {
    setCampaigns(prev => [...prev, newCamp]);
  };

  const handleAddImpactReport = (newReport: ImpactReport) => {
    setImpactReports(prev => [newReport, ...prev]);
  };

  const handleToggleRecurringStatus = (id: string, newStatus: 'active' | 'paused' | 'cancelled') => {
    sound.playSoftClick();
    setRecurringDonations(prev =>
      prev.map(r => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  const handleAddRecurring = (newRec: RecurringDonation) => {
    sound.playDonationChime();
    setRecurringDonations(prev => [newRec, ...prev]);
  };

  const handleSelectCampaignForImpact = (campaignId: string) => {
    sound.playSoftClick();
    setFilterCampaignForImpact(campaignId);
    setActiveTab('impact');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative selection:bg-amber-500 selection:text-slate-950">
      {/* Top Persistent Header */}
      <NavigationHeader
        summary={summary}
        activeTab={activeTab}
        onSelectTab={tab => {
          sound.playSoftClick();
          setActiveTab(tab);
        }}
        onOpenDonate={() => handleOpenDonate()}
      />

      {/* Main View Area */}
      <main className="flex-1 w-full relative">
        {activeTab === 'beacon' && (
          <div className="w-full h-screen relative overflow-hidden">
            {/* 3D WebGL Canvas Viewport (100% unobstructed center) */}
            <ThreeBeaconScene
              milestones={milestones}
              summary={summary}
              selectedMilestoneId={selectedMilestoneId}
              onSelectMilestone={setSelectedMilestoneId}
              explodedFactor={explodedFactor}
              autoRotate={autoRotate}
              cameraPreset={cameraPreset}
              pulseTrigger={pulseTrigger}
            />

            {/* Viewport Floating Goal & Spec Badge (Top Left, under header) */}
            <div className="absolute top-20 left-4 sm:left-6 z-20 pointer-events-auto select-none max-w-sm space-y-2">
              <div className="backdrop-blur-xl bg-slate-950/80 border border-slate-700/60 rounded-2xl p-4 shadow-2xl ring-1 ring-white/5">
                <div className="flex items-center justify-between text-[11px] font-semibold text-amber-400 uppercase tracking-wider mb-2">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Hope &amp; Transparency Beacon</span>
                  </span>
                  <span className="text-cyan-400 font-mono text-[10px] bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded-full">
                    100% Audited
                  </span>
                </div>

                {/* Main Goal Progress Bar */}
                <div className="space-y-1.5 pt-1 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-300">Phase 1 Campaign Goal:</span>
                    <span className="text-emerald-400 font-bold">
                      {formatGBP(summary.totalInflowsGBP)} / £2,000
                    </span>
                  </div>
                  <div className="w-full bg-slate-900/90 h-2.5 rounded-full overflow-hidden p-0.5 ring-1 ring-slate-800">
                    <div
                      className="bg-gradient-to-r from-cyan-500 via-amber-500 to-emerald-400 h-full rounded-full transition-all duration-500 shadow-sm shadow-emerald-500/50"
                      style={{ width: `${Math.min(100, (summary.totalInflowsGBP / 2000) * 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                    <span className="font-medium text-slate-300">
                      {((summary.totalInflowsGBP / 2000) * 100).toFixed(0)}% Funded
                    </span>
                    <button
                      onClick={() => {
                        sound.playSoftClick();
                        setActiveTab('goals');
                      }}
                      className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-0.5 cursor-pointer transition-colors"
                    >
                      <span>Explore Drives</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Quick Real-Time Reserve & Solvency Ticker */}
                <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-slate-800/80 text-[11px] font-mono">
                  <div className="bg-slate-900/70 rounded-lg p-2 border border-slate-800/60">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">Outflows Reconciled</div>
                    <div className="text-slate-200 font-semibold">{formatGBP(summary.totalOutflowsGBP)}</div>
                  </div>
                  <div className="bg-slate-900/70 rounded-lg p-2 border border-slate-800/60">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">Active Reserve</div>
                    <div className="text-emerald-400 font-semibold">{formatGBP(summary.reserveBalanceGBP)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Collapsible Unified Bottom Control Dock */}
            <CollapsibleDock
              isCollapsed={isDockCollapsed}
              onToggleCollapse={() => {
                sound.playSoftClick();
                setIsDockCollapsed(prev => !prev);
              }}
              explodedFactor={explodedFactor}
              onExplodedChange={setExplodedFactor}
              autoRotate={autoRotate}
              onToggleAutoRotate={() => {
                sound.playSoftClick();
                setAutoRotate(prev => !prev);
              }}
              cameraPreset={cameraPreset}
              onSelectCameraPreset={preset => {
                sound.playSoftClick();
                setCameraPreset(preset);
              }}
              milestones={milestones}
              selectedMilestoneId={selectedMilestoneId}
              onSelectMilestone={setSelectedMilestoneId}
              onOpenDonate={() => handleOpenDonate()}
            />
          </div>
        )}

        {activeTab === 'goals' && (
          <CampaignGoalTracker
            campaigns={campaigns}
            donations={donations}
            onOpenDonate={handleOpenDonate}
            onSelectCampaignForImpact={handleSelectCampaignForImpact}
            onAddCampaign={handleAddCampaign}
          />
        )}

        {activeTab === 'impact' && (
          <ImpactReportsSection
            reports={impactReports}
            campaigns={campaigns}
            selectedCampaignId={filterCampaignForImpact}
            onSelectCampaign={setFilterCampaignForImpact}
            onAddImpactReport={handleAddImpactReport}
          />
        )}

        {activeTab === 'donors' && (
          <DonorPortalView
            donorProfiles={donorProfiles}
            donations={donations}
            recurringDonations={recurringDonations}
            campaigns={campaigns}
            onToggleRecurringStatus={handleToggleRecurringStatus}
            onOpenDonate={handleOpenDonate}
            onAddRecurring={handleAddRecurring}
          />
        )}

        {activeTab === 'ledger' && (
          <TransparencyLedgerView
            donations={donations}
            expenses={expenses}
            summary={summary}
            onOpenDonate={() => handleOpenDonate()}
            onViewReceipt={expense => setActiveReceiptExpense(expense)}
            onAddExpense={handleAddExpense}
          />
        )}

        {activeTab === 'reports' && (
          <ReportingToolsView
            donations={donations}
            expenses={expenses}
            summary={summary}
          />
        )}

        {activeTab === 'awareness' && (
          <AwarenessHubView
            onOpenDonate={() => handleOpenDonate()}
            onExploreGoals={() => setActiveTab('goals')}
            onViewLedger={() => setActiveTab('ledger')}
          />
        )}
      </main>

      {/* Persistent Docked Automation Status Bar */}
      <AutomationStatusBar
        onSimulateInflow={handleSimulatePayPalInflow}
        auditReport={auditReport}
        onRunAudit={() => {
          sound.playSoftClick();
          setActiveAuditModal(auditReport);
        }}
        lastSimulatedDonorName={lastSimulatedDonor}
      />

      {/* Global Modals */}
      <DonationModal
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
        onAddDonation={handleAddDonation}
        initialCampaignId={donateCampaignId}
      />

      <ReceiptViewerModal
        expense={activeReceiptExpense}
        onClose={() => setActiveReceiptExpense(null)}
      />

      <AuditReportModal
        report={activeAuditModal}
        onClose={() => setActiveAuditModal(null)}
      />
    </div>
  );
}
