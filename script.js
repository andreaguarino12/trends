const revealElements = document.querySelectorAll('.reveal, .section-panel');
const body = document.body;

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

revealElements.forEach(element => observer.observe(element));

window.addEventListener('pointermove', event => {
  body.style.setProperty('--mouse-x', `${event.clientX}px`);
  body.style.setProperty('--mouse-y', `${event.clientY}px`);
});

const cards = document.querySelectorAll('.split-card');

const updateParallax = () => {
  cards.forEach(card => {
    const rect = card.getBoundingClientRect();
    const centerY = rect.top + rect.height / 2;
    const viewportCenter = window.innerHeight / 2;
    const distance = (centerY - viewportCenter) / window.innerHeight;
    const direction = card.dataset.direction === 'left' ? -1 : 1;
    const shift = Math.max(-18, Math.min(18, distance * 40)) * direction;

    card.style.transform = card.classList.contains('is-visible')
      ? `translateX(${shift}px)`
      : '';
  });
};

window.addEventListener('scroll', updateParallax, { passive: true });
window.addEventListener('resize', updateParallax);
window.addEventListener('load', updateParallax);
