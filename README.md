# Jerry's little world

An original pixel-art portfolio title screen, built with HTML, CSS, and vanilla
JavaScript ES modules. There are no dependencies, external assets, or build step.

## Run locally

From this directory, run:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000`. Use a local server rather than opening `index.html`
directly: browsers require HTTP to load ES modules.

## This stage

- Original wooden sign, raised lettering, vines, menu plates, icons, clouds,
  mountains, trees, flowers, and cursor, rendered from code at integer scales.
- A shared 24-color palette in `css/styles.css`.
- A 320×180 scene at 4× for 1280×720, with a separately composed portrait layout.
- Drifting clouds and twinkling stars that pause for reduced-motion preferences.
- Optional original synthesized music and interaction sounds. Sound starts only
  after a user gesture; the preference persists when local storage is available.
- Keyboard navigation, visible focus, a help dialog, and accessible HTML labels
  for canvas artwork.

This stage implements **only the title page**. Projects, About, and Contact show
an honest “still growing” message; they are extension points in `js/router.js`.

## Files

| File | Responsibility |
| --- | --- |
| `index.html` | Semantic page, menu, controls, help dialog |
| `css/styles.css` | Palette, components, responsive layout, motion preferences |
| `js/sprites.js` | Original palette grids, pixel lettering, sprite rendering |
| `js/scene.js` | Sky, landscape, foreground, hanging ropes |
| `js/main.js` | Integer layout, controls, sprite setup, interactions |
| `js/audio.js` | Original synthesized music and sounds |
| `js/router.js` | Hash navigation and pending destination feedback |
| `scripts/verify.mjs` | Optional Playwright checks and screenshot capture |
| `screenshots/` | Browser-verified desktop and mobile previews |

The tiny text on signs is drawn from original bitmap glyphs, with equivalent
HTML text for assistive technology. Supporting text uses a local monospace
fallback; no font service is required.

## Verification

Browser checks passed at 1280×720, 390×844, 320×568, 768×1024, and 844×390:
every sprite uses integer scaling, menu buttons stay in the viewport, there is
no horizontal overflow, and controls have touch targets of at least 44×44 px.
Keyboard navigation, route messages, dialog focus restoration, sound persistence,
and reduced-motion behavior also passed, with no browser errors.

The two saved previews are `screenshots/desktop-1280x720.png` and
`screenshots/mobile-390x844.png`.

To repeat the checks with Playwright already available in your environment,
start the local server and run `node scripts/verify.mjs`. The optional
`--playwright-module` and `--chromium-path` arguments accept explicit paths for
an existing installation. No test packages are installed by this project.

Lighthouse was not installed, so a numerical Lighthouse score has not been measured.

## Manual GitHub Pages deployment

You handle version control and deployment. When ready:

1. Commit and push the site files to your repository using your usual workflow.
2. In the repository's **Settings → Pages**, select **Deploy from a branch**.
3. Choose your publishing branch and **/ (root)**, then save.
4. Open the URL GitHub displays once deployment completes.

All asset paths are relative, so the site also works under a repository subpath.
See GitHub's [publishing-source guide](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
for the deployment settings.
