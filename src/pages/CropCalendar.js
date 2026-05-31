import React, { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, Droplets, Sprout, Wheat, TrendingUp, Lightbulb, Leaf } from 'lucide-react';

/* ─── DATA ─────────────────────────────────────────────────── */
const cropData = {
  Wheat: {
    emoji: '🌾', urdu: 'گندم', season: 'Rabi', seasonLabel: 'Rabi (Winter Crop)',
    sowMonth: 10, harvestMonth: 4,
    regions: {
      Punjab: {
        sowing: 'October 15 — November 15', germination: '7–10 days after sowing',
        fertilizer1: 'DAP 1 bag/acre + Urea ½ bag/acre at sowing',
        fertilizer2: 'Urea 1 bag/acre at tillering (Dec–Jan)',
        irrigation: '4–5 irrigations total\n• 1st: 3 weeks after sowing\n• 2nd: Tillering (Dec)\n• 3rd: Jointing (Jan)\n• 4th: Grain filling (Feb–Mar)',
        harvest: 'April 15 — May 15', yield: '40–50', yieldMax: 50,
        varieties: 'Lasani-08, Galaxy-13',
        tips: 'Use certified seed. Every week delay after Nov 15 reduces yield by 1–2 maunds/acre.',
      },
      Sindh: {
        sowing: 'November 1 — November 30', germination: '7–10 days after sowing',
        fertilizer1: 'DAP 1 bag/acre + Urea ½ bag/acre at sowing',
        fertilizer2: 'Urea 1 bag/acre at tillering (Dec–Jan)',
        irrigation: '3–4 irrigations\n• 1st: 3 weeks after sowing\n• 2nd: Tillering stage\n• 3rd: Grain filling',
        harvest: 'March 15 — April 15', yield: '35–45', yieldMax: 45,
        varieties: 'Regional certified varieties',
        tips: 'Sindh has warmer winters. Sow early November for best results.',
      },
      KPK: {
        sowing: 'October 1 — October 31', germination: 'October–November',
        fertilizer1: 'DAP 1 bag/acre at sowing',
        fertilizer2: 'Urea 1 bag/acre at tillering',
        irrigation: '3–4 irrigations (rain-fed may need less)',
        harvest: 'May 1 — June 1', yield: '30–40', yieldMax: 40,
        varieties: 'Rust-resistant varieties',
        tips: 'Cooler climate — sow earlier than Punjab. Watch for wheat rust.',
      },
      Balochistan: {
        sowing: 'October 15 — November 15', germination: 'November',
        fertilizer1: 'DAP 1 bag/acre at sowing',
        fertilizer2: 'Urea 1 bag/acre at tillering',
        irrigation: '3–4 irrigations (limited water)',
        harvest: 'May 1 — June 15', yield: '25–35', yieldMax: 35,
        varieties: 'Drought-tolerant varieties',
        tips: 'Water is scarce. Use drought-tolerant varieties. Karez and tubewell irrigation common.',
      },
    },
  },
  Rice: {
    emoji: '🌾', urdu: 'چاول', season: 'Kharif', seasonLabel: 'Kharif (Summer Crop)',
    regions: {
      Punjab: {
        sowing: 'Nursery: May 15–June 15\nTransplant: June 20–July 10', germination: '5–7 days in nursery',
        fertilizer1: 'DAP 1 bag/acre at transplanting',
        fertilizer2: 'Urea 1 bag/acre at tillering (30 days)\nUrea ½ bag at panicle initiation',
        irrigation: 'Keep 2–3 inches standing water throughout\nDrain 2 weeks before harvest',
        harvest: 'October 1 — November 15', yield: 'Basmati 20–25 | IRRI 40–50', yieldMax: 50,
        varieties: 'Super Basmati, PK-386',
        tips: 'Transplant on time — late transplanting reduces Basmati quality significantly.',
      },
      Sindh: {
        sowing: 'Nursery: June 1–30\nTransplant: July 1–20', germination: '5–7 days',
        fertilizer1: 'DAP 1 bag/acre at transplanting',
        fertilizer2: 'Urea 1 bag/acre at tillering',
        irrigation: 'Continuous flooding method',
        harvest: 'November 1 — December 15', yield: '45–55', yieldMax: 55,
        varieties: 'IRRI-6, IRRI-9',
        tips: 'Sindh is a major rice producer. Watch for brown planthopper.',
      },
      KPK: {
        sowing: 'Nursery: May 1–31\nTransplant: June 10–30', germination: '5–7 days',
        fertilizer1: 'DAP 1 bag/acre at transplanting',
        fertilizer2: 'Urea 1 bag/acre at tillering',
        irrigation: '3–4 inches standing water',
        harvest: 'September 15 — October 31', yield: '25–35', yieldMax: 35,
        varieties: 'Local varieties',
        tips: 'Swat and Peshawar valley are key areas. Shorter season due to early winters.',
      },
      Balochistan: {
        sowing: 'June 1 — July 1', germination: '5–7 days',
        fertilizer1: 'DAP 1 bag/acre at sowing',
        fertilizer2: 'Urea 1 bag/acre at tillering',
        irrigation: 'Flood irrigation from dams/canals',
        harvest: 'October 1 — November 30', yield: '20–30', yieldMax: 30,
        varieties: 'Local varieties',
        tips: 'Limited cultivation. Mainly Nasirabad and Jaffarabad districts.',
      },
    },
  },
  Cotton: {
    emoji: '🌿', urdu: 'کپاس', season: 'Kharif', seasonLabel: 'Kharif (Summer Crop)',
    regions: {
      Punjab: {
        sowing: 'April 15 — May 31', germination: '7–10 days',
        fertilizer1: 'DAP 1 bag/acre at sowing',
        fertilizer2: 'Urea 1 bag/acre at squaring (45 days)\nUrea ½ bag at boll formation',
        irrigation: '6–8 irrigations\n• 1st: 3 weeks after sowing\n• Every 12–15 days\n• Stop 4 weeks before harvest',
        harvest: 'Sep 15 — Dec 31 (multiple pickings)', yield: '25–35', yieldMax: 35,
        varieties: 'Bt cotton varieties',
        tips: 'Bt cotton reduces pesticide cost. Watch for cotton leaf curl virus.',
      },
      Sindh: {
        sowing: 'April 1 — May 15', germination: '7–10 days',
        fertilizer1: 'DAP 1 bag/acre at sowing',
        fertilizer2: 'Urea 1 bag/acre at squaring',
        irrigation: '5–7 irrigations',
        harvest: 'September 1 — December 15', yield: '20–30', yieldMax: 30,
        varieties: 'Bt cotton varieties',
        tips: 'Sanghar, Mirpurkhas, Nawabshah are major cotton districts.',
      },
      KPK: {
        sowing: 'April 15 — May 31', germination: '7–10 days',
        fertilizer1: 'DAP 1 bag/acre at sowing',
        fertilizer2: 'Urea 1 bag/acre at squaring',
        irrigation: '5–6 irrigations',
        harvest: 'September — November', yield: '20–25', yieldMax: 25,
        varieties: 'Local varieties',
        tips: 'Cotton limited in KPK. Dera Ismail Khan is main area.',
      },
      Balochistan: {
        sowing: 'April 1 — May 15', germination: '7–10 days',
        fertilizer1: 'DAP 1 bag/acre at sowing',
        fertilizer2: 'Urea 1 bag/acre at squaring',
        irrigation: '5–6 irrigations (tube wells)',
        harvest: 'September — November', yield: '20–28', yieldMax: 28,
        varieties: 'Local varieties',
        tips: 'Nasirabad division is main cotton area in Balochistan.',
      },
    },
  },
  Sugarcane: {
    emoji: '🎋', urdu: 'گنا', season: 'Annual', seasonLabel: 'Annual Crop (12–14 months)',
    regions: {
      Punjab: {
        sowing: 'February 15 — March 31', germination: '20–25 days',
        fertilizer1: 'DAP 1.5 bags/acre at planting',
        fertilizer2: 'Urea 1 bag at 2 months\nUrea 1 bag at 4 months\nUrea ½ bag at 6 months',
        irrigation: '8–10 irrigations\n• Every 15–20 days growing season\n• Reduce in winter',
        harvest: 'November — March (next year)', yield: '600–800', yieldMax: 800,
        varieties: 'Healthy ratoon or fresh setts',
        tips: 'Faisalabad, Sargodha, Gujranwala are major areas. Use healthy ratoon or fresh setts.',
      },
      Sindh: {
        sowing: 'October — November (autumn)', germination: '20–25 days',
        fertilizer1: 'DAP 1.5 bags/acre at planting',
        fertilizer2: 'Urea 1 bag at 2 months\nUrea 1 bag at 4 months',
        irrigation: '8–10 irrigations',
        harvest: 'December — April', yield: '500–700', yieldMax: 700,
        varieties: 'Autumn planting varieties',
        tips: 'Tharparkar and Hyderabad areas. Autumn planting common in Sindh.',
      },
      KPK: {
        sowing: 'February — March', germination: '20–25 days',
        fertilizer1: 'DAP 1 bag/acre at planting',
        fertilizer2: 'Urea 1 bag/acre at 2 months',
        irrigation: '6–8 irrigations',
        harvest: 'November — January', yield: '400–600', yieldMax: 600,
        varieties: 'Local varieties',
        tips: 'Charsadda and Mardan are main sugarcane areas in KPK.',
      },
      Balochistan: {
        sowing: 'February — March', germination: '20–25 days',
        fertilizer1: 'DAP 1 bag/acre at planting',
        fertilizer2: 'Urea 1 bag/acre at 2 months',
        irrigation: '6–8 irrigations',
        harvest: 'November — February', yield: '400–500', yieldMax: 500,
        varieties: 'Local varieties',
        tips: 'Limited sugarcane cultivation in Balochistan.',
      },
    },
  },
  Corn: {
    emoji: '🌽', urdu: 'مکئی', season: 'Kharif', seasonLabel: 'Kharif / Spring Crop',
    regions: {
      Punjab: {
        sowing: 'Spring: Feb 15–Mar 15\nKharif: Jun 15–Jul 15', germination: '5–7 days',
        fertilizer1: 'DAP 1 bag/acre at sowing',
        fertilizer2: 'Urea 1 bag at knee-height (30 days)\nUrea ½ bag at tasseling',
        irrigation: '5–6 irrigations\n• 1st: 3 weeks after sowing\n• Critical at tasseling & silking',
        harvest: 'Spring: May–Jun | Kharif: Oct–Nov', yield: '60–80', yieldMax: 80,
        varieties: 'Pioneer 3025, DK-6142',
        tips: 'Hybrid corn gives best yields. Tasseling stage is critical for irrigation.',
      },
      Sindh: {
        sowing: 'Kharif: June — July', germination: '5–7 days',
        fertilizer1: 'DAP 1 bag/acre at sowing',
        fertilizer2: 'Urea 1 bag at knee-height',
        irrigation: '4–5 irrigations',
        harvest: 'October — November', yield: '50–70', yieldMax: 70,
        varieties: 'Hybrid varieties',
        tips: 'Corn cultivation growing in Sindh. Use hybrid varieties for better yield.',
      },
      KPK: {
        sowing: 'April — May (spring)', germination: '5–7 days',
        fertilizer1: 'DAP 1 bag/acre at sowing',
        fertilizer2: 'Urea 1 bag at knee-height',
        irrigation: '4–5 irrigations (rain-fed areas less)',
        harvest: 'August — September', yield: '40–60', yieldMax: 60,
        varieties: 'Local and hybrid varieties',
        tips: 'KPK is major corn producer. Swabi, Nowshera, Mardan are key areas.',
      },
      Balochistan: {
        sowing: 'April — May', germination: '5–7 days',
        fertilizer1: 'DAP 1 bag/acre at sowing',
        fertilizer2: 'Urea 1 bag at knee-height',
        irrigation: '4–5 irrigations',
        harvest: 'August — October', yield: '35–50', yieldMax: 50,
        varieties: 'Local varieties',
        tips: 'Loralai and Zhob districts are main corn areas.',
      },
    },
  },
  Potato: {
    emoji: '🥔', urdu: 'آلو', season: 'Rabi', seasonLabel: 'Rabi (Winter Crop)',
    regions: {
      Punjab: {
        sowing: 'October 1 — November 15', germination: '10–15 days',
        fertilizer1: 'DAP 1.5 bags/acre + Potash 1 bag/acre at planting',
        fertilizer2: 'Urea 1 bag/acre at earthing up (30 days)',
        irrigation: '6–8 irrigations\n• 1st: At planting\n• Every 10–12 days\n• Stop 2 weeks before harvest',
        harvest: 'January 15 — March 15', yield: '150–200', yieldMax: 200,
        varieties: 'Certified seed (CRS)',
        tips: 'Okara, Sahiwal, Pakpattan are major areas. Watch for Late Blight in cool wet weather.',
      },
      Sindh: {
        sowing: 'November 1 — December 1', germination: '10–15 days',
        fertilizer1: 'DAP 1.5 bags/acre at planting',
        fertilizer2: 'Urea 1 bag/acre at earthing up',
        irrigation: '5–6 irrigations',
        harvest: 'February — March', yield: '120–160', yieldMax: 160,
        varieties: 'Local varieties',
        tips: 'Sindh has shorter potato season. Plant in November for best results.',
      },
      KPK: {
        sowing: 'Mar–Apr (spring) or Sep–Oct (autumn)', germination: '10–15 days',
        fertilizer1: 'DAP 1.5 bags/acre at planting',
        fertilizer2: 'Urea 1 bag/acre at earthing up',
        irrigation: '5–7 irrigations',
        harvest: 'Jun–Jul (spring) | Dec–Jan (autumn)', yield: '150–200', yieldMax: 200,
        varieties: 'High-altitude varieties',
        tips: 'KPK produces best quality potatoes. Abbottabad and Swat are famous.',
      },
      Balochistan: {
        sowing: 'March — April', germination: '10–15 days',
        fertilizer1: 'DAP 1.5 bags/acre at planting',
        fertilizer2: 'Urea 1 bag/acre at earthing up',
        irrigation: '5–6 irrigations',
        harvest: 'June — July', yield: '120–150', yieldMax: 150,
        varieties: 'Spring varieties',
        tips: 'Mastung and Quetta produce good quality potatoes in spring.',
      },
    },
  },
};

