// "Menu" opens a list of all works over the page; a click anywhere outside
// it (or Esc) closes it. Without JS the link just leads to the homepage
const works = [
  ['everythings-new.html', 'Everything&rsquo;s new, and some things aren&rsquo;t, film, 2026'],
  ['ghosts.html', 'Ghosts, mixed media, 2021-2022'],
  ['loy-qollar.html', 'Loy qo&rsquo;llar (with dirty hands) / Where Do the Plants Sleep?, film, installation, 2025'],
  ['jolda.html', 'Jolda, experimental film, 2024'],
  ['in-the-circle.html', 'In the Circle of My Heart, installation, 2024'],
  ['sometimes-i-fall-apart.html', 'Sometimes I fall apart, experimental film, 2024'],
  ['tashkent.html', 'Tashkent &lt;3 you, zine, 2021'],
  ['blind-zone.html', 'Blind zone, mixed media, 2022'],
  ['women-of-our-mahalla.html', 'Women of Our Mahalla, documentary photography project, 2021'],
];

const toggle = document.querySelector('.work__menu');
const menu = document.createElement('nav');
menu.className = 'menu';
menu.id = 'menu';
menu.hidden = true;
menu.innerHTML = `
  <p class="menu__label">Menu:</p>
  <ul>${works.map(([href, title]) => `<li><a href="${href}">${title}</a></li>`).join('')}</ul>
  <p><a class="menu__home" href="index.html">&mdash;&gt; main page</a></p>
`;
toggle.after(menu);
toggle.setAttribute('aria-controls', 'menu');
toggle.setAttribute('aria-expanded', 'false');

const setOpen = open => {
  menu.hidden = !open;
  toggle.setAttribute('aria-expanded', open);
};

document.addEventListener('click', e => {
  // modified clicks keep the link's own behaviour (e.g. new tab)
  const plain = e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;

  if (plain && toggle.contains(e.target)) {
    e.preventDefault();
    setOpen(menu.hidden);
  } else if (!menu.contains(e.target)) {
    setOpen(false);
  }
});

// Back restores the page from the cache as it was left, panel included
window.addEventListener('pageshow', e => {
  if (e.persisted) setOpen(false);
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') setOpen(false);
});
