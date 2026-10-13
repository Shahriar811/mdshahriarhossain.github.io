"use strict";
const EMAIL = "mdshahriarhossain08@gmail.com";
const root = document.documentElement;
const toast = document.getElementById("toast");
let toastTimer;
function notify(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
}
const themeToggle = document.getElementById("themeToggle");
function updateThemeControl() {
  const dark = root.dataset.theme === "dark";
  themeToggle.setAttribute("aria-label", `Switch to ${dark ? "light" : "dark"} theme`);
  themeToggle.setAttribute("aria-pressed", String(dark));
  document.querySelector('meta[name="theme-color"]').content = dark ? "#181a18" : "#f7f6ef";
}
updateThemeControl();
themeToggle.addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  try { localStorage.setItem("shahriar_portfolio_theme", root.dataset.theme); } catch { /* Storage is optional. */ }
  updateThemeControl();
});
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
function closeMenu(returnFocus = false) {
  navLinks.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  if (returnFocus) menuToggle.focus();
}
menuToggle.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") !== "true";
  navLinks.classList.toggle("open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
});
navLinks.addEventListener("click", (event) => { if (event.target.closest("a")) closeMenu(); });
document.addEventListener("keydown", (event) => { if (event.key === "Escape" && navLinks.classList.contains("open")) closeMenu(true); });
document.addEventListener("click", (event) => { if (!event.target.closest(".nav")) closeMenu(); });
window.matchMedia("(min-width: 801px)").addEventListener("change", (event) => { if (event.matches) closeMenu(); });
document.querySelectorAll(".work-section").forEach((section) => {
  const filters = section.querySelectorAll(".filter");
  const cards = section.querySelectorAll(".project-card");
  filters.forEach((button) => {
    button.addEventListener("click", () => {
      filters.forEach((filter) => {
        const selected = filter === button;
        filter.classList.toggle("active", selected);
        filter.setAttribute("aria-pressed", String(selected));
      });
      let count = 0;
      cards.forEach((card) => {
        const visible = button.dataset.filter === "all" || card.dataset.category.split(" ").includes(button.dataset.filter);
        card.hidden = !visible;
        if (visible) count++;
      });
      section.querySelector(".project-count").textContent = `${count} ${count === 1 ? "project" : "projects"}`;
    });
  });
});
document.getElementById("copyEmailBtn").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(EMAIL);
    notify("Email address copied. Let’s talk!");
  } catch {
    const field = document.createElement("textarea");
    field.value = EMAIL;
    field.style.cssText = "position:fixed;opacity:0;left:0;top:0";
    document.body.appendChild(field);
    field.select();
    let copied = false;
    try { copied = document.execCommand("copy"); } catch { /* Direct email remains available. */ }
    field.remove();
    document.getElementById("copyEmailBtn").focus();
    notify(copied ? "Email address copied. Let’s talk!" : `Email me at ${EMAIL}`);
  }
});
document.getElementById("contactForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("formName").value.trim();
  const subject = document.getElementById("formSubject").value.trim();
  const message = document.getElementById("formMessage").value.trim();
  if (!name || !subject || !message) { notify("Please add your name, a subject, and a message."); return; }
  const body = `Hi Shahriar,\n\n${message}\n\nFrom: ${name}`;
  window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  notify("Email draft requested. Send it from your email app.");
});
const dialog = document.getElementById("imageDialog");
const previewImage = document.getElementById("previewImage");
document.querySelectorAll("[data-preview]").forEach((button) => {
  button.addEventListener("click", () => {
    dialog.dataset.kind = button.dataset.previewKind || "phone";
    previewImage.src = button.dataset.preview;
    previewImage.alt = button.dataset.caption;
    document.getElementById("previewCaption").textContent = button.dataset.caption;
    dialog.showModal();
  });
});
document.getElementById("closePreview").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  const bounds = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
});
if ("IntersectionObserver" in window) {
  const links = [...navLinks.querySelectorAll("a")];
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-15% 0px -70% 0px" });
  document.querySelectorAll("main section[id]").forEach((section) => observer.observe(section));
}
document.getElementById("year").textContent = new Date().getFullYear();
