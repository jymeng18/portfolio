/** Original palette-indexed art. A dot is transparent; every other cell is one pixel. */
const tokens = getComputedStyle(document.documentElement);
const names = [
  'ink', 'wood-dark', 'wood-shade', 'wood-deep', 'wood', 'wood-light',
  'wood-edge', 'cream', 'white', 'sky-night', 'sky-deep', 'sky-mid',
  'sky-light', 'horizon', 'cloud-shade', 'cloud', 'mountain-far',
  'mountain', 'forest-far', 'forest', 'green-dark', 'green', 'green-light', 'flower',
];
export const palette = Object.fromEntries(names.map(name => [name, tokens.getPropertyValue(`--${name}`).trim()]));
const colorKeys = 'odsewlhciNDBLHbCFMTfGgvp';
const colors = Object.fromEntries(names.map((name, index) => [colorKeys[index], palette[name]]));

export const sprites = {
  frame: [
    '..ddddd..', '.dswwwsd.', 'dslhhhlsd', 'dwhlllwwd', 'dwhlllwwd',
    'dswlllwsd', 'dswwwwssd', '.dsssssd.', '..ddddd..',
  ],
  button: [
    '..ddddd..', '.dswwwsd.', 'dslhhhlsd', 'dwhcccwwd', 'dwhcccwwd',
    'dswlllwsd', 'dswwwwssd', '.dsssssd.', '..ddddd..',
  ],
  buttonPressed: [
    '..ddddd..', '.dsssssd.', 'dsswwwssd', 'dswlllwsd', 'dswlllwsd',
    'dswlllwsd', 'dswlllwsd', '.dwwwwwd.', '..ddddd..',
  ],
  rope: ['ddd', 'dhd', 'dwd', 'dhd', 'dwd', 'dhd'],
  folder: [
    '.oooo.....', 'olhhlo....', 'ohhhhloooo', 'ohhhhhhhlo',
    'ohcccccclo', 'ohlllllllo', 'ohlllllllo', 'owwwwwwwo.', '.oooooooo.',
  ],
  scroll: [
    '..ooooooo.', '.ohcccchoo', '.ohccccolo', '.ohssscolo', '.ohccccoo.',
    '.ohsssco..', '.ohcccco..', 'oohccco...', 'olooooo...', '.ooooo....',
  ],
  envelope: [
    '.oooooooo.', 'ohccccccho', 'olhcccchlo', 'oclhcchlco',
    'occlhhlcco', 'occcllccco', 'occlcclcco', 'olcccccclo', '.oooooooo.',
  ],
  code: [
    '..........', '...d..d...', '..d....d..', '.d......d.', '..d....d..',
    '...d..d...', '..........', '..dddddd..', '..........', '..........',
  ],
  database: [
    '..dddddd..', '.dhhhhhd..', 'dhcccccchd',
    'dhlllllld.', 'dhcccccchd', 'dhllllllld', 'dhcccccchd',
    'dhllllllld', '.dlllllld.', '..dddddd..',
  ],
  people: [
    '..ddd.dd..', '.dhhddhd..', '.dhhddhd..',
    '..dd..dd..', '.dDDdNNd..', 'dDDDDNNNd.', 'dDDDDNNNd.', 'dDDDDNNNd.',
    '.ddddddd..', '..........',
  ],
  avatar: [
    '................................', '................................',
    '................................', '............ooooooo.............',
    '..........ooooooooooo...........', '.........ooooooooooooo..........',
    '........ooooooooooooooo.........', '........ooooooooooooooo.........',
    '........oooooohhhhooooo.........', '........oooohhhhhhhoooo.........',
    '.........oohhhhhhhhhooo.........', '.........ohhhhhhhhhhoo..........',
    '........ohhhhhohhhohhho.........', '........ohhhhhohhhohhho.........',
    '.........lhhhhhhhhhhl...........', '.........lhhhhhhhhhhl...........',
    '..........lhhsshhhhl............', '...........lhhhhhl..............',
    '............lllll...............', '............ohhho...............',
    '..........ooNhhlNoo.............', '........ooDNNNNNNNDoo...........',
    '.......oDDDDNNNNNDDDDo..........',
    '......oDDDDDDNNNDDDDDDo.........', '......oDDDDDDNNNDDDDDDo.........',
    '......oDDDDDDNNNDDDDDDo.........', '......ohDDDDDNNNDDDDho..........',
    '......ohhDDDDNNNDDDhho..........',
    '.......ooDDDDNNNDDDoo...........', '........oDDDDNNNDDDo............',
    '........oDDDDNNNDDDo............', '........oooooooooooo............',
  ],
  star: ['..c..', '..i..', 'ciiic', '..i..', '..c..'],
  sparkle: ['.c.', 'cic', '.c.'],
  sprout: [
    '.........', '.....GGG.', '.GGGGvgG.', '.GvgGGvG.', '.GGvgvG..',
    '..GGvG...', '....G....', '....G....', '....G....', '...ddd...', '..dhlhd..',
  ],
  leaf: [
    '....GGG..', '..GGvvgG.', '.GvvvgvG.', 'GvvvGvgG.', 'GgvGvgG..', '.GGvgG...', '..GGG....',
  ],
  leafSmall: ['...GG.', '.GGvgG', 'GvvvgG', 'GgvGG.', '.GG...', '.G....'],
  flower: [
    '..pp...', '.pccp..', '..pp...', '...G...', '.G.G...', '..GG...', '...G...',
  ],
  pine: [
    '..........G..........', '.........GgG.........', '.........GvgG........',
    '........GvgG.........', '.......GvvggG........', '......GvvvgggG.......',
    '.......GvgggG........', '......GvvggggG.......', '.....GvvvgggggG......',
    '....GvvvvggggggG.....', '...GvvvvvgggggggG....', '.....GvvggggggG......',
    '....GvvvgggggggG.....', '...GvvvvggggggggG....', '..GvvvvvgggggggggG...',
    '.GvvvvvvggggggggggG..', '...GvvvvggggggggG....', '..GvvvvvgggggggggG...',
    '.GvvvvvvggggggggggG..', 'GvvvvvvvgggggggggggG.', '..GvvvvvgggggggggG...',
    '.GvvvvvvggggggggggG..', 'GvvvvvvvgggggggggggG.', '........GddG.........',
    '........GddG.........', '........GddG.........',
  ],
  grass: ['..G.....', '..G..G..', '.GgG.G..', '.GgvGgG.', 'GggvgggG'],
  music: ['....ooooo', '....ohhho', '....ohhho', '....oohoo', '....o..o.', '..ooo.oo.', '.ohhoohho', '.ohhoohho', '..oo..oo.'],
  cursor: [
    'o...............', 'oo..............', 'oco.............', 'occo............',
    'occco...........', 'occcco..........', 'occccco.........', 'occcccco........',
    'occccccco.......', 'occcccccco......', 'occcoooooo......', 'occoco..........',
    'oco.oco.........', 'oo..oco.........', 'o....oco........', '.....oo.........',
  ],
};

