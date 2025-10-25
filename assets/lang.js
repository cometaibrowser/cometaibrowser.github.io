
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

    // Inject floating switcher
    var btn = document.createElement('div');
    btn.id = 'lang-switcher';
    btn.innerHTML = '<button type="button" id="to-cn">中文</button><button type="button" id="to-en">EN</button>';
    document.body.appendChild(btn);

    var style = document.createElement('style');
    style.textContent = '#lang-switcher{position:fixed;right:16px;bottom:16px;z-index:9999;display:flex;gap:8px}'
      + '#lang-switcher button{padding:10px 14px;border-radius:12px;border:none;cursor:pointer;font-weight:700;'
      + 'box-shadow:0 8px 24px rgba(0,0,0,.15)}'
      + '#to-cn{background:linear-gradient(90deg,#22c55e,#3b82f6);color:#fff}'
      + '#to-en{background:linear-gradient(90deg,#5CE1E6,#3B82F6);color:#fff}';
    document.head.appendChild(style);

    function go(to) {
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

    document.getElementById('to-cn').onclick = function(){ go('cn'); };
    document.getElementById('to-en').onclick = function(){ go('en'); };
  } catch(e) {
    console.error('lang switcher error', e);
  }
})();
