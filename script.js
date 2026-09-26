import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.171.0/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.171.0/examples/jsm/controls/OrbitControls.js";

function leafGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(0.22, 0.22, 0.24, 0.62, 0, 1.05);
  shape.bezierCurveTo(-0.24, 0.62, -0.22, 0.22, 0, 0);
  return new THREE.ExtrudeGeometry(shape, {
    depth: 0.035, bevelEnabled: true, bevelThickness: 0.012,
    bevelSize: 0.012, bevelSegments: 3, curveSegments: 16,
  });
}

function wineGlassGeometry() {
  const pts = [
    new THREE.Vector2(0, 0), new THREE.Vector2(0.46, 0), new THREE.Vector2(0.46, 0.03),
    new THREE.Vector2(0.09, 0.07), new THREE.Vector2(0.065, 0.58), new THREE.Vector2(0.032, 0.62),
    new THREE.Vector2(0.032, 0.66), new THREE.Vector2(0.5, 0.8), new THREE.Vector2(0.58, 1.18),
    new THREE.Vector2(0.5, 1.52), new THREE.Vector2(0.4, 1.6),
  ];
  return new THREE.LatheGeometry(pts, 64);
}

function addLighting(scene) {
  scene.add(new THREE.AmbientLight(0xfff3e0, 1.4));
  scene.add(new THREE.HemisphereLight(0xffe6bf, 0x140d05, 1.0));
  const p1 = new THREE.PointLight(0xd9a35f, 7, 14);
  p1.position.set(3, 3, 3);
  scene.add(p1);
  const p2 = new THREE.PointLight(0xc97a2b, 5, 14);
  p2.position.set(-3, -1, -2);
  scene.add(p2);
  const p3 = new THREE.PointLight(0xffe6bf, 5, 14);
  p3.position.set(0, 2.5, -3);
  scene.add(p3);
}

function setupRenderer(container) {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  container.appendChild(renderer.domElement);
  const resize = () => {
    const w = container.clientWidth || 1;
    const h = container.clientHeight || 1;
    renderer.setSize(w, h, false);
  };
  resize();
  window.addEventListener("resize", resize);
  return renderer;
}

/* ---- Hero: gold basil-leaf halo ---- */
function initLeafHalo() {
  const container = document.getElementById("hero-canvas-wrap");
  if (!container) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0.4, 5.2);

  const renderer = setupRenderer(container);
  addLighting(scene);

  const group = new THREE.Group();
  scene.add(group);

  const leafGeo = leafGeometry();
  const leafMat = new THREE.MeshStandardMaterial({
    color: 0xd9a35f, metalness: 0.65, roughness: 0.28,
    emissive: 0xc97a2b, emissiveIntensity: 0.16,
  });

  const count = 7;
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const radius = 1.55;
    const leaf = new THREE.Mesh(leafGeo, leafMat);
    leaf.position.set(Math.cos(angle) * radius, Math.sin(angle * 0.6) * 0.35, Math.sin(angle) * radius);
    leaf.rotation.set((Math.random() * 0.3) - 0.15, angle + Math.PI / 2, (Math.random() * 0.4) - 0.2);
    leaf.scale.setScalar(0.85);
    group.add(leaf);
  }

  const torus = new THREE.Mesh(
    new THREE.TorusGeometry(1.75, 0.006, 16, 120),
    new THREE.MeshStandardMaterial({ color: 0xe8c496, metalness: 0.8, roughness: 0.2, emissive: 0xd9a35f, emissiveIntensity: 0.2 })
  );
  torus.rotation.set(Math.PI / 2.4, 0, 0);
  group.add(torus);

  const particleCount = 180;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const r = 2.6 + Math.random() * 2.2;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const particles = new THREE.Points(particleGeo, new THREE.PointsMaterial({
    size: 0.028, color: 0xe8c496, transparent: true, opacity: 0.55, sizeAttenuation: true,
  }));
  group.add(particles);

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    group.rotation.y += delta * 0.09;
    renderer.render(scene, camera);
  }

  function resizeCamera() {
    const w = container.clientWidth || 1;
    const h = container.clientHeight || 1;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resizeCamera();
  window.addEventListener("resize", resizeCamera);
  animate();
}

/* ---- Cellar: interactive stylized wine glass ---- */
function initWineGlass() {
  const container = document.getElementById("glass-canvas-wrap");
  if (!container) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0.4, 3.6);

  const renderer = setupRenderer(container);
  addLighting(scene);

  const group = new THREE.Group();
  group.position.set(0, -0.8, 0);
  scene.add(group);

  const glass = new THREE.Mesh(
    wineGlassGeometry(),
    new THREE.MeshPhysicalMaterial({
      color: 0xf4e6cf, transmission: 1, thickness: 0.6, roughness: 0.04,
      ior: 1.4, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.05,
    })
  );
  group.add(glass);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.6;
  controls.minPolarAngle = Math.PI / 2.6;
  controls.maxPolarAngle = Math.PI / 1.7;
  controls.target.set(0, -0.8, 0);

  function resizeCamera() {
    const w = container.clientWidth || 1;
    const h = container.clientHeight || 1;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resizeCamera();
  window.addEventListener("resize", resizeCamera);

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
}

