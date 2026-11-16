import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const DEFAULT_ROLES = [
  {
    name: 'Super Admin',
    description: 'Unrestricted master administrative access across all modules, settings, and staff provisioning.',
    permissions: JSON.stringify(['*']),
    isSystem: true,
  },
  {
    name: 'Content Admin',
    description: 'Manages scholarships, government schemes, CMS pages, announcements, and knowledge base.',
    permissions: JSON.stringify([
      'scholarships.view',
      'scholarships.manage',
      'schemes.view',
      'schemes.manage',
      'cms.view',
      'cms.manage',
      'knowledge.view',
      'knowledge.manage',
      'announcements.view',
      'announcements.manage',
    ]),
    isSystem: true,
  },
  {
    name: 'User Manager',
    description: 'Manages student, citizen, and farmer user accounts, statuses, and profile verifications.',
    permissions: JSON.stringify([
      'users.view',
      'users.manage',
      'reports.view',
      'support.view',
    ]),
    isSystem: true,
  },
  {
    name: 'AI Manager',
    description: 'Manages AI Copilot system prompts, model limits, RAG embeddings, and AI usage monitoring.',
    permissions: JSON.stringify([
      'ai.view',
      'ai.manage',
      'knowledge.view',
      'knowledge.manage',
      'monitoring.view',
    ]),
    isSystem: true,
  },
  {
    name: 'Support Manager',
    description: 'Resolves user tickets, issues advisories, and responds to public inquiries.',
    permissions: JSON.stringify([
      'support.view',
      'support.manage',
      'notifications.view',
      'notifications.manage',
      'users.view',
    ]),
    isSystem: true,
  },
  {
    name: 'Analyst',
    description: 'Read-only business intelligence and reporting access across user growth and scheme engagement.',
    permissions: JSON.stringify([
      'reports.view',
      'reports.export',
      'users.view',
      'scholarships.view',
      'schemes.view',
      'audit.view',
    ]),
    isSystem: true,
  },
];

