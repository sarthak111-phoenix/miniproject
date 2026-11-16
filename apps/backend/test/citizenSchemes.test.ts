import assert from 'assert';

const API_BASE = 'http://localhost:4000';

async function runCitizenSchemesTests() {
  console.log('\n=== [CITIZEN SCHEMES & MYSCHEME INTEGRATION TEST SUITE] ===');

  // 1. Test Criteria-Based Eligibility: Student (Female, Maharashtra, OBC, 3.5L income, 85%)
  console.log('-> 1. Testing Criteria Eligibility for Female Student (Priya)...');
  const res1 = await fetch(`${API_BASE}/eligibility/check-criteria`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Priya Sharma',
      age: 20,
      gender: 'female',
      state: 'Maharashtra',
      category: 'OBC',
      annualIncome: 350000,
      occupation: 'student',
      educationLevel: 'Undergraduate',
      cgpaOrPercentage: 85,
    }),
  });
  assert.strictEqual(res1.status, 200, `Expected 200, got ${res1.status}`);
  const data1 = await res1.json();
  assert(data1.eligibleSchemes.length > 0, 'Should return at least 1 eligible scheme');
  const priyaSchemeNames = data1.eligibleSchemes.map((s: any) => s.schemeName);
  console.log(`  ✓ Matched ${data1.eligibleSchemes.length} schemes for Priya:`, priyaSchemeNames);
  assert(
    priyaSchemeNames.some((name: string) => name.includes('Pragati') || name.includes('CSSS')),
    'Should include Pragati or CSSS'
  );

  // 2. Test Criteria-Based Eligibility: Farmer (Male, UP, 1.8L income)
  console.log('-> 2. Testing Criteria Eligibility for Farmer (Ramesh)...');
  const res2 = await fetch(`${API_BASE}/eligibility/check-criteria`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Ramesh Patel',
      age: 48,
      gender: 'male',
      state: 'Uttar Pradesh',
      category: 'General',
      annualIncome: 180000,
      occupation: 'farmer',
      educationLevel: '10th',
    }),
  });
  assert.strictEqual(res2.status, 200);
  const data2 = await res2.json();
  const farmerSchemeNames = data2.eligibleSchemes.map((s: any) => s.schemeName);
  console.log(`  ✓ Matched ${data2.eligibleSchemes.length} schemes for Ramesh:`, farmerSchemeNames);
  assert(
    farmerSchemeNames.some((name: string) => name.includes('PM Kisan')),
    'Should match PM Kisan for farmer'
  );

  // 3. Test Universal Search across 5,000+ schemes from myScheme.gov.in
  console.log('-> 3. Testing Universal Search for "kisan"...');
  const res3 = await fetch(`${API_BASE}/schemes/search?q=kisan`);
  assert.strictEqual(res3.status, 200);
  const data3 = await res3.json();
  console.log(`  ✓ Verified DB Matches: ${data3.verifiedSchemes.length}, myScheme Matches: ${data3.mySchemeCatalog.length}`);
  assert(data3.mySchemeCatalog.length > 0, 'myScheme catalog should return kisan schemes');
  assert(data3.totalMyScheme > 0, 'Total myScheme count should be > 0');

  // 4. Test Live myScheme Scheme Detail Lookup by slug
  console.log('-> 4. Testing myScheme Detail Lookup for slug "pm-kisan"...');
  const res4 = await fetch(`${API_BASE}/schemes/myscheme/pm-kisan`);
  assert.strictEqual(res4.status, 200);
  const data4 = await res4.json();
  console.log(`  ✓ Retrieved full official record: "${data4.scheme?.name}" (${data4.scheme?.ministry})`);
  assert(data4.scheme?.name.includes('Kisan'), 'Scheme name should contain Kisan');
  assert(data4.scheme?.portalUrl, 'Should have portalUrl');

  console.log('\n🎉 ALL CITIZEN SCHEMES & MYSCHEME TESTS PASSED (100% SUCCESS)!\n');
}

runCitizenSchemesTests().catch((e) => {
  console.error('Test failed:', e);
  process.exit(1);
});
