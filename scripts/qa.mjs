// QA smoke test using Playwright with the system-installed Chrome.
import { chromium } from "playwright-core";

const BASE = "http://localhost:3000";
const results = [];
const ok = (name, pass, detail = "") =>
  results.push({ name, pass: !!pass, detail });

const consoleErrors = [];
const pageErrors = [];

async function run() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => pageErrors.push(err.message));

  const gotoAndWait = async (p, selector = "#main-content", extra = "") => {
    await page.goto(BASE + p, { waitUntil: "domcontentloaded" });
    await page.waitForSelector(selector, { timeout: 20000 });
    await page.waitForTimeout(1200);
    if (extra) await page.waitForSelector(extra, { timeout: 15000 });
  };

  // ---- Home ----
  await gotoAndWait("/");
  ok("home: title", (await page.title()).includes("دلّني"));
  const canonical = await page.$eval('link[rel="canonical"]', (el) => el.href);
  ok("home: canonical is current origin", canonical.includes("localhost:3000/"), canonical);
  const ogImage = await page.$eval('meta[property="og:image"]', (el) => el.content);
  ok("home: og:image set", ogImage.includes("og-image.png"), ogImage);
  ok("home: faq schema", (await page.content()).includes("FAQPage"));
  ok("home: hero heading", await page.locator("h1").first().isVisible());
  ok("home: skip link", (await page.locator('a[href="#main-content"]').count()) > 0);
  ok("home: footer year", (await page.locator("footer").innerText()).includes(new Date().getFullYear().toString()));
  ok("home: nav links present", (await page.locator("nav a").count()) > 3);

  // ---- Services ----
  await gotoAndWait("/services", "#main-content", "#contact");
  ok("services: title", (await page.title()).includes("خدمات"));
  ok("services: contact form", (await page.locator("#contact input").count()) >= 4, `inputs=${await page.locator("#contact input").count()}`);
  await page.fill('#contact input[placeholder="اسمك الكامل"]', "أ");
  await page.fill('#contact input[placeholder="you@example.com"]', "qa@test.com");
  await page.fill('#contact textarea', "هذه رسالة اختبار لضمان عمل نموذج التواصل");
  await page.click('#contact button[type="submit"]');
  await page.waitForTimeout(500);
  const errText = await page.locator("#contact").innerText();
  ok("services: form validates input", errText.includes("يرجى تصحيح") || errText.includes("3 أحرف"), errText.slice(0, 120));
  await page.fill('#contact input[placeholder="اسمك الكامل"]', "اختبار جودة");
  await page.click('#contact button[type="submit"]');
  await page.waitForTimeout(2500);
  const successText = await page.locator("#contact").innerText();
  ok("services: form submits", successText.includes("تم إرسال طلبك بنجاح"), successText.slice(0, 80));

  // ---- About ----
  await gotoAndWait("/about");
  ok("about: title", (await page.title()).includes("من نحن"));

  // ---- 404 ----
  await gotoAndWait("/nonexistent");
  ok("404: page", (await page.locator("body").innerText()).includes("404"));

  // ---- Chat widget ----
  await gotoAndWait("/");
  await page.click(".fixed.bottom-6.right-6");
  await page.waitForTimeout(700);
  const input = page.locator('input[placeholder*="اكتب"], input[placeholder*="اسأل"], textarea[placeholder*="اكتب"], input[type="text"]').last();
  ok("chat: input present", (await input.count()) > 0);
  await input.fill("كيف أرفع ترتيبي على خرائط جوجل؟");
  await input.press("Enter");
  await page.waitForTimeout(1600);
  const chatText = await page.locator("body").innerText();
  ok("chat: bot replies", chatText.includes("خرائط Google") || chatText.includes("الظهور المحلي"));

  // ---- Dashboard guard ----
  await page.goto(BASE + "/dashboard", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  ok("dashboard: login guard", page.url().includes("/dashboard/login"), page.url());

  // ---- Mobile viewport ----
  await page.setViewportSize({ width: 390, height: 844 });
  await gotoAndWait("/");
  ok("mobile: page renders", await page.locator("h1").first().isVisible());
  ok("mobile: hamburger", (await page.locator('button[aria-label*="القائمة"]').count()) > 0);

  // screenshots
  await page.screenshot({ path: "qa-mobile-home.png" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await gotoAndWait("/");
  await page.screenshot({ path: "qa-desktop-home.png" });
  await gotoAndWait("/services");
  await page.screenshot({ path: "qa-desktop-services.png" });

  // ---- errors ----
  ok("no console errors", consoleErrors.length === 0, consoleErrors.slice(0, 5).join(" | "));
  ok("no page errors", pageErrors.length === 0, pageErrors.slice(0, 5).join(" | "));

  await browser.close();

  let failures = 0;
  for (const r of results) {
    console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.name}${r.detail ? "  ->  " + r.detail : ""}`);
    if (!r.pass) failures++;
  }
  console.log(`\n${results.length - failures}/${results.length} checks passed`);
  process.exit(failures ? 1 : 0);
}

run().catch((e) => {
  console.error("QA script error:", e);
  process.exit(2);
});
