"use strict";
(() => {
  const dialog = document.getElementById("imageDialog");
  const previewImage = document.getElementById("previewImage");
  const previewCaption = document.getElementById("previewCaption");
  const previewControls = document.getElementById("galleryPreviewControls");
  const previewCount = document.getElementById("galleryPreviewCount");
  const previewOriginal = document.getElementById("galleryPreviewOriginal");
  let activeGallery = null;

  function updatePreview(gallery) {
    const button = gallery.slides[gallery.index].querySelector("[data-gallery-preview]");
    dialog.dataset.kind = button.dataset.previewKind || "chart";
    previewImage.src = button.dataset.preview;
    previewImage.alt = button.dataset.caption;
    previewCaption.textContent = button.dataset.caption;
    previewCount.textContent = `${gallery.index + 1} / ${gallery.slides.length}`;
    previewOriginal.href = button.dataset.preview;
    previewControls.hidden = false;
    dialog.scrollTop = 0;
  }

  document.querySelectorAll("[data-carousel]").forEach((element) => {
    const gallery = {element, index: 0, slides: [...element.querySelectorAll("[data-carousel-slide]")]};
    const dots = [...element.querySelectorAll("[data-carousel-dot]")];
    const count = element.querySelector("[data-carousel-count]");
    function render(index) {
      gallery.index = (index + gallery.slides.length) % gallery.slides.length;
      gallery.slides.forEach((slide, i) => {
        slide.hidden = i !== gallery.index;
        slide.setAttribute("aria-hidden", String(i !== gallery.index));
      });
      dots.forEach((dot, i) => {
        if (i === gallery.index) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
      });
      count.textContent = `${gallery.index + 1} / ${gallery.slides.length}`;
      if (activeGallery === gallery && dialog.open) updatePreview(gallery);
    }
    gallery.move = (direction) => render(gallery.index + direction);
    element.querySelector("[data-carousel-prev]").addEventListener("click", () => gallery.move(-1));
    element.querySelector("[data-carousel-next]").addEventListener("click", () => gallery.move(1));
    dots.forEach((dot, i) => dot.addEventListener("click", () => render(i)));
    element.addEventListener("keydown", (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        gallery.move(event.key === "ArrowLeft" ? -1 : 1);
      }
    });
    gallery.slides.forEach((slide) => {
      slide.querySelector("[data-gallery-preview]").addEventListener("click", () => {
        activeGallery = gallery;
        updatePreview(gallery);
        dialog.showModal();
      });
    });
    render(0);
  });

  document.getElementById("galleryPreviewPrev").addEventListener("click", () => activeGallery?.move(-1));
  document.getElementById("galleryPreviewNext").addEventListener("click", () => activeGallery?.move(1));
  dialog.addEventListener("keydown", (event) => {
    if (activeGallery && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
      event.preventDefault();
      activeGallery.move(event.key === "ArrowLeft" ? -1 : 1);
    }
  });
  dialog.addEventListener("close", () => {
    const gallery = activeGallery;
    activeGallery = null;
    previewControls.hidden = true;
    gallery?.slides[gallery.index].querySelector("[data-gallery-preview]").focus({preventScroll: true});
  });
})();
