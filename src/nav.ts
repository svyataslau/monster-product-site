const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-nav]'));
const sections = links
  .map((a) => document.querySelector<HTMLElement>(a.getAttribute('href') || ''))
  .filter((el): el is HTMLElement => !!el);

// Smooth scroll is handled by CSS; we only highlight active section
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const id = '#' + entry.target.id;
      const link = links.find((l) => l.getAttribute('href') === id);
      if (!link) return;
      if (entry.isIntersecting) {
        links.forEach((l) => {
          l.removeAttribute('data-active');
          l.removeAttribute('aria-current');
        });
        link.setAttribute('data-active', 'true');
        link.setAttribute('aria-current', 'true');
      }
    });
  },
  { rootMargin: '-30% 0px -60% 0px', threshold: 0.01 }
);

sections.forEach((s) => observer.observe(s));


