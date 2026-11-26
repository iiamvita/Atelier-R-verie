// Stage marker: appears after the hero and highlights the stage in view
class JourneyTracker {
  constructor(navSelector, heroSelector) {
    this.nav = document.querySelector(navSelector);
    this.hero = document.querySelector(heroSelector);
    this.links = this.nav ? [...this.nav.querySelectorAll('a[href^="#"]')] : [];
    if (this.nav && this.hero && 'IntersectionObserver' in window) this.init();
  }

  init() {
    new IntersectionObserver(([entry]) => {
      this.nav.classList.toggle('is-visible', !entry.isIntersecting);
    }, { threshold: 0.2 }).observe(this.hero);

    const stages = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) this.setActive(entry.target.id); });
    }, { rootMargin: '-45% 0px -45% 0px' });

    this.links.forEach((link) => {
      const stage = document.querySelector(link.hash);
      if (stage) stages.observe(stage);
    });
  }

  setActive(id) {
    this.links.forEach((link) => {
      if (link.hash === '#' + id) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }
}

new JourneyTracker('.journey', '.arch-hero');