/** Title-page routing seam. Later views can replace these pending destinations. */
const pendingPages = {
  projects: 'Projects are taking root. This path opens in the next chapter.',
  about: 'A little more about me is on the way. This path is still growing.',
  contact: 'The contact page is coming next. Thanks for stopping by my little world.',
};

export function initRouter(showNotice, dismissNotice) {
  function route() {
    const page = window.location.hash.slice(1);
    if (Object.hasOwn(pendingPages, page)) showNotice(pendingPages[page]);
    else dismissNotice();
  }

  document.querySelectorAll('[data-page]').forEach(link => {
    link.addEventListener('click', () => {
      if (window.location.hash === link.hash) route();
    });
  });
  window.addEventListener('hashchange', route);
  route();
}
