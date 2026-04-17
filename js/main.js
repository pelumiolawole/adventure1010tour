/* ══════════════════════════════════════════════════════════════
   ADVENTURE 101 TOUR — Main JavaScript
   Scroll reveals, nav behaviour, theme toggle, interactions
   ══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── THEME TOGGLE ─── */
  const themeToggle = document.querySelector('[data-theme-toggle]');
  const html = document.documentElement;
  let currentTheme = html.getAttribute('data-theme') || 'dark';

  const sunIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`;
  const moonIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    currentTheme = theme;
    if (themeToggle) {
      themeToggle.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
      themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    }
  }

  applyTheme(currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
  }

  /* ─── NAV SCROLL BEHAVIOUR ─── */
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav__links a, .nav__mobile a');
  let lastScrollY = 0;

  function updateNav() {
    const scrollY = window.scrollY;
    if (scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScrollY = scrollY;
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ─── MOBILE MENU ─── */
  const burger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('navMobile');

  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      burger.setAttribute('aria-expanded', isOpen);
      mobileMenu.setAttribute('aria-hidden', !isOpen);
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
      });
    });
  }

  /* ─── SCROLL REVEAL ─── */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: show all immediately
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ─── HERO IMAGE PARALLAX + LOADED CLASS ─── */
  const heroSection = document.querySelector('.hero');
  const heroImg = document.querySelector('.hero__img');

  if (heroSection && heroImg) {
    // Trigger subtle Ken Burns effect once image is loaded
    if (heroImg.complete) {
      heroSection.classList.add('hero--loaded');
    } else {
      heroImg.addEventListener('load', () => heroSection.classList.add('hero--loaded'));
    }

    // Subtle parallax on scroll
    function heroParallax() {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        const offset = scrollY * 0.3;
        heroImg.style.transform = `scale(1) translateY(${offset}px)`;
      }
    }
    window.addEventListener('scroll', heroParallax, { passive: true });
  }

  /* ─── SMOOTH ACTIVE NAV LINK HIGHLIGHT ─── */
  const sections = document.querySelectorAll('section[id]');

  function highlightActiveSection() {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightActiveSection, { passive: true });

  /* ─── TOUR CARD HOVER — micro-sound-like tactile feedback ─── */
  const tourCards = document.querySelectorAll('.tour-card:not(.tour-card--cta)');
  tourCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.willChange = 'transform, box-shadow';
    });
    card.addEventListener('mouseleave', () => {
      card.style.willChange = 'auto';
    });
  });

  /* ─── LUCIDE ICONS INIT ─── */
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  } else {
    // Retry after a tick if loaded async
    document.addEventListener('DOMContentLoaded', () => {
      if (typeof lucide !== 'undefined') lucide.createIcons();
    });
    setTimeout(() => {
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }, 500);
  }

  /* ─── MOTION LIBRARY — enhanced scroll animations (if available) ─── */
  function initMotionAnimations() {
    if (typeof Motion === 'undefined') return;

    const { animate, scroll, inView } = Motion;

    // Counter animation for hero stats
    const statNums = document.querySelectorAll('.hero__stat-num');
    statNums.forEach(el => {
      const text = el.textContent.trim();
      el.style.opacity = '0';
      el.style.transform = 'translateY(12px)';

      inView(el, () => {
        animate(el, { opacity: 1, y: [12, 0] }, { duration: 0.6, delay: 0.2, easing: [0.16, 1, 0.3, 1] });
      }, { margin: '-20% 0px' });
    });

    // Stagger tour cards using Motion
    const cards = document.querySelectorAll('.tour-card');
    inView('.tours__grid', () => {
      cards.forEach((card, i) => {
        animate(card, { opacity: [0, 1], y: [30, 0] }, {
          duration: 0.55,
          delay: i * 0.08,
          easing: [0.16, 1, 0.3, 1]
        });
      });
    }, { margin: '-15% 0px' });
  }

  // Init after a short delay to ensure Motion is loaded
  setTimeout(initMotionAnimations, 300);

  /* ─── DESTINATIONS BAR — pause on hover ─── */
  const destTrack = document.querySelector('.destinations-bar__track');
  if (destTrack) {
    destTrack.addEventListener('mouseenter', () => {
      destTrack.style.animationPlayState = 'paused';
    });
    destTrack.addEventListener('mouseleave', () => {
      destTrack.style.animationPlayState = 'running';
    });
  }

  /* ─── SMOOTH SCROLL for anchor links ─── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ─── WHATSAPP PULSE BUTTON (subtle) ─── */
  const whatsappBtns = document.querySelectorAll('a[href^="https://wa.me"]');
  whatsappBtns.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      btn.style.boxShadow = '0 0 0 6px rgba(37, 211, 102, 0.15), 0 12px 32px rgba(37, 211, 102, 0.25)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.boxShadow = '';
    });
  });

})();
