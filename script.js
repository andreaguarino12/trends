const revealElements = document.querySelectorAll('.reveal, .section-panel');
const cards = document.querySelectorAll('.split-card');
const tiltPanels = document.querySelectorAll('.tilt');
const body = document.body;
const stage = document.querySelector('.stage-3d');
const loader = document.getElementById('loader');
const burstLayer = document.getElementById('burstLayer');
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

let lastBurstScroll = 0;

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
  updateScrollFx();
});

window.addEventListener('pointermove', event => {
  const { clientX, clientY } = event;
  body.style.setProperty('--mouse-x', `${clientX}px`);
  body.style.setProperty('--mouse-y', `${clientY}px`);

  if (cursorDot && cursorRing) {
    cursorDot.style.transform = `translate(${clientX - 4}px, ${clientY - 4}px)`;
    cursorRing.style.transform = `translate(${clientX - 18}px, ${clientY - 18}px)`;
  }

  if (stage) {
    const rotateY = ((clientX / window.innerWidth) - 0.5) * 2.8;
    const rotateX = (0.5 - (clientY / window.innerHeight)) * 2.8;
    stage.style.setProperty('--rotate-stage-x', `${rotateX}deg`);
    stage.style.setProperty('--rotate-stage-y', `${rotateY}deg`);
  }

  tiltPanels.forEach(panel => {
    const rect = panel.getBoundingClientRect();
    const px = (clientX - rect.left) / rect.width;
    const py = (clientY - rect.top) / rect.height;
    if (px >= 0 && px <= 1 && py >= 0 && py <= 1) {
      const tiltX = (0.5 - py) * 10;
      const tiltY = (px - 0.5) * 12;
      panel.style.transform = `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-2px)`;
    }
  });
});

window.addEventListener('pointerleave', () => {
  if (stage) {
    stage.style.setProperty('--rotate-stage-x', '0deg');
    stage.style.setProperty('--rotate-stage-y', '0deg');
  }

  tiltPanels.forEach(panel => {
    panel.style.transform = '';
  });
});

const spawnBurst = (x, y) => {
  if (!burstLayer) {
    return;
  }

  for (let i = 0; i < 14; i += 1) {
    const particle = document.createElement('span');
    particle.className = 'burst-particle';

    const angle = Math.random() * Math.PI * 2;
    const radius = 40 + Math.random() * 120;
    const targetX = Math.cos(angle) * radius;
    const targetY = Math.sin(angle) * radius;

    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.setProperty('--sx', '0px');
    particle.style.setProperty('--sy', '0px');
    particle.style.setProperty('--tx', `${targetX}px`);
    particle.style.setProperty('--ty', `${targetY}px`);

    burstLayer.appendChild(particle);
    setTimeout(() => particle.remove(), 920);
  }
};

const updateParallax = () => {
  cards.forEach(card => {
    const rect = card.getBoundingClientRect();
    const centerY = rect.top + rect.height / 2;
    const viewportCenter = window.innerHeight / 2;
    const distance = (centerY - viewportCenter) / window.innerHeight;
    const direction = card.dataset.direction === 'left' ? -1 : 1;
    const shift = Math.max(-22, Math.min(22, distance * 45)) * direction;
    const lift = Math.max(-30, Math.min(14, -distance * 80));

    if (card.classList.contains('is-visible')) {
      card.style.translate = `${shift}px ${lift}px`;
    }
  });
};

const updateScrollFx = () => {
  const scrollY = window.scrollY;
  const docHeight = Math.max(1, document.body.scrollHeight - window.innerHeight);
  const progress = scrollY / docHeight;

  if (stage) {
    const zShift = progress * 80;
    stage.style.transform = `perspective(1400px) rotateX(var(--rotate-stage-x)) rotateY(var(--rotate-stage-y)) translateZ(${zShift}px)`;
  }

  if (Math.abs(scrollY - lastBurstScroll) > 340) {
    lastBurstScroll = scrollY;
    const bx = Math.round(window.innerWidth * (0.2 + Math.random() * 0.6));
    const by = Math.round(window.innerHeight * (0.2 + Math.random() * 0.6));
    spawnBurst(bx, by);
  }
};

window.addEventListener('scroll', () => {
  updateParallax();
  updateScrollFx();
}, { passive: true });

window.addEventListener('resize', () => {
  updateParallax();
  updateScrollFx();
});
