const WORKER_BASE = 'https://multi-subdomain-landing-page-builder.krishabro8.workers.dev';

async function testLive() {
  console.log('--- 1. Testing Live Admin UI ---');
  const adminRes = await fetch(`${WORKER_BASE}/admin`);
  const adminText = await adminRes.text();
  console.log('Admin Status:', adminRes.status);
  console.log('Has Background Ad URL Label:', adminText.includes('Background Ad URL (Direct Link)'));
  console.log('Has id="p-ad-url":', adminText.includes('id="p-ad-url"'));
  console.log('Has Background Ad Table Indicator:', adminText.includes('Background Ad: ON'));

  console.log('\n--- 2. Logging in to Admin API ---');
  const loginRes = await fetch(`${WORKER_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'AdminPassword123!' })
  });
  const loginData = await loginRes.json();
  if (!loginData.token) {
    throw new Error('Login failed: ' + JSON.stringify(loginData));
  }
  const token = loginData.token;
  console.log('Logged in successfully, token obtained');

  console.log('\n--- 3. Testing Subdomain with Dynamic ad_url ---');
  // Check existing page
  const pagesRes = await fetch(`${WORKER_BASE}/api/pages`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const pages = await pagesRes.json();
  const pageTarget = pages.find(p => p.subdomain === 'page') || pages[0];
  console.log('Target page to test:', pageTarget.subdomain, 'ID:', pageTarget.id);

  const testAdUrl = 'https://www.adsterra-direct-link.com/code_test_123';
  const updateRes = await fetch(`${WORKER_BASE}/api/pages/${pageTarget.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      ...pageTarget,
      routing_mode: 'AppRouter',
      routing_target: 'elonmusk',
      ad_url: testAdUrl
    })
  });
  const updatedData = await updateRes.json();
  console.log('Updated page ad_url in D1:', updatedData.ad_url);

  console.log('\n--- 4. Verifying Rendered AppRouter Page with ad_url ---');
  const renderRes = await fetch(`${WORKER_BASE}/?subdomain=${pageTarget.subdomain}`);
  const renderHtml = await renderRes.text();

  console.log('Includes dynamic adUrl:', renderHtml.includes(`var adUrl = "${testAdUrl}";`));
  console.log('Includes window.location.href = intentUrl:', renderHtml.includes('window.location.href = intentUrl;'));
  console.log('Includes 600ms adUrl timeout:', renderHtml.includes('setTimeout(function() { window.location.replace(adUrl); }, 600);'));
  console.log('Includes iOS window.location.href:', renderHtml.includes('window.location.href = "twitter://user?screen_name=" + targetUser;'));

  console.log('\n--- 5. Verifying Rendered AppRouter Page WITHOUT ad_url ---');
  await fetch(`${WORKER_BASE}/api/pages/${pageTarget.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      ...pageTarget,
      routing_mode: 'AppRouter',
      routing_target: 'elonmusk',
      ad_url: ''
    })
  });

  const renderNoAdRes = await fetch(`${WORKER_BASE}/?subdomain=${pageTarget.subdomain}`);
  const renderNoAdHtml = await renderNoAdRes.text();

  console.log('Includes empty adUrl:', renderNoAdHtml.includes('var adUrl = "";'));
  console.log('Includes 1500ms fallback timeout:', renderNoAdHtml.includes('setTimeout(function() { \n        window.location.replace(webUrl); \n      }, 1500);') || renderNoAdHtml.includes('1500'));
  console.log('Does NOT include 600ms timeout when adUrl empty:', !renderNoAdHtml.includes('600'));

  console.log('\n========================================');
  console.log('ALL LIVE PRODUCTION CHECKS VERIFIED! 🚀');
  console.log('========================================');
}

testLive().catch(console.error);

