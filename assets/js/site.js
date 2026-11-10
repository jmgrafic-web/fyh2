document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Cabecera: fondo al hacer scroll ---------- */
  var header = document.getElementById('siteHeader');
  if (header) {
    function updateHeader() {
      if (window.scrollY > 40) header.classList.add('is-scrolled');
      else header.classList.remove('is-scrolled');
    }
    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();
  }

  /* ---------- Menú móvil ---------- */
  var btn = document.getElementById('navToggle');
  var nav = document.getElementById('mainNav');
  if (btn && nav) {
    function closeMenu() {
      nav.classList.remove('is-open');
      btn.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      document.documentElement.classList.remove('nav-open');
    }
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      btn.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', open);
      document.documentElement.classList.toggle('nav-open', open);
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
  }

  /* ---------- Revelado al hacer scroll (una vez por elemento) ---------- */
  if ('IntersectionObserver' in window) {
    var revealItems = document.querySelectorAll('.reveal');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealItems.forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Parallax suave en imágenes de fondo ---------- */
  var parallaxEls = Array.prototype.slice.call(document.querySelectorAll('[data-parallax] img'));
  if (parallaxEls.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var ticking = false;
    function updateParallax() {
      var vh = window.innerHeight;
      parallaxEls.forEach(function (img) {
        var rect = (img.closest('[data-parallax]') || img.parentElement).getBoundingClientRect();
        var progress = (rect.top) / vh; // ~1 when entering from bottom, ~0 centered, negative above
        var shift = progress * -28; // px
        img.style.transform = 'translate3d(0,' + shift + 'px,0) scale(1.12)';
      });
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(updateParallax); ticking = true; }
    }, { passive: true });
    updateParallax();
  }

  /* ---------- Contadores animados (cifras) ---------- */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    var counted = new WeakSet();
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting || counted.has(entry.target)) return;
        counted.add(entry.target);
        var el = entry.target;
        var end = parseFloat(el.getAttribute('data-count'));
        var suffix = el.getAttribute('data-suffix') || '';
        var prefix = el.getAttribute('data-prefix') || '';
        var duration = 1100;
        var start = null;
        function step(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / duration, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          var val = Math.round(end * eased);
          el.textContent = prefix + val + suffix;
          if (p < 1) window.requestAnimationFrame(step);
          else el.textContent = prefix + end + suffix;
        }
        window.requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- Hero: carrusel de imágenes de fondo ----------
     Cambia solo cada 10 s (data-interval en ms) o cuando el usuario pulsa
     las flechas / los indicadores / desliza el dedo. Se pausa al pasar el ratón
     por los controles, con la pestaña oculta o con el hero fuera de pantalla.
     Con "reducir movimiento" activado no hay cambio automático. */
  var heroEl = document.querySelector('[data-hero-slider]');
  if (heroEl) initHeroSlider(heroEl);

  function initHeroSlider(root) {
    var slides = Array.prototype.slice.call(root.querySelectorAll('.hero-slide'));
    if (slides.length < 2) return;

    var interval = parseInt(root.getAttribute('data-interval'), 10) || 10000;
    var autoplay = !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    var index = 0;
    for (var s = 0; s < slides.length; s++) { if (slides[s].classList.contains('is-active')) { index = s; break; } }

    root.style.setProperty('--hero-interval', interval + 'ms');
    if (!autoplay) root.classList.add('no-autoplay');

    /* controles */
    var labelPrev  = root.getAttribute('data-label-prev')  || 'Previous image';
    var labelNext  = root.getAttribute('data-label-next')  || 'Next image';
    var labelSlide = root.getAttribute('data-label-slide') || 'Image';

    var controls = root.querySelector('.hero-controls');
    if (!controls) { controls = document.createElement('div'); controls.className = 'hero-controls'; root.appendChild(controls); }
    controls.innerHTML = '';

    function arrow(dir, label, path) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'hero-arrow hero-' + dir;
      b.setAttribute('aria-label', label);
      b.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="' + path + '"/></svg>';
      return b;
    }
    var prevBtn = arrow('prev', labelPrev, 'M15 5l-7 7 7 7');
    var nextBtn = arrow('next', labelNext, 'M9 5l7 7-7 7');
    var dotsWrap = document.createElement('div');
    dotsWrap.className = 'hero-dots';
    var dots = slides.map(function (_, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'hero-dot';
      b.setAttribute('aria-label', labelSlide + ' ' + (i + 1) + ' / ' + slides.length);
      b.innerHTML = '<span></span>';
      b.addEventListener('click', function () { go(i); });
      dotsWrap.appendChild(b);
      return b;
    });
    controls.appendChild(prevBtn);
    controls.appendChild(dotsWrap);
    controls.appendChild(nextBtn);

    /* temporizador con pausa (recuerda el tiempo restante) */
    var timer = null, startedAt = 0, remaining = interval, paused = false;
    var reasons = { hover: false, focus: false, hidden: false, offscreen: false };

    function clearTimer() { if (timer) { clearTimeout(timer); timer = null; } }
    function schedule() {
      clearTimer();
      if (!autoplay || paused) return;
      startedAt = Date.now();
      timer = setTimeout(function () { go(index + 1); }, remaining);
    }
    function refreshPause() {
      var want = reasons.hover || reasons.focus || reasons.hidden || reasons.offscreen;
      if (want === paused) return;
      paused = want;
      root.classList.toggle('is-paused', paused);
      if (paused) {
        if (timer) { remaining = Math.max(0, remaining - (Date.now() - startedAt)); clearTimer(); }
      } else {
        schedule();
      }
    }

    function show(i) {
      slides.forEach(function (sl, n) {
        var on = n === i;
        sl.classList.toggle('is-active', on);
        if (on) sl.removeAttribute('aria-hidden'); else sl.setAttribute('aria-hidden', 'true');
        dots[n].classList.toggle('is-active', on);
        if (on) dots[n].setAttribute('aria-current', 'true'); else dots[n].removeAttribute('aria-current');
      });
    }
    function go(n) {
      n = (n + slides.length) % slides.length;
      if (n === index) return;
      index = n;
      show(index);
      remaining = interval;
      schedule();
    }

    prevBtn.addEventListener('click', function () { go(index - 1); });
    nextBtn.addEventListener('click', function () { go(index + 1); });

    /* pausas */
    controls.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') { reasons.hover = true; refreshPause(); } });
    controls.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') { reasons.hover = false; refreshPause(); } });
    controls.addEventListener('focusin', function (e) {
      var kb = true;
      try { kb = e.target.matches(':focus-visible'); } catch (err) {}
      if (kb) { reasons.focus = true; refreshPause(); }
    });
    controls.addEventListener('focusout', function () { reasons.focus = false; refreshPause(); });
    document.addEventListener('visibilitychange', function () { reasons.hidden = document.hidden; refreshPause(); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        reasons.offscreen = !entries[0].isIntersecting;
        refreshPause();
      }, { threshold: 0.25 }).observe(root);
    }

    /* deslizar con el dedo */
    var tx = 0, ty = 0;
    root.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
    root.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4) go(dx < 0 ? index + 1 : index - 1);
    }, { passive: true });

    show(index);
    schedule();
  }

});

/* ---------- Capa de impacto: barra de progreso y CTA flotante (móvil) ---------- */
document.addEventListener('DOMContentLoaded', function () {
  var bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);
  var cta = null, hero = document.querySelector('[data-hero-slider]'), contact = null;
  var src = document.querySelector('.hero-cta .btn-primary');
  if (hero && src) {
    contact = document.querySelector(src.getAttribute('href'));
    cta = document.createElement('a');
    cta.className = 'float-cta';
    cta.href = src.getAttribute('href');
    cta.textContent = src.getAttribute('data-float-label') || src.textContent.trim();
    document.body.appendChild(cta);
  }
  var ticking = false;
  function update() {
    ticking = false;
    var h = document.documentElement;
    var max = h.scrollHeight - window.innerHeight;
    bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ')';
    if (cta) {
      var pastHero = window.scrollY > hero.offsetHeight * 0.8;
      var inContact = contact && contact.getBoundingClientRect().top < window.innerHeight * 0.6;
      cta.classList.toggle('is-on', pastHero && !inContact);
    }
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener('resize', update);
  update();
});
