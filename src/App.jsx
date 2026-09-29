import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

// Sound Synthesizer
import { playBadgeUnlockSound, playLevelUpSound, playClickSound, playSuccessSound } from './audio/soundFx.js';

// Auth & Entry Components
import { SecureAuthScreen as AuthScreen } from './components/auth/SecureAuthScreen.jsx';

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
import { apiJson, apiRequest } from './lib/api.js';
import { supabase } from './lib/supabase.js';

// Constants & Lessons Data
import { INITIAL_MISSIONS, SDGS_DATA } from './utils/constants.js';

// Helper to compute level from XP dynamically
function computeLevel(xp) {
  if (xp >= 1000) return { level: 5, levelName: 'SDG Champion' };
  if (xp >= 600) return { level: 4, levelName: 'Community Hero' };
  if (xp >= 300) return { level: 3, levelName: 'Change Maker' };
  if (xp >= 100) return { level: 2, levelName: 'Earth Friend' };
  return { level: 1, levelName: 'SDG Explorer' };
}

const DEFAULT_CHILD_PROFILE = {
  name: 'Explorer',
  xp: 0,
  level: 1,
  levelName: 'SDG Explorer',
  streak: 0,
  unlockedBadges: [],
  pagesCount: 0,
  avatar: {
    skin: '#FFD1A4',
    hair: '#8D5B4C',
    style: 'Adventure Cap',
    outfit: 'Eco Adventurer Tee',
    accessory: 'Eco Backpack 🎒'
  }
};

