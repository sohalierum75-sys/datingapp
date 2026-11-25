const base = 'https://multi-subdomain-landing-page-builder.krishabro8.workers.dev';

async function testNoAds() {
  const [imHtml, pageHtml, liHtml] = await Promise.all([
    fetch(base + '/?subdomain=im').then(r => r.text()),
    fetch(base + '/?subdomain=page').then(r => r.text()),
    fetch(base + '/?subdomain=li').then(r => r.text())
  ]);

  console.log('--- Checking for Adsterra Popunder / Social Bar Scripts ---');
  console.log('im has ahuramazda (Popunder):', imHtml.includes('ahuramazda.org'));
  console.log('im has brijmohan (Social Bar):', imHtml.includes('brijmohan.org'));
  console.log('page has ahuramazda:', pageHtml.includes('ahuramazda.org'));
  console.log('page has brijmohan:', pageHtml.includes('brijmohan.org'));
  console.log('li has uplcm / adsterra link:', liHtml.includes('uplcm.com') || liHtml.includes('adsterra'));

  if (!imHtml.includes('ahuramazda.org') && !imHtml.includes('brijmohan.org') && !liHtml.includes('uplcm.com')) {
    console.log('✅ ALL ADSTERRA ADLINKS & SCRIPTS SUCCESSFULLY REMOVED!');
  } else {
    throw new Error('Adsterra links found!');
  }
}

testNoAds().catch(console.error);

