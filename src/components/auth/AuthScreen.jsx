import React, { useState } from 'react';
import { ArrowLeft, User, GraduationCap, Heart, Sparkles, Check, ShieldCheck, KeyRound, Mail, Lock } from 'lucide-react';
import { playClickSound, playSuccessSound } from '../../audio/soundFx.js';

export function AuthScreen({ onLoginSuccess }) {
  // state: 'select_role' | 'student_login' | 'student_signup' | 'teacher_login' | 'teacher_signup' | 'parent_login' | 'parent_signup'
  const [screen, setScreen] = useState('select_role');

  // Student Form State
  const [studentName, setStudentName] = useState('');
  const [studentPin, setStudentPin] = useState('');
  const [studentGrade, setStudentGrade] = useState('Grade 4');
  const [studentAvatar, setStudentAvatar] = useState('👧');

  // Teacher Form State
  const [teacherEmail, setTeacherEmail] = useState('');
  const [teacherPassword, setTeacherPassword] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [teacherClass, setTeacherClass] = useState('Class 4B');

  // Parent Form State
  const [parentEmail, setParentEmail] = useState('');
  const [parentPassword, setParentPassword] = useState('');
  const [parentName, setParentName] = useState('');
  const [childLinkedName, setChildLinkedName] = useState('');

  // Handle Student Login
  const handleStudentLogin = (e) => {
    e.preventDefault();
    playSuccessSound();
    const finalName = studentName.trim() || 'Explorer';
    
    // Check if logging in as default demo Leo or a fresh student
    if (finalName.toLowerCase() === 'leo') {
      onLoginSuccess('child', {
        name: 'Leo',
        xp: 210,
        level: 2,
        levelName: 'Earth Friend',
        streak: 4,
        unlockedBadges: ['water_saver', 'nature_protector', 'waste_warrior'],
        pagesCount: 3,
        avatar: {
          skin: '#FFD1A4',
          hair: '#8D5B4C',
          style: 'Short Curly',
          outfit: 'Water Guardian Hoodie',
          accessory: 'Eco Backpack 🎒'
        }
      }, true);
    } else {
      // Custom / Fresh student profile starting clean
      onLoginSuccess('child', {
        name: finalName,
        xp: 0,
        level: 1,
        levelName: 'SDG Explorer',
        streak: 1,
        unlockedBadges: [],
        pagesCount: 0,
        avatar: {
          skin: '#FFD1A4',
          hair: '#8D5B4C',
          style: 'Adventure Hat',
          outfit: 'Eco Adventurer Tee',
          accessory: 'Eco Backpack 🎒'
        }
      }, false);
    }
  };

  // Handle Student Signup (Fresh account with 0 XP)
  const handleStudentSignup = (e) => {
    e.preventDefault();
    playSuccessSound();
    const finalName = studentName.trim() || 'Eco Explorer';

    onLoginSuccess('child', {
      name: finalName,
      xp: 0,
      level: 1,
      levelName: 'SDG Explorer',
      streak: 1,
      unlockedBadges: [],
      pagesCount: 0,
      grade: studentGrade,
      avatarIcon: studentAvatar,
      avatar: {
        skin: '#FFD1A4',
        hair: '#8D5B4C',
        style: 'Adventure Hat',
        outfit: 'Eco Adventurer Tee',
        accessory: 'Eco Backpack 🎒'
      }
    }, false); // fresh = false (empty book)
  };

  // Handle Teacher Login / Signup
  const handleTeacherLogin = (e) => {
    e.preventDefault();
    playSuccessSound();
    onLoginSuccess('teacher', {
      name: teacherName || 'Ms. Clara Vance',
      email: teacherEmail || 'teacher@greenwood.edu',
      className: teacherClass || 'Class 5A',
      totalStudents: 32,
      completionRate: 84
    });
  };

  // Handle Parent Login / Signup
  const handleParentLogin = (e) => {
    e.preventDefault();
    playSuccessSound();
    onLoginSuccess('parent', {
      name: parentName || 'Sarah & David',
      email: parentEmail || 'parent@home.org',
      childName: childLinkedName || studentName || 'Leo'
    });
  };

  // Quick Demo Access
  const handleQuickDemo = (roleChoice) => {
    playSuccessSound();
    if (roleChoice === 'child') {
      onLoginSuccess('child', {
        name: 'Aarav',
        xp: 0,
        level: 1,
        levelName: 'SDG Explorer',
        streak: 1,
        unlockedBadges: [],
        pagesCount: 0,
        avatar: {
          skin: '#FFD1A4',
          hair: '#8D5B4C',
          style: 'Short Curly',
          outfit: 'Eco Adventurer Tee',
          accessory: 'Eco Backpack 🎒'
        }
      }, false);
    } else if (roleChoice === 'teacher') {
      onLoginSuccess('teacher', {
        name: 'Ms. Clara Vance',
        className: 'Class 5A',
        totalStudents: 32,
        completionRate: 84
      });
    } else {
      onLoginSuccess('parent', {
        name: 'David Sharma',
        childName: 'Aarav'
      });
    }
  };

  return (
    <div className="min-h-screen bg-living-planet flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-10 shadow-2xl border-4 border-emerald-100 transition-all">
        
        {/* Top Logo & Welcome */}
        <div className="text-center space-y-2 mb-8">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 flex items-center justify-center text-3xl mx-auto shadow-md border-2 border-white">
            🌎
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            WELCOME TO SDG QUEST 🌎
          </h1>
          <p className="text-slate-600 font-semibold text-sm sm:text-base">
            Real-world sustainability adventures for school, home, and community!
          </p>
        </div>

        {/* 1. ROLE SELECTION SCREEN */}
        {screen === 'select_role' && (
          <div className="space-y-6">
            <div className="text-center">
              <span className="text-xs font-black uppercase text-emerald-700 bg-emerald-100 px-3.5 py-1 rounded-full border border-emerald-300 tracking-wide">
                Role Selection
              </span>
              <h2 className="text-2xl font-black text-slate-800 mt-2">
                Who are you?
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Student Card */}
              <button
                onClick={() => { playClickSound(); setScreen('student_login'); }}
                className="btn-pop p-6 rounded-3xl bg-gradient-to-b from-emerald-50 to-teal-50 border-2 border-emerald-200 hover:border-emerald-400 text-left flex flex-col justify-between group shadow-sm hover:shadow-md"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-3xl shadow mb-3 group-hover:scale-105 transition-transform">
                    👧
                  </div>
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-700">
                    I’m a Student
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                    Learn SDGs, complete real eco missions, take fun quizzes, and build your scrapbook!
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-emerald-200/60 flex items-center justify-between text-xs font-black text-emerald-700">
                  <span>Enter Quest</span>
                  <span>→</span>
                </div>
              </button>

              {/* Teacher Card */}
              <button
                onClick={() => { playClickSound(); setScreen('teacher_login'); }}
                className="btn-pop p-6 rounded-3xl bg-gradient-to-b from-indigo-50 to-blue-50 border-2 border-indigo-200 hover:border-indigo-400 text-left flex flex-col justify-between group shadow-sm hover:shadow-md"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-3xl shadow mb-3 group-hover:scale-105 transition-transform">
                    👩‍🏫
                  </div>
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-indigo-700">
                    I’m a Teacher
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                    Review student evidence, assign classroom challenges, and print certificates.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-indigo-200/60 flex items-center justify-between text-xs font-black text-indigo-700">
                  <span>Classroom Hub</span>
                  <span>→</span>
                </div>
              </button>

              {/* Parent Card */}
              <button
                onClick={() => { playClickSound(); setScreen('parent_login'); }}
                className="btn-pop p-6 rounded-3xl bg-gradient-to-b from-purple-50 to-pink-50 border-2 border-purple-200 hover:border-purple-400 text-left flex flex-col justify-between group shadow-sm hover:shadow-md"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-purple-600 text-white flex items-center justify-center text-3xl shadow mb-3 group-hover:scale-105 transition-transform">
                    👨‍👩‍👧
                  </div>
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-purple-700">
                    I’m a Parent
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                    Track weekly progress, flip through your child’s SDG scrapbook, and do family tasks.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-purple-200/60 flex items-center justify-between text-xs font-black text-purple-700">
                  <span>Parent Portal</span>
                  <span>→</span>
                </div>
              </button>
            </div>

            {/* Quick Demo Explorer Bar */}
            <div className="pt-2 border-t border-slate-200 text-center">
              <p className="text-xs text-slate-500 font-semibold mb-2">Want to jump straight in with demo roles?</p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => handleQuickDemo('child')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold transition-colors"
                >
                  ⚡ Student Quick Demo
                </button>
                <button
                  onClick={() => handleQuickDemo('teacher')}
                  className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-300 text-xs font-bold transition-colors"
                >
                  ⚡ Teacher Quick Demo
                </button>
                <button
                  onClick={() => handleQuickDemo('parent')}
                  className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-300 text-xs font-bold transition-colors"
                >
                  ⚡ Parent Quick Demo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. STUDENT LOGIN SCREEN */}
        {screen === 'student_login' && (
          <form onSubmit={handleStudentLogin} className="space-y-5">
            <button
              type="button"
              onClick={() => { playClickSound(); setScreen('select_role'); }}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Role Selection</span>
            </button>

            <div className="text-center space-y-1">
              <span className="text-4xl inline-block">👧🧒</span>
              <h2 className="text-2xl font-black text-slate-900">Student Login</h2>
              <p className="text-xs text-slate-600 font-medium">
                Enter your student name and adventure PIN to begin!
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Your Name / Username
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya, Sam, or Aarav"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Secret PIN or Password
                </label>
                <input
                  type="password"
                  placeholder="e.g. 1234 (demo PIN)"
                  value={studentPin}
                  onChange={(e) => setStudentPin(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-pop w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black py-4 rounded-2xl shadow-lg border-2 border-emerald-300 text-base flex items-center justify-center gap-2"
            >
              <span>START MY ADVENTURE →</span>
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => { playClickSound(); setScreen('student_signup'); }}
                className="text-xs font-black text-emerald-700 hover:underline"
              >
                New student? Create Student Account ✨
              </button>
            </div>
          </form>
        )}

        {/* 3. STUDENT SIGNUP SCREEN */}
        {screen === 'student_signup' && (
          <form onSubmit={handleStudentSignup} className="space-y-4">
            <button
              type="button"
              onClick={() => { playClickSound(); setScreen('student_login'); }}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Student Login</span>
            </button>

            <div className="text-center space-y-1">
              <span className="text-4xl inline-block">🌱✨</span>
              <h2 className="text-2xl font-black text-slate-900">Create Student Account</h2>
              <p className="text-xs text-slate-600 font-medium">
                Start your own journey with Level 1, 0 XP, and an empty scrapbook waiting for memories!
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  What is your name?
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya, Ethan, Ananya"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Your Grade
                  </label>
                  <select
                    value={studentGrade}
                    onChange={(e) => setStudentGrade(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold text-slate-800 text-sm"
                  >
                    <option>Grade 1</option>
                    <option>Grade 2</option>
                    <option>Grade 3</option>
                    <option>Grade 4</option>
                    <option>Grade 5</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Choose Avatar
                  </label>
                  <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-2xl border-2 border-slate-200">
                    {['👧', '👦', '🧒', '🧑', '🦸'].map((em) => (
                      <button
                        key={em}
                        type="button"
                        onClick={() => setStudentAvatar(em)}
                        className={`text-xl p-1 rounded-xl transition-all ${
                          studentAvatar === em ? 'bg-amber-300 scale-110 shadow' : 'hover:bg-slate-200'
                        }`}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Create a 4-Digit Demo PIN
                </label>
                <input
                  type="password"
                  maxLength={4}
                  placeholder="e.g. 1234"
                  value={studentPin}
                  onChange={(e) => setStudentPin(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold text-slate-800 text-sm"
                />
              </div>
            </div>

            <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200 text-xs text-emerald-900 font-semibold flex items-center gap-2">
              <span>⭐</span>
              <span>Your adventure starts at: <strong>0 XP • Level 1 (Seed 🌱) • 0 Book Pages</strong></span>
            </div>

            <button
              type="submit"
              className="btn-pop w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black py-3.5 rounded-2xl shadow-lg border-2 border-emerald-300 text-sm flex items-center justify-center gap-2"
            >
              <span>CREATE MY ADVENTURE & START →</span>
            </button>
          </form>
        )}

        {/* 4. TEACHER LOGIN SCREEN */}
        {screen === 'teacher_login' && (
          <form onSubmit={handleTeacherLogin} className="space-y-4">
            <button
              type="button"
              onClick={() => { playClickSound(); setScreen('select_role'); }}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Role Selection</span>
            </button>

            <div className="text-center space-y-1">
              <span className="text-4xl inline-block">👩‍🏫🍎</span>
              <h2 className="text-2xl font-black text-slate-900">Teacher Login</h2>
              <p className="text-xs text-slate-600 font-medium">
                Access your classroom verification queue, student book pages & certificates.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Teacher Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="teacher@school.edu"
                    value={teacherEmail}
                    onChange={(e) => setTeacherEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={teacherPassword}
                    onChange={(e) => setTeacherPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn-pop w-full bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 text-white font-black py-3.5 rounded-2xl shadow-lg border-2 border-indigo-300 text-sm flex items-center justify-center gap-2"
            >
              <span>LOGIN AS TEACHER</span>
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => { playClickSound(); setScreen('teacher_signup'); }}
                className="text-xs font-black text-indigo-700 hover:underline"
              >
                Create Teacher Account
              </button>
            </div>
          </form>
        )}

        {/* 5. TEACHER SIGNUP SCREEN */}
        {screen === 'teacher_signup' && (
          <form onSubmit={handleTeacherLogin} className="space-y-4">
            <button
              type="button"
              onClick={() => { playClickSound(); setScreen('teacher_login'); }}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Teacher Login</span>
            </button>

            <div className="text-center space-y-1">
              <span className="text-4xl inline-block">🏫✨</span>
              <h2 className="text-2xl font-black text-slate-900">Create Teacher Account</h2>
              <p className="text-xs text-slate-600 font-medium">
                Set up your classroom roster and start reviewing SDG submissions!
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ms. Clara Vance"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold text-slate-800 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Class Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Class 5A (Greenwood Elementary)"
                  value={teacherClass}
                  onChange={(e) => setTeacherClass(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold text-slate-800 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Work Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="teacher@school.org"
                  value={teacherEmail}
                  onChange={(e) => setTeacherEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold text-slate-800 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-pop w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3.5 rounded-2xl shadow-lg border-2 border-indigo-300 text-sm"
            >
              CREATE TEACHER ACCOUNT & OPEN DASHBOARD
            </button>
          </form>
        )}

        {/* 6. PARENT LOGIN SCREEN */}
        {screen === 'parent_login' && (
          <form onSubmit={handleParentLogin} className="space-y-4">
            <button
              type="button"
              onClick={() => { playClickSound(); setScreen('select_role'); }}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Role Selection</span>
            </button>

            <div className="text-center space-y-1">
              <span className="text-4xl inline-block">👨‍👩‍👧🏡</span>
              <h2 className="text-2xl font-black text-slate-900">Parent Login</h2>
              <p className="text-xs text-slate-600 font-medium">
                View your child’s SDG scrapbook, badges, and verify family eco-habits.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="parent@gmail.com"
                    value={parentEmail}
                    onChange={(e) => setParentEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={parentPassword}
                    onChange={(e) => setParentPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn-pop w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black py-3.5 rounded-2xl shadow-lg border-2 border-purple-300 text-sm flex items-center justify-center gap-2"
            >
              <span>LOGIN AS PARENT</span>
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => { playClickSound(); setScreen('parent_signup'); }}
                className="text-xs font-black text-purple-700 hover:underline"
              >
                Create Parent Account
              </button>
            </div>
          </form>
        )}

        {/* 7. PARENT SIGNUP SCREEN */}
        {screen === 'parent_signup' && (
          <form onSubmit={handleParentLogin} className="space-y-4">
            <button
              type="button"
              onClick={() => { playClickSound(); setScreen('parent_login'); }}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Parent Login</span>
            </button>

            <div className="text-center space-y-1">
              <span className="text-4xl inline-block">🏡✨</span>
              <h2 className="text-2xl font-black text-slate-900">Create Parent Account</h2>
              <p className="text-xs text-slate-600 font-medium">
                Connect with your child to celebrate their real-world planet saving achievements!
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Parent Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. David Sharma"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold text-slate-800 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Child's Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya or Leo"
                  value={childLinkedName}
                  onChange={(e) => setChildLinkedName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold text-slate-800 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="parent@family.com"
                  value={parentEmail}
                  onChange={(e) => setParentEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold text-slate-800 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-pop w-full bg-purple-600 hover:bg-purple-700 text-white font-black py-3.5 rounded-2xl shadow-lg border-2 border-purple-300 text-sm"
            >
              CREATE PARENT ACCOUNT & VIEW CHILD PROGRESS
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
