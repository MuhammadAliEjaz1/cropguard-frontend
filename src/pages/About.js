import React from 'react';
import { Leaf, Database, Cpu, Globe } from 'lucide-react';

function About() {
  const team = [
    { name: 'Muhammad Ali Ejaz' },
    { name: 'Ahmad Siddique' },
  ];

  const tech = [
    { label: 'Model',    value: 'EfficientNetB0 (Transfer Learning)' },
    { label: 'Dataset',  value: 'Real-field images — 6 Pakistani crops' },
    { label: 'Classes',  value: '37 disease classes' },
    { label: 'Images',   value: '31,641 training images' },
    { label: 'Accuracy', value: '92.52% validation accuracy' },
    { label: 'LLM',      value: 'Gemini 2.5 Flash via Google AI' },
  ];

  const gaps = [
    { gap: 'Lab-only images', improvement: 'Real field images from Pakistani crops' },
    { gap: 'English-only output', improvement: 'Bilingual Urdu + English output' },
    { gap: 'CNN alone — no explanation', improvement: 'CNN + LLM education system' },
    { gap: 'No farmer-friendly interface', improvement: 'Simple photo → diagnosis → advice' },
    { gap: 'No disease spread awareness', improvement: 'Geo-based community warning system' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <Leaf size={48} className="text-green-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800">About CropGuard AI</h1>
        <p className="text-gray-500 mt-3 text-lg max-w-2xl mx-auto">
          An intelligent crop disease detection and advisory system built specifically
          for Pakistani farmers — trained on real field data.
        </p>
      </div>

      {/* Team */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Team</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {team.map((t, i) => (
            <div key={i} className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">{t.name.charAt(0)}</span>
              </div>
              <div className="font-bold text-gray-800 text-lg">{t.name}</div>
              <div className="text-green-600 text-sm font-medium mt-1">Data Scientist</div>
              <div className="text-gray-400 text-xs mt-1">The Islamia University of Bahawalpur</div>
            </div>
          ))}
        </div>
        <p className="text-gray-500 text-sm mt-4">Final Year Project | BS Data Science | The Islamia University of Bahawalpur | 2026</p>
      </div>

      {/* Research Gap */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Research Gap & Our Improvements</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-green-700 text-white">
                <th className="px-4 py-3 text-left rounded-tl-lg">Gap in Existing Work</th>
                <th className="px-4 py-3 text-left rounded-tr-lg">Our Improvement</th>
              </tr>
            </thead>
            <tbody>
              {gaps.map((g, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-4 py-3 text-red-600">❌ {g.gap}</td>
                  <td className="px-4 py-3 text-green-700">✅ {g.improvement}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Technical Details</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {tech.map((t, i) => (
            <div key={i} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-green-600 font-bold min-w-[80px]">{t.label}</span>
              <span className="text-gray-700">{t.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Datasets */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Datasets Used</h2>
        <div className="space-y-3">
          {[
            { crop: '🌾 Wheat',     source: 'kushagra3204 — Kaggle',         note: '15 disease classes, real field' },
            { crop: '🌾 Rice',      source: 'afzaalsattar — Kaggle',          note: '6 disease classes, field images' },
            { crop: '🌿 Cotton',    source: 'seroshkarim — Kaggle',           note: '4 classes including curl virus' },
            { crop: '🎋 Sugarcane', source: 'nirmalsankalana — Kaggle',       note: '5 classes, real field' },
            { crop: '🌽 Corn',      source: 'smaranjitghose — Kaggle',        note: '4 classes' },
            { crop: '🥔 Potato',    source: 'faysalmiah1721758 — Kaggle',     note: '3 classes' },
          ].map((d, i) => (
            <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <span className="text-2xl">{d.crop.split(' ')[0]}</span>
              <div>
                <div className="font-medium text-gray-800">{d.crop.split(' ').slice(1).join(' ')}</div>
                <div className="text-sm text-gray-500">{d.source} — {d.note}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default About;