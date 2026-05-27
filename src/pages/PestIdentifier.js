import React, { useState, useRef } from 'react';
import { Loader, Bug, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../config';

function PestIdentifier() {
  const [image, setImage]     = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);
  const [error, setError]     = useState(null);
  const [showUrdu, setShowUrdu] = useState(false);
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

  const identify = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', image);
      const res = await axios.post(`${API_URL}/identify-pest`, formData);
      setResult(res.data.result);
    } catch {
      setError('Failed to identify pest. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const parseResult = (text) => {
    if (!text) return { english: '', urdu: '' };
    const parts = text.split('Urdu:');
    const english = parts[0].replace('English:', '').trim();
    const urdu    = parts[1] ? parts[1].trim() : '';
    return { english, urdu };
  };

  const commonPests = [
    { name: 'Aphid', urdu: 'تیلا', crops: 'Wheat, Cotton, Potato' },
    { name: 'Whitefly', urdu: 'سفید مکھی', crops: 'Cotton, Tomato' },
    { name: 'Army Worm', urdu: 'فوجی سنڈی', crops: 'Wheat, Corn' },
    { name: 'Stem Borer', urdu: 'تنا چھیدنے والا', crops: 'Rice, Sugarcane' },
    { name: 'Bollworm', urdu: 'گولا کیڑا', crops: 'Cotton' },
    { name: 'Brown Planthopper', urdu: 'بھورا پھدکا', crops: 'Rice' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="flex justify-center mb-3">
          <Bug size={44} className="text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800">Pest Identifier</h1>
        <p className="text-gray-500 mt-2">Upload a photo of any insect or pest — AI will identify it instantly</p>
        <p className="text-green-600 mt-1">کیڑے کی تصویر اپلوڈ کریں — فوری شناخت اور علاج</p>
      </div>

      {/* Common Pests Reference */}
      <div className="bg-white rounded-xl border p-5 mb-6">
        <p className="text-sm font-semibold text-gray-600 mb-3">Common Pakistani Crop Pests / عام کیڑے:</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {commonPests.map((p, i) => (
            <div key={i} className="bg-green-50 border border-green-100 rounded-lg p-3">
              <div className="font-medium text-gray-800 text-sm">{p.name}</div>
              <div className="text-green-700 text-xs">{p.urdu}</div>
              <div className="text-gray-400 text-xs mt-1">{p.crops}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Area */}
      <div
        className="border-2 border-dashed border-green-300 rounded-xl p-10 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition mb-6"
        onClick={() => fileRef.current.click()}
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
      >
        {preview ? (
          <img src={preview} alt="pest" className="max-h-64 mx-auto rounded-lg object-contain" />
        ) : (
          <div>
            <Bug size={48} className="text-green-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Drag & drop or click to upload pest photo</p>
            <p className="text-gray-400 text-sm mt-1">کیڑے کی تصویر یہاں ڈالیں</p>
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => handleFile(e.target.files[0])}
        />
      </div>

      {preview && (
        <div className="text-center mb-8">
          <button
            onClick={identify}
            disabled={loading}
            className="bg-green-600 text-white font-bold px-10 py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-2 mx-auto"
          >
            {loading
              ? <><Loader size={20} className="animate-spin" /> Identifying...</>
              : <><Bug size={20} /> Identify Pest</>
            }
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
          <AlertCircle size={20} /> {error}
        </div>
      )}

      {result && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
              <Bug size={20} className="text-green-600" />
              Identification Result
            </h3>
            <button
              onClick={() => setShowUrdu(!showUrdu)}
              className="bg-green-50 text-green-700 border border-green-200 px-4 py-1 rounded-full text-sm font-medium hover:bg-green-100 transition"
            >
              {showUrdu ? 'Show English' : 'اردو میں دیکھیں'}
            </button>
          </div>
          <div className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">
            {showUrdu
              ? parseResult(result).urdu
              : parseResult(result).english}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-6">
        <p className="text-yellow-800 text-sm">
          <span className="font-bold">💡 Tips for best results:</span>
          <ul className="mt-2 space-y-1 list-disc list-inside">
            <li>Take a close-up clear photo of the pest</li>
            <li>Make sure the insect is visible and in focus</li>
            <li>Natural lighting gives best results</li>
            <li>If result is unclear, try a different angle</li>
          </ul>
        </p>
      </div>
    </div>
  );
}

export default PestIdentifier;