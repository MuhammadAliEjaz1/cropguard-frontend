import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { MapPin, AlertTriangle, RefreshCw, Send } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../config';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const diseaseColors = {
  Wheat:     '#f59e0b',
  Rice:      '#10b981',
  Cotton:    '#8b5cf6',
  Sugarcane: '#06b6d4',
  Corn:      '#f97316',
  Potato:    '#6b7280',
};

const pakistanCities = [
  { name: 'Lahore',       lat: 31.5204, lng: 74.3587 },
  { name: 'Faisalabad',   lat: 31.4180, lng: 73.0790 },
  { name: 'Multan',       lat: 30.1575, lng: 71.5249 },
  { name: 'Bahawalpur',   lat: 29.3956, lng: 71.6836 },
  { name: 'Okara',        lat: 30.8138, lng: 73.4534 },
  { name: 'Hyderabad',    lat: 25.3960, lng: 68.3578 },
  { name: 'Sukkur',       lat: 27.7052, lng: 68.8574 },
  { name: 'Peshawar',     lat: 34.0151, lng: 71.5249 },
  { name: 'Quetta',       lat: 30.1798, lng: 66.9750 },
  { name: 'Islamabad',    lat: 33.6844, lng: 73.0479 },
  { name: 'Gujranwala',   lat: 32.1877, lng: 74.1945 },
  { name: 'Sahiwal',      lat: 30.6706, lng: 73.1064 },
  { name: 'Sargodha',     lat: 32.0836, lng: 72.6711 },
  { name: 'Nawabshah',    lat: 26.2442, lng: 68.4101 },
  { name: 'Mardan',       lat: 34.1986, lng: 72.0404 },
];

