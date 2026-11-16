import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function promoteToSuperAdmin(targetEmail: string) {
  const normalizedEmail = targetEmail.toLowerCase().trim();
  console.log(`\n--- Promoting User to Super Admin ---`);
  console.log(`Target Email: ${normalizedEmail}`);

  // 1. Verify user exists in database
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    include: { profile: true, adminRole: true },
  });

  if (!user) {
    console.error(`❌ User with email "${normalizedEmail}" was NOT found in the database.`);
    const existingUsers = await prisma.user.findMany({ select: { id: true, email: true, role: true } });
    console.log(`Existing registered users (${existingUsers.length}):`);
    existingUsers.forEach((u) => console.log(`  - ${u.email} (role: ${u.role})`));
    throw new Error(`Account not found: ${normalizedEmail}`);
  }

  console.log(`✓ Verified account exists in authentication system (ID: ${user.id})`);
  console.log(`  Current Role: ${user.role}`);
  console.log(`  Current Status: ${user.status}`);

  // 2. Ensure Super Admin AdminRole exists with all administrative permissions
  let superAdminRole = await prisma.adminRole.findUnique({
    where: { name: 'Super Admin' },
  });

  if (!superAdminRole) {
    console.log(`Creating "Super Admin" role with wildcard [*] permissions...`);
    superAdminRole = await prisma.adminRole.create({
      data: {
        name: 'Super Admin',
        description: 'Unrestricted master administrative access across all modules, settings, and staff provisioning.',
        permissions: JSON.stringify(['*']),
        isSystem: true,
      },
    });
  } else {
    // Ensure permissions are wildcard [*]
    if (superAdminRole.permissions !== JSON.stringify(['*'])) {
      superAdminRole = await prisma.adminRole.update({
        where: { id: superAdminRole.id },
        data: { permissions: JSON.stringify(['*']) },
      });
    }
  }

  console.log(`✓ Super Admin role configured (ID: ${superAdminRole.id}, Permissions: ${superAdminRole.permissions})`);

  // 3. Update user role and assign to superAdminRole WITHOUT modifying passwordHash
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      role: 'superadmin',
      adminRoleId: superAdminRole.id,
      status: 'active',
    },
    include: {
      adminRole: true,
      profile: true,
    },
  });

  console.log(`✓ User role updated to "superadmin"`);
  console.log(`✓ Admin role mapped to Super Admin (adminRoleId: ${updatedUser.adminRoleId})`);
  console.log(`✓ Account status set to "active"`);
  console.log(`✓ Existing passwordHash preserved untouched (Length: ${user.passwordHash.length})`);

  // 4. Ensure profile exists for the administrator
  if (!updatedUser.profile) {
    await prisma.profile.create({
      data: {
        userId: user.id,
        fullName: 'Super Administrator',
        age: 30,
        gender: 'other',
        state: 'All India',
        category: 'General',
        annualIncome: 1200000,
        occupation: 'Platform Administrator',
        educationLevel: 'Postgraduate',
        skills: JSON.stringify(['System Architecture', 'Governance', 'Security']),
        disability: false,
      },
    });
    console.log(`✓ Created administrator profile mapping`);
  } else {
    console.log(`✓ Existing profile preserved (Name: ${updatedUser.profile.fullName})`);
  }

  // 5. Record initial role assignment in AdminAuditLog
  const auditLog = await prisma.adminAuditLog.create({
    data: {
      adminId: user.id,
      adminEmail: normalizedEmail,
      action: 'SUPER_ADMIN_PROMOTION',
      module: 'roles',
      recordId: user.id,
      details: JSON.stringify({
        event: 'Account promoted to Initial Super Admin',
        email: normalizedEmail,
        userId: user.id,
        role: 'superadmin',
        adminRoleId: superAdminRole.id,
        permissions: JSON.parse(superAdminRole.permissions),
        previousRole: user.role,
        promotedAt: new Date().toISOString(),
      }),
      ipAddress: '127.0.0.1',
      status: 'success',
    },
  });

  console.log(`✓ Audit log entry recorded (Audit ID: ${auditLog.id})`);

  console.log('\n=============================================================');
  console.log(`🎉 SUCCESS: ${normalizedEmail} is now configured as SUPER ADMIN!`);
  console.log(`   User ID:     ${user.id}`);
  console.log(`   Email:       ${normalizedEmail}`);
  console.log(`   Role:        superadmin`);
  console.log(`   Permissions: [*] (Full Unrestricted Access)`);
  console.log(`   Password:    [Unchanged - Log in with your existing password]`);
  console.log('=============================================================\n');

  return updatedUser;
}

const targetEmail = process.argv[2] || 'varshneysarthak18@gmail.com';

promoteToSuperAdmin(targetEmail)
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });

