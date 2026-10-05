// drag any .movable around the page; the grabbed one goes on top.
// Offsets are % of the element's own size, so they scale with the page
let layer = 0;

for (const item of document.querySelectorAll('.movable')) {
  let x = 0, y = 0;

  item.addEventListener('pointerdown', down => {
    item.setPointerCapture(down.pointerId);
    item.style.zIndex = ++layer;
    const w = item.offsetWidth / 100;
    const h = item.offsetHeight / 100;
    const startX = down.clientX - x * w;
    const startY = down.clientY - y * h;

    const move = e => {
      x = (e.clientX - startX) / w;
      y = (e.clientY - startY) / h;
      item.style.translate = `${x}% ${y}%`;
    };
    const up = () => {
      item.removeEventListener('pointermove', move);
      item.removeEventListener('pointerup', up);
      item.removeEventListener('pointercancel', up);
    };

    item.addEventListener('pointermove', move);
    item.addEventListener('pointerup', up);
    item.addEventListener('pointercancel', up);
  });
}
