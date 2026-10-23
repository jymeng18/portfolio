import { palette, sprites, contextFor, paintSprite, mountainCanvas } from './sprites.js';

function rectangle(context, color, x, y, width, height = 1) {
  context.fillStyle = palette[color];
  context.fillRect(x, y, width, height);
}

function drawSky(context, width, height) {
  // Only the sky blends palette colors; every sprite keeps its exact solid colors.
  const sky = context.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, palette['sky-night']);
  sky.addColorStop(.22, palette['sky-deep']);
  sky.addColorStop(.48, palette['sky-mid']);
  sky.addColorStop(.76, palette['sky-light']);
  sky.addColorStop(1, palette.horizon);
  context.fillStyle = sky;
  context.fillRect(0, 0, width, height);
}

function drawMountains(context, width, height, compact) {
  const ground = height - 5;
  const farHeight = compact ? 53 : 59;
  const far = mountainCanvas(width, farHeight,
    [[0, 22], [.04, 18], [.12, 28], [.24, 2], [.34, 20], [.42, 13], [.52, 31], [.64, 9], [.74, 22], [.83, 5], [.94, 24], [1, 15]], 'F', 'b');
  context.drawImage(far, 0, ground - farHeight);
  const mid = mountainCanvas(width, 40,
    [[0, 8], [.08, 15], [.16, 4], [.28, 26], [.38, 19], [.5, 30], [.6, 18], [.72, 25], [.84, 7], [.93, 16], [1, 5]], 'M', 'F');
  context.drawImage(mid, 0, ground - 40);
  const near = mountainCanvas(width, 27,
    [[0, 7], [.12, 1], [.25, 12], [.4, 18], [.53, 21], [.7, 14], [.85, 2], [1, 9]], 'T', 'M');
  context.drawImage(near, 0, ground - 27);

  // Tiny pines along the distant ridge form a quiet, uneven treeline.
  for (let x = 0; x < width; x += 4) {
    const treeHeight = 3 + (x * 7) % 5;
    const y = ground - 12 + Math.floor(Math.sin(x / 29) * 4);
    rectangle(context, 'forest-far', x, y, 4, ground - y);
    for (let row = 0; row < treeHeight; row++) {
      const halfWidth = Math.floor(row / 3);
      rectangle(context, 'forest-far', x - halfWidth, y - treeHeight + row, 1 + halfWidth * 2);
    }
  }
}

function drawForeground(context, width, height, compact) {
  const base = height - 4;
  const distantColors = { G: palette['forest-far'], g: palette.forest, v: palette['forest-far'], d: palette.forest };
  const frontColors = { G: palette['green-dark'], g: palette['green-dark'], v: palette.forest, d: palette['wood-dark'] };
  paintSprite(context, 'pine', -8, base - 50, 2, distantColors);
  paintSprite(context, 'pine', width - 26, base - 48, 2, distantColors);
  paintSprite(context, 'pine', compact ? -11 : 18, base - 26, 1, distantColors);
  paintSprite(context, 'pine', compact ? width - 10 : width - 40, base - 26, 1, distantColors);
  paintSprite(context, 'pine', -15, base - 40, 2, frontColors);
  paintSprite(context, 'pine', width - 19, base - 37, 2, frontColors);

  rectangle(context, 'green-dark', 0, base, width, 4);
  rectangle(context, 'green', 0, base, width, 1);
  for (let x = 0; x < width; x += 9) paintSprite(context, 'grass', x, base - 4);
  for (const x of [12, 25, width - 31, width - 17]) {
    paintSprite(context, 'flower', x, base - 7);
  }
  if (!compact) {
    // A short, weathered fence frames the scene without filling the center.
    for (const fenceX of [34, width - 60]) {
      rectangle(context, 'wood-dark', fenceX, base - 8, 25, 3);
      rectangle(context, 'wood', fenceX, base - 8, 25, 1);
      rectangle(context, 'wood-dark', fenceX, base - 4, 25, 2);
      rectangle(context, 'wood-light', fenceX, base - 4, 25, 1);
      for (const post of [fenceX + 1, fenceX + 19]) {
        rectangle(context, 'wood-dark', post, base - 11, 4, 12);
        rectangle(context, 'wood-light', post + 1, base - 10, 1, 11);
        rectangle(context, 'wood', post + 2, base - 10, 1, 11);
        rectangle(context, 'wood-edge', post + 1, base - 11, 2);
      }
    }
  }
}

function drawRopes(context, width, compact) {
  const signWidth = compact ? 116 : 176;
  const left = Math.floor((width - signWidth) / 2);
  const signTop = compact ? 45 : 35;
  for (const x of [left + 20, left + signWidth - 23]) {
    for (let y = 0; y < signTop + 6; y += sprites.rope.length) paintSprite(context, 'rope', x, y);
  }
}

export function drawScene(canvas, width, height, compact) {
  canvas.width = width;
  canvas.height = height;
  const context = contextFor(canvas);
  drawSky(context, width, height);
  drawMountains(context, width, height, compact);
  drawForeground(context, width, height, compact);
  drawRopes(context, width, compact);
}
