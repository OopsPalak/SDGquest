import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

// Sound Synthesizer
import { playBadgeUnlockSound, playLevelUpSound, playClickSound, playSuccessSound } from './audio/soundFx.js';

// Common Components
import { RoleSwitcher } from './components/common/RoleSwitcher.jsx';
import { Navigation } from './components/common/Navigation.jsx';

// Child View Components
import { ChildHome } from './components/child/ChildHome.jsx';
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

// Constants
import { INITIAL_MISSIONS, INITIAL_BOOK_PAGES, SDGS_DATA } from './utils/constants.js';

export default function App() {
  const [role, setRole] = useState('child'); // 'child' | 'teacher' | 'parent'
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'sdgs' | 'book' | 'badges' | 'profile' | 'summer'
  const [soundOn, setSoundOn] = useState(true);

  // App Data States
  const [childProfile, setChildProfile] = useState({
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
  });

  const [sdgs, setSdgs] = useState(SDGS_DATA);
  const [missions, setMissions] = useState(INITIAL_MISSIONS);
  const [submissions, setSubmissions] = useState([]);
  const [bookPages, setBookPages] = useState(INITIAL_BOOK_PAGES);
  const [teacherData, setTeacherData] = useState(null);
  const [parentDigest, setParentDigest] = useState(null);
  const [summerData, setSummerData] = useState({ currentDay: 12, completedDays: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] });

  // Selected state for modals & screens
  const [selectedSdg, setSelectedSdg] = useState(null);
  const [selectedMission, setSelectedMission] = useState(null);
  const [isSubmittingMission, setIsSubmittingMission] = useState(null);
  const [showCertificateGen, setShowCertificateGen] = useState(false);

  // Victory Celebration Modal State
  const [celebrationData, setCelebrationData] = useState(null);

  // Fetch initial data from backend API with fallback
  useEffect(() => {
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => setChildProfile(data))
      .catch(() => {});

    fetch('/api/sdgs')
      .then(res => res.json())
      .then(data => setSdgs(data))
      .catch(() => {});

    fetch('/api/missions')
      .then(res => res.json())
      .then(data => setMissions(data))
      .catch(() => {});

    fetch('/api/submissions')
      .then(res => res.json())
      .then(data => setSubmissions(data))
      .catch(() => {});

    fetch('/api/book-pages')
      .then(res => res.json())
      .then(data => setBookPages(data))
      .catch(() => {});

    fetch('/api/teacher')
      .then(res => res.json())
      .then(data => setTeacherData(data))
      .catch(() => {});

    fetch('/api/parent')
      .then(res => res.json())
      .then(data => setParentDigest(data))
      .catch(() => {});

    fetch('/api/summer')
      .then(res => res.json())
      .then(data => setSummerData(data))
      .catch(() => {});
  }, []);

  // Handler to start a mission
  const handleStartMission = (mission) => {
    setSelectedMission(mission);
    setActiveTab('mission_detail');
  };

  // Handler when evidence is submitted
  const handleSubmitComplete = (payload) => {
    // Send to server API
    fetch('/api/submissions?autoApprove=true', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(result => {
        if (result.childProfile) {
          setChildProfile(result.childProfile);
        }
        if (result.bookPages) {
          setBookPages(result.bookPages);
        }
      })
      .catch(() => {
        // Local fallback calculation
        const xpEarned = selectedMission?.xpReward || 50;
        const newXp = childProfile.xp + xpEarned;
        let newLevel = childProfile.level;
        let newLevelName = childProfile.levelName;
        if (newXp >= 300 && childProfile.level < 3) {
          newLevel = 3;
          newLevelName = 'Change Maker';
        }

        const newPage = {
          id: `page_${Date.now()}`,
          sdgId: selectedMission?.sdgId || 6,
          sdgNumber: selectedMission?.sdgNumber || 6,
          title: selectedMission?.title || 'Eco Action',
          date: 'Sept 2026',
          caption: payload.caption || 'Mission completed!',
          type: payload.type,
          mediaUrl: payload.mediaUrl,
          frame: payload.frame,
          stickers: payload.stickers,
          xpEarned: xpEarned,
          badgeName: selectedMission?.badgeName || 'Water Saver',
          badgeIcon: selectedMission?.badgeIcon || '💧',
          author: childProfile.name
        };

        setChildProfile(prev => ({ ...prev, xp: newXp, level: newLevel, levelName: newLevelName }));
        setBookPages(prev => [...prev, newPage]);
      });

    // Trigger celebration effects!
    triggerCelebration({
      xpEarned: selectedMission?.xpReward || 50,
      badgeName: selectedMission?.badgeName || 'Water Saver',
      badgeIcon: selectedMission?.badgeIcon || '💧',
      missionTitle: selectedMission?.title || 'Eco Challenge'
    });

    setIsSubmittingMission(null);
    setSelectedMission(null);
    setActiveTab('home');
  };

  // Trigger celebration modal with confetti & audio
  const triggerCelebration = (data) => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
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
    fetch('/api/missions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMission)
    })
      .then(res => res.json())
      .then(saved => setMissions(prev => [...prev, saved]))
      .catch(() => {
        setMissions(prev => [...prev, { ...newMission, id: `m_${Date.now()}` }]);
      });
  };

  // Summer day complete handler
  const handleCompleteSummerDay = (dayNum) => {
    fetch('/api/summer/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ day: dayNum })
    })
      .then(res => res.json())
      .then(updated => setSummerData(updated))
      .catch(() => {
        setSummerData(prev => ({
          ...prev,
          completedDays: [...prev.completedDays, dayNum]
        }));
      });

    setChildProfile(prev => ({ ...prev, xp: prev.xp + 20 }));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top Header Role Switcher Bar */}
      <RoleSwitcher
        currentRole={role}
        onRoleChange={(r) => {
          setRole(r);
          setShowCertificateGen(false);
        }}
        childProfile={childProfile}
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

            {activeTab === 'sdgs' && (
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
              />
            )}

            {activeTab === 'badges' && (
              <BadgesView unlockedBadgeIds={childProfile.unlockedBadges} />
            )}

            {activeTab === 'profile' && (
              <AvatarBuilder
                childProfile={childProfile}
                onSaveAvatar={(av) => {
                  setChildProfile(prev => ({ ...prev, avatar: av }));
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
                onBack={() => setActiveTab('home')}
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

      {/* Selected SDG Detail Story Modal */}
      {selectedSdg && (
        <SDGDetailModal
          sdg={selectedSdg}
          onClose={() => setSelectedSdg(null)}
          onStartMission={handleStartMission}
        />
      )}

      {/* Gratification Victory Celebration Modal */}
      {celebrationData && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center space-y-4 shadow-2xl border-4 border-amber-300 animate-float my-auto">
            <div className="text-7xl animate-bounce">✨</div>

            <div className="bg-amber-100 text-amber-950 font-black text-xs uppercase px-3 py-1 rounded-full border border-amber-300 inline-block">
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
