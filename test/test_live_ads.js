async function testAds() {
  const baseUrl = 'https://multi-subdomain-landing-page-builder.krishabro8.workers.dev';

  // 1. Fetch 'im'
  const htmlIm = await fetch(`${baseUrl}/?subdomain=im`).then(r => r.text());
  console.log('--- Subdomain IM (Default: Both ON) ---');
  console.log('Has Popunder:', htmlIm.includes('https://ahuramazda.org/1/e0e706de726766ff4e3c4405ae3e2c85'));
  console.log('Has Social Bar:', htmlIm.includes('https://brijmohan.org/14/175f8b027cba610ca99098df0400ed06'));
  console.log('Has data-cfasync="false":', htmlIm.includes('data-cfasync="false"'));

  // 2. Login and update 'page' to Popunder OFF, Social Bar ON
  const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'AdminPassword123!' })
  });
  const { token } = await loginRes.json();
  const pages = await fetch(`${baseUrl}/api/pages`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(r => r.json());

  const pagePage = pages.find(p => p.subdomain === 'page');
  if (pagePage) {
    await fetch(`${baseUrl}/api/pages/${pagePage.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        ...pagePage,
        ad_popunder_enabled: 0,
        ad_socialbar_enabled: 1
      })
    });

    const htmlPage = await fetch(`${baseUrl}/?subdomain=page`).then(r => r.text());
    console.log('--- Subdomain PAGE (Popunder OFF, Social Bar ON) ---');
    console.log('Has Popunder:', htmlPage.includes('https://ahuramazda.org'));
    console.log('Has Social Bar:', htmlPage.includes('https://brijmohan.org'));
  }

  // 3. Admin Dashboard check
  const adminHtml = await fetch(`${baseUrl}/admin`).then(r => r.text());
  console.log('--- Admin UI check ---');
  console.log('Admin has ads:', adminHtml.includes('https://ahuramazda.org') || adminHtml.includes('https://brijmohan.org'));
}

testAds().catch(console.error);

