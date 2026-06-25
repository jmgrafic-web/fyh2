/**
 * FYH – Find Your House | Main JS
 * Vanilla ES6 · GSAP · ScrollTrigger · Lenis
 */

/* ============================================================
   1. LANGUAGE DETECTION & REDIRECT
   ============================================================ */
function detectAndRedirect() {
  // Only run on the root index
  if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') return;

  const lang = (navigator.language || navigator.userLanguage || 'en').slice(0, 2).toLowerCase();
  const map  = { nl: '/nl/', fr: '/fr/', es: '/es/' };
  const dest = map[lang] || '/en/';

  // Don't redirect if already in a language folder
  const inLangFolder = /^\/(en|es|fr|nl)\//i.test(window.location.pathname);
  if (!inLangFolder) {
    window.location.replace(dest);
  }
}

/* ============================================================
   2. SMOOTH SCROLL — LENIS
   ============================================================ */
let lenis;

function initLenis() {
  if (typeof Lenis === 'undefined') return;

  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    smoothWheel: true,
    smoothTouch: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Connect to GSAP ScrollTrigger if available
  if (typeof ScrollTrigger !== 'undefined') {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }
}

/* ============================================================
   3. NAVIGATION
   ============================================================ */
function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  // Scroll-based nav state
  const threshold = 80;
  function updateNav() {
    if (window.scrollY > threshold) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // Mobile menu
  const hamburger = nav.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.nav__mobile');
  const mobileClose = document.querySelector('.nav__mobile-close');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.style.display = 'flex';
      requestAnimationFrame(() => mobileMenu.classList.add('open'));
      document.body.style.overflow = 'hidden';
    });

    function closeMenu() {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
      setTimeout(() => { mobileMenu.style.display = 'none'; }, 600);
    }

    if (mobileClose) mobileClose.addEventListener('click', closeMenu);
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  }

  // Active lang
  const langLinks = nav.querySelectorAll('.nav__lang a');
  langLinks.forEach(a => {
    const href = a.getAttribute('href') || '';
    if (window.location.pathname.includes(href.replace(/\//g, '')) || 
        (href.includes('/en/') && window.location.pathname.includes('/en/'))) {
      a.classList.add('active');
    }
  });
}

/* ============================================================
   4. HERO ENTRANCE
   ============================================================ */
function initHeroEntrance() {
  const hero = document.querySelector('.hero');
  if (!hero || typeof gsap === 'undefined') return;

  const tl = gsap.timeline({ delay: 0.3 });

  const eyebrow  = hero.querySelector('.hero__eyebrow');
  const title    = hero.querySelector('.hero__title');
  const subtitle = hero.querySelector('.hero__subtitle');
  const actions  = hero.querySelector('.hero__actions');
  const scroll   = hero.querySelector('.hero__scroll');
  const img      = hero.querySelector('.hero__media img, .hero__media video');

  if (img) {
    tl.to(img, { scale: 1, duration: 2, ease: 'power2.out' }, 0);
  }
  if (eyebrow)  tl.to(eyebrow,  { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.2);
  if (title)    tl.to(title,    { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' }, 0.4);
  if (subtitle) tl.to(subtitle, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.65);
  if (actions)  tl.to(actions,  { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.85);
  if (scroll)   tl.to(scroll,   { opacity: 1, duration: 0.7 }, 1.2);
}

/* ============================================================
   5. HERO PARALLAX
   ============================================================ */
function initHeroParallax() {
  const media = document.querySelector('.hero__media');
  if (!media || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.to(media, {
    yPercent: 20,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    }
  });
}

/* ============================================================
   6. SCROLL REVEAL
   ============================================================ */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    els.forEach(el => io.observe(el));
  } else {
    els.forEach(el => el.classList.add('in-view'));
  }
}

/* ============================================================
   7. HOW IT WORKS — STEP ANIMATION
   ============================================================ */
function initHowItWorks() {
  const steps = document.querySelectorAll('.how__step');
  if (!steps.length) return;

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        } else {
          entry.target.classList.remove('active');
        }
      });
    }, { threshold: 0.5 });

    steps.forEach(step => io.observe(step));
  }
}

