/* Journal search: typing a query swaps the browse sections (topics, start here, latest)
   for a flat list of matching articles. Clearing the query restores the browse view. */
document.addEventListener('DOMContentLoaded', function () {
  var input = document.querySelector('[data-journal-search]');
  var browse = document.querySelector('[data-browse]');
  var results = document.querySelector('[data-journal-results]');
  var grid = document.querySelector('[data-journal-grid]');
  if (!input || !browse || !results || !grid) return;
  var cards = Array.prototype.slice.call(grid.querySelectorAll('.card'));
  var emptyMsg = document.querySelector('[data-journal-empty]');

  function norm(s) {
    return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  function update() {
    var q = norm(input.value.trim());
    if (!q) { browse.hidden = false; results.hidden = true; return; }
    var terms = q.split(/\s+/);
    var n = 0;
    cards.forEach(function (c) {
      var hay = norm(c.getAttribute('data-search'));
      var ok = terms.every(function (t) { return hay.indexOf(t) > -1; });
      c.hidden = !ok;
      if (ok) n++;
    });
    browse.hidden = true;
    results.hidden = false;
    if (emptyMsg) emptyMsg.classList.toggle('is-visible', n === 0);
  }

  input.addEventListener('input', update);
  update();
});
