import express from 'express';
import cors from 'cors';
import { db } from './data/mockDb.js';

const app = express();
const PORT = Number(process.env.PORT) || 3002;

app.use(cors());
app.use(express.json({ limit: '15mb' })); // Support base64 drawings & photo uploads

// 1. Child Profile & Gamification Stats
app.get('/api/profile', (req, res) => {
  res.json(db.getChildProfile());
});

app.post('/api/profile', (req, res) => {
  const updated = db.updateChildProfile(req.body);
  res.json(updated);
});

// 2. SDGs List & Metadata
app.get('/api/sdgs', (req, res) => {
  res.json(db.getSdgs());
});

// 3. Missions Endpoints
app.get('/api/missions', (req, res) => {
  res.json(db.getMissions());
});

app.post('/api/missions', (req, res) => {
  const { title, sdgId, sdgNumber, challengeText, bonusText, xpReward, badgeName, badgeIcon, submissionTypes } = req.body;
  const newMission = {
    id: `m_custom_${Date.now()}`,
    sdgId: Number(sdgId) || 13,
    sdgNumber: Number(sdgNumber) || 13,
    title: title || 'New Eco Challenge 🌿',
    challengeText: challengeText || 'Take positive action for your community!',
    bonusText: bonusText || 'Share what you learned with a family member.',
    xpReward: Number(xpReward) || 50,
    badgeId: `badge_${Date.now()}`,
    badgeName: badgeName || 'Community Champion',
    badgeIcon: badgeIcon || '⭐',
    submissionTypes: submissionTypes || ['photo', 'text', 'drawing'],
    checklistItems: ['Accepted Challenge 🎯', 'Completed Action 🌿', 'Reflected & Shared 💬'],
    status: 'available'
  };
  const saved = db.addMission(newMission);
  res.status(201).json(saved);
});

// 4. Submissions & Verification Pipeline
app.get('/api/submissions', (req, res) => {
  res.json(db.getSubmissions());
});

app.post('/api/submissions', (req, res) => {
  const { missionId, childName, type, mediaUrl, drawingDataUrl, caption, frame, stickers, textResponse } = req.body;
  
  const newSubmission = {
    id: `sub_${Date.now()}`,
    missionId: missionId || 'm_water_1',
    childName: childName || 'Leo',
    type: type || 'photo',
    mediaUrl: mediaUrl || drawingDataUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=600&q=80',
    caption: caption || textResponse || 'Completed my SDG mission!',
    frame: frame || 'water',
    stickers: stickers || ['💧', '⭐'],
    status: 'pending',
    submittedAt: new Date().toISOString(),
    teacherComment: ''
  };

  const saved = db.addSubmission(newSubmission);

  // Auto-approve in demo mode if requested
  if (req.query.autoApprove === 'true') {
    const verification = db.verifySubmission(saved.id, 'approved', 'Fantastic job! Verified automatically in demo mode! ✨');
    return res.status(201).json(verification);
  }

  res.status(201).json({ submission: saved });
});

app.post('/api/submissions/:id/verify', (req, res) => {
  const { id } = req.params;
  const { status, teacherComment } = req.body; // status: 'approved' | 'rejected'
  
  const result = db.verifySubmission(id, status || 'approved', teacherComment || 'Great work on saving our planet!');
  if (!result) {
    return res.status(404).json({ error: 'Submission not found' });
  }
  res.json(result);
});

// 5. My SDG Book Pages Endpoint
app.get('/api/book-pages', (req, res) => {
  res.json(db.getBookPages());
});

// 6. Teacher Dashboard Endpoint
app.get('/api/teacher', (req, res) => {
  res.json(db.getTeacherData());
});

// 7. Parent Dashboard Digest Endpoint
app.get('/api/parent', (req, res) => {
  res.json(db.getParentDigest());
});

// 8. Summer Vacation Adventure Endpoint
app.get('/api/summer', (req, res) => {
  res.json(db.getSummerAdventure());
});

app.post('/api/summer/complete', (req, res) => {
  const { day } = req.body;
  const updated = db.completeSummerDay(Number(day));
  res.json(updated);
});

app.listen(PORT, () => {
  console.log(`\n🚀 SDG Quest API Server listening on http://localhost:${PORT}`);
});