export const DEFAULT_CMS_SECTIONS = [
  {
    sectionKey: 'hero',
    title: 'Homepage Hero Banner',
    contentJson: JSON.stringify({
      badge: 'National Citizen Empowerment & Academic Intelligence Engine',
      heading: 'Personalized Schemes & Career Roadmaps for Every Indian Citizen',
      subtitle: 'Unlock 5,000+ verified Central & State Government welfare schemes, merit scholarships, and an 8-semester AICTE-aligned academic progression engine.',
      primaryCtaText: 'Assess My Eligibility',
      secondaryCtaText: 'Explore Career Tracks',
    }),
  },
  {
    sectionKey: 'overview',
    title: 'Platform Architecture & Pillars',
    contentJson: JSON.stringify({
      pillars: [
        { title: 'Deterministic Matcher', desc: '100% rule-based eligibility evaluation without AI hallucination.' },
        { title: 'myScheme.gov.in Direct Feed', desc: 'Integrated with 5,080+ official Central and State welfare initiatives.' },
        { title: 'Domain-Accurate Roadmaps', desc: 'Semester 1 to 8 curated milestones for Engineering, UPSC, and Design tracks.' },
        { title: 'DPDP Act 2023 Compliant', desc: '90-day retention policies and zero unauthorized data dissemination.' },
      ],
    }),
  },
  {
    sectionKey: 'banners',
    title: 'Announcement Banners',
    contentJson: JSON.stringify({
      activeBanner: {
        text: '📢 National Scholarship Portal (NSP 2026) applications now live — verify documents to claim benefits.',
        actionUrl: 'https://scholarships.gov.in',
        enabled: true,
        type: 'info',
      },
    }),
  },
  {
    sectionKey: 'about',
    title: 'About Saarthi AI',
    contentJson: JSON.stringify({
      mission: 'Saarthi AI bridges the information asymmetry between Indian citizens and transformative government welfare.',
      vision: 'Ensuring no deserving student, citizen, or farmer misses life-changing grants due to complex eligibility criteria.',
      helpline: 'Toll-free Citizen Advisory: 1800-11-2026 (Mon-Sat 9AM-6PM IST)',
    }),
  },
  {
    sectionKey: 'contact',
    title: 'Official Contact & Office Details',
    contentJson: JSON.stringify({
      email: 'support@saarthi.ai',
      phone: '+91 11 2345 6789',
      address: 'Saarthi AI Citizen Innovation Hub, New Delhi, India 110001',
      grievanceOfficer: 'Dr. Rajiv Menon (grievance@saarthi.ai)',
    }),
  },
  {
    sectionKey: 'faqs',
    title: 'Frequently Asked Questions',
    contentJson: JSON.stringify([
      { q: 'Is Saarthi AI free for students and citizens?', a: 'Yes. All eligibility checks, roadmap generation, and notifications are 100% free of charge.' },
      { q: 'How does Saarthi AI match schemes?', a: 'Using our deterministic rule evaluation engine which checks age, domicile, annual income, social category, and occupation against official government notifications.' },
      { q: 'Are my uploaded documents secure?', a: 'Documents undergo client-side verification and are subject to DPDP Act 2023 guidelines with automated 90-day expiration retention policies.' },
    ]),
  },
  {
    sectionKey: 'footer',
    title: 'Global Footer & Statutory Notices',
    contentJson: JSON.stringify({
      disclaimer: 'Saarthi AI is an independent citizen advisory engine. All scheme guidelines are sourced from official government gazettes and myScheme.gov.in.',
      copyright: '© 2026 Saarthi AI Foundation. All rights reserved.',
      quickLinks: [
        { label: 'Citizen Schemes', href: '/' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Privacy Policy (DPDP 2023)', href: '/privacy' },
        { label: 'Cookie Preferences', href: '/cookies' },
      ],
    }),
  },
  {
    sectionKey: 'seo',
    title: 'Default Metadata & Social Share Settings',
    contentJson: JSON.stringify({
      title: 'Saarthi AI — Integrated Student Roadmap Engine & Government Scheme Matcher',
      description: 'Find personalized scholarships, citizen welfare schemes, and structured semester career roadmaps tailored to your profile.',
      ogImage: '/icon.svg',
      keywords: 'scholarships, PM-KISAN, AICTE Pragati, NSP, career roadmap, government schemes 2026',
    }),
  },
];

export const DEFAULT_INTEGRATIONS = [
  {
    name: 'Google Gemini AI',
    keyName: 'gemini_ai',
    status: 'connected',
    configJson: JSON.stringify({
      model: 'gemini-flash-latest',
      provider: 'Google Deepmind / Vertex AI',
      endpoint: 'Official Google Gen AI SDK',
      hasKey: !!process.env.GEMINI_API_KEY,
    }),
  },
  {
    name: 'myScheme National Portal API',
    keyName: 'myscheme_api',
    status: 'connected',
    configJson: JSON.stringify({
      endpoint: 'https://www.myscheme.gov.in/api/apisetu/schemes',
      cacheStatus: 'Local persistent disk cache enabled (5,083 schemes indexed)',
    }),
  },
  {
    name: 'SMTP Email Notification Relay',
    keyName: 'smtp_email',
    status: 'connected',
    configJson: JSON.stringify({
      host: 'smtp.saarthi.internal',
      port: 587,
      sender: 'notifications@saarthi.ai',
      tls: true,
    }),
  },
  {
    name: 'Secure Document Storage',
    keyName: 'cloud_storage',
    status: 'connected',
    configJson: JSON.stringify({
      provider: 'Local Encrypted Storage (DPDP compliant)',
      retentionDays: 90,
      path: './uploads/documents',
    }),
  },
  {
    name: 'Document OCR & Verification Engine',
    keyName: 'ocr_service',
    status: 'connected',
    configJson: JSON.stringify({
      engine: 'Tesseract/Cloud OCR Hybrid',
      supportedMimeTypes: ['application/pdf', 'image/png', 'image/jpeg'],
    }),
  },
];

export async function seedAdminSystem() {
  console.log('--- Initializing Admin Portal System Defaults ---');

  // 1. Seed Roles
  const seededRoles: Record<string, string> = {};
  for (const roleDef of DEFAULT_ROLES) {
    const role = await prisma.adminRole.upsert({
      where: { name: roleDef.name },
      update: {
        description: roleDef.description,
        permissions: roleDef.permissions,
        isSystem: roleDef.isSystem,
      },
      create: {
        name: roleDef.name,
        description: roleDef.description,
        permissions: roleDef.permissions,
        isSystem: roleDef.isSystem,
      },
    });
    seededRoles[role.name] = role.id;
  }
  console.log(`✓ Seeded ${DEFAULT_ROLES.length} Admin Roles`);

  // 2. Seed Site Config
  await prisma.siteConfig.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      siteName: 'Saarthi AI',
      contactEmail: 'support@saarthi.ai',
      contactPhone: '+91 1800 123 4567',
      defaultLanguage: 'en',
      maintenanceMode: false,
    },
  });
  console.log('✓ Seeded SiteConfig');

  // 3. Seed AI Config
  await prisma.aiConfig.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      provider: 'gemini',
      modelName: process.env.AI_MODEL || 'gemini-flash-latest',
      systemInstruction: 'You are Saarthi AI Copilot, a helpful and authoritative guide for Indian government schemes, scholarships, and academic-career roadmaps.',
      temperature: 0.4,
      maxTokens: 2048,
      dailyUserLimit: 100,
      rateLimitPerMin: 10,
    },
  });
  console.log('✓ Seeded AiConfig');

  // 4. Seed CMS Sections
  for (const cms of DEFAULT_CMS_SECTIONS) {
    await prisma.cmsContent.upsert({
      where: { sectionKey: cms.sectionKey },
      update: { title: cms.title },
      create: {
        sectionKey: cms.sectionKey,
        title: cms.title,
        contentJson: cms.contentJson,
        status: 'published',
        publishedAt: new Date(),
        updatedBy: 'system',
      },
    });
  }
  console.log(`✓ Seeded ${DEFAULT_CMS_SECTIONS.length} CMS Sections`);

  // 5. Seed Integrations
  for (const itg of DEFAULT_INTEGRATIONS) {
    await prisma.integrationConfig.upsert({
      where: { keyName: itg.keyName },
      update: { name: itg.name },
      create: {
        name: itg.name,
        keyName: itg.keyName,
        status: itg.status,
        configJson: itg.configJson,
        lastCheckedAt: new Date(),
      },
    });
  }
  console.log(`✓ Seeded ${DEFAULT_INTEGRATIONS.length} Integrations`);

  // 6. Provision Default Super Admin
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@saarthi.ai').toLowerCase().trim();
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@Saarthi2026!';
  const superAdminRoleId = seededRoles['Super Admin'];

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(adminPassword, salt);

  let adminUser;
  if (existingAdmin) {
    adminUser = await prisma.user.update({
      where: { id: existingAdmin.id },
      data: {
        role: 'superadmin',
        adminRoleId: superAdminRoleId,
        passwordHash,
        status: 'active',
      },
    });
    console.log(`✓ Updated existing account to Super Admin: ${adminEmail}`);
  } else {
    adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        role: 'superadmin',
        status: 'active',
        adminRoleId: superAdminRoleId,
        profile: {
          create: {
            fullName: 'Platform Super Administrator',
            age: 35,
            gender: 'other',
            state: 'Delhi',
            category: 'General',
            annualIncome: 1200000,
            occupation: 'Administrator',
            educationLevel: 'Postgraduate',
            skills: JSON.stringify(['Security', 'System Architecture', 'Governance']),
            disability: false,
          },
        },
      },
    });
    console.log(`✓ Created new Super Admin account: ${adminEmail}`);
  }

  // 7. Seed Sample Support Ticket if none exist
  const ticketCount = await prisma.supportTicket.count();
  if (ticketCount === 0) {
    await prisma.supportTicket.create({
      data: {
        ticketNumber: 'TKT-2026-001',
        userName: 'Aarav Patel',
        userEmail: 'aarav.patel@example.com',
        subject: 'Income Certificate Verification for AICTE Pragati',
        description: 'I have uploaded my Tehsildar income certificate issued in October 2026. Requesting guidance on whether it satisfies the state EBC criteria.',
        category: 'scholarship',
        priority: 'high',
        status: 'open',
        internalNotes: JSON.stringify([
          { author: 'System', text: 'Ticket auto-assigned to Support Manager queue.', timestamp: new Date().toISOString() },
        ]),
      },
    });
    console.log('✓ Seeded initial Support Ticket');
  }

  // 8. Seed Initial Announcement
  const announcementCount = await prisma.announcement.count();
  if (announcementCount === 0) {
    await prisma.announcement.create({
      data: {
        title: 'NSP 2026 Portal Synchronization Complete',
        message: 'All Central Sector and AICTE scholarship deadlines for the 2026-2027 academic session have been synchronized. Students are advised to review required documents.',
        category: 'deadline',
        priority: 'high',
        targetAudience: 'student',
        deliveryChannel: 'in_app',
        status: 'published',
        publishedAt: new Date(),
        deliveredCount: 42,
      },
    });
    console.log('✓ Seeded initial Announcement');
  }

  // 9. Seed Initial AI Knowledge Doc
  const docCount = await prisma.aiKnowledgeDoc.count();
  if (docCount === 0) {
    await prisma.aiKnowledgeDoc.create({
      data: {
        title: 'Official Gazette: AICTE Pragati & Saksham Eligibility Guidelines 2026',
        fileName: 'aicte_pragati_saksham_2026_guidelines.txt',
        mimeType: 'text/plain',
        extractedText: 'AICTE Pragati Scholarship is exclusively designated for girl students enrolled in approved technical degree or diploma programs. Maximum family income ceiling is ₹8,00,000 per annum. Benefits provide ₹50,000 per year towards tuition and contingency.',
        tokensCount: 450,
        category: 'scholarship',
        status: 'published',
        approvedBy: adminEmail,
      },
    });
    console.log('✓ Seeded initial AI Knowledge Base Document');
  }

  // Log Initial Audit Entry
  await prisma.adminAuditLog.create({
    data: {
      adminId: adminUser.id,
      adminEmail: adminUser.email,
      action: 'SYSTEM_INITIALIZATION',
      module: 'system',
      recordId: adminUser.id,
      details: JSON.stringify({ event: 'Super Admin Provisioned and System Seeded Successfully' }),
      ipAddress: '127.0.0.1',
      status: 'success',
    },
  });

  console.log('====================================================');
  console.log('🎉 Super Admin Credentials Provisioned:');
  console.log(`   Email:    ${adminEmail}`);
  console.log(`   Password: ${adminPassword}`);
  console.log('====================================================');
  return { adminEmail, adminPassword };
}

if (require.main === module) {
  seedAdminSystem()
    .then(() => prisma.$disconnect())
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}

