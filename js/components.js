/* ══════════════════════════════════════════════════════════════
    ADVENTURE 101 TOUR: Shared Components
   Injects nav and footer into every page dynamically
    Dark mode ONLY: no toggle
   ══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── Lock dark mode ───
  document.documentElement.setAttribute('data-theme', 'dark');

  // ─── Detect active page for nav highlighting ───
  const path = window.location.pathname.split('/').pop() || 'index.html';

  function isActive(href) {
    if (href === 'index.html' && (path === '' || path === 'index.html')) return true;
    return path === href;
  }

  const navLinks = [
    { href: 'index.html',    label: 'Home' },
    { href: 'tours.html',    label: 'Tours' },
    { href: 'services.html', label: 'Services' },
    { href: 'blog.html',     label: 'Journal' },
    { href: 'faq.html',      label: 'FAQ' },
    { href: 'contact.html',  label: 'Contact' },
  ];

  function buildNavLinks(mobile = false) {
    return navLinks.map(link => {
      const active = isActive(link.href) ? ' class="active"' : '';
      return `<a href="${link.href}"${active}>${link.label}</a>`;
    }).join('');
  }

  // ─── Inject NAV ───
  const navEl = document.getElementById('nav');
  if (navEl) {
    navEl.innerHTML = `
      <div class="nav__inner">
        <a href="index.html" class="nav__logo" aria-label="Adventure 101 Tour Home">
          <img src="images/logo_transparent.png" alt="Adventure 101 Tour logo" class="nav__logo-img" />
        </a>
        <nav class="nav__links" aria-label="Main navigation">
          ${buildNavLinks()}
        </nav>
        <div class="nav__actions">
          <a href="contact.html" class="btn btn--primary">Book Now</a>
          <button class="nav__burger" id="navBurger" aria-label="Open menu" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
      <div class="nav__mobile" id="navMobile" aria-hidden="true">
        ${buildNavLinks(true)}
        <a href="contact.html" class="btn btn--primary" style="margin-top:1rem;display:inline-block;">Book Now</a>
      </div>
    `;
  }

  // ─── Inject FOOTER ───
  const footerEl = document.getElementById('site-footer');
  if (footerEl) {
    footerEl.innerHTML = `
      <div class="container footer__inner">
        <div class="footer__brand">
          <a href="index.html" class="nav__logo">
            <img src="images/logo_transparent.png" alt="Adventure 101 Tour logo" class="nav__logo-img" />
          </a>
          <p class="footer__tagline">"A delightful experience at every touch point."</p>
          <p>Premium, high-end travel experiences. Registered in Nigeria — BN 3268546.</p>
          <div class="footer__social">
            <a href="https://www.instagram.com/adventure101tour" target="_blank" rel="noopener" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="https://x.com/Adventure101ng" target="_blank" rel="noopener" aria-label="X / Twitter">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4l16 16M4 20L20 4"/></svg>
            </a>
            <a href="https://wa.me/2349098640296" target="_blank" rel="noopener" aria-label="WhatsApp">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
            </a>
          </div>
        </div>

        <div class="footer__links">
          <h4>Explore</h4>
          <a href="tours.html">Tours</a>
          <a href="services.html">Services</a>
          <a href="blog.html">Journal</a>
          <a href="faq.html">FAQ</a>
        </div>

        <div class="footer__links">
          <h4>Services</h4>
          <a href="services.html#private-jet">Private Jet Charter</a>
          <a href="services.html#birth-tourism">Birth Tourism</a>
          <a href="services.html#visa">VisaDesk</a>
          <a href="services.html#bespoke">Bespoke Vacations</a>
        </div>

        <div class="footer__contact">
          <h4>Contact</h4>
          <a href="https://wa.me/2349098640296" target="_blank" rel="noopener">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
            +234 909 864 0296
          </a>
          <a href="https://wa.me/447721518621" target="_blank" rel="noopener">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
            +44 7721 518621 (UK)
          </a>
          <a href="mailto:info@adventure101tour.com">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            info@adventure101tour.com
          </a>
          <span style="font-size:var(--text-xs);color:var(--color-text-faint);display:flex;gap:4px;align-items:flex-start;margin-top:4px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0;margin-top:2px"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            No. 27, C Close, Kado Estate, Abuja
          </span>
        </div>
      </div>
      <div class="footer__bottom">
        <p>© 2026 Adventure 101 Tour Limited. All rights reserved. · BN 3268546</p>
      </div>
    `;
  }

  // ─── NAV SCROLL ───
  const nav = document.getElementById('nav');
  function updateNav() {
    if (window.scrollY > 60) nav?.classList.add('scrolled');
    else nav?.classList.remove('scrolled');
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // ─── MOBILE BURGER ───
  const burgerBtn = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('navMobile');
  if (burgerBtn && mobileMenu) {
    burgerBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      burgerBtn.setAttribute('aria-expanded', String(isOpen));
      mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    });
  }

  // Close mobile menu on link click
  document.addEventListener('click', (e) => {
    if (e.target.closest('#navMobile a')) {
      const menu = document.getElementById('navMobile');
      const burger = document.getElementById('navBurger');
      menu?.classList.remove('open');
      burger?.setAttribute('aria-expanded', 'false');
      menu?.setAttribute('aria-hidden', 'true');
    }
  });

  // ─── SCROLL REVEAL ───
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => obs.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  // ─── SMOOTH SCROLL ───
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  // ─── WHATSAPP HOVER GLOW ───
  document.querySelectorAll('a[href^="https://wa.me"]').forEach(btn => {
    btn.addEventListener('mouseenter', () => { btn.style.boxShadow = '0 0 0 6px rgba(37, 211, 102, 0.12), 0 12px 32px rgba(37, 211, 102, 0.2)'; });
    btn.addEventListener('mouseleave', () => { btn.style.boxShadow = ''; });
  });

})();
