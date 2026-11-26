// Light dial: moving the slider warms and dims the room, from morning to evening
class LightDial {
  constructor(root) {
    this.root = root;
    this.range = root.querySelector('input[type="range"]');
    if (this.range) this.init();
  }

  init() {
    this.update();
    this.range.addEventListener('input', () => this.update());
  }

  update() {
    this.root.style.setProperty('--dusk', this.range.value / 100);
  }
}

document.querySelectorAll('[data-dial]').forEach((el) => new LightDial(el));