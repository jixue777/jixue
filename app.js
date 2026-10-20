/* =========================================================
   个人主页 v1 · 交互脚本
   只做三件事：中英切换、滚动淡入、导航栏状态
   ========================================================= */
(function () {
  'use strict';

  var root = document.documentElement;
  var body = document.body;

  /* ---------- 1. 中英切换 ---------- */

  var KEY = 'site-lang';
  var brand = document.querySelector('.brand');
  var toggle = document.getElementById('langToggle');

  function readStored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function store(v) {
    try { localStorage.setItem(KEY, v); } catch (e) {}
  }

  function detect() {
    var saved = readStored();
    if (saved === 'zh' || saved === 'en') return saved;
    var nav = (navigator.language || 'zh').toLowerCase();
    return nav.indexOf('zh') === 0 ? 'zh' : 'en';
  }

  var lang = detect();

  function applyLang(next) {
    lang = next;
    root.setAttribute('lang', next === 'zh' ? 'zh-CN' : 'en');
    store(next);

    document.querySelectorAll('[data-zh]').forEach(function (el) {
      var text = el.getAttribute('data-' + next);
      if (text !== null) el.innerHTML = text;
    });

    if (toggle) {
      toggle.textContent = next === 'zh' ? 'EN' : '中文';
      toggle.setAttribute('aria-label', next === 'zh' ? 'Switch to English' : '切换到中文');
    }

    if (brand) {
      var name = brand.getAttribute('data-' + next) || '';
      document.title = next === 'zh' ? name + ' · 新闻传播' : name + ' · Media & Communication';
    }

    body.classList.add('lang-ready');
  }

  applyLang(lang);
  window.__siteReady = true;

  if (toggle) {
    toggle.addEventListener('click', function () {
      applyLang(lang === 'zh' ? 'en' : 'zh');
    });
  }

  /* ---------- 2. 滚动淡入 ---------- */

  var items = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var siblings = Array.prototype.filter.call(
          el.parentElement.children,
          function (c) { return c.classList.contains('reveal'); }
        );
        var i = Math.min(siblings.indexOf(el), 3);
        el.style.transitionDelay = (i * 80) + 'ms';
        el.classList.add('in');
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- 3. 导航栏滚动状态 ---------- */

  var header = document.getElementById('header');
  function onScroll() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 8);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();
