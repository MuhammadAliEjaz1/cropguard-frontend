import React, { useState } from 'react';
import { Cloud, Wind, Droplets, Thermometer, Eye, Search } from 'lucide-react';
import axios from 'axios';

const API_KEY = 'da561476cf21af915719b909b3179c89';

const pakistanCities = [
  'Lahore', 'Karachi', 'Islamabad', 'Faisalabad', 'Multan',
  'Bahawalpur', 'Okara', 'Sahiwal', 'Sargodha', 'Gujranwala',
  'Hyderabad', 'Sukkur', 'Larkana', 'Peshawar', 'Mardan',
  'Quetta', 'Dera Ghazi Khan', 'Rahim Yar Khan', 'Sialkot', 'Nawabshah'
];

const weatherAdvice = (temp, humidity, description) => {
  const advice = [];
  const desc = description.toLowerCase();

  if (temp > 38) advice.push({ en: 'Very hot — water your crops early morning or evening only', ur: 'بہت زیادہ گرمی — صرف صبح سویرے یا شام کو فصل کو پانی دیں' });
  if (temp < 5)  advice.push({ en: 'Frost risk — protect sensitive crops with covering', ur: 'پالے کا خطرہ — نازک فصلوں کو ڈھانپ کر رکھیں' });
  if (humidity > 80) advice.push({ en: 'High humidity — risk of fungal diseases, inspect crops', ur: 'زیادہ نمی — پھپھوندی کی بیماری کا خطرہ، فصل کا معائنہ کریں' });
  if (humidity > 85) advice.push({ en: 'Apply preventive fungicide spray — conditions favor disease', ur: 'پھپھوندی کش دوا کا سپرے کریں — موسم بیماری کے لیے سازگار ہے' });
  if (desc.includes('rain')) advice.push({ en: 'Rain expected — delay fertilizer and pesticide application', ur: 'بارش متوقع ہے — کھاد اور کیڑے مار دوا کا استعمال ملتوی کریں' });
  if (desc.includes('clear') && temp > 20 && temp < 35) advice.push({ en: 'Good conditions for spraying pesticides or fertilizer', ur: 'سپرے اور کھاد ڈالنے کے لیے موسم بہترین ہے' });
  if (desc.includes('wind') || desc.includes('windy')) advice.push({ en: 'Windy — avoid spraying, chemicals may drift', ur: 'تیز ہوا — سپرے نہ کریں، دوا اڑ سکتی ہے' });
  if (advice.length === 0) advice.push({ en: 'Weather conditions are normal for farming activities', ur: 'زرعی کاموں کے لیے موسم معمول کے مطابق ہے' });

  return advice;
};

function WeatherCard({ icon, label, value }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
      <div className="text-green-600">{icon}</div>
      <div>
        <div className="text-xs text-gray-400">{label}</div>
        <div className="font-bold text-gray-800">{value}</div>
      </div>
    </div>
  );
}

