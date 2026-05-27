import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, MessageCircle, MapPin, Shield } from 'lucide-react';

function Home() {
  const stats = [
    { value: '92.52%', label: 'Detection Accuracy' },
    { value: '37',     label: 'Disease Classes' },
    { value: '6',      label: 'Pakistani Crops' },
    { value: '31K+',   label: 'Training Images' },
  ];

  const features = [
    {
      icon: <Leaf size={32} className="text-green-600" />,
      title: 'Disease Detection',
      desc: 'Upload a photo of your crop leaf and get instant AI-powered disease diagnosis with 92.52% accuracy.'
    },
    {
      icon: <MessageCircle size={32} className="text-green-600" />,
      title: 'AI Agriculture Chatbot',
      desc: 'Ask any farming question in Urdu or English. Get detailed crop-specific guidance from our AI expert.'
    },
    {
      icon: <MapPin size={32} className="text-green-600" />,
      title: 'Disease Warning System',
      desc: 'Community-based disease spread tracking. Get alerts when diseases are detected near your area.'
    },
    {
      icon: <Shield size={32} className="text-green-600" />,
      title: 'Real World Trained',
      desc: 'Trained on real field images from Pakistani crops — not lab conditions. Built for actual farmers.'
    },
  ];

  const crops = ['🌾 Wheat', '🌾 Rice', '🌿 Cotton', '🎋 Sugarcane', '🌽 Corn', '🥔 Potato'];

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-green-700 to-green-900 text-white py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-4">
            <Leaf size={56} className="text-green-300" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">CropGuard AI</h1>
          <p className="text-xl text-green-200 mb-2">
            Intelligent Crop Disease Detection for Pakistani Farmers
          </p>
          <p className="text-green-300 mb-8 text-lg">
            فصلوں کی بیماریوں کی فوری تشخیص — اردو اور انگریزی میں
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/detect"
              className="bg-white text-green-700 font-bold px-8 py-3 rounded-lg hover:bg-green-50 transition"
            >
              Detect Disease Now
            </Link>
            <Link
              to="/chat"
              className="border-2 border-white text-white font-bold px-8 py-3 rounded-lg hover:bg-green-800 transition"
            >
              Ask AI Expert
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white py-10 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s, i) => (
            <div key={i} className="p-4">
              <div className="text-3xl font-bold text-green-700">{s.value}</div>
              <div className="text-gray-500 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="bg-gray-50 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            What CropGuard AI Does
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((f, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="mb-4">{f.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Crops */}
      <div className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Supported Crops</h2>
          <p className="text-gray-500 mb-8">
            Trained on real field images from Pakistan's major crops
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {crops.map((c, i) => (
              <span
                key={i}
                className="bg-green-50 text-green-700 border border-green-200 px-6 py-2 rounded-full font-semibold text-lg"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-green-700 text-white py-16 px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to protect your crops?</h2>
        <p className="text-green-200 mb-8">
          Take a photo of your diseased crop and get instant diagnosis
        </p>
        <Link
          to="/detect"
          className="bg-white text-green-700 font-bold px-10 py-3 rounded-lg hover:bg-green-50 transition text-lg"
        >
          Start Detection →
        </Link>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 text-center py-6 text-sm">
        <p>CropGuard AI © 2026 — Muhammad Ali Ejaz & Ahmad Siddique</p>
        <p className="mt-1">Final Year Project | Data Science</p>
      </footer>
    </div>
  );
}

export default Home;