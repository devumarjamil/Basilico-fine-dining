(function () {

function initBasilicoFunctionalUI() {
  if (window.__basilicoFunctionalUIInitialized) return;
  window.__basilicoFunctionalUIInitialized = true;

  /* ===== Menu modal ===== */
  var menuModal = document.getElementById("menuModal");
  var openMenuBtn = document.getElementById("openMenuBtn");
  var menuModalClose = document.getElementById("menuModalClose");
  var menuModalBackdrop = document.getElementById("menuModalBackdrop");
  
  function openMenu() {
    menuModal.classList.add("open");
    document.body.style.overflow = "hidden";
    if (window.lenis && typeof window.lenis.stop === "function") window.lenis.stop();
  }
  function closeMenu() {
    menuModal.classList.remove("open");
    document.body.style.overflow = "";
    if (window.lenis && typeof window.lenis.start === "function") window.lenis.start();
  }
  openMenuBtn.addEventListener("click", openMenu);
  menuModalClose.addEventListener("click", closeMenu);
  menuModalBackdrop.addEventListener("click", closeMenu);
  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menuModal.classList.contains("open")) closeMenu();
  });
  
  /* ===== Testimonial carousel ===== */
  var testimonialFigs = Array.prototype.slice.call(document.querySelectorAll(".testimonial-fig"));
  var dotsWrap = document.getElementById("testimonialDots");
  var tIndex = 0;
  var tTimer = null;
  
  testimonialFigs.forEach(function (fig, i) {
    var dot = document.createElement("button");
    dot.className = "testimonial-dot" + (i === 0 ? " active" : "");
    dot.setAttribute("aria-label", "Show testimonial " + (i + 1));
    dot.setAttribute("data-cursor-hover", "");
    dot.addEventListener("click", function () { showTestimonial(i); resetTimer(); });
    dotsWrap.appendChild(dot);
  });
  var testimonialDots = Array.prototype.slice.call(dotsWrap.querySelectorAll(".testimonial-dot"));
  
  function showTestimonial(i) {
    tIndex = (i + testimonialFigs.length) % testimonialFigs.length;
    testimonialFigs.forEach(function (fig, idx) {
      fig.classList.toggle("active", idx === tIndex);
    });
    testimonialDots.forEach(function (dot, idx) {
      dot.classList.toggle("active", idx === tIndex);
    });
  }
  function resetTimer() {
    if (tTimer) clearInterval(tTimer);
    tTimer = setInterval(function () { showTestimonial(tIndex + 1); }, 6500);
  }
  document.getElementById("testimonialPrev").addEventListener("click", function () { showTestimonial(tIndex - 1); resetTimer(); });
  document.getElementById("testimonialNext").addEventListener("click", function () { showTestimonial(tIndex + 1); resetTimer(); });
  resetTimer();
  
  /* ===== Reservation form ===== */
  var reservationForm = document.getElementById("reservationForm");
  var reservationNote = document.getElementById("reservationNote");
  reservationForm.addEventListener("submit", function (e) {
    e.preventDefault();
    reservationForm.style.display = "none";
    reservationNote.style.display = "block";
  });
  document.getElementById("reservationReset").addEventListener("click", function () {
    reservationForm.reset();
    reservationForm.style.display = "flex";
    reservationNote.style.display = "none";
  });
  
  /* ===== Newsletter form ===== */
  var newsletterForm = document.getElementById("newsletterForm");
  var newsletterNote = document.getElementById("newsletterNote");
  newsletterForm.addEventListener("submit", function (e) {
    e.preventDefault();
    newsletterForm.style.display = "none";
    newsletterNote.style.display = "block";
  });
  
  /* ===== Footer year ===== */
  document.getElementById("footerYear").textContent = "\u00A9 " + new Date().getFullYear() + " Basilico. All rights reserved.";
}

    function initBasilicoUI() {
      var navbar = document.getElementById("navbar");
      if (navbar) {
        function onScroll() {
          navbar.classList.toggle("scrolled", window.scrollY > 24);
        }
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
      }

      var mobileToggle = document.getElementById("mobileToggle");
      var mobileMenu = document.getElementById("mobileMenu");
      if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener("click", function () {
          mobileToggle.classList.toggle("open");
          mobileMenu.classList.toggle("open");
        });
        mobileMenu.querySelectorAll("a").forEach(function (link) {
          link.addEventListener("click", function () {
            mobileToggle.classList.remove("open");
            mobileMenu.classList.remove("open");
          });
        });
      }

      initBasilicoFunctionalUI();

      if (window.matchMedia("(pointer: coarse)").matches) return;
      var ring = document.getElementById("cursorRing");
      var dot = document.getElementById("cursorDot");
      if (!ring || !dot) return;

      var mouseX = -100, mouseY = -100;
      var ringX = -100, ringY = -100, dotX = -100, dotY = -100;
      window.addEventListener("mousemove", function (event) {
        mouseX = event.clientX;
        mouseY = event.clientY;
      });
      window.addEventListener("mouseover", function (event) {
        var target = event.target;
        if (target.closest && target.closest("[data-cursor-hover]")) {
          ring.classList.add("hovering");
          dot.classList.add("hovering");
        }
      });
      window.addEventListener("mouseout", function (event) {
        var target = event.target;
        if (target.closest && target.closest("[data-cursor-hover]")) {
          ring.classList.remove("hovering");
          dot.classList.remove("hovering");
        }
      });
      (function tick() {
        dotX += (mouseX - dotX) * 0.28;
        dotY += (mouseY - dotY) * 0.28;
        ringX += (mouseX - ringX) * 0.16;
        ringY += (mouseY - ringY) * 0.16;
        dot.style.transform = "translate(" + dotX + "px," + dotY + "px) translate(-50%,-50%)" + (dot.classList.contains("hovering") ? " scale(0)" : "");
        ring.style.transform = "translate(" + ringX + "px," + ringY + "px) translate(-50%,-50%)";
        requestAnimationFrame(tick);
      })();
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initBasilicoUI);
    else initBasilicoUI();
    })();
    