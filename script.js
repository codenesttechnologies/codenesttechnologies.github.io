/* ==========================================================
   CodeNest Technologies - Scripts
   ========================================================== */
(function () {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ---------- Loader ---------- */
  window.addEventListener('load', () => {
    setTimeout(() => $('#loader').classList.add('hide'), 500);
  });

  /* ---------- Footer year ---------- */
  $('#year').textContent = new Date().getFullYear();

  /* ---------- Scroll effects: navbar, progress bar, back-to-top ---------- */
  const navbar = $('#mainNav');
  const progress = $('#progress');
  const toTop = $('#toTop');

  function onScroll() {
    const y = window.scrollY;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    navbar.classList.toggle('scrolled', y > 40);
    progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    toTop.classList.toggle('show', y > 500);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- Close mobile menu after clicking a link ---------- */
  const menu = $('#navMenu');
  $$('.nav-link, .navbar .btn', menu).forEach(link => {
    link.addEventListener('click', () => {
      if (menu.classList.contains('show')) {
        bootstrap.Collapse.getOrCreateInstance(menu).hide();
      }
    });
  });

  /* ---------- Reveal on scroll ---------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  $$('.reveal').forEach(el => revealObserver.observe(el));

  /* ---------- Counters ---------- */
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.target;
      const duration = 1600;
      const start = performance.now();
      (function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        el.textContent = Math.floor(p * target);
        if (p < 1) requestAnimationFrame(tick);
      })(start);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.6 });
  $$('.count').forEach(el => counterObserver.observe(el));

  /* ---------- Typing effect ---------- */
  const typed = $('#typed');
  if (typed) {
    const words = JSON.parse(typed.dataset.words);
    let w = 0, c = 0, deleting = false;
    (function type() {
      const word = words[w];
      typed.textContent = word.substring(0, c);
      let delay = deleting ? 60 : 120;

      if (!deleting && c === word.length) { deleting = true; delay = 1500; }
      else if (deleting && c === 0) { deleting = false; w = (w + 1) % words.length; delay = 400; }
      c += deleting ? -1 : 1;
      if (c < 0) c = 0;
      setTimeout(type, delay);
    })();
  }

  /* ---------- Project filter ---------- */
  const filterBtns = $$('.filter-btn');
  const items = $$('.project-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;

      items.forEach(item => {
        const show = f === 'all' || item.dataset.cat === f;
        if (show) {
          item.classList.remove('hide');
          item.style.opacity = 0;
          item.style.transform = 'scale(.92)';
          requestAnimationFrame(() => {
            item.style.opacity = 1;
            item.style.transform = 'scale(1)';
          });
        } else {
          item.classList.add('hide');
        }
      });
    });
  });

  /* ---------- Copy email button ---------- */
  const copyBtn = $('#copyMail');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const email = 'codenesttechnologies01@gmail.com';
      const label = $('span', copyBtn);
      const icon = $('i', copyBtn);
      try {
        await navigator.clipboard.writeText(email);
      } catch (err) {
        // Fallback for older browsers
        const t = document.createElement('textarea');
        t.value = email;
        document.body.appendChild(t);
        t.select();
        document.execCommand('copy');
        t.remove();
      }
      label.textContent = 'Email copied!';
      icon.className = 'bi bi-check2-circle me-1';
      setTimeout(() => {
        label.textContent = 'Copy email address';
        icon.className = 'bi bi-clipboard me-1';
      }, 2200);
    });
  }
})();
