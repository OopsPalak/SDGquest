import React, { useState, useRef, useEffect } from 'react';
import { Camera, Palette, FileText, Mic, Sparkles, CheckCircle2, RotateCcw, Trash2, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { STICKERS, FRAMES } from '../../utils/constants.js';
import { playClickSound, playSuccessSound } from '../../audio/soundFx.js';

export function SubmissionStudio({ mission, onBack, onSubmitComplete }) {
  const [subType, setSubType] = useState('photo'); // 'photo', 'drawing', 'text'
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [caption, setCaption] = useState('I turned off the tap while brushing my teeth for 3 days!');
  const [selectedFrame, setSelectedFrame] = useState('water');
  const [activeStickers, setActiveStickers] = useState(['💧', '⭐']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState('');

  // Drawing Canvas State
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#2563eb');
  const [brushSize, setBrushSize] = useState(6);

  useEffect(() => {
    if (subType === 'drawing' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      // Set initial white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [subType]);

  // Drawing canvas handlers
  const startDrawing = (e) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.beginPath();
    }
  };

  const draw = (e) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = brushColor;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    playClickSound();
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 6 * 1024 * 1024) {
        setSubmissionError('Choose a JPEG, PNG, or WebP image smaller than 6 MB.');
        e.target.value = '';
        return;
      }
      setSubmissionError('');
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setPhotoUrl(uploadEvent.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleSticker = (emoji) => {
    playClickSound();
    if (activeStickers.includes(emoji)) {
      setActiveStickers(prev => prev.filter(s => s !== emoji));
    } else {
      if (activeStickers.length < 5) {
        setActiveStickers(prev => [...prev, emoji]);
      }
    }
  };

  const handleSubmit = async () => {
    if (subType === 'photo' && !photoFile) {
      setSubmissionError('Choose a photo to submit.');
      return;
    }
    if (subType === 'text' && !caption.trim()) {
      setSubmissionError('Write a reflection before submitting.');
      return;
    }
    playSuccessSound();
    setIsSubmitting(true);
    setSubmissionError('');

    const payload = {
      missionId: mission.id,
      type: subType,
      file: subType === 'photo' ? photoFile : null,
      mediaDataUrl: subType === 'drawing' && canvasRef.current ? canvasRef.current.toDataURL('image/png') : null,
      caption,
      frame: selectedFrame,
      stickers: activeStickers
    };

    try {
      await onSubmitComplete(payload);
    } catch (error) {
      setSubmissionError(error.message || 'Your evidence could not be submitted. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const frameObj = FRAMES.find(f => f.id === selectedFrame) || FRAMES[0];

  return (
    <div className="space-y-6 pb-24 max-w-3xl mx-auto px-4 pt-4">
      {/* Back Button */}
      <button
        onClick={() => { playClickSound(); onBack(); }}
        className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm hover:bg-slate-100 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Challenge</span>
      </button>

      {/* Header */}
      <div className="text-center space-y-1">
        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 text-xs font-black uppercase px-3 py-1 rounded-full border border-amber-300">
          📸 SCRAPBOOK STUDIO
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Capture Your Sustainability Moment
        </h1>
        <p className="text-xs text-slate-600 font-medium">
          Upload a photo or draw your action to create a page in your SDG Book!
        </p>
      </div>

      {/* Submission Mode Selector */}
      <div className="flex items-center justify-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
        <button
          onClick={() => { playClickSound(); setSubType('photo'); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
            subType === 'photo'
              ? 'bg-emerald-500 text-white shadow'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Upload Photo</span>
        </button>

        <button
          onClick={() => { playClickSound(); setSubType('drawing'); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
            subType === 'drawing'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Draw Instead</span>
        </button>

        <button
          onClick={() => { playClickSound(); setSubType('text'); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
            subType === 'text'
              ? 'bg-rose-500 text-white shadow'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Written Journal</span>
        </button>
      </div>

      {/* Media Canvas / Preview Container */}
      <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-lg space-y-6">
        <div className="relative flex justify-center">
          <div className={`relative max-w-md w-full rounded-2xl p-3 ${frameObj.border} transition-all shadow-md bg-white`}>
            {/* Display Photo */}
            {subType === 'photo' && (
              <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group">
                {photoUrl ? (
                  <img src={photoUrl} alt="Selected mission evidence" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm font-bold text-slate-500">Choose a photo to preview</div>
                )}

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <label className="cursor-pointer bg-white text-slate-900 font-black text-xs px-4 py-2 rounded-xl shadow hover:bg-slate-100 transition-colors flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4" />
                    <span>Change Photo</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Display Drawing Canvas */}
            {subType === 'drawing' && (
              <div className="relative flex flex-col items-center">
                <canvas
                  ref={canvasRef}
                  width={500}
                  height={300}
                  onMouseDown={startDrawing}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onMouseMove={draw}
                  onTouchStart={startDrawing}
                  onTouchEnd={stopDrawing}
                  onTouchMove={draw}
                  className="w-full aspect-video rounded-xl border border-slate-300 bg-white cursor-crosshair shadow-inner"
                />

                {/* Drawing Controls */}
                <div className="w-full mt-3 flex items-center justify-between gap-2 bg-slate-100 p-2 rounded-xl">
                  {/* Colors */}
                  <div className="flex items-center gap-1.5">
                    {['#2563eb', '#16a34a', '#dc2626', '#d97706', '#9333ea', '#000000'].map((c) => (
                      <button
                        key={c}
                        onClick={() => setBrushColor(c)}
                        style={{ backgroundColor: c }}
                        className={`w-6 h-6 rounded-full border-2 ${
                          brushColor === c ? 'ring-2 ring-slate-900 scale-110' : 'border-white'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Size */}
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <span>Size</span>
                    <input
                      type="range"
                      min="2"
                      max="20"
                      value={brushSize}
                      onChange={(e) => setBrushSize(Number(e.target.value))}
                      className="w-20"
                    />
                  </div>

                  <button
                    onClick={clearCanvas}
                    className="p-1.5 rounded-lg bg-rose-100 text-rose-700 hover:bg-rose-200 text-xs font-bold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear</span>
                  </button>
                </div>
              </div>
            )}

            {/* Display Written Journal */}
            {subType === 'text' && (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 min-h-[160px] flex items-center justify-center">
                <p className="font-handwriting text-xl text-amber-950 text-center leading-relaxed">
                  "{caption || 'Write your story below...'}"
                </p>
              </div>
            )}

            {/* Render Stickers on top of picture */}
            <div className="absolute top-4 right-4 flex flex-wrap gap-1 pointer-events-none">
              {activeStickers.map((emoji, idx) => (
                <span
                  key={idx}
                  className="text-3xl filter drop-shadow-md animate-bounce"
                  style={{ animationDelay: `${idx * 0.2}s` }}
                >
                  {emoji}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative Tools: Frames & Stickers */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          {/* Frames Palette */}
          <div>
            <label className="text-xs font-black uppercase text-slate-500 tracking-wider mb-2 block">
              1. Choose SDG Photo Frame 🖼️
            </label>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {FRAMES.map((f) => (
                <button
                  key={f.id}
                  onClick={() => { playClickSound(); setSelectedFrame(f.id); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all whitespace-nowrap ${
                    selectedFrame === f.id
                      ? 'bg-slate-900 text-white shadow-md scale-105'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
                  }`}
                >
                  {f.name}
                </button>
              ))}
            </div>
          </div>

          {/* Stickers Palette */}
          <div>
            <label className="text-xs font-black uppercase text-slate-500 tracking-wider mb-2 block">
              2. Add Eco Stickers (Tap to toggle) ✨
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {STICKERS.map((s) => {
                const isSelected = activeStickers.includes(s.icon);
                return (
                  <button
                    key={s.id}
                    onClick={() => toggleSticker(s.icon)}
                    className={`px-3 py-1.5 rounded-2xl text-xs font-bold border flex items-center gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-amber-100 border-amber-400 text-amber-950 scale-105 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-lg">{s.icon}</span>
                    <span>{s.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Caption Input */}
          <div>
            <label className="text-xs font-black uppercase text-slate-500 tracking-wider mb-2 block">
              3. Caption Your Story ✍️
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="What did you discover or save today?"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl font-bold text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
        </div>

        {submissionError && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-bold text-rose-800">{submissionError}</p>}

        {/* Submit CTA */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="btn-pop w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black py-4 rounded-3xl shadow-xl border-4 border-emerald-200 flex items-center justify-center gap-2 text-lg"
        >
          {isSubmitting ? (
            <span>Submitting Evidence... ✨</span>
          ) : (
            <>
              <CheckCircle2 className="w-6 h-6" />
              <span>SUBMIT EVIDENCE FOR VERIFICATION 🎉</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
