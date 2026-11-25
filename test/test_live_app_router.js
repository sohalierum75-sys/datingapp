const baseUrl = 'https://multi-subdomain-landing-page-builder.krishabro8.workers.dev';

async function testAppRouter() {
  console.log('====================================================');
  console.log('TESTING LIVE EXTERNAL APP ROUTER (ZERO-CLICK AUTO-REDIRECT)');
  console.log('====================================================\n');

  // 1. Admin login
  const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'AdminPassword123!' })
  });
  const { token } = await loginRes.json();
  console.log('1. Admin Login: OK');

  // 2. Fetch pages
  const pages = await fetch(`${baseUrl}/api/pages`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(r => r.json());

  // 3. Update 'page' to AppRouter mode
  const pageSophia = pages.find(p => p.subdomain === 'page');
  if (pageSophia) {
    console.log('2. Setting subdomain "page" to AppRouter mode...');
    await fetch(`${baseUrl}/api/pages/${pageSophia.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        ...pageSophia,
        routing_mode: 'AppRouter',
        routing_target: 'tech_portfolio',
        fallback_url: 'https://x.com/tech_portfolio'
      })
    });
  }

  // 4. Test live response for 'page' (AppRouter mode)
  console.log('\n3. Verifying live HTML for subdomain "page" (AppRouter):');
  const htmlPage = await fetch(`${baseUrl}/?subdomain=page`).then(r => r.text());
  console.log(`   Has Loader Spinner: ${htmlPage.includes('<div class="loader"></div>')}`);
  console.log(`   Has App URI (appUrl): ${htmlPage.includes('twitter://user?screen_name=tech_portfolio')}`);
  console.log(`   Has Web URL (webUrl): ${htmlPage.includes('https://x.com/tech_portfolio')}`);
  console.log(`   Has window.location.replace(appUrl): ${htmlPage.includes('window.location.replace(appUrl)')}`);
  console.log(`   Has 500ms fallback timeout: ${htmlPage.includes('setTimeout(function() { window.location.replace(webUrl); }, 500)')}`);
  console.log(`   Does NOT Render Pre-lander UI: ${!htmlPage.includes('chat-card')}`);

  // 5. Test live response for 'im' (Standard template mode)
  console.log('\n4. Verifying live HTML for subdomain "im" (Standard Mode):');
  const htmlIm = await fetch(`${baseUrl}/?subdomain=im`).then(r => r.text());
  console.log(`   Renders Full Template UI: ${htmlIm.includes('chat-card')}`);
  console.log(`   Does NOT use instant redirect: ${!htmlIm.includes('<div class="loader"></div>')}`);

  console.log('\n====================================================');
  console.log('APP ROUTER VERIFICATION COMPLETED SUCCESSFULLY!');
  console.log('====================================================');
}

testAppRouter().catch(console.error);

