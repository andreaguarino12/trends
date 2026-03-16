const revealElements = document.querySelectorAll('.reveal, .section-panel');
const cards = document.querySelectorAll('.split-card');
const tiltPanels = document.querySelectorAll('.tilt');
const body = document.body;
const stage = document.querySelector('.stage-3d');
const loader = document.getElementById('loader');
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

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

window.addEventListener('load', () => {
  setTimeout(() => loader.classList.add('is-hidden'), 1150);
  updateParallax();
});

window.addEventListener('pointermove', event => {
  const { clientX, clientY } = event;
  body.style.setProperty('--mouse-x', `${clientX}px`);
  body.style.setProperty('--mouse-y', `${clientY}px`);

  cursorDot.style.transform = `translate(${clientX - 4}px, ${clientY - 4}px)`;
  cursorRing.style.transform = `translate(${clientX - 17}px, ${clientY - 17}px)`;

  const rotateY = ((clientX / window.innerWidth) - 0.5) * 2.4;
  const rotateX = (0.5 - (clientY / window.innerHeight)) * 2.4;
  stage.style.setProperty('--rotate-stage-x', `${rotateX}deg`);
  stage.style.setProperty('--rotate-stage-y', `${rotateY}deg`);

  tiltPanels.forEach(panel => {
    const rect = panel.getBoundingClientRect();
    const px = (clientX - rect.left) / rect.width;
    const py = (clientY - rect.top) / rect.height;
    if (px >= 0 && px <= 1 && py >= 0 && py <= 1) {
      const tiltX = (0.5 - py) * 8;
      const tiltY = (px - 0.5) * 10;
      panel.style.transform = `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    }
  });
});

window.addEventListener('pointerleave', () => {
  stage.style.setProperty('--rotate-stage-x', '0deg');
  stage.style.setProperty('--rotate-stage-y', '0deg');
  tiltPanels.forEach(panel => {
    panel.style.transform = '';
  });
});

const updateParallax = () => {
  cards.forEach(card => {
    const rect = card.getBoundingClientRect();
    const centerY = rect.top + rect.height / 2;
    const viewportCenter = window.innerHeight / 2;
    const distance = (centerY - viewportCenter) / window.innerHeight;
    const direction = card.dataset.direction === 'left' ? -1 : 1;
    const shift = Math.max(-18, Math.min(18, distance * 40)) * direction;

    if (card.classList.contains('is-visible')) {
      card.style.translate = `${shift}px 0`;
    }
  });
};

window.addEventListener('scroll', updateParallax, { passive: true });
window.addEventListener('resize', updateParallax);
