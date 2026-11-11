// Optional light/dark toggle. Without JS the site follows prefers-color-scheme.
// The saved choice is applied early by an inline snippet in <head>.
(function () {
  var root = document.documentElement;
  var button = document.getElementById('theme-toggle');
  if (!button) return;

  var system = window.matchMedia('(prefers-color-scheme: dark)');
  var current = function () { return root.dataset.theme || (system.matches ? 'dark' : 'light'); };
  var update = function () {
    var next = current() === 'dark' ? 'light' : 'dark';
    button.setAttribute('aria-label', 'Switch to ' + next + ' theme');
    button.title = 'Switch to ' + next + ' theme';
  };

  button.addEventListener('click', function () {
    var next = current() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
    update();
  });
  system.addEventListener('change', update);

  update();
  button.hidden = false;
})();
