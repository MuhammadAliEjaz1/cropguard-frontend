import React, { useEffect, useRef, useState } from 'react';
import { Leaf, Cpu, Database, FlaskConical } from 'lucide-react';

/* ─── DATA ──────────────────────────────────────────────────────────────── */
const team = [
  {
    name: 'Muhammad Ali Ejaz',
    initials: 'MA',
    role: 'ML Engineer · Full-Stack · Research',
    roleIcon: <Cpu size={14} />,
    focus: 'End-to-end project lead: model architecture, transfer learning, React frontend, LLM integration, bilingual UI, disease map & full deployment',
    color: 'from-emerald-500 to-green-600',
    highlight: true,
  },
  {
    name: 'Ahmad Siddique',
    initials: 'AS',
    role: 'Data Preprocessing',
    roleIcon: <Database size={14} />,
    focus: 'Dataset cleaning, image labelling & preprocessing pipeline preparation',
    color: 'from-teal-500 to-emerald-600',
  },
];

const gaps = [
  {
    gap: 'Lab-only images',
    improvement: 'Real field images from Pakistani crops',
    icon: '🌾',
  },
  {
    gap: 'English-only output',
    improvement: 'Bilingual Urdu + English output',
    icon: '🗣️',
  },
  {
    gap: 'CNN alone — no explanation',
    improvement: 'CNN + LLM education system',
    icon: '🧠',
  },
  {
    gap: 'No farmer-friendly interface',
    improvement: 'Simple photo → diagnosis → advice',
    icon: '📱',
  },
  {
    gap: 'No disease spread awareness',
    improvement: 'Geo-based community warning system',
    icon: '🗺️',
  },
];

const crops = [
  {
    emoji: '🌾',
    name: 'Wheat',
    source: 'kushagra3204',
    classes: 15,
    type: 'Real field',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    badge: 'bg-amber-100 text-amber-800',
    dot: 'bg-amber-400',
  },
  {
    emoji: '🌾',
    name: 'Rice',
    source: 'afzaalsattar',
    classes: 6,
    type: 'Field images',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-800',
    dot: 'bg-blue-400',
  },
  {
    emoji: '🌿',
    name: 'Cotton',
    source: 'seroshkarim',
    classes: 4,
    type: 'Curl virus incl.',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    badge: 'bg-purple-100 text-purple-800',
    dot: 'bg-purple-400',
  },
  {
    emoji: '🎋',
    name: 'Sugarcane',
    source: 'nirmalsankalana',
    classes: 5,
    type: 'Real field',
    bg: 'bg-green-50',
    border: 'border-green-200',
    badge: 'bg-green-100 text-green-800',
    dot: 'bg-green-400',
  },
  {
    emoji: '🌽',
    name: 'Corn',
    source: 'smaranjitghose',
    classes: 4,
    type: 'Kaggle dataset',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    badge: 'bg-yellow-100 text-yellow-800',
    dot: 'bg-yellow-400',
  },
  {
    emoji: '🥔',
    name: 'Potato',
    source: 'faysalmiah1721758',
    classes: 3,
    type: 'Kaggle dataset',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    badge: 'bg-orange-100 text-orange-800',
    dot: 'bg-orange-400',
  },
];

const tech = [
  { label: 'Model', value: 'EfficientNetB0 (Transfer Learning)', icon: <Cpu size={16} /> },
  { label: 'Dataset', value: 'Real-field images — 6 Pakistani crops', icon: <Database size={16} /> },
  { label: 'Classes', value: '37 disease classes', icon: <FlaskConical size={16} /> },
  { label: 'Images', value: '31,641 training images', icon: <Database size={16} /> },
  { label: 'Accuracy', value: '92.52% validation accuracy', icon: <Cpu size={16} /> },
  { label: 'LLM', value: 'Gemini 2.5 Flash via Google AI', icon: <Cpu size={16} /> },
];

/* ─── FADE-IN HOOK ───────────────────────────────────────────────────────── */
function useFadeIn() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