// Original seven-row display lettering for the raised wooden title.
const titleGlyphs = {
  J: ['1111111', '0000111', '0000111', '0000111', '1110111', '1111111', '0111110'],
  E: ['1111111', '1110000', '1110000', '1111110', '1110000', '1110000', '1111111'],
  R: ['1111110', '1110111', '1110111', '1111110', '1111100', '1110110', '1110011'],
  Y: ['1110111', '1110111', '0111110', '0011100', '0011100', '0011100', '0011100'],
};

// Three-by-five lettering keeps small labels sharp without a font download.
const glyphRows = {
  A: ['010', '101', '111', '101', '101'], B: ['110', '101', '110', '101', '110'],
  C: ['011', '100', '100', '100', '011'], D: ['110', '101', '101', '101', '110'],
  E: ['111', '100', '110', '100', '111'], F: ['111', '100', '110', '100', '100'],
  G: ['011', '100', '101', '101', '011'], H: ['101', '101', '111', '101', '101'],
  I: ['111', '010', '010', '010', '111'], J: ['001', '001', '001', '101', '010'],
  K: ['101', '101', '110', '101', '101'], L: ['100', '100', '100', '100', '111'],
  M: ['101', '111', '111', '101', '101'], N: ['101', '111', '111', '111', '101'],
  O: ['010', '101', '101', '101', '010'], P: ['110', '101', '110', '100', '100'],
  Q: ['010', '101', '101', '111', '011'], R: ['110', '101', '110', '101', '101'],
  S: ['011', '100', '010', '001', '110'], T: ['111', '010', '010', '010', '010'],
  U: ['101', '101', '101', '101', '111'], V: ['101', '101', '101', '101', '010'],
  W: ['101', '101', '111', '111', '101'], X: ['101', '101', '010', '101', '101'],
  Y: ['101', '101', '010', '010', '010'], Z: ['111', '001', '010', '100', '111'],
  '@': ['01110', '10001', '10111', '10101', '01110'],
  '?': ['110', '001', '010', '000', '010'], ' ': ['00', '00', '00', '00', '00'],
};