/* ============================================================
   8. GSAP SCROLL ANIMATIONS
   ============================================================ */
function initGSAPAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Hook section image parallax
  const hookImg = document.querySelector('.hook__right img');
  if (hookImg) {
    gsap.fromTo(hookImg, { scale: 1.1 }, {
      scale: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hook',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
      }
    });
  }

  // Region cards stagger
  const regionCards = gsap.utils.toArray('.region-card');
  if (regionCards.length) {
    gsap.from(regionCards, {
      opacity: 0,
      y: 40,
      stagger: 0.15,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.regions__cards',
        start: 'top 80%',
        toggleActions: 'play none none none',
      }
    });
  }

  // Service cards stagger
  const serviceCards = gsap.utils.toArray('.service-card');
  if (serviceCards.length) {
    gsap.from(serviceCards, {
      opacity: 0,
      y: 30,
      stagger: 0.08,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.services__grid',
        start: 'top 80%',
        toggleActions: 'play none none none',
      }
    });
  }

  // Why pillars counter animation
  const pillars = document.querySelectorAll('.why__pillar-number');
  pillars.forEach((el, i) => {
    gsap.from(el, {
      opacity: 0,
      x: -20,
      delay: i * 0.1,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      }
    });
  });

  // Article cards
  const articleCards = gsap.utils.toArray('.article-card');
  if (articleCards.length) {
    gsap.from(articleCards, {
      opacity: 0,
      y: 24,
      stagger: 0.1,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.journal__grid',
        start: 'top 85%',
        toggleActions: 'play none none none',
      }
    });
  }
}

/* ============================================================
   9. JOURNAL FILTERS
   ============================================================ */
