import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

// Sound Synthesizer
import { playBadgeUnlockSound, playLevelUpSound, playClickSound, playSuccessSound } from './audio/soundFx.js';

// Auth & Entry Components
import { AuthScreen } from './components/auth/AuthScreen.jsx';

// Common Components
import { RoleSwitcher } from './components/common/RoleSwitcher.jsx';
import { Navigation } from './components/common/Navigation.jsx';

// Child View Components
import { ChildHome } from './components/child/ChildHome.jsx';
import { LessonsView } from './components/child/LessonsView.jsx';
import { QuizModal } from './components/child/QuizModal.jsx';
import { SDGGrid } from './components/child/SDGGrid.jsx';
import { SDGDetailModal } from './components/child/SDGDetailModal.jsx';
import { MissionScreen } from './components/child/MissionScreen.jsx';
import { SubmissionStudio } from './components/child/SubmissionStudio.jsx';
import { BookView } from './components/child/SDGBook/BookView.jsx';
import { BadgesView } from './components/child/BadgesView.jsx';
import { AvatarBuilder } from './components/child/AvatarBuilder.jsx';
import { SummerAdventure } from './components/child/SummerAdventure.jsx';

// Teacher & Parent Components
import { TeacherDashboard } from './components/teacher/TeacherDashboard.jsx';
import { CertificateGen } from './components/teacher/CertificateGen.jsx';
import { ParentDashboard } from './components/parent/ParentDashboard.jsx';

// Constants & Lessons Data
import { INITIAL_MISSIONS, INITIAL_BOOK_PAGES, SDGS_DATA, LEVELS } from './utils/constants.js';
import { LESSONS_DATA } from './utils/lessonsData.js';

// Helper to compute level from XP dynamically
function computeLevel(xp) {
  if (xp >= 1000) return { level: 5, levelName: 'SDG Champion' };
  if (xp >= 600) return { level: 4, levelName: 'Community Hero' };
  if (xp >= 300) return { level: 3, levelName: 'Change Maker' };
  if (xp >= 100) return { level: 2, levelName: 'Earth Friend' };
  return { level: 1, levelName: 'SDG Explorer' };
}

