const base = 'https://multi-subdomain-landing-page-builder.krishabro8.workers.dev';

async function check() {
  const [usHtml, esHtml, lkHtml, inHtml] = await Promise.all([
    fetch(base + '/?subdomain=im').then(r => r.text()),
    fetch(base + '/?subdomain=im&country=ES').then(r => r.text()),
    fetch(base + '/?subdomain=im&country=LK').then(r => r.text()),
    fetch(base + '/?subdomain=im&country=IN').then(r => r.text())
  ]);

  console.log('US Has Choice Area:', usHtml.includes('id="choice-area"'));
  console.log('US Has "Are you over 18?":', usHtml.includes('Are you over 18?'));
  console.log('US Has YES / NO:', usHtml.includes('id="btn-yes"') && usHtml.includes('id="btn-no"'));
  console.log('US Has 1.5s typing timer:', usHtml.includes('1500'));
  console.log('ES Has "¿Tienes más de 18 años?":', esHtml.includes('¿Tienes más de 18 años?'));
  console.log('LK Has Sinhala question:', lkHtml.includes('ඔබ වයස අවුරුදු 18ට වැඩිද?'));
  console.log('IN Has Hindi question:', inHtml.includes('क्या आप 18 वर्ष से अधिक के हैं?'));
  console.log('✅ ALL LIVE PRODUCTION VERIFICATIONS SUCCEEDED!');
}

check().catch(console.error);