export function contextFor(canvas) {
  const context = canvas.getContext('2d');
  context.imageSmoothingEnabled = false;
  return context;
}

export function makeCanvas(width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

export function paintSprite(context, sprite, x = 0, y = 0, scale = 1, overrides = {}) {
  const rows = typeof sprite === 'string' ? sprites[sprite] : sprite;
  rows.forEach((row, rowIndex) => {
    [...row].forEach((key, column) => {
      const color = overrides[key] || colors[key];
      if (key === '.' || !color) return;
      context.fillStyle = color;
      context.fillRect(x + column * scale, y + rowIndex * scale, scale, scale);
    });
  });
}

export function spriteCanvas(name, overrides = {}) {
  const rows = sprites[name];
  const canvas = makeCanvas(Math.max(...rows.map(row => row.length)), rows.length);
  paintSprite(contextFor(canvas), rows, 0, 0, 1, overrides);
  return canvas;
}

/** Four-pixel corners and one-pixel edge slices stretch by integer factors. */
function nineSlice(context, source, x, y, width, height) {
  const sourceStarts = [0, 4, 5];
  const sourceSizes = [4, 1, 4];
  const xStarts = [x, x + 4, x + width - 4];
  const yStarts = [y, y + 4, y + height - 4];
  const widths = [4, width - 8, 4];
  const heights = [4, height - 8, 4];
  for (let row = 0; row < 3; row++) {
    for (let column = 0; column < 3; column++) {
      context.drawImage(source, sourceStarts[column], sourceStarts[row], sourceSizes[column], sourceSizes[row], xStarts[column], yStarts[row], widths[column], heights[row]);
    }
  }
}

function rect(context, color, x, y, width, height = 1) {
  context.fillStyle = palette[color];
  context.fillRect(x, y, width, height);
}

export function woodPanel(context, x, y, width, height, pressed = false, sign = false) {
  nineSlice(context, spriteCanvas(sign ? 'frame' : pressed ? 'buttonPressed' : 'button'), x, y, width, height);
  const inset = sign ? 5 : 4;
  if (sign) {
    rect(context, 'wood-light', x + inset, y + inset, width - inset * 2, height - inset * 2);
    for (const line of [Math.floor(height / 3), Math.floor(height * 2 / 3)]) {
      rect(context, 'wood', x + inset, y + line, width - inset * 2);
      rect(context, 'wood-edge', x + inset, y + line + 1, width - inset * 2);
    }
    // Small grain marks leave the title readable rather than covering the planks.
    for (let index = 0; index < 12; index++) {
      const grainX = x + 7 + (index * 23) % (width - 25);
      const grainY = y + 7 + (index * 13) % (height - 14);
      rect(context, index % 2 ? 'wood' : 'wood-edge', grainX, grainY, 3 + index % 8);
    }
  }
  for (const nailX of [x + 3, x + width - 4]) {
    for (const nailY of [y + 4, y + height - 5]) {
      rect(context, 'wood-dark', nailX, nailY, 1, 2);
      rect(context, 'cloud-shade', nailX, nailY, 1);
    }
  }
}

export function drawText(context, text, x, y, color = 'wood-dark', scale = 1, spacing = 1) {
  context.fillStyle = palette[color];
  let cursor = x;
  for (const character of text.toUpperCase()) {
    const rows = glyphRows[character] || glyphRows[' '];
    rows.forEach((row, rowIndex) => [...row].forEach((pixel, column) => {
      if (pixel === '1') context.fillRect(cursor + column * scale, y + rowIndex * scale, scale, scale);
    }));
    cursor += (rows[0].length + spacing) * scale;
  }
}

function textWidth(text, scale = 1, spacing = 1) {
  return [...text.toUpperCase()].reduce((width, character) => width + ((glyphRows[character] || glyphRows[' '])[0].length + spacing) * scale, -spacing * scale);
}

export function centerText(context, text, width, y, color, scale = 1) {
  drawText(context, text, Math.floor((width - textWidth(text, scale)) / 2), y, color, scale);
}

function titleMask() {
  return Array.from({ length: 7 }, (_, row) => [...'JERRY'].map(letter => titleGlyphs[letter][row]).join('0'));
}

function drawTitle(context, width, y, scale) {
  const rows = titleMask();
  const x = Math.floor((width - rows[0].length * scale) / 2);
  const paint = (offsetX, offsetY, color) => paintSprite(context, rows, x + offsetX, y + offsetY, scale, { '1': palette[color] });
  // A dark outline, lower-right extrusion, and a top-left glint make raised letters.
  for (const [offsetX, offsetY] of [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1], [2, 3]]) {
    paint(offsetX, offsetY, 'wood-dark');
  }
  paint(1, 2, 'wood-shade');
  paint(0, 0, 'cream');
  rows.forEach((row, rowIndex) => [...row].forEach((pixel, column) => {
    if (pixel !== '1') return;
    if (rowIndex === 0 || rows[rowIndex - 1][column] === '0') {
      rect(context, 'white', x + column * scale, y + rowIndex * scale, scale);
    } else if (rowIndex >= 5) {
      rect(context, 'wood-edge', x + column * scale, y + rowIndex * scale + scale - 1, scale);
    }
  }));
}

