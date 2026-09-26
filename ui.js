(function () {
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
    