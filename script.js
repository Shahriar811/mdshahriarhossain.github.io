const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

const toggle = document.getElementById("menu-toggle");
const nav = document.getElementById("main-nav");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    nav.classList.toggle("open");
  });
}

document.querySelectorAll("#main-nav a").forEach((link) => {
  link.addEventListener("click", () => nav?.classList.remove("open"));
});

let frameId = null;
let nextMousePosition = { x: window.innerWidth / 2, y: window.innerHeight * 0.3 };

const updatePageGlow = () => {
  document.documentElement.style.setProperty("--mouse-x", `${nextMousePosition.x}px`);
  document.documentElement.style.setProperty("--mouse-y", `${nextMousePosition.y}px`);
  frameId = null;
};

window.addEventListener("pointermove", (event) => {
  nextMousePosition = { x: event.clientX, y: event.clientY };

  if (!frameId) {
    frameId = requestAnimationFrame(updatePageGlow);
  }
});

document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    card.style.setProperty("--card-x", `${x}%`);
    card.style.setProperty("--card-y", `${y}%`);
  });
});

document.querySelectorAll(".project").forEach((project) => {
  project.addEventListener("click", () => {
    project.classList.remove("is-active");
    void project.offsetWidth;
    project.classList.add("is-active");

    window.setTimeout(() => {
      project.classList.remove("is-active");
    }, 480);
  });
});

const revealTargets = document.querySelectorAll(".section-head, .card");
revealTargets.forEach((target) => target.classList.add("reveal"));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

revealTargets.forEach((target) => observer.observe(target));
