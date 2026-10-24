import fs from "fs";
import path from "path";

// Read .env.local to get the valid secret for test verification
let validSecret = "";
try {
  const envContent = fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf-8");
  const match = envContent.match(/RELIEF_ADMIN_SECRET=["']?([^"'\r\n]+)["']?/);
  if (match) validSecret = match[1];
} catch {
  // If no env file
}

async function runSecurityTests() {
  console.log("======================================================================");
  console.log("AGRISMART AI — SECRET & AUTHENTICATION SECURITY AUDIT");
  console.log("======================================================================\n");

  const baseUrl = "http://localhost:3000/api/crop-relief/refresh";

  // Test 1: Request with no auth
  console.log("Test 1: Request with no Authorization header");
  const res1 = await fetch(baseUrl, { method: "POST" });
  console.log(`  Status: ${res1.status}`);
  const json1 = await res1.json();
  if (res1.status === 401) {
    console.log("  [PASS] Correctly rejected with 401 Unauthorized:", json1.error);
  } else {
    console.error("  [FAIL] Expected 401, got:", res1.status, json1);
    process.exit(1);
  }

  // Test 2: Request with arbitrary invalid secret
  console.log("\nTest 2: Request with invalid token");
  const res2 = await fetch(baseUrl, {
    method: "POST",
    headers: { "Authorization": "Bearer completely_fake_random_secret_9999" }
  });
  console.log(`  Status: ${res2.status}`);
  const json2 = await res2.json();
  if (res2.status === 401) {
    console.log("  [PASS] Correctly rejected with 401 Unauthorized:", json2.error);
  } else {
    console.error("  [FAIL] Expected 401, got:", res2.status, json2);
    process.exit(1);
  }

  // Test 3: Request with old hardcoded secret "agrismart_secure_relief_sync_2026"
  console.log("\nTest 3: Request with deprecated hardcoded secret");
  const res3 = await fetch(baseUrl, {
    method: "POST",
    headers: { "Authorization": "Bearer agrismart_secure_relief_sync_2026" }
  });
  console.log(`  Status: ${res3.status}`);
  const json3 = await res3.json();
  if (res3.status === 401) {
    console.log("  [PASS] Correctly rejected with 401 Unauthorized — backdoor is completely eliminated!");
  } else {
    console.error("  [FAIL] Hardcoded backdoor was accepted!", res3.status, json3);
    process.exit(1);
  }

  // Test 4: Request with genuine configured secret from .env.local
  if (validSecret) {
    console.log("\nTest 4: Request with genuine configured secret from .env.local");
    const res4 = await fetch(baseUrl, {
      method: "POST",
      headers: { "Authorization": `Bearer ${validSecret}` }
    });
    console.log(`  Status: ${res4.status}`);
    const json4 = await res4.json();
    if (res4.status === 200 && json4.success) {
      console.log("  [PASS] Authorized successfully with genuine environment secret!");
    } else {
      console.error("  [FAIL] Genuine secret failed:", res4.status, json4);
      process.exit(1);
    }
  } else {
    console.log("\nTest 4 skipped: No .env.local secret found for authorized check.");
  }

  console.log("\n======================================================================");
  console.log("ALL SECURITY TESTS PASSED.");
  console.log("======================================================================");
}

runSecurityTests().catch((err) => {
  console.error("Security test threw error:", err);
  process.exit(1);
});
