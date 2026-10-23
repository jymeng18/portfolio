# Project: Stardew-Valley-style portfolio for Jerry

## 0. SAFETY RULES (read first, these override everything else)

### Git is forbidden
- Do NOT run ANY `git` command. This includes read-only ones (`git status`, `git diff`,
  `git log`), and also `git init`, `git add`, `git commit`, `git push`, `git pull`,
  `git checkout`, `git switch`, `git restore`, `git reset`, `git stash`, `git clean`,
  `git rm`, `git mv`.
- Do NOT use the GitHub CLI (`gh`) or any GitHub MCP tool that writes or changes
  repository state.
- Do NOT create, edit, or delete anything inside a `.git/` folder.
- I handle all version control and deployment myself.

### `rm` is forbidden
- Do NOT run any command that starts with `rm`: `rm`, `rm -rf`, `rm -r`, `rmdir`, etc.
- Do NOT get around this with equivalents that do the same thing: `unlink`, `shred`,
  `find ... -delete`, `xargs rm`, `Remove-Item`, `del`, or a script that deletes
  (`os.remove`, `shutil.rmtree`, `fs.rm`, `rimraf`).
- If a file or folder needs to be removed, do not remove it yourself. Tell me and
  I will do it.
- Everything else is fine, including editing and overwriting files and normal
  package or build commands (`npm install`, build tools, dev servers).

### Other guardrails
- Only work inside this project folder. Never touch files outside it.
- No `sudo`. No global installs. No network calls except fetching docs and
  installing packages I have approved.
- If a task seems to require a forbidden action, STOP and ask me instead.

---

## 1. Goal
Build a static portfolio website whose home page recreates the *look and feel* of a
classic farming-sim pixel-art title screen: sky gradient, drifting clouds, twinkling
stars, a big wooden sign, and three wooden menu buttons below it.

## 2. Hard rules
1. ALL art must be original. Do NOT use, trace, or embed any assets from Stardew
   Valley (logo, sign, buttons, icons, music). Recreate the style only.
2. Pixel-perfect rendering: design at a low internal resolution (320x180) and
   scale by whole-number multiples (4x -> 1280x720). Use `image-rendering: pixelated`
   on every sprite/canvas. Never use fractional scaling on sprites.
3. Tech stack: plain HTML, CSS, and vanilla JS (ES modules). NO framework and NO
   build step. The site is small, so a framework would add complexity without
   benefit.
4. Must work on desktop and mobile (scale the whole scene using integer steps
   where possible, with a layout fallback for narrow screens).

## 3. Art direction (the "Stardew look")
- Limited palette (~16-24 colors), defined once as CSS variables / a JS object.
- Dark outline on every object, 2-3 shading tones per material, light from top-left.
- Wood: warm orange-browns with darker grain lines and small metal nail dots.
- Sky: deep blue at top fading to light blue near the horizon.
- Pixel font: "Pixelify Sans" or "Silkscreen" (Google Fonts), with monospace fallback.

## 4. Sprites: generate them in code
Do not rely on AI image generation (it produces blurry, inconsistent pixel art).
Instead, define each sprite as a palette-indexed grid (array of strings or numbers)
in `sprites.js` and render it to a <canvas> or data URL at integer scale.
Needed sprites:
- Wooden sign frame (9-slice friendly so it scales cleanly) + rope corners
- 3 wooden button plates (normal + pressed state)
- Small icons for each button (e.g. folder, scroll, envelope)
- 2-3 cloud variants, a 4-point star, 2-3 leaf/vine decorations
- Pixel-art avatar of Jerry (simple, ~32x32), used in the About section
- Custom cursor (16x16 or 32x32)

## 5. Page structure
HOME (title screen)
- Wooden sign with: "JERRY" (large) + subtitle "Computing Science @ SFU"
- Three buttons: PROJECTS, ABOUT, CONTACT (each with an icon)
- Top-left: mute/unmute music-note toggle
- Bottom-right: "?" button opening a small "how to navigate" popup

PROJECTS: grid of wooden cards, one per project (title, 1-line description,
tech tags, links to GitHub/demo). Use placeholder data in `data/projects.json`.

ABOUT: game-style dialogue box with the pixel avatar, typewriter text effect,
and a short bio. Content lives in `data/about.json`.

CONTACT: wooden "mailbox" or sign with email, GitHub, LinkedIn links.

Navigation: one `index.html` with hash-based views (`#projects`, `#about`,
`#contact`) swapped by a small JS router, so the scene (sky, clouds, music)
persists between views.

## 6. Animation and interaction
- Clouds drift horizontally at different speeds (CSS keyframes, looped).
- Stars twinkle (opacity animation, staggered delays).
- Buttons: hover = brighten + 2px nudge down; active = pressed sprite.
- Click/hover sound effects (short, original or CC0). Audio only starts after the
  first user click (browser autoplay rules). Mute state persists in localStorage.
- Respect `prefers-reduced-motion`: disable drifting and twinkling.

## 7. Quality requirements
- Accessible: real <a>/<button> elements, visible focus states, alt text,
  sufficient text contrast, keyboard navigable.
- Semantic HTML, no inline styles, CSS organized by component.
- Lighthouse performance 90+; total page weight under 1 MB.
- Folder layout: index.html, /css, /js (main.js, sprites.js, router.js), /data,
  /assets, /screenshots.

## 8. Tools and skills (use them if available)
- **Playwright MCP**: open the site in a real browser and take screenshots to verify
  visual output. Required for the workflow below.
- **Context7 MCP**: look up current docs for `border-image`, Web Audio API, canvas.
- **frontend-design skill** (if installed): follow it for distinctive, intentional
  visual design, and avoid generic template looks.
- **Lighthouse / accessibility check** (if available via `npx`): verify the
  performance and accessibility targets. Do not install anything globally.

## 9. Workflow
1. Propose the palette and sprite list, then WAIT for my approval.
2. Build the home page first. Take screenshots at 1280x720 and 390x844 (saved to
   `/screenshots`, overwriting same-named files) and check: crisp pixels (no blur),
   integer scaling, nothing overflowing.
3. Fix visual issues, then build Projects, About, Contact.
4. Add animation, sound, and the reduced-motion handling.
5. Write a README with run instructions and manual GitHub Pages deploy steps
   (for me to run myself, not you).
6. End every session with a short summary: what changed, anything you think
   should be removed (I will do it), and what needs my decision.

## 10. Definition of done
Home page looks like a cohesive, original pixel-art title screen at 1280x720,
every section is reachable from the buttons, no `git` or `rm` commands were used,
and it passes the quality list above.
