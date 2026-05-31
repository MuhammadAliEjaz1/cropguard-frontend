import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, MessageCircle, MapPin, Shield, Camera, CloudRain,
         Calendar, FlaskConical, ChevronRight, ArrowRight } from 'lucide-react';

/* ─── Animated counter hook ─────────────────────────────────────────────── */
function useCounter(target, duration = 1800, start = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    const isFloat  = target.toString().includes('.');
    const numeric  = parseFloat(target);
    const steps    = 60;
    const interval = duration / steps;
    let step = 0;
    const t = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(isFloat
        ? (eased * numeric).toFixed(2)
        : Math.floor(eased * numeric));
      if (step >= steps) clearInterval(t);
    }, interval);
    return () => clearInterval(t);
  }, [start, target, duration]);
  return val;
}

/* ─── Intersection observer hook ────────────────────────────────────────── */
function useInView(threshold = 0.2) {
  const ref  = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* ─── Floating leaf particle ─────────────────────────────────────────────── */
function FloatingLeaf({ style }) {
  return (
    <div style={{
      position: 'absolute',
      fontSize: '1.2rem',
      opacity: 0.18,
      animation: `floatLeaf ${style.duration}s ease-in-out ${style.delay}s infinite alternate`,
      ...style,
    }}>🌿</div>
  );
}

/* ─── Stat card with animated counter ───────────────────────────────────── */
function StatCard({ value, label, urdu, suffix = '', inView, delay }) {
  const numeric  = parseFloat(value.replace(/[^0-9.]/g, ''));
  const counted  = useCounter(numeric, 1600, inView);
  const isFloat  = value.includes('.');
  const hasPlus  = value.includes('+');
  const display  = isFloat ? counted : counted.toLocaleString();

  return (
    <div style={{
      textAlign: 'center',
      animation: inView ? `fadeUp 0.6s ease ${delay}s both` : 'none',
    }}>
      <div style={{
        fontSize: 'clamp(2rem, 4vw, 2.8rem)',
        fontWeight: 900,
        fontFamily: "'Playfair Display', Georgia, serif",
        background: 'linear-gradient(135deg, #16a34a, #4ade80)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        lineHeight: 1,
        letterSpacing: '-0.02em',
      }}>
        {display}{hasPlus ? '+' : ''}{suffix}
      </div>
      <div style={{ fontSize: 13, color: '#6b7280', marginTop: 6, fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2, direction: 'rtl' }}>{urdu}</div>
    </div>
  );
}

/* ─── Feature card ───────────────────────────────────────────────────────── */
function FeatureCard({ icon, title, titleUr, desc, descUr, to, color, delay, inView }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      to={to}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'block',
        textDecoration: 'none',
        background: hovered
          ? 'linear-gradient(145deg, #f0fdf4, #dcfce7)'
          : '#fff',
        borderRadius: 20,
        padding: '28px 26px',
        border: `1.5px solid ${hovered ? '#86efac' : '#e5e7eb'}`,
        boxShadow: hovered
          ? '0 12px 40px rgba(22,163,74,0.15)'
          : '0 2px 8px rgba(0,0,0,0.05)',
        transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        animation: inView ? `fadeUp 0.6s ease ${delay}s both` : 'none',
        cursor: 'pointer',
      }}
    >
      <div style={{
        width: 52, height: 52, borderRadius: 14,
        background: `linear-gradient(135deg, ${color}22, ${color}44)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 16,
        border: `1px solid ${color}33`,
        transition: 'transform 0.3s ease',
        transform: hovered ? 'rotate(-5deg) scale(1.1)' : 'rotate(0) scale(1)',
      }}>
        {icon}
      </div>
      <h3 style={{
        fontSize: 17, fontWeight: 700, color: '#14532d', margin: '0 0 4px',
        fontFamily: "'Playfair Display', Georgia, serif",
      }}>{title}</h3>
      <div style={{ fontSize: 12, color: '#16a34a', marginBottom: 10, direction: 'rtl' }}>{titleUr}</div>
      <p style={{ fontSize: 13.5, color: '#6b7280', lineHeight: 1.6, margin: '0 0 10px' }}>{desc}</p>
      <p style={{ fontSize: 12, color: '#9ca3af', lineHeight: 1.6, margin: 0, direction: 'rtl', textAlign: 'right' }}>{descUr}</p>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 4,
        marginTop: 16, fontSize: 13, color: '#16a34a', fontWeight: 600,
        opacity: hovered ? 1 : 0,
        transform: hovered ? 'translateX(0)' : 'translateX(-8px)',
        transition: 'all 0.25s ease',
      }}>
        Try it <ArrowRight size={14} />
      </div>
    </Link>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
function Home() {
  const [statsRef, statsInView] = useInView(0.3);
  const [featRef,  featInView]  = useInView(0.1);
  const [cropRef,  cropInView]  = useInView(0.2);
  const [ctaRef,   ctaInView]   = useInView(0.3);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const stats = [
    { value: '92.52', label: 'Detection Accuracy', urdu: 'تشخیص کی درستگی',  suffix: '%' },
    { value: '37',    label: 'Disease Classes',    urdu: 'بیماریوں کی اقسام'              },
    { value: '6',     label: 'Pakistani Crops',    urdu: 'پاکستانی فصلیں'                 },
    { value: '31000', label: 'Training Images',    urdu: 'تربیتی تصاویر',     suffix: '+'  },
  ];

  const features = [
    {
      icon: <Camera size={24} color="#16a34a" />,
      title: 'Disease Detection',      titleUr: 'بیماری کی تشخیص',
      desc:  'Upload a photo of your crop leaf — get instant AI diagnosis with 92.52% accuracy.',
      descUr:'فصل کے پتے کی تصویر اپلوڈ کریں اور فوری تشخیص حاصل کریں۔',
      to: '/detect', color: '#16a34a', delay: 0.0,
    },
    {
      icon: <MessageCircle size={24} color="#0891b2" />,
      title: 'AI Agriculture Chatbot', titleUr: 'زرعی چیٹ بوٹ',
      desc:  'Ask any farming question in Urdu or English. Expert crop guidance, instantly.',
      descUr:'اردو یا انگریزی میں کوئی بھی زرعی سوال پوچھیں — فوری جواب پائیں۔',
      to: '/chat', color: '#0891b2', delay: 0.1,
    },
    {
      icon: <MapPin size={24} color="#dc2626" />,
      title: 'Disease Warning Map',    titleUr: 'بیماری وارننگ نقشہ',
      desc:  'Community-driven outbreak tracking. Get alerts when disease is near you.',
      descUr:'وبائی بیماریوں کی نگرانی — اپنے علاقے میں خطرے کی اطلاع پائیں۔',
      to: '/map', color: '#dc2626', delay: 0.2,
    },
    {
      icon: <CloudRain size={24} color="#7c3aed" />,
      title: 'Live Weather & Advisory', titleUr: 'موسم اور زرعی مشورے',
      desc:  '10-day forecasts + farming advice tailored for every Pakistani city.',
      descUr:'۱۰ دن کی موسمی پیشگوئی اور آپ کے شہر کے لیے زرعی مشورے۔',
      to: '/weather', color: '#7c3aed', delay: 0.3,
    },
    {
      icon: <Calendar size={24} color="#d97706" />,
      title: 'Crop Calendar',           titleUr: 'فصل کیلنڈر',
      desc:  'Month-by-month planting, irrigation, and harvesting schedule for your crops.',
      descUr:'اپنی فصل کے لیے بوائی، آبپاشی اور کٹائی کا ماہانہ شیڈول دیکھیں۔',
      to: '/calendar', color: '#d97706', delay: 0.4,
    },
    {
      icon: <FlaskConical size={24} color="#0f766e" />,
      title: 'Fertilizer Calculator',   titleUr: 'کھاد کیلکولیٹر',
      desc:  'Precise fertilizer dosage based on your crop, soil type, and field area.',
      descUr:'فصل، مٹی اور رقبے کے مطابق درست کھاد کی مقدار معلوم کریں۔',
      to: '/fertilizer', color: '#0f766e', delay: 0.5,
    },
  ];

  const crops = [
    { emoji: '🌾', en: 'Wheat',     ur: 'گندم'    },
    { emoji: '🌾', en: 'Rice',      ur: 'چاول'   },
    { emoji: '🌿', en: 'Cotton',    ur: 'کپاس'   },
    { emoji: '🎋', en: 'Sugarcane', ur: 'گنا'    },
    { emoji: '🌽', en: 'Corn',      ur: 'مکئی'   },
    { emoji: '🥔', en: 'Potato',    ur: 'آلو'    },
  ];

  const leafPositions = [
    { top: '10%', left: '5%',  duration: 5, delay: 0   },
    { top: '20%', right: '8%', duration: 7, delay: 1.5 },
    { top: '55%', left: '3%',  duration: 6, delay: 0.8 },
    { top: '70%', right: '4%', duration: 8, delay: 2   },
    { top: '35%', left: '92%', duration: 5.5, delay: 1 },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif", background: '#fff' }}>

      {/* ── Google Fonts ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes fadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes floatLeaf {
          from { transform: translateY(0px) rotate(-8deg); }
          to   { transform: translateY(-18px) rotate(8deg); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes heroSlideUp {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(74,222,128,0.5); }
          70%  { transform: scale(1);    box-shadow: 0 0 0 16px rgba(74,222,128,0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(74,222,128,0);   }
        }
      `}</style>

      {/* ════════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════════ */}
      <div style={{
        position: 'relative',
        background: 'linear-gradient(155deg, #052e16 0%, #14532d 40%, #166534 70%, #15803d 100%)',
        color: '#fff',
        padding: 'clamp(60px, 10vw, 120px) 24px clamp(80px, 12vw, 140px)',
        textAlign: 'center',
        overflow: 'hidden',
      }}>
        {/* Radial glow */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 70% 60% at 50% 40%, rgba(74,222,128,0.12) 0%, transparent 70%)',
        }} />

        {/* Grid texture */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.04,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        {/* Floating leaves */}
        {leafPositions.map((s, i) => <FloatingLeaf key={i} style={s} />)}

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 720, margin: '0 auto' }}>

          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)',
            borderRadius: 100, padding: '6px 16px', marginBottom: 28,
            fontSize: 12, fontWeight: 600, color: '#4ade80', letterSpacing: '0.05em',
            animation: heroVisible ? 'heroSlideUp 0.7s ease 0s both' : 'none',
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%', background: '#4ade80',
              animation: 'pulse-ring 2s infinite',
              display: 'inline-block',
            }} />
            AI-POWERED · PAKISTAN-TRAINED · FREE TO USE
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(2.6rem, 6vw, 4.2rem)',
            fontWeight: 900,
            lineHeight: 1.08,
            margin: '0 0 12px',
            letterSpacing: '-0.02em',
            animation: heroVisible ? 'heroSlideUp 0.7s ease 0.1s both' : 'none',
          }}>
            CropGuard
            <span style={{
              display: 'inline-block', marginLeft: 12,
              background: 'linear-gradient(135deg, #4ade80, #86efac)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>AI</span>
          </h1>

          {/* Subheadline EN */}
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            color: '#bbf7d0',
            margin: '0 0 10px',
            fontWeight: 400,
            lineHeight: 1.5,
            animation: heroVisible ? 'heroSlideUp 0.7s ease 0.2s both' : 'none',
          }}>
            Intelligent Crop Disease Detection for Pakistani Farmers
          </p>

          {/* Subheadline UR */}
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
            color: '#86efac',
            margin: '0 0 40px',
            direction: 'rtl',
            fontWeight: 400,
            animation: heroVisible ? 'heroSlideUp 0.7s ease 0.3s both' : 'none',
          }}>
            فصلوں کی بیماریوں کی فوری تشخیص — اردو اور انگریزی میں
          </p>

          {/* CTA Buttons */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center',
            animation: heroVisible ? 'heroSlideUp 0.7s ease 0.4s both' : 'none',
          }}>
            <Link to="/detect" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'linear-gradient(135deg, #4ade80, #22c55e)',
              color: '#052e16', fontWeight: 700,
              padding: '14px 30px', borderRadius: 14, fontSize: 15,
              textDecoration: 'none',
              boxShadow: '0 6px 24px rgba(74,222,128,0.4)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 10px 30px rgba(74,222,128,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 6px 24px rgba(74,222,128,0.4)'; }}
            >
              <Camera size={17} />
              بیماری تشخیص کریں / Detect Disease
            </Link>
            <Link to="/chat" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)',
              color: '#fff', fontWeight: 600,
              padding: '14px 30px', borderRadius: 14, fontSize: 15,
              textDecoration: 'none',
              border: '1.5px solid rgba(255,255,255,0.25)',
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.18)'}
            onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'}
            >
              <MessageCircle size={17} />
              AI Expert سے پوچھیں / Ask AI
            </Link>
          </div>

          {/* Trust line */}
          <p style={{
            marginTop: 32, fontSize: 12, color: 'rgba(255,255,255,0.4)',
            letterSpacing: '0.04em',
            animation: heroVisible ? 'heroSlideUp 0.7s ease 0.5s both' : 'none',
          }}>
            TRAINED ON 31,000+ REAL FIELD IMAGES FROM PAKISTAN
          </p>
        </div>

        {/* Curved bottom divider */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, lineHeight: 0 }}>
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 60 }}>
            <path d="M0,60 C360,0 1080,0 1440,60 L1440,60 L0,60 Z" fill="#fff" />
          </svg>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          STATS
      ════════════════════════════════════════════════════════ */}
      <div ref={statsRef} style={{ background: '#fff', padding: '60px 24px 56px' }}>
        <div style={{
          maxWidth: 860, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 0,
        }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              padding: '20px 12px',
              borderRight: i < stats.length - 1 ? '1px solid #f3f4f6' : 'none',
            }}>
              <StatCard {...s} inView={statsInView} delay={i * 0.1} />
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          FEATURES
      ════════════════════════════════════════════════════════ */}
      <div ref={featRef} style={{
        background: 'linear-gradient(180deg, #f0fdf4 0%, #fff 100%)',
        padding: 'clamp(48px, 8vw, 88px) 24px',
      }}>
        <div style={{ maxWidth: 1040, margin: '0 auto' }}>

          {/* Section header */}
          <div style={{
            textAlign: 'center', marginBottom: 52,
            animation: featInView ? 'fadeUp 0.6s ease 0s both' : 'none',
          }}>
            <div style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
              color: '#15803d', borderRadius: 100,
              padding: '4px 16px', fontSize: 11, fontWeight: 700,
              letterSpacing: '0.1em', marginBottom: 16,
              border: '1px solid #86efac',
            }}>
              EVERYTHING YOU NEED · آپ کی ہر ضرورت
            </div>
            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
              fontWeight: 900, color: '#14532d',
              margin: '0 0 12px', letterSpacing: '-0.02em',
            }}>
              What CropGuard AI Does
            </h2>
            <p style={{ color: '#6b7280', fontSize: 15, maxWidth: 500, margin: '0 auto 6px' }}>
              Six powerful tools built specifically for Pakistan's farmers
            </p>
            <p style={{ color: '#9ca3af', fontSize: 13, direction: 'rtl' }}>
              پاکستانی کسانوں کے لیے چھ طاقتور اوزار
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
            gap: 20,
          }}>
            {features.map((f, i) => (
              <FeatureCard key={i} {...f} inView={featInView} />
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          CROPS
      ════════════════════════════════════════════════════════ */}
      <div ref={cropRef} style={{ background: '#fff', padding: 'clamp(48px, 8vw, 80px) 24px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>

          <div style={{
            animation: cropInView ? 'fadeUp 0.6s ease 0s both' : 'none',
          }}>
            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)',
              fontWeight: 900, color: '#14532d', margin: '0 0 8px',
            }}>
              Supported Crops
            </h2>
            <p style={{ color: '#6b7280', fontSize: 14, margin: '0 0 6px' }}>
              Trained on real field images from Pakistan's major crops
            </p>
            <p style={{ color: '#9ca3af', fontSize: 13, direction: 'rtl', marginBottom: 40 }}>
              پاکستان کی اہم فصلوں کی اصلی کھیت کی تصاویر پر تربیت یافتہ
            </p>
          </div>

          <div style={{
            display: 'flex', flexWrap: 'wrap',
            justifyContent: 'center', gap: 14,
          }}>
            {crops.map((c, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                border: '1.5px solid #bbf7d0',
                borderRadius: 100,
                padding: '10px 22px',
                animation: cropInView ? `fadeUp 0.5s ease ${i * 0.08}s both` : 'none',
                cursor: 'default',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 6px 20px rgba(22,163,74,0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}
              >
                <span style={{ fontSize: 22 }}>{c.emoji}</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#14532d' }}>{c.en}</div>
                  <div style={{ fontSize: 11, color: '#16a34a', direction: 'rtl' }}>{c.ur}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          HOW IT WORKS
      ════════════════════════════════════════════════════════ */}
      <div style={{
        background: 'linear-gradient(135deg, #052e16 0%, #14532d 100%)',
        padding: 'clamp(48px, 8vw, 88px) 24px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.06,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />
        <div style={{ maxWidth: 860, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)',
              fontWeight: 900, color: '#fff', margin: '0 0 8px',
            }}>
              How It Works
            </h2>
            <p style={{ color: '#86efac', fontSize: 13, direction: 'rtl' }}>
              یہ کیسے کام کرتا ہے
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 2,
          }}>
            {[
              { step: '01', en: 'Take a photo of the affected leaf', ur: 'متاثرہ پتے کی تصویر لیں', icon: '📸' },
              { step: '02', en: 'Upload it to CropGuard AI',          ur: 'کراپ گارڈ اے آئی پر اپلوڈ کریں', icon: '⬆️' },
              { step: '03', en: 'AI identifies the disease',           ur: 'اے آئی بیماری شناخت کرے گا', icon: '🤖' },
              { step: '04', en: 'Get treatment advice instantly',      ur: 'فوری علاج کا مشورہ پائیں', icon: '💊' },
            ].map((s, i) => (
              <div key={i} style={{
                textAlign: 'center', padding: '28px 20px',
                position: 'relative',
              }}>
                {i < 3 && (
                  <div style={{
                    position: 'absolute', top: 42, right: -8, zIndex: 2,
                    color: 'rgba(74,222,128,0.3)', fontSize: 20,
                    display: 'none', // hide on small screens via media query
                  }}>→</div>
                )}
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: 'rgba(74,222,128,0.12)',
                  border: '1.5px solid rgba(74,222,128,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px', fontSize: 24,
                }}>
                  {s.icon}
                </div>
                <div style={{
                  fontSize: 11, fontWeight: 700, color: '#4ade80',
                  letterSpacing: '0.1em', marginBottom: 8,
                }}>STEP {s.step}</div>
                <div style={{ fontSize: 14, color: '#fff', fontWeight: 500, marginBottom: 6 }}>{s.en}</div>
                <div style={{ fontSize: 12, color: '#86efac', direction: 'rtl' }}>{s.ur}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          CTA
      ════════════════════════════════════════════════════════ */}
      <div ref={ctaRef} style={{ background: '#fff', padding: 'clamp(48px, 8vw, 88px) 24px' }}>
        <div style={{
          maxWidth: 640, margin: '0 auto', textAlign: 'center',
          animation: ctaInView ? 'fadeUp 0.7s ease 0s both' : 'none',
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: 20,
            background: 'linear-gradient(135deg, #16a34a, #15803d)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: '0 8px 28px rgba(22,163,74,0.35)',
            animation: 'pulse-ring 2.5s infinite',
          }}>
            <Leaf size={34} color="#fff" />
          </div>
          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(1.8rem, 4vw, 2.4rem)',
            fontWeight: 900, color: '#14532d', margin: '0 0 12px',
          }}>
            Ready to protect your crops?
          </h2>
          <p style={{ color: '#6b7280', fontSize: 15, margin: '0 0 8px' }}>
            Take a photo of your diseased crop and get instant diagnosis
          </p>
          <p style={{ color: '#9ca3af', fontSize: 13, direction: 'rtl', marginBottom: 36 }}>
            اپنی فصل کی تصویر لیں اور فوری تشخیص حاصل کریں
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            <Link to="/detect" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'linear-gradient(135deg, #16a34a, #15803d)',
              color: '#fff', fontWeight: 700,
              padding: '14px 32px', borderRadius: 14, fontSize: 15,
              textDecoration: 'none',
              boxShadow: '0 6px 20px rgba(22,163,74,0.35)',
            }}>
              تشخیص شروع کریں / Start Detection
              <ChevronRight size={17} />
            </Link>
            <Link to="/chat" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#f0fdf4',
              color: '#16a34a', fontWeight: 600,
              padding: '14px 28px', borderRadius: 14, fontSize: 15,
              textDecoration: 'none',
              border: '1.5px solid #bbf7d0',
            }}>
              <MessageCircle size={17} />
              سوال پوچھیں / Ask a Question
            </Link>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════════════ */}
      <footer style={{
        background: '#052e16',
        color: 'rgba(255,255,255,0.45)',
        textAlign: 'center',
        padding: '28px 24px',
        fontSize: 13,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 8, marginBottom: 8,
        }}>
          <Leaf size={16} color="#4ade80" />
          <span style={{ color: '#fff', fontWeight: 600 }}>CropGuard AI</span>
          <span>© 2026</span>
        </div>
        <p style={{ margin: '0 0 4px' }}>
          Muhammad Ali Ejaz &amp; Ahmad Siddique
        </p>
        <p style={{ margin: '0 0 8px' }}>Final Year Project · Data Science</p>
        <p style={{ margin: 0, direction: 'rtl', fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
          پاکستانی کسانوں کے لیے — محبت کے ساتھ بنایا گیا
        </p>
      </footer>
    </div>
  );
}

export default Home;
