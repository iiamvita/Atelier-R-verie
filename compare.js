// Before and after slider: the range input sets how much of the "after" image shows
class CompareSlider {
  constructor(root) {
    this.root = root;
    this.range = root.querySelector('.compare__range');
    if (this.range) this.init();
  }

  init() {
    this.update();
    this.range.addEventListener('input', () => this.update());
  }

  update() {
    this.root.style.setProperty('--pos', this.range.value + '%');
  }
}

document.querySelectorAll('[data-compare]').forEach((el) => new CompareSlider(el));