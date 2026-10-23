/** Optional browser verification. The website itself has no dependencies. */
import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { parseArgs } from 'node:util';

const { values } = parseArgs({
  options: {
    'playwright-module': { type: 'string', default: 'playwright' },
    'chromium-path': { type: 'string' },
    url: { type: 'string', default: 'http://127.0.0.1:8000' },
    'audio-preview': { type: 'boolean', default: false },
    'skip-audio': { type: 'boolean', default: false },
  },
});
const { chromium } = await import(values['playwright-module']);
const browser = await chromium.launch({
  executablePath: values['chromium-path'],
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

try {
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  const errors = [];
  await page.addInitScript(() => {
    window.audioContextsForTest = [];
    window.AudioContext = new Proxy(window.AudioContext, {
      construct(AudioContext, argumentsList) {
        const context = new AudioContext(...argumentsList);
        window.audioContextsForTest.push(context);
        return context;
      },
    });
  });
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text());
  });
  const viewports = [
    { width: 1280, height: 720 },
    { width: 390, height: 844 },
    { width: 320, height: 568 },
    { width: 768, height: 1024 },
    { width: 844, height: 390 },
  ];
  await page.setViewportSize(viewports[0]);
  await page.goto(values.url, { waitUntil: 'networkidle' });
  assert.equal(await page.locator('#sound-toggle').getAttribute('aria-pressed'), 'false');
  assert.equal(await page.evaluate(() => window.audioContextsForTest.length), 0, 'Audio initialized before a gesture');

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.waitForTimeout(80);
    const result = await page.evaluate(() => ({
      scale: getComputedStyle(document.documentElement).getPropertyValue('--pixel').trim(),
      layout: document.querySelector('#world').dataset.layout,
      overflow: document.documentElement.scrollWidth > innerWidth,
      integerSprites: [...document.querySelectorAll('canvas')].every(canvas => {
        const bounds = canvas.getBoundingClientRect();
        return Number.isInteger(bounds.width / canvas.width)
          && Number.isInteger(bounds.height / canvas.height);
      }),
      menuFits: [...document.querySelectorAll('.menu-button')].every(element => {
        const bounds = element.getBoundingClientRect();
        return bounds.left >= 0 && bounds.right <= innerWidth
          && bounds.top >= 0 && bounds.bottom <= innerHeight;
      }),
      touchTargetsFit: [...document.querySelectorAll('.menu-button, .utility-button')].every(element => {
        const bounds = element.getBoundingClientRect();
        return bounds.width >= 44 && bounds.height >= 44;
      }),
    }));
    assert.equal(result.overflow, false, 'Horizontal overflow');
    assert.ok(result.integerSprites, 'A sprite uses fractional scaling');
    assert.ok(result.menuFits, 'A menu button is outside the viewport');
    assert.ok(result.touchTargetsFit, 'A control has a small touch target');
    console.log(`${viewport.width}×${viewport.height}: ${JSON.stringify(result)}`);
    if (viewport.width === 1280 || viewport.width === 390) {
      const name = viewport.width === 1280 ? 'desktop-1280x720' : 'mobile-390x844';
      await page.screenshot({ path: `screenshots/${name}.png` });
    }
  }

  await page.setViewportSize(viewports[0]);
  await page.locator('[data-page="projects"]').focus();
  await page.keyboard.press('ArrowRight');
  assert.ok(await page.locator('[data-page="about"]').evaluate(element => element === document.activeElement));
  await page.keyboard.press('Enter');
  await page.locator('#about').waitFor({ state: 'visible' });
  await page.locator('#skip-typing').click();
  assert.ok((await page.locator('#bio-typed').textContent()).includes('Computing Science'));
  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    for (const destination of ['projects', 'about', 'contact']) {
      await page.locator(`[data-section="${destination}"]`).click();
      assert.equal(new URL(page.url()).hash, `#${destination}`);
      await page.locator(`#${destination}`).waitFor({ state: 'visible' });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${destination}: overflow at ${viewport.width}`);
      assert.ok(await page.locator('canvas:visible').evaluateAll(canvases => canvases.every(canvas => {
        const bounds = canvas.getBoundingClientRect();
        return Number.isInteger(bounds.width / canvas.width) && Number.isInteger(bounds.height / canvas.height);
      })), `${destination}: fractional sprite scaling`);
      if (viewport.width === 1280 || viewport.width === 390) {
        await page.screenshot({ path: `screenshots/${destination}-${viewport.width}x${viewport.height}.png`, fullPage: true });
      }
    }
  }
  await page.setViewportSize(viewports[0]);
  await page.locator('[data-section="projects"]').click();
  await page.locator('[data-filter="Hackathon"]').click();
  assert.equal(await page.locator('.project-card:visible').count(), 1);
  await page.locator('.project-open:visible').click();
  assert.ok((await page.locator('#project-dialog-title').textContent()).includes('Rehabilitation'));
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#project-dialog').evaluate(dialog => dialog.open), false);
  assert.equal(new URL(page.url()).hash, '#projects');
  assert.ok(await page.locator('.project-open:visible').evaluate(button => button === document.activeElement));
  await page.locator('[data-filter="All"]').click();
  assert.equal(await page.locator('.project-card:visible').count(), 3);
  await page.locator('[data-section="contact"]').click();
  assert.equal(await page.locator('#contact-email').textContent(), 'jma304@sfu.ca');
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.locator('#copy-email').click();
  assert.equal(await page.evaluate(() => navigator.clipboard.readText()), 'jma304@sfu.ca');
  await page.reload({ waitUntil: 'networkidle' });
  assert.ok(await page.locator('#contact').isVisible());
  await page.locator('[data-section="about"]').click();
  await page.goBack();
  assert.ok(await page.locator('#contact').isVisible());
  await page.keyboard.press('Escape');
  await page.locator('#home').waitFor({ state: 'visible' });
  console.log('PASS: all views at five sizes, deep links, history, filters, dialogs, typewriter, and clipboard');

  await page.locator('#help-toggle').click();
  await page.locator('#help-dialog').waitFor({ state: 'visible' });
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#help-dialog').evaluate(element => element.open), false);
  assert.ok(await page.locator('#help-toggle').evaluate(element => element === document.activeElement));
  console.log('PASS: help dialog, Escape, and focus restoration');

  await page.locator('#sound-toggle').click();
  assert.equal(await page.locator('#sound-toggle').getAttribute('aria-pressed'), 'true');
  await page.waitForFunction(() => window.audioContextsForTest[0]?.state === 'running');
  for (let toggle = 0; toggle < 6; toggle++) await page.locator('#sound-toggle').click();
  await page.waitForFunction(() => window.audioContextsForTest[0]?.state === 'running');
  assert.equal(await page.evaluate(() => window.audioContextsForTest.length), 1, 'Rapid toggles created duplicate audio contexts');
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true })));
  await page.waitForFunction(() => window.audioContextsForTest[0]?.state === 'suspended');
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true })));
  await page.waitForFunction(() => window.audioContextsForTest[0]?.state === 'running');
  await page.reload({ waitUntil: 'networkidle' });
  assert.equal(await page.locator('#sound-toggle').getAttribute('aria-pressed'), 'true');
  assert.equal(await page.evaluate(() => window.audioContextsForTest.length), 0, 'Remembered sound preference bypassed the gesture requirement');
  await page.locator('#sound-toggle').click();
  assert.equal(await page.locator('#sound-toggle').getAttribute('aria-pressed'), 'false');
  await page.waitForFunction(() => window.audioContextsForTest[0]?.state === 'suspended');
  console.log('PASS: autoplay protection, rapid toggles, pause/resume, and sound persistence');

  if (!values['skip-audio']) {
    const audio = await page.evaluate(async preview => {
      const { createMusic, BAR_SECONDS, LOOP_BARS, MUSIC_VOLUME } = await import('./js/music.js');
      const sampleRate = 22050;
      const loopDuration = BAR_SECONDS * LOOP_BARS;
      const context = new OfflineAudioContext(2, Math.ceil((loopDuration * 2 + 4) * sampleRate), sampleRate);
      const master = context.createGain();
      master.gain.value = MUSIC_VOLUME;
      master.connect(context.destination);
      const music = createMusic(context, master);
      for (let bar = 0; bar < LOOP_BARS * 2; bar++) music.scheduleBar(bar, .1 + bar * BAR_SECONDS);
      const buffer = await context.startRendering();
      let peak = 0;
      let energy = 0;
      let clipped = 0;
      let nonFinite = 0;
      for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
        for (const sample of buffer.getChannelData(channel)) {
          peak = Math.max(peak, Math.abs(sample));
          energy += sample * sample;
          if (Math.abs(sample) >= 1) clipped++;
          if (!Number.isFinite(sample)) nonFinite++;
        }
      }
      const left = buffer.getChannelData(0);
      const right = buffer.getChannelData(1);
      function windowRms(start, seconds) {
        const offset = Math.floor(start * sampleRate);
        const length = Math.floor(seconds * sampleRate);
        let energy = 0;
        for (let index = offset; index < offset + length; index++) energy += left[index] ** 2;
        return Math.sqrt(energy / length);
      }
      let previewPcm;
      if (preview) {
        const pcm = new Uint8Array(sampleRate * 16 * 2);
        const view = new DataView(pcm.buffer);
        for (let index = 0; index < sampleRate * 16; index++) {
          const sample = Math.max(-1, Math.min(1, (left[index] + right[index]) / 2));
          view.setInt16(index * 2, Math.round(sample * 32767), true);
        }
        let binary = '';
        for (let offset = 0; offset < pcm.length; offset += 8192) {
          binary += String.fromCharCode(...pcm.subarray(offset, offset + 8192));
        }
        previewPcm = btoa(binary);
      }
      return {
        loopDuration,
        sampleRate,
        peak,
        rms: Math.sqrt(energy / (buffer.length * buffer.numberOfChannels)),
        clipped,
        nonFinite,
        beforeLoop: windowRms(loopDuration - .3, .25),
        afterLoop: windowRms(loopDuration + .1, .25),
        previewPcm,
      };
    }, values['audio-preview']);
    assert.equal(audio.clipped, 0, 'Music clips');
    assert.equal(audio.nonFinite, 0, 'Invalid audio samples');
    assert.ok(audio.peak < .9, 'Insufficient audio headroom');
    assert.ok(audio.rms > .005, 'Music is too quiet or silent');
    assert.ok(audio.beforeLoop > .003 && audio.afterLoop > .003, 'Silence at the loop boundary');
    if (audio.previewPcm) {
      const pcm = Buffer.from(audio.previewPcm, 'base64');
      const header = Buffer.alloc(44);
      header.write('RIFF', 0);
      header.writeUInt32LE(36 + pcm.length, 4);
      header.write('WAVEfmt ', 8);
      header.writeUInt32LE(16, 16);
      header.writeUInt16LE(1, 20);
      header.writeUInt16LE(1, 22);
      header.writeUInt32LE(audio.sampleRate, 24);
      header.writeUInt32LE(audio.sampleRate * 2, 28);
      header.writeUInt16LE(2, 32);
      header.writeUInt16LE(16, 34);
      header.write('data', 36);
      header.writeUInt32LE(pcm.length, 40);
      writeFileSync('screenshots/music-preview.wav', Buffer.concat([header, pcm]));
    }
    const { previewPcm, ...audioMetrics } = audio;
    console.log(`PASS: two rendered music loops without clipping or a silent seam: ${JSON.stringify(audioMetrics)}`);

  }

  await page.emulateMedia({ reducedMotion: 'reduce' });
  assert.ok(await page.locator('.cloud, .star').evaluateAll(elements =>
    elements.every(element => getComputedStyle(element).animationPlayState === 'paused')));
  console.log('PASS: reduced-motion preference pauses decorative animation');

  const resources = await page.evaluate(() => performance.getEntriesByType('resource').map(entry => ({
    url: entry.name,
    bytes: entry.decodedBodySize,
  })));
  assert.ok(resources.every(resource => new URL(resource.url).origin === new URL(values.url).origin));
  assert.ok(resources.reduce((total, resource) => total + resource.bytes, 0) < 1_000_000);
  assert.deepEqual(errors, [], 'Unexpected browser errors');
  console.log('PASS: local assets, page weight under 1 MB, and no browser errors');
} finally {
  await browser.close();
}
