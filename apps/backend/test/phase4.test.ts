import { createApp } from '../src/index';
import { db } from '../src/db/store';
import { clearRateLimitStore } from '../src/middleware/rateLimit.middleware';
import http from 'http';

console.log('=== [PHASE 4 TEST RUN: Student Roadmap Engine, Skill-Gap Analysis & Milestone Tracking] ===');

let server: http.Server;
const port = 4996;
const baseUrl = `http://localhost:${port}`;

async function request(path: string, options: { method?: string; body?: any; headers?: Record<string, string> } = {}) {
  const url = `${baseUrl}${path}`;
  const response = await fetch(url, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  const data = await response.json().catch(() => ({}));
  return { status: response.status, headers: response.headers, data };
}

async function runTests() {
  await db.clearAll();
  clearRateLimitStore();
  const app = createApp();
  await new Promise<void>((resolve) => {
    server = app.listen(port, () => resolve());
  });

  let testsPassed = true;

  try {
    // 1. Setup Student User
    const authRes = await request('/auth/signup', {
      method: 'POST',
      body: { email: 'student.roadmap@example.com', password: 'Password@123', role: 'student' }
    });
    const token = authRes.data.token;

    await request('/profile/me', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: {
        fullName: 'Rahul Verma',
        age: 20,
        gender: 'male',
        state: 'Karnataka',
        category: 'General',
        annualIncome: 500000,
        occupation: 'student',
        educationLevel: 'Undergraduate',
        currentCourse: 'B.Tech Computer Science',
        currentSemester: 4,
        cgpaOrPercentage: 82.0,
        skills: ['JavaScript', 'React'],
        targetCareerGoal: 'Full Stack Engineer',
        disability: false
      }
    });

    // 2. Generate Roadmap
    const roadmapRes = await request('/roadmap/me', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (roadmapRes.status === 200 && roadmapRes.data.roadmap) {
      const r = roadmapRes.data.roadmap;
      const semNumbers = r.semesters.map((s: any) => s.semesterNumber);
      const hasCorrectSemesters = semNumbers.includes(4) && semNumbers.includes(8);
      const hasSkillGaps = r.skillGapAnalysis.length > 0;

      if (hasCorrectSemesters && hasSkillGaps) {
        console.log(`  ✓ 1. Roadmap generated from Semester 4 to 8 with ${r.semesters.length} semester plans`);
      } else {
        console.error('❌ 1. Roadmap semester range invalid:', semNumbers);
        testsPassed = false;
      }
    } else {
      console.error('❌ 1. Roadmap generation failed:', roadmapRes);
      testsPassed = false;
    }

    // 3. Verify Skill-Gap Analysis identifies missing vs existing skills
    const roadmapData = roadmapRes.data.roadmap;
    const reactGap = roadmapData.skillGapAnalysis.find((g: any) => g.targetSkill.toLowerCase().includes('react'));
    const nodeGap = roadmapData.skillGapAnalysis.find((g: any) => g.targetSkill.toLowerCase().includes('node'));

    if (reactGap?.currentProficiency === 'intermediate' && nodeGap?.currentProficiency === 'missing') {
      console.log('  ✓ 2. Skill gap engine accurately differentiated mastered skill (React) from missing skill (Node.js)');
    } else {
      console.error('❌ 2. Skill gap identification failed:', { reactGap, nodeGap });
      testsPassed = false;
    }

    // 4. Update Milestone Status to 'completed'
    const targetMilestone = roadmapData.semesters[0].milestones[0];
    const updateRes = await request(`/roadmap/milestones/${targetMilestone.id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: { status: 'completed' }
    });

    if (updateRes.status === 200 && updateRes.data.roadmap.overallProgressPercentage > 0) {
      console.log(`  ✓ 3. Milestone '${targetMilestone.id}' marked completed; Progress updated to ${updateRes.data.roadmap.overallProgressPercentage}%`);
    } else {
      console.error('❌ 3. Milestone update failed:', updateRes);
      testsPassed = false;
    }

    // 5. Incremental Update: Student learns Node.js and updates profile
    await request('/profile/me', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: {
        fullName: 'Rahul Verma',
        age: 20,
        gender: 'male',
        state: 'Karnataka',
        category: 'General',
        annualIncome: 500000,
        occupation: 'student',
        educationLevel: 'Undergraduate',
        currentCourse: 'B.Tech Computer Science',
        currentSemester: 4,
        cgpaOrPercentage: 82.0,
        skills: ['JavaScript', 'React', 'Node.js'], // Added Node.js!
        targetCareerGoal: 'Full Stack Engineer',
        disability: false
      }
    });

    const syncedRoadmapRes = await request('/roadmap/me', {
      headers: { Authorization: `Bearer ${token}` }
    });

    const syncedRoadmap = syncedRoadmapRes.data.roadmap;
    const updatedNodeGap = syncedRoadmap.skillGapAnalysis.find((g: any) => g.targetSkill.toLowerCase().includes('node'));
    const milestoneStillCompleted = syncedRoadmap.semesters[0].milestones[0].status === 'completed';

    if (updatedNodeGap?.currentProficiency === 'intermediate' && milestoneStillCompleted) {
      console.log('  ✓ 4. Incremental reaction confirmed: Node.js transitioned to intermediate while preserved completed milestones intact');
    } else {
      console.error('❌ 4. Incremental reaction test failed:', { updatedNodeGap, milestoneStillCompleted });
      testsPassed = false;
    }

  } finally {
    server.close();
  }

  if (testsPassed) {
    console.log('\n🎉 ALL PHASE 4 STUDENT ROADMAP ENGINE TESTS PASSED!\n');
    process.exit(0);
  } else {
    console.error('\n❌ SOME PHASE 4 TESTS FAILED.\n');
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Unhandled test failure:', err);
  process.exit(1);
});
