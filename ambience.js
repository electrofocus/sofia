// background ambience: browsers block audible autoplay until the visitor
// interacts with the page, so if it's refused, start on the first interaction
const ambience = document.querySelector('.ambience');
const events = ['pointerdown', 'keydown', 'touchstart'];

function start() {
  ambience.play().then(() => {
    for (const e of events) removeEventListener(e, start, true);
  }, () => {});
}

for (const e of events) addEventListener(e, start, true);
start();
