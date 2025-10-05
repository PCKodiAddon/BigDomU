// BigDomU Site JS
// - IntersectionObserver for reveal animations
// - Accessible gallery modal with keyboard support
// - Reduced motion awareness

(function () {
  // Current year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Respect reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reveal on scroll
  if (!prefersReduced && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  } else {
    // No animations if reduced motion requested
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('animate-in'));
  }

  // Gallery modal
  const modalEl = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  const modalCaption = document.getElementById('modalCaption');
  const bsModal = modalEl ? new bootstrap.Modal(modalEl) : null;

  function openModal(src, alt, caption) {
    if (!bsModal || !modalImage || !modalCaption) return;
    modalImage.src = src || '';
    modalImage.alt = alt || '';
    modalCaption.textContent = caption || '';
    bsModal.show();
  }

  // Delegate clicks
  document.addEventListener('click', function (e) {
    const trigger = e.target.closest('.gallery-item');
    if (!trigger) return;

    e.preventDefault();
    const src = trigger.getAttribute('data-image');
    const caption = trigger.getAttribute('data-caption') || '';
    const imgEl = trigger.querySelector('img');
    const alt = imgEl ? imgEl.getAttribute('alt') : caption;
    openModal(src, alt, caption);
  });

  // Keyboard accessibility: Enter/Space to open
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.setAttribute('tabindex', '0');
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const src = item.getAttribute('data-image');
        const caption = item.getAttribute('data-caption') || '';
        const imgEl = item.querySelector('img');
        const alt = imgEl ? imgEl.getAttribute('alt') : caption;
        openModal(src, alt, caption);
      }
    });
  });
})();