function Weather() {
  const [city, setCity]         = useState('');
  const [weather, setWeather]   = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const fetchWeather = async (cityName) => {
    const target = cityName || city;
    if (!target) return;
    setLoading(true);
    setError('');
    setWeather(null);
    setForecast([]);

    try {
      // Current weather
      const curr = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${target},PK&appid=${API_KEY}&units=metric`
      );
      setWeather(curr.data);

      // 5 day forecast
      const fore = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${target},PK&appid=${API_KEY}&units=metric`
      );

      // Get one reading per day (at noon)
      const daily = {};
      fore.data.list.forEach(item => {
        const date = item.dt_txt.split(' ')[0];
        if (!daily[date] || item.dt_txt.includes('12:00')) {
          daily[date] = item;
        }
      });
      setForecast(Object.values(daily).slice(0, 5));

    } catch {
      setError('City not found. Please try another city name.');
    } finally {
      setLoading(false);
    }
  };

  const advice = weather
    ? weatherAdvice(weather.main.temp, weather.main.humidity, weather.weather[0].description)
    : [];

  const getWeatherEmoji = (desc) => {
    const d = desc.toLowerCase();
    if (d.includes('clear')) return '☀️';
    if (d.includes('cloud')) return '⛅';
    if (d.includes('rain')) return '🌧️';
    if (d.includes('thunder')) return '⛈️';
    if (d.includes('snow')) return '❄️';
    if (d.includes('mist') || d.includes('fog')) return '🌫️';
    return '🌤️';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="text-5xl mb-3">🌤️</div>
        <h1 className="text-3xl font-bold text-gray-800">Weather Forecast</h1>
        <p className="text-gray-500 mt-2">Daily weather with farming advice for Pakistani farmers</p>
        <p className="text-green-600 mt-1">روزانہ موسم اور زرعی مشورے</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
        <p className="text-sm font-medium text-gray-600 mb-3">Quick select city / شہر منتخب کریں:</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {pakistanCities.slice(0, 10).map(c => (
            <button
              key={c}
              onClick={() => { setCity(c); fetchWeather(c); }}
              className="bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full text-sm hover:bg-green-100 transition"
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            value={city}
            onChange={e => setCity(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchWeather()}
            placeholder="Or type any city name..."
            className="flex-1 border rounded-lg px-4 py-3 focus:outline-none focus:border-green-400"
          />
          <button
            onClick={() => fetchWeather()}
            disabled={loading || !city}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-2"
          >
            <Search size={18} />
            {loading ? 'Loading...' : 'Search'}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      {weather && (
        <div className="space-y-6">
          {/* Current Weather */}
          <div className="bg-gradient-to-br from-green-600 to-green-800 text-white rounded-xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold">{weather.name}, Pakistan</h2>
                <p className="text-green-200 capitalize">{weather.weather[0].description}</p>
              </div>
              <div className="text-6xl">{getWeatherEmoji(weather.weather[0].description)}</div>
            </div>
            <div className="text-6xl font-bold mb-6">
              {Math.round(weather.main.temp)}°C
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <WeatherCard
                icon={<Thermometer size={20} />}
                label="Feels like"
                value={`${Math.round(weather.main.feels_like)}°C`}
              />
              <WeatherCard
                icon={<Droplets size={20} />}
                label="Humidity / نمی"
                value={`${weather.main.humidity}%`}
              />
              <WeatherCard
                icon={<Wind size={20} />}
                label="Wind / ہوا"
                value={`${Math.round(weather.wind.speed * 3.6)} km/h`}
              />
              <WeatherCard
                icon={<Eye size={20} />}
                label="Visibility"
                value={`${(weather.visibility / 1000).toFixed(1)} km`}
              />
            </div>
          </div>

          {/* Farming Advice */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              🌾 Farming Advice for Today / آج کے لیے زرعی مشورے
            </h3>
            <div className="space-y-3">
              {advice.map((a, i) => (
                <div key={i} className="bg-green-50 border border-green-100 rounded-lg p-4">
                  <div className="text-gray-800 font-medium text-sm mb-1">🇬🇧 {a.en}</div>
                  <div className="text-green-700 text-sm">🇵🇰 {a.ur}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 5 Day Forecast */}
          {forecast.length > 0 && (
            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-bold text-gray-800 mb-4">5-Day Forecast / 5 دن کا موسم</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {forecast.map((day, i) => {
                  const date = new Date(day.dt * 1000);
                  const dayName = i === 0 ? 'Today' : date.toLocaleDateString('en-PK', { weekday: 'short' });
                  return (
                    <div key={i} className="bg-gray-50 rounded-xl p-3 text-center border">
                      <div className="text-sm font-medium text-gray-600">{dayName}</div>
                      <div className="text-xs text-gray-400 mb-2">
                        {date.toLocaleDateString('en-PK', { month: 'short', day: 'numeric' })}
                      </div>
                      <div className="text-2xl mb-2">{getWeatherEmoji(day.weather[0].description)}</div>
                      <div className="font-bold text-gray-800">{Math.round(day.main.temp)}°C</div>
                      <div className="text-xs text-blue-500">{day.main.humidity}% 💧</div>
                      <div className="text-xs text-gray-400 capitalize mt-1">{day.weather[0].main}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mt-4">
  <div className="flex items-start gap-3">
    <span className="text-2xl">ℹ️</span>
    <div>
      <p className="text-blue-800 font-semibold text-sm mb-2">About This Weather Data</p>
      <p className="text-blue-700 text-sm mb-3">
        Weather data is provided by OpenWeatherMap and is updated every 3 hours. 
        Temperatures shown are for the city center and may vary slightly from your exact location. 
        For the most accurate local readings, check your nearest Pakistan Meteorological Department station at <span className="font-medium">pmd.gov.pk</span>
      </p>
      <div className="border-t border-blue-200 pt-3">
        <p className="text-blue-800 font-semibold text-sm mb-2">اس موسمی ڈیٹا کے بارے میں</p>
        <p className="text-blue-700 text-sm">
  موسم کی معلومات ایک بین الاقوامی موسمی سروس سے لی گئی ہے اور ہر تین گھنٹے بعد تازہ ہوتی ہے۔
  درجہ حرارت شہر کے مرکز کا ہے اور آپ کے علاقے میں تھوڑا فرق ہو سکتا ہے۔
  بالکل درست مقامی موسم کے لیے پاکستان محکمہ موسمیات کی ویب سائٹ دیکھیں یا اپنے قریبی موسمیاتی مرکز سے رابطہ کریں۔
</p>
      </div>
    </div>
  </div>
</div>
        </div>
      )}

      {!weather && !loading && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-6xl mb-4">🌤️</div>
          <p className="text-lg">Select a city to see weather and farming advice</p>
          <p className="text-sm mt-1">شہر منتخب کریں — موسم اور زرعی مشورے دیکھیں</p>
        </div>
      )}
    </div>
  );
}

export default Weather;