function initJournalFilters() {
  const filters  = document.querySelectorAll('.journal__filter');
  const articles = document.querySelectorAll('.article-card');
  if (!filters.length || !articles.length) return;

  filters.forEach(filter => {
    filter.addEventListener('click', () => {
      // Active state
      filters.forEach(f => f.classList.remove('active'));
      filter.classList.add('active');

      const cat = filter.dataset.filter;

      articles.forEach(card => {
        if (cat === 'all' || card.dataset.cat === cat) {
          card.style.display = '';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ============================================================
   10. DYNAMIC ARTICLES FROM JSON
   ============================================================ */
async function loadArticles() {
  const grid = document.getElementById('journal-grid');
  if (!grid) return;

  try {
    // Adjust path for nested pages
    const depth = (window.location.pathname.match(/\//g) || []).length - 1;
    const prefix = depth > 1 ? '../'.repeat(depth - 1) : '';
    const res    = await fetch(`${prefix}articles/articles.json`);
    const data   = await res.json();

    grid.innerHTML = data.articles.slice(0, 6).map(a => `
      <article class="article-card" data-cat="${a.category}">
        <a href="${a.url}" class="article-card__image">
          <img src="${a.image}" alt="${a.title}" loading="lazy">
        </a>
        <div class="article-card__body">
          <div class="article-card__cat">${a.categoryLabel}</div>
          <h3><a href="${a.url}">${a.title}</a></h3>
          <p>${a.excerpt}</p>
          <div class="article-card__meta">
            <time datetime="${a.date}">${formatDate(a.date)}</time>
            <span class="article-card__read">${a.readTime} min read</span>
          </div>
        </div>
      </article>
    `).join('');

    initScrollReveal();
    initJournalFilters();
  } catch (e) {
    console.warn('Could not load articles.json', e);
  }
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

/* ============================================================
   11. CONTACT FORM
   ============================================================ */
function initContactForm() {
  const form = document.querySelector('.form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('.form__submit');
    const originalText = btn.textContent;

    btn.textContent = 'Sending…';
    btn.disabled = true;

    // Simulate submit (replace with real endpoint)
    await new Promise(r => setTimeout(r, 1500));

    btn.textContent = '✓ Message Sent';
    btn.style.background = '#2B5F7A';
    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
      btn.style.background = '';
      form.reset();
    }, 3000);
  });
}

/* ============================================================
   12. NEWSLETTER FORM
   ============================================================ */
function initNewsletter() {
  const form = document.querySelector('.newsletter__form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn   = form.querySelector('.newsletter__btn');
    const input = form.querySelector('.newsletter__input');
    btn.textContent = '✓ You\'re in!';
    input.value = '';
    setTimeout(() => { btn.textContent = 'Send me the guide'; }, 3000);
  });
}

/* ============================================================
   13. IMAGE LAZY LOAD
   ============================================================ */
function initLazyImages() {
  if ('IntersectionObserver' in window) {
    const imgs = document.querySelectorAll('img[data-src]');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          io.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });
    imgs.forEach(img => io.observe(img));
  }
}

/* ============================================================
   14. CURSOR CUSTOM (Desktop)
   ============================================================ */
function initCursor() {
  if (window.matchMedia('(hover: none)').matches) return;

  const dot = document.createElement('div');
  dot.style.cssText = `
    position: fixed; top: 0; left: 0; z-index: 9999;
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--color-med);
    pointer-events: none; transform: translate(-50%,-50%);
    transition: transform 0.15s ease, width 0.3s ease, height 0.3s ease, opacity 0.3s ease;
    opacity: 0;
  `;

  const ring = document.createElement('div');
  ring.style.cssText = `
    position: fixed; top: 0; left: 0; z-index: 9998;
    width: 32px; height: 32px; border-radius: 50%;
    border: 1px solid rgba(43,95,122,0.4);
    pointer-events: none; transform: translate(-50%,-50%);
    transition: transform 0.35s cubic-bezier(.23,1,.32,1),
                width 0.35s ease, height 0.35s ease, opacity 0.3s ease;
    opacity: 0;
  `;

  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mx = 0, my = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    dot.style.opacity = '1';
    ring.style.opacity = '1';
  });

  // Lazy ring follow
  function animateRing() {
    ring.style.left = mx + 'px';
    ring.style.top  = my + 'px';
    requestAnimationFrame(animateRing);
  }
  requestAnimationFrame(animateRing);

  // Hover states
  document.querySelectorAll('a, button, .region-card, .service-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.style.transform   = 'translate(-50%,-50%) scale(2.5)';
      ring.style.width      = '52px';
      ring.style.height     = '52px';
      ring.style.borderColor = 'rgba(43,95,122,0.6)';
    });
    el.addEventListener('mouseleave', () => {
      dot.style.transform   = 'translate(-50%,-50%) scale(1)';
      ring.style.width      = '32px';
      ring.style.height     = '32px';
      ring.style.borderColor = 'rgba(43,95,122,0.4)';
    });
  });
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  detectAndRedirect();
  initNav();
  initScrollReveal();
  initLazyImages();
  initContactForm();
  initNewsletter();
  initJournalFilters();
  initHowItWorks();
  loadArticles();

  // GSAP-dependent (check if loaded)
  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    initHeroEntrance();
    initHeroParallax();
    initGSAPAnimations();
  } else {
    // Fallback without GSAP
    document.querySelectorAll('.hero__eyebrow, .hero__title, .hero__subtitle, .hero__actions, .hero__scroll')
      .forEach(el => { el.style.opacity = 1; });
  }

  // Lenis smooth scroll
  if (typeof Lenis !== 'undefined') {
    initLenis();
  }

  // Custom cursor (desktop only)
  initCursor();
});

/* ============================================================
   EXPORT (for module use if ever needed)
   ============================================================ */
window.FYH = { loadArticles, initScrollReveal };
