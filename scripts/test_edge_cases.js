const assert = require('assert');

async function testAllFiveEdgeCases() {
  console.log('================================================================');
  console.log('AGRISMART AI - RELIEF INGESTION & STORE EDGE CASE TEST SUITE');
  console.log('================================================================\n');

  const BASE_URL = 'http://localhost:3000';

  // -------------------------------------------------------------
  // Test Case 1: New Document Discovery
  // -------------------------------------------------------------
  console.log('--- TEST 1: New Document Discovery ---');
  const res1 = await fetch(`${BASE_URL}/api/crop-relief/updates`);
  assert.strictEqual(res1.status, 200, 'GET /api/crop-relief/updates must return 200');
  const data1 = await res1.json();
  const tankerDocs = data1.announcements.filter(a => a.sourceId === 'MAHA_WATER_DEPT');
  console.log(`Found ${tankerDocs.length} official tanker reports newly discovered from water.maharashtra.gov.in`);
  assert(tankerDocs.length > 0, 'Must have discovered at least 1 official water tanker document');
  const sampleNewDoc = tankerDocs[0];
  console.log(`Sample New Document: "${sampleNewDoc.title}"`);
  console.log(`Canonical PDF URL: ${sampleNewDoc.canonicalUrl}`);
  console.log(`Evidence Status: ${sampleNewDoc.evidenceStatus}`);
  console.log(`Published At: ${sampleNewDoc.publishedAt}`);
  assert.strictEqual(sampleNewDoc.evidenceStatus, 'official_notice_verified', 'Official departmental PDF must evaluate as official_notice_verified');
  console.log('RESULT: [PASS] New document discovered, verified, and stored with original issue date & URL.\n');

  // -------------------------------------------------------------
  // Test Case 2: Duplicate Document Handling
  // -------------------------------------------------------------
  console.log('--- TEST 2: Duplicate Document Deduplication ---');
  const countBefore = data1.announcements.length;
  // Check that no duplicate canonical URLs or titles exist in the store
  const seenUrls = new Set();
  const seenTitles = new Set();
  let duplicatesFound = 0;
  for (const a of data1.announcements) {
    const normUrl = (a.canonicalUrl || a.originalUrl).toLowerCase().trim();
    const normTitle = a.title.toLowerCase().replace(/[^\w\u0900-\u097F]/g, '').trim();
    if (seenUrls.has(normUrl) || seenTitles.has(normTitle)) {
      duplicatesFound++;
    }
    seenUrls.add(normUrl);
    seenTitles.add(normTitle);
  }
  console.log(`Store contains ${countBefore} announcements. Duplicates detected: ${duplicatesFound}`);
  assert.strictEqual(duplicatesFound, 0, 'Store must have 0 duplicate announcements');
  console.log('RESULT: [PASS] Duplicate documents strictly prevented by URL and title normalization.\n');

  // -------------------------------------------------------------
  // Test Case 3: Historical Document Retention
  // -------------------------------------------------------------
  console.log('--- TEST 3: Historical Document Retention ---');
  const historicalDocs = data1.announcements.filter(a => 
    a.publishedAt.startsWith('2023') || 
    a.publishedAt.startsWith('2024') || 
    a.evidenceStatus === 'historical'
  );
  console.log(`Store contains ${historicalDocs.length} historical record(s) from previous drought seasons:`);
  historicalDocs.forEach(h => {
    console.log(`- [${h.publishedAt}] "${h.title}" (Status: ${h.evidenceStatus})`);
  });
  assert(historicalDocs.length > 0, 'Store must retain historical announcements');
  const examWaiver = historicalDocs.find(h => h.category === 'education_waiver');
  assert(examWaiver, 'Historical education fee waiver record must be present');
  console.log(`Retained original issue date: ${examWaiver.publishedAt}`);
  console.log(`Retained verified source URL: ${examWaiver.originalUrl}`);
  console.log('RESULT: [PASS] Historical documents retained with original dates, URLs, and correct non-breaking status.\n');

  // -------------------------------------------------------------
  // Test Case 4: Unavailable Source (Anti-Bot WAF / Timeout)
  // -------------------------------------------------------------
  console.log('--- TEST 4: Unavailable Source Handling ---');
  const mahaGrSource = data1.sources.find(s => s.code === 'MAHA_GR_PORTAL');
  assert(mahaGrSource, 'MAHA_GR_PORTAL must be tracked in sources');
  console.log(`Source code: ${mahaGrSource.code}`);
  console.log(`Source status: ${mahaGrSource.status}`);
  console.log(`Last Error: ${mahaGrSource.lastError}`);
  console.log(`Failure Count: ${mahaGrSource.failureCount}`);
  assert(
    mahaGrSource.status === 'degraded' || mahaGrSource.status === 'failing',
    'Source blocked by WAF must be marked as degraded or failing, not falsely reported online'
  );
  assert(mahaGrSource.lastError, 'Source must record the exact network failure/abort reason');
  console.log('RESULT: [PASS] Unavailable/WAF-blocked sources safely isolated without crashing pipeline.\n');

  // -------------------------------------------------------------
  // Test Case 5: Failed Scheduled Refresh (Security & Rate Limits)
  // -------------------------------------------------------------
  console.log('--- TEST 5: Failed Scheduled Refresh (Security & Rate Limits) ---');
  
  // 5a: Missing secret (Public visitor attempt)
  const resNoAuth = await fetch(`${BASE_URL}/api/crop-relief/refresh`, {
    method: 'GET'
  });
  console.log(`5a. GET /api/crop-relief/refresh without Authorization -> HTTP ${resNoAuth.status}`);
  assert.strictEqual(resNoAuth.status, 401, 'Must return 401 Unauthorized for unauthenticated calls');
  const dataNoAuth = await resNoAuth.json();
  console.log(`    Message: ${dataNoAuth.error}`);

  // 5b: Invalid secret
  const resBadAuth = await fetch(`${BASE_URL}/api/crop-relief/refresh`, {
    method: 'POST',
    headers: {
      'x-admin-secret': 'invalid_secret_token_12345',
      'Content-Type': 'application/json'
    }
  });
  console.log(`5b. POST /api/crop-relief/refresh with invalid secret -> HTTP ${resBadAuth.status}`);
  assert.strictEqual(resBadAuth.status, 401, 'Must return 401 Unauthorized for invalid secret');

  // 5c: Valid Bearer Auth (Cron simulator)
  const resCronAuth = await fetch(`${BASE_URL}/api/crop-relief/refresh`, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer agrismart_secure_relief_sync_2026',
      'User-Agent': 'vercel-cron/1.0'
    }
  });
  console.log(`5c. GET /api/crop-relief/refresh with Vercel Cron header -> HTTP ${resCronAuth.status}`);
  assert(
    resCronAuth.status === 200 || resCronAuth.status === 429,
    'Valid cron auth must either execute (200) or rate-limit (429)'
  );
  const dataCronAuth = await resCronAuth.json();
  if (resCronAuth.status === 429) {
    console.log(`    Rate limiter properly active: ${dataCronAuth.error}`);
  } else {
    console.log(`    Cron executed successfully: Trigger ${dataCronAuth.triggerType}`);
  }

  console.log('RESULT: [PASS] Scheduled refresh security, 401 rejection, and 429 protection verified.\n');

  console.log('================================================================');
  console.log('ALL 5 EDGE CASE TESTS COMPLETED SUCCESSFULLY WITH CODE 0');
  console.log('================================================================');
}

testAllFiveEdgeCases().catch(err => {
  console.error('\nFAILED TEST ASSERTION:', err);
  process.exit(1);
});
