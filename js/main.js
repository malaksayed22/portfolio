/* ─────────────────────────────────────────────────
   Malak Sayed Portfolio — main.js
───────────────────────────────────────────────── */
(function () {
  'use strict';

  /* ── 1. VIDEO → restart on re-entry, show scroll hint when ended ── */
  const video = document.getElementById('heroVideo');
  const scrollHint = document.getElementById('scrollHint');

  if (video) {
    const showHint = () => scrollHint && scrollHint.classList.add('visible');
    const hideHint = () => scrollHint && scrollHint.classList.remove('visible');

    video.addEventListener('ended', showHint);

    new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          video.currentTime = 0;
          video.play();
          video.playbackRate = 0.5;
          hideHint();
        }
      });
    }, { threshold: 0.5 }).observe(video);
  }

  /* ── 2. NAV: scroll-activated frosted glass ── */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  /* ── 3. MOBILE MENU ── */
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (burger && mobileMenu) {
    const toggle = (open) => {
      burger.classList.toggle('open', open);
      mobileMenu.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    };
    burger.addEventListener('click', () => toggle(!mobileMenu.classList.contains('open')));
    mobileMenu.querySelectorAll('.mobile-link').forEach(l => l.addEventListener('click', () => toggle(false)));
  }

  /* ── 4. SCROLL REVEAL ── */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  /* ── 5. ACTIVE NAV LINK ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  function updateActiveLink() {
    const scrollMid = window.scrollY + window.innerHeight * 0.35;
    let current = '';
    sections.forEach(s => {
      if (s.offsetTop <= scrollMid) current = s.id;
    });
    navLinks.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === `#${current}`);
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  /* ── 6. CUSTOM CURSOR (pointer devices only) ── */
  if (window.matchMedia('(pointer: fine)').matches) {
    const dot  = document.createElement('div');
    dot.className = 'cursor-dot';
    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    dot.style.left  = '-200px';
    dot.style.top   = '-200px';
    ring.style.left = '-200px';
    ring.style.top  = '-200px';
    document.body.append(dot, ring);

    let cx = -200, cy = -200;
    let rx = -200, ry = -200;

    document.addEventListener('mousemove', e => {
      cx = e.clientX; cy = e.clientY;
      dot.style.left  = cx + 'px';
      dot.style.top   = cy + 'px';
    });

    (function animRing() {
      rx += (cx - rx) * 0.14;
      ry += (cy - ry) * 0.14;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(animRing);
    })();

    const interactives = document.querySelectorAll('a, button, .project-card, .skill-group__pills span');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => { dot.classList.add('big'); ring.classList.add('big'); });
      el.addEventListener('mouseleave', () => { dot.classList.remove('big'); ring.classList.remove('big'); });
    });
  }

  /* ── 7. PROJECT CARD 3D TILT ── */
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const x  = (e.clientX - r.left) / r.width  - 0.5;
      const y  = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `translate(-3px,-3px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ── 8. BROWSER MOCK IFRAME SCALING ── */
  function scaleIframes() {
    document.querySelectorAll('.browser-mock__screen').forEach(screen => {
      const iframe = screen.querySelector('.browser-mock__iframe');
      if (!iframe) return;
      const w = screen.offsetWidth;
      if (!w) return;
      const scale = w / 1280;
      iframe.style.transform = 'scale(' + scale + ')';
      iframe.style.height = Math.ceil(screen.offsetHeight / scale) + 'px';
    });
  }
  scaleIframes();
  window.addEventListener('resize', scaleIframes, { passive: true });
  window.addEventListener('load', scaleIframes);

  /* ── 9. SMOOTH ANCHOR SCROLL ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 80;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' });
      }
    });
  });

})();
