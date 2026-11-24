document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('nav-menu');

  // Mobile navigation toggle
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });

  // Smooth scrolling (also closes the mobile menu)
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Highlight the current section in the navigation
  const links = [...menu.querySelectorAll('a')];
  const spy = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id));
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  ['academics', 'campus-life', 'facilities', 'blog', 'contact'].forEach(id => {
    const el = document.getElementById(id);
    if (el) spy.observe(el);
  });

  // Read More for blog posts
  document.querySelectorAll('.read-more').forEach(btn => {
    btn.addEventListener('click', () => {
      const more = btn.previousElementSibling;
      const show = more.hidden;
      more.hidden = !show;
      btn.textContent = show ? 'Show Less' : 'Read More';
      btn.setAttribute('aria-expanded', show);
    });
  });

  // Interactive hover effect for cards on touch and keyboard focus
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('focusin', () => card.classList.add('hover'));
    card.addEventListener('focusout', () => card.classList.remove('hover'));
  });

  // Contact form validation
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const rules = {
    name: v => v.trim().length >= 2 || 'Enter your name (at least 2 characters).',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Enter a valid email, like name@example.com.',
    message: v => v.trim().length >= 10 || 'Write a message of at least 10 characters.'
  };
  const check = field => {
    const result = rules[field.name](field.value);
    document.getElementById(field.name + '-err').textContent = result === true ? '' : result;
    field.classList.toggle('invalid', result !== true);
    return result === true;
  };
  Object.keys(rules).forEach(n => form.elements[n].addEventListener('input', () => check(form.elements[n])));
  form.addEventListener('submit', e => {
    e.preventDefault();
    status.textContent = '';
    const ok = Object.keys(rules).map(n => check(form.elements[n])).every(Boolean);
    if (ok) {
      status.textContent = 'Thanks, your message was sent.';
      form.reset();
    }
  });
});
