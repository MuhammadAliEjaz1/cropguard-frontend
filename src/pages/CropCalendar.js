import React, { useState } from 'react';
import { Calendar, MapPin, Droplets, Sprout, Wheat } from 'lucide-react';

const cropData = {
  Wheat: {
    emoji: '🌾',
    seasons: 'Rabi (Winter Crop)',
    regions: {
      Punjab: {
        sowing: 'October 15 — November 15',
        germination: 'November (7-10 days after sowing)',
        fertilizer1: 'At sowing: DAP 1 bag/acre + Urea half bag/acre',
        fertilizer2: 'At tillering (Dec-Jan): Urea 1 bag/acre',
        irrigation: '4-5 irrigations total:\n• 1st: 3 weeks after sowing\n• 2nd: Tillering stage (Dec)\n• 3rd: Jointing stage (Jan)\n• 4th: Grain filling (Feb-Mar)',
        harvest: 'April 15 — May 15',
        yield: '40-50 maunds per acre (Lasani-08, Galaxy-13)',
        tips: 'Use certified seed. Avoid late sowing — every week delay after Nov 15 reduces yield by 1-2 maunds.'
      },
      Sindh: {
        sowing: 'November 1 — November 30',
        germination: 'November (7-10 days after sowing)',
        fertilizer1: 'At sowing: DAP 1 bag/acre + Urea half bag/acre',
        fertilizer2: 'At tillering (Dec-Jan): Urea 1 bag/acre',
        irrigation: '3-4 irrigations total:\n• 1st: 3 weeks after sowing\n• 2nd: Tillering stage\n• 3rd: Grain filling stage',
        harvest: 'March 15 — April 15',
        yield: '35-45 maunds per acre',
        tips: 'Sindh has warmer winters. Sow early November for best results.'
      },
      KPK: {
        sowing: 'October 1 — October 31',
        germination: 'October-November',
        fertilizer1: 'At sowing: DAP 1 bag/acre',
        fertilizer2: 'At tillering: Urea 1 bag/acre',
        irrigation: '3-4 irrigations (rain-fed areas may need less)',
        harvest: 'May 1 — June 1',
        yield: '30-40 maunds per acre',
        tips: 'KPK has cooler climate. Sow earlier than Punjab. Check for wheat rust as climate is favorable for it.'
      },
      Balochistan: {
        sowing: 'October 15 — November 15',
        germination: 'November',
        fertilizer1: 'At sowing: DAP 1 bag/acre',
        fertilizer2: 'At tillering: Urea 1 bag/acre',
        irrigation: '3-4 irrigations (limited water availability)',
        harvest: 'May 1 — June 15',
        yield: '25-35 maunds per acre',
        tips: 'Water is scarce. Use drought-tolerant varieties. Karez and tubewell irrigation common.'
      }
    }
  },
  Rice: {
    emoji: '🌾',
    seasons: 'Kharif (Summer Crop)',
    regions: {
      Punjab: {
        sowing: 'Nursery: May 15 — June 15 | Transplanting: June 20 — July 10',
        germination: '5-7 days in nursery',
        fertilizer1: 'At transplanting: DAP 1 bag/acre',
        fertilizer2: 'At tillering (30 days): Urea 1 bag/acre\nAt panicle initiation: Urea half bag/acre',
        irrigation: 'Keep 2-3 inches standing water throughout.\nDrain 2 weeks before harvest.',
        harvest: 'October 1 — November 15',
        yield: 'Basmati: 20-25 maunds | IRRI-6: 40-50 maunds per acre',
        tips: 'Super Basmati and PK-386 are best varieties for Punjab. Transplant on time — late transplanting reduces Basmati quality.'
      },
      Sindh: {
        sowing: 'Nursery: June 1 — June 30 | Transplanting: July 1 — July 20',
        germination: '5-7 days',
        fertilizer1: 'At transplanting: DAP 1 bag/acre',
        fertilizer2: 'At tillering: Urea 1 bag/acre',
        irrigation: 'Continuous flooding method commonly used',
        harvest: 'November 1 — December 15',
        yield: 'IRRI-6: 45-55 maunds per acre',
        tips: 'Sindh is major rice producer. IRRI-6 and IRRI-9 are dominant varieties. Watch for brown planthopper.'
      },
      KPK: {
        sowing: 'Nursery: May 1 — May 31 | Transplanting: June 10 — June 30',
        germination: '5-7 days',
        fertilizer1: 'At transplanting: DAP 1 bag/acre',
        fertilizer2: 'At tillering: Urea 1 bag/acre',
        irrigation: '3-4 inches standing water',
        harvest: 'September 15 — October 31',
        yield: '25-35 maunds per acre',
        tips: 'Swat and Peshawar valley are key rice areas. Shorter growing season due to early winters.'
      },
      Balochistan: {
        sowing: 'June 1 — July 1',
        germination: '5-7 days',
        fertilizer1: 'At sowing: DAP 1 bag/acre',
        fertilizer2: 'At tillering: Urea 1 bag/acre',
        irrigation: 'Flood irrigation from dams and canals',
        harvest: 'October 1 — November 30',
        yield: '20-30 maunds per acre',
        tips: 'Limited rice cultivation. Mainly in Nasirabad and Jaffarabad districts.'
      }
    }
  },
  Cotton: {
    emoji: '🌿',
    seasons: 'Kharif (Summer Crop)',
    regions: {
      Punjab: {
        sowing: 'April 15 — May 31',
        germination: '7-10 days',
        fertilizer1: 'At sowing: DAP 1 bag/acre',
        fertilizer2: 'At squaring (45 days): Urea 1 bag/acre\nAt boll formation: Urea half bag/acre',
        irrigation: '6-8 irrigations:\n• 1st: 3 weeks after sowing\n• Then every 12-15 days\n• Stop 4 weeks before harvest',
        harvest: 'September 15 — December 31 (multiple pickings)',
        yield: '25-35 maunds per acre (Bt cotton)',
        tips: 'Use Bt cotton varieties to reduce pesticide cost. Watch for cotton leaf curl virus — main threat in Punjab.'
      },
      Sindh: {
        sowing: 'April 1 — May 15',
        germination: '7-10 days',
        fertilizer1: 'At sowing: DAP 1 bag/acre',
        fertilizer2: 'At squaring: Urea 1 bag/acre',
        irrigation: '5-7 irrigations',
        harvest: 'September 1 — December 15',
        yield: '20-30 maunds per acre',
        tips: 'Sanghar, Mirpurkhas, and Nawabshah are major cotton districts in Sindh.'
      },
      KPK: {
        sowing: 'April 15 — May 31',
        germination: '7-10 days',
        fertilizer1: 'At sowing: DAP 1 bag/acre',
        fertilizer2: 'At squaring: Urea 1 bag/acre',
        irrigation: '5-6 irrigations',
        harvest: 'September — November',
        yield: '20-25 maunds per acre',
        tips: 'Cotton cultivation limited in KPK. Dera Ismail Khan is main cotton area.'
      },
      Balochistan: {
        sowing: 'April 1 — May 15',
        germination: '7-10 days',
        fertilizer1: 'At sowing: DAP 1 bag/acre',
        fertilizer2: 'At squaring: Urea 1 bag/acre',
        irrigation: '5-6 irrigations from tube wells',
        harvest: 'September — November',
        yield: '20-28 maunds per acre',
        tips: 'Nasirabad division is main cotton area in Balochistan.'
      }
    }
  },
  Sugarcane: {
    emoji: '🎋',
    seasons: 'Annual Crop (12-14 months)',
    regions: {
      Punjab: {
        sowing: 'February 15 — March 31',
        germination: '20-25 days',
        fertilizer1: 'At planting: DAP 1.5 bags/acre',
        fertilizer2: 'At 2 months: Urea 1 bag/acre\nAt 4 months: Urea 1 bag/acre\nAt 6 months: Urea half bag/acre',
        irrigation: '8-10 irrigations:\n• Every 15-20 days in growing season\n• Reduce in winter months',
        harvest: 'November — March (following year)',
        yield: '600-800 maunds per acre',
        tips: 'Faisalabad, Sargodha, and Gujranwala are major sugarcane areas. Use healthy ratoon or fresh setts.'
      },
      Sindh: {
        sowing: 'October — November (autumn planting)',
        germination: '20-25 days',
        fertilizer1: 'At planting: DAP 1.5 bags/acre',
        fertilizer2: 'At 2 months: Urea 1 bag/acre\nAt 4 months: Urea 1 bag/acre',
        irrigation: '8-10 irrigations',
        harvest: 'December — April',
        yield: '500-700 maunds per acre',
        tips: 'Tharparkar and Hyderabad areas. Autumn planting common in Sindh.'
      },
      KPK: {
        sowing: 'February — March',
        germination: '20-25 days',
        fertilizer1: 'At planting: DAP 1 bag/acre',
        fertilizer2: 'At 2 months: Urea 1 bag/acre',
        irrigation: '6-8 irrigations',
        harvest: 'November — January',
        yield: '400-600 maunds per acre',
        tips: 'Charsadda and Mardan are main sugarcane areas in KPK.'
      },
      Balochistan: {
        sowing: 'February — March',
        germination: '20-25 days',
        fertilizer1: 'At planting: DAP 1 bag/acre',
        fertilizer2: 'At 2 months: Urea 1 bag/acre',
        irrigation: '6-8 irrigations',
        harvest: 'November — February',
        yield: '400-500 maunds per acre',
        tips: 'Limited sugarcane cultivation in Balochistan.'
      }
    }
  },
  Corn: {
    emoji: '🌽',
    seasons: 'Kharif (Summer) or Spring Crop',
    regions: {
      Punjab: {
        sowing: 'Spring: February 15 — March 15 | Kharif: June 15 — July 15',
        germination: '5-7 days',
        fertilizer1: 'At sowing: DAP 1 bag/acre',
        fertilizer2: 'At knee height (30 days): Urea 1 bag/acre\nAt tasseling: Urea half bag/acre',
        irrigation: '5-6 irrigations:\n• 1st: 3 weeks after sowing\n• Critical at tasseling and silking',
        harvest: 'Spring: May-June | Kharif: October-November',
        yield: '60-80 maunds per acre (hybrid varieties)',
        tips: 'Pioneer and Monsanto hybrid varieties give best yield. Sheikhupura, Hafizabad are major corn areas.'
      },
      Sindh: {
        sowing: 'Kharif: June — July',
        germination: '5-7 days',
        fertilizer1: 'At sowing: DAP 1 bag/acre',
        fertilizer2: 'At knee height: Urea 1 bag/acre',
        irrigation: '4-5 irrigations',
        harvest: 'October — November',
        yield: '50-70 maunds per acre',
        tips: 'Corn cultivation growing in Sindh. Use hybrid varieties for better yield.'
      },
      KPK: {
        sowing: 'April — May (spring planting)',
        germination: '5-7 days',
        fertilizer1: 'At sowing: DAP 1 bag/acre',
        fertilizer2: 'At knee height: Urea 1 bag/acre',
        irrigation: '4-5 irrigations (rain-fed areas need less)',
        harvest: 'August — September',
        yield: '40-60 maunds per acre',
        tips: 'KPK is major corn producer. Swabi, Nowshera, and Mardan are key areas.'
      },
      Balochistan: {
        sowing: 'April — May',
        germination: '5-7 days',
        fertilizer1: 'At sowing: DAP 1 bag/acre',
        fertilizer2: 'At knee height: Urea 1 bag/acre',
        irrigation: '4-5 irrigations',
        harvest: 'August — October',
        yield: '35-50 maunds per acre',
        tips: 'Loralai and Zhob districts are main corn areas in Balochistan.'
      }
    }
  },
  Potato: {
    emoji: '🥔',
    seasons: 'Rabi (Winter Crop)',
    regions: {
      Punjab: {
        sowing: 'October 1 — November 15',
        germination: '10-15 days',
        fertilizer1: 'At planting: DAP 1.5 bags/acre + Potash 1 bag/acre',
        fertilizer2: 'At earthing up (30 days): Urea 1 bag/acre',
        irrigation: '6-8 irrigations:\n• 1st: At planting\n• Then every 10-12 days\n• Stop 2 weeks before harvest',
        harvest: 'January 15 — March 15',
        yield: '150-200 maunds per acre',
        tips: 'Okara, Sahiwal, and Pakpattan are major potato areas. Use certified seed from CRS. Watch for Late Blight in cool wet weather.'
      },
      Sindh: {
        sowing: 'November 1 — December 1',
        germination: '10-15 days',
        fertilizer1: 'At planting: DAP 1.5 bags/acre',
        fertilizer2: 'At earthing up: Urea 1 bag/acre',
        irrigation: '5-6 irrigations',
        harvest: 'February — March',
        yield: '120-160 maunds per acre',
        tips: 'Sindh has shorter potato season. Plant in November for best results.'
      },
      KPK: {
        sowing: 'March — April (spring) or September — October (autumn)',
        germination: '10-15 days',
        fertilizer1: 'At planting: DAP 1.5 bags/acre',
        fertilizer2: 'At earthing up: Urea 1 bag/acre',
        irrigation: '5-7 irrigations',
        harvest: 'June-July (spring) or December-January (autumn)',
        yield: '150-200 maunds per acre',
        tips: 'KPK produces some of the best quality potatoes. Abbottabad and Swat are famous for potato production.'
      },
      Balochistan: {
        sowing: 'March — April',
        germination: '10-15 days',
        fertilizer1: 'At planting: DAP 1.5 bags/acre',
        fertilizer2: 'At earthing up: Urea 1 bag/acre',
        irrigation: '5-6 irrigations',
        harvest: 'June — July',
        yield: '120-150 maunds per acre',
        tips: 'Mastung and Quetta areas produce good quality potatoes in spring.'
      }
    }
  }
};

