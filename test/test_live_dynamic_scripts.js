const base = 'https://multi-subdomain-landing-page-builder.krishabro8.workers.dev';

async function testLiveDynamicScripts() {
  console.log('--- 1. Testing Admin UI Form Fields ---');
  const adminRes = await fetch(`${base}/admin`);
  const adminText = await adminRes.text();
  console.log('Admin Status:', adminRes.status);
  console.log('Has "Adsterra Popunder Script (Optional)":', adminText.includes('Adsterra Popunder Script (Optional)'));
  console.log('Has "Adsterra Social Bar Script (Optional)":', adminText.includes('Adsterra Social Bar Script (Optional)'));
  console.log('Has <textarea id="p-ad-popunder":', adminText.includes('<textarea id="p-ad-popunder"'));
  console.log('Has <textarea id="p-ad-socialbar":', adminText.includes('<textarea id="p-ad-socialbar"'));

  console.log('\n--- 2. Logging in to Admin API ---');
  const loginRes = await fetch(`${base}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'AdminPassword123!' })
  });
  const { token } = await loginRes.json();
  console.log('Login successful');

  console.log('\n--- 3. Updating Subdomain with Dynamic Raw Scripts ---');
  const pagesRes = await fetch(`${base}/api/pages`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const pages = await pagesRes.json();
  const target = pages.find(p => p.subdomain === 'im') || pages[0];

  const popScript = '<script data-cfasync="false" src="https://myadnetwork.example.com/live-popunder.js"></script>';
  const socialScript = '<script data-cfasync="false" src="https://myadnetwork.example.com/live-socialbar.js"></script>';

  const updateRes = await fetch(`${base}/api/pages/${target.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      ...target,
      ad_popunder: popScript,
      ad_socialbar: socialScript
    })
  });
  const updatedPage = await updateRes.json();
  console.log('Saved ad_popunder:', updatedPage.ad_popunder === popScript);
  console.log('Saved ad_socialbar:', updatedPage.ad_socialbar === socialScript);

  console.log('\n--- 4. Verifying Rendered Landing Page Output ---');
  const renderRes = await fetch(`${base}/?subdomain=${target.subdomain}`);
  const renderHtml = await renderRes.text();

  const hasPop = renderHtml.includes(popScript);
  const hasSocial = renderHtml.includes(socialScript);
  const popBeforeBody = renderHtml.indexOf(popScript) < renderHtml.indexOf('</body>');
  const socialBeforeBody = renderHtml.indexOf(socialScript) < renderHtml.indexOf('</body>');

  console.log('Includes Popunder Script tag:', hasPop);
  console.log('Includes Social Bar Script tag:', hasSocial);
  console.log('Popunder script is before </body>:', popBeforeBody);
  console.log('Social Bar script is before </body>:', socialBeforeBody);

  console.log('\n--- 5. Resetting Test Scripts to Clean State ---');
  await fetch(`${base}/api/pages/${target.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      ...target,
      ad_popunder: '',
      ad_socialbar: ''
    })
  });
  console.log('Cleaned up test scripts');

  if (hasPop && hasSocial && popBeforeBody && socialBeforeBody) {
    console.log('\n======================================================');
    console.log('✅ ALL DYNAMIC SCRIPT INJECTION TESTS PASSED ON LIVE PRODUCTION!');
    console.log('======================================================');
  } else {
    throw new Error('Script verification failed');
  }
}

testLiveDynamicScripts().catch(console.error);

