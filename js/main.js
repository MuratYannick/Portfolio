/**
 * Portfolio – Full-Stack Developer
 * Main JavaScript – Interactions, Animations, Effects
 */

'use strict';

/* ═══════════════════════════════════════════════════════════════
   LOADER
   ═══════════════════════════════════════════════════════════════ */
const loader = document.getElementById('loader');

window.addEventListener('load', () => {
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.cursor = '';
    initParticles();
    initReveal();
    initCounters();
  }, 600);
});

/* ═══════════════════════════════════════════════════════════════
   CUSTOM CURSOR (desktop only)
   ═══════════════════════════════════════════════════════════════ */
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursor-follower');

if (window.matchMedia('(pointer: fine)').matches) {
  let followerX = 0, followerY = 0;
  let curX = 0, curY = 0;

  document.addEventListener('mousemove', (e) => {
    curX = e.clientX;
    curY = e.clientY;
    cursor.style.left = curX + 'px';
    cursor.style.top  = curY + 'px';
  });

  function animateFollower() {
    followerX += (curX - followerX) * 0.12;
    followerY += (curY - followerY) * 0.12;
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover state
  const hoverTargets = 'a, button, .flip-card, .tech-card, .service-card, .filter-btn, input, textarea';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) {
      cursorFollower.classList.add('hover');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) {
      cursorFollower.classList.remove('hover');
    }
  });

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    cursorFollower.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    cursorFollower.style.opacity = '1';
  });
}

/* ═══════════════════════════════════════════════════════════════
   NAVBAR – scroll + active link + progress bar
   ═══════════════════════════════════════════════════════════════ */
const navbar      = document.getElementById('navbar');
const navProgress = document.getElementById('navProgress');
const navToggle   = document.getElementById('navToggle');
const navMenu     = document.getElementById('navMenu');
const navLinks    = document.querySelectorAll('.nav-link[data-section]');

// Scroll-based behaviour
window.addEventListener('scroll', () => {
  const scrollTop    = window.scrollY;
  const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  navbar.classList.toggle('scrolled', scrollTop > 40);
  navProgress.style.width = scrollPercent + '%';

  updateActiveLink();
}, { passive: true });

function updateActiveLink() {
  const sections = [...navLinks].map(l => l.dataset.section);
  let current = '';

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      const rect = el.getBoundingClientRect();
      if (rect.top <= 100 && rect.bottom >= 100) current = id;
    }
  });

  navLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.section === current);
  });
}

