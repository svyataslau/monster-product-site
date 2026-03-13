const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-nav]'));

document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href') || '';
    if (href === '#') return;
    e.preventDefault();
    document.querySelector<HTMLElement>(href)?.scrollIntoView({ behavior: 'smooth' });
  });
});
const sections = links
  .map((a) => document.querySelector<HTMLElement>(a.getAttribute('href') || ''))
  .filter((el): el is HTMLElement => !!el);

// Smooth scroll is handled by CSS; we only highlight active section
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const id = '#' + entry.target.id;
      const matched = links.filter((l) => l.getAttribute('href') === id);
      if (!matched.length) return;
      if (entry.isIntersecting) {
        links.forEach((l) => {
          l.removeAttribute('data-active');
          l.removeAttribute('aria-current');
        });
        matched.forEach((l) => {
          l.setAttribute('data-active', 'true');
          l.setAttribute('aria-current', 'true');
        });
      }
    });
  },
  { rootMargin: '-10% 0px -10% 0px', threshold: 0.01 }
);

sections.forEach((s) => observer.observe(s));


