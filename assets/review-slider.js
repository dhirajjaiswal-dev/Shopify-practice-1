document.addEventListener('DOMContentLoaded', () => {
  const section = document.querySelector('[data-reaction-section]');
  const slider = document.querySelector('[data-review-slider]');
  if (!slider) return;

  const prevBtn = document.querySelector('[data-slide-prev]');
  const nextBtn = document.querySelector('[data-slide-next]');

  // ── Auto-scroll ──────────────────────────────────────────────
  const SCROLL_SPEED = 1; // px per frame
  let autoScrollPaused = false;
  let rafId = null;

  function autoScroll() {
    if (!autoScrollPaused) {
      // If we've reached the end, loop back to start
      if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 2) {
        slider.scrollLeft = 0;
      } else {
        slider.scrollLeft += SCROLL_SPEED;
      }
    }
    rafId = requestAnimationFrame(autoScroll);
  }

  rafId = requestAnimationFrame(autoScroll);

  // Pause auto-scroll when mouse is anywhere in the section
  if (section) {
    section.addEventListener('mouseenter', () => { autoScrollPaused = true; });
    section.addEventListener('mouseleave', () => { autoScrollPaused = false; });
  }

  // ── Manual arrows ────────────────────────────────────────────
  function getScrollAmount() {
    const firstCard = slider.firstElementChild;
    if (!firstCard) return 260;
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

  // ── Video: play on hover, pause on leave ─────────────────────
  slider.querySelectorAll('.review-card').forEach((card) => {
    const video = card.querySelector('.review-video');
    if (!video) return;

    // video is autoplay/muted so it already plays; pause it when not hovered
    // video autoplays by default; pause it on hover (play icon becomes visible via CSS)
    card.addEventListener('mouseenter', () => {
      video.pause();
    });
    card.addEventListener('mouseleave', () => {
      video.play();
    });
  });
});
