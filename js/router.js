/** Hash-based views keep the landscape, music, and browser history intact. */
const titles = {
  home: 'Jerry Meng · A little world of my own',
  projects: 'The project journal · Jerry Meng',
  about: 'A little about me · Jerry Meng',
  contact: "Jerry's mailbox · Jerry Meng",
};

export function initRouter(onChange) {
  let current;

  function route(initial = false) {
    const requested = window.location.hash.slice(1);
    const page = Object.hasOwn(titles, requested) ? requested : 'home';
    if (page === current) return;
    const previous = current;
    current = page;
    document.querySelector('#world').dataset.view = page;
    document.querySelector('#home').hidden = page !== 'home';
    document.querySelector('#portfolio').hidden = page === 'home';
    document.querySelectorAll('.portfolio-view').forEach(view => { view.hidden = view.id !== page; });
    document.querySelectorAll('[data-section]').forEach(link => {
      if (link.dataset.section === page) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    document.querySelectorAll('dialog[open]').forEach(dialog => dialog.close());
    document.title = titles[page];
    window.scrollTo(0, 0);
    onChange(page);

    if (!initial) {
      const target = page === 'home'
        ? document.querySelector(`.menu-button[data-page="${previous || 'projects'}"]`)
        : document.querySelector(`#${page}-title`);
      target?.focus({ preventScroll: true });
    }
  }

  document.querySelector('.skip-link').addEventListener('click', event => {
    event.preventDefault();
    const target = current === 'home' ? document.querySelector('.menu-button') : document.querySelector(`#${current}-title`);
    target.focus();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && current !== 'home' && !document.querySelector('dialog[open]')) {
      window.location.hash = 'home';
    }
  });
  window.addEventListener('hashchange', () => route());
  route(true);
}
