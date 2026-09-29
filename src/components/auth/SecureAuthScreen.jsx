import React, { useState } from 'react';
import { ArrowLeft, GraduationCap, Heart, Mail, Lock, User, KeyRound } from 'lucide-react';
import { playClickSound, playSuccessSound } from '../../audio/soundFx.js';
import { apiJson } from '../../lib/api.js';
import { hasSupabaseConfig, supabase } from '../../lib/supabase.js';

const roles = [
  {
    id: 'student',
    title: "I'm a Student",
    icon: '👧',
    detail: 'Learn SDGs, complete eco missions, and build your scrapbook.',
    action: 'Enter Quest',
    color: 'emerald'
  },
  {
    id: 'teacher',
    title: "I'm a Teacher",
    icon: '👩‍🏫',
    detail: 'Manage classes, review student evidence, and assign challenges.',
    action: 'Classroom Hub',
    color: 'indigo'
  },
  {
    id: 'parent',
    title: "I'm a Parent",
    icon: '👨‍👩‍👧',
    detail: "Follow your child's progress and celebrate learning at home.",
    action: 'Parent Portal',
    color: 'purple'
  }
];

const colorClasses = {
  emerald: 'from-emerald-50 to-teal-50 border-emerald-200 hover:border-emerald-400 text-emerald-700',
  indigo: 'from-indigo-50 to-blue-50 border-indigo-200 hover:border-indigo-400 text-indigo-700',
  purple: 'from-purple-50 to-pink-50 border-purple-200 hover:border-purple-400 text-purple-700'
};

