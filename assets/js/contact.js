/* Find Your Haven — formulario de contacto de la portada y pestañas de la Revista.
   El formulario se envía a Formspree con fetch (sin recargar) y muestra el
   mensaje de confirmación. Sin JavaScript, el formulario se envía igualmente
   de forma normal a Formspree. */
document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Formulario de contacto ---------- */
  document.querySelectorAll('[data-contact-form]').forEach(function (form) {
    var btn = form.querySelector('button[type="submit"]');
    var err = form.querySelector('.form-error');
    var success = form.parentNode.querySelector('.form-success');
    var btnHTML = btn ? btn.innerHTML : '';

    form.addEventListener('submit', function (e) {
      if (!window.fetch || !window.FormData) return;          // envío clásico
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      if (err) { err.hidden = true; err.textContent = ''; }
      if (btn) { btn.disabled = true; btn.textContent = btn.getAttribute('data-sending-label') || '…'; }

      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } })
        .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); })
        .then(function () {
          form.hidden = true;
          if (success) { success.hidden = false; success.focus({ preventScroll: true }); success.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
        })
        .catch(function () {
          if (err) { err.textContent = form.getAttribute('data-error-msg') || 'Error'; err.hidden = false; }
        })
        .then(function () { if (btn) { btn.disabled = false; btn.innerHTML = btnHTML; } });
    });
  });

  /* ---------- Revista (portada): filtrar por tema sin salir de la página ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.mag-tab[data-filter]'));
  if (tabs.length) {
    var groups = Array.prototype.slice.call(document.querySelectorAll('.mag-grid[data-group]'));
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function (e) {
        var f = tab.getAttribute('data-filter');
        var target = groups.filter(function (g) { return g.getAttribute('data-group') === f; })[0];
        if (!target || !target.children.length) return;          // sin artículos: sigue el enlace
        e.preventDefault();
        tabs.forEach(function (t) {
          var on = t === tab;
          t.classList.toggle('is-active', on);
          if (on) t.setAttribute('aria-current', 'true'); else t.removeAttribute('aria-current');
        });
        groups.forEach(function (g) { g.hidden = g !== target; });
      });
    });
  }
});
