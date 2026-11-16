import { createApp } from '../src/index';
import { db } from '../src/db/store';
import { clearRateLimitStore } from '../src/middleware/rateLimit.middleware';
import http from 'http';

console.log('=== [PHASE 1 TEST RUN: Core Auth, Rate Limiting & Profile Lifecycle] ===');

let server: http.Server;
let port = 4999;
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
    // Test 1: Health check
    const health = await request('/health');
    if (health.status === 200 && health.data.status === 'ok') {
      console.log('  ✓ 1. Backend server healthy and responding');
    } else {
      console.error('❌ 1. Health check failed:', health);
      testsPassed = false;
    }

    // Test 2: User Signup
    const testEmail = 'priya.sharma@example.com';
    const testPassword = 'Password@123';
    const signupRes = await request('/auth/signup', {
      method: 'POST',
      body: {
        email: testEmail,
        password: testPassword,
        role: 'student'
      }
    });

    if (signupRes.status === 201 && signupRes.data.token && signupRes.data.user.email === testEmail) {
      console.log('  ✓ 2. User registration succeeded with JWT token');
    } else {
      console.error('❌ 2. Signup failed:', signupRes);
      testsPassed = false;
    }

    // Test 3: Duplicate signup rejection
    const dupRes = await request('/auth/signup', {
      method: 'POST',
      body: {
        email: testEmail,
        password: testPassword
      }
    });
    if (dupRes.status === 409) {
      console.log('  ✓ 3. Duplicate email registration rejected with 409 Conflict');
    } else {
      console.error('❌ 3. Duplicate signup check failed:', dupRes);
      testsPassed = false;
    }

    // Test 4: Successful Login
    const loginRes = await request('/auth/login', {
      method: 'POST',
      body: {
        email: testEmail,
        password: testPassword
      }
    });
    let authToken = '';
    if (loginRes.status === 200 && loginRes.data.token) {
      authToken = loginRes.data.token;
      console.log('  ✓ 4. User login succeeded and token issued');
    } else {
      console.error('❌ 4. Login failed:', loginRes);
      testsPassed = false;
    }

    // Test 5: Invalid Password rejection
    const badLoginRes = await request('/auth/login', {
      method: 'POST',
      body: {
        email: testEmail,
        password: 'WrongPassword'
      }
    });
    if (badLoginRes.status === 401) {
      console.log('  ✓ 5. Invalid credentials rejected with 401');
    } else {
      console.error('❌ 5. Invalid password rejection failed:', badLoginRes);
      testsPassed = false;
    }

    // Test 6: Unauthorized Profile Access
    const unauthProfileRes = await request('/profile/me');
    if (unauthProfileRes.status === 401) {
      console.log('  ✓ 6. Unauthenticated profile access rejected with 401');
    } else {
      console.error('❌ 6. Unauthenticated access check failed:', unauthProfileRes);
      testsPassed = false;
    }

    // Test 7: Profile Builder - Upsert Profile with student details
    const profilePayload = {
      fullName: 'Priya Sharma',
      age: 20,
      gender: 'female',
      state: 'Maharashtra',
      category: 'OBC',
      annualIncome: 350000,
      occupation: 'student',
      educationLevel: 'Undergraduate',
      currentCourse: 'B.Tech Information Technology',
      currentSemester: 4,
      cgpaOrPercentage: 84.5,
      skills: ['Python', 'JavaScript', 'SQL', 'Data Structures'],
      targetCareerGoal: 'Full Stack Engineer',
      disability: false
    };

    const updateProfileRes = await request('/profile/me', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${authToken}` },
      body: profilePayload
    });

    if (updateProfileRes.status === 200 && updateProfileRes.data.profile.fullName === 'Priya Sharma') {
      console.log('  ✓ 7. Profile builder created student profile successfully');
    } else {
      console.error('❌ 7. Profile update failed:', updateProfileRes);
      testsPassed = false;
    }

    // Test 8: Fetch profile and verify persistence
    const fetchProfileRes = await request('/profile/me', {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (fetchProfileRes.status === 200 && fetchProfileRes.data.profile.currentCourse === 'B.Tech Information Technology') {
      console.log('  ✓ 8. Profile fetched and persisted accurately across requests');
    } else {
      console.error('❌ 8. Profile fetch failed:', fetchProfileRes);
      testsPassed = false;
    }

    // Test 9: Rate limiting on Auth routes (Max 5 requests in 5 minutes)
    clearRateLimitStore();
    console.log('  Testing Auth Route Group Rate Limiter (5 requests / 5 min limit)...');
    let hitRateLimit = false;
    for (let i = 1; i <= 6; i++) {
      const res = await request('/auth/login', {
        method: 'POST',
        body: { email: 'rate.limit@test.com', password: 'AnyPassword' }
      });
      if (res.status === 429) {
        hitRateLimit = true;
        console.log(`  ✓ 9. Request #${i} triggered 429 Too Many Requests with Retry-After header: ${res.headers.get('retry-after')}s`);
        break;
      }
    }
    if (!hitRateLimit) {
      console.error('❌ 9. Rate limiting did not trigger on 6th request!');
      testsPassed = false;
    }

    // Test 10: Suspicious Activity Flagging
    clearRateLimitStore(); // Reset rate limiter after test 9
    const disposableSignup = await request('/auth/signup', {
      method: 'POST',
      body: {
        email: 'spammer@tempmail.com',
        password: 'Password123'
      }
    });
    const flagsRes = await request('/admin/flags');
    const hasDisposableFlag = flagsRes.data.flags?.some((f: any) => f.details.includes('tempmail.com'));
    if (hasDisposableFlag) {
      console.log('  ✓ 10. Suspicious activity detector flagged disposable email in ActivityFlag queue');
    } else {
      console.error('❌ 10. Activity flag test failed:', flagsRes.data);
      testsPassed = false;
    }

  } finally {
    server.close();
  }

  if (testsPassed) {
    console.log('\n🎉 ALL PHASE 1 CORE AUTH & PROFILE TESTS PASSED!\n');
    process.exit(0);
  } else {
    console.error('\n❌ SOME PHASE 1 TESTS FAILED.\n');
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Unhandled test failure:', err);
  process.exit(1);
});
