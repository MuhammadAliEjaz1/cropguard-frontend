import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, Loader, MessageCircle } from 'lucide-react';
import { API_URL } from '../config';
import { useLocation } from 'react-router-dom';

function Chat() {
  const location = useLocation();
  const params   = new URLSearchParams(location.search);
  const initCrop    = params.get('crop') || '';
  const initDisease = params.get('disease') || '';

  const [messages, setMessages]     = useState([]);
  const [input, setInput]           = useState('');
  const [loading, setLoading]       = useState(false);
  const [crop, setCrop]             = useState(initCrop);
  const [disease] = useState(initDisease);
  const bottomRef = useRef();

  useEffect(() => {
    const welcome = initCrop && initDisease
      ? `السلام علیکم! I can see you have a ${initCrop} crop with ${initDisease}. Ask me anything about this disease — causes, treatment, prevention — in Urdu or English.\n\nاردو میں سوال پوچھ سکتے ہیں۔`
      : `السلام علیکم! I am CropGuard AI, your agricultural expert assistant.\n\nAsk me anything about:\n• Crop diseases and treatment\n• Fertilizers and pesticides\n• Crop seasons in Pakistan\n• Seeds and varieties\n• Weather and irrigation\n\nاردو یا انگریزی میں سوال پوچھیں۔`;
    setMessages([{ role: 'assistant', content: welcome }]);
  }, [initCrop, initDisease]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);
    try {
      const history = messages.slice(1).map(m => ({
        role: m.role,
        content: m.content
      }));
      const res = await axios.post(`${API_URL}/chat`, {
        message: userMsg,
        crop,
        disease,
        chat_history: history
      });
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    'What causes wheat rust?',
    'گندم کی زنگ کا علاج کیا ہے؟',
    'Which fertilizer for rice in Punjab?',
    'کپاس کی بیماریوں سے کیسے بچیں؟',
    'Best wheat varieties in Pakistan?',
    'کب بوائی کریں؟'
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">AI Agriculture Expert</h1>
        <p className="text-gray-500 mt-1">Ask anything about farming in Urdu or English</p>
        {crop && disease && (
          <div className="inline-block bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm mt-2 font-medium">
            Context: {crop} — {disease}
          </div>
        )}
      </div>

      {/* Chat window */}
      <div className="bg-white rounded-xl shadow-sm border h-[500px] flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                m.role === 'user'
                  ? 'bg-green-600 text-white rounded-br-none'
                  : 'bg-gray-100 text-gray-800 rounded-bl-none'
              }`}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-none">
                <Loader size={16} className="animate-spin text-green-600" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t p-3 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Ask in Urdu or English..."
            className="flex-1 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-green-400"
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      {/* Suggestions */}
      <div className="mt-4">
        <p className="text-sm text-gray-500 mb-2">Try asking:</p>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => setInput(s)}
              className="bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full text-sm hover:bg-green-100 transition"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Chat;