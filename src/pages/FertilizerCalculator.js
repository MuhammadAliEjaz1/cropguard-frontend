import React, { useState } from 'react';
import { Calculator, Leaf, Sprout, FlaskConical } from 'lucide-react';

const fertilizerData = {
  Wheat: {
    emoji: '🌾',
    perAcre: {
      DAP:   { bags: 1,   kg: 50,  pricePerBag: 15540 },
      Urea:  { bags: 1.5, kg: 75,  pricePerBag: 4780  },
      Potash:{ bags: 0,   kg: 0,   pricePerBag: 7000  },
    },
    schedule: [
      { time: 'At sowing',          fertilizer: 'DAP 1 bag + Urea half bag' },
      { time: 'Tillering (Dec-Jan)', fertilizer: 'Urea 1 bag' },
    ],
    notes: 'Apply DAP and half Urea at sowing. Remaining Urea at tillering stage.',
    sprays: [
      { name: 'Dithane M-45',  type: 'Fungicide',   target: 'Yellow Rust, Brown Rust, Septoria',  dose: '400g/acre',  price: 2495,  unit: 'per 400g pack' },
      { name: 'Topsin-M',      type: 'Fungicide',   target: 'Loose Smut, Powdery Mildew',         dose: '250g/acre',  price: 2249,  unit: 'per 250g pack' },
      { name: 'Karate',        type: 'Insecticide', target: 'Aphids, Army Worm, Shoot Fly',       dose: '200ml/acre', price: 3400,  unit: 'per 500ml bottle' },
      { name: 'Chlorpyrifos',  type: 'Insecticide', target: 'Termites, Cutworm, Aphids',          dose: '500ml/acre', price: 2480,  unit: 'per liter' },
      { name: 'Stomp',         type: 'Herbicide',   target: 'Grassy weeds, Broad leaf weeds',     dose: '1L/acre',    price: 4000,  unit: 'per liter' },
      { name: 'Gramoxone',     type: 'Herbicide',   target: 'Pre-sowing weed control',            dose: '700ml/acre', price: 1350,  unit: 'per liter' },
    ]
  },
  Rice: {
    emoji: '🌾',
    perAcre: {
      DAP:   { bags: 1,   kg: 50, pricePerBag: 15540 },
      Urea:  { bags: 1.5, kg: 75, pricePerBag: 4780  },
      Potash:{ bags: 0.5, kg: 25, pricePerBag: 7000  },
    },
    schedule: [
      { time: 'At transplanting',   fertilizer: 'DAP 1 bag + Potash half bag' },
      { time: 'Tillering (30 days)', fertilizer: 'Urea 1 bag' },
      { time: 'Panicle initiation', fertilizer: 'Urea half bag' },
    ],
    notes: 'Potash is important for rice quality. Do not over-apply Urea — causes lodging.',
    sprays: [
      { name: 'Dithane M-45',  type: 'Fungicide',   target: 'Rice Blast, Brown Spot, Leaf Scald', dose: '400g/acre',  price: 2495, unit: 'per 400g pack' },
      { name: 'Antracol',      type: 'Fungicide',   target: 'Sheath Blight, Leaf Blast',          dose: '400g/acre',  price: 2780, unit: 'per 400g pack' },
      { name: 'Confidor',      type: 'Insecticide', target: 'Brown Planthopper, Leaf Hopper, Aphids', dose: '80ml/acre', price: 2950, unit: 'per 100ml bottle' },
      { name: 'Chlorpyrifos',  type: 'Insecticide', target: 'Stem Borer, Gall Midge',             dose: '500ml/acre', price: 2480, unit: 'per liter' },
      { name: 'Stomp',         type: 'Herbicide',   target: 'Grassy weeds in nursery and field',  dose: '1L/acre',    price: 4000, unit: 'per liter' },
      { name: 'Gramoxone',     type: 'Herbicide',   target: 'Pre-transplant weed burndown',       dose: '700ml/acre', price: 1350, unit: 'per liter' },
    ]
  },
  Cotton: {
    emoji: '🌿',
    perAcre: {
      DAP:   { bags: 1,   kg: 50, pricePerBag: 15540 },
      Urea:  { bags: 1.5, kg: 75, pricePerBag: 4780  },
      Potash:{ bags: 1,   kg: 50, pricePerBag: 7000  },
    },
    schedule: [
      { time: 'At sowing',       fertilizer: 'DAP 1 bag + Potash 1 bag' },
      { time: 'Squaring (45d)',  fertilizer: 'Urea 1 bag' },
      { time: 'Boll formation',  fertilizer: 'Urea half bag' },
    ],
    notes: 'Potash is critical for fiber quality. Do not apply Urea during boll opening.',
    sprays: [
      { name: 'Confidor',      type: 'Insecticide', target: 'Whitefly, Jassid, Aphids, Thrips',   dose: '80ml/acre',  price: 2950, unit: 'per 100ml bottle' },
      { name: 'Karate',        type: 'Insecticide', target: 'Bollworm, Spodoptera, Pink Bollworm', dose: '200ml/acre', price: 3400, unit: 'per 500ml bottle' },
      { name: 'Actara',        type: 'Insecticide', target: 'Whitefly, Jassid (resistant strains)', dose: '60g/acre',  price: 500,  unit: 'per 60g pack' },
      { name: 'Chlorpyrifos',  type: 'Insecticide', target: 'Termites, Cutworm at germination',   dose: '500ml/acre', price: 2480, unit: 'per liter' },
      { name: 'Stomp',         type: 'Herbicide',   target: 'Grassy and broad leaf weeds',        dose: '1L/acre',    price: 4000, unit: 'per liter' },
      { name: 'Gramoxone',     type: 'Herbicide',   target: 'Pre-sowing weed burndown',           dose: '700ml/acre', price: 1350, unit: 'per liter' },
    ]
  },
  Sugarcane: {
    emoji: '🎋',
    perAcre: {
      DAP:   { bags: 1.5, kg: 75,  pricePerBag: 15540 },
      Urea:  { bags: 2.5, kg: 125, pricePerBag: 4780  },
      Potash:{ bags: 1,   kg: 50,  pricePerBag: 7000  },
    },
    schedule: [
      { time: 'At planting',   fertilizer: 'DAP 1.5 bags + Potash 1 bag' },
      { time: '2 months',      fertilizer: 'Urea 1 bag' },
      { time: '4 months',      fertilizer: 'Urea 1 bag' },
      { time: '6 months',      fertilizer: 'Urea half bag' },
    ],
    notes: 'Sugarcane needs highest fertilizer. Split Urea applications give best results.',
    sprays: [
      { name: 'Dithane M-45',  type: 'Fungicide',   target: 'Red Rot, Smut, Wilt disease',        dose: '400g/acre',  price: 2495, unit: 'per 400g pack' },
      { name: 'Confidor',      type: 'Insecticide', target: 'Sugarcane Pyrilla, Aphids, Mealybug', dose: '80ml/acre',  price: 2950, unit: 'per 100ml bottle' },
      { name: 'Chlorpyrifos',  type: 'Insecticide', target: 'Stem Borer, Root Borer, Termites',   dose: '500ml/acre', price: 2480, unit: 'per liter' },
      { name: 'Karate',        type: 'Insecticide', target: 'Top Borer, Early Shoot Borer',        dose: '200ml/acre', price: 3400, unit: 'per 500ml bottle' },
      { name: 'Gramoxone',     type: 'Herbicide',   target: 'Pre-emergence weed control',         dose: '700ml/acre', price: 1350, unit: 'per liter' },
      { name: 'Stomp',         type: 'Herbicide',   target: 'Post-emergence grassy weeds',        dose: '1L/acre',    price: 4000, unit: 'per liter' },
    ]
  },
  Corn: {
    emoji: '🌽',
    perAcre: {
      DAP:   { bags: 1,   kg: 50, pricePerBag: 15540 },
      Urea:  { bags: 1.5, kg: 75, pricePerBag: 4780  },
      Potash:{ bags: 0.5, kg: 25, pricePerBag: 7000  },
    },
    schedule: [
      { time: 'At sowing',         fertilizer: 'DAP 1 bag' },
      { time: 'Knee height (30d)', fertilizer: 'Urea 1 bag' },
      { time: 'Tasseling',         fertilizer: 'Urea half bag + Potash half bag' },
    ],
    notes: 'Corn responds well to Nitrogen. Critical irrigation at tasseling and silking.',
    sprays: [
      { name: 'Dithane M-45',  type: 'Fungicide',   target: 'Gray Leaf Spot, Northern Blight, Rust', dose: '400g/acre',  price: 2495, unit: 'per 400g pack' },
      { name: 'Antracol',      type: 'Fungicide',   target: 'Common Rust, Leaf Blight',              dose: '400g/acre',  price: 2780, unit: 'per 400g pack' },
      { name: 'Karate',        type: 'Insecticide', target: 'Fall Armyworm, Corn Borer, Aphids',     dose: '200ml/acre', price: 3400, unit: 'per 500ml bottle' },
      { name: 'Chlorpyrifos',  type: 'Insecticide', target: 'Termites, Cutworm, Root Worm',          dose: '500ml/acre', price: 2480, unit: 'per liter' },
      { name: 'Stomp',         type: 'Herbicide',   target: 'Pre-emergence grassy and broad weeds',  dose: '1L/acre',    price: 4000, unit: 'per liter' },
      { name: 'Gramoxone',     type: 'Herbicide',   target: 'Pre-sowing weed burndown',              dose: '700ml/acre', price: 1350, unit: 'per liter' },
    ]
  },
  Potato: {
    emoji: '🥔',
    perAcre: {
      DAP:   { bags: 1.5, kg: 75, pricePerBag: 15540 },
      Urea:  { bags: 1,   kg: 50, pricePerBag: 4780  },
      Potash:{ bags: 1,   kg: 50, pricePerBag: 7000  },
    },
    schedule: [
      { time: 'At planting',       fertilizer: 'DAP 1.5 bags + Potash 1 bag' },
      { time: 'Earthing up (30d)', fertilizer: 'Urea 1 bag' },
    ],
    notes: 'Potash is essential for tuber development. Do not over-apply Nitrogen.',
    sprays: [
      { name: 'Ridomil Gold',  type: 'Fungicide',   target: 'Late Blight (best option)',           dose: '400g/acre',  price: 2200, unit: 'per 400g pack' },
      { name: 'Dithane M-45',  type: 'Fungicide',   target: 'Late Blight, Early Blight (preventive)', dose: '400g/acre', price: 2495, unit: 'per 400g pack' },
      { name: 'Antracol',      type: 'Fungicide',   target: 'Early Blight, Late Blight',           dose: '400g/acre',  price: 2780, unit: 'per 400g pack' },
      { name: 'Confidor',      type: 'Insecticide', target: 'Aphids, Whitefly, Jassid',            dose: '80ml/acre',  price: 2950, unit: 'per 100ml bottle' },
      { name: 'Chlorpyrifos',  type: 'Insecticide', target: 'Cutworm, Wireworm, Termites',         dose: '500ml/acre', price: 2480, unit: 'per liter' },
      { name: 'Stomp',         type: 'Herbicide',   target: 'Pre-emergence weed control',          dose: '1L/acre',    price: 4000, unit: 'per liter' },
    ]
  },
};

