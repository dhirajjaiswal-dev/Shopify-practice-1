document.addEventListener('DOMContentLoaded', () => {
  const section = document.querySelector('[data-reaction-section]');
  const slider = document.querySelector('[data-review-slider]');
  if (!slider) return;

  const prevBtn = document.querySelector('[data-slide-prev]');
  const nextBtn = document.querySelector('[data-slide-next]');

  // ── Infinite loop: clone all cards and append ─────────────────
  const originalCards = Array.from(slider.children);
  originalCards.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    slider.appendChild(clone);
  });

  // Half-width = width of original set (used for seamless reset)
  function getOriginalWidth() {
    return originalCards.reduce((total, card) => {
      const gap = parseInt(getComputedStyle(slider).gap, 10) || 16;
      return total + card.offsetWidth + gap;
    }, 0);
  }

  // ── Auto-scroll ──────────────────────────────────────────────
  const SCROLL_SPEED = 1; // px per frame
  let autoScrollPaused = false;

  function autoScroll() {
    if (!autoScrollPaused) {
      slider.scrollLeft += SCROLL_SPEED;
      // When we've scrolled through the original set, jump back silently
      if (slider.scrollLeft >= getOriginalWidth()) {
        slider.scrollLeft -= getOriginalWidth();
      }
    }
    requestAnimationFrame(autoScroll);
  }

  requestAnimationFrame(autoScroll);

  // Pause auto-scroll when mouse is anywhere in the section
  if (section) {
    section.addEventListener('mouseenter', () => { autoScrollPaused = true; });
    section.addEventListener('mouseleave', () => { autoScrollPaused = false; });
  }

  // ── Manual arrows ────────────────────────────────────────────
  function getScrollAmount() {
    const firstCard = slider.firstElementChild;
    if (!firstCard) return 316;
    const gap = parseInt(getComputedStyle(slider).gap, 10) || 16;
    return firstCard.offsetWidth + gap;
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      slider.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      slider.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    });
  }

  // ── Video: autoplay by default, pause + show icon on hover ───
  function bindVideoHover(card) {
    const video = card.querySelector('.review-video');
    if (!video) return;
    card.addEventListener('mouseenter', () => { video.pause(); });
    card.addEventListener('mouseleave', () => { video.play(); });
  }

  slider.querySelectorAll('.review-card').forEach(bindVideoHover);
});
