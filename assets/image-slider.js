
  let currentIndex = 0;
  const slides = document.querySelectorAll('.product-slide');
  const totalSlides = slides.length;

  function showImage(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('opacity-100', i === index);
      slide.classList.toggle('opacity-0', i !== index);
    });
    currentIndex = index;
  }

  function nextImage() {
    const next = (currentIndex + 1) % totalSlides;
    showImage(next);
  }

  function prevImage() {
    const prev = (currentIndex - 1 + totalSlides) % totalSlides;
    showImage(prev);
  }

  function goToImage(index) {
    showImage(index);
  }

