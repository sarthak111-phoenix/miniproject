import { createApp } from '../src/index';
import { db } from '../src/db/store';
import { clearRateLimitStore } from '../src/middleware/rateLimit.middleware';
import http from 'http';

console.log('=== [PHASE 5 TEST RUN: Document Readiness Assistant, Consent Logging & 90-Day Retention] ===');

let server: http.Server;
const port = 4995;
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
      body: { email: 'student.docs@example.com', password: 'Password@123', role: 'student' }
    });
    const token = authRes.data.token;

    // 2. Test Consent Enforcement (Attempt upload without explicit consent)
    const noConsentRes = await request('/documents/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: {
        fileName: 'my_aadhaar.pdf',
        fileSize: 1024 * 350,
        textSnippet: 'Government of India Unique Identification Authority Aadhaar',
        consentGiven: false // NO CONSENT
      }
    });

    if (noConsentRes.status === 400 && noConsentRes.data.message.includes('consent')) {
      console.log('  ✓ 1. Consent enforcement: Document upload rejected without explicit user consent');
    } else {
      console.error('❌ 1. Consent enforcement check failed:', noConsentRes);
      testsPassed = false;
    }

    // 3. Upload with Consent & Verify Classification + 90-Day Retention
    const aadhaarUploadRes = await request('/documents/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: {
        fileName: 'my_aadhaar_card.pdf',
        fileSize: 1024 * 350,
        textSnippet: 'Unique Identification Authority of India Aadhaar',
        consentGiven: true
      }
    });

    if (
      aadhaarUploadRes.status === 201 &&
      aadhaarUploadRes.data.document.documentType === 'Aadhaar Card' &&
      aadhaarUploadRes.data.document.consentLogged === true
    ) {
      const expiresAt = new Date(aadhaarUploadRes.data.document.expiresAt).getTime();
      const uploadedAt = new Date(aadhaarUploadRes.data.document.uploadedAt).getTime();
      const daysDiff = Math.round((expiresAt - uploadedAt) / (1000 * 60 * 60 * 24));

      if (daysDiff === 90) {
        console.log('  ✓ 2. Document classified as "Aadhaar Card" with verified 90-day concrete retention TTL');
      } else {
        console.error('❌ 2. Retention duration unexpected:', daysDiff);
        testsPassed = false;
      }
    } else {
      console.error('❌ 2. Document upload failed:', aadhaarUploadRes);
      testsPassed = false;
    }

    // 4. Upload Second Document (Income Certificate)
    const incomeUploadRes = await request('/documents/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: {
        fileName: 'tahsildar_income_cert.pdf',
        fileSize: 1024 * 420,
        textSnippet: 'Office of Tahsildar Family Income Certificate below 4 LPA',
        consentGiven: true
      }
    });

    if (incomeUploadRes.status === 201 && incomeUploadRes.data.document.documentType === 'Income Certificate') {
      console.log('  ✓ 3. Second document successfully classified as "Income Certificate"');
    } else {
      console.error('❌ 3. Income certificate upload failed:', incomeUploadRes);
      testsPassed = false;
    }

    // 5. Test Readiness Checklist Calculation against AICTE Pragati Scholarship
    const readinessRes = await request('/documents/readiness/scheme-aicte-pragati', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (readinessRes.status === 200 && readinessRes.data.report) {
      const rep = readinessRes.data.report;
      const matchedAadhaar = rep.matchedDocuments.some((m: any) => m.documentType === 'Aadhaar Card');
      const matchedIncome = rep.matchedDocuments.some((m: any) => m.documentType === 'Income Certificate');
      const hasMissingWithInstructions = rep.missingDocuments.every((m: any) => m.howToObtain.length > 5);

      if (matchedAadhaar && matchedIncome && rep.readinessPercentage > 0 && hasMissingWithInstructions) {
        console.log(`  ✓ 4. Readiness calculation: ${rep.readinessPercentage}% ready, matched verified documents, and provided actionable instructions for missing certificates`);
      } else {
        console.error('❌ 4. Readiness report data mismatch:', rep);
        testsPassed = false;
      }
    } else {
      console.error('❌ 4. Readiness endpoint failed:', readinessRes);
      testsPassed = false;
    }

    // 6. Test Document Upload Rate Limiting (10 requests / hour limit per Security.md)
    console.log('  Testing Document Upload Rate Limiter (10 req / hour)...');
    let hitDocLimit = false;
    for (let i = 1; i <= 10; i++) {
      const res = await request('/documents/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: {
          fileName: `file_${i}.pdf`,
          fileSize: 1024 * 100,
          consentGiven: true
        }
      });
      if (res.status === 429) {
        hitDocLimit = true;
        console.log(`  ✓ 5. Document rate limit triggered on request #${i + 2} with 429 and Retry-After: ${res.headers.get('retry-after')}s`);
        break;
      }
    }
    if (!hitDocLimit) {
      console.error('❌ 5. Document rate limiting failed to trigger!');
      testsPassed = false;
    }

  } finally {
    server.close();
  }

  if (testsPassed) {
    console.log('\n🎉 ALL PHASE 5 DOCUMENT READINESS TESTS PASSED!\n');
    process.exit(0);
  } else {
    console.error('\n❌ SOME PHASE 5 TESTS FAILED.\n');
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Unhandled test failure:', err);
  process.exit(1);
});
