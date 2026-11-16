import { validateScheme, SchemeSchema } from './schema';
import * as fs from 'fs';
import * as path from 'path';

console.log('=== [PHASE 0 TEST RUN: Scheme Data Schema & Validation] ===');

const schemesPath = path.join(__dirname, 'starter-schemes.json');
const rawData = fs.readFileSync(schemesPath, 'utf-8');
const starterSchemes = JSON.parse(rawData);

console.log(`Loaded ${starterSchemes.length} starter schemes from ${schemesPath}`);

let allPassed = true;

// Test 1: Verify all starter schemes validate cleanly against canonical Zod schema
starterSchemes.forEach((scheme: any, idx: number) => {
  const result = validateScheme(scheme);
  if (!result.success) {
    console.error(`❌ Scheme #${idx + 1} (${scheme.name}) failed validation:`, result.errors);
    allPassed = false;
  } else {
    console.log(`  ✓ Scheme #${idx + 1} valid: [${scheme.level}] ${scheme.name} (${scheme.categoryType})`);
  }
});

// Test 2: Verify that an invalid scheme is properly rejected with detailed errors
const invalidScheme = {
  id: 'invalid-scheme',
  name: 'X', // too short (< 2 chars)
  level: 'Global', // invalid enum
  officialPortalUrl: 'not-a-url', // invalid url
  requiredDocuments: [], // min 1 required
  rules: {
    minMarksPercentage: 150 // max 100
  },
  sourceVersion: '',
  lastVerifiedDate: 'invalid-date'
};

const invalidResult = validateScheme(invalidScheme);
if (!invalidResult.success) {
  console.log(`  ✓ Expected rejection test passed: Detected ${invalidResult.errors.length} validation errors on malformed scheme.`);
} else {
  console.error('❌ Error: Malformed scheme unexpectedly passed validation!');
  allPassed = false;
}

if (allPassed) {
  console.log('\n🎉 ALL PHASE 0 CANONICAL DATA TESTS PASSED SUCCESSFULLY!\n');
  process.exit(0);
} else {
  console.error('\n❌ PHASE 0 TESTS FAILED.\n');
  process.exit(1);
}
