import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SDGS_DATA, INITIAL_MISSIONS, INITIAL_BOOK_PAGES, BADGES } from '../../src/utils/constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'db.json');

const DEFAULT_STATE = {
  childProfile: {
    name: 'Leo',
    age: 9,
    school: 'Greenwood Elementary',
    class: 'Class 5A',
    xp: 210,
    level: 2,
    levelName: 'Earth Friend',
    streak: 4,
    unlockedBadges: ['water_saver', 'nature_protector', 'waste_warrior'],
    avatar: {
      skin: '#FFD1A4',
      hair: '#8D5B4C',
      style: 'Short Curly',
      outfit: 'Water Guardian Hoodie',
      accessory: 'Eco Backpack 🎒'
    }
  },
  sdgs: SDGS_DATA,
  missions: INITIAL_MISSIONS,
  submissions: [
    {
      id: 'sub_101',
      missionId: 'm_water_1',
      childName: 'Leo',
      type: 'photo',
      mediaUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=600&q=80',
      caption: 'I turned off the tap while brushing my teeth for 3 days and saved 30 gallons of water!',
      frame: 'water',
      stickers: ['💧', '🐟'],
      status: 'approved',
      submittedAt: '2026-09-21T10:00:00Z',
      teacherComment: 'Outstanding work, Leo! You are a true Water Saver! 💧✨'
    },
    {
      id: 'sub_102',
      missionId: 'm_land_1',
      childName: 'Leo',
      type: 'drawing',
      mediaUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80',
      caption: 'My sunflower seed pushed open the soil today! I named him Sunny.',
      frame: 'forest',
      stickers: ['🌱', '🦋'],
      status: 'approved',
      submittedAt: '2026-09-22T14:30:00Z',
      teacherComment: 'Beautiful seedling drawing! Keep watering Sunny! 🌻'
    },
    {
      id: 'sub_103',
      missionId: 'm_consumption_1',
      childName: 'Maya',
      type: 'photo',
      mediaUrl: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=600&q=80',
      caption: 'Sorted 5 plastic bottles and cereal boxes into our blue bin!',
      frame: 'earth',
      stickers: ['♻️', '🌍'],
      status: 'pending',
      submittedAt: '2026-09-23T11:15:00Z',
      teacherComment: ''
    }
  ],
  bookPages: INITIAL_BOOK_PAGES,
  teacher: {
    name: 'Ms. Clara Vance',
    className: 'Class 5A',
    totalStudents: 32,
    completionRate: 84,
    students: [
      { id: 's1', name: 'Leo', xp: 210, level: 2, completedMissions: 3, bookPages: 3, avatarIcon: '👦' },
      { id: 's2', name: 'Maya', xp: 180, level: 2, completedMissions: 2, bookPages: 2, avatarIcon: '👧' },
      { id: 's3', name: 'Sam', xp: 340, level: 3, completedMissions: 5, bookPages: 5, avatarIcon: '🧑' },
      { id: 's4', name: 'Zoe', xp: 120, level: 2, completedMissions: 2, bookPages: 2, avatarIcon: '👧' },
      { id: 's5', name: 'Ethan', xp: 450, level: 3, completedMissions: 6, bookPages: 6, avatarIcon: '👦' }
    ]
  },
  parentDigest: {
    childName: 'Leo',
    weekMissionsCompleted: 3,
    breakdown: { water: 1, nature: 1, recycling: 1, health: 0 },
    upcomingActivities: ['Rainwater collector setup', 'Weekend tree planting in central park']
  },
  summerAdventure: {
    currentDay: 12,
    totalDays: 30,
    completedDays: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  }
};

class MockDatabase {
  constructor() {
    this.data = this.loadData();
  }

  loadData() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('Could not read db.json, initializing default state', err);
    }
    return DEFAULT_STATE;
  }

  saveData() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write db.json', err);
    }
  }

  getChildProfile() {
    return this.data.childProfile;
  }

  updateChildProfile(updates) {
    this.data.childProfile = { ...this.data.childProfile, ...updates };
    this.saveData();
    return this.data.childProfile;
  }

  getSdgs() {
    return this.data.sdgs;
  }

  getMissions() {
    return this.data.missions;
  }

  addMission(mission) {
    this.data.missions.push(mission);
    this.saveData();
    return mission;
  }

  getSubmissions() {
    return this.data.submissions;
  }

  addSubmission(submission) {
    this.data.submissions.unshift(submission);
    this.saveData();
    return submission;
  }

  verifySubmission(submissionId, status, teacherComment = '') {
    const sub = this.data.submissions.find(s => s.id === submissionId);
    if (!sub) return null;

    sub.status = status;
    sub.teacherComment = teacherComment;

    if (status === 'approved') {
      const mission = this.data.missions.find(m => m.id === sub.missionId);
      if (mission) {
        // Award XP
        const xpEarned = mission.xpReward || 50;
        this.data.childProfile.xp += xpEarned;
        
        // Recalculate level
        if (this.data.childProfile.xp >= 1000) {
          this.data.childProfile.level = 5;
          this.data.childProfile.levelName = 'SDG Champion';
        } else if (this.data.childProfile.xp >= 600) {
          this.data.childProfile.level = 4;
          this.data.childProfile.levelName = 'Community Hero';
        } else if (this.data.childProfile.xp >= 300) {
          this.data.childProfile.level = 3;
          this.data.childProfile.levelName = 'Change Maker';
        } else if (this.data.childProfile.xp >= 100) {
          this.data.childProfile.level = 2;
          this.data.childProfile.levelName = 'Earth Friend';
        }

        // Unlock badge if mission has one
        if (mission.badgeId && !this.data.childProfile.unlockedBadges.includes(mission.badgeId)) {
          this.data.childProfile.unlockedBadges.push(mission.badgeId);
        }

        // Generate Book Page automatically!
        const existingPage = this.data.bookPages.find(p => p.id === `page_${sub.id}`);
        if (!existingPage) {
          const newPage = {
            id: `page_${sub.id}`,
            sdgId: mission.sdgId,
            sdgNumber: mission.sdgNumber,
            title: mission.title,
            date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            caption: sub.caption || sub.textResponse || 'Mission completed with excellence!',
            type: sub.type,
            mediaUrl: sub.mediaUrl || sub.drawingDataUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=600&q=80',
            frame: sub.frame || 'water',
            stickers: sub.stickers || ['💧', '⭐'],
            xpEarned: xpEarned,
            badgeName: mission.badgeName || 'SDG Achiever',
            badgeIcon: mission.badgeIcon || '⭐',
            author: sub.childName || 'Leo'
          };
          this.data.bookPages.push(newPage);
        }
      }
    }

    this.saveData();
    return { submission: sub, childProfile: this.data.childProfile, bookPages: this.data.bookPages };
  }

  getBookPages() {
    return this.data.bookPages;
  }

  getTeacherData() {
    return this.data.teacher;
  }

  getParentDigest() {
    return this.data.parentDigest;
  }

  getSummerAdventure() {
    return this.data.summerAdventure;
  }

  completeSummerDay(dayNumber) {
    if (!this.data.summerAdventure.completedDays.includes(dayNumber)) {
      this.data.summerAdventure.completedDays.push(dayNumber);
      this.data.childProfile.xp += 20; // 20 XP bonus per summer day
      this.saveData();
    }
    return this.data.summerAdventure;
  }
}

export const db = new MockDatabase();
