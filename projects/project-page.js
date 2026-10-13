"use strict";
const root = document.documentElement;
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
const dialog = document.getElementById("imageDialog");
document.querySelectorAll("[data-preview]").forEach((button) => {
  button.addEventListener("click", () => {
    const img = document.getElementById("previewImage");
    img.src = button.dataset.preview;
    img.alt = button.dataset.caption;
    document.getElementById("previewCaption").textContent = button.dataset.caption;
    dialog.showModal();
  });
});
document.getElementById("closePreview").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  const bounds = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
});
