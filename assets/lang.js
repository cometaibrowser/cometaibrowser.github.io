
(function(){
  try {
    var PREF_KEY = 'lang_pref';
    var path = window.location.pathname;
    var isEN = path.toLowerCase().startsWith('/en/');
    var pref = localStorage.getItem(PREF_KEY);

    // First-visit auto-redirect if no preference
    if (!pref) {
      var nav = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
      var wantEN = nav.startsWith('en');
      if (!isEN && wantEN && (path === '/' || path === '/index.html' || path === '')) {
        localStorage.setItem(PREF_KEY, 'en');
        window.location.replace('/en/');
        return;
      }
      if (isEN && !wantEN && (path === '/en/' || path === '/en/index.html')) {
        localStorage.setItem(PREF_KEY, 'cn');
        window.location.replace('/');
        return;
      }
    } else {
      if (pref === 'en' && !isEN && (path === '/' || path === '/index.html' || path === '')) {
        window.location.replace('/en/');
        return;
      }
      if (pref === 'cn' && isEN && (path === '/en/' || path === '/en/index.html')) {
        window.location.replace('/');
        return;
      }
    }

    var switcher = document.getElementById('lang-switcher');

    function handlePreference(to) {
      localStorage.setItem(PREF_KEY, to);
      var loc = window.location;
      var current = loc.pathname;
      var search = loc.search || '';
      var hash = loc.hash || '';
      if (to === 'en') {
        if (current.toLowerCase().startsWith('/en/')) return;
        window.location.href = '/en/' + search + hash;
      } else {
        if (!current.toLowerCase().startsWith('/en/')) return;
        window.location.href = '/' + search + hash;
      }
    }

    if (switcher) {
      switcher.addEventListener('click', function (event) {
        var target = event.target.closest('[data-lang]');
        if (!target) return;
        var lang = (target.getAttribute('data-lang') || '').toLowerCase();
        if (!lang) return;
        var prefValue = lang === 'en' ? 'en' : 'cn';
        event.preventDefault();
        handlePreference(prefValue);
      });
    } else {
      var FALLBACK_ID = 'lang-switcher-fallback';
      var existingFallback = document.getElementById(FALLBACK_ID);
      if (!existingFallback) {
        var container = document.createElement('div');
        container.id = FALLBACK_ID;
        container.innerHTML = '<button type="button" data-lang="cn">中文</button><button type="button" data-lang="en">EN</button>';
        document.body.appendChild(container);

        var style = document.createElement('style');
        style.textContent = '#'+FALLBACK_ID+'{position:fixed;right:16px;bottom:16px;z-index:9999;display:flex;gap:8px}' +
          '#'+FALLBACK_ID+' button{padding:10px 14px;border-radius:12px;border:none;cursor:pointer;font-weight:700;' +
          'box-shadow:0 8px 24px rgba(0,0,0,.15);background:linear-gradient(90deg,#5CE1E6,#3B82F6);color:#fff}' +
          '#'+FALLBACK_ID+' button[data-lang="cn"]{background:linear-gradient(90deg,#22c55e,#3b82f6);}';
        document.head.appendChild(style);

        container.addEventListener('click', function (event) {
          var btn = event.target.closest('button[data-lang]');
          if (!btn) return;
          var lang = btn.getAttribute('data-lang') === 'en' ? 'en' : 'cn';
          handlePreference(lang);
        });
      }
    }
  } catch(e) {
    console.error('lang switcher error', e);
  }
})();
