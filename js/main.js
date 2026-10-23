import { contextFor, paintSprite, spriteCanvas, cloudCanvas, drawSign, drawMenuButton, drawUtility } from './sprites.js';
import { drawScene } from './scene.js';
import { createAudio } from './audio.js';
import { initRouter } from './router.js';
import { createPortfolioViews } from './views.js';

const world = document.querySelector('#world');
const sign = document.querySelector('#sign-art');
const landscape = document.querySelector('#landscape');
const menuLinks = [...document.querySelectorAll('.menu-button')];
const soundToggle = document.querySelector('#sound-toggle');
const soundIcon = document.querySelector('#sound-icon');
const help = document.querySelector('#help-dialog');
let compact = false;

// Keep computed dimensions in a stylesheet, without inline presentation in HTML.
const layoutSheet = new CSSStyleSheet();
document.adoptedStyleSheets = [...document.adoptedStyleSheets, layoutSheet];

function layout() {
  const width = document.documentElement.clientWidth;
  const height = window.innerHeight;
  compact = width / height < 1.2 || width < 620;
  const scale = Math.max(1, Math.floor(Math.min(width / (compact ? 130 : 320), height / (compact ? 255 : 180))));
  // An even internal width keeps the sign and menu on whole logical pixels.
  const sceneWidth = Math.ceil(width / scale / 2) * 2;
  const sceneHeight = Math.ceil(height / scale);
  layoutSheet.replaceSync(`:root { --pixel: ${scale}px; --scene-width: ${sceneWidth}; --scene-height: ${sceneHeight}; --cloud-travel: ${sceneWidth + 80}; }`);
  world.dataset.layout = compact ? 'compact' : 'wide';
  drawScene(landscape, sceneWidth, sceneHeight, compact, world.dataset.view === 'home');
  drawSign(sign, compact);
  menuLinks.forEach(link => drawMenuButton(link.querySelector('canvas'), link.dataset.page, compact));
}

document.querySelectorAll('[data-sprite]').forEach(canvas => {
  paintSprite(contextFor(canvas), canvas.dataset.sprite);
});
document.querySelectorAll('[data-ui-icon]').forEach(canvas => {
  paintSprite(contextFor(canvas), canvas.dataset.uiIcon);
});

const frameSheet = new CSSStyleSheet();
frameSheet.replaceSync(`:root {
  --wood-button-image: url("${spriteCanvas('button').toDataURL()}");
  --wood-frame-image: url("${spriteCanvas('frame').toDataURL()}");
  --leaf-image: url("${spriteCanvas('leafSmall').toDataURL()}");
}`);
document.adoptedStyleSheets = [...document.adoptedStyleSheets, frameSheet];

const cloudLayer = document.querySelector('#clouds');
[0, 1, 2, 0, 2].forEach((variant, index) => {
  const canvas = cloudCanvas(variant);
  canvas.className = `cloud cloud--${index + 1}`;
  cloudLayer.append(canvas);
});
const starLayer = document.querySelector('#stars');
for (let index = 0; index < 8; index++) {
  const canvas = spriteCanvas('sparkle');
  canvas.className = 'star';
  starLayer.append(canvas);
}

// The small original cursor is only applied when a precise pointing device exists.
const cursor = spriteCanvas('cursor').toDataURL();
const cursorSheet = new CSSStyleSheet();
cursorSheet.replaceSync(`@media (pointer: fine) { body { cursor: url("${cursor}") 0 0, auto; } a, button { cursor: url("${cursor}") 0 0, pointer; } }`);
document.adoptedStyleSheets = [...document.adoptedStyleSheets, cursorSheet];

const audio = createAudio(muted => {
  soundToggle.setAttribute('aria-pressed', String(!muted));
  soundToggle.setAttribute('aria-label', muted ? 'Turn sound on' : 'Turn sound off');
  document.querySelector('#sound-label').textContent = muted ? 'SOUND OFF' : 'SOUND ON';
  drawUtility(soundIcon, 'music', muted);
});
soundToggle.addEventListener('click', () => audio.toggle());
drawUtility(document.querySelector('#help-icon'), 'help');

menuLinks.forEach((link, index) => {
  const canvas = link.querySelector('canvas');
  const redraw = pressed => drawMenuButton(canvas, link.dataset.page, compact, pressed);
  link.addEventListener('pointerenter', () => audio.effect('hover'));
  link.addEventListener('focus', () => audio.effect('hover'));
  link.addEventListener('pointerdown', () => redraw(true));
  link.addEventListener('pointerup', () => redraw(false));
  link.addEventListener('pointercancel', () => redraw(false));
  link.addEventListener('pointerleave', () => redraw(false));
  link.addEventListener('blur', () => redraw(false));
  link.addEventListener('click', () => audio.effect('click'));
  link.addEventListener('keydown', event => {
    const direction = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    if (direction) {
      event.preventDefault();
      menuLinks[(index + direction + menuLinks.length) % menuLinks.length].focus();
    }
  });
});

document.querySelector('#help-toggle').addEventListener('click', () => {
  audio.effect('click');
  help.showModal();
});
document.querySelector('#help-close').addEventListener('click', () => help.close());
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
});

layout();
document.documentElement.classList.add('art-ready');
let pendingLayout;
new ResizeObserver(() => {
  window.cancelAnimationFrame(pendingLayout);
  pendingLayout = window.requestAnimationFrame(layout);
}).observe(world);
window.addEventListener('resize', () => {
  window.cancelAnimationFrame(pendingLayout);
  pendingLayout = window.requestAnimationFrame(layout);
});

let activePage = 'home';
let portfolioViews;
const portfolioStatus = document.querySelector('#portfolio-status');
portfolioStatus.textContent = 'Opening the journal…';
portfolioStatus.hidden = false;
createPortfolioViews(kind => audio.effect(kind)).then(views => {
  portfolioViews = views;
  portfolioStatus.hidden = true;
  views.enter(activePage);
}).catch(error => {
  portfolioStatus.setAttribute('role', 'alert');
  portfolioStatus.textContent = 'The journal could not load. Please refresh the page to try again.';
  console.error(error);
});

initRouter(page => {
  activePage = page;
  layout();
  portfolioViews?.enter(page);
});
