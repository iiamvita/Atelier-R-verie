// Navigation: strengthens the glass tint once the page scrolls
class StickyNav {
  constructor(selector, threshold = 60) {
    this.header = document.querySelector(selector);
    this.threshold = threshold;
    if (this.header) this.init();
  }

  init() {
    this.update();
    window.addEventListener('scroll', () => this.update(), { passive: true });
  }

  update() {
    this.header.classList.toggle('is-solid', window.scrollY > this.threshold);
  }
}

new StickyNav('.site-header');
