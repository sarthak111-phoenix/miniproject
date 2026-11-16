import { prisma } from './store';
import * as fs from 'fs';
import * as path from 'path';

export async function seedSchemes() {
  const candidates = [
    path.resolve(__dirname, '../../../../packages/scheme-data-schema/dist/starter-schemes.json'),
    path.resolve(__dirname, '../../../../packages/scheme-data-schema/src/starter-schemes.json')
  ];

  let schemes = [];
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      const content = fs.readFileSync(p, 'utf-8');
      schemes = JSON.parse(content);
      console.log(`Loaded ${schemes.length} schemes from ${p}`);
      break;
    }
  }

  for (const s of schemes) {
    const portalUrl = s.officialPortalUrl || s.portalUrl || 'https://india.gov.in';
    const deadline = s.applicationDeadline || s.deadline || null;

    await prisma.scheme.upsert({
      where: { id: s.id },
      update: {
        name: s.name,
        level: s.level,
        state: s.state || null,
        categoryType: s.categoryType,
        benefitAmount: s.benefitAmount,
        deadline,
        portalUrl,
        requiredDocuments: JSON.stringify(s.requiredDocuments || []),
        sourceVersion: s.sourceVersion,
        rules: JSON.stringify(s.rules || {})
      },
      create: {
        id: s.id,
        name: s.name,
        level: s.level,
        state: s.state || null,
        categoryType: s.categoryType,
        benefitAmount: s.benefitAmount,
        deadline,
        portalUrl,
        requiredDocuments: JSON.stringify(s.requiredDocuments || []),
        sourceVersion: s.sourceVersion,
        rules: JSON.stringify(s.rules || {})
      }
    });
  }

  const count = await prisma.scheme.count();
  console.log(`Database now has ${count} schemes.`);
}

if (require.main === module) {
  seedSchemes()
    .then(() => prisma.$disconnect())
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
    });
}
