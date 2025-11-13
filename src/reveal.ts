type RevealContainer = Element & { children: HTMLCollection };

const selectorGroups: string[] = [
  '.hero .hero-copy',
  '.section-title',
  '.features-grid > *',
  '.course-grid > *',
  '.testimonials-grid > *',
  '.instructors-grid > *',
  '.pricing-grid > *',
  '.faq-grid > *',
  '.about-grid > *',
  '.cta-inner',
];

function addRevealClasses(): HTMLElement[] {
  const nodes: HTMLElement[] = [];
  selectorGroups.forEach((sel) => {
    document.querySelectorAll<HTMLElement>(sel).forEach((el) => {
      el.classList.add('reveal');
      nodes.push(el);
    });
  });
  return nodes;
}

function applyStaggerDelays(): void {
  const containers: string[] = [
    '.features-grid',
    '.course-grid',
    '.testimonials-grid',
    '.instructors-grid',
    '.pricing-grid',
    '.faq-grid',
    '.about-grid',
  ];
  containers.forEach((sel) => {
    document.querySelectorAll<RevealContainer>(sel).forEach((container) => {
      Array.from(container.children).forEach((child, index) => {
        const el = child as HTMLElement;
        el.style.transitionDelay = `${Math.min(index * 80, 480)}ms`;
      });
    });
  });
}

function observeAndReveal(targets: HTMLElement[]): void {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.1,
    }
  );
  targets.forEach((el) => observer.observe(el));
}

const targets = addRevealClasses();
applyStaggerDelays();
observeAndReveal(targets);