export function drawSign(canvas, compact) {
  const width = compact ? 116 : 176;
  const height = compact ? 60 : 64;
  canvas.width = width;
  canvas.height = height;
  const context = contextFor(canvas);
  woodPanel(context, 3, 4, width - 6, height - 7, false, true);
  rect(context, 'wood-shade', 8, height - 5, width - 16, 2);
  centerText(context, 'THE PORTFOLIO OF', width, 11, 'wood-dark');
  drawTitle(context, width, compact ? 22 : 23, compact ? 2 : 3);
  centerText(context, 'COMPUTING SCIENCE @ SFU', width, compact ? 45 : 51, 'wood-dark');
  // Vines curl across opposing corners; all leaves share the original leaf grids.
  rect(context, 'green-dark', 1, 13, 2, 20);
  rect(context, 'green-dark', 3, 4, 14, 2);
  paintSprite(context, 'leaf', 0, 6);
  paintSprite(context, 'leafSmall', 1, 22);
  paintSprite(context, 'leafSmall', 10, 0);
  rect(context, 'green-dark', width - 5, 23, 2, 22);
  rect(context, 'green-dark', width - 17, height - 9, 14, 2);
  paintSprite(context, 'leaf', width - 11, 30);
  paintSprite(context, 'leafSmall', width - 16, height - 12);
  paintSprite(context, 'flower', width - 10, 15);
}

const menuIcons = { projects: 'folder', about: 'scroll', contact: 'envelope' };
export function drawMenuButton(canvas, page, compact, pressed = false) {
  const width = compact ? 86 : 64;
  const height = compact ? 26 : 29;
  canvas.width = width;
  canvas.height = height;
  const context = contextFor(canvas);
  woodPanel(context, 0, 0, width, height, pressed);
  const offset = pressed ? 1 : 0;
  paintSprite(context, menuIcons[page], compact ? 11 : 27, (compact ? 8 : 5) + offset);
  if (compact) drawText(context, page, 29, 10 + offset);
  else centerText(context, page, width, 19 + offset, 'wood-dark');
  rect(context, 'wood-edge', compact ? 25 : 8, compact ? 8 : 16, compact ? 1 : 48, compact ? 10 : 1);
}

