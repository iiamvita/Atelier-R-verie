// Collection page: filtering (with a gliding View Transition) and an image lightbox
class CollectionFilter {
  constructor(buttons, tiles, countEl) {
    this.buttons = buttons;
    this.tiles = tiles;
    this.countEl = countEl;
    this.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.init();
  }

  init() {
    this.tiles.forEach((tile, i) => { tile.style.viewTransitionName = 'tile-' + i; });
    this.buttons.forEach((button) => button.addEventListener('click', () => this.select(button)));
    this.updateCount();
  }

  select(button) {
    const category = button.dataset.filter;
    const apply = () => {
      this.buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
      this.tiles.forEach((tile) => {
        tile.hidden = !(category === 'all' || tile.dataset.cat === category);
      });
      this.updateCount();
    };
    if (document.startViewTransition && !this.reduceMotion) document.startViewTransition(apply);
    else apply();
  }

  updateCount() {
    const shown = this.tiles.filter((tile) => !tile.hidden).length;
    this.countEl.textContent = 'Showing ' + shown + (shown === 1 ? ' image' : ' images');
  }
}

class Lightbox {
  constructor(dialog, grid) {
    this.dialog = dialog;
    this.grid = grid;
    this.image = dialog.querySelector('img');
    this.caption = dialog.querySelector('figcaption');
    this.list = [];
    this.index = 0;
    this.opener = null;
    this.init();
  }

  init() {
    this.grid.addEventListener('click', (event) => {
      const tile = event.target.closest('.tile');
      if (tile) this.open(tile);
    });
    this.dialog.querySelector('.lightbox__close').addEventListener('click', () => this.dialog.close());
    this.dialog.querySelector('.lightbox__prev').addEventListener('click', () => this.step(-1));
    this.dialog.querySelector('.lightbox__next').addEventListener('click', () => this.step(1));
    this.dialog.addEventListener('click', (event) => { if (event.target === this.dialog) this.dialog.close(); });
    this.dialog.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') this.step(-1);
      if (event.key === 'ArrowRight') this.step(1);
    });
    this.dialog.addEventListener('close', () => { if (this.opener) this.opener.focus(); });
  }

  open(tile) {
    this.list = [...this.grid.querySelectorAll('.tile:not([hidden])')];
    this.index = this.list.indexOf(tile);
    this.opener = tile;
    this.render();
    this.dialog.showModal();
  }

  step(direction) {
    this.index = (this.index + direction + this.list.length) % this.list.length;
    this.render();
  }

  render() {
    const tile = this.list[this.index];
    const picture = tile.querySelector('img');
    this.image.src = picture.currentSrc || picture.src;
    this.image.alt = picture.alt;
    this.caption.textContent = tile.querySelector('.tile__caption').textContent;
  }
}

const grid = document.getElementById('galleryGrid');
if (grid) {
  const tiles = [...grid.querySelectorAll('.tile')];
  new CollectionFilter([...document.querySelectorAll('.filter')], tiles, document.querySelector('.filters__count'));
  const dialog = document.querySelector('.lightbox');
  if (dialog && dialog.showModal) new Lightbox(dialog, grid);
  else grid.addEventListener('click', (event) => {
    const tile = event.target.closest('.tile');
    if (tile) window.open(tile.querySelector('img').src, '_blank', 'noopener');
  });
}
