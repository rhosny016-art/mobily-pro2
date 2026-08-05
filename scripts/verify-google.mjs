#!/usr/bin/env node
/**
 * Google Search Console verification checker.
 *
 * Checks whether the Google site-verification file is correctly served
 * from the deployed site. Run it any time after re-deploying.
 *
 * Usage:
 *   node scripts/verify-google.mjs
 *   BASE_URL=https://my-domain.com node scripts/verify-google.mjs
 */
const base = process.env.BASE_URL || "https://dalni-agency.vercel.app";
const file = "google44d8479bff491630.html";
const expected = "google-site-verification: google44d8479bff491630.html";
const url = `${base}/${file}`;

let result;
try {
  result = await fetch(url, {
    headers: { "user-agent": "Mozilla/5.0 (Google-Verify-Checker)" },
    redirect: "follow",
  });
} catch (err) {
  console.log("──────────────────────────────────────────────");
  console.log(`URL       : ${url}`);
  console.log("Status    : ⚠️  NETWORK ERROR");
  console.log("──────────────────────────────────────────────");
  console.log(
    `Could not reach the site from this environment (${err.code || err.message}).\n` +
      "This is usually a sandbox firewall, NOT a problem with your site.\n" +
      "Open the URL in your own browser to confirm the file is served.\n"
  );
  process.exit(2);
}

const body = (await result.text()).trim();
const ok = result.ok && body.includes(expected);

console.log("──────────────────────────────────────────────");
console.log(`URL       : ${url}`);
console.log(`HTTP      : ${result.status}`);
console.log(`Status    : ${ok ? "✅ VERIFIED" : "❌ NOT SERVED"}`);

if (!ok) {
  console.log("──────────────────────────────────────────────");
  console.log("Response preview:");
  console.log(body.slice(0, 300) || "(empty body)");
  console.log("──────────────────────────────────────────────");
  console.log(
    "The verification file is NOT being served yet.\n" +
      "Re-deploy the latest commit (with the file in /public) to Vercel,\n" +
      "then run this script again."
  );
  process.exit(1);
}

console.log(
  "──────────────────────────────────────────────\n" +
    `The file is served correctly at:\n${url}\n\n` +
    "You can now click Verify in Google Search Console."
);