export function drawUtility(canvas, kind, muted = false) {
  const context = contextFor(canvas);
  context.clearRect(0, 0, 16, 16);
  woodPanel(context, 0, 0, 16, 16);
  if (kind === 'help') drawText(context, '?', 5, 4, 'wood-dark');
  else {
    paintSprite(context, 'music', 3, 3);
    if (muted) {
      for (let index = 0; index < 9; index++) {
        rect(context, 'cream', 3 + index, 3 + index, 2);
        rect(context, 'wood-dark', 3 + index, 4 + index, 1);
      }
    }
  }
}

/** Small original illustrations use palette grids, just like the title sprites. */
function rectangleGrid(width, height, rectangles) {
  const grid = Array.from({ length: height }, () => Array(width).fill('.'));
  for (const [color, x, y, boxWidth, boxHeight] of rectangles) {
    for (let row = y; row < Math.min(height, y + boxHeight); row++) {
      for (let column = x; column < Math.min(width, x + boxWidth); column++) grid[row][column] = color;
    }
  }
  return grid.map(row => row.join(''));
}

export function drawAvatar(canvas) {
  const context = contextFor(canvas);
  paintSprite(context, rectangleGrid(32, 32, [
    ['L', 0, 0, 32, 32], ['H', 0, 20, 32, 12],
    ['F', 0, 24, 32, 8], ['M', 0, 27, 32, 5], ['g', 0, 30, 32, 2],
  ]));
  paintSprite(context, 'avatar');
  paintSprite(context, 'leafSmall', 0, 23);
  paintSprite(context, 'flower', 25, 25);
}

export function drawProjectArt(canvas, kind) {
  const context = contextFor(canvas);
  context.clearRect(0, 0, 64, 32);
  const common = [
    ['o', 9, 3, 46, 27], ['c', 10, 4, 44, 25], ['w', 10, 4, 44, 4],
    ['h', 12, 5, 2, 1], ['h', 16, 5, 2, 1], ['h', 20, 5, 2, 1],
  ];
  const scenes = {
    canvas: [
      ...common, ['h', 12, 11, 4, 15], ['s', 13, 13, 2, 2], ['g', 13, 18, 2, 2],
      ['D', 13, 23, 2, 2], ['g', 22, 20, 4, 4], ['g', 25, 17, 4, 7],
      ['v', 28, 14, 3, 10], ['D', 32, 19, 4, 5], ['L', 35, 16, 4, 8],
      ['p', 39, 12, 3, 3], ['s', 45, 22, 1, 6], ['s', 46, 23, 1, 3],
      ['s', 47, 24, 1, 1], ['c', 49, 26, 5, 3],
    ],
    rehab: [
      ...common, ['L', 12, 10, 28, 17], ['o', 23, 11, 5, 5], ['h', 24, 12, 3, 3],
      ['D', 23, 17, 5, 8], ['D', 19, 17, 4, 2], ['D', 17, 13, 2, 6],
      ['D', 28, 18, 5, 2], ['D', 32, 15, 2, 4], ['o', 23, 25, 2, 3],
      ['o', 27, 25, 2, 3], ['c', 24, 18, 2, 2], ['c', 25, 23, 2, 2],
      ['g', 43, 12, 8, 2], ['h', 43, 17, 8, 2], ['w', 43, 22, 5, 2],
    ],
    diagrams: [
      ...common, ['M', 31, 13, 2, 8], ['M', 20, 20, 25, 2],
      ['M', 20, 20, 2, 5], ['M', 43, 20, 2, 5],
      ['o', 25, 10, 14, 7], ['h', 26, 11, 12, 5], ['c', 28, 12, 7, 1],
      ['o', 14, 23, 14, 6], ['L', 15, 24, 12, 4],
      ['o', 37, 23, 14, 6], ['v', 38, 24, 12, 4],
    ],
  };
  paintSprite(context, rectangleGrid(64, 32, scenes[kind] || common));
}