// Mobile menu
function toggleMenu() {
  const isOpen = navMenu.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

function closeMenu() {
  navMenu.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

// touchend prend la main sur mobile, preventDefault bloque le click fantôme qui suivrait
navToggle.addEventListener('touchend', (e) => {
  e.preventDefault();
  toggleMenu();
}, { passive: false });

// Fallback click pour desktop (ne se déclenche pas si touchend a déjà géré l'event)
navToggle.addEventListener('click', toggleMenu);

// Close on link click
navLinks.forEach(link => {
  link.addEventListener('click', closeMenu);
  link.addEventListener('touchend', (e) => {
    e.preventDefault();
    closeMenu();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, { passive: false });
});

// Close on outside touch/click
document.addEventListener('touchstart', (e) => {
  if (navMenu.classList.contains('open') && !navbar.contains(e.target)) {
    closeMenu();
  }
}, { passive: true });

document.addEventListener('click', (e) => {
  if (navMenu.classList.contains('open') && !navbar.contains(e.target)) {
    closeMenu();
  }
});

/* ═══════════════════════════════════════════════════════════════
   TYPEWRITER EFFECT
   ═══════════════════════════════════════════════════════════════ */
const typewriterEl = document.getElementById('typewriter');
const roles = [
  'Full-Stack',
  'React / Node.js',
  'Front-End',
  'Back-End',
  'JavaScript',
];

let roleIndex    = 0;
let charIndex    = 0;
let isDeleting   = false;
let typeTimeout;

function type() {
  const current = roles[roleIndex];

  if (isDeleting) {
    typewriterEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typewriterEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
  }

  let speed = isDeleting ? 60 : 110;

  if (!isDeleting && charIndex === current.length) {
    speed = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    speed = 400;
  }

  typeTimeout = setTimeout(type, speed);
}

// Start after loader
setTimeout(type, 1800);

/* ═══════════════════════════════════════════════════════════════
   PARTICLES (Hero)
   ═══════════════════════════════════════════════════════════════ */
function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const count   = window.innerWidth < 640 ? 20 : 40;
  const colors  = ['#6366f1', '#22d3ee', '#a855f7', '#f59e0b'];
  const frag    = document.createDocumentFragment();

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';

    const size   = Math.random() * 4 + 1.5;
    const color  = colors[Math.floor(Math.random() * colors.length)];
    const top    = Math.random() * 100;
    const left   = Math.random() * 100;
    const dur    = Math.random() * 8 + 6;
    const delay  = Math.random() * 4;
    const opacity= Math.random() * 0.5 + 0.1;
    const x1 = (Math.random() - 0.5) * 60 + 'px';
    const y1 = (Math.random() - 0.5) * 60 + 'px';
    const x2 = (Math.random() - 0.5) * 60 + 'px';
    const y2 = (Math.random() - 0.5) * 60 + 'px';

    p.style.cssText = `
      width: ${size}px; height: ${size}px;
      background: ${color};
      top: ${top}%; left: ${left}%;
      --duration: ${dur}s;
      --delay: ${delay}s;
      --opacity: ${opacity};
      --x1: ${x1}; --y1: ${y1};
      --x2: ${x2}; --y2: ${y2};
      box-shadow: 0 0 ${size * 3}px ${color};
    `;
    frag.appendChild(p);
  }

  container.appendChild(frag);
}

/* ═══════════════════════════════════════════════════════════════
   PARALLAX (Hero & Services backgrounds)
   ═══════════════════════════════════════════════════════════════ */
const heroBg     = document.getElementById('heroBg');
const servicesBg = document.getElementById('servicesBg');

// Only on devices that can handle parallax
if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;

        // Hero parallax
        if (heroBg) {
          heroBg.style.transform = `translateY(${scrollY * 0.4}px)`;
        }

        // Services parallax (offset from section top)
        if (servicesBg) {
          const section = document.getElementById('services');
          if (section) {
            const top = section.getBoundingClientRect().top + scrollY;
            const offset = scrollY - top;
            servicesBg.style.transform = `translateY(${offset * 0.2}px)`;
          }
        }

        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ═══════════════════════════════════════════════════════════════
   SCROLL REVEAL (Intersection Observer)
   ═══════════════════════════════════════════════════════════════ */
function initReveal() {
  const revealEls = document.querySelectorAll(
    '.reveal-up, .reveal-left, .reveal-right, .reveal-hero'
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach((el) => observer.observe(el));
}

/* ═══════════════════════════════════════════════════════════════
   COUNTER ANIMATION
   ═══════════════════════════════════════════════════════════════ */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((el) => observer.observe(el));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start = performance.now();

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

/* ═══════════════════════════════════════════════════════════════
   FLIP CARDS – keyboard + touch toggle
   ═══════════════════════════════════════════════════════════════ */
const flipCards = document.querySelectorAll('.flip-card');

flipCards.forEach((card) => {
  // Keyboard
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.classList.toggle('flipped');
      const flipped = card.classList.contains('flipped');
      card.setAttribute('aria-pressed', flipped);
    }
    if (e.key === 'Escape') {
      card.classList.remove('flipped');
      card.setAttribute('aria-pressed', 'false');
    }
  });

  // Touch devices: tap to flip
  let touchStart = 0;
  card.addEventListener('touchstart', (e) => {
    touchStart = e.timeStamp;
  }, { passive: true });

  card.addEventListener('touchend', (e) => {
    const duration = e.timeStamp - touchStart;
    if (duration < 300) {
      // Short tap = flip
      e.preventDefault();
      card.classList.toggle('flipped');
    }
  });
});