export default function App() {
  // Authentication & Role State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [passwordRecovery, setPasswordRecovery] = useState(false);
  const [role, setRole] = useState('child'); // 'child' | 'teacher' | 'parent'
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'learn' | 'missions' | 'book' | 'badges' | 'profile' | 'summer'
  const [soundOn, setSoundOn] = useState(true);

  // Student Profile State (Starts clean for new users)
  const [childProfile, setChildProfile] = useState(() => ({
    ...DEFAULT_CHILD_PROFILE,
    avatar: { ...DEFAULT_CHILD_PROFILE.avatar }
  }));

  const [sdgs, setSdgs] = useState(SDGS_DATA);
  const [missions, setMissions] = useState(INITIAL_MISSIONS);
  const [submissions, setSubmissions] = useState([]);
  const [bookPages, setBookPages] = useState([]);
  const [completedQuizzes, setCompletedQuizzes] = useState({});
  const [parentChildren, setParentChildren] = useState([]);
  const [selectedParentChild, setSelectedParentChild] = useState(null);
  const [familyMissions, setFamilyMissions] = useState([]);
  const [parentBookOpen, setParentBookOpen] = useState(false);
  const [studentInviteCode, setStudentInviteCode] = useState('');
  const [appMessage, setAppMessage] = useState('');
  const [teacherData, setTeacherData] = useState({
    name: '',
    className: 'No class yet',
    classes: [],
    students: [],
    totalStudents: 0,
    completionRate: 0
  });
  const [parentDigest, setParentDigest] = useState({
    parentName: '',
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

  const applyProfile = async (profile) => {
    const selectedRole = profile.role === 'student' ? 'child' : profile.role;
    setRole(selectedRole);
    setIsLoggedIn(true);
    setActiveTab('home');
    setAppMessage('');

    if (selectedRole === 'child') {
      setSdgs(SDGS_DATA.map((sdg) => ({ ...sdg, completedMissions: 0 })));
      setChildProfile((current) => ({
        ...current,
        name: profile.name,
        xp: profile.xp || 0,
        level: profile.level || 1,
        levelName: computeLevel(profile.xp || 0).levelName,
        streak: profile.streak || 0,
        grade: profile.grade,
        id: profile.id,
        avatar: { ...DEFAULT_CHILD_PROFILE.avatar, ...(profile.avatar || {}) }
      }));
      const [progress, pages, invite, missionRows, summer] = await Promise.all([
        apiJson('/api/student/progress'),
        apiJson('/api/student/book-pages'),
        apiJson('/api/profile/invite-code'),
        apiJson('/api/missions'),
        apiJson('/api/student/summer')
      ]);
      setChildProfile((current) => ({
        ...current,
        xp: progress.profile.xp,
        level: progress.profile.level,
        levelName: computeLevel(progress.profile.xp).levelName,
        streak: progress.profile.streak,
        unlockedBadges: progress.badges.map((badge) => badge.badge_id),
        pagesCount: pages.length,
        quizAttempts: progress.quizAttempts,
        sdgProgress: progress.sdgs,
        planetProgress: progress.planet
      }));
      const sdgProgress = new Map(progress.sdgs.map((item) => [item.sdg_number, item.progress]));
      setSdgs(SDGS_DATA.map((sdg) => ({
        ...sdg,
        completedMissions: Math.min(sdg.totalMissions, Math.round((sdgProgress.get(sdg.number) || 0) / 10))
      })));
      setBookPages(pages.map((page) => ({
        ...page,
        sdgId: page.sdg_number,
        sdgNumber: page.sdg_number,
        frame: page.frame_id,
        xpEarned: page.xp_earned,
        badgeName: page.badge_name,
        badgeIcon: page.badge_icon,
        stickers: page.stickers,
        author: profile.name,
        date: new Date(page.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      })));
      setStudentInviteCode(invite.inviteCode);
      setSummerData(summer);
      setCompletedQuizzes(Object.fromEntries(progress.quizAttempts.map((attempt) => [attempt.quiz_id, {
        score: attempt.score,
        totalQ: attempt.total,
        completedAt: attempt.created_at
      }])));
      setMissions(missionRows.map((mission) => ({
        ...mission,
        sdgId: mission.sdg_number,
        sdgNumber: mission.sdg_number,
        challengeText: mission.description,
        bonusText: '',
        xpReward: mission.xp_reward,
        badgeId: mission.badge_id,
        badgeName: mission.badge_name,
        badgeIcon: mission.badge_icon || '⭐',
        status: 'available'
      })));
    } else if (selectedRole === 'teacher') {
      const [dashboard, missionRows, pending] = await Promise.all([
        apiJson('/api/teacher'),
        apiJson('/api/missions'),
        apiJson('/api/submissions')
      ]);
      setTeacherData(dashboard);
      setMissions(missionRows);
      setSubmissions(pending);
    } else {
      setParentDigest((current) => ({ ...current, parentName: profile.name }));
      const [dashboard, missionRows] = await Promise.all([
        apiJson('/api/parent'),
        apiJson('/api/missions')
      ]);
      setParentChildren(dashboard.children);
      setMissions(missionRows);
      if (dashboard.children.length) {
        await loadParentChild(dashboard.children[0]);
      }
    }
  };

  const loadParentChild = async (child) => {
    const [progress, pages, submissions, family] = await Promise.all([
      apiJson(`/api/parent/children/${child.id}/progress`),
      apiJson(`/api/parent/children/${child.id}/book-pages`),
      apiJson(`/api/parent/children/${child.id}/submissions`),
      apiJson(`/api/parent/children/${child.id}/family-missions`)
    ]);
    setSelectedParentChild(child);
    setChildProfile((current) => ({
      ...current,
      id: progress.profile.id,
      name: progress.profile.name,
      xp: progress.profile.xp,
      level: progress.profile.level,
      levelName: computeLevel(progress.profile.xp).levelName,
      streak: progress.profile.streak,
      unlockedBadges: progress.badges.map((badge) => badge.badge_id),
      pagesCount: pages.length,
      quizAttempts: progress.quizAttempts,
      sdgProgress: progress.sdgs,
      planetProgress: progress.planet,
      avatar: { ...DEFAULT_CHILD_PROFILE.avatar, ...(progress.profile.avatar || {}) }
    }));
    setBookPages(pages.map((page) => ({
      ...page,
      date: new Date(page.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    })));
    setSubmissions(submissions);
    setFamilyMissions(family);
    setParentDigest((current) => ({ ...current, childName: progress.profile.name }));
  };

  const clearPrivateState = () => {
    setIsLoggedIn(false);
    setRole('child');
    setActiveTab('home');
    setChildProfile({ ...DEFAULT_CHILD_PROFILE, avatar: { ...DEFAULT_CHILD_PROFILE.avatar } });
    setSdgs(SDGS_DATA);
    setMissions(INITIAL_MISSIONS);
    setSubmissions([]);
    setBookPages([]);
    setCompletedQuizzes({});
    setParentChildren([]);
    setSelectedParentChild(null);
    setFamilyMissions([]);
    setParentBookOpen(false);
    setStudentInviteCode('');
    setTeacherData({ name: '', className: 'No class yet', classes: [], students: [], totalStudents: 0, completionRate: 0 });
    setParentDigest({ parentName: '', childName: 'Explorer' });
    setSummerData({ currentDay: 1, totalDays: 30, completedDays: [] });
    setSelectedSdg(null);
    setSelectedMission(null);
    setIsSubmittingMission(null);
    setShowCertificateGen(false);
    setActiveQuizLesson(null);
    setCelebrationData(null);
    setAppMessage('');
  };

  useEffect(() => {
    if (!supabase) {
      setAuthReady(true);
      return undefined;
    }
    let active = true;
    let handledToken = null;
    const restoreSession = async (currentSession, eventName) => {
      if (!active) return;
      if (eventName === 'PASSWORD_RECOVERY') {
        setPasswordRecovery(true);
        setAuthReady(true);
        return;
      }
      if (!currentSession) {
        handledToken = null;
        clearPrivateState();
        setAuthReady(true);
        return;
      }
      if (currentSession.access_token === handledToken) return;
      handledToken = currentSession.access_token;
      try {
        const profile = await apiJson('/api/auth/me', {}, currentSession);
        if (active) await applyProfile(profile);
      } catch {
        await supabase.auth.signOut();
        if (active) {
          clearPrivateState();
          setAppMessage('Your session has expired. Please sign in again.');
        }
      } finally {
        if (active) setAuthReady(true);
      }
    };
    const { data: { subscription } } = supabase.auth.onAuthStateChange((eventName, currentSession) => {
      window.setTimeout(() => restoreSession(currentSession, eventName), 0);
    });
    supabase.auth.getSession().then(({ data }) => restoreSession(data.session));
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLoginSuccess = (selectedRole, profileData) => {
    applyProfile({ ...profileData, role: selectedRole === 'child' ? 'student' : selectedRole }).catch(() => {
      setIsLoggedIn(false);
      setAppMessage('Your account could not be loaded. Please sign in again.');
    });
  };

  const handleSwitchUser = async () => {
    playClickSound();
    if (supabase) {
      try {
        await apiRequest('/api/auth/logout', { method: 'POST' });
      } catch {}
      await supabase.auth.signOut();
    }
    clearPrivateState();
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
  const handleQuizComplete = async (quizId, answers) => {
    const result = await apiJson('/api/student/quiz-attempts', {
      method: 'POST',
      body: JSON.stringify({ quizId, answers })
    });
    const profile = await apiJson('/api/profile');
    setChildProfile((current) => ({
      ...current,
      xp: profile.xp,
      level: profile.level,
      levelName: computeLevel(profile.xp).levelName
    }));
    setCompletedQuizzes((current) => ({
      ...current,
      [quizId]: { score: result.score, totalQ: result.total, completedAt: new Date().toISOString() }
    }));
    return result;
  };

  // Handler when evidence is submitted
  const handleSubmitComplete = async (payload) => {
    const form = new FormData();
    form.set('missionId', payload.missionId);
    form.set('caption', payload.caption || '');
    form.set('type', payload.type || 'photo');
    form.set('frame', payload.frame || 'water');
    form.set('stickers', JSON.stringify(payload.stickers || []));
    if (payload.file) {
      form.set('evidence', payload.file);
    } else if (payload.mediaDataUrl?.startsWith('data:image/')) {
      const image = await fetch(payload.mediaDataUrl).then((response) => response.blob());
      form.set('evidence', image, 'drawing.png');
    }
    const result = await apiJson('/api/submissions', { method: 'POST', body: form });
    setAppMessage(result.status === 'suspicious'
      ? 'Your evidence was flagged for human review. An image signal is not proof that evidence is inauthentic.'
      : 'Your evidence was submitted for review. XP and badges are awarded only after approval.');
    const pages = await apiJson('/api/student/book-pages');
    setBookPages(pages.map((page) => ({
      ...page,
      sdgId: page.sdg_number,
      sdgNumber: page.sdg_number,
      frame: page.frame_id,
      xpEarned: page.xp_earned,
      badgeName: page.badge_name,
      badgeIcon: page.badge_icon,
      stickers: page.stickers,
      author: childProfile.name
    })));
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
  const handleVerifySubmission = async (subId, status, comment) => {
    try {
      await apiJson(`/api/submissions/${subId}/review`, {
      method: 'POST',
      body: JSON.stringify({ status, comment })
      });
      setSubmissions(await apiJson('/api/submissions'));
      setTeacherData(await apiJson('/api/teacher'));
    } catch (error) {
      setAppMessage(error.message);
    }
  };

  // Teacher custom mission creator
  const handleCreateMission = async (newMission) => {
    try {
      const saved = await apiJson('/api/missions', {
      method: 'POST',
      body: JSON.stringify({
        title: newMission.title,
        description: newMission.challengeText,
        sdg_number: newMission.sdgNumber,
        xp_reward: newMission.xpReward,
        badge_name: newMission.badgeName,
        class_id: teacherData.classes?.[0]?.id
      })
      });
      setMissions((current) => [...current, saved]);
    } catch (error) {
      setAppMessage(error.message);
    }
  };

  // Summer day complete handler
  const handleCompleteSummerDay = async (dayNum) => {
    try {
      const updated = await apiJson(`/api/student/summer/${dayNum}/complete`, { method: 'POST' });
      setSummerData(updated);
    } catch (error) {
      setAppMessage(error.message);
    }
  };

  const handleCreateFamilyMission = async (mission) => {
    if (!selectedParentChild) return;
    try {
      const saved = await apiJson(`/api/parent/children/${selectedParentChild.id}/family-missions`, {
        method: 'POST',
        body: JSON.stringify(mission)
      });
      setFamilyMissions((current) => [saved, ...current]);
    } catch (error) {
      setAppMessage(error.message);
    }
  };

  const handleCompleteFamilyMission = async (missionId) => {
    try {
      const saved = await apiJson(`/api/parent/family-missions/${missionId}/complete`, { method: 'POST' });
      setFamilyMissions((current) => current.map((mission) => mission.id === missionId ? saved : mission));
    } catch (error) {
      setAppMessage(error.message);
    }
  };

  // If not logged in, render the Role Selection / Entry screen!
  if (!authReady) {
    return <div className="min-h-screen bg-living-planet flex items-center justify-center text-slate-700 font-bold">Checking secure session...</div>;
  }
  if (!isLoggedIn) {
    return <AuthScreen
      onLoginSuccess={handleLoginSuccess}
      passwordRecovery={passwordRecovery}
      onPasswordUpdated={() => {
        setPasswordRecovery(false);
        setIsLoggedIn(false);
      }}
    />;
  }

  return (
    <div className="min-h-screen bg-living-planet flex flex-col justify-between font-sans">
      {/* Top Header Role Switcher Bar */}
      <RoleSwitcher
        currentRole={role}
        onSwitchUser={handleSwitchUser}
        childProfile={childProfile}
        teacherData={teacherData}
        parentDigest={parentDigest}
        soundOn={soundOn}
        setSoundOn={setSoundOn}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {appMessage && <div role="status" className="max-w-5xl mx-auto mt-3 px-4"><p className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-bold text-emerald-900">{appMessage}<button className="float-right" onClick={() => setAppMessage('')} aria-label="Dismiss message">×</button></p></div>}
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
                  apiJson('/api/profile', { method: 'PATCH', body: JSON.stringify({ avatar: av }) }).catch((error) => setAppMessage(error.message));
                }}
              />
            )}

            {activeTab === 'profile' && studentInviteCode && (
              <div className="max-w-4xl mx-auto px-4 -mt-20 pb-24">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-950">
                  Parent link code: <code className="select-all">{studentInviteCode}</code>
                </div>
              </div>
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
          parentBookOpen ? (
            <BookView
              bookPages={bookPages}
              childName={childProfile.name}
              onBackToHome={() => setParentBookOpen(false)}
              onNavigateToMissions={() => setParentBookOpen(false)}
            />
          ) : (
            <ParentDashboard
              parentDigest={parentDigest}
              childProfile={childProfile}
              children={parentChildren}
              approvedSubmissions={submissions}
              familyMissions={familyMissions}
              onSelectChild={loadParentChild}
              onCreateFamilyMission={handleCreateFamilyMission}
              onCompleteFamilyMission={handleCompleteFamilyMission}
              onOpenBook={() => setParentBookOpen(true)}
            />
          )
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
