/* ============================================
   株式会社サンプル建設 採用サイト - script.js
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  initHamburger();
  initFadeIn();
  initCountUp();
  initFaq();
  initEntryForm();
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
    hamburger.setAttribute("aria-label", isOpen ? "メニューを閉じる" : "メニューを開く");
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  // メニュー内リンクをクリックしたら閉じる
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      hamburger.classList.remove("is-active");
      hamburger.setAttribute("aria-expanded", "false");
      hamburger.setAttribute("aria-label", "メニューを開く");
      document.body.style.overflow = "";
    });
  });
}

/* --- フェードインアニメーション (Intersection Observer) --- */
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

  targets.forEach((target) => observer.observe(target));
}

/* --- 数字カウントアップアニメーション --- */
function initCountUp() {
  const numbers = document.querySelectorAll(".numbers__num");
  if (!numbers.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  numbers.forEach((el) => observer.observe(el));
}

function animateCount(el) {
  const target = parseFloat(el.dataset.count);
  const isDecimal = target % 1 !== 0;
  const duration = 1500;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = target * eased;

    el.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = isDecimal ? target.toFixed(1) : target;
    }
  }

  requestAnimationFrame(update);
}

/* --- FAQアコーディオン --- */
function initFaq() {
  const items = document.querySelectorAll(".faq__item");
  if (!items.length) return;

  items.forEach((item) => {
    const question = item.querySelector(".faq__question");
    const answer = item.querySelector(".faq__answer");
    if (!question || !answer) return;

    question.addEventListener("click", () => {
      const isOpen = item.classList.toggle("is-open");
      question.setAttribute("aria-expanded", isOpen);

      if (isOpen) {
        answer.style.maxHeight = answer.scrollHeight + "px";
      } else {
        answer.style.maxHeight = "0";
      }
    });
  });
}

/* --- エントリーフォーム バリデーション --- */
function initEntryForm() {
  const form = document.getElementById("entry-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (validateForm(form)) {
      showModal();
      form.reset();
    }
  });

  // リアルタイムバリデーション
  form.querySelectorAll("[required]").forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.classList.contains("is-error")) {
        validateField(field);
      }
    });
  });
}

function validateForm(form) {
  let isValid = true;
  form.querySelectorAll("[required]").forEach((field) => {
    if (!validateField(field)) {
      isValid = false;
    }
  });

  const privacy = form.querySelector("#privacy");
  if (privacy && !privacy.checked) {
    isValid = false;
    const error = privacy.closest(".form__privacy")?.nextElementSibling;
    if (error) {
      error.classList.add("is-show");
    }
  }

  return isValid;
}

function validateField(field) {
  const errorEl = field.parentElement.querySelector(".form__error");
  let isValid = true;
  let message = "";

  if (!field.value.trim()) {
    isValid = false;
    message = "この項目は必須です";
  } else if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
    isValid = false;
    message = "正しいメールアドレスを入力してください";
  } else if (field.type === "tel" && !/^[\d-]+$/.test(field.value)) {
    isValid = false;
    message = "正しい電話番号を入力してください";
  }

  if (isValid) {
    field.classList.remove("is-error");
    if (errorEl) {
      errorEl.classList.remove("is-show");
      errorEl.textContent = "";
    }
  } else {
    field.classList.add("is-error");
    if (errorEl) {
      errorEl.classList.add("is-show");
      errorEl.textContent = message;
    }
  }

  return isValid;
}

function showModal() {
  const modal = document.getElementById("submit-modal");
  if (!modal) return;

  modal.classList.add("is-open");
  document.body.style.overflow = "hidden";

  const closeBtn = modal.querySelector(".modal__close");
  const overlay = modal.querySelector(".modal__overlay");

  function close() {
    modal.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  if (closeBtn) closeBtn.addEventListener("click", close);
  if (overlay) overlay.addEventListener("click", close);
}
