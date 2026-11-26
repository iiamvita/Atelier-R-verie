// Scroll reveal: elements are only hidden once this script is running,
// so if the script fails to load, everything stays visible.
class RevealOnScroll {
  constructor(selector, { threshold = 0, stagger = 120 } = {}) {
    this.items = document.querySelectorAll(selector);
    this.threshold = threshold;
    this.stagger = stagger;
    this.supported = 'IntersectionObserver' in window;
    this.init();
  }

  init() {
    if (!this.supported) return;
    this.observer = new IntersectionObserver((entries) => this.onIntersect(entries), {
      threshold: this.threshold,
      rootMargin: '0px 0px -8% 0px'
    });
    this.items.forEach((el, i) => {
      el.classList.add('is-armed');
      el.style.transitionDelay = (i % 3) * this.stagger + 'ms';
      this.observer.observe(el);
    });
  }

  onIntersect(entries) {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      this.observer.unobserve(entry.target);
    });
  }
}

new RevealOnScroll('[data-reveal]');

// Scroll reveal: elements are only hidden once this script is running,
// so if the script fails to load, everything stays visible.
class RevealOnScroll {
  constructor(selector, { threshold = 0, stagger = 120 } = {}) {
    this.items = document.querySelectorAll(selector);
    this.threshold = threshold;
    this.stagger = stagger;
    this.supported = 'IntersectionObserver' in window;
    this.init();
  }

  init() {
    if (!this.supported) return;
    this.observer = new IntersectionObserver((entries) => this.onIntersect(entries), {
      threshold: this.threshold,
      rootMargin: '0px 0px -8% 0px'
    });
    this.items.forEach((el, i) => {
      el.classList.add('is-armed');
      el.style.transitionDelay = (i % 3) * this.stagger + 'ms';
      this.observer.observe(el);
    });
  }

  onIntersect(entries) {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      this.observer.unobserve(entry.target);
    });
  }
}

new RevealOnScroll('[data-reveal]');