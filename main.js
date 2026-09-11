document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Reveal on scroll (staggered) ---------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  revealEls.forEach((el, i) => {
    if (!el.style.getPropertyValue('--i')) el.style.setProperty('--i', i % 8);
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => io.observe(el));

  /* ---------- Count-up numbers ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const runCounter = (el) => {
    const target = parseFloat(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    const isFloat = target % 1 !== 0;
    let cur = 0;
    const step = target / 40;
    const tick = () => {
      cur += step;
      if (cur >= target) { el.textContent = (isFloat ? target.toFixed(1) : target) + suffix; return; }
      el.textContent = (isFloat ? cur.toFixed(1) : Math.floor(cur)) + suffix;
      requestAnimationFrame(tick);
    };
    tick();
  };
  const cio = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { runCounter(entry.target); cio.unobserve(entry.target); }
    });
  }, { threshold: 0.6 });
  counters.forEach(el => cio.observe(el));

  /* ---------- Tilt effect on cards ---------- */
  const tiltEls = document.querySelectorAll('.tilt');
  tiltEls.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(700px) rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 7).toFixed(2)}deg) translateY(-4px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });

  /* ---------- Hero art parallax (mouse-follow) ---------- */
  const parallax = document.querySelectorAll('.parallax');
  window.addEventListener('mousemove', (e) => {
    const px = (e.clientX / window.innerWidth) - 0.5;
    const py = (e.clientY / window.innerHeight) - 0.5;
    parallax.forEach(el => {
      const depth = parseFloat(el.getAttribute('data-depth') || 12);
      el.style.transform = `translate(${(px * depth).toFixed(1)}px, ${(py * depth).toFixed(1)}px)`;
    });
  });

  /* ---------- Mobile nav ---------- */
  const toggle = document.querySelector('.menu-toggle');
  const links = document.querySelector('nav.links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('mobile-open');
    });
  }

  /* ---------- Active nav link ---------- */
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav.links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === here) a.classList.add('active');
  });

  /* ---------- Back to top ---------- */
  const toTop = document.querySelector('.to-top');
  if (toTop) {
    window.addEventListener('scroll', () => {
      toTop.classList.toggle('show', window.scrollY > 500);
    });
    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---------- Contact form (client-side only) ---------- */
  const form = document.getElementById('leadForm');
  const success = document.getElementById('formSuccess');
  if (form && success) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      form.style.display = 'none';
      success.classList.add('show');
    });
  }
});
