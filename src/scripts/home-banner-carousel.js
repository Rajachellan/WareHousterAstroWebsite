import gsap from 'gsap';

export default function initTailwindCarousel() {
  const slides = gsap.utils.toArray('.carousel-slide');
  let current = 2; // center slide index

  function updateCarousel() {
    slides.forEach((slide, i) => {
      const offset = i - current;
      const scale = offset === 0 ? 1 : 0.85;
      const rotateY = offset * 25;
      const translateX = offset * 320;

      gsap.to(slide, {
        x: translateX,
        scale: scale,
        rotateY: rotateY,
        opacity: Math.abs(offset) > 2 ? 0 : 1,
        duration: 0.4,
        ease: 'power2.out'
      });
    });
  }

  updateCarousel();

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') current = Math.min(current + 1, slides.length - 1);
    if (e.key === 'ArrowLeft') current = Math.max(current - 1, 0);
    updateCarousel();
  });
}