/* ═══════════════════════════════════════════════════════════════
   PROJECT FILTER
   ═══════════════════════════════════════════════════════════════ */
const filterBtns  = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.flip-card[data-category]');

filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    // Update active state
    filterBtns.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    const filter = btn.dataset.filter;

    projectCards.forEach((card) => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

      if (show) {
        card.classList.remove('hidden');
        requestAnimationFrame(() => {
          card.style.opacity = '1';
          card.style.transform = '';
        });
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => card.classList.add('hidden'), 300);
      }

      // Un-flip when filtering
      card.classList.remove('flipped');
    });
  });
});

/* ═══════════════════════════════════════════════════════════════
   CONTACT FORM
   ═══════════════════════════════════════════════════════════════ */
const form        = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

if (form) {
  const fields = {
    name:    { el: document.getElementById('contactName'),    err: document.getElementById('nameError') },
    email:   { el: document.getElementById('contactEmail'),   err: document.getElementById('emailError') },
    message: { el: document.getElementById('contactMessage'), err: document.getElementById('messageError') },
  };

  // Live validation
  Object.values(fields).forEach(({ el, err }) => {
    if (!el) return;
    el.addEventListener('blur', () => validateField(el, err));
    el.addEventListener('input', () => {
      if (el.classList.contains('error')) validateField(el, err);
    });
  });

  function validateField(el, errEl) {
    let message = '';
    const val = el.value.trim();

    if (el.required && !val) {
      message = 'Ce champ est requis.';
    } else if (el.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      message = 'Veuillez entrer une adresse email valide.';
    } else if (el === fields.message.el && val && val.length < 10) {
      message = 'Le message doit contenir au moins 10 caractères.';
    }

    errEl.textContent = message;
    el.classList.toggle('error', !!message);
    return !message;
  }

  function validateAll() {
    const results = Object.values(fields).map(({ el, err }) =>
      el ? validateField(el, err) : true
    );
    return results.every(Boolean);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    formSuccess.classList.remove('visible');

    if (!validateAll()) return;

    // Loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    // Simulate sending (replace with real fetch to your endpoint / EmailJS / Formspree)
    await new Promise((res) => setTimeout(res, 1800));

    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
    form.reset();
    formSuccess.classList.add('visible');

    // Hide success after 5s
    setTimeout(() => formSuccess.classList.remove('visible'), 5000);
  });
}

/* ═══════════════════════════════════════════════════════════════
   FOOTER YEAR
   ═══════════════════════════════════════════════════════════════ */
const footerYear = document.getElementById('footerYear');
if (footerYear) footerYear.textContent = new Date().getFullYear();

/* ═══════════════════════════════════════════════════════════════
   SMOOTH ANCHOR SCROLL (fallback for browsers without CSS support)
   ═══════════════════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ═══════════════════════════════════════════════════════════════
   TILT EFFECT on Service Cards (subtle, desktop only)
   ═══════════════════════════════════════════════════════════════ */
if (window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)').matches) {
  document.querySelectorAll('.service-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width / 2;
      const cy     = rect.top + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const rx     = dy * -5;
      const ry     = dx * 5;
      card.style.transform = `translateY(-6px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      card.style.transition = 'none';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = '';
    });
  });
}

/* ═══════════════════════════════════════════════════════════════
   TECH CARDS – Stagger on entry
   ═══════════════════════════════════════════════════════════════ */
function initTechStagger() {
  const categories = document.querySelectorAll('.stack-category');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const cards = entry.target.querySelectorAll('.tech-card');
        cards.forEach((card, i) => {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          card.style.transition = `opacity 0.4s ease ${i * 60}ms, transform 0.4s ease ${i * 60}ms`;
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              card.style.opacity = '1';
              card.style.transform = '';
            });
          });
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  categories.forEach((cat) => observer.observe(cat));
}

// Init after loader
window.addEventListener('load', () => {
  setTimeout(initTechStagger, 700);
});
