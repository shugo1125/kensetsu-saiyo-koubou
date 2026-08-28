/* ============================================
   サンプル猿人 採用サイト - script.js
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  initHamburger();
  initFadeIn();
  initSlider();
});

/* --- ハンバーガーメニュー --- */
function initHamburger() {
  const hamburger = document.getElementById("hamburger");
  const nav = document.getElementById("nav");
  if (!hamburger || !nav) return;

  hamburger.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    hamburger.classList.toggle("is-active");
    hamburger.setAttribute("aria-expanded", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      hamburger.classList.remove("is-active");
      hamburger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  });
}

/* --- フェードインアニメーション --- */
function initFadeIn() {
  const targets = document.querySelectorAll(".fade-in");
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  targets.forEach((t) => observer.observe(t));
}

/* --- ヒーロースライダー --- */
function initSlider() {
  const slides = document.querySelectorAll(".hero__slide");
  const indicators = document.querySelectorAll(".hero__indicator");
  if (slides.length < 2) return;

  let current = 0;
  let interval;

  function goTo(index) {
    slides[current].classList.remove("is-active");
    indicators[current]?.classList.remove("is-active");
    current = index % slides.length;
    slides[current].classList.add("is-active");
    indicators[current]?.classList.add("is-active");
  }

  function next() {
    goTo(current + 1);
  }

  function startAutoplay() {
    interval = setInterval(next, 4000);
  }

  function stopAutoplay() {
    clearInterval(interval);
  }

  indicators.forEach((ind, i) => {
    ind.addEventListener("click", () => {
      stopAutoplay();
      goTo(i);
      startAutoplay();
    });
  });

  startAutoplay();
}

