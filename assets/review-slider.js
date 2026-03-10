document.addEventListener('DOMContentLoaded', () => {
  const slider = document.querySelector('[data-review-slider]');
  if (!slider) return;

  const prevBtn = document.querySelector('[data-slide-prev]');
  const nextBtn = document.querySelector('[data-slide-next]');

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
});
