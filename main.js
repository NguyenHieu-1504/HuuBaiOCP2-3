document.addEventListener('DOMContentLoaded', () => {

  /* ---------- O3 photo library ---------- */
  const o3Folders = {
    'op3-anh-duong': 'AnhDuong',
    'op3-hai-dang': 'HaiDang',
    'op3-pho-bien': 'PhoBien',
    'op3-thoi-dai': 'ThoiDai',
    'op3-vinh-tay': 'VinhTay',
    'op3-vinh-thien-duong': 'VinhThienDuong',
    'op3-vinh-xanh': 'VinhXanh',
    'dao-ngoc': 'DaoNgoc'
  };
  const o3Images = {
    O3Overview: ['o3-01.jpg', 'o3-02.jpg', 'o3-03.webp', 'o3-04.jpg'],
    AnhDuong: ['ad01.jpg', 'ad02.jpg', 'ad03.jpg', 'ad04.jpg', 'ad05.jpg', 'ad06.jpg', 'ad07.jpg', 'ad08.png'],
    HaiDang: ['hd01.jpg', 'hd02.jpg', 'hd03.jpg', 'hd04.jpg', 'hd05.jpg', 'hd06.png', 'hd078.jpg', 'hd09.webp', 'hd10.png'],
    PhoBien: ['pb01.jpg', 'pb02.jpg', 'pb04.jpg', 'pb05.jpg', 'pb06.jpg', 'pb07.jpg', 'pb08.jpg', 'pb09.jpg'],
    ThoiDai: ['td01.jpg', 'td02.jpg', 'td03.jpg', 'td04.jpeg', 'td05.png', 'td06.jpeg', 'td07.jpg', 'td08.jpg'],
    VinhTay: ['vt01.jpg', 'vt02.webp', 'vt03.jpg', 'vt04.jpg', 'vt05.jpg', 'vt06.jpg', 'vt07.png', 'vt08.jpg', 'vt09.jpg'],
    VinhThienDuong: ['vtd01.jpg', 'vtd02.jpeg', 'vtd03.webp', 'vtd04.jpg', 'vtd04.webp', 'vtd05.webp', 'vtd06.jpg'],
    VinhXanh: ['vx01.jpg', 'vx02.jpg', 'vx03.png', 'vx04.jpg', 'vx05.jpg', 'vx06.jpg', 'vx07.jpg', 'vx08.jpg', 'vx09.png'],
    DaoNgoc: ['dn01.jpg', 'dn02.jpg', 'dn03.png', 'dn04.png', 'dn05.jpg', 'dn06.jpg', 'dn07.png', 'dn08.jpg', 'dn09.jpg', 'dn10.jpg']
  };
  const imageUrl = (folder, file) => folder === 'O3Overview' ? `images/O3/${file}` : `images/O3/${folder}/${file}`;
  const setPhoto = (element, folder, index = 0) => {
    const files = o3Images[folder];
    if (!files) return;
    element.classList.add('photo');
    element.style.backgroundImage = `url("${imageUrl(folder, files[index % files.length])}")`;
  };
  const currentPage = (location.pathname.split('/').pop() || 'index.html').replace('.html', '');
  const currentFolder = o3Folders[currentPage];
  document.querySelectorAll('.ph-img').forEach((element, elementIndex) => {
    if (currentFolder) {
      setPhoto(element, currentFolder, elementIndex);
      return;
    }
    const link = element.closest('a');
    const href = link?.getAttribute('href') || '';
    const linkedPage = href.split('/').pop().replace('.html', '');
    const folder = o3Folders[linkedPage] || currentFolder;
    if (folder) {
      const siblings = [...document.querySelectorAll('.ph-img')].filter(item => item.closest('a')?.getAttribute('href')?.includes(linkedPage));
      setPhoto(element, folder, Math.max(0, siblings.indexOf(element)));
    } else if (href === 'ocean-park-3.html' || currentPage === 'ocean-park-3') {
      setPhoto(element, 'O3Overview', elementIndex);
    } else if (currentPage === 'index' && element.closest('#dao-ngoc-preview')) {
      setPhoto(element, 'DaoNgoc', elementIndex);
    }
  });

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
