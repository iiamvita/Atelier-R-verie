// The house draws itself as you scroll through the "build" stage
class HouseBuilder {
  constructor(scroller) {
    this.scroller = scroller;
    this.parts = [...scroller.querySelectorAll('[data-start]')];
    this.steps = [...scroller.querySelectorAll('.house__steps li')];
    this.stages = [0, 0.25, 0.5, 0.75];
    this.ticking = false;
    this.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!this.reduceMotion && this.parts.length) this.init();
  }

  init() {
    this.scroller.classList.add('is-armed');
    this.parts.forEach((part) => {
      if (part.dataset.type === 'draw') {
        part.setAttribute('pathLength', '1');
        part.style.strokeDasharray = '1 2';
      }
    });
    this.update();
    window.addEventListener('scroll', () => this.request(), { passive: true });
    window.addEventListener('resize', () => this.request());
  }

  request() {
    if (this.ticking) return;
    this.ticking = true;
    requestAnimationFrame(() => { this.update(); this.ticking = false; });
  }

  progress() {
    const rect = this.scroller.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    return Math.min(1, Math.max(0, -rect.top / total));
  }

  update() {
    const p = this.progress();
    this.parts.forEach((part) => {
      const start = Number(part.dataset.start);
      const end = Number(part.dataset.end);
      const t = Math.min(1, Math.max(0, (p - start) / (end - start)));
      if (part.dataset.type === 'draw') part.style.strokeDashoffset = 1 - t;
      else part.style.opacity = t;
    });
    const current = this.stages.filter((s) => p >= s).length - 1;
    this.steps.forEach((step, i) => {
      if (i === current) step.setAttribute('aria-current', 'step');
      else step.removeAttribute('aria-current');
      step.classList.toggle('is-done', i < current);
    });
  }
}

document.querySelectorAll('[data-house]').forEach((el) => new HouseBuilder(el));