import React, { useState } from 'react';
import {
  Heart,
  ShieldAlert,
  ExternalLink,
  Users,
  Compass,
  FileCheck2,
  Clock,
  BatteryCharging,
  EyeOff,
  Volume2,
  Printer,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Info,
  ChevronRight,
  UserCheck,
  Building,
  Ear,
  Brain,
  Smile,
  ArrowRight
} from 'lucide-react';
import { sound } from '../utils/audio';

interface AwarenessHubViewProps {
  onOpenDonate: () => void;
  onExploreGoals?: () => void;
  onViewLedger?: () => void;
}

type InvisibleSymptomKey = 'fatigue' | 'tinnitus' | 'balance' | 'synkinesis' | 'pacing';

export const AwarenessHubView: React.FC<AwarenessHubViewProps> = ({
  onOpenDonate,
  onExploreGoals,
  onViewLedger,
}) => {
  // Privacy toggle for Founder Story
  const [showIdentity, setShowIdentity] = useState<boolean>(true);
  // Active tab in the Invisible Symptoms Matrix
  const [activeSymptom, setActiveSymptom] = useState<InvisibleSymptomKey>('fatigue');
  // Printable leaflet preview side
  const [leafletSide, setLeafletSide] = useState<1 | 2>(1);

  const handlePrintLeaflet = () => {
    sound.playSoftClick();
    window.print();
  };

  const invisibleSymptomsData: Record<
    InvisibleSymptomKey,
    {
      title: string;
      icon: React.ReactNode;
      tagline: string;
      medicalContext: string;
      livedReality: string;
      workplaceTip: string;
    }
  > = {
    fatigue: {
      title: 'Neurological Exhaustion & Fatigue',
      icon: <BatteryCharging className="w-5 h-5 text-amber-400" />,
      tagline: 'The immense cognitive energy required to process ordinary senses.',
      medicalContext:
        'When Cranial Nerves VII and VIII are inflamed or recovering from herpes zoster, the brain must exert constant, conscious compensatory effort to process auditory signals, maintain equilibrium, and manage facial motor control. This causes central neurological fatigue, distinctly different from regular tiredness.',
      livedReality:
        'Simple activities like a 30-minute conversation or grocery shopping can drain daily reserves completely. Sleep often fails to restore energy, requiring structured pacing and quiet darkness to recharge.',
      workplaceTip:
        'Allow flexible pacing, offer quiet desk spaces away from high foot-traffic, and permit written communication rather than long verbal briefings.',
    },
    tinnitus: {
      title: 'Tinnitus & Sensorineural Hearing Loss',
      icon: <Volume2 className="w-5 h-5 text-cyan-400" />,
      tagline: 'High-pitch ringing, distorted sound, and hearing aid dependence.',
      medicalContext:
        'Involvement of the vestibulocochlear nerve (Cranial Nerve VIII) frequently produces sudden sensorineural hearing loss, acute sound sensitivity (hyperacusis), or permanent high-frequency tinnitus.',
      livedReality:
        'Living with persistent noise in one or both ears can be isolating. Background restaurant noise or multiple simultaneous voices make comprehension exhausting and frustrating.',
      workplaceTip:
        'Provide written meeting agendas and summaries, allow speech-to-text live captioning for virtual calls, and avoid expecting phone-heavy roles.',
    },
    balance: {
      title: 'Vestibular & Balance Instability',
      icon: <Compass className="w-5 h-5 text-emerald-400" />,
      tagline: 'Dizziness, spatial disorientation, and visual vertigo.',
      medicalContext:
        'Damage to vestibular nerve fibres disrupts balance equilibrium. Sudden head movements, fluorescent lighting, and visually crowded spaces can overwhelm the brain’s motion processing.',
      livedReality:
        'Walking in low-light corridors or navigating uneven pavement requires constant visual vigilance. Many feel as though they are perpetually stepping off a boat.',
      workplaceTip:
        'Ensure clear walkways, avoid sudden lighting changes or flicker, and provide accessible handrails and elevators.',
    },
    synkinesis: {
      title: 'Synkinesis & Muscle Tightness',
      icon: <Smile className="w-5 h-5 text-indigo-400" />,
      tagline: 'Involuntary muscle movements and chronic facial tightness.',
      medicalContext:
        'As facial nerve fibres regenerate after Ramsay Hunt syndrome, aberrant re-innervation often occurs: axons cross-wire into unintended muscle groups. For instance, the eye may involuntarily squint or close when smiling or chewing.',
      livedReality:
        'While an observer may see a symmetric resting face, the individual experiences continuous facial aching, muscular spasm, and tightness around the cheek, eye, and jaw.',
      workplaceTip:
        'Never tell someone "you look completely recovered!" based on resting appearance. Acknowledge that internal nerve tension and stiffness are ongoing.',
    },
    pacing: {
      title: 'Fluctuating Capacity & Pacing',
      icon: <Clock className="w-5 h-5 text-rose-400" />,
      tagline: 'The delayed crash: why a good day requires careful management.',
      medicalContext:
        'Neurological post-viral conditions commonly involve a delayed flare response. Pushing through exhaustion on a productive day typically depletes reserves, triggering severe symptom crashes 24 to 48 hours later.',
      livedReality:
        'Carefully measuring energy expenditure—the "spoon theory"—is essential. Saying "no" to social events is often not a choice, but a clinical necessity to preserve working capacity.',
      workplaceTip:
        'Accept fluctuating capacity without judgment. Predictable workloads and advance notice for deadlines allow sustainable energy rationing.',
    },
  };

  return (
    <div className="pt-20 pb-28 px-4 sm:px-6 max-w-5xl mx-auto space-y-10 text-slate-100">
      {/* Awareness Campaign Hero Banner */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Patient-Led Awareness Initiative
            </span>
            <span className="text-xs text-slate-400 bg-slate-950/80 px-2.5 py-1 rounded-full border border-slate-800">
              England &amp; Wales • Pre-Registration Pilot
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Life after Ramsay Hunt syndrome: the effects you cannot see.
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Our mission is to raise awareness of Ramsay Hunt syndrome, promote timely medical recognition within the critical 72-hour window, validate the everyday invisible effects of nerve damage, and ensure individuals living with long-term impacts feel understood and never alone.
          </p>

          {/* Quick Action Navigation Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-3 no-print">
            <a
              href="#urgent-signs"
              onClick={() => sound.playSoftClick()}
              className="px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold tracking-wide transition-all flex items-center gap-2 cursor-pointer shadow-sm shadow-rose-900/40"
            >
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Urgent Early Signs (72h Window)</span>
            </a>

            <a
              href="#printable-leaflet"
              onClick={() => sound.playSoftClick()}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-400" />
              <span>Printable Patient Leaflet</span>
            </a>

            <a
              href="#invisible-symptoms"
              onClick={() => sound.playSoftClick()}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer"
            >
              <EyeOff className="w-4 h-4 text-amber-400" />
              <span>Invisible Symptoms Guide</span>
            </a>

            <button
              onClick={() => {
                sound.playSoftClick();
                onOpenDonate();
              }}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wide transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer ml-auto"
            >
              <Heart className="w-4 h-4 fill-slate-950" />
              <span>Support (PayPal.me)</span>
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 1: CRITICAL MEDICAL AWARENESS - URGENT 72-HOUR WINDOW */}
      <section
        id="urgent-signs"
        className="scroll-mt-24 bg-gradient-to-br from-rose-950/30 via-slate-900 to-slate-900 border-2 border-rose-500/50 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rose-500/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center font-bold">
              <AlertTriangle className="w-6 h-6 text-rose-400" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                Urgent Medical Recognition: The 72-Hour Antiviral Window
              </h2>
              <p className="text-xs text-rose-300/90 font-medium">
                Varicella-zoster virus reactivation in Cranial Nerves VII &amp; VIII
              </p>
            </div>
          </div>
          <span className="self-start sm:self-auto text-xs font-mono font-bold uppercase px-3 py-1 bg-rose-500/20 text-rose-300 rounded-full border border-rose-500/30">
            Emergency Assessment
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="space-y-4">
            <h3 className="font-bold text-slate-100 flex items-center gap-2">
              <Ear className="w-4 h-4 text-rose-400" />
              <span>Key Red-Flag Symptoms:</span>
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2.5 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                <div>
                  <strong className="text-slate-100 block">Severe Ear Pain:</strong>
                  Deep, burning, stabbing or intense pain in, behind, or around one ear, which may precede the rash by several days.
                </div>
              </li>
              <li className="flex items-start gap-2.5 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                <div>
                  <strong className="text-slate-100 block">Painful Blistering Rash (Vesicles):</strong>
                  Shingles blisters appearing inside the ear canal, on the outer ear (pinna), or inside the mouth / tongue / palate.
                </div>
              </li>
              <li className="flex items-start gap-2.5 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                <div>
                  <strong className="text-slate-100 block">Facial Weakness or Paralysis:</strong>
                  Difficulty or inability to close one eye, smile, raise the eyebrow, or drink without leaking on one side of the face.
                </div>
              </li>
              <li className="flex items-start gap-2.5 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
                <div>
                  <strong className="text-slate-100 block">Hearing Loss &amp; Severe Vertigo:</strong>
                  Sudden reduction in hearing, intense spinning dizziness, unsteadiness, or loud tinnitus in the affected ear.
                </div>
              </li>
            </ul>
          </div>

          <div className="space-y-4 flex flex-col justify-between">
            <div className="bg-slate-950/90 p-5 rounded-2xl border border-rose-900/40 space-y-3">
              <h4 className="font-bold text-sm text-rose-300 flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-400" />
                <span>Why Time is Critical (Under 72 Hours)</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Prompt treatment with oral or intravenous antiviral medication (such as aciclovir or valaciclovir) combined with corticosteroids (prednisolone) within <strong>72 hours of symptom onset</strong> significantly increases the likelihood of facial nerve recovery and reduces long-term neuropathic damage.
              </p>
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-200 text-xs">
                <strong>What to do immediately in the UK:</strong>
                <p className="mt-1 text-slate-300 text-[11px]">
                  Call <strong>NHS 111</strong> immediately, contact your GP surgery for a same-day urgent assessment, or attend your nearest <strong>Urgent Treatment Centre / A&amp;E</strong>. Mention that you suspect Ramsay Hunt syndrome so you are evaluated for antivirals before the 72-hour window closes.
                </p>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 italic bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              Note: Occasionally the rash is delayed or absent (termed <em>zoster sine herpete</em>). Persistent severe ear pain alongside facial weakness warrants urgent clinical examination regardless of visible blisters.
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: THE INVISIBLE EFFECTS DEEP-DIVE */}
      <section id="invisible-symptoms" className="scroll-mt-24 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <EyeOff className="w-6 h-6 text-amber-400" />
              <span>The Effects You Cannot See</span>
            </h2>
            <p className="text-xs text-slate-400">
              Understanding long-term neurological challenges beyond resting facial appearance.
            </p>
          </div>
          <span className="text-xs text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
            Select a symptom below to learn more
          </span>
        </div>

        {/* Interactive Symptom Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2" role="tablist">
          {(
            [
              { key: 'fatigue', label: 'Fatigue & Brain', icon: <BatteryCharging className="w-4 h-4" /> },
              { key: 'tinnitus', label: 'Hearing & Tinnitus', icon: <Volume2 className="w-4 h-4" /> },
              { key: 'balance', label: 'Balance & Vertigo', icon: <Compass className="w-4 h-4" /> },
              { key: 'synkinesis', label: 'Synkinesis', icon: <Smile className="w-4 h-4" /> },
              { key: 'pacing', label: 'Pacing & Crashes', icon: <Clock className="w-4 h-4" /> },
            ] as const
          ).map(tab => {
            const isSelected = activeSymptom === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => {
                  sound.playSoftClick();
                  setActiveSymptom(tab.key);
                }}
                className={`p-3 rounded-xl text-left font-medium text-xs transition-all flex flex-col gap-1.5 cursor-pointer border ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 shadow-md shadow-amber-500/10'
                    : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
                role="tab"
                aria-selected={isSelected}
              >
                <div className={isSelected ? 'text-amber-400' : 'text-slate-500'}>{tab.icon}</div>
                <span className="font-semibold text-slate-200">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Symptom Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center flex-shrink-0">
              {invisibleSymptomsData[activeSymptom].icon}
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">
                {invisibleSymptomsData[activeSymptom].title}
              </h3>
              <p className="text-xs text-amber-300 font-medium">
                {invisibleSymptomsData[activeSymptom].tagline}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-1.5">
                <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-semibold block">
                  Neurological Mechanism
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {invisibleSymptomsData[activeSymptom].medicalContext}
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-1.5">
                <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider font-semibold block">
                  Lived Daily Experience
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {invisibleSymptomsData[activeSymptom].livedReality}
                </p>
              </div>
            </div>

            <div className="space-y-4 flex flex-col justify-between">
              <div className="bg-emerald-950/20 p-5 rounded-xl border border-emerald-800/40 space-y-2">
                <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Workplace &amp; Social Adaptation</span>
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {invisibleSymptomsData[activeSymptom].workplaceTip}
                </p>
              </div>

              <div className="text-[11px] text-slate-400 bg-slate-950/50 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                <span>Explore all 5 symptoms above to understand how they intersect</span>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: FOUNDER LIVED EXPERIENCE STORY */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-sm">
              {showIdentity ? 'DL' : 'FE'}
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {showIdentity ? 'David Linacre’s Story' : 'Founder Lived Experience'}
              </h2>
              <p className="text-xs text-slate-400">
                {showIdentity
                  ? 'Living with Ramsay Hunt syndrome for 8+ years (Confirmed Founder Account)'
                  : 'Anonymous patient perspective • England & Wales'}
              </p>
            </div>
          </div>

          {/* Privacy Toggle Button */}
          <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-950 p-1 rounded-xl border border-slate-800 no-print">
            <button
              onClick={() => {
                sound.playSoftClick();
                setShowIdentity(true);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                showIdentity ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Named View
            </button>
            <button
              onClick={() => {
                sound.playSoftClick();
                setShowIdentity(false);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                !showIdentity ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Anonymous View
            </button>
          </div>
        </div>

        <blockquote className="border-l-4 border-amber-500 pl-4 sm:pl-6 py-1 italic text-slate-200 text-sm sm:text-base leading-relaxed space-y-3.5">
          <p>
            “For more than eight years, I have lived with the lasting effects of Ramsay Hunt syndrome. My experience began with shingles in my right ear and a delayed diagnosis. Today, exhaustion, tinnitus and hearing loss affect everyday life, and I use a hearing aid.”
          </p>
          <p>
            “What can be hardest is feeling that other people cannot see or understand the effort ordinary activities require. I want to help change that—not only by telling my story, but by helping others find reliable information and feel less alone.”
          </p>
          <p className="not-italic text-xs text-amber-300 font-semibold pt-1">
            “This project is starting small, with awareness and connection. My hope is that greater understanding will lead to better support for people living with the long-term effects.”
          </p>
        </blockquote>

        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 text-xs text-slate-400 space-y-1.5">
          <div className="flex items-center gap-1.5 text-amber-400 font-medium">
            <Info className="w-4 h-4" />
            <span>Editorial &amp; Medical Disclaimer on Personal Accounts</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            The founder’s stated experience describes their individual journey and is not a substitute for verified medical records or evidence of clinical causation. Personal accounts are shared solely for empathy, validation, and peer awareness.
          </p>
        </div>
      </section>

      {/* SECTION 4: PRINTABLE A5 AWARENESS LEAFLET (INTERACTIVE PREVIEW & PRINT) */}
      <section
        id="printable-leaflet"
        className="scroll-mt-24 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Printer className="w-5 h-5 text-amber-400" />
              <span>A5 Patient Awareness Leaflet (Printable / Digital Copy)</span>
            </h2>
            <p className="text-xs text-slate-400">
              Formatted for 2-sided high-contrast printing for GP clinics, waiting rooms, and employers.
            </p>
          </div>

          <div className="flex items-center gap-2 no-print">
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => {
                  sound.playSoftClick();
                  setLeafletSide(1);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer ${
                  leafletSide === 1 ? 'bg-slate-800 text-white font-bold' : 'text-slate-400'
                }`}
              >
                Side 1 (Medical)
              </button>
              <button
                onClick={() => {
                  sound.playSoftClick();
                  setLeafletSide(2);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer ${
                  leafletSide === 2 ? 'bg-slate-800 text-white font-bold' : 'text-slate-400'
                }`}
              >
                Side 2 (Lived Reality)
              </button>
            </div>

            <button
              onClick={handlePrintLeaflet}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-md shadow-amber-500/20"
            >
              <Printer className="w-4 h-4" />
              <span>Print Leaflet</span>
            </button>
          </div>
        </div>

        {/* Leaflet Graphic Canvas Preview */}
        <div className="bg-slate-950 p-6 sm:p-8 rounded-2xl border-2 border-dashed border-slate-700 max-w-2xl mx-auto shadow-inner space-y-5 text-slate-200">
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 border-b border-slate-800 pb-2">
            <span>Ramsay Hunt Awareness Initiative • A5 Leaflet Format</span>
            <span className="font-bold text-amber-400">SIDE {leafletSide} OF 2</span>
          </div>

          {leafletSide === 1 ? (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400">
                  Patient &amp; Clinical Information Guide
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Life After Ramsay Hunt Syndrome: The Effects You Cannot See
                </h3>
              </div>

              <div className="space-y-3 text-xs leading-relaxed">
                <div>
                  <h4 className="font-bold text-slate-100 text-sm">What is Ramsay Hunt syndrome?</h4>
                  <p className="text-slate-300 text-xs">
                    Ramsay Hunt syndrome is caused by the reactivation of the chickenpox virus (varicella-zoster) in facial and auditory nerve pathways (Cranial Nerves VII &amp; VIII). It affects approximately 5 in 100,000 people annually in the UK.
                  </p>
                </div>

                <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-amber-300 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Key Early Signs Requiring Prompt Medical Attention:</span>
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-300 text-xs">
                    <li>Severe pain deep inside, behind, or around one ear.</li>
                    <li>Painful blistering rash inside ear canal, pinna, or on the palate / tongue.</li>
                    <li>Weakness or loss of movement on one side of the face (difficulty closing eye or smiling).</li>
                    <li>Dizziness, vertigo, sudden unsteadiness, or sensorineural hearing loss.</li>
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs font-medium">
                  <strong>URGENT ACTION:</strong> Antiviral treatment and corticosteroids within 72 hours of symptom onset provide the highest likelihood of full recovery. If you suspect Ramsay Hunt syndrome, contact your GP, NHS 111, or attend an Urgent Treatment Centre immediately.
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">
                  Lived Journey &amp; National Support
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  The Long-Term Journey &amp; Invisible Symptoms
                </h3>
              </div>

              <div className="space-y-3 text-xs leading-relaxed">
                <div>
                  <h4 className="font-bold text-slate-100 text-sm">Ongoing Invisible Challenges:</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-300 text-xs mt-1">
                    <li><strong>Neurological Exhaustion:</strong> Heavy cognitive fatigue from continuous compensatory sensory processing.</li>
                    <li><strong>Tinnitus &amp; Hearing Loss:</strong> Ongoing ringing, muffled perception, or sensitivity to loud acoustic environments.</li>
                    <li><strong>Synkinesis:</strong> Involuntary facial twitches or eye squinting occurring during smiling or chewing.</li>
                  </ul>
                </div>

                <blockquote className="border-l-2 border-amber-500 pl-3 italic text-slate-300 text-xs">
                  “What can be hardest is feeling that others cannot see the effort ordinary activities require. Underneath, managing sensory fatigue and hearing changes is an everyday reality. You are not alone.”
                </blockquote>

                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                  <h4 className="font-bold text-slate-200">Trusted National Support Resources:</h4>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                    <div>• <strong>Facial Palsy UK:</strong> facialpalsy.org.uk</div>
                    <div>• <strong>The Brain Charity:</strong> thebraincharity.org.uk</div>
                    <div>• <strong>RNID:</strong> rnid.org.uk</div>
                    <div>• <strong>NHS 111:</strong> nhs.uk/conditions/</div>
                  </div>
                </div>

                <p className="text-[10px] text-slate-500 italic text-center">
                  Produced by a patient-led awareness initiative. Not medical advice.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 5: PRACTICAL SUPPORT GUIDE (FOR FRIENDS, EMPLOYERS, FAMILIES) */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold">
            <Building className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              Guide for Employers, Colleagues &amp; Families
            </h2>
            <p className="text-xs text-slate-400">
              5 actionable ways to support someone living with post-viral cranial nerve disruption.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="font-bold text-slate-200 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold flex items-center justify-center">1</span>
              <span>Default to Written Briefs</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Deciphering speech in noisy rooms requires heavy mental concentration. Providing written notes or emails vastly reduces auditory fatigue.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="font-bold text-slate-200 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold flex items-center justify-center">2</span>
              <span>Enable Quiet Workspaces</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Open-plan offices with chatter exacerbate tinnitus and visual vertigo. Providing quiet corners or sound-dampened meeting areas helps immensely.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="font-bold text-slate-200 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold flex items-center justify-center">3</span>
              <span>Never Assume "Cured"</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Avoid saying "you look fine today!" A symmetrical resting face does not reflect internal neuropathic pain, tinnitus, or synkinesis.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="font-bold text-slate-200 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold flex items-center justify-center">4</span>
              <span>Support Energy Pacing</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Allow short scheduled micro-breaks to rest eyes and face muscles without demanding explanations or medical justifications.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="font-bold text-slate-200 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold flex items-center justify-center">5</span>
              <span>Camera-Optional Calls</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Staring at one’s own face on video feeds or struggling to lip-read small pixelated windows causes eye strain and self-consciousness.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="font-bold text-slate-200 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold flex items-center justify-center">6</span>
              <span>Patient-Led Boundaries</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Let the individual state what works best for them without offering unverified home remedies or unsolicited medical advice.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 6: VERIFIED CLINICAL & CHARITY SIGNPOSTS */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <Compass className="w-5 h-5 text-cyan-400" />
            <h3>Verified UK Charity Signposts</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            We partner with and direct patients to established, registered UK charities rather than duplicating resources:
          </p>

          <div className="space-y-3 text-xs">
            <a
              href="https://www.facialpalsy.org.uk/causesanddiagnoses/ramsay-hunt-syndrome/"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 transition-colors group"
            >
              <div className="flex items-center justify-between text-slate-200 font-semibold group-hover:text-amber-400">
                <span>Facial Palsy UK — Ramsay Hunt Guide</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400" />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                The UK’s leading charity dedicated to facial palsy, offering patient guides, support groups, and clinical directories.
              </p>
            </a>

            <a
              href="https://www.thebraincharity.org.uk/condition/ramsay-hunt-syndrome/"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 transition-colors group"
            >
              <div className="flex items-center justify-between text-slate-200 font-semibold group-hover:text-cyan-400">
                <span>The Brain Charity — Neurological Support</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400" />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Practical, emotional, and social welfare support for all neurological conditions across the UK.
              </p>
            </a>

            <a
              href="https://rnid.org.uk/"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition-colors group"
            >
              <div className="flex items-center justify-between text-slate-200 font-semibold group-hover:text-emerald-400">
                <span>RNID — Hearing Loss &amp; Tinnitus</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400" />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                National charity supporting people with hearing loss, tinnitus management, and assistive listening devices.
              </p>
            </a>
          </div>
        </div>

        {/* Practical Ways to Help Without Donating Money */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <Users className="w-5 h-5 text-emerald-400" />
            <h3>Help Without Spending Any Money</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Our initiative values practical action just as much as financial contributions. Here is how you can help:
          </p>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="font-bold text-slate-200">Share Leaflet with Local GP / Audiology Clinics</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Print our free A5 leaflet or forward the digital copy to medical receptionists to help raise timely suspicion of ear vesicles.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="font-bold text-slate-200">Volunteer Awareness Helper (1-2 hrs / month)</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Assist with proofreading approved educational posts, organizing verified links, and formatting materials so the founder does not carry administrative burden alone.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="font-bold text-slate-200">Respect Privacy in Public Discussions</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Never post your own or others' unconsented medical records on social platforms. Keep sensitive health details protected.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: STATUTORY STATUS, DISCLOSURE & MEDICAL DISCLAIMER */}
      <section className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 text-xs text-slate-400">
        <div className="flex items-center gap-2 text-slate-200 font-bold text-sm">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>Statutory Status &amp; Medical Disclaimer</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 leading-relaxed">
          <div className="space-y-2">
            <p>
              <strong>Initiative Status:</strong> We are developing a patient-led awareness initiative about Ramsay Hunt syndrome and its lasting impact. Our aim is to help people feel less alone, improve understanding of everyday challenges, and connect people with reliable information. <strong>We are currently an unincorporated awareness project, not a registered charity.</strong>
            </p>
            <p>
              In England and Wales, registration with the Charity Commission is required once gross annual income reaches £5,000. All funds received via PayPal (PayPal.me/dlinacre16) are documented in public real-time transparency records.
            </p>
          </div>

          <div className="space-y-2">
            <p>
              <strong>Medical Disclaimer:</strong> This project shares lived experience and general awareness information. It does not provide medical advice, diagnosis, treatment, or an emergency service. Please seek advice from an appropriate healthcare professional about your own symptoms or care.
            </p>
            <p>
              <strong>Sustainable Operating Model:</strong> Operated under a strict founder energy cap of 4–6 hours weekly. We prioritize written correspondence and structured asynchronous updates.
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500">
          <span>Prepared in England &amp; Wales • Reviewed November 2026</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                sound.playSoftClick();
                if (onViewLedger) onViewLedger();
              }}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              View Transparent Ledger
            </button>
            <button
              onClick={() => {
                sound.playSoftClick();
                if (onExploreGoals) onExploreGoals();
              }}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              Explore Campaign Goals
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
