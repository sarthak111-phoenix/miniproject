import { createApp } from '../src/index';
import { db } from '../src/db/store';
import { clearRateLimitStore } from '../src/middleware/rateLimit.middleware';
import http from 'http';

console.log('=== [PHASE 6 TEST RUN: Notifications, Deadline Alerts & Batched Digest Engine] ===');

let server: http.Server;
const port = 4994;
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
      body: { email: 'student.notif@example.com', password: 'Password@123', role: 'student' }
    });
    const token = authRes.data.token;

    await request('/profile/me', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: {
        fullName: 'Kavita Nair',
        age: 19,
        gender: 'female',
        state: 'Maharashtra',
        category: 'General',
        annualIncome: 300000,
        occupation: 'student',
        educationLevel: 'Undergraduate',
        currentCourse: 'B.Tech CSE',
        currentSemester: 3,
        cgpaOrPercentage: 88.0,
        skills: ['Python', 'Django'],
        targetCareerGoal: 'Backend Architect',
        disability: false
      }
    });

    // 2. Sync upcoming deadlines
    const syncRes = await request('/notifications/sync-deadlines', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });

    if (syncRes.status === 200 && syncRes.data.created.length > 0) {
      console.log(`  ✓ 1. Deadline synchronization active: Generated ${syncRes.data.created.length} deadline alerts for eligible scholarships`);
    } else {
      console.error('❌ 1. Deadline synchronization failed:', syncRes);
      testsPassed = false;
    }

    // 3. Fetch notifications and check unread count
    const listRes = await request('/notifications/me', {
      headers: { Authorization: `Bearer ${token}` }
    });

    let targetNotifId = '';
    if (listRes.status === 200 && listRes.data.unreadCount > 0) {
      targetNotifId = listRes.data.notifications[0].id;
      console.log(`  ✓ 2. Notification inbox retrieved (${listRes.data.unreadCount} unread items)`);
    } else {
      console.error('❌ 2. Notification listing failed:', listRes);
      testsPassed = false;
    }

    // 4. Mark notification as read
    const markReadRes = await request(`/notifications/${targetNotifId}/read`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` }
    });

    const updatedListRes = await request('/notifications/me', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (markReadRes.status === 200 && updatedListRes.data.unreadCount === listRes.data.unreadCount - 1) {
      console.log(`  ✓ 3. Notification marked as read; unread count decremented accurately`);
    } else {
      console.error('❌ 3. Mark read state failed:', { markReadRes, updatedListRes });
      testsPassed = false;
    }

    // 5. Generate Batched Digest to prevent alert fatigue
    const digestRes = await request('/notifications/digest', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });

    if (digestRes.status === 200 && digestRes.data.digest.type === 'digest') {
      console.log('  ✓ 4. Batched digest successfully consolidated pending alerts into weekly summary');
    } else {
      console.error('❌ 4. Digest generation failed:', digestRes);
      testsPassed = false;
    }

    // 6. Test Notification Rate Limiter (60 requests / min limit per Security.md)
    console.log('  Testing Notification Rate Limiter (60 req / min)...');
    let hitNotifLimit = false;
    for (let i = 1; i <= 65; i++) {
      const res = await request('/notifications/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 429) {
        hitNotifLimit = true;
        console.log(`  ✓ 5. Notification rate limiter triggered on request #${i} with 429 and Retry-After: ${res.headers.get('retry-after')}s`);
        break;
      }
    }
    if (!hitNotifLimit) {
      console.error('❌ 5. Notification rate limiting failed to trigger!');
      testsPassed = false;
    }

  } finally {
    server.close();
  }

  if (testsPassed) {
    console.log('\n🎉 ALL PHASE 6 NOTIFICATION & DEADLINE TESTS PASSED!\n');
    process.exit(0);
  } else {
    console.error('\n❌ SOME PHASE 6 TESTS FAILED.\n');
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Unhandled test failure:', err);
  process.exit(1);
});