export function drawMailbox(canvas) {
  const context = contextFor(canvas);
  context.clearRect(0, 0, 64, 64);
  paintSprite(context, rectangleGrid(64, 64, [
    ['H', 8, 55, 49, 5], ['v', 13, 57, 42, 3], ['G', 8, 59, 49, 2],
    ['d', 28, 32, 7, 27], ['w', 29, 33, 5, 25], ['h', 29, 33, 1, 25],
    ['d', 23, 35, 17, 4], ['w', 24, 35, 15, 2],
    ['o', 17, 17, 31, 18], ['o', 20, 14, 25, 3], ['o', 23, 12, 19, 3],
    ['D', 18, 18, 29, 15], ['B', 21, 15, 23, 3], ['L', 24, 13, 17, 2],
    ['L', 19, 18, 2, 13], ['N', 36, 17, 10, 16],
    ['o', 35, 17, 1, 16], ['c', 41, 25, 3, 1],
    ['d', 25, 11, 2, 11], ['p', 25, 6, 11, 7], ['h', 27, 7, 8, 1],
    ['d', 25, 20, 2, 2], ['o', 14, 27, 13, 9],
    ['c', 15, 28, 11, 6], ['h', 16, 29, 9, 1],
    ['w', 18, 30, 5, 1], ['w', 20, 31, 2, 1],
  ]));
  paintSprite(context, 'flower', 11, 52);
  paintSprite(context, 'flower', 45, 52);
  paintSprite(context, 'grass', 19, 55);
  paintSprite(context, 'grass', 36, 55);
  paintSprite(context, 'sparkle', 48, 12);
  paintSprite(context, 'sparkle', 9, 18);
}

/** Cloud outlines are rasterized into a palette grid before reaching the canvas. */
export function cloudCanvas(variant) {
  const clouds = [
    { width: 63, height: 18, lobes: [[1, 10, 61, 5], [7, 6, 17, 9], [15, 4, 21, 12], [22, 1, 19, 15], [37, 6, 15, 10], [48, 9, 12, 6]] },
    { width: 43, height: 14, lobes: [[1, 9, 41, 3], [5, 5, 15, 7], [13, 1, 15, 11], [25, 5, 10, 7], [33, 8, 7, 4]] },
    { width: 33, height: 11, lobes: [[1, 7, 31, 2], [4, 4, 11, 5], [11, 1, 12, 8], [20, 5, 8, 4]] },
  ];
  const { width, height, lobes } = clouds[variant];
  const grid = Array.from({ length: height }, () => Array(width).fill('.'));
  for (const [x, y, lobeWidth, lobeHeight] of lobes) {
    for (let row = y; row < y + lobeHeight; row++) {
      for (let column = x; column < x + lobeWidth; column++) grid[row][column] = 'C';
    }
  }
  for (let row = 0; row < height; row++) {
    for (let column = 0; column < width; column++) {
      if (grid[row][column] === '.') continue;
      if (row >= height - 4) grid[row][column] = 'b';
      else if (row >= height - 6) grid[row][column] = 'H';
      else if (grid[row - 1]?.[column] === '.' || grid[row][column - 1] === '.') grid[row][column] = 'i';
    }
  }
  const canvas = makeCanvas(width, height);
  paintSprite(contextFor(canvas), grid.map(row => row.join('')));
  return canvas;
}

/** Each mountain range is an original raster grid derived from a stepped ridge. */
export function mountainCanvas(width, height, peaks, base, shade) {
  const ridge = Array(width).fill(height);
  const points = peaks.map(([x, y]) => [Math.round(x * width), y]);
  for (let index = 0; index < points.length - 1; index++) {
    const [startX, startY] = points[index];
    const [endX, endY] = points[index + 1];
    for (let x = Math.max(0, startX); x <= Math.min(width - 1, endX); x++) {
      ridge[x] = Math.round(startY + (endY - startY) * (x - startX) / Math.max(1, endX - startX));
    }
  }
  const canvas = makeCanvas(width, height);
  const context = contextFor(canvas);
  for (let y = 0; y < height; y++) {
    const row = ridge.map((top, x) => y < top ? '.' : y < top + 2 && x % 7 < 4 ? shade : base).join('');
    paintSprite(context, [row], 0, y);
  }
  return canvas;
}