const crops = Object.keys(cropData);
const regions = ['Punjab', 'Sindh', 'KPK', 'Balochistan'];

function InfoCard({ icon, title, value }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-green-600">{icon}</span>
        <span className="font-semibold text-gray-700 text-sm">{title}</span>
      </div>
      <p className="text-gray-600 text-sm whitespace-pre-line leading-relaxed">{value}</p>
    </div>
  );
}

function CropCalendar() {
  const [selectedCrop, setSelectedCrop]     = useState('Wheat');
  const [selectedRegion, setSelectedRegion] = useState('Punjab');

  const data = cropData[selectedCrop].regions[selectedRegion];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="flex justify-center mb-3">
          <Calendar size={44} className="text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800">Crop Calendar</h1>
        <p className="text-gray-500 mt-2">Sowing, irrigation, fertilizer and harvest schedule for Pakistani crops</p>
        <p className="text-green-600 mt-1">پاکستانی فصلوں کا زرعی کیلنڈر</p>
      </div>

      {/* Crop Selector */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-600 mb-3">Select Crop / فصل منتخب کریں:</p>
        <div className="flex flex-wrap gap-3">
          {crops.map(crop => (
            <button
              key={crop}
              onClick={() => setSelectedCrop(crop)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full font-medium border transition ${
                selectedCrop === crop
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'
              }`}
            >
              {cropData[crop].emoji} {crop}
            </button>
          ))}
        </div>
      </div>

      {/* Region Selector */}
      <div className="mb-8">
        <p className="text-sm font-medium text-gray-600 mb-3">
          <MapPin size={14} className="inline mr-1" />
          Select Region / صوبہ منتخب کریں:
        </p>
        <div className="flex flex-wrap gap-3">
          {regions.map(region => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`px-5 py-2 rounded-full font-medium border transition ${
                selectedRegion === region
                  ? 'bg-green-700 text-white border-green-700'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      {/* Season Badge */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-4xl">{cropData[selectedCrop].emoji}</span>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{selectedCrop} — {selectedRegion}</h2>
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
            {cropData[selectedCrop].seasons}
          </span>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <InfoCard
          icon={<Sprout size={18} />}
          title="Sowing Time / بوائی کا وقت"
          value={data.sowing}
        />
        <InfoCard
          icon={<Sprout size={18} />}
          title="Germination / انکرت"
          value={data.germination}
        />
        <InfoCard
          icon={<Wheat size={18} />}
          title="Fertilizer — First Dose / پہلی کھاد"
          value={data.fertilizer1}
        />
        <InfoCard
          icon={<Wheat size={18} />}
          title="Fertilizer — Subsequent Doses / بعد کی کھاد"
          value={data.fertilizer2}
        />
        <InfoCard
          icon={<Droplets size={18} />}
          title="Irrigation Schedule / آبپاشی"
          value={data.irrigation}
        />
        <InfoCard
          icon={<Calendar size={18} />}
          title="Harvest Time / کٹائی کا وقت"
          value={data.harvest}
        />
      </div>

      {/* Yield */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-green-600 font-semibold">Expected Yield / متوقع پیداوار</span>
        </div>
        <p className="text-green-800 font-bold text-lg">{data.yield}</p>
      </div>

      {/* Tips */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">💡</span>
          <span className="font-semibold text-yellow-800">Expert Tips for {selectedRegion}</span>
        </div>
        <p className="text-yellow-900 leading-relaxed">{data.tips}</p>
      </div>
    </div>
  );
}

export default CropCalendar;