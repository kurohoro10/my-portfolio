  // ── YEAR ──
  document.getElementById('year').textContent = new Date().getFullYear();

  // ── MOBILE MENU ──
  const toggle = document.getElementById('menuToggle');
  const menu = document.getElementById('navMenu');
  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
  });
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
  document.addEventListener('click', e => {
    if (!menu.contains(e.target) && !toggle.contains(e.target)) {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  // ── NAV ACTIVE ──
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.removeAttribute('aria-current'));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.setAttribute('aria-current', 'page');
      }
    });
  }, { 
    threshold: 0,
    rootMargin: '-20% 0px -70% 0px'
  });
  sections.forEach(s => sectionObserver.observe(s));

  // ── FORM VALIDATION ──
  document.getElementById('contactForm').addEventListener('submit', function(e) {
    let valid = true;
    this.querySelectorAll('[required]').forEach(field => {
      if (!field.value.trim()) {
        valid = false;
        field.setAttribute('aria-invalid', 'true');
        field.style.boxShadow = 'var(--shadow-inset), 0 0 0 2px var(--highlight)';
      } else {
        field.removeAttribute('aria-invalid');
        field.style.boxShadow = '';
      }
    });
    if (!valid) { e.preventDefault(); this.querySelector('[aria-invalid="true"]').focus(); }
  });

  // ── RESPECT REDUCED MOTION ──
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ═══════════════════════════════════════════════════════
  // THE UNIQUE ANIMATION: NEUMORPHIC SHADOW BREATHING
  // The hero h1 casts real-time neumorphic shadows that
  // track the cursor — as if you're holding a lamp over
  // a clay surface. Light source moves, shadows shift.
  // ═══════════════════════════════════════════════════════
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle && !prefersReduced) {
    let raf = null;
    let targetX = 0.5, targetY = 0.5;
    let currentX = 0.5, currentY = 0.5;

    document.addEventListener('mousemove', e => {
      targetX = e.clientX / window.innerWidth;
      targetY = e.clientY / window.innerHeight;
    });

    const lerp = (a, b, t) => a + (b - a) * t;

    const tick = () => {
      currentX = lerp(currentX, targetX, 0.06);
      currentY = lerp(currentY, targetY, 0.06);

      // Map cursor position to shadow direction
      // Light comes from cursor direction
      const shadowX = (currentX - 0.5) * -18;  // -9 to +9px
      const shadowY = (currentY - 0.5) * -18;
      const lightX  = (currentX - 0.5) * 8;
      const lightY  = (currentY - 0.5) * 8;

      const darkColor   = getComputedStyle(document.documentElement).getPropertyValue('--neu-dark').trim();
      const lightColor  = getComputedStyle(document.documentElement).getPropertyValue('--neu-light').trim();
      const highlightColor = getComputedStyle(document.documentElement).getPropertyValue('--highlight').trim();

      // Shadow: dark side away from light, light side toward light
      heroTitle.style.textShadow = `
        ${shadowX}px ${shadowY}px 20px ${darkColor},
        ${lightX}px ${lightY}px 12px ${lightColor},
        ${shadowX * 0.3}px ${shadowY * 0.3}px 6px rgba(192,86,42,0.08)
      `;

      raf = requestAnimationFrame(tick);
    };
    tick();

    // Pause when not visible
    const heroObs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { if (!raf) tick(); }
      else { cancelAnimationFrame(raf); raf = null; }
    });
    heroObs.observe(document.getElementById('hero'));
  }

  // ── MAGNETIC GLOW on primary button ──
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width * 100).toFixed(1);
      const y = ((e.clientY - r.top)  / r.height * 100).toFixed(1);
      btn.style.setProperty('--mx', x + '%');
      btn.style.setProperty('--my', y + '%');
    });
  });

  // ── CURSOR RIPPLE ──
  if (!prefersReduced) {
    document.addEventListener('click', e => {
      const r = document.createElement('div');
      r.className = 'ripple';
      r.style.left = e.clientX + 'px';
      r.style.top  = e.clientY + 'px';
      document.body.appendChild(r);
      r.addEventListener('animationend', () => r.remove());
    });
  }

  // ═══════════════════════════════════════════════════════
  // SECTION-SPECIFIC SCROLL ANIMATIONS
  // ═══════════════════════════════════════════════════════

  // ── Helper: staggered reveal ──
  function revealStaggered(selector, cls, baseDelay = 0, step = 80) {
    const els = document.querySelectorAll(selector);
    if (!els.length) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const allEls = [...document.querySelectorAll(selector)];
        const idx = allEls.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add(cls);
        }, baseDelay + idx * step);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.1 });
    els.forEach(el => obs.observe(el));
  }

  if (prefersReduced) {
    // Instantly show everything
    document.querySelectorAll(
      '.anim-hero-word,.anim-about-char,.anim-stat,.anim-stack-group,.anim-process-step,.anim-project-card,.anim-why-item,.anim-open-card,.anim-contact-left,.anim-contact-right,.fade-up,.anim-client-card,.anim-clients-count'
    ).forEach(el => {
      el.style.opacity = 1;
      el.style.transform = 'none';
      el.style.filter = 'none';
    });
  }

  // ── HERO: word-by-word clay press ──
  (() => {
    const h1 = document.querySelector('.hero-title');
    if (!h1) return;
    const raw = h1.innerHTML;
    // Wrap each word preserving <br/> and <em>
    const wrapped = raw.replace(/(<br\s*\/?>|<\/?em>|<[^>]+>)|([^\s<]+)/g, (match, tag, word) => {
      if (tag) return tag;
      return `<span class="anim-hero-word">${word}</span>`;
    });
    h1.innerHTML = wrapped;

    const words = h1.querySelectorAll('.anim-hero-word');
    words.forEach((w, i) => {
      setTimeout(() => {
        w.classList.add('in');
      }, 200 + i * 120);
    });
  })();

  // ── ABOUT: heading letter-by-letter with neumorphic depth pulse ──
  (() => {
    const heading = document.querySelector('#about .section-title');
    if (!heading) return;
    const text = heading.textContent;
    heading.innerHTML = [...text].map((ch, i) =>
      ch === ' '
        ? ' '
        : `<span class="anim-about-char" style="transition-delay:${i * 28}ms">${ch}</span>`
    ).join('');

    const obs = new IntersectionObserver(entries => {
      const entry = entries[0];

      if (!entry.isIntersecting) return;

      heading.querySelectorAll('.anim-about-char').forEach((ch, i) => {
        setTimeout(() => {
          ch.classList.add('in');
          setTimeout(() => ch.classList.add('pulse'), 80);
        }, i * 28);
      });

      obs.disconnect();
    }, { threshold: 0.3 });
    obs.observe(heading);
  })();

  // ── STAT CARDS: stamp in with count-up ──
  (() => {
    const cards = document.querySelectorAll('.stat-card');
    if (!cards.length) return;
    cards.forEach((card, i) => card.classList.add('anim-stat'));

    const countUp = (el, target, suffix) => {
      const isNum = !isNaN(parseInt(target));
      if (!isNum) return;
      const end = parseInt(target);
      let current = 0;
      const duration = 900;
      const startTime = performance.now();
      const update = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        current = Math.floor(ease * end);
        el.textContent = current + suffix;
        if (progress < 1) requestAnimationFrame(update);
      };
      requestAnimationFrame(update);
    };

    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const allCards = [...document.querySelectorAll('.stat-card')];
        const idx = allCards.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('in');
          setTimeout(() => entry.target.classList.add('stamp'), 50);
          const numEl = entry.target.querySelector('.stat-num');
          const raw = numEl.getAttribute('aria-label') || '';
          const match = raw.match(/(\d+)/);
          if (match) {
            const hasPlusSign = numEl.textContent.includes('+');
            countUp(numEl, match[1], hasPlusSign ? '+' : '');
          }
        }, idx * 120);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.3 });
    cards.forEach(c => obs.observe(c));
  })();
 
// ── CLIENTS COUNT: delayed reveal ──
(() => {
  const count = document.querySelector('.anim-clients-count');
  if (!count) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      setTimeout(() => count.classList.add('in'), 300);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.3 });
  obs.observe(count);
})();

  // ── STACK GROUPS: card deck fold-open ──
  revealStaggered('.anim-stack-group', 'in', 0, 100);

  // ── PROCESS: staggered telegraph reveal ──
  revealStaggered('.anim-process-step', 'in', 0, 130);

  // ── CLIENTS: staggered category reveal ──
  revealStaggered('.anim-clients-category', 'in', 0, 120);

  // ── CLIENT CARDS: staggered bas-relief emerge ──
revealStaggered('.anim-client-card', 'in', 0, 70);

  // ── PROJECTS: bas-relief emerge ──
  revealStaggered('.anim-project-card', 'in', 0, 90);

  // ── WHY ITEMS: magnetic snap ──
  revealStaggered('.anim-why-item', 'in', 0, 100);

  // ── OPEN TO CARDS: float bounce ──
  revealStaggered('.anim-open-card', 'in', 0, 80);

  // ── CONTACT: split reveal ──
  (() => {
    const left = document.querySelector('.anim-contact-left');
    const right = document.querySelector('.anim-contact-right');
    if (!left && !right) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.2 });
    if (left) obs.observe(left);
    if (right) { setTimeout(() => obs.observe(right), 120); }
  })();

  // ── FADE-UP FALLBACK ──
  const fallbackObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fallbackObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.fade-up').forEach(el => fallbackObs.observe(el));