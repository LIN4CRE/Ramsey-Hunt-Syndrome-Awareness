import React from 'react';
import { MilestoneItem } from '../types';
import { formatGBP } from '../utils/transparency';
import { ChevronDown, ChevronUp, RotateCw, Eye, Sparkles, Sliders, ExternalLink } from 'lucide-react';

interface CollapsibleDockProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  explodedFactor: number;
  onExplodedChange: (val: number) => void;
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
  cameraPreset: 'hero' | 'nerve' | 'core' | 'overhead';
  onSelectCameraPreset: (preset: 'hero' | 'nerve' | 'core' | 'overhead') => void;
  milestones: MilestoneItem[];
  selectedMilestoneId: string | null;
  onSelectMilestone: (id: string | null) => void;
  onOpenDonate: () => void;
}

export const CollapsibleDock: React.FC<CollapsibleDockProps> = ({
  isCollapsed,
  onToggleCollapse,
  explodedFactor,
  onExplodedChange,
  autoRotate,
  onToggleAutoRotate,
  cameraPreset,
  onSelectCameraPreset,
  milestones,
  selectedMilestoneId,
  onSelectMilestone,
  onOpenDonate,
}) => {
  const selectedMilestone = milestones.find(m => m.id === selectedMilestoneId);

  return (
    <aside
      className="fixed z-30 transition-transform duration-300 ease-out"
      style={{
        bottom: '16px',
        left: '50%',
        transform: isCollapsed ? 'translate(-50%, calc(100% - 38px))' : 'translate(-50%, 0)',
        width: 'min(940px, 94vw)',
      }}
      aria-label="3D Scene Control Dock"
    >
      <div className="bg-slate-950/95 border border-slate-800 rounded-2xl shadow-2xl text-slate-100 overflow-hidden">
        {/* Dock Header & Collapse Toggle */}
        <div className="px-4 py-2 bg-slate-900 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-xs font-semibold tracking-wide uppercase text-slate-300">
              Transparency Beacon 3D Controls
            </span>
            {selectedMilestone && (
              <span className="text-xs text-amber-400 font-medium hidden sm:inline">
                • Active: {selectedMilestone.name}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleCollapse}
              className="px-2.5 py-1 rounded text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              aria-label={isCollapsed ? 'Show 3D Controls' : 'Hide 3D Controls (Zen Mode)'}
              title="Shortcut: Press 'H' to toggle"
            >
              {isCollapsed ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5" />
                  <span>Show Controls</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5" />
                  <span>Zen / Cinema Mode</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Dock Body */}
        <div className="p-3 sm:p-4 space-y-3">
          {/* Active Milestone Card (if selected via raycasting or pill) */}
          {selectedMilestone && (
            <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-start gap-3">
                <div
                  className="w-3.5 h-3.5 rounded-full mt-0.5 flex-shrink-0"
                  style={{ backgroundColor: selectedMilestone.colorHex }}
                />
                <div>
                  <div className="font-semibold text-slate-100 text-sm">
                    {selectedMilestone.name}
                  </div>
                  <p className="text-slate-400 mt-0.5 leading-relaxed">
                    {selectedMilestone.description}
                  </p>
                  <div className="text-slate-300 mt-1 font-mono text-[11px]">
                    Impact: <span className="text-cyan-300">{selectedMilestone.impactMetric}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0 justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">Allocation</div>
                  <div className="font-bold text-amber-300">
                    {formatGBP(selectedMilestone.spentGBP)} / {formatGBP(selectedMilestone.budgetGBP)}
                  </div>
                </div>
                <button
                  onClick={() => onSelectMilestone(null)}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          )}

          {/* Controls Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center text-xs">
            {/* Camera Presets */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                Camera Vantage
              </label>
              <div className="grid grid-cols-4 gap-1">
                {(
                  [
                    { id: 'hero', label: 'Hero' },
                    { id: 'nerve', label: 'Nerve' },
                    { id: 'core', label: 'Core' },
                    { id: 'overhead', label: 'Top' },
                  ] as const
                ).map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => onSelectCameraPreset(preset.id)}
                    className={`py-1.5 px-2 rounded font-medium transition-colors cursor-pointer text-center ${
                      cameraPreset === preset.id
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-300'
                    }`}
                    aria-label={`Switch camera to ${preset.label} view`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Exploded View Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <label
                  htmlFor="exploded-slider"
                  className="font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  Exploded Assembly
                </label>
                <span className="font-mono text-cyan-300 font-semibold">
                  {Math.round(explodedFactor * 100)}%
                </span>
              </div>
              <input
                id="exploded-slider"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={explodedFactor}
                onChange={e => onExplodedChange(parseFloat(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                aria-label="Adjust exploded view separation"
              />
            </div>

            {/* Rotation & Quick Action */}
            <div className="flex items-center justify-between gap-2 pt-1 sm:pt-0">
              <button
                onClick={onToggleAutoRotate}
                className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                  autoRotate
                    ? 'bg-cyan-950/80 border border-cyan-700/60 text-cyan-300'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
                aria-label={autoRotate ? 'Pause 3D rotation' : 'Start 3D rotation'}
              >
                <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
                <span>{autoRotate ? 'Orbiting' : 'Orbit Paused'}</span>
              </button>

              <button
                onClick={onOpenDonate}
                className="flex-1 py-2 px-3 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold transition-all shadow cursor-pointer text-center"
                aria-label="Direct PayPal.me Contribution"
              >
                PayPal.me
              </button>
            </div>
          </div>

          {/* Milestone Category Filter Pills */}
          <div className="pt-1 border-t border-slate-900 flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
            <span className="text-slate-500 font-medium whitespace-nowrap pl-0.5">Focus:</span>
            {milestones.map(m => (
              <button
                key={m.id}
                onClick={() => onSelectMilestone(selectedMilestoneId === m.id ? null : m.id)}
                className={`px-2.5 py-1 rounded-full whitespace-nowrap font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedMilestoneId === m.id
                    ? 'bg-slate-800 text-white ring-1 ring-amber-400'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
                aria-label={`Highlight ${m.name}`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: m.colorHex }} />
                <span>{m.name.split('&')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};
