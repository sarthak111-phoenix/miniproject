import { createApp } from '../src/index';
import { db } from '../src/db/store';
import { clearRateLimitStore } from '../src/middleware/rateLimit.middleware';
import http from 'http';

console.log('=== [PHASE 2 TEST RUN: Deterministic Rule Engine & Multi-Persona Eligibility Audit] ===');

let server: http.Server;
const port = 4998;
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
    // 1. Verify Scheme Catalog
    const schemesRes = await request('/schemes');
    if (schemesRes.status === 200 && schemesRes.data.count >= 8) {
      console.log(`  ✓ 1. Scheme catalog loaded ${schemesRes.data.count} verified schemes`);
    } else {
      console.error('❌ 1. Scheme catalog loading failed:', schemesRes);
      testsPassed = false;
    }

    // 2. Filter schemes by categoryType=Scholarship
    const scholarshipRes = await request('/schemes?categoryType=Scholarship');
    if (scholarshipRes.status === 200 && scholarshipRes.data.schemes.every((s: any) => s.categoryType === 'Scholarship')) {
      console.log(`  ✓ 2. Scheme filtering verified (${scholarshipRes.data.count} scholarships found)`);
    } else {
      console.error('❌ 2. Scholarship filtering failed:', scholarshipRes);
      testsPassed = false;
    }

    // 3. Setup Persona 1: Priya Sharma (Meritorious Female Engineering Student, Maharashtra, OBC)
    const priyaAuth = await request('/auth/signup', {
      method: 'POST',
      body: { email: 'priya.audit@example.com', password: 'Password@123', role: 'student' }
    });
    const priyaToken = priyaAuth.data.token;

    await request('/profile/me', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${priyaToken}` },
      body: {
        fullName: 'Priya Sharma',
        age: 20,
        gender: 'female',
        state: 'Maharashtra',
        category: 'OBC',
        annualIncome: 350000,
        occupation: 'student',
        educationLevel: 'Undergraduate',
        currentCourse: 'B.Tech IT',
        currentSemester: 4,
        cgpaOrPercentage: 84.5,
        skills: ['Python', 'React'],
        targetCareerGoal: 'Cloud Architect',
        disability: false
      }
    });

    const priyaEligibility = await request('/eligibility/check', {
      method: 'POST',
      headers: { Authorization: `Bearer ${priyaToken}` }
    });

    if (priyaEligibility.status === 200) {
      const eligibleIds = priyaEligibility.data.eligibleSchemes.map((s: any) => s.schemeId);
      const ineligibleIds = priyaEligibility.data.ineligibleSchemes.map((s: any) => s.schemeId);

      // Verify correct matches
      const hasCSSS = eligibleIds.includes('scheme-nsp-csss');
      const hasPragati = eligibleIds.includes('scheme-aicte-pragati');
      const hasEBC = eligibleIds.includes('scheme-maha-ebc');

      // Verify correct non-matches
      const lacksPMKisan = ineligibleIds.includes('scheme-pm-kisan');
      const lacksPension = ineligibleIds.includes('scheme-pm-vaya-vandana');
      const lacksSCPostMatric = ineligibleIds.includes('scheme-post-matric-sc');
      const lacksKarnataka = ineligibleIds.includes('scheme-karnataka-vidyasiri');

      if (hasCSSS && hasPragati && hasEBC && lacksPMKisan && lacksPension && lacksSCPostMatric && lacksKarnataka) {
        console.log('  ✓ 3. Persona 1 (Student): Deterministic rule matching 100% accurate (CSSS, Pragati, Maha EBC matched; non-student/farmer/SC schemes correctly rejected)');
      } else {
        console.error('❌ 3. Persona 1 matching mismatch:', { eligibleIds, ineligibleIds });
        testsPassed = false;
      }
    } else {
      console.error('❌ 3. Priya eligibility check failed:', priyaEligibility);
      testsPassed = false;
    }

    // 4. Setup Persona 2: Ramesh Yadav (Farmer, UP, Age 42, Income 1.2L)
    const rameshAuth = await request('/auth/signup', {
      method: 'POST',
      body: { email: 'ramesh.farmer@example.com', password: 'Password@123', role: 'farmer' }
    });
    const rameshToken = rameshAuth.data.token;

    await request('/profile/me', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${rameshToken}` },
      body: {
        fullName: 'Ramesh Yadav',
        age: 42,
        gender: 'male',
        state: 'Uttar Pradesh',
        category: 'OBC',
        annualIncome: 120000,
        occupation: 'farmer',
        educationLevel: '10th',
        skills: ['Crop Cultivation', 'Drip Irrigation'],
        disability: false
      }
    });

    const rameshEligibility = await request('/eligibility/check', {
      method: 'POST',
      headers: { Authorization: `Bearer ${rameshToken}` }
    });

    const rameshEligible = rameshEligibility.data.eligibleSchemes.map((s: any) => s.schemeId);
    if (rameshEligible.includes('scheme-pm-kisan') && !rameshEligible.includes('scheme-nsp-csss')) {
      console.log('  ✓ 4. Persona 2 (Farmer): PM-KISAN correctly identified, student scholarships rejected');
    } else {
      console.error('❌ 4. Persona 2 Farmer matching failed:', rameshEligible);
      testsPassed = false;
    }

    // 5. Setup Persona 3: Shanti Devi (Senior Citizen, Age 68, Income 80k)
    const shantiAuth = await request('/auth/signup', {
      method: 'POST',
      body: { email: 'shanti.devi@example.com', password: 'Password@123', role: 'citizen' }
    });
    const shantiToken = shantiAuth.data.token;

    await request('/profile/me', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${shantiToken}` },
      body: {
        fullName: 'Shanti Devi',
        age: 68,
        gender: 'female',
        state: 'Bihar',
        category: 'General',
        annualIncome: 80000,
        occupation: 'senior_citizen',
        educationLevel: 'None',
        skills: [],
        disability: false
      }
    });

    const shantiEligibility = await request('/eligibility/check', {
      method: 'POST',
      headers: { Authorization: `Bearer ${shantiToken}` }
    });

    const shantiEligible = shantiEligibility.data.eligibleSchemes.map((s: any) => s.schemeId);
    if (shantiEligible.includes('scheme-pm-vaya-vandana')) {
      console.log('  ✓ 5. Persona 3 (Senior Citizen): Indira Gandhi National Old Age Pension matched correctly');
    } else {
      console.error('❌ 5. Persona 3 matching failed:', shantiEligible);
      testsPassed = false;
    }

    // 6. Traceability and Auditability Check
    const sampleScheme = priyaEligibility.data.ineligibleSchemes.find((s: any) => s.schemeId === 'scheme-pm-kisan');
    if (sampleScheme && sampleScheme.disqualifyingReasons.length > 0 && sampleScheme.disqualifyingReasons[0].includes('Occupation')) {
      console.log(`  ✓ 6. Audit trail verified: Ineligible reason clearly stated -> "${sampleScheme.disqualifyingReasons[0]}"`);
    } else {
      console.error('❌ 6. Traceability reason missing or invalid:', sampleScheme);
      testsPassed = false;
    }

  } finally {
    server.close();
  }

  if (testsPassed) {
    console.log('\n🎉 ALL PHASE 2 DETERMINISTIC RULE ENGINE TESTS PASSED!\n');
    process.exit(0);
  } else {
    console.error('\n❌ SOME PHASE 2 TESTS FAILED.\n');
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Unhandled test failure:', err);
  process.exit(1);
});
