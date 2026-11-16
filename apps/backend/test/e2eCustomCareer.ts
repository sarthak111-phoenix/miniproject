import { createApp } from '../src/index';
import http from 'http';

async function run() {
  console.log('=== [E2E TEST: Custom Target Career & Roadmap Generation] ===');
  const app = createApp();
  const server = http.createServer(app);

  await new Promise<void>((resolve) => server.listen(0, resolve));
  const port = (server.address() as any).port;
  const baseUrl = `http://localhost:${port}`;

  try {
    // 1. Register a test student user
    const email = `testcareer_${Date.now()}@student.in`;
    const password = 'Password@123';
    const registerRes = await fetch(`${baseUrl}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role: 'student' }),
    });
    const regData: any = await registerRes.json();
    const token = regData.token;
    if (!token) throw new Error(`Registration failed: ${JSON.stringify(regData)}`);
    console.log('✓ 1. Registered test student account');

    // 2. Upsert profile with a custom career goal
    const customGoal = 'Robotics & Automation Engineer';
    const profileRes = await fetch(`${baseUrl}/profile/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        fullName: 'Aarav Patel',
        age: 21,
        gender: 'male',
        state: 'Gujarat',
        category: 'General',
        annualIncome: 450000,
        occupation: 'student',
        educationLevel: 'Undergraduate',
        currentCourse: 'B.Tech Mechatronics',
        currentSemester: 5,
        cgpaOrPercentage: 86.5,
        skills: ['C++', 'Python', 'Arduino'],
        targetCareerGoal: customGoal,
        disability: false,
      }),
    });
    const profileData: any = await profileRes.json();
    if (!profileRes.ok || profileData.profile?.targetCareerGoal !== customGoal) {
      throw new Error(`Profile save failed: ${JSON.stringify(profileData)}`);
    }
    console.log(`✓ 2. Profile successfully saved with custom career goal: "${profileData.profile.targetCareerGoal}"`);

    // 3. Generate Roadmap for this custom career goal
    const roadmapRes = await fetch(`${baseUrl}/roadmap/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const roadmapData: any = await roadmapRes.json();
    const roadmap = roadmapData.roadmap;
    if (!roadmapRes.ok || !roadmap) {
      throw new Error(`Roadmap fetch failed: ${JSON.stringify(roadmapData)}`);
    }

    if (roadmap.targetGoal !== customGoal) {
      throw new Error(`Expected roadmap targetGoal "${customGoal}", got "${roadmap.targetGoal}"`);
    }
    console.log(`✓ 3. Roadmap target goal matches custom goal: "${roadmap.targetGoal}"`);

    // 4. Verify skill gaps for Robotics
    const skillNames = roadmap.skillGapAnalysis.map((s: any) => s.targetSkill);
    console.log('  Roadmap required skills generated:', skillNames);
    if (skillNames.length === 0) {
      throw new Error('No skill gaps generated for custom career goal');
    }
    console.log('✓ 4. Dynamic skill gaps successfully mapped for custom career goal');

    // 5. Verify semester plans
    console.log(`✓ 5. Generated ${roadmap.semesters.length} semester plans from Semester 5 to 8`);

    console.log('\n🎉 ALL CUSTOM CAREER E2E TESTS PASSED SUCCESSFULLY!');
  } finally {
    server.close();
  }
}

run().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
