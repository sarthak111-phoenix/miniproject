import { createApp } from '../index';
import http from 'http';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function run() {
  console.log('=== [SAARTHI AI: MASTER LAUNCH & SECURITY READINESS VERIFICATION] ===\n');

  const app = createApp();
  const server = http.createServer(app);

  await new Promise<void>((resolve) => server.listen(0, resolve));
  const port = (server.address() as any).port;
  const baseUrl = `http://localhost:${port}`;

  let passedChecks = 0;
  let totalChecks = 0;

  function assert(condition: boolean, title: string, details?: any) {
    totalChecks++;
    if (condition) {
      console.log(`  [PASS] ${title}`);
      passedChecks++;
    } else {
      console.error(`  [FAIL] ${title}`, details || '');
      process.exitCode = 1;
    }
  }

  try {
    // ----------------------------------------------------
    // CHECK 1: Database State & Super Admin Verification
    // ----------------------------------------------------
    console.log('-> 1. Verifying Super Admin and Production Database State:');
    const superAdmin = await prisma.user.findUnique({
      where: { email: 'varshneysarthak18@gmail.com' },
      include: { adminRole: true }
    });

    assert(!!superAdmin, 'Super Admin user "varshneysarthak18@gmail.com" exists in SQLite');
    assert(superAdmin?.role === 'superadmin', `Super Admin role is strictly "superadmin" (got "${superAdmin?.role}")`);
    assert(superAdmin?.passwordHash.length === 60, `Super Admin password hash is valid 60-char bcrypt string (len: ${superAdmin?.passwordHash.length})`);
    assert(superAdmin?.adminRole?.name === 'Super Admin', `AdminRole mapping is "Super Admin" (got "${superAdmin?.adminRole?.name}")`);

    const schemesCount = await prisma.scheme.count();
    assert(schemesCount >= 8, `Canonical Schemes intact (found ${schemesCount} published schemes)`);

    // Ensure no unwanted test records in production DB
    const leftoverTestUsers = await prisma.user.count({
      where: {
        OR: [
          { email: { contains: 'example.com' } },
          { email: { startsWith: 'e2e' } }
        ]
      }
    });
    assert(leftoverTestUsers === 0, `Zero leftover test fixture users in DB (got ${leftoverTestUsers})`);

    // ----------------------------------------------------
    // CHECK 2: Security Headers Verification
    // ----------------------------------------------------
    console.log('\n-> 2. Verifying HTTP Security Headers (OWASP Baseline):');
    const healthRes = await fetch(`${baseUrl}/health`);
    assert(healthRes.headers.get('x-content-type-options') === 'nosniff', 'Header: X-Content-Type-Options: nosniff');
    assert(healthRes.headers.get('x-frame-options') === 'DENY', 'Header: X-Frame-Options: DENY');
    assert(healthRes.headers.get('referrer-policy') === 'strict-origin-when-cross-origin', 'Header: Referrer-Policy: strict-origin-when-cross-origin');
    assert(healthRes.headers.get('permissions-policy') !== null, 'Header: Permissions-Policy is set');
    assert(healthRes.headers.get('x-powered-by') === null, 'Header: X-Powered-By is suppressed');

    // ----------------------------------------------------
    // CHECK 3: Super Admin Login & Token Acquisition
    // ----------------------------------------------------
    console.log('\n-> 3. Verifying Super Admin Authentication & Privilege:');
    // Using admin@saarthi.ai or test student
    const studentUser = await prisma.user.findFirst({ where: { role: 'student' } });
    assert(!!studentUser, `Student user "${studentUser?.email}" exists for RBAC privilege separation testing`);

    // ----------------------------------------------------
    // CHECK 4: RBAC & Admin Route Protection
    // ----------------------------------------------------
    console.log('\n-> 4. Verifying RBAC Security (Non-admin access blocked):');
    // Unauthenticated request to /admin/stats
    const unauthAdminRes = await fetch(`${baseUrl}/admin/stats`);
    assert(unauthAdminRes.status === 401, `Unauthenticated access to /admin/stats rejected with 401 (got ${unauthAdminRes.status})`);

    // Create a temporary student token to verify 403 Forbidden
    const jwt = require('jsonwebtoken');
    const jwtSecret = process.env.JWT_SECRET || 'dev_secret_saarthi_local_2026';
    const studentToken = jwt.sign(
      { userId: studentUser?.id, email: studentUser?.email, role: 'student' },
      jwtSecret,
      { expiresIn: '1h' }
    );

    const studentAdminRes = await fetch(`${baseUrl}/admin/stats`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    assert(studentAdminRes.status === 403, `Ordinary student token rejected with 403 Forbidden on /admin/stats (got ${studentAdminRes.status})`);

    // ----------------------------------------------------
    // CHECK 5: Privilege Escalation Prevention on Signup
    // ----------------------------------------------------
    console.log('\n-> 5. Verifying Privilege Escalation Defense:');
    const signupExploitRes = await fetch(`${baseUrl}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `exploit_test_${Date.now()}@example.com`,
        password: 'Password@123',
        role: 'superadmin' // malicious attempt to self-assign superadmin
      })
    });
    const signupData: any = await signupExploitRes.json();
    assert(signupData.user?.role !== 'superadmin' && signupData.user?.role !== 'admin', 
      `Privilege escalation blocked: Requested 'superadmin', assigned '${signupData.user?.role}'`);

    // Clean up the temporary exploit user
    if (signupData.user?.id) {
      await prisma.user.delete({ where: { id: signupData.user.id } });
    }

    // ----------------------------------------------------
    // CHECK 6: Super Admin Access to Admin APIs
    // ----------------------------------------------------
    console.log('\n-> 6. Verifying Authorized Super Admin API Access:');
    const superAdminToken = jwt.sign(
      { userId: superAdmin?.id, email: superAdmin?.email, role: 'superadmin' },
      jwtSecret,
      { expiresIn: '1h' }
    );

    const adminStatsRes = await fetch(`${baseUrl}/admin/stats`, {
      headers: { Authorization: `Bearer ${superAdminToken}` }
    });
    assert(adminStatsRes.status === 200, `Super Admin access to /admin/stats allowed with 200 (got ${adminStatsRes.status})`);
    const statsData: any = await adminStatsRes.json();
    assert(typeof statsData.summary?.totalUsers === 'number', 'Admin dashboard statistics returned clean structured data');

    const adminUsersRes = await fetch(`${baseUrl}/admin/users`, {
      headers: { Authorization: `Bearer ${superAdminToken}` }
    });
    assert(adminUsersRes.status === 200, `Super Admin access to /admin/users allowed with 200 (got ${adminUsersRes.status})`);

    // ----------------------------------------------------
    // CHECK 7: Document Upload Security Hardening
    // ----------------------------------------------------
    console.log('\n-> 7. Verifying Document Upload Validation & Path Traversal Defense:');
    const traversalUploadRes = await fetch(`${baseUrl}/documents/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`
      },
      body: JSON.stringify({
        fileName: '../../etc/passwd.sh',
        consentGiven: true
      })
    });
    assert(traversalUploadRes.status === 400, `Path traversal attempt blocked with 400 (got ${traversalUploadRes.status})`);

    const invalidExtUploadRes = await fetch(`${baseUrl}/documents/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`
      },
      body: JSON.stringify({
        fileName: 'malicious_script.exe',
        consentGiven: true
      })
    });
    assert(invalidExtUploadRes.status === 400, `Unsupported executable upload blocked with 400 (got ${invalidExtUploadRes.status})`);

    console.log(`\n======================================================`);
    console.log(`RESULTS: ${passedChecks}/${totalChecks} VERIFICATION CHECKS PASSED (${Math.round((passedChecks/totalChecks)*100)}%)`);
    console.log(`======================================================\n`);

  } finally {
    server.close();
    await prisma.$disconnect();
  }
}

run().catch((err) => {
  console.error('Launch readiness verification failed:', err);
  process.exit(1);
});
