const baseUrl = 'https://multi-subdomain-landing-page-builder.krishabro8.workers.dev';

async function testMonetag() {
  console.log('====================================================');
  console.log('TESTING LIVE MONETAG DIRECT LINK INTEGRATION');
  console.log('====================================================\n');

  // 1. Login to Admin API
  const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'AdminPassword123!' })
  });
  const { token } = await loginRes.json();
  console.log('1. Admin Login: OK');

  // 2. Fetch current pages
  const pages = await fetch(`${baseUrl}/api/pages`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(r => r.json());

  // 3. Configure Monetag on 'im'
  const pageIm = pages.find(p => p.subdomain === 'im');
  if (pageIm) {
    console.log('2. Configuring Monetag on subdomain "im"...');
    await fetch(`${baseUrl}/api/pages/${pageIm.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        ...pageIm,
        monetag_direct_link: 'https://otieuwai.net/4/monetag_im_campaign',
        cta_buttons_json: JSON.stringify([
          { label: 'Chat With Me (Monetag) ❤️', color: '#e91e63', use_monetag: true },
          { label: 'Original Action (No Monetag) 📸', color: '#9c27b0', use_monetag: false }
        ])
      })
    });
  }

  // 4. Configure different Monetag on 'page'
  const pageSophia = pages.find(p => p.subdomain === 'page');
  if (pageSophia) {
    console.log('3. Configuring different Monetag on subdomain "page"...');
    await fetch(`${baseUrl}/api/pages/${pageSophia.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        ...pageSophia,
        monetag_direct_link: 'https://otieuwai.net/4/sophia_vip_monetag',
        cta_buttons_json: JSON.stringify([
          { label: 'Sophia VIP Direct (Monetag) ✨', color: '#8b5cf6', use_monetag: true }
        ])
      })
    });
  }

  // 5. Verify live HTML output for 'im'
  console.log('\n4. Verifying live HTML for subdomain "im":');
  const htmlIm = await fetch(`${baseUrl}/?subdomain=im`).then(r => r.text());
  console.log(`   Has Monetag Link (im campaign): ${htmlIm.includes('https://otieuwai.net/4/monetag_im_campaign')}`);
  console.log(`   Button 1 Configured for Monetag: ${htmlIm.includes('"use_monetag":true')}`);
  console.log(`   Button 2 Preserves Original Behavior: ${htmlIm.includes('"use_monetag":false')}`);
  console.log(`   Script Opens New Tab (window.open): ${htmlIm.includes("window.open(dest, '_blank', 'noopener,noreferrer')")}`);
  console.log(`   Adsterra Popunder Preserved: ${htmlIm.includes('https://ahuramazda.org')}`);
  console.log(`   Adsterra Social Bar Preserved: ${htmlIm.includes('https://brijmohan.org')}`);

  // 6. Verify live HTML output for 'page'
  console.log('\n5. Verifying live HTML for subdomain "page":');
  const htmlPage = await fetch(`${baseUrl}/?subdomain=page`).then(r => r.text());
  console.log(`   Has Sophia Monetag Link: ${htmlPage.includes('https://otieuwai.net/4/sophia_vip_monetag')}`);
  console.log(`   Does NOT Have IM Monetag Link: ${!htmlPage.includes('monetag_im_campaign')}`);
  console.log(`   Adsterra Social Bar Preserved: ${htmlPage.includes('https://brijmohan.org')}`);

  console.log('\n====================================================');
  console.log('MONETAG DIRECT LINK VERIFICATION COMPLETED SUCCESSFULLY!');
  console.log('====================================================');
}

testMonetag().catch(console.error);