export default function App() {
  // Authentication & Role State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('child'); // 'child' | 'teacher' | 'parent'
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'learn' | 'missions' | 'book' | 'badges' | 'profile' | 'summer'
  const [soundOn, setSoundOn] = useState(true);

  // Student Profile State (Starts clean for new users)
  const [childProfile, setChildProfile] = useState({
    name: 'Explorer',
    xp: 0,
    level: 1,
    levelName: 'SDG Explorer',
    streak: 1,
    unlockedBadges: [],
    pagesCount: 0,
    avatar: {
      skin: '#FFD1A4',
      hair: '#8D5B4C',
      style: 'Adventure Cap',
      outfit: 'Eco Adventurer Tee',
      accessory: 'Eco Backpack 🎒'
    }
  });

  const [sdgs, setSdgs] = useState(SDGS_DATA);
  const [missions, setMissions] = useState(INITIAL_MISSIONS);
  const [submissions, setSubmissions] = useState([]);
  const [bookPages, setBookPages] = useState([]);
  const [completedQuizzes, setCompletedQuizzes] = useState({});
  const [teacherData, setTeacherData] = useState({
    name: 'Ms. Clara Vance',
    className: 'Class 5A',
    totalStudents: 32,
    completionRate: 84
  });
  const [parentDigest, setParentDigest] = useState({
    parentName: 'Sarah & David',
    childName: 'Explorer'
  });
  const [summerData, setSummerData] = useState({ currentDay: 1, totalDays: 30, completedDays: [] });

  // Selected state for modals & screens
  const [selectedSdg, setSelectedSdg] = useState(null);
  const [selectedMission, setSelectedMission] = useState(null);
  const [isSubmittingMission, setIsSubmittingMission] = useState(null);
  const [showCertificateGen, setShowCertificateGen] = useState(false);
  const [activeQuizLesson, setActiveQuizLesson] = useState(null);

  // Victory Celebration Modal State
  const [celebrationData, setCelebrationData] = useState(null);

  // Load initial backend data or localStorage session if available
  useEffect(() => {
    const savedSession = localStorage.getItem('sdg_user_session');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        setIsLoggedIn(true);
        setRole(parsed.role || 'child');
        if (parsed.profile) setChildProfile(parsed.profile);
        if (parsed.bookPages) setBookPages(parsed.bookPages);
        if (parsed.completedQuizzes) setCompletedQuizzes(parsed.completedQuizzes);
      } catch (e) {}
    }

    // Try fetching from backend API (optional fallback)
    fetch('/api/missions')
      .then(res => res.json())
      .then(data => setMissions(data))
      .catch(() => {});

    fetch('/api/submissions')
      .then(res => res.json())
      .then(data => setSubmissions(data))
      .catch(() => {});

    fetch('/api/teacher')
      .then(res => res.json())
      .then(data => setTeacherData(data))
      .catch(() => {});

    fetch('/api/parent')
      .then(res => res.json())
      .then(data => setParentDigest(data))
      .catch(() => {});
  }, []);

  // Save session state to localStorage
  const saveSession = (newRole, newProfile, newPages, newQuizzes) => {
    try {
      localStorage.setItem('sdg_user_session', JSON.stringify({
        role: newRole || role,
        profile: newProfile || childProfile,
        bookPages: newPages || bookPages,
        completedQuizzes: newQuizzes || completedQuizzes
      }));
    } catch (e) {}
  };

  // Auth Handler: called from AuthScreen
  const handleLoginSuccess = (selectedRole, profileData, isSampleData = false) => {
    setRole(selectedRole);
    setIsLoggedIn(true);
    setActiveTab('home');

    if (selectedRole === 'child') {
      const studentProfile = {
        name: profileData.name || 'Explorer',
        xp: profileData.xp || 0,
        level: profileData.level || 1,
        levelName: profileData.levelName || 'SDG Explorer',
        streak: profileData.streak || 1,
        unlockedBadges: profileData.unlockedBadges || [],
        pagesCount: isSampleData ? 3 : (profileData.pagesCount || 0),
        avatar: profileData.avatar || {
          skin: '#FFD1A4',
          hair: '#8D5B4C',
          style: 'Adventure Hat',
          outfit: 'Eco Adventurer Tee',
          accessory: 'Eco Backpack 🎒'
        }
      };

      const startingPages = isSampleData ? INITIAL_BOOK_PAGES : [];
      setChildProfile(studentProfile);
      setBookPages(startingPages);
      saveSession('child', studentProfile, startingPages, {});
    } else if (selectedRole === 'teacher') {
      setTeacherData(prev => ({ ...prev, ...profileData }));
      saveSession('teacher', childProfile, bookPages, completedQuizzes);
    } else if (selectedRole === 'parent') {
      setParentDigest(prev => ({ ...prev, ...profileData }));
      saveSession('parent', childProfile, bookPages, completedQuizzes);
    }
  };

  // Switch User / Logout: Returns to AuthScreen
  const handleSwitchUser = () => {
    playClickSound();
    setIsLoggedIn(false);
  };

  // Handler to start a mission
  const handleStartMission = (missionOrId) => {
    let missionObj = null;
    if (typeof missionOrId === 'string') {
      missionObj = missions.find(m => m.id === missionOrId) || missions[0];
    } else {
      missionObj = missionOrId;
    }
    setSelectedMission(missionObj);
    setActiveTab('mission_detail');
  };

  // Handler to open quiz
  const handleOpenQuiz = (lesson) => {
    setActiveQuizLesson(lesson);
  };

  // Handler when quiz is completed
  const handleQuizComplete = (sdgId, score, totalQ, xpEarned) => {
    const newXp = childProfile.xp + xpEarned;
    const { level, levelName } = computeLevel(newXp);
    const newQuizzes = { ...completedQuizzes, [sdgId]: { score, totalQ, completedAt: new Date().toISOString() } };

    const updatedProfile = {
      ...childProfile,
      xp: newXp,
      level,
      levelName
    };

    setChildProfile(updatedProfile);
    setCompletedQuizzes(newQuizzes);
    saveSession(role, updatedProfile, bookPages, newQuizzes);

    // Also notify backend if available
    fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ xp: newXp, level, levelName })
    }).catch(() => {});
  };

  // Handler when evidence is submitted
  const handleSubmitComplete = (payload) => {
    const xpReward = selectedMission?.xpReward || 50;
    const newXp = childProfile.xp + xpReward;
    const { level, levelName } = computeLevel(newXp);

    const badgeId = selectedMission?.badgeId || 'water_saver';
    const unlockedBadges = [...childProfile.unlockedBadges];
    if (badgeId && !unlockedBadges.includes(badgeId)) {
      unlockedBadges.push(badgeId);
    }

    const newPage = {
      id: `page_${Date.now()}`,
      sdgId: selectedMission?.sdgId || 6,
      sdgNumber: selectedMission?.sdgNumber || 6,
      title: selectedMission?.title || 'Eco Adventure',
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      caption: payload.caption || 'Completed real-world sustainability challenge!',
      type: payload.type || 'photo',
      mediaUrl: payload.mediaUrl,
      frame: payload.frame || 'water',
      stickers: payload.stickers || ['💧', '⭐'],
      xpEarned: xpReward,
      badgeName: selectedMission?.badgeName || 'SDG Achiever',
      badgeIcon: selectedMission?.badgeIcon || '⭐',
      author: childProfile.name
    };

    const newPages = [...bookPages, newPage];

    const updatedProfile = {
      ...childProfile,
      xp: newXp,
      level,
      levelName,
      unlockedBadges,
      pagesCount: newPages.length
    };

    setChildProfile(updatedProfile);
    setBookPages(newPages);
    saveSession(role, updatedProfile, newPages, completedQuizzes);

    // Also notify server backend if active
    fetch('/api/submissions?autoApprove=true', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, childName: childProfile.name })
    }).catch(() => {});

    // Trigger celebration modal with confetti & audio
    triggerCelebration({
      xpEarned: xpReward,
      badgeName: selectedMission?.badgeName || 'SDG Achiever',
      badgeIcon: selectedMission?.badgeIcon || '⭐',
      missionTitle: selectedMission?.title || 'Eco Action'
    });

    setIsSubmittingMission(null);
    setSelectedMission(null);
    setActiveTab('home');
  };

  // Trigger celebration modal with confetti & audio
  const triggerCelebration = (data) => {
    try {
      confetti({
        particleCount: 130,
        spread: 85,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    playBadgeUnlockSound();
    setCelebrationData(data);
  };

  // Teacher verification handler
  const handleVerifySubmission = (subId, status, comment) => {
    fetch(`/api/submissions/${subId}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, teacherComment: comment })
    })
      .then(res => res.json())
      .then(data => {
        if (data.childProfile) setChildProfile(data.childProfile);
        if (data.bookPages) setBookPages(data.bookPages);
      })
      .catch(() => {});

    setSubmissions(prev => prev.map(s => s.id === subId ? { ...s, status, teacherComment: comment } : s));
  };

  // Teacher custom mission creator
  const handleCreateMission = (newMission) => {
    const fullMission = {
      ...newMission,
      id: `m_custom_${Date.now()}`,
      status: 'available',
      checklistItems: ['Plan Action 📝', 'Perform Eco Habit 🌿', 'Reflect & Share 💬']
    };

    fetch('/api/missions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fullMission)
    })
      .then(res => res.json())
      .then(saved => setMissions(prev => [...prev, saved]))
      .catch(() => {
        setMissions(prev => [...prev, fullMission]);
      });
  };

  // Summer day complete handler
  const handleCompleteSummerDay = (dayNum) => {
    if (!summerData.completedDays.includes(dayNum)) {
      const updated = {
        ...summerData,
        completedDays: [...summerData.completedDays, dayNum]
      };
      setSummerData(updated);
      const newXp = childProfile.xp + 20;
      const { level, levelName } = computeLevel(newXp);
      const updatedProfile = { ...childProfile, xp: newXp, level, levelName };
      setChildProfile(updatedProfile);
      saveSession(role, updatedProfile, bookPages, completedQuizzes);
    }
  };

  // If not logged in, render the Role Selection / Entry screen!
  if (!isLoggedIn) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-living-planet flex flex-col justify-between font-sans">
      {/* Top Header Role Switcher Bar */}
      <RoleSwitcher
        currentRole={role}
        onRoleChange={(r) => {
          setRole(r);
          setShowCertificateGen(false);
          setActiveTab('home');
        }}
        onSwitchUser={handleSwitchUser}
        childProfile={childProfile}
        teacherData={teacherData}
        parentDigest={parentDigest}
        soundOn={soundOn}
        setSoundOn={setSoundOn}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {role === 'child' && (
          <>
            {activeTab === 'home' && (
              <ChildHome
                childProfile={childProfile}
                todaysMission={missions[0]}
                onStartMission={handleStartMission}
                onOpenBook={() => setActiveTab('book')}
                onNavigate={(t) => setActiveTab(t)}
              />
            )}

            {activeTab === 'learn' && (
              <LessonsView
                onOpenQuiz={handleOpenQuiz}
                onStartMission={handleStartMission}
                completedQuizzes={completedQuizzes}
              />
            )}

            {activeTab === 'missions' && (
              <SDGGrid
                sdgs={sdgs}
                onSelectSdg={(sdg) => setSelectedSdg(sdg)}
              />
            )}

            {activeTab === 'book' && (
              <BookView
                bookPages={bookPages}
                childName={childProfile.name}
                onBackToHome={() => setActiveTab('home')}
                onNavigateToMissions={() => setActiveTab('missions')}
              />
            )}

            {activeTab === 'badges' && (
              <BadgesView unlockedBadgeIds={childProfile.unlockedBadges} />
            )}

            {activeTab === 'profile' && (
              <AvatarBuilder
                childProfile={childProfile}
                onSaveAvatar={(av) => {
                  const updatedProfile = { ...childProfile, avatar: av };
                  setChildProfile(updatedProfile);
                  saveSession('child', updatedProfile, bookPages, completedQuizzes);
                  fetch('/api/profile', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ avatar: av })
                  }).catch(() => {});
                }}
              />
            )}

            {activeTab === 'summer' && (
              <SummerAdventure
                summerData={summerData}
                onCompleteDay={handleCompleteSummerDay}
              />
            )}

            {activeTab === 'mission_detail' && (
              <MissionScreen
                mission={selectedMission}
                onBack={() => setActiveTab('missions')}
                onSubmitEvidence={(m) => {
                  setIsSubmittingMission(m);
                  setActiveTab('submission_studio');
                }}
              />
            )}

            {activeTab === 'submission_studio' && (
              <SubmissionStudio
                mission={isSubmittingMission || missions[0]}
                onBack={() => setActiveTab('mission_detail')}
                onSubmitComplete={handleSubmitComplete}
              />
            )}
          </>
        )}

        {role === 'teacher' && (
          <>
            {showCertificateGen ? (
              <CertificateGen onBack={() => setShowCertificateGen(false)} />
            ) : (
              <TeacherDashboard
                teacherData={teacherData}
                submissions={submissions}
                onVerifySubmission={handleVerifySubmission}
                onCreateMission={handleCreateMission}
                onOpenCertificateGen={() => setShowCertificateGen(true)}
              />
            )}
          </>
        )}

        {role === 'parent' && (
          <ParentDashboard
            parentDigest={parentDigest}
            childProfile={childProfile}
            onOpenBook={() => {
              setRole('child');
              setActiveTab('book');
            }}
          />
        )}
      </main>

      {/* Child Bottom Navigation Bar */}
      {role === 'child' && activeTab !== 'submission_studio' && (
        <Navigation
          activeTab={activeTab}
          onTabChange={(t) => setActiveTab(t)}
        />
      )}

      {/* Interactive SDG Hub Modal */}
      {selectedSdg && (
        <SDGDetailModal
          sdg={selectedSdg}
          onClose={() => setSelectedSdg(null)}
          onStartMission={handleStartMission}
          onOpenQuiz={handleOpenQuiz}
          bookPages={bookPages}
          unlockedBadges={childProfile.unlockedBadges}
          completedQuizzes={completedQuizzes}
        />
      )}

      {/* Interactive Quiz Mini-Game Modal */}
      {activeQuizLesson && (
        <QuizModal
          lesson={activeQuizLesson}
          onClose={() => setActiveQuizLesson(null)}
          onComplete={handleQuizComplete}
          onStartMission={handleStartMission}
        />
      )}

      {/* Gratification Victory Celebration Modal */}
      {celebrationData && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center space-y-4 shadow-2xl border-4 border-amber-300 animate-float my-auto">
            <div className="text-7xl animate-bounce">✨</div>

            <div className="bg-amber-100 text-amber-950 font-black text-xs uppercase px-3.5 py-1 rounded-full border border-amber-300 inline-block tracking-wider">
              MISSION COMPLETED! 🎉
            </div>

            <h2 className="text-3xl font-black text-slate-900">
              🏅 BADGE UNLOCKED!
            </h2>

            <div className="w-24 h-24 rounded-full bg-amber-400 p-1 border-4 border-white shadow-xl mx-auto flex items-center justify-center text-5xl">
              {celebrationData.badgeIcon}
            </div>

            <div className="space-y-1">
              <div className="text-xl font-black text-amber-900">{celebrationData.badgeName}</div>
              <div className="text-lg font-black text-emerald-600">+ {celebrationData.xpEarned} XP ⭐</div>
            </div>

            <div className="p-3 bg-teal-50 rounded-2xl border border-teal-200 text-xs font-bold text-teal-900">
              📖 A NEW PAGE WAS CREATED IN YOUR SDG BOOK!
            </div>

            <button
              onClick={() => {
                playClickSound();
                setCelebrationData(null);
                setActiveTab('book');
              }}
              className="btn-pop w-full bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 font-black py-3.5 rounded-2xl shadow-lg border-2 border-amber-200 text-sm"
            >
              OPEN MY SDG BOOK NOW 📖 →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
