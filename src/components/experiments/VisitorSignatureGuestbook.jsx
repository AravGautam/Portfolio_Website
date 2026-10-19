import React, { useState, useRef, useEffect } from 'react';
import { RotateCcw, Eraser, Send, PenTool, Sparkles, MessageSquare, MapPin } from 'lucide-react';
import ShockwaveButton from '../ui/ShockwaveButton';
import { soundEngine } from '../../audio/soundEngine';
import { showToast } from '../ui/Toast';

const INK_COLORS = [
  { label: 'Cyan', hex: '#38bdf8' },
  { label: 'White', hex: '#ffffff' },
  { label: 'Emerald', hex: '#34d399' },
  { label: 'Amber', hex: '#fbbf24' }
];

const getInitials = (name) => {
  if (!name) return 'V';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
};

export const VisitorSignatureGuestbook = () => {
  const [signatures, setSignatures] = useState(() => {
    // Only load real database cached signatures
    try {
      const saved = localStorage.getItem('arav_portfolio_guestbook_signatures_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Fallback
    }
    return [];
  });

  const [activeTab, setActiveTab] = useState('draw'); // 'draw' | 'type'
  const [typedSignature, setTypedSignature] = useState('');
  const [inkColor, setInkColor] = useState('#38bdf8');
  const [showForm, setShowForm] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    city: '',
    message: ''
  });

  const [isDetectingCity, setIsDetectingCity] = useState(false);
  const [cityAutoDetected, setCityAutoDetected] = useState(false);

  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const strokesHistoryRef = useRef([]);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-detect visitor's city via IP on mount
  const detectCity = async () => {
    setIsDetectingCity(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      let detected = '';
      try {
        const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
        if (res.ok) {
          const data = await res.json();
          if (data.city && data.country_name) {
            detected = `${data.city}, ${data.country_name}`;
          } else if (data.city) {
            detected = data.city;
          } else if (data.country_name) {
            detected = data.country_name;
          }
        }
      } catch {
        // Fallback to freeipapi if primary is blocked
        try {
          const res2 = await fetch('https://freeipapi.com/api/json', { signal: controller.signal });
          if (res2.ok) {
            const data2 = await res2.json();
            if (data2.cityName && data2.countryName) {
              detected = `${data2.cityName}, ${data2.countryName}`;
            }
          }
        } catch {
          // Both failed or blocked
        }
      }

      clearTimeout(timeoutId);

      if (detected) {
        setFormData((prev) => {
          // Pre-fill only if user hasn't typed anything yet
          if (!prev.city) {
            return { ...prev, city: detected };
          }
          return prev;
        });
        setCityAutoDetected(true);
      }
    } catch {
      // Quiet fail
    } finally {
      setIsDetectingCity(false);
    }
  };

  useEffect(() => {
    detectCity();
  }, []);

  // Fetch real signatures strictly from MongoDB Atlas via API
  useEffect(() => {
    let isMounted = true;
    async function loadSignatures() {
      try {
        const res = await fetch('/api/signatures');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const result = await res.json();
        if (result.success && Array.isArray(result.data) && isMounted) {
          const dbList = result.data.map((doc) => ({
            id: doc._id || doc.id || `sig-${Date.now()}`,
            name: doc.name,
            role: doc.role || '',
            location: doc.location || '',
            date: doc.date || (doc.createdAt ? new Date(doc.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'),
            message: doc.message || '',
            signatureDataUrl: doc.signatureDataUrl,
            signatureText: doc.signatureText || doc.name,
            inkColor: doc.inkColor || '#38bdf8'
          }));
          setSignatures(dbList);
        }
      } catch (err) {
        console.warn('Could not load signatures from DB:', err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadSignatures();
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync real signatures to local storage
  useEffect(() => {
    try {
      localStorage.setItem('arav_portfolio_guestbook_signatures_v2', JSON.stringify(signatures));
    } catch {
      // Quota or private browsing
    }
  }, [signatures]);

  // Setup Canvas with Retina DPR scaling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 2;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = inkColor;
    ctx.lineWidth = 2.4;
    ctx.restore();
  }, [inkColor]);

  // Drawing event handlers
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    isDrawingRef.current = true;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX ?? e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY ?? e.touches?.[0]?.clientY) - rect.top;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 2;
    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = inkColor;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(x, y);

    strokesHistoryRef.current.push({
      color: inkColor,
      points: [{ x, y }]
    });

    setHasDrawn(true);
  };

  const draw = (e) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX ?? e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY ?? e.touches?.[0]?.clientY) - rect.top;

    const ctx = canvas.getContext('2d');
    const currentStroke = strokesHistoryRef.current[strokesHistoryRef.current.length - 1];
    if (currentStroke) {
      currentStroke.points.push({ x, y });
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    if (isDrawingRef.current) {
      isDrawingRef.current = false;
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.restore();
      }
    }
  };

  const clearCanvas = () => {
    soundEngine.playClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    strokesHistoryRef.current = [];
    setHasDrawn(false);
  };

  const undoLastStroke = () => {
    soundEngine.playClick();
    const canvas = canvasRef.current;
    if (!canvas) return;

    strokesHistoryRef.current.pop();
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 2;

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (strokesHistoryRef.current.length === 0) {
      setHasDrawn(false);
      ctx.restore();
      return;
    }

    strokesHistoryRef.current.forEach((stroke) => {
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      stroke.points.forEach((p, idx) => {
        if (idx === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();
    });
    ctx.restore();
  };

  const handleSubmit = async (e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }

    if (!formData.name.trim()) {
      showToast('Please enter your name.');
      return;
    }

    setIsSubmitting(true);

    try {
      let signatureImage = null;
      const canvasHasStrokes = hasDrawn || strokesHistoryRef.current.length > 0;
      if (activeTab === 'draw' && canvasHasStrokes && canvasRef.current) {
        try {
          signatureImage = canvasRef.current.toDataURL('image/png');
        } catch {
          // ignore
        }
      }

      const now = new Date();
      const dateFormatted = now.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      const payload = {
        name: formData.name.trim(),
        role: formData.role.trim(),
        location: formData.city.trim(),
        date: dateFormatted,
        message: formData.message.trim(),
        signatureDataUrl: signatureImage,
        signatureText: typedSignature.trim() || formData.name.trim(),
        inkColor: inkColor
      };

      // Send to MongoDB API endpoint
      const res = await fetch('/api/signatures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const resData = await res.json();

      if (!res.ok || !resData.success) {
        throw new Error(resData.error || 'Server error saving signature');
      }

      // Format saved document directly from MongoDB response
      const savedDoc = {
        id: resData.data._id || resData.data.id || `sig-${Date.now()}`,
        name: resData.data.name,
        role: resData.data.role || '',
        location: resData.data.location || '',
        date: resData.data.date || dateFormatted,
        message: resData.data.message || '',
        signatureDataUrl: resData.data.signatureDataUrl,
        signatureText: resData.data.signatureText || resData.data.name,
        inkColor: resData.data.inkColor || inkColor
      };

      // Play audio feedback
      try {
        if (typeof soundEngine.playSuccess === 'function') {
          soundEngine.playSuccess();
        } else if (typeof soundEngine.playClick === 'function') {
          soundEngine.playClick();
        }
      } catch {
        // audio fail safe
      }

      // Add real saved document to state
      setSignatures((prev) => [savedDoc, ...prev]);

      // Reset form (keep auto-detected city for convenience if available)
      setFormData({ name: '', role: '', city: '', message: '' });
      setTypedSignature('');
      clearCanvas();
      showToast('Signature saved to database!');
    } catch (err) {
      console.error('Submit error:', err);
      showToast(err.message || 'Could not save signature. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative mt-20 pt-16 border-t border-white/10 isolate">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-64 bg-radial from-cyan-500/8 to-transparent blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 relative z-10">
        <div>
          <h2 className="text-4xl sm:text-6xl font-display font-bold text-white tracking-tight">
            Visitor <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-cyan-400">Signatures</span>
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Leave your mark, drop a doodle, or say hi.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-gray-500">
            {signatures.length} {signatures.length === 1 ? 'signature' : 'signatures'}
          </span>
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setShowForm(!showForm);
            }}
            className="text-xs font-mono px-3.5 py-1.5 rounded-full pill-btn-3d text-gray-300 hover:text-white transition-all cursor-pointer"
          >
            {showForm ? 'Hide Form' : '+ Sign Wall'}
          </button>
        </div>
      </div>

      {/* Clean, Simple Signing Form Card */}
      {showForm && (
        <div className="mb-14 p-6 sm:p-7 rounded-3xl bg-[#0c0d14]/90 border border-white/10 backdrop-blur-xl shadow-2xl relative z-10 animate-in fade-in duration-200">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Left: Drawing Pad / Calligraphy (6 cols) */}
            <div className="md:col-span-6 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                {/* Draw vs Type Switcher */}
                <div className="flex items-center gap-1 p-0.5 rounded-full bg-black/60 border border-white/10 text-[10px]">
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playClick();
                      setActiveTab('draw');
                    }}
                    className={`px-3 py-1 rounded-full cursor-pointer transition-all ${
                      activeTab === 'draw'
                        ? 'pill-btn-white-3d text-black font-semibold'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Draw
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playClick();
                      setActiveTab('type');
                    }}
                    className={`px-3 py-1 rounded-full cursor-pointer transition-all ${
                      activeTab === 'type'
                        ? 'pill-btn-white-3d text-black font-semibold'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Type
                  </button>
                </div>

                {/* Ink Colors & Tools (Only shown for draw mode) */}
                {activeTab === 'draw' && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-black/50 border border-white/5">
                      {INK_COLORS.map((c) => (
                        <button
                          key={c.hex}
                          type="button"
                          onClick={() => {
                            soundEngine.playClick();
                            setInkColor(c.hex);
                          }}
                          className={`w-3.5 h-3.5 rounded-full transition-transform cursor-pointer ${
                            inkColor === c.hex ? 'scale-125 ring-2 ring-white shadow-sm' : 'opacity-70 hover:opacity-100'
                          }`}
                          style={{ backgroundColor: c.hex }}
                          title={c.label}
                        />
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={undoLastStroke}
                      className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white cursor-pointer transition-colors"
                      title="Undo"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={clearCanvas}
                      className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white cursor-pointer transition-colors"
                      title="Clear"
                    >
                      <Eraser className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Drawing Canvas */}
              {activeTab === 'draw' ? (
                <div
                  data-cursor="pen"
                  className="relative w-full h-36 rounded-2xl bg-[#07080d] border border-white/10 overflow-hidden shadow-inner group"
                >
                  <canvas
                    ref={canvasRef}
                    data-cursor="pen"
                    onPointerDown={startDrawing}
                    onPointerMove={draw}
                    onPointerUp={stopDrawing}
                    onPointerLeave={stopDrawing}
                    className="w-full h-full cursor-none touch-none relative z-10"
                  />
                  {!hasDrawn && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-gray-600 font-mono text-xs select-none">
                      Draw signature or doodle here...
                    </div>
                  )}
                  {/* Subtle baseline */}
                  <div className="absolute bottom-5 left-5 right-5 border-b border-dashed border-white/10 pointer-events-none" />
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={typedSignature}
                    onChange={(e) => setTypedSignature(e.target.value)}
                    placeholder="Type your signature..."
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 focus:border-cyan-400 focus:outline-none text-white text-base font-serif italic placeholder:text-gray-600 transition-colors"
                  />
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-center">
                    <span
                      className="font-serif italic text-xl font-medium tracking-wide"
                      style={{ color: inkColor }}
                    >
                      {typedSignature.trim() || formData.name.trim() || 'Signature Preview'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Info Fields & Submit (6 cols) */}
            <div className="md:col-span-6 space-y-3">
              {/* Row 1: Name and Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Maya Lin"
                    className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 focus:border-cyan-400 focus:outline-none text-white text-xs font-mono placeholder:text-gray-600 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">
                    Role <span className="text-gray-600">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g. Software Engineer"
                    className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 focus:border-cyan-400 focus:outline-none text-white text-xs font-mono placeholder:text-gray-600 transition-colors"
                  />
                </div>
              </div>

              {/* Row 2: Separate City / Location with Auto-detect status */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-cyan-400" />
                    <span>City / Location</span>
                    <span className="text-gray-600 font-normal">(optional)</span>
                  </label>
                  {isDetectingCity ? (
                    <span className="text-[9px] font-mono text-cyan-400 animate-pulse">
                      Auto-detecting...
                    </span>
                  ) : cityAutoDetected && formData.city ? (
                    <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Auto-detected
                    </span>
                  ) : null}
                </div>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => {
                      setFormData({ ...formData, city: e.target.value });
                      setCityAutoDetected(false);
                    }}
                    placeholder={isDetectingCity ? 'Detecting your city...' : 'e.g. Berlin, Germany'}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 focus:border-cyan-400 focus:outline-none text-white text-xs font-mono placeholder:text-gray-600 transition-colors pr-16"
                  />
                  <button
                    type="button"
                    onClick={detectCity}
                    disabled={isDetectingCity}
                    className="absolute right-2 text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer border border-white/10"
                    title="Auto-detect city via IP"
                  >
                    Detect
                  </button>
                </div>
              </div>

              {/* Row 3: Note */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">
                  Note <span className="text-gray-600">(optional)</span>
                </label>
                <textarea
                  rows={2}
                  maxLength={240}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share a thought, feedback, or a quick sign-off..."
                  className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 focus:border-cyan-400 focus:outline-none text-white text-xs font-mono placeholder:text-gray-600 transition-colors resize-none leading-relaxed"
                />
              </div>

              <div className="pt-1">
                <ShockwaveButton
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  text={isSubmitting ? 'Posting...' : 'Leave Signature'}
                  icon={<Send className="w-3.5 h-3.5 text-black" />}
                  initialColor="white"
                  autoReset={true}
                  resetDelay={1000}
                  className="w-full py-3 font-script text-base sm:text-lg font-bold tracking-wider shadow-lg"
                />
              </div>
            </div>
          </form>
        </div>
      )}

      {/* =========================================================================
          REAL VISITOR SIGNATURES MASONRY WALL (Connected directly to MongoDB)
          ========================================================================= */}
      {signatures.length === 0 ? (
        <div className="p-12 rounded-3xl bg-[#0d0f17]/60 border border-dashed border-white/10 text-center relative z-10">
          <MessageSquare className="w-6 h-6 text-cyan-400/40 mx-auto mb-2" />
          <p className="font-mono text-xs text-gray-400">
            {isLoading ? 'Connecting to database...' : 'No signatures yet. Be the first to leave your mark above!'}
          </p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6 relative z-10">
          {signatures.map((sig) => {
            const initials = getInitials(sig.name);
            const hasSignatureImage = !!sig.signatureDataUrl;
            const hasNote = !!sig.message?.trim();
            const subtitle = [sig.role, sig.location].filter(Boolean).join(' • ');

            return (
              <div key={sig.id} className="break-inside-avoid group">
                {/* Speech Bubble Container */}
                <div className="relative bg-[#0d0f17] border border-white/10 rounded-2xl p-5 shadow-lg group-hover:border-white/20 transition-all duration-200">
                  
                  {/* Note / Message Text */}
                  {hasNote && (
                    <p className="text-xs sm:text-[13px] text-gray-200 leading-relaxed font-normal">
                      "{sig.message}"
                    </p>
                  )}

                  {/* Hand-Drawn Ink or Typed Calligraphy Signature */}
                  {hasSignatureImage ? (
                    <div className={`flex items-center ${hasNote ? 'mt-3 pt-2.5 border-t border-white/5' : ''}`}>
                      <img
                        src={sig.signatureDataUrl}
                        alt={`${sig.name}'s Signature`}
                        className="h-9 max-w-[140px] object-contain filter"
                        style={{
                          filter: `drop-shadow(0 0 6px ${sig.inkColor || '#38bdf8'}70)`
                        }}
                      />
                    </div>
                  ) : (
                    <div className={`${hasNote ? 'mt-2 pt-2 border-t border-white/5' : ''}`}>
                      <span
                        className="font-serif italic text-base tracking-wide"
                        style={{ color: sig.inkColor || '#38bdf8' }}
                      >
                        {sig.signatureText || sig.name}
                      </span>
                    </div>
                  )}

                  {/* Date in Bottom Right */}
                  <div className="text-[10px] font-mono text-gray-500 text-right mt-2">
                    {sig.date}
                  </div>

                  {/* Speech Bubble Tail Pointing Down to Avatar */}
                  <div className="absolute -bottom-1.5 left-7 w-3.5 h-3.5 bg-[#0d0f17] border-b border-r border-white/10 rotate-45 transform group-hover:border-white/20 transition-all" />
                </div>

                {/* Author & Avatar below the Speech Bubble */}
                <div className="flex items-center gap-3 mt-3.5 pl-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 border shadow-sm"
                    style={{
                      backgroundColor: `${sig.inkColor || '#38bdf8'}15`,
                      borderColor: `${sig.inkColor || '#38bdf8'}35`,
                      color: sig.inkColor || '#38bdf8'
                    }}
                  >
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <div className="font-mono text-xs font-bold uppercase tracking-wider text-white truncate">
                      {sig.name}
                    </div>
                    {subtitle && (
                      <div className="text-[11px] text-gray-400 italic truncate mt-0.5">
                        {subtitle}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default VisitorSignatureGuestbook;
