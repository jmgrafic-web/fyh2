/* Find Your Haven — movimiento (v10)
   GSAP + ScrollTrigger + SplitText + Lenis (alojados en /assets/js/vendor).
   Principio: el HTML se ve completo sin JavaScript y con «reducir movimiento»;
   este archivo solo añade la coreografía encima. */
(function () {
  'use strict';
  var d = document, html = d.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var G = window.gsap, ST = window.ScrollTrigger, Split = window.SplitText;
  var header = d.getElementById('siteHeader');
  var lenis = null;

  function $(s, c) { return (c || d).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); }
  function markIntroSeen() { try { sessionStorage.setItem('fyh-intro', '1'); } catch (e) {} }
  function removeLoader() { var l = $('.loader'); if (l && l.parentNode) l.parentNode.removeChild(l); markIntroSeen(); }

  /* ---------- Cabecera: se esconde al bajar, vuelve al subir ---------- */
  if (header) {
    var lastY = window.scrollY;
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      var hide = y > lastY && y > window.innerHeight * 0.6 && !html.classList.contains('nav-open');
      header.classList.toggle('is-hidden', hide);
      lastY = y;
    }, { passive: true });
  }

  if (reduce || !G || !ST) { removeLoader(); return; }

  G.registerPlugin(ST);
  if (Split) G.registerPlugin(Split);
  html.classList.add('motion-on');

  /* ---------- Desplazamiento suave (Lenis) ---------- */
  if (window.Lenis) {
    lenis = new window.Lenis({ lerp: 0.09, smoothWheel: true });
    lenis.on('scroll', ST.update);
    G.ticker.add(function (t) { lenis.raf(t * 1000); });
    G.ticker.lagSmoothing(0);
    // bloquear el scroll con el menú móvil abierto
    new MutationObserver(function () {
      if (html.classList.contains('nav-open')) lenis.stop(); else lenis.start();
    }).observe(html, { attributes: true, attributeFilter: ['class'] });
  }

  /* anclas internas (también las del menú, que llevan /idioma/#ancla) */
  d.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href*="#"]');
    if (!a) return;
    var url = new URL(a.href, location.href);
    if (url.pathname !== location.pathname || !url.hash || url.hash === '#') return;
    var target = d.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!target) return;
    e.preventDefault();
    history.replaceState(null, '', url.hash);
    if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.4 });
    else target.scrollIntoView({ behavior: 'smooth' });
  });

  /* ---------- Introducción: cargador + hero ---------- */
  if ($('.hx')) {
    G.set('.hx-img', { scale: 1.22 });
    G.set('.hx-title .ln > span', { yPercent: 112 });
    G.set('[data-hx-fade]', { autoAlpha: 0, y: 24 });
  }
  function heroIntro() {
    if (!$('.hx')) return;
    G.timeline({ defaults: { ease: 'power4.out' } })
      .to('.hx-img', { scale: 1, duration: 2.2, ease: 'power3.out' }, 0)
      .to('.hx-title .ln > span', { yPercent: 0, duration: 1.3, stagger: 0.09 }, 0.15)
      .to('[data-hx-fade]', { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.08, ease: 'power3.out' }, 0.55);
  }

  var loader = $('.loader');
  if (loader && !html.classList.contains('no-loader')) {
    var word = $('.loader-word', loader);
    if (word) word.innerHTML = word.textContent.split('').map(function (c) {
      return '<span>' + (c === ' ' ? '&nbsp;' : c) + '</span>';
    }).join('');
    G.timeline({ onComplete: removeLoader })
      .from('.loader-word span', { yPercent: 105, duration: 0.9, stagger: 0.025, ease: 'power4.out' })
      .from('.loader-meta', { autoAlpha: 0, duration: 0.6 }, 0.3)
      .to('.loader-bar i', { scaleX: 1, duration: 0.9, ease: 'power2.inOut' }, 0.2)
      .to(loader, { yPercent: -100, duration: 1, ease: 'power4.inOut' }, '+=0.15')
      .add(heroIntro, '-=0.55');
  } else {
    removeLoader();
    heroIntro();
  }

  /* hero al hacer scroll: la foto baja más despacio, el texto sube y se apaga */
  if ($('.hx')) {
    G.to('.hx-media', { yPercent: 16, ease: 'none', scrollTrigger: { trigger: '.hx', start: 'top top', end: 'bottom top', scrub: true } });
    G.to('.hx-inner', { yPercent: -10, autoAlpha: 0.15, ease: 'none', scrollTrigger: { trigger: '.hx', start: 'top top', end: 'bottom top', scrub: true } });
  }

  /* ---------- Cinta: avanza sola y acelera con la velocidad del scroll ---------- */
  var track = $('.ticker-track');
  if (track) {
    var tick = G.to(track, { xPercent: -50, duration: 42, ease: 'none', repeat: -1 });
    var dir = 1;
    ST.create({
      trigger: '.ticker', start: 'top bottom', end: 'bottom top',
      onUpdate: function (self) {
        var v = self.getVelocity();
        if (Math.abs(v) < 5) return;
        dir = v < 0 ? -1 : 1;
        var boost = Math.min(6, 1 + Math.abs(v) / 260);
        G.to(tick, { timeScale: boost * dir, duration: 0.2, overwrite: true });
        G.to(tick, { timeScale: dir, duration: 1.2, delay: 0.25, overwrite: false });
      }
    });
    tick.totalTime(42 * 50); // margen para poder ir hacia atrás
  }

  /* ---------- Todo lo que aparece ---------- */
  function setup() {
    // titulares por líneas, con máscara
    $$('[data-split]').forEach(function (el) {
      if (!Split) { G.from(el, { autoAlpha: 0, y: 40, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 86%', once: true } }); return; }
      Split.create(el, {
        type: 'lines', mask: 'lines', autoSplit: true,
        onSplit: function (self) {
          return G.from(self.lines, { yPercent: 108, duration: 1.15, stagger: 0.09, ease: 'power4.out',
            scrollTrigger: { trigger: el, start: 'top 86%', once: true } });
        }
      });
    });

    // párrafo que se enciende palabra a palabra
    $$('[data-words]').forEach(function (el) {
      if (!Split) return;
      Split.create(el, {
        type: 'words', autoSplit: true,
        onSplit: function (self) {
          return G.fromTo(self.words, { opacity: 0.14 }, { opacity: 1, stagger: 0.06, ease: 'none',
            scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 50%', scrub: true } });
        }
      });
    });

    // aparición suave por lotes
    var ups = $$('[data-up]');
    G.set(ups, { autoAlpha: 0, y: 46 });
    ST.batch(ups, {
      start: 'top 90%', once: true,
      onEnter: function (batch) { G.to(batch, { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.08, ease: 'power3.out', overwrite: true }); }
    });

    // fotos que se abren al entrar
    $$('[data-clip]').forEach(function (el) {
      G.fromTo(el, { clipPath: 'inset(16% 14% 16% 14%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 92%', end: 'top 30%', scrub: true } });
    });

    // parallax
    $$('[data-parallax]').forEach(function (el) {
      var amt = parseFloat(el.getAttribute('data-parallax-amount')) || 8;
      G.fromTo(el, { yPercent: -amt }, { yPercent: amt, ease: 'none',
        scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    // línea del modelo
    if ($('.flow-line i')) {
      G.fromTo('.flow-line i', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.flow', start: 'top 88%', end: 'top 45%', scrub: true } });
      G.from('.flow-dot', { scale: 0, duration: 0.6, stagger: 0.25, ease: 'back.out(3)', scrollTrigger: { trigger: '.flow', start: 'top 80%', once: true } });
    }

    // banda: la cita sube por líneas
    if ($('.band-quote')) {
      G.from('.band-quote .ln > span', { yPercent: 110, duration: 1.3, stagger: 0.1, ease: 'power4.out', scrollTrigger: { trigger: '.band', start: 'top 62%', once: true } });
      G.to('.band-quote', { yPercent: -18, ease: 'none', scrollTrigger: { trigger: '.band', start: 'top bottom', end: 'bottom top', scrub: true } });
    }

    // revista: tarjetas en cascada
    $$('.mag-grid').forEach(function (grid) {
      var cards = $$('.mcard', grid);
      if (!cards.length || grid.hidden) return;
      G.from(cards, { autoAlpha: 0, y: 60, duration: 1.1, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: grid, start: 'top 88%', once: true } });
    });

    // pie: el nombre sube letra a letra
    var mark = $('.footer-mark');
    if (mark) {
      mark.innerHTML = mark.textContent.split('').map(function (c) { return '<span>' + (c === ' ' ? '&nbsp;' : c) + '</span>'; }).join('');
      G.from($$('span', mark), { yPercent: 100, duration: 1.1, stagger: 0.03, ease: 'power4.out', scrollTrigger: { trigger: mark, start: 'top 98%', once: true } });
    }

    // páginas interiores: bloques del artículo
    $$('.article-body > *, .legal > *').slice(0, 40).forEach(function (el) {
      G.from(el, { autoAlpha: 0, y: 24, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
    });

    /* ---------- Proceso: scroll horizontal fijado (escritorio) ---------- */
    var pin = $('.procx-pin'), ptrack = $('.procx-track'), bar = $('.procx-bar i');
    if (pin && ptrack) {
      var mm = G.matchMedia();
      mm.add('(min-width: 1024px)', function () {
        pin.classList.add('is-pinned');
        var dist = function () { return Math.max(0, ptrack.scrollWidth - window.innerWidth); };
        G.to(ptrack, {
          x: function () { return -dist(); }, ease: 'none',
          scrollTrigger: {
            trigger: pin, start: 'center center', end: function () { return '+=' + dist(); },
            pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1,
            onUpdate: function (self) { if (bar) bar.style.transform = 'scaleX(' + (0.25 + self.progress * 0.75) + ')'; }
          }
        });
        G.from($$('.pstep', ptrack), { autoAlpha: 0, x: 120, duration: 1.2, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: pin, start: 'top 85%', once: true } });
        return function () { pin.classList.remove('is-pinned'); };
      });
      // móvil/tablet: barra de progreso según el deslizamiento horizontal
      pin.addEventListener('scroll', function () {
        if (pin.classList.contains('is-pinned') || !bar) return;
        var max = pin.scrollWidth - pin.clientWidth;
        bar.style.transform = 'scaleX(' + (0.25 + (max > 0 ? pin.scrollLeft / max : 0) * 0.75) + ')';
      }, { passive: true });
    }

    /* ---------- Servicios: imagen que sigue al cursor ---------- */
    var list = $('.svx'), prev = $('.svx-preview');
    if (list && prev && finePointer) {
      var img = $('img', prev), inner = $('.svx-preview-in', prev);
      G.set(prev, { xPercent: -50, yPercent: -50, scale: 0.6, autoAlpha: 0, rotate: -6 });
      var xTo = G.quickTo(prev, 'x', { duration: 0.7, ease: 'power3' });
      var yTo = G.quickTo(prev, 'y', { duration: 0.7, ease: 'power3' });
      var rTo = G.quickTo(prev, 'rotate', { duration: 0.9, ease: 'power3' });
      var lastX = 0;
      list.addEventListener('mousemove', function (e) { xTo(e.clientX); yTo(e.clientY); rTo(Math.max(-10, Math.min(10, (e.clientX - lastX) * 0.6))); lastX = e.clientX; });
      list.addEventListener('mouseenter', function (e) { G.set(prev, { x: e.clientX, y: e.clientY }); G.to(prev, { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'power3.out' }); });
      list.addEventListener('mouseleave', function () { G.to(prev, { autoAlpha: 0, scale: 0.6, duration: 0.5, ease: 'power3.in' }); });
      $$('.svx-row', list).forEach(function (row) {
        row.addEventListener('mouseenter', function () {
          var src = row.getAttribute('data-img');
          if (!src || img.getAttribute('src') === src) return;
          img.setAttribute('src', src);
          G.fromTo(inner, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 0.7, ease: 'power4.out' });
        });
      });
      // precarga
      $$('.svx-row', list).forEach(function (row) { var i = new Image(); i.src = row.getAttribute('data-img'); });
    }

    /* ---------- Botones magnéticos ---------- */
    if (finePointer) {
      $$('[data-magnet]').forEach(function (el) {
        var mx = G.quickTo(el, 'x', { duration: 0.5, ease: 'power3' }), my = G.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });
        el.addEventListener('mousemove', function (e) {
          var r = el.getBoundingClientRect();
          mx((e.clientX - r.left - r.width / 2) * 0.25); my((e.clientY - r.top - r.height / 2) * 0.35);
        });
        el.addEventListener('mouseleave', function () { mx(0); my(0); });
      });
    }

    ST.refresh();
  }

  var ready = (d.fonts && d.fonts.ready) ? d.fonts.ready : Promise.resolve();
  ready.then(function () { setup(); });
  window.addEventListener('load', function () { ST.refresh(); });

  // pestañas de la revista: al cambiar, recalcular posiciones y animar la nueva rejilla
  d.addEventListener('click', function (e) {
    if (!e.target.closest || !e.target.closest('.mag-tab[data-filter]')) return;
    setTimeout(function () {
      var g = $$('.mag-grid').filter(function (x) { return !x.hidden; })[0];
      if (g) G.fromTo($$('.mcard', g), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.07, ease: 'power3.out' });
      ST.refresh();
    }, 0);
  });
})();
