import React, { useRef, useState } from 'react';
import { Award, Download, Printer, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { playClickSound, playSuccessSound } from '../../audio/soundFx.js';

export function CertificateGen({ onBack }) {
  const [studentName, setStudentName] = useState('Leo');
  const [schoolName, setSchoolName] = useState('Greenwood Elementary School');
  const [certType, setCertType] = useState('Sustainability Champion');
  const [teacherSignature, setTeacherSignature] = useState('Ms. Clara Vance');
  const certRef = useRef(null);

  const handlePrint = () => {
    playClickSound();
    window.print();
  };

  const handleDownloadImage = () => {
    playSuccessSound();
    // Use HTML5 Canvas to render certificate to PNG
    const certEl = certRef.current;
    if (!certEl) return;

    // Create a temporary canvas
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 850;
    const ctx = canvas.getContext('2d');

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 1200, 850);
    grad.addColorStop(0, '#fef3c7');
    grad.addColorStop(0.5, '#fffbe5');
    grad.addColorStop(1, '#fef3c7');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 850);

    // Border
    ctx.lineWidth = 16;
    ctx.strokeStyle = '#d97706';
    ctx.strokeRect(40, 40, 1120, 770);

    ctx.lineWidth = 4;
    ctx.strokeStyle = '#b45309';
    ctx.strokeRect(55, 55, 1090, 740);

    // Title
    ctx.fillStyle = '#78350f';
    ctx.font = 'bold 32px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('UNITED NATIONS SDG QUEST • OFFICIAL CERTIFICATE', 600, 140);

    ctx.fillStyle = '#b45309';
    ctx.font = 'bold 54px Outfit, sans-serif';
    ctx.fillText(certType.toUpperCase(), 600, 230);

    ctx.fillStyle = '#451a03';
    ctx.font = '24px Fredoka, sans-serif';
    ctx.fillText('This is proudly presented to', 600, 310);

    // Student Name
    ctx.fillStyle = '#065f46';
    ctx.font = 'bold 64px Fredoka, sans-serif';
    ctx.fillText(studentName, 600, 400);

    // School & Reason
    ctx.fillStyle = '#374151';
    ctx.font = '22px Fredoka, sans-serif';
    ctx.fillText(`of ${schoolName}`, 600, 460);
    ctx.fillText('for demonstrating exceptional leadership, real-world action, and care for planet Earth', 600, 520);
    ctx.fillText('across the 17 UN Sustainable Development Goals.', 600, 560);

    // Seal
    ctx.font = '80px sans-serif';
    ctx.fillText('🌎', 600, 670);

    // Signatures
    ctx.fillStyle = '#78350f';
    ctx.font = 'bold 20px Fredoka, sans-serif';
    ctx.fillText(`Teacher: ${teacherSignature}`, 300, 740);
    ctx.fillText(`Date: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`, 900, 740);

    // Download trigger
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = `SDG_Certificate_${studentName.replace(/\s+/g, '_')}.png`;
    link.click();
  };

  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto px-4 pt-4">
      {/* Back Button */}
      <button
        onClick={() => { playClickSound(); onBack(); }}
        className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm hover:bg-slate-100 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Teacher Dashboard</span>
      </button>

      {/* Control Panel */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="font-black text-slate-900 text-lg flex items-center gap-2">
          <span>🏅</span>
          <span>Official Certificate Generator</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Student Name</label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">School Name</label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Certificate Award</label>
            <select
              value={certType}
              onChange={(e) => setCertType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
            >
              <option value="Sustainability Champion">Sustainability Champion</option>
              <option value="SDG Explorer">SDG Explorer</option>
              <option value="Young Change Maker">Young Change Maker</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Teacher Signature</label>
            <input
              type="text"
              value={teacherSignature}
              onChange={(e) => setTeacherSignature(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleDownloadImage}
            className="btn-pop bg-emerald-500 hover:bg-emerald-600 text-white font-black px-5 py-2.5 rounded-xl text-xs shadow flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download PNG Certificate 🖼️</span>
          </button>

          <button
            onClick={handlePrint}
            className="btn-pop bg-indigo-600 hover:bg-indigo-700 text-white font-black px-5 py-2.5 rounded-xl text-xs shadow flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print Certificate 🖨️</span>
          </button>
        </div>
      </div>

      {/* Certificate Live Printable Canvas Layout */}
      <div
        ref={certRef}
        className="bg-amber-50 rounded-3xl p-8 border-8 border-amber-400 shadow-2xl space-y-6 text-center text-amber-950 relative overflow-hidden book-shadow"
      >
        <div className="absolute inset-3 border-2 border-amber-300/80 rounded-2xl pointer-events-none" />

        <div className="space-y-1 relative z-10 pt-4">
          <span className="text-xs font-black uppercase tracking-widest text-amber-800 bg-amber-200 px-4 py-1 rounded-full border border-amber-300">
            UNITED NATIONS SDG QUEST • OFFICIAL CERTIFICATE
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-amber-900 font-outfit tracking-tight pt-2">
            {certType.toUpperCase()}
          </h1>
        </div>

        <div className="relative z-10 space-y-2 py-4">
          <p className="text-sm font-bold text-amber-800 uppercase">This award is proudly presented to</p>
          <h2 className="text-4xl sm:text-5xl font-black text-emerald-800 tracking-tight font-fredoka">
            {studentName}
          </h2>
          <p className="text-xs font-bold text-amber-900">of {schoolName}</p>
        </div>

        <p className="text-xs sm:text-sm text-amber-900 max-w-xl mx-auto font-medium leading-relaxed relative z-10">
          For demonstrating outstanding real-world action, creative evidence, and leadership in protecting Earth across the 17 UN Sustainable Development Goals.
        </p>

        <div className="flex items-center justify-center gap-2 py-2 relative z-10">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 p-1 shadow-lg border-2 border-amber-200">
            <div className="w-full h-full rounded-full bg-amber-900 flex items-center justify-center text-4xl">
              🌎
            </div>
          </div>
        </div>

        <div className="pt-6 border-t-2 border-dashed border-amber-300 flex items-center justify-between text-xs font-bold text-amber-900 relative z-10">
          <div className="text-left">
            <div className="font-handwriting text-xl text-slate-800">{teacherSignature}</div>
            <div className="text-[10px] text-amber-700 uppercase font-black border-t border-amber-400 pt-1">Class Teacher</div>
          </div>

          <div className="text-right">
            <div>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
            <div className="text-[10px] text-amber-700 uppercase font-black border-t border-amber-400 pt-1">Date of Award</div>
          </div>
        </div>
      </div>
    </div>
  );
}