const crops   = Object.keys(fertilizerData);
const typeColors = {
  Fungicide:   'bg-blue-100 text-blue-700',
  Insecticide: 'bg-red-100 text-red-700',
  Herbicide:   'bg-yellow-100 text-yellow-700',
};

function FertilizerCalculator() {
  const [selectedCrop, setSelectedCrop] = useState('Wheat');
  const [acres, setAcres]               = useState('');
  const [result, setResult]             = useState(null);
  const [activeTab, setActiveTab]       = useState('fertilizer');

  const calculate = () => {
    const a = parseFloat(acres);
    if (!a || a <= 0) return;
    const data = fertilizerData[selectedCrop];
    const calc = {};
    let totalFertCost = 0;
    Object.entries(data.perAcre).forEach(([fert, info]) => {
      const totalBags = +(info.bags * a).toFixed(2);
      const totalKg   = +(info.kg * a).toFixed(1);
      const cost      = Math.round(totalBags * info.pricePerBag);
      totalFertCost  += cost;
      calc[fert] = { totalBags, totalKg, cost, pricePerBag: info.pricePerBag };
    });
    setResult({ calc, totalFertCost, acres: a });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="flex justify-center mb-3">
          <Calculator size={44} className="text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800">Fertilizer & Spray Guide</h1>
        <p className="text-gray-500 mt-2">Calculate fertilizer cost and find the right spray for your crop</p>
        <p className="text-green-600 mt-1">کھاد کی مقدار اور فصل کے لیے مناسب سپرے معلوم کریں</p>
      </div>

      {/* Crop Selector */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-600 mb-3">Select Crop / فصل منتخب کریں:</p>
        <div className="flex flex-wrap gap-3">
          {crops.map(crop => (
            <button
              key={crop}
              onClick={() => { setSelectedCrop(crop); setResult(null); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium border transition ${
                selectedCrop === crop
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'
              }`}
            >
              {fertilizerData[crop].emoji} {crop}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('fertilizer')}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition ${
            activeTab === 'fertilizer'
              ? 'bg-green-600 text-white'
              : 'bg-white border border-gray-200 text-gray-600 hover:border-green-400'
          }`}
        >
          <Leaf size={16} /> Fertilizer Calculator
        </button>
        <button
          onClick={() => setActiveTab('spray')}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition ${
            activeTab === 'spray'
              ? 'bg-green-600 text-white'
              : 'bg-white border border-gray-200 text-gray-600 hover:border-green-400'
          }`}
        >
          <Sprout size={16} /> Spray Guide
        </button>
      </div>

      {/* FERTILIZER TAB */}
      {activeTab === 'fertilizer' && (
        <div>
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            {/* Schedule */}
            <div className="bg-green-50 rounded-lg p-4 mb-6">
              <p className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                <Leaf size={16} /> Application Schedule for {selectedCrop}
              </p>
              <div className="space-y-2">
                {fertilizerData[selectedCrop].schedule.map((s, i) => (
                  <div key={i} className="flex gap-3 text-sm">
                    <span className="bg-green-200 text-green-800 px-2 py-1 rounded font-medium min-w-fit">
                      {s.time}
                    </span>
                    <span className="text-gray-700">{s.fertilizer}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Acres Input */}
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Land Size / زمین کا رقبہ (Acres):
            </label>
            <div className="flex gap-3">
              <input
                type="number"
                value={acres}
                onChange={e => { setAcres(e.target.value); setResult(null); }}
                placeholder="Enter acres e.g. 5"
                min="0.25"
                step="0.25"
                className="flex-1 border rounded-lg px-4 py-3 focus:outline-none focus:border-green-400 text-lg"
              />
              <button
                onClick={calculate}
                disabled={!acres || parseFloat(acres) <= 0}
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition disabled:opacity-50"
              >
                Calculate
              </button>
            </div>
          </div>

          {result && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-gray-800">
                Results for {result.acres} Acre{result.acres > 1 ? 's' : ''} of {selectedCrop}
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {Object.entries(result.calc).map(([fert, info]) => (
                  info.totalBags > 0 && (
                    <div key={fert} className="bg-white rounded-xl shadow-sm border p-5">
                      <div className="text-2xl font-bold text-green-700 mb-3">{fert}</div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Bags / تھیلے</span>
                          <span className="font-bold text-gray-800">{info.totalBags}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Weight / وزن</span>
                          <span className="font-bold text-gray-800">{info.totalKg} kg</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Rate</span>
                          <span>Rs {info.pricePerBag.toLocaleString()}/bag</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between">
                          <span className="font-semibold">Total</span>
                          <span className="font-bold text-green-700">Rs {info.cost.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  )
                ))}
              </div>

              <div className="bg-green-600 text-white rounded-xl p-6 flex justify-between items-center">
                <div>
                  <div className="text-green-200 text-sm">Total Fertilizer Cost / کل کھاد لاگت</div>
                  <div className="text-green-100 text-sm mt-1">
                    Rs {Math.round(result.totalFertCost / result.acres).toLocaleString()} per acre
                  </div>
                </div>
                <div className="text-3xl font-bold">Rs {result.totalFertCost.toLocaleString()}</div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
                <span className="font-bold">💡 Note: </span>
                {fertilizerData[selectedCrop].notes}
                <span className="block mt-1 text-yellow-600">
                  DAP: Rs 15,540/bag | Urea: Rs 4,780/bag | Prices as of 2026.
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SPRAY TAB */}
      {activeTab === 'spray' && (
        <div className="space-y-4">
          <p className="text-gray-600 text-sm">
            Recommended sprays for <span className="font-bold text-green-700">{selectedCrop}</span> — 
            includes fungicides, insecticides and herbicides with current 2026 prices.
          </p>

          {/* Filter by type */}
          {['Fungicide', 'Insecticide', 'Herbicide'].map(type => {
            const filtered = fertilizerData[selectedCrop].sprays.filter(s => s.type === type);
            if (!filtered.length) return null;
            return (
              <div key={type}>
                <h3 className={`inline-block px-3 py-1 rounded-full text-sm font-bold mb-3 ${typeColors[type]}`}>
                  {type === 'Fungicide'   ? '🔵 Fungicide — پھپھوندی کش' :
                   type === 'Insecticide' ? '🔴 Insecticide — کیڑے مار'  :
                                           '🟡 Herbicide — جڑی بوٹی مار'}
                </h3>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {filtered.map((spray, i) => (
                    <div key={i} className="bg-white rounded-xl shadow-sm border p-5">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="font-bold text-gray-800 text-lg">{spray.name}</div>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[spray.type]}`}>
                            {spray.type}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-700 text-lg">
                            Rs {spray.price.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-400">{spray.unit}</div>
                        </div>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex gap-2">
                          <span className="font-medium min-w-[70px]">Target:</span>
                          <span>{spray.target}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="font-medium min-w-[70px]">Dose:</span>
                          <span className="text-green-700 font-medium">{spray.dose}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-800">
            <span className="font-bold">⚠️ Important: </span>
            Always wear gloves, mask and goggles when applying sprays. Keep children away from treated fields. 
            Follow label instructions for correct dosage. Prices are approximate 2026 market rates and may vary by region.
          </div>
        </div>
      )}
    </div>
  );
}

export default FertilizerCalculator;