function DiseaseMap() {
  const [reports, setReports]             = useState([]);
  const [loading, setLoading]             = useState(false);
  const [submitting, setSubmitting]       = useState(false);
  const [showForm, setShowForm]           = useState(false);
  const [submitted, setSubmitted]         = useState(false);
  const [form, setForm] = useState({
    crop: 'Wheat',
    disease: '',
    location_name: '',
    latitude: '',
    longitude: '',
  });

  const crops = ['Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Corn', 'Potato'];

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/reports`);
      setReports(res.data.reports || []);
    } catch {
      console.error('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReports(); }, []);

  const handleCitySelect = (e) => {
    const city = pakistanCities.find(c => c.name === e.target.value);
    if (city) {
      setForm(prev => ({
        ...prev,
        location_name: city.name,
        latitude: city.lat,
        longitude: city.lng
      }));
    }
  };

  const submitReport = async () => {
    if (!form.disease || !form.latitude || !form.longitude) return;
    setSubmitting(true);
    try {
      await axios.post(`${API_URL}/report`, {
        crop: form.crop,
        disease: form.disease,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
        location_name: form.location_name,
      });
      setSubmitted(true);
      setShowForm(false);
      setForm({ crop: 'Wheat', disease: '', location_name: '', latitude: '', longitude: '' });
      setTimeout(() => setSubmitted(false), 3000);
      fetchReports();
    } catch {
      alert('Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Group reports by location to detect outbreaks
  const outbreaks = reports.reduce((acc, r) => {
    const key = `${r.crop}__${r.disease}`;
    if (!acc[key]) acc[key] = { crop: r.crop, disease: r.disease, reports: [] };
    acc[key].reports.push(r);
    return acc;
  }, {});

  const alertOutbreaks = Object.values(outbreaks).filter(o => o.reports.length >= 2);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-3">
          <MapPin size={44} className="text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800">Disease Warning Map</h1>
        <p className="text-gray-500 mt-2">Real-time crop disease outbreak tracking across Pakistan</p>
        <p className="text-green-600 mt-1">پاکستان میں فصلوں کی بیماریوں کی نگرانی</p>
      </div>

      {/* Alert Outbreaks */}
      {alertOutbreaks.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={20} className="text-red-600" />
            <span className="font-bold text-red-700">Active Outbreak Alerts!</span>
          </div>
          <div className="space-y-2">
            {alertOutbreaks.map((o, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-red-700">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                <span>
                  <b>{o.crop} — {o.disease}</b> detected in {o.reports.length} locations:
                  {o.reports.map(r => r.location_name || 'Unknown').join(', ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats + Actions */}
      <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
        <div className="flex gap-4">
          <div className="bg-white rounded-lg border px-4 py-2 text-center">
            <div className="text-2xl font-bold text-green-700">{reports.length}</div>
            <div className="text-xs text-gray-500">Total Reports</div>
          </div>
          <div className="bg-white rounded-lg border px-4 py-2 text-center">
            <div className="text-2xl font-bold text-red-600">{alertOutbreaks.length}</div>
            <div className="text-xs text-gray-500">Active Outbreaks</div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchReports}
            className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm hover:border-green-400 transition"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition"
          >
            <Send size={14} />
            Report Disease
          </button>
        </div>
      </div>

      {/* Success message */}
      {submitted && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm font-medium">
          ✅ Disease report submitted successfully! Thank you for helping other farmers.
        </div>
      )}

      {/* Report Form */}
      {showForm && (
        <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
          <h3 className="font-bold text-gray-800 mb-4">Report a Disease in Your Area</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Crop / فصل</label>
              <select
                value={form.crop}
                onChange={e => setForm(p => ({ ...p, crop: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-green-400"
              >
                {crops.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Disease / بیماری</label>
              <input
                type="text"
                value={form.disease}
                onChange={e => setForm(p => ({ ...p, disease: e.target.value }))}
                placeholder="e.g. Yellow Rust, Late Blight"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-green-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Select City / شہر منتخب کریں</label>
              <select
                onChange={handleCitySelect}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-green-400"
              >
                <option value="">-- Select nearest city --</option>
                {pakistanCities.map(c => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Location Name</label>
              <input
                type="text"
                value={form.location_name}
                onChange={e => setForm(p => ({ ...p, location_name: e.target.value }))}
                placeholder="e.g. Village Chak 45, Okara"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-green-400"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button
              onClick={submitReport}
              disabled={submitting || !form.disease || !form.latitude}
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? 'Submitting...' : <><Send size={16} /> Submit Report</>}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="border border-gray-200 px-6 py-2 rounded-lg text-gray-600 hover:border-red-300 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Map */}
      <div className="rounded-xl overflow-hidden border shadow-sm mb-6" style={{ height: '500px' }}>
        <MapContainer
          center={[30.3753, 69.3451]}
          zoom={6}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          {reports.map((r, i) => (
            <React.Fragment key={i}>
              <Marker position={[r.latitude, r.longitude]}>
                <Popup>
                  <div className="text-sm">
                    <div className="font-bold text-gray-800">{r.crop} — {r.disease}</div>
                    <div className="text-gray-500">{r.location_name || 'Unknown location'}</div>
                    <div className="text-gray-400 text-xs mt-1">
                      {new Date(r.timestamp).toLocaleDateString('en-PK')}
                    </div>
                  </div>
                </Popup>
              </Marker>
              <Circle
                center={[r.latitude, r.longitude]}
                radius={15000}
                pathOptions={{
                  color: diseaseColors[r.crop] || '#ef4444',
                  fillColor: diseaseColors[r.crop] || '#ef4444',
                  fillOpacity: 0.15,
                  weight: 1.5
                }}
              />
            </React.Fragment>
          ))}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-xl border p-4 mb-6">
        <p className="text-sm font-medium text-gray-600 mb-3">Map Legend / نقشے کی علامات</p>
        <div className="flex flex-wrap gap-4">
          {Object.entries(diseaseColors).map(([crop, color]) => (
            <div key={crop} className="flex items-center gap-2 text-sm">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color }}></div>
              <span className="text-gray-600">{crop}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reports List */}
      {reports.length > 0 && (
        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-bold text-gray-800 mb-4">Recent Reports</h3>
          <div className="space-y-3">
            {[...reports].reverse().slice(0, 10).map((r, i) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg text-sm">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: diseaseColors[r.crop] || '#ef4444' }}
                />
                <div className="flex-1">
                  <span className="font-medium">{r.crop} — {r.disease}</span>
                  <span className="text-gray-400 ml-2">{r.location_name}</span>
                </div>
                <div className="text-gray-400">
                  {new Date(r.timestamp).toLocaleDateString('en-PK')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {reports.length === 0 && !loading && (
        <div className="text-center py-10 text-gray-400">
          <MapPin size={40} className="mx-auto mb-3 opacity-30" />
          <p>No disease reports yet.</p>
          <p className="text-sm mt-1">Be the first to report a disease in your area!</p>
        </div>
      )}
    </div>
  );
}

export default DiseaseMap;