/* ─── SECTION WRAPPER ────────────────────────────────────────────────────── */
function Section({ title, children, className = '' }) {
  const [ref, visible] = useFadeIn();
  return (
    <div
      ref={ref}
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-7 mb-8 transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      } ${className}`}
    >
      {title && (
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span className="w-1 h-5 bg-green-600 rounded-full inline-block" />
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}

/* ─── MAIN COMPONENT ─────────────────────────────────────────────────────── */
function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">

      {/* ── HERO ── */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-2xl mb-5 shadow-lg">
          <Leaf size={32} className="text-white" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">About CropGuard AI</h1>
        <p className="text-gray-500 mt-3 text-lg max-w-2xl mx-auto leading-relaxed">
          An intelligent crop disease detection and advisory system built specifically
          for Pakistani farmers — trained on real field data.
        </p>
      </div>

      {/* ── OUR STORY ── */}
      <Section title="Our Story & Motivation">
        <div className="relative pl-5 border-l-2 border-green-200 space-y-4 text-gray-600 leading-relaxed">
          <p>
            Pakistan's agriculture sector feeds over 220 million people, yet farmers lose{' '}
            <span className="font-semibold text-gray-800">20–30% of their yield</span> every season to crop
            diseases — not because cures don't exist, but because diagnosis comes too late, and advice
            arrives only in English.
          </p>
          <p>
            We built CropGuard AI as our Final Year Project to close that gap. By combining a{' '}
            <span className="font-semibold text-gray-800">deep-learning model trained on real Pakistani
            field images</span> with a bilingual LLM advisory system, a farmer can now photograph a sick
            leaf, receive a diagnosis in Urdu, and get actionable treatment advice — all within seconds.
          </p>
          <p>
            This isn't a research demo with PlantVillage images. Every dataset, every design decision,
            every line of code was made with one person in mind:{' '}
            <span className="font-semibold text-green-700">the farmer standing in his field in Punjab or Sindh</span>,
            holding a smartphone and hoping for answers.
          </p>
        </div>
      </Section>

      {/* ── TEAM ── */}
      <Section title="The Team">
        <div className="grid md:grid-cols-2 gap-5">
          {team.map((t, i) => (
            <div
              key={i}
              className="rounded-xl overflow-hidden transition-shadow border border-gray-100 shadow-sm hover:shadow-md" 
            >
              {/* colour bar */}
              <div className={`${t.highlight ? 'h-2' : 'h-1.5'} w-full bg-gradient-to-r ${t.color}`} />
              <div className="p-6 flex gap-4 items-start">
                <div className="relative shrink-0">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center shadow`}>
                    <span className="text-white text-xl font-bold">{t.initials}</span>
                  </div>

                </div>
                <div>
                  <div className={`font-bold text-base ${t.highlight ? 'text-green-900' : 'text-gray-800'}`}>
                    {t.name}
                  </div>
                  {!t.highlight && (
                    <div className="inline-flex items-center gap-1 text-xs font-semibold rounded-full px-2 py-0.5 mt-1 mb-2 text-green-700 bg-green-50 border border-green-200">
                      {t.roleIcon}
                      {t.role}
                    </div>
                  )}
                  <p className="text-gray-500 text-sm leading-snug">{t.focus}</p>
                  <p className="text-gray-400 text-xs mt-2">The Islamia University of Bahawalpur</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-gray-400 text-sm mt-5 text-center">
          Final Year Project · BS Data Science · The Islamia University of Bahawalpur · 2026
        </p>
      </Section>

      {/* ── RESEARCH GAP ── */}
      <Section title="Research Gap & Our Improvements">
        <div className="space-y-3">
          {gaps.map((g, i) => (
            <div
              key={i}
              className="grid grid-cols-[2.5rem_1fr_auto_1fr] items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              {/* icon */}
              <span className="text-2xl text-center">{g.icon}</span>
              {/* gap */}
              <div className="flex items-center gap-2">
                <span className="text-red-500 font-bold text-base leading-none">✕</span>
                <span className="text-sm text-red-600 font-medium">{g.gap}</span>
              </div>
              {/* arrow */}
              <span className="text-gray-300 font-bold text-sm hidden sm:block">→</span>
              {/* improvement */}
              <div className="flex items-center gap-2 sm:col-auto col-span-2 sm:ml-0 ml-10">
                <span className="text-green-600 font-bold text-base leading-none">✓</span>
                <span className="text-sm text-green-700 font-medium">{g.improvement}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── TECHNICAL DETAILS ── */}
      <Section title="Technical Details">
        <div className="grid sm:grid-cols-2 gap-3">
          {tech.map((t, i) => (
            <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="text-green-600 shrink-0">{t.icon}</div>
              <div>
                <div className="text-xs text-green-700 font-bold uppercase tracking-wide">{t.label}</div>
                <div className="text-gray-700 text-sm font-medium mt-0.5">{t.value}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── DATASETS ── */}
      <Section title="Datasets Used">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {crops.map((c, i) => (
            <div
              key={i}
              className={`rounded-xl border ${c.border} ${c.bg} p-4 hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{c.emoji}</span>
                <div>
                  <div className="font-bold text-gray-800 text-sm">{c.name}</div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.badge}`}>
                    {c.classes} classes
                  </span>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                  <span>{c.type}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                  <span className="font-mono">{c.source} — Kaggle</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

    </div>
  );
}

export default About;
