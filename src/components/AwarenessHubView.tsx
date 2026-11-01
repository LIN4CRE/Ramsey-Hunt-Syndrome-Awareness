import React from 'react';
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
} from 'lucide-react';

interface AwarenessHubViewProps {
  onOpenDonate: () => void;
}

export const AwarenessHubView: React.FC<AwarenessHubViewProps> = ({ onOpenDonate }) => {
  return (
    <div className="pt-20 pb-24 px-4 sm:px-6 max-w-5xl mx-auto space-y-8 text-slate-100">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <span>Working Campaign</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Life after Ramsay Hunt syndrome: the effects you cannot see.
          </h2>
          <p className="text-base text-slate-300 leading-relaxed">
            A patient-led initiative to raise awareness of Ramsay Hunt syndrome, promote timely recognition and access to care, and help people living with lasting effects feel understood and less alone.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={onOpenDonate}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs tracking-wide shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Heart className="w-4 h-4" />
              <span>Support Transparent Awareness (PayPal.me)</span>
            </button>
            <a
              href="https://www.facialpalsy.org.uk/causesanddiagnoses/ramsay-hunt-syndrome/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <span>Facial Palsy UK Signpost</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>
        </div>
      </div>

      {/* Founder Lived Experience Story (Verbatim Section 2 & 9) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-sm">
            DL
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">Founder Lived Experience</h3>
            <p className="text-xs text-slate-400">David Linacre • 8+ Years Living with Ramsay Hunt Syndrome</p>
          </div>
        </div>

        <blockquote className="border-l-4 border-amber-500 pl-4 sm:pl-6 py-1 italic text-slate-300 text-sm sm:text-base leading-relaxed space-y-3">
          <p>
            "For more than eight years, I have lived with the lasting effects of Ramsay Hunt syndrome. My experience began with shingles in my right ear and a delayed diagnosis. Today, exhaustion, tinnitus and hearing loss affect everyday life, and I use a hearing aid."
          </p>
          <p>
            "What can be hardest is feeling that other people cannot see or understand the effort ordinary activities require. I want to help change that—not only by telling my story, but by helping others find reliable information and feel less alone."
          </p>
          <p className="not-italic text-xs text-amber-300 font-semibold">
            "This project is starting small, with awareness and connection. My hope is that greater understanding will lead to better support for people living with the long-term effects."
          </p>
        </blockquote>

        {/* Invisible Symptoms Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Volume2 className="w-4 h-4" />
            </div>
            <div className="font-semibold text-xs text-slate-100">Hearing Loss &amp; Tinnitus</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Cranial nerve VIII damage can lead to sudden sensorineural hearing loss and persistent ringing that drains cognitive reserve.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <BatteryCharging className="w-4 h-4" />
            </div>
            <div className="font-semibold text-xs text-slate-100">Persistent Neurological Fatigue</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Ordinary daily tasks require immense conscious compensatory effort, often misunderstood by employers and peers as simple tiredness.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <EyeOff className="w-4 h-4" />
            </div>
            <div className="font-semibold text-xs text-slate-100">Invisible Impact</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              When facial weakness stabilizes or partially recovers, lasting internal nerve disruption remains completely unseen from the outside.
            </p>
          </div>
        </div>
      </div>

      {/* Verified Medical Signposts & Boundaries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Verified Clinical Links */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <Compass className="w-5 h-5 text-cyan-400" />
            <h3>Verified Clinical &amp; Charity Signposts</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            We direct patients and healthcare providers to peer-reviewed, verified clinical resources rather than inventing advice:
          </p>

          <div className="space-y-2.5 text-xs">
            <a
              href="https://www.facialpalsy.org.uk/causesanddiagnoses/ramsay-hunt-syndrome/"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors group"
            >
              <div className="flex items-center justify-between text-slate-200 font-semibold group-hover:text-amber-400">
                <span>Facial Palsy UK — Ramsay Hunt Syndrome Guide</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400" />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                UK charity dedicated to supporting those with facial paralysis, including comprehensive guides on antiviral windows.
              </p>
            </a>

            <a
              href="https://www.thebraincharity.org.uk/condition/ramsay-hunt-syndrome/"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors group"
            >
              <div className="flex items-center justify-between text-slate-200 font-semibold group-hover:text-cyan-400">
                <span>The Brain Charity — Condition Information</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400" />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Practical and emotional support for neurological conditions across the UK.
              </p>
            </a>

            <a
              href="https://www.gov.uk/setting-up-charity"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors group"
            >
              <div className="flex items-center justify-between text-slate-200 font-semibold group-hover:text-emerald-400">
                <span>GOV.UK Charity Commission Guidance</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400" />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Statutory guidance on registration thresholds, public benefit, and trustee responsibilities.
              </p>
            </a>
          </div>
        </div>

        {/* Strict Medical Disclaimer & Ethical Standards */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <h3>Medical Disclaimer &amp; Scope</h3>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 text-xs text-slate-300 space-y-2.5 leading-relaxed">
            <p className="font-semibold text-amber-300">
              "This project shares lived experience and general awareness information. It does not provide medical advice, diagnosis, treatment or an emergency service."
            </p>
            <p className="text-[11px] text-slate-400">
              Please seek prompt advice from an appropriate healthcare professional (GP, urgent treatment centre, or ENT/audiology department) about your own symptoms or care. If you suspect acute Ramsay Hunt syndrome, immediate evaluation within 72 hours of rash or facial weakness is critical for antiviral consideration.
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Sustainable founder energy cap: 4–6 hours weekly limit</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <FileCheck2 className="w-3.5 h-3.5 text-slate-500" />
              <span>No claims of completed charity registration until confirmed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Practical Ways to Help Without Donating */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
        <div className="flex items-center gap-2 text-white font-bold text-base">
          <Users className="w-5 h-5 text-emerald-400" />
          <h3>Practical Support (Zero Money Required)</h3>
        </div>
        <p className="text-xs text-slate-400">
          Our initiative values practical assistance just as much as monetary contributions:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="font-semibold text-slate-200">Volunteer Awareness Helper</div>
            <p className="text-[11px] text-slate-400">
              Help format approved drafts, organise clinical signposts, and assist with accessible transcription so the founder does not carry all administrative tasks alone.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="font-semibold text-slate-200">Share Information with GP / Audiology Clinics</div>
            <p className="text-[11px] text-slate-400">
              Request a free digital awareness leaflet pack to share with your local medical centre to promote earlier recognition of ear vesicles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