const CROPS = Object.keys(cropData);
const REGIONS = ['Punjab', 'Sindh', 'KPK', 'Balochistan'];

/* ─── TIMELINE BAR ─────────────────────────────────────────── */
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function SeasonTimeline({ crop, region }) {
  const d = cropData[crop].regions[region];
  // Rough month mapping from text
  const timelines = {
    Wheat:     { Punjab: [10,11,4,5],  Sindh: [11,11,3,4],  KPK: [10,10,5,6],  Balochistan: [10,11,5,6] },
    Rice:      { Punjab: [6,7,10,11],  Sindh: [7,7,11,12],  KPK: [6,6,9,10],   Balochistan: [6,7,10,11] },
    Cotton:    { Punjab: [4,5,9,12],   Sindh: [4,5,9,12],   KPK: [4,5,9,11],   Balochistan: [4,5,9,11] },
    Sugarcane: { Punjab: [2,3,11,3],   Sindh: [10,11,12,4], KPK: [2,3,11,1],   Balochistan: [2,3,11,2] },
    Corn:      { Punjab: [2,7,5,11],   Sindh: [6,7,10,11],  KPK: [4,5,8,9],    Balochistan: [4,5,8,10] },
    Potato:    { Punjab: [10,11,1,3],  Sindh: [11,12,2,3],  KPK: [3,10,6,1],   Balochistan: [3,4,6,7] },
  };
  const [sowStart, sowEnd, harvStart, harvEnd] = timelines[crop][region];

  return (
    <div className="mb-1">
      <div className="flex gap-px mb-1">
        {MONTHS.map((m, i) => {
          const mo = i + 1;
          const isSow = sowEnd >= sowStart
            ? mo >= sowStart && mo <= sowEnd
            : mo >= sowStart || mo <= sowEnd;
          const isHarv = harvEnd >= harvStart
            ? mo >= harvStart && mo <= harvEnd
            : mo >= harvStart || mo <= harvEnd;
          return (
            <div key={m} style={{ flex: 1 }}>
              <div style={{
                height: 8,
                borderRadius: 2,
                background: isSow ? '#16a34a' : isHarv ? '#f59e0b' : '#e5e7eb',
                transition: 'background 0.3s',
              }} />
              <div style={{ fontSize: 8, textAlign: 'center', color: '#9ca3af', marginTop: 2, fontWeight: 500 }}>{m}</div>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#6b7280' }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: '#16a34a', display: 'inline-block' }} />
          Sowing
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#6b7280' }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: '#f59e0b', display: 'inline-block' }} />
          Harvest
        </span>
      </div>
    </div>
  );
}

/* ─── INFO CARD ────────────────────────────────────────────── */
function InfoCard({ icon, title, urdu, value, delay = 0 }) {
  return (
    <div className="info-card" style={{ animationDelay: `${delay}ms` }}>
      <div className="info-card-header">
        <span className="info-card-icon">{icon}</span>
        <div>
          <span className="info-card-title">{title}</span>
          <span className="info-card-urdu">{urdu}</span>
        </div>
      </div>
      <p className="info-card-value">{value}</p>
    </div>
  );
}

/* ─── MAIN COMPONENT ───────────────────────────────────────── */
export default function CropCalendar() {
  const [crop, setCrop] = useState('Wheat');
  const [region, setRegion] = useState('Punjab');
  const [animKey, setAnimKey] = useState(0);

  const data = cropData[crop].regions[region];
  const meta = cropData[crop];

  const change = (fn) => { fn(); setAnimKey(k => k + 1); };

  const seasonColors = {
    Rabi: { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
    Kharif: { bg: '#fff7ed', text: '#c2410c', border: '#fed7aa' },
    Annual: { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
  };
  const sc = seasonColors[meta.season];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display&display=swap');

        .cc-wrap { font-family: 'DM Sans', system-ui, sans-serif; }

        /* ── HERO ── */
        .cc-hero {
          text-align: center;
          padding: 40px 16px 28px;
          position: relative;
        }
        .cc-hero-icon {
          width: 52px; height: 52px;
          background: linear-gradient(135deg, #16a34a, #4ade80);
          border-radius: 14px;
          display: inline-flex; align-items: center; justify-content: center;
          margin-bottom: 14px;
          box-shadow: 0 4px 14px rgba(22,163,74,0.35);
        }
        .cc-hero h1 {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: 2rem; font-weight: 400;
          color: #111827; line-height: 1.2; margin: 0 0 6px;
        }
        .cc-hero-sub { font-size: 0.875rem; color: #6b7280; margin: 0; }
        .cc-hero-urdu {
          font-size: 1rem; color: #16a34a;
          margin-top: 4px; display: block;
          font-weight: 500;
        }

        /* ── SELECTORS ── */
        .selector-label {
          font-size: 0.7rem; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: #9ca3af; margin-bottom: 10px;
          display: flex; align-items: center; gap: 6px;
        }
        .crop-pills { display: flex; flex-wrap: wrap; gap: 8px; }
        .crop-pill {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 14px; border-radius: 10px;
          font-size: 0.8rem; font-weight: 500;
          border: 1.5px solid #e5e7eb;
          background: #fff; color: #374151;
          cursor: pointer;
          transition: all 0.18s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .crop-pill:hover { border-color: #86efac; background: #f0fdf4; }
        .crop-pill.active {
          background: #16a34a; color: #fff;
          border-color: #16a34a;
          box-shadow: 0 2px 8px rgba(22,163,74,0.3);
        }
        .crop-pill-urdu { font-size: 0.7em; opacity: 0.75; }

        .region-pills { display: flex; gap: 8px; flex-wrap: wrap; }
        .region-pill {
          padding: 7px 18px; border-radius: 8px;
          font-size: 0.78rem; font-weight: 600;
          letter-spacing: 0.04em;
          border: 1.5px solid #e5e7eb;
          background: #fff; color: #6b7280;
          cursor: pointer;
          transition: all 0.18s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .region-pill:hover { border-color: #6ee7b7; background: #f0fdf4; color: #166534; }
        .region-pill.active {
          background: #14532d; color: #fff;
          border-color: #14532d;
          box-shadow: 0 2px 8px rgba(20,83,45,0.2);
        }

        /* ── CROP HEADER ── */
        .crop-header {
          display: flex; align-items: flex-start; justify-content: space-between;
          gap: 12px; margin-bottom: 20px;
        }
        .crop-header-left h2 {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: 1.75rem; font-weight: 400;
          color: #111827; margin: 0 0 6px;
        }
        .crop-header-emoji {
          font-size: 3rem; line-height: 1;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.15));
        }
        .season-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 4px 12px; border-radius: 20px;
          font-size: 0.72rem; font-weight: 600; letter-spacing: 0.06em;
          border: 1px solid;
        }

        /* ── INFO CARDS ── */
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; }
        @media (max-width: 500px) { .info-grid { grid-template-columns: 1fr; } }

        .info-card {
          background: #fff;
          border: 1px solid #f0fdf4;
          border-radius: 12px;
          padding: 14px 16px;
          animation: cardIn 0.3s ease both;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 0 0 1px #f0fdf4;
          transition: box-shadow 0.2s;
        }
        .info-card:hover { box-shadow: 0 4px 12px rgba(22,163,74,0.1), 0 0 0 1.5px #bbf7d0; }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .info-card-header { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 6px; }
        .info-card-icon {
          width: 30px; height: 30px; border-radius: 8px;
          background: #f0fdf4;
          display: flex; align-items: center; justify-content: center;
          color: #16a34a; flex-shrink: 0;
        }
        .info-card-title {
          font-size: 0.7rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.08em;
          color: #374151; display: block;
        }
        .info-card-urdu { font-size: 0.7rem; color: #9ca3af; display: block; margin-top: 1px; }
        .info-card-value { font-size: 0.82rem; color: #374151; white-space: pre-line; line-height: 1.6; margin: 0; padding-left: 40px; }

        /* ── YIELD ── */
        .yield-card {
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          border: 1px solid #bbf7d0;
          border-radius: 14px; padding: 18px 20px;
          margin-bottom: 10px;
          display: flex; align-items: center; gap: 16px;
          animation: cardIn 0.3s ease 0.25s both;
        }
        .yield-label { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #16a34a; margin-bottom: 4px; }
        .yield-value { font-family: 'DM Serif Display', Georgia, serif; font-size: 1.6rem; color: #14532d; line-height: 1; }
        .yield-unit { font-size: 0.75rem; color: #4b7c5e; margin-top: 2px; }
        .yield-varieties { font-size: 0.75rem; color: #6b7280; margin-top: 4px; }
        .yield-icon {
          width: 48px; height: 48px; border-radius: 12px;
          background: linear-gradient(135deg, #16a34a, #4ade80);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; box-shadow: 0 2px 8px rgba(22,163,74,0.3);
          font-size: 1.5rem;
        }

        /* ── TIMELINE ── */
        .timeline-card {
          background: #fff;
          border: 1px solid #f0fdf4;
          border-radius: 12px; padding: 16px;
          margin-bottom: 10px;
          animation: cardIn 0.3s ease 0.15s both;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }
        .timeline-title { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #9ca3af; margin-bottom: 10px; }

        /* ── TIP ── */
        .tip-card {
          background: #fffbeb;
          border: 1px solid #fde68a;
          border-left: 4px solid #f59e0b;
          border-radius: 0 12px 12px 0;
          padding: 16px 18px;
          animation: cardIn 0.3s ease 0.3s both;
        }
        .tip-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
        .tip-header-text { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #b45309; }
        .tip-body { font-size: 0.83rem; color: #78350f; line-height: 1.6; }

        /* ── SECTION WRAPPER ── */
        .section-box { padding: 0 20px 24px; }
        .section-divider { height: 1px; background: #f3f4f6; margin: 0 20px 20px; }
        .section-head { padding: 20px 20px 12px; }
      `}</style>

      <div className="cc-wrap" style={{ maxWidth: 680, margin: '0 auto' }}>

        {/* HERO */}
        <div className="cc-hero">
          <div className="cc-hero-icon">
            <Calendar size={26} color="#fff" strokeWidth={2} />
          </div>
          <h1>Crop Calendar</h1>
          <p className="cc-hero-sub">Sowing · Irrigation · Fertilizer · Harvest — All Pakistani crops</p>
          <span className="cc-hero-urdu">پاکستانی فصلوں کا زرعی کیلنڈر</span>
        </div>

        <div className="section-divider" />

        {/* CROP SELECTOR */}
        <div className="section-box">
          <div className="selector-label">
            <Leaf size={12} /> Select Crop &nbsp;·&nbsp; فصل منتخب کریں
          </div>
          <div className="crop-pills">
            {CROPS.map(c => (
              <button
                key={c}
                className={`crop-pill${crop === c ? ' active' : ''}`}
                onClick={() => change(() => setCrop(c))}
              >
                <span>{cropData[c].emoji}</span>
                <span>{c}</span>
                <span className="crop-pill-urdu">{cropData[c].urdu}</span>
              </button>
            ))}
          </div>
        </div>

        {/* REGION SELECTOR */}
        <div className="section-box" style={{ paddingTop: 0 }}>
          <div className="selector-label">
            <MapPin size={12} /> Province &nbsp;·&nbsp; صوبہ
          </div>
          <div className="region-pills">
            {REGIONS.map(r => (
              <button
                key={r}
                className={`region-pill${region === r ? ' active' : ''}`}
                onClick={() => change(() => setRegion(r))}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="section-divider" />

        {/* DATA PANEL */}
        <div key={animKey} className="section-box">

          {/* Crop identity */}
          <div className="crop-header">
            <div className="crop-header-left">
              <h2>{crop} — {region}</h2>
              <span
                className="season-badge"
                style={{ background: sc.bg, color: sc.text, borderColor: sc.border }}
              >
                <Sprout size={11} /> {meta.seasonLabel}
              </span>
            </div>
            <div className="crop-header-emoji">{meta.emoji}</div>
          </div>

          {/* Season timeline */}
          <div className="timeline-card">
            <div className="timeline-title">Growing Calendar</div>
            <SeasonTimeline crop={crop} region={region} />
          </div>

          {/* Info cards */}
          <div className="info-grid">
            <InfoCard icon={<Sprout size={15} />} title="Sowing Time" urdu="بوائی کا وقت" value={data.sowing} delay={0} />
            <InfoCard icon={<Sprout size={15} />} title="Germination" urdu="انکرت" value={data.germination} delay={40} />
            <InfoCard icon={<Wheat size={15} />} title="First Fertilizer" urdu="پہلی کھاد" value={data.fertilizer1} delay={80} />
            <InfoCard icon={<Wheat size={15} />} title="Follow-up Doses" urdu="بعد کی کھاد" value={data.fertilizer2} delay={120} />
            <InfoCard icon={<Droplets size={15} />} title="Irrigation" urdu="آبپاشی" value={data.irrigation} delay={160} />
            <InfoCard icon={<Calendar size={15} />} title="Harvest Time" urdu="کٹائی" value={data.harvest} delay={200} />
          </div>

          {/* Yield */}
          <div className="yield-card">
            <div className="yield-icon">{meta.emoji}</div>
            <div style={{ flex: 1 }}>
              <div className="yield-label">
                <TrendingUp size={10} style={{ display: 'inline', marginRight: 4 }} />
                Expected Yield &nbsp;·&nbsp; متوقع پیداوار
              </div>
              <div className="yield-value">{data.yield}</div>
              <div className="yield-unit">maunds per acre</div>
              <div className="yield-varieties">Varieties: {data.varieties}</div>
            </div>
          </div>

          {/* Tip */}
          <div className="tip-card">
            <div className="tip-header">
              <span style={{ fontSize: '1rem' }}>💡</span>
              <span className="tip-header-text">Expert Tip — {region}</span>
            </div>
            <p className="tip-body">{data.tips}</p>
          </div>

        </div>
      </div>
    </>
  );
}