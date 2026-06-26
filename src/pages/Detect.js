import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Upload, Loader, CheckCircle, AlertCircle, Leaf } from 'lucide-react';
import { API_URL } from '../config';
import { Link } from 'react-router-dom';

function Detect() {
  const [image, setImage]           = useState(null);
  const [preview, setPreview]       = useState(null);
  const [loading, setLoading]       = useState(false);
  const [result, setResult]         = useState(null);
  const [error, setError]           = useState(null);
  const [showUrdu, setShowUrdu]     = useState(false);
  const fileRef = useRef();

  const handleFile = (file) => {
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setError(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  const predict = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', image);
      const res = await axios.post(`${API_URL}/predict`, formData);
      setResult(res.data);
    } catch (err) {
      setError('Failed to analyze image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const parseExplanation = (text) => {
    if (!text) return { english: '', urdu: '' };
    const parts = text.split('🇵🇰');
    const english = parts[0].replace('🇬🇧 English:', '').trim();
    const urdu    = parts[1] ? parts[1].replace('اردو:', '').trim() : '';
    return { english, urdu };
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800">Crop Disease Detection</h1>
        <p className="text-gray-500 mt-2">Upload a photo of your crop leaf for instant diagnosis</p>
        <p className="text-green-600 mt-1">فصل کے پتے کی تصویر اپلوڈ کریں</p>
      </div>

      {/* Upload Area */}
      <div
        className="border-2 border-dashed border-green-300 rounded-xl p-10 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition mb-6"
        onClick={() => fileRef.current.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {preview ? (
          <img src={preview} alt="preview" className="max-h-64 mx-auto rounded-lg object-contain" />
        ) : (
          <div>
            <Upload size={48} className="text-green-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Drag & drop or click to upload</p>
            <p className="text-gray-400 text-sm mt-1">JPG, PNG supported</p>
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>

      {preview && (
        <div className="text-center mb-8">
          <button
            onClick={predict}
            disabled={loading}
            className="bg-green-600 text-white font-bold px-10 py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-2 mx-auto"
          >
            {loading ? <><Loader size={20} className="animate-spin" /> Analyzing...</> : <><Leaf size={20} /> Detect Disease</>}
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
          <AlertCircle size={20} /> {error}
        </div>
      )}

      {result && (
        <div className="space-y-6">
          {/* Result Card */}
          <div className={`rounded-xl p-6 text-white ${result.prediction.is_healthy ? 'bg-green-600' : 'bg-red-600'}`}>
            <div className="flex items-center gap-3 mb-4">
              {result.prediction.is_healthy
                ? <CheckCircle size={32} />
                : <AlertCircle size={32} />}
              <div>
                <div className="text-2xl font-bold">
                  {result.prediction.is_healthy ? 'Healthy Crop' : 'Disease Detected'}
                </div>
                <div className="text-sm opacity-80">
                  {result.prediction.is_healthy ? 'آپ کی فصل صحت مند ہے' : 'بیماری کی تشخیص ہوئی'}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white bg-opacity-20 rounded-lg p-3">
                <div className="text-sm opacity-80">Crop / فصل</div>
                <div className="font-bold text-lg">{result.prediction.crop}</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-3">
                <div className="text-sm opacity-80">Disease / بیماری</div>
                <div className="font-bold text-lg">{result.prediction.disease}</div>
              </div>
            </div>
            <div className="mt-4 bg-white bg-opacity-20 rounded-lg p-3">
              <div className="text-sm opacity-80">Confidence / اعتماد</div>
              <div className="font-bold text-xl">{result.prediction.confidence.toFixed(1)}%</div>
            </div>
          </div>

          {/* Top 3 */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-bold text-gray-800 mb-4">Top 3 Predictions</h3>
            {result.top3.map((t, i) => (
              <div key={i} className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{t.crop} — {t.disease}</span>
                  <span className="text-gray-500">{t.confidence.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div
                    className="h-2 bg-green-500 rounded-full"
                    style={{ width: `${t.confidence}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Explanation */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800">Expert Guidance</h3>
              <button
                onClick={() => setShowUrdu(!showUrdu)}
                className="bg-green-50 text-green-700 border border-green-200 px-4 py-1 rounded-full text-sm font-medium hover:bg-green-100 transition"
              >
                {showUrdu ? 'Show English' : 'اردو میں دیکھیں'}
              </button>
            </div>
            <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {showUrdu
                ? parseExplanation(result.explanation).urdu
                : parseExplanation(result.explanation).english}
            </div>
          </div>

          {/* Chat CTA */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <p className="text-gray-700 font-medium mb-3">
              Have more questions about {result.prediction.disease}?
            </p>
            <Link
              to={`/chat?crop=${result.prediction.crop}&disease=${result.prediction.disease}`}
              className="bg-green-600 text-white font-bold px-8 py-2 rounded-lg hover:bg-green-700 transition inline-block"
            >
              Ask AI Chatbot →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Detect;