function safeInit(fn, label) {
  try { fn(); } catch (err) { console.warn("[Basilico 3D] " + label + " failed to init:", err); }
}
safeInit(initLeafHalo, "hero leaf halo");
safeInit(initWineGlass, "wine glass");



/* ===== Real-photo -> illustrated-emblem fallback =====
   Real stock photos are the primary source everywhere. If a hosting
   environment blocks loading outside images (some hosted-preview
   platforms only allow a short list of script sources and no remote
   images at all), each broken photo swaps itself for a matching
   inline gold-line illustration instead of a broken-image icon. */
var emblemFallbackCounter = 0;
function emblemFallback(imgEl, motif) {
  if (imgEl.dataset.fbDone) return;
  imgEl.dataset.fbDone = "1";
  var tpl = document.getElementById("emblem-tpl-" + motif);
  if (!tpl) { imgEl.style.display = "none"; return; }
  var frag = tpl.content.cloneNode(true);
  var svg = frag.querySelector("svg");
  if (!svg) return;
  emblemFallbackCounter++;
  var n = emblemFallbackCounter;
  var idMap = {};
  svg.querySelectorAll("[id]").forEach(function (el) {
    var oldId = el.getAttribute("id");
    var newId = oldId + "-fb" + n;
    idMap[oldId] = newId;
    el.setAttribute("id", newId);
  });
  Object.keys(idMap).forEach(function (oldId) {
    var newId = idMap[oldId];
    svg.querySelectorAll("[fill],[stroke]").forEach(function (el) {
      ["fill", "stroke"].forEach(function (attr) {
        var val = el.getAttribute(attr);
        if (val === "url(#" + oldId + ")") el.setAttribute(attr, "url(#" + newId + ")");
      });
    });
  });
  svg.classList.add("emblem-svg");
  imgEl.replaceWith(svg);
}

document.addEventListener("DOMContentLoaded", function () {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined" || typeof Lenis === "undefined") {
    console.warn("[Basilico] Animation libraries failed to load.");
    return;
  }

  /* ===== Lenis smooth scroll + GSAP ticker sync ===== */
  gsap.registerPlugin(ScrollTrigger);
  var lenis = new Lenis({
    duration: 1.15,
    easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.2,
  });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);
  window.lenis = lenis;

  /* ===== Hero entrance ===== */
  var heroTl = gsap.timeline({ defaults: { ease: "power4.out" } });
  heroTl.fromTo(".hero-line", { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1.4, stagger: 0.14 })
    .fromTo(".hero-sub", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1 }, "-=0.9")
    .fromTo(".hero-cta", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.1 }, "-=0.8")
    .fromTo(".hero-card-anim", { y: 60, opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, duration: 1.6 }, "-=1.2");

  var heroCard = document.getElementById("heroCard");
  gsap.to(heroCard, { y: 18, duration: 3.2, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1.6 });

  /* ===== Section scroll reveals ===== */
  gsap.utils.toArray(".section-heading, .dishes-header, .tasting-price").forEach(function (el) {
    gsap.fromTo(el, { y: 40, opacity: 0 }, {
      y: 0, opacity: 1, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 82%" },
    });
  });

  gsap.fromTo(".dish-card", { y: 70, opacity: 0 }, {
    y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power3.out",
    scrollTrigger: { trigger: ".dish-grid", start: "top 75%" },
  });

  gsap.fromTo(".about-text > *", { y: 40, opacity: 0 }, {
    y: 0, opacity: 1, duration: 1, stagger: 0.12, ease: "power3.out",
    scrollTrigger: { trigger: ".about", start: "top 75%" },
  });
  gsap.fromTo(".about-image", { scale: 0.85, opacity: 0 }, {
    scale: 1, opacity: 1, duration: 1.3, ease: "power3.out",
    scrollTrigger: { trigger: ".about", start: "top 75%" },
  });

  gsap.fromTo(".tasting-item", { y: 50, opacity: 0 }, {
    y: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease: "power3.out",
    scrollTrigger: { trigger: ".tasting-grid", start: "top 85%" },
  });

  gsap.fromTo(".experience-content > *", { y: 40, opacity: 0 }, {
    y: 0, opacity: 1, duration: 1, stagger: 0.12, ease: "power3.out",
    scrollTrigger: { trigger: ".experience", start: "top 70%" },
  });
  gsap.fromTo("#experienceImg", { scale: 1.18 }, {
    scale: 1, ease: "none",
    scrollTrigger: { trigger: ".experience", start: "top bottom", end: "bottom top", scrub: 1 },
  });

  gsap.fromTo(".gallery-item", { y: 40, opacity: 0 }, {
    y: 0, opacity: 1, duration: 0.9, stagger: 0.08, ease: "power3.out",
    scrollTrigger: { trigger: ".gallery-grid", start: "top 85%" },
  });

  ScrollTrigger.refresh();

  /* ===== Menu modal ===== */
  var menuModal = document.getElementById("menuModal");
  var openMenuBtn = document.getElementById("openMenuBtn");
  var menuModalClose = document.getElementById("menuModalClose");
  var menuModalBackdrop = document.getElementById("menuModalBackdrop");

  function openMenu() {
    menuModal.classList.add("open");
    document.body.style.overflow = "hidden";
    lenis.stop();
  }
  function closeMenu() {
    menuModal.classList.remove("open");
    document.body.style.overflow = "";
    lenis.start();
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

});
