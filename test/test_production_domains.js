const workerUrl = 'https://multi-subdomain-landing-page-builder.krishabro8.workers.dev';

async function testAll() {
  console.log('====================================================');
  console.log('VERIFYING PRODUCTION ROUTING ARCHITECTURE');
  console.log('====================================================\n');

  // 1. Apex Domain (careersuite.cc)
  console.log('1. Testing Apex Domain (careersuite.cc):');
  const apexRes = await fetch(`${workerUrl}/`, {
    headers: { 'Host': 'careersuite.cc' }
  });
  const apexText = await apexRes.text();
  console.log(`   HTTP Status: ${apexRes.status}`);
  console.log(`   Is CareerSuite AI Pages Site: ${apexText.includes('CareerSuite AI')}`);
  console.log(`   HTML Title: ${apexText.match(/<title>([^<]+)<\/title>/i)?.[1] || 'N/A'}`);

  // 2. WWW Domain (www.careersuite.cc)
  console.log('\n2. Testing WWW Domain (www.careersuite.cc):');
  const wwwRes = await fetch(`${workerUrl}/`, {
    headers: { 'Host': 'www.careersuite.cc' },
    redirect: 'manual'
  });
  console.log(`   HTTP Status: ${wwwRes.status}`);
  console.log(`   Redirect Location: ${wwwRes.headers.get('Location')}`);

  // 3. Subdomain 'im' (im.careersuite.cc)
  console.log('\n3. Testing Landing Page Subdomain (im.careersuite.cc):');
  const imRes = await fetch(`${workerUrl}/?subdomain=im`);
  const imText = await imRes.text();
  console.log(`   HTTP Status: ${imRes.status}`);
  console.log(`   Persona: ${imText.includes('Nethmi') ? 'Nethmi (Match)' : 'Unknown'}`);
  console.log(`   Adsterra Popunder: ${imText.includes('https://ahuramazda.org')}`);
  console.log(`   Adsterra Social Bar: ${imText.includes('https://brijmohan.org')}`);

  // 4. Subdomain 'page' (page.careersuite.cc)
  console.log('\n4. Testing Landing Page Subdomain (page.careersuite.cc):');
  const pageRes = await fetch(`${workerUrl}/?subdomain=page`);
  const pageText = await pageRes.text();
  console.log(`   HTTP Status: ${pageRes.status}`);
  console.log(`   Persona: ${pageText.includes('Sophia') ? 'Sophia (Match)' : 'Unknown'}`);
  console.log(`   Adsterra Social Bar: ${pageText.includes('https://brijmohan.org')}`);

  // 5. Admin Subdomain (admin.careersuite.cc)
  console.log('\n5. Testing Admin Subdomain (admin.careersuite.cc):');
  const adminRes = await fetch(`${workerUrl}/admin`);
  const adminText = await adminRes.text();
  console.log(`   HTTP Status: ${adminRes.status}`);
  console.log(`   Is Admin Dashboard: ${adminText.includes('Landing Page Builder - Cloudflare Dashboard')}`);

  // 6. Unknown Subdomain
  console.log('\n6. Testing Unknown Subdomain:');
  const unknownRes = await fetch(`${workerUrl}/?subdomain=nonexistent-subdomain-12345`);
  console.log(`   HTTP Status: ${unknownRes.status} (Expected: 404)`);

  console.log('\n====================================================');
  console.log('ROUTING VERIFICATION COMPLETED');
  console.log('====================================================');
}

testAll().catch(console.error);

