import { contextFor, paintSprite, drawAvatar, drawMailbox, drawProjectArt } from './sprites.js';


// Local Devicon SVGs; related .NET/Azure tools share their platform's logo.
const techLogos = {
  'C#': 'csharp', TypeScript: 'typescript', Python: 'python', Java: 'java',
  C: 'c', 'C++': 'cplusplus', SQL: 'azuresqldatabase', Bash: 'bash',
  'ASP.NET Core': 'dotnetcore', '.NET': 'dotnetcore', 'EF Core': 'entityframeworkcore',
  'Spring Boot': 'spring', React: 'react', PostgreSQL: 'postgresql',
  'SQL Server': 'microsoftsqlserver', MySQL: 'mysql', Redis: 'redis',
  SignalR: 'dotnetcore', Azure: 'azure', Docker: 'docker',
  'GitHub Actions': 'githubactions', 'Azure Pipelines': 'azuredevops',
  Git: 'git', Postman: 'postman',
};

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function icon(name) {
  const canvas = document.createElement('canvas');
  canvas.width = 10;
  canvas.height = 10;
  canvas.setAttribute('aria-hidden', 'true');
  paintSprite(contextFor(canvas), name, 0, name === 'sprout' ? -1 : 0);
  return canvas;
}

function tags(container, items) {
  container.replaceChildren(...items.map(item => element('li', '', item)));
}

function bindProfile(profile) {
  document.querySelectorAll('[data-profile]').forEach(node => {
    node.textContent = profile[node.dataset.profile];
  });
  document.querySelectorAll('[data-profile-link]').forEach(link => {
    const key = link.dataset.profileLink;
    link.href = key === 'email' ? `mailto:${profile.email}` : profile[key];
  });
  document.querySelector('#contact-email').textContent = profile.email;
  document.querySelector('#about-greeting').textContent = profile.greeting;
  document.querySelector('#bio-accessible').textContent = profile.bio;
  document.querySelector('#education-title').textContent = profile.education.school;
  document.querySelector('#education-detail').textContent = profile.education.degree;
  document.querySelector('#education-note').textContent = profile.education.note;
}

function renderExperience(profile) {
  const list = document.querySelector('#experience-list');
  for (const job of profile.experience) {
    const entry = element('article', 'experience-entry');
    entry.append(
      element('p', 'experience-date', job.dates),
      element('h3', '', job.role),
      element('p', 'experience-company', job.company),
      element('p', 'experience-description', job.description),
    );
    list.append(entry);
  }
  const groups = document.querySelector('#skill-groups');
  for (const skill of profile.skills) {
    const group = element('section', 'skill-group');
    const heading = element('h3');
    heading.append(icon(skill.icon), document.createTextNode(skill.name));
    const inventory = element('ul', 'tech-tags');
    for (const name of skill.items) {
      const badge = element('li', 'tech-badge');
      const logo = techLogos[name];
      if (logo) {
        const image = document.createElement('img');
        image.src = `assets/tech/${logo}.svg`;
        image.alt = '';
        image.width = 20;
        image.height = 20;
        image.decoding = 'async';
        badge.append(image);
      }
      badge.append(element('span', 'tech-badge-label', name));
      inventory.append(badge);
    }
    group.append(heading, inventory);
    groups.append(group);
  }
}

function createDialogue(profile) {
  const copy = document.querySelector('#bio-typed');
  const skip = document.querySelector('#skip-typing');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let timer;
  let visited = false;

  function finish() {
    window.clearTimeout(timer);
    copy.textContent = profile.bio;
    skip.hidden = true;
  }
  finish();
  skip.addEventListener('click', finish);
  reducedMotion.addEventListener('change', event => { if (event.matches) finish(); });

  return page => {
    if (page !== 'about') {
      finish();
      return;
    }
    if (visited || reducedMotion.matches) return finish();
    visited = true;
    let count = 0;
    copy.textContent = '';
    skip.hidden = false;
    function type() {
      count += 2;
      copy.textContent = profile.bio.slice(0, count);
      if (count < profile.bio.length) timer = window.setTimeout(type, 28);
      else finish();
    }
    type();
  };
}

function createProjectJournal(projects, playSound) {
  const grid = document.querySelector('#project-grid');
  const dialog = document.querySelector('#project-dialog');
  const template = document.querySelector('#project-card-template');
  const cards = [];

  function openEntry(project) {
    document.querySelector('#project-dialog-label').textContent = project.label;
    document.querySelector('#project-dialog-title').textContent = project.title;
    document.querySelector('#project-dialog-intro').textContent = project.intro;
    document.querySelector('#project-highlights').replaceChildren(...project.highlights.map(text => element('li', '', text)));
    tags(document.querySelector('#project-stack'), project.stack);
    const links = document.querySelector('#project-links');
    links.replaceChildren();
    for (const item of project.links) {
      const url = new URL(item.url, document.baseURI);
      if (!['https:', 'http:'].includes(url.protocol)) continue;
      const link = element('a', 'paper-button', item.label);
      link.href = url.href;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      links.append(link);
    }
    links.hidden = links.childElementCount === 0;
    playSound('click');
    dialog.showModal();
  }

  for (const project of projects) {
    const card = template.content.firstElementChild.cloneNode(true);
    card.dataset.art = project.art;
    card.dataset.project = project.id;
    card.querySelector('h2').textContent = project.title;
    card.querySelector('.project-category').textContent = project.category === 'Hackathon' ? '★ Hackathon · Track winner' : project.category;
    card.querySelector('.project-description').textContent = project.description;
    tags(card.querySelector('.tech-tags'), project.stack.slice(0, 4));
    drawProjectArt(card.querySelector('canvas'), project.art);
    const button = card.querySelector('.project-open');
    button.setAttribute('aria-label', `Read journal entry: ${project.title}`);
    button.addEventListener('click', () => openEntry(project));
    cards.push({ card, category: project.category });
    grid.append(card);
  }

  function filter(category) {
    let count = 0;
    for (const entry of cards) {
      entry.card.hidden = category !== 'All' && entry.category !== category;
      if (!entry.card.hidden) count++;
    }
    document.querySelector('#entry-count').textContent = `${String(count).padStart(2, '0')} ${count === 1 ? 'ENTRY' : 'ENTRIES'}`;
    document.querySelectorAll('[data-filter]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.filter === category));
    });
  }
  document.querySelectorAll('[data-filter]').forEach(button => {
    button.addEventListener('click', () => {
      playSound('click');
      filter(button.dataset.filter);
    });
  });
  filter('All');
  document.querySelector('#project-close').addEventListener('click', () => dialog.close());
}

function enableEmailCopy(profile) {
  const button = document.querySelector('#copy-email');
  const status = document.querySelector('#copy-status');
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      status.textContent = 'Address copied. A good hello is only a paste away.';
      button.textContent = 'Copied ✓';
    } catch {
      const range = document.createRange();
      range.selectNodeContents(document.querySelector('#contact-email'));
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      status.textContent = 'Address selected. Press Ctrl+C or ⌘C to copy it.';
    }
  });
}

export async function createPortfolioViews(playSound) {
  const [profile, projects] = await Promise.all(['about', 'projects'].map(async name => {
    const response = await fetch(`data/${name}.json`);
    if (!response.ok) throw new Error(`Could not load ${name}: ${response.status}`);
    return response.json();
  }));
  bindProfile(profile);
  renderExperience(profile);
  drawAvatar(document.querySelector('#avatar-art'));
  drawMailbox(document.querySelector('#mailbox-art'));
  createProjectJournal(projects, playSound);
  enableEmailCopy(profile);
  return { enter: createDialogue(profile) };
}
