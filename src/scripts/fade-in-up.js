// src/scripts/fade-in-up.js
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function initFadeInUp() {
  const targets = document.querySelectorAll('.fade-in-up');

  targets.forEach((el) => {
    gsap.fromTo(
      el,
      {
        opacity: 0,
        y: 60
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%', // when top of element hits 80% of viewport
          toggleActions: 'play none none none',
          once: true
        }
      }
    );
  });
}