export function SecureAuthScreen({ onLoginSuccess, onDemoPreview, onOpenDemo, passwordRecovery = false, onPasswordUpdated }) {
  const [role, setRole] = useState(null);
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [grade, setGrade] = useState('Grade 4');
  const [studentAvatar, setStudentAvatar] = useState('👧');
  const [classInviteCode, setClassInviteCode] = useState('');
  const [className, setClassName] = useState('');
  const [teacherInviteCode, setTeacherInviteCode] = useState('');
  const [childInviteCode, setChildInviteCode] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const request = async (path, body) => apiJson(path, {
    method: 'POST',
    body: JSON.stringify(body)
  });

  const handleLogin = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    setMessage('');
    try {
      if (!hasSupabaseConfig || !supabase) {
        throw new Error('Authentication is not configured. Contact your administrator.');
      }
      const result = await request('/api/auth/login', { email, password, role });
      const { error: sessionError } = await supabase.auth.setSession(result.session);
      if (sessionError) throw new Error('Could not establish a secure session. Please try again.');
      playSuccessSound();
      onLoginSuccess(result.profile.role === 'student' ? 'child' : result.profile.role, result.profile);
    } catch (requestError) {
      setError(requestError.message || 'Unable to log in. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    setMessage('');
    const account = { role, name, email, password };
    if (role === 'student') Object.assign(account, { grade, avatar: { icon: studentAvatar }, classInviteCode });
    if (role === 'teacher') Object.assign(account, { className, teacherInviteCode });
    if (role === 'parent') Object.assign(account, { childInviteCode });
    try {
      if (!hasSupabaseConfig || !supabase) {
        throw new Error('Authentication is not configured. Contact your administrator.');
      }
      const result = await request('/api/auth/register', account);
      setMessage(result.message || 'Check your email for a verification link.');
      setMode('login');
      setPassword('');
    } catch (requestError) {
      setError(requestError.message || 'Unable to create the account. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const handlePasswordReset = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const result = await request('/api/auth/forgot-password', { email });
      setMessage(result.message);
    } catch (requestError) {
      setError(requestError.message || 'Unable to request a password reset.');
    } finally {
      setBusy(false);
    }
  };

  const handleResend = async () => {
    setBusy(true);
    setError('');
    try {
      const result = await request('/api/auth/resend-verification', { email });
      setMessage(result.message);
    } catch (requestError) {
      setError(requestError.message || 'Unable to resend the verification email.');
    } finally {
      setBusy(false);
    }
  };

  const handleUpdatePassword = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    if (password !== passwordConfirmation) {
      setError('The passwords do not match.');
      setBusy(false);
      return;
    }
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw new Error('Unable to update your password. Request a new reset email and try again.');
      setMessage('Your password has been updated. Sign in with your new password.');
      await supabase.auth.signOut();
      onPasswordUpdated?.();
    } catch (requestError) {
      setError(requestError.message || 'Unable to update your password.');
    } finally {
      setBusy(false);
    }
  };

  const chooseRole = (selectedRole) => {
    playClickSound();
    setRole(selectedRole);
    setMode('login');
    setError('');
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-living-planet flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-10 shadow-2xl border-4 border-emerald-100">
        <div className="text-center space-y-2 mb-8">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 flex items-center justify-center text-3xl mx-auto shadow-md border-2 border-white">🌎</div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900">WELCOME TO SDG QUEST 🌎</h1>
          <p className="text-slate-600 font-semibold text-sm sm:text-base">Real-world sustainability adventures for school, home, and community!</p>
        </div>

        {passwordRecovery ? (
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="text-center space-y-1">
              <KeyRound className="mx-auto h-8 w-8 text-emerald-700" />
              <h2 className="text-2xl font-black text-slate-900">Choose a New Password</h2>
              <p className="text-xs text-slate-600 font-medium">Use at least 8 characters with uppercase, lowercase, and a number.</p>
            </div>
            <label className="block text-xs font-bold text-slate-700 uppercase">New Password
              <input required type="password" minLength={8} maxLength={128} pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,128}" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1 w-full rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-sm normal-case" />
            </label>
            <label className="block text-xs font-bold text-slate-700 uppercase">Confirm Password
              <input required type="password" minLength={8} maxLength={128} autoComplete="new-password" value={passwordConfirmation} onChange={(event) => setPasswordConfirmation(event.target.value)} className="mt-1 w-full rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-sm normal-case" />
            </label>
            {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-bold text-rose-800">{error}</p>}
            <button disabled={busy} className="btn-pop w-full rounded-2xl border-2 border-emerald-300 bg-emerald-600 py-3.5 text-sm font-black text-white disabled:opacity-60">UPDATE PASSWORD</button>
          </form>
        ) : !role ? (
          <div className="space-y-6">
            <div className="text-center">
              <span className="text-xs font-black uppercase text-emerald-700 bg-emerald-100 px-3.5 py-1 rounded-full border border-emerald-300">Role Selection</span>
              <h2 className="text-2xl font-black text-slate-800 mt-2">Who are you?</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {roles.map((item) => (
                <button
                  key={item.id}
                  onClick={() => chooseRole(item.id)}
                  className={`btn-pop p-6 rounded-3xl bg-gradient-to-b border-2 text-left flex flex-col justify-between group shadow-sm hover:shadow-md ${colorClasses[item.color]}`}
                >
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-3xl shadow mb-3">{item.icon}</div>
                    <h3 className="text-lg font-black text-slate-900">{item.title}</h3>
                    <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">{item.detail}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-current/20 flex items-center justify-between text-xs font-black">
                    <span>{item.action}</span><span>→</span>
                  </div>
                </button>
              ))}
            </div>
            <div className="border-t border-slate-200 pt-4 text-center">
              <p className="text-xs font-bold text-slate-500">Preview only. Demo changes are not saved.</p>
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                {roles.map((item) => (
                  <button
                    key={`demo-${item.id}`}
                    type="button"
                    onClick={() => onDemoPreview?.(item.id)}
                    className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-black text-slate-700 hover:bg-slate-100"
                  >
                    Preview {item.id[0].toUpperCase() + item.id.slice(1)}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={onOpenDemo}
                className="mt-3 text-xs font-black text-emerald-800 underline underline-offset-2"
              >
                Open the original demo login and registration screens
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={mode === 'signup' ? handleRegister : mode === 'reset' ? handlePasswordReset : handleLogin} className="space-y-4">
            <button
              type="button"
              onClick={() => { playClickSound(); setRole(null); setMode('login'); setError(''); setMessage(''); }}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Role Selection
            </button>
            <div className="text-center space-y-1">
              <span className="text-4xl inline-block">{roles.find((item) => item.id === role)?.icon}</span>
              <h2 className="text-2xl font-black text-slate-900">
                {mode === 'signup' ? `Create ${role[0].toUpperCase()}${role.slice(1)} Account` : mode === 'reset' ? 'Reset Password' : `${role[0].toUpperCase()}${role.slice(1)} Login`}
              </h2>
              <p className="text-xs text-slate-600 font-medium">{mode === 'signup' ? 'Use an email address you can verify.' : 'Sign in with your verified email address.'}</p>
            </div>

            {mode === 'signup' && (
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Full Name
                <span className="relative mt-1 block"><User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" /><input required maxLength={100} value={name} onChange={(event) => setName(event.target.value)} className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold text-slate-800 text-sm normal-case" autoComplete="name" /></span>
              </label>
            )}

            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Email
              <span className="relative mt-1 block"><Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" /><input required type="email" maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold text-slate-800 text-sm normal-case" autoComplete="email" /></span>
            </label>

            {mode !== 'reset' && (
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Password {mode === 'signup' && <span className="normal-case text-slate-500">(8+ characters, uppercase, lowercase, and number)</span>}
                <span className="relative mt-1 block"><Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" /><input required type="password" minLength={mode === 'signup' ? 8 : undefined} maxLength={128} pattern={mode === 'signup' ? '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,128}' : undefined} value={password} onChange={(event) => setPassword(event.target.value)} className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold text-slate-800 text-sm normal-case" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} /></span>
              </label>
            )}

            {mode === 'signup' && role === 'student' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <label className="block text-xs font-bold text-slate-700 uppercase">Your Grade
                    <select value={grade} onChange={(event) => setGrade(event.target.value)} className="mt-1 w-full px-3 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold text-slate-800 text-sm normal-case">{[1, 2, 3, 4, 5].map((value) => <option key={value}>Grade {value}</option>)}</select>
                  </label>
                  <label className="block text-xs font-bold text-slate-700 uppercase">Choose Avatar
                    <select value={studentAvatar} onChange={(event) => setStudentAvatar(event.target.value)} className="mt-1 w-full px-3 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold text-slate-800 text-sm normal-case">{['👧', '👦', '🧒', '🧑', '🦸'].map((value) => <option key={value}>{value}</option>)}</select>
                  </label>
                </div>
                <label className="block text-xs font-bold text-slate-700 uppercase">Class Invitation Code <span className="normal-case text-slate-500">(optional)</span>
                  <input maxLength={80} value={classInviteCode} onChange={(event) => setClassInviteCode(event.target.value.trim())} className="mt-1 w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold text-slate-800 text-sm normal-case" />
                </label>
              </div>
            )}

            {mode === 'signup' && role === 'teacher' && (
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Class Name
                  <span className="mt-1 block"><input required maxLength={120} value={className} onChange={(event) => setClassName(event.target.value)} placeholder="e.g. Class 5A" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold text-slate-800 text-sm normal-case" /></span>
                </label>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Teacher Invitation Code
                  <span className="mt-1 block"><input required minLength={16} maxLength={128} value={teacherInviteCode} onChange={(event) => setTeacherInviteCode(event.target.value.trim())} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold text-slate-800 text-sm normal-case" /></span>
                </label>
              </div>
            )}

            {mode === 'signup' && role === 'parent' && (
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Child Invitation Code
                <span className="mt-1 block"><input required minLength={8} maxLength={80} value={childInviteCode} onChange={(event) => setChildInviteCode(event.target.value.trim())} placeholder="Ask your child for their code" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold text-slate-800 text-sm normal-case" /></span>
              </label>
            )}

            {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-bold text-rose-800">{error}{mode === 'login' && error.toLowerCase().includes('verify your email') && <button type="button" disabled={busy} onClick={handleResend} className="ml-2 underline">Resend verification email</button>}</div>}
            {message && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-bold text-emerald-900">{message}{mode === 'login' && <button type="button" disabled={busy} onClick={handleResend} className="ml-2 underline">Resend verification email</button>}</div>}

            <button disabled={busy} type="submit" className={`btn-pop w-full ${role === 'student' ? 'bg-gradient-to-r from-emerald-500 to-teal-600 border-emerald-300' : role === 'teacher' ? 'bg-gradient-to-r from-indigo-600 to-blue-700 border-indigo-300' : 'bg-gradient-to-r from-purple-600 to-pink-600 border-purple-300'} text-white font-black py-3.5 rounded-2xl shadow-lg border-2 text-sm flex items-center justify-center gap-2 disabled:opacity-60`}>
              {mode === 'signup' ? 'CREATE ACCOUNT & VERIFY EMAIL' : mode === 'reset' ? 'SEND PASSWORD RESET EMAIL' : 'SIGN IN'}
            </button>

            {mode === 'login' && <div className="text-center flex flex-col gap-2 pt-1">
              <button type="button" onClick={() => { setMode('reset'); setMessage(''); setError(''); }} className="text-xs font-bold text-slate-600 hover:underline">Forgot password?</button>
              <button type="button" onClick={() => { setMode('signup'); setMessage(''); setError(''); }} className="text-xs font-black text-emerald-700 hover:underline">New here? Create an account</button>
            </div>}
            {mode !== 'login' && <button type="button" onClick={() => { setMode('login'); setError(''); setMessage(''); }} className="w-full text-xs font-black text-slate-600 hover:underline">Back to login</button>}
            {mode === 'reset' && <KeyRound className="sr-only" aria-hidden="true" />}
          </form>
        )}
      </div>
    </div>
  );
}