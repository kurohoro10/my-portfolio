document.getElementById('year').textContent = new Date().getFullYear();

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

const observer = new IntersectionObserver(entries => {
entries.forEach(entry => {
    if (entry.isIntersecting) {
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
    }
});
}, { threshold: 0.12 });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

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
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

document.getElementById('contactForm').addEventListener('submit', function(e) {
let valid = true;
this.querySelectorAll('[required]').forEach(field => {
    if (!field.value.trim()) {
    valid = false;
    field.setAttribute('aria-invalid', 'true');
    field.style.borderColor = 'var(--highlight)';
    } else {
    field.removeAttribute('aria-invalid');
    field.style.borderColor = '';
    }
});
if (!valid) {
    e.preventDefault();
    this.querySelector('[aria-invalid="true"]').focus();
}
});