/* ==========================================================================
   Fjora — marketing site behavior
   ========================================================================== */

/* --------------------------------------------------------------------------
   LAUNCH LINKS — fill these in when each one is ready. While a value is
   empty, its buttons show a "coming soon" toast and nudge to the waitlist;
   once filled, the "Soon" badge disappears and the button links straight out.
   -------------------------------------------------------------------------- */
const LINKS = {
  ios: '',          // e.g. https://apps.apple.com/app/fjora/id0000000000
  android: '',      // e.g. https://play.google.com/store/apps/details?id=com.fjora.app
  signin: '',       // e.g. https://app.fjoraapp.com/login
};
const CONTACT_EMAIL = 'hello@fjoraapp.com';

/* --------------------------------------------------------------------------
   WAITLIST — posts into the `waitlist` table in the Supabase project behind
   wayfare-api. RLS limits the anon role to INSERT only, so this page can add
   an email but can't read, edit, or delete the list.
   -------------------------------------------------------------------------- */
const SUPABASE_URL = 'https://vzvckpiaxyqxzsptxmfo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6dmNrcGlheHlxeHpzcHR4bWZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0MTE3MTYsImV4cCI6MjEwMTk4NzcxNn0.Gtw7CQ70aUeOyKInPNJXx0-F-OPgkNNCnJQa8CO6uTs';

const IMG = n => `assets/img/${n}.jpg`;
const PPL = n => `assets/people/${n}.jpg`;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- toast + links ---------- */
let toastTimer;
function toast(msg) {
  $('#toastMsg').textContent = msg;
  $('#toast').classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $('#toast').classList.remove('show'), 3600);
}

const SOON_MSG = {
  ios: 'Fjora hits the App Store soon. Join the waitlist and we\'ll email you on launch day.',
  android: 'Fjora hits Google Play soon. Join the waitlist and we\'ll email you on launch day.',
  signin: 'Sign-in opens at launch. Join the waitlist to get in first.',
};
const MAILTO = {
  'partner-hostel': `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Founding partner property')}`,
  'partner-creator': `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Creator partnership')}`,
  contact: `mailto:${CONTACT_EMAIL}`,
};

$$('[data-link]').forEach(a => {
  const key = a.dataset.link;
  if (MAILTO[key]) { a.href = MAILTO[key]; return; }
  if (LINKS[key]) {
    a.href = LINKS[key];
    a.target = '_blank';
    a.rel = 'noopener';
    a.classList.add('is-live');
    return;
  }
  a.addEventListener('click', e => {
    e.preventDefault();
    toast(SOON_MSG[key] ?? 'Coming soon.');
    const input = $('#top [data-waitlist] input');
    if (input && window.scrollY < 400) input.focus();
  });
});

/* ---------- nav ---------- */
const nav = $('#nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
addEventListener('scroll', onScroll, { passive: true });
onScroll();
$('#menuBtn').addEventListener('click', () => $('#navLinks').classList.toggle('open'));
$$('#navLinks a').forEach(a => a.addEventListener('click', () => $('#navLinks').classList.remove('open')));

/* ---------- reveal + counters ---------- */
function countUp(el) {
  const target = +el.dataset.count;
  if (reduceMotion) { el.textContent = target; return; }
  const start = performance.now(), dur = 1400;
  const step = t => {
    const p = Math.min(1, (t - start) / dur);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    $$('[data-count]', e.target).forEach(countUp);
    io.unobserve(e.target);
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
$$('.rv').forEach(el => io.observe(el));

/* ---------- people (sample accounts) ---------- */
const P = {
  maya: { name: 'Maya Chen', img: PPL('maya') },
  lucas: { name: 'Lucas Ferreira', img: PPL('lucas') },
  priya: { name: 'Priya Raman', img: PPL('priya') },
  jonas: { name: 'Jonas Becker', img: PPL('jonas') },
  sofia: { name: 'Sofía Vargas', img: PPL('sofia') },
  theo: { name: 'Theo Okafor', img: PPL('theo') },
  amara: { name: 'Amara Diallo', img: PPL('amara') },
  diego: { name: 'Diego Morales', img: PPL('diego') },
  hana: { name: 'Hana Kobayashi', img: PPL('hana') },
  sam: { name: 'Sam Whitaker', img: PPL('sam') },
  ellie: { name: 'Ellie Brooks', img: PPL('ellie') },
  marco: { name: 'Marco Rossi', img: PPL('marco') },
};

/* ---------- marquee ---------- */
const PLACES = [
  ['arenal', 'Arenal Volcano', 'Costa Rica'], ['kyoto', 'Kyoto', 'Japan'], ['lisbon', 'Lisbon', 'Portugal'],
  ['istanbul', 'Istanbul', 'Türkiye'], ['santorini', 'Santorini', 'Greece'], ['cinque', 'Cinque Terre', 'Italy'],
  ['bali', 'Bali', 'Indonesia'], ['machu', 'Machu Picchu', 'Peru'], ['tokyo', 'Tokyo', 'Japan'],
  ['iceland', 'Skógafoss', 'Iceland'], ['halong', 'Hạ Long Bay', 'Vietnam'], ['venice', 'Venice', 'Italy'],
  ['waterfall', 'La Fortuna Falls', 'Costa Rica'], ['paris', 'Paris', 'France'],
];
const card = ([img, name, country]) =>
  `<div class="m-card"><img src="${IMG(img)}" alt="" loading="lazy"><div class="stamp-mini">${name}<small>${country}</small></div></div>`;
$('#marquee').innerHTML = PLACES.map(card).join('') + PLACES.map(card).join('');

/* ---------- explore grid ---------- */
const SPOTS = [
  { img: 'waterfall', cls: 'tall', who: 'lucas', place: 'La Fortuna Waterfall', loc: 'Alajuela, Costa Rica', likes: 48 },
  { img: 'lisbon', cls: 'wide', who: 'sofia', place: 'Ribeira at golden hour', loc: 'Lisbon, Portugal', likes: 73 },
  { img: 'bar', cls: '', who: 'jonas', place: 'Friday night, downtown', loc: 'La Fortuna, Costa Rica', likes: 21 },
  { img: 'kyoto', cls: 'tall', who: 'priya', place: 'Hōkan-ji Pagoda at dawn', loc: 'Kyoto, Japan', likes: 112 },
  { img: 'halong', cls: '', who: 'theo', place: 'Hạ Long Bay by kayak', loc: 'Quảng Ninh, Vietnam', likes: 64 },
  { img: 'surf', cls: 'wide', who: 'diego', place: 'Dawn patrol, Playa Carmen', loc: 'Santa Teresa, Costa Rica', likes: 89 },
  { img: 'food', cls: '', who: 'amara', place: 'Best meal of the trip', loc: 'Oaxaca, Mexico', likes: 37 },
];
$('#exploreGrid').innerHTML = SPOTS.map((s, i) => `
  <div class="ex ${s.cls} rv ${i % 3 ? 'd' + (i % 3) : ''}">
    <img class="ph" src="${IMG(s.img)}" alt="${s.place}" loading="lazy">
    <span class="by"><img src="${P[s.who].img}" alt="">${P[s.who].name.split(' ')[0]}</span>
    <span class="like"><i class="ph-fill ph-heart"></i>${s.likes}</span>
    <div class="meta"><b>${s.place}</b><small><i class="ph-fill ph-map-pin"></i>${s.loc}</small></div>
  </div>`).join('');
$('#exploreGrid').style.gridAutoFlow = 'dense';
$$('#exploreGrid .rv').forEach(el => io.observe(el));

/* ---------- toolkit micro-interactions ---------- */
$('#voice').innerHTML = Array.from({ length: 34 }, (_, i) =>
  `<span style="animation-delay:${(-(i * 137) % 1100) / 1000}s;animation-duration:${0.8 + ((i * 53) % 7) / 10}s"></span>`).join('');
setInterval(() => $('#shareToggle').classList.toggle('on'), 2200);

/* ==========================================================================
   In-phone app UI (mirrors the RN screens' Parchment Day styling)
   ========================================================================== */
const sbar = (time = '9:41') =>
  `<div class="island"></div><div class="sbar"><span>${time}</span><span class="r"><i class="ph-fill ph-cell-signal-full"></i><i class="ph-fill ph-wifi-high"></i><i class="ph-fill ph-battery-full"></i></span></div>`;
const TABS = [['World', 'globe-hemisphere-west'], ['Gather', 'users-three'], ['Activities', 'ticket'], ['Explore', 'compass-rose'], ['Chat', 'chats-circle']];
const tabbar = active =>
  `<div class="tabbar">${TABS.map(([l, ic]) => `<div class="${l === active ? 'on' : ''}"><i class="${l === active ? 'ph-fill' : 'ph'} ph-${ic}"></i>${l}</div>`).join('')}</div>`;
const navTitle = (t, back = false, right = '') =>
  `<div class="a-navtitle">${back ? '<i class="ph ph-caret-left" style="font-size:16px;color:var(--copper)"></i>' : ''}${t}${right ? `<span style="margin-left:auto">${right}</span>` : ''}</div>`;

const gatherCard = ({ who, when, type, head, spots, full, mine }) => `
  <div class="a-card">
    <div class="sig-head"><img class="a-av" src="${P[who].img}" alt=""><div><div class="who">${P[who].name}</div><div class="when"><i class="ph ph-calendar-dots"></i>${when}</div></div><span class="a-pill p-coral">${type}</span></div>
    <div class="sig-h">${head}</div>
    <span class="a-pill ${full ? 'p-coral' : 'p-teal'}">${full ? 'Full — backups welcome' : spots ? spots + ' spots left' : 'Open invite'}</span>${mine ? '<span style="font-size:9.5px;color:var(--copper);font-weight:600;margin-left:8px">Mark as full</span>' : ''}
    <div class="a-cta ${full ? 'outline' : ''}"><i class="ph-fill ph-chat-circle"></i>${full ? 'Join as backup' : 'Join the chat'}</div>
  </div>`;

const SAMPLE_GATHERS = [
  { who: 'priya', when: 'Tomorrow · 8:00 AM', type: 'Excursion', head: 'Canyoning with Pure Trek — 2 spots to split the group rate', spots: 2 },
  { who: 'jonas', when: 'Today · 6:30 PM', type: 'Drinks', head: 'Sunset beers at Lava Lounge, come say hi 🍻' },
  { who: 'sofia', when: 'Thu · 7:00 AM', type: 'Shuttle', head: 'Sharing a shuttle to Santa Teresa — van is booked', full: true },
];
const gatherFeed = (extraTop = '') => `${sbar()}<div class="scr"><div class="scr-body">
  ${navTitle('Gather')}
  <div class="a-search"><div><i class="ph ph-magnifying-glass"></i>La Fortuna, Costa Rica</div><div class="mi">25 mi <i class="ph ph-caret-down"></i></div></div>
  <div class="a-sec">Happening near La Fortuna</div>
  ${extraTop}${SAMPLE_GATHERS.map(gatherCard).join('')}
  </div><div class="fab"><i class="ph-fill ph-plus"></i></div>${tabbar('Gather')}</div>`;

const worldScreen = ({ newStamp = false, countries = 14 } = {}) => `${sbar()}<div class="scr"><div class="scr-body">
  <div class="a-head"><div><div class="a-eyebrow">Good morning, Maya</div><div class="a-title">Your World</div></div><img class="a-av" src="${P.maya.img}" alt="" style="width:34px;height:34px"></div>
  <div class="mapbox" data-minimap>${newStamp ? '<div class="newstamp" style="left:22%;top:44%">COSTA<br>RICA</div>' : ''}</div>
  <div class="stats-row"><div><b>${countries}</b><span>Countries</span></div><div><b>9</b><span>States</span></div><div><b>23</b><span>Companions</span></div><div><b>${newStamp ? 187 : 186}</b><span>Check-ins</span></div></div>
  <div class="countdown"><div class="num">12</div><div><small>Days until</small><b>Santa Teresa</b><span>Surf week + Nicoya coast</span></div><i class="ph ph-caret-right" style="margin-left:auto;color:var(--copper)"></i></div>
  <div class="a-sec">Destinations <small>Add</small></div>
  <div class="dest-row">
    <div class="dest"><img src="${IMG('arenal')}" alt=""><b>Costa Rica</b><span>2 journeys</span></div>
    <div class="dest"><img src="${IMG('kyoto')}" alt=""><b>Japan</b><span>3 journeys</span></div>
    <div class="dest"><img src="${IMG('lisbon')}" alt=""><b>Portugal</b><span>1 journey</span></div>
  </div>
  </div>${tabbar('World')}</div>`;

$('#heroScreen').innerHTML = worldScreen();
$('#gatherScreen').innerHTML = gatherFeed();

/* ==========================================================================
   World map (d3 + world-atlas). Visited set = sample account "Maya".
   ========================================================================== */
const VISITED = {
  188: ['Costa Rica', '2 journeys · 38 check-ins'], 392: ['Japan', '3 journeys · 52 check-ins'],
  620: ['Portugal', '1 journey · 17 check-ins'], 792: ['Türkiye', '2 journeys · 24 check-ins'],
  380: ['Italy', '1 journey · 11 check-ins'], 300: ['Greece', '1 journey · 9 check-ins'],
  250: ['France', '1 journey · 6 check-ins'], 360: ['Indonesia', '1 journey · 8 check-ins'],
  604: ['Peru', '1 journey · 7 check-ins'], 352: ['Iceland', '1 journey · 5 check-ins'],
  704: ['Vietnam', '1 journey · 4 check-ins'], 484: ['Mexico', '2 journeys · 3 check-ins'],
  724: ['Spain', '1 journey · 1 check-in'], 840: ['United States', 'Home · 9 states'],
};
const STAMPS = [
  ['COSTA RICA', -84, 10], ['JAPAN', 138, 37], ['PORTUGAL', -8.5, 39.5], ['TÜRKIYE', 33, 39.5],
  ['PERU', -75, -10], ['ICELAND', -19, 65], ['BALI', 115, -8.4], ['VIETNAM', 107, 15],
];

let worldTopo = null;
async function loadWorld() {
  if (worldTopo) return worldTopo;
  if (!window.d3 || !window.topojson) return null;
  try {
    const topo = await d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');
    worldTopo = topojson.feature(topo, topo.objects.countries).features.filter(f => f.id !== '010');
  } catch { worldTopo = null; }
  return worldTopo;
}

async function drawWorldMap() {
  const host = $('#worldmap');
  const feats = await loadWorld();
  if (!feats) return;
  const W = 1200, H = 600;
  const proj = d3.geoNaturalEarth1().fitExtent([[10, 20], [W - 10, H - 10]], { type: 'FeatureCollection', features: feats });
  const path = d3.geoPath(proj);
  const svg = d3.create('svg').attr('viewBox', `0 0 ${W} ${H}`).attr('role', 'img').attr('aria-label', 'Map of countries visited');
  svg.append('defs').html('<linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F0C07E"/><stop offset="1" stop-color="#C98A45"/></linearGradient>');
  svg.append('path').attr('class', 'graticule').attr('d', path(d3.geoGraticule10()));
  const tip = $('#mapTip');
  svg.append('g').selectAll('path').data(feats).join('path')
    .attr('class', 'country').attr('d', path)
    .on('mousemove', (e, d) => {
      const v = VISITED[+d.id];
      const r = host.getBoundingClientRect();
      tip.innerHTML = v ? `${v[0]}<small>${v[1]}</small>` : `${d.properties.name}<small>Not yet — add it to your bucket list</small>`;
      tip.style.left = e.clientX - r.left + 'px';
      tip.style.top = e.clientY - r.top + 'px';
      tip.style.opacity = 1;
    })
    .on('mouseleave', () => { tip.style.opacity = 0; });

  // upcoming trip arc: home → Santa Teresa
  const from = proj([-97.7, 30.3]), to = proj([-85.15, 9.65]);
  const mx = (from[0] + to[0]) / 2 - 40, my = (from[1] + to[1]) / 2 - 30;
  svg.append('path').attr('class', 'map-route').attr('d', `M${from} Q${mx},${my} ${to}`);
  svg.append('circle').attr('cx', to[0]).attr('cy', to[1]).attr('r', 3.5).attr('fill', 'var(--coral)');

  const sg = svg.append('g');
  STAMPS.forEach(([label, lon, lat], i) => {
    const [x, y] = proj([lon, lat]);
    const g = sg.append('g').attr('class', 'map-stamp').attr('transform', `translate(${x},${y - 34}) rotate(${(i % 2 ? 6 : -7)})`).style('opacity', 0);
    g.append('circle').attr('r', 24);
    const words = label.split(' ');
    words.forEach((w, j) => g.append('text').attr('y', (j - (words.length - 1) / 2) * 9 + 3).text(w));
    g.transition().delay(1400 + i * 160).duration(500).style('opacity', 1);
  });
  host.prepend(svg.node());

  // scratch-off reveal, one country at a time
  const visitedPaths = svg.selectAll('.country').filter(d => VISITED[+d.id]).nodes();
  visitedPaths.forEach((p, i) => setTimeout(() => p.classList.add('visited'), reduceMotion ? 0 : 200 + i * 110));
}

async function drawMiniMaps(root = document) {
  const boxes = $$('[data-minimap]', root).filter(b => !b.querySelector('svg'));
  if (!boxes.length) return;
  const feats = await loadWorld();
  if (!feats) return;
  boxes.forEach(box => {
    const W = 272, H = 150;
    const proj = d3.geoEquirectangular().center([-20, 22]).scale(62).translate([W / 2, H / 2]);
    const path = d3.geoPath(proj);
    const svg = d3.create('svg').attr('viewBox', `0 0 ${W} ${H}`).attr('preserveAspectRatio', 'xMidYMid slice');
    svg.append('rect').attr('class', 'ocean').attr('width', W).attr('height', H);
    svg.append('g').selectAll('path').data(feats).join('path')
      .attr('class', d => 'country' + (VISITED[+d.id] ? ' visited' : '')).attr('d', path);
    box.prepend(svg.node());
  });
}

const mapIO = new IntersectionObserver(es => {
  if (es.some(e => e.isIntersecting)) { drawWorldMap(); mapIO.disconnect(); }
}, { threshold: 0.2 });
mapIO.observe($('#worldmap'));
window.addEventListener('load', () => drawMiniMaps());

/* ==========================================================================
   Demo player — short animated walkthroughs ("videos") of core flows
   ========================================================================== */
const tap = (x, y) => `<div class="tap" style="left:${x}px;top:${y}px"></div>`;
const typed = (text, cls = '') => `<span class="${cls}" data-type="${text.replace(/"/g, '&quot;')}"></span><span class="caret"></span>`;

const DEMOS = [
  {
    key: 'gather', label: 'Start a Gather', icon: 'users-three',
    steps: [
      { t: 'Tap + on the Gather tab', d: 'See what\'s happening nearby, or start your own plan.',
        s: () => gatherFeed() + tap(239, 511) },
      { t: 'Say what, where and when', d: 'Pick a type, write a headline, choose a real place. Never your live location.',
        s: () => `${sbar()}<div class="scr"><div class="scr-body" style="bottom:0">
          ${navTitle('New Gather', false, '<span style="font-family:var(--sans);font-size:11px;color:var(--ink-dim)">Cancel</span>')}
          <div class="a-field"><label>Type</label><div class="chips"><span class="chip">Drinks</span><span class="chip on">Excursion</span><span class="chip">Food</span><span class="chip">Shuttle</span><span class="chip">Surf</span></div></div>
          <div class="a-field"><label>Headline</label><div class="a-input focus">${typed('Canyoning tomorrow 8am — split the group rate?')}</div></div>
          <div class="a-field"><label>Where</label><div class="a-input"><i class="ph ph-map-pin" style="color:var(--copper)"></i>Pure Trek Canyoning</div>
            <div class="suggest"><div><i class="ph-fill ph-map-pin"></i><span><b>Pure Trek Canyoning</b> · La Fortuna, Alajuela</span></div><div><i class="ph ph-map-pin"></i>Pure Trek Office · Calle 2</div></div></div>
          <div style="display:flex;gap:8px"><div class="a-field" style="flex:1"><label>When</label><div class="a-input">Tomorrow · 8:00 AM</div></div><div class="a-field" style="width:84px"><label>Spots</label><div class="a-input" style="justify-content:space-between"><span style="color:var(--copper)">−</span>3<span style="color:var(--copper)">+</span></div></div></div>
          <div class="priv-note"><i class="ph-duotone ph-shield-check"></i>Gathers never use your GPS. People only see the place you picked.</div>
          <div class="a-cta" style="margin-top:12px">Post Gather</div>
          </div></div>` },
      { t: 'It\'s live for travelers nearby', d: 'Your Gather shows up for everyone searching the area, with spots counting down as people join.',
        s: () => gatherFeed(gatherCard({ who: 'maya', when: 'Tomorrow · 8:00 AM', type: 'Excursion', head: 'Canyoning tomorrow 8am — split the group rate?', spots: 1, mine: true }))
          + '<div class="a-toast"><i class="ph-fill ph-users-three"></i><span><b>Priya &amp; Lucas joined</b> · 1 spot left</span></div>' },
      { t: 'Chat, meet up, become Companions', d: 'Everyone who joins lands in a real-time group chat. After you meet, add each other as Companions.',
        s: () => `${sbar()}<div class="scr"><div class="scr-body">
          ${navTitle('Canyoning crew 🧗', true)}
          <div class="chat">
            <div class="msg-row"><img src="${P.priya.img}" alt=""><div class="msg them" style="animation-delay:.2s"><small>Priya</small>I'm in! Done the waterfall rappel before, it's unreal</div></div>
            <div class="msg-row"><img src="${P.lucas.img}" alt=""><div class="msg them" style="animation-delay:1s"><small>Lucas</small>Same. Meet at the Pure Trek desk 7:40?</div></div>
            <div class="msg me" style="animation-delay:1.9s">Perfect. I'll book for 3 tonight 🙌</div>
            <div class="msg-row"><img src="${P.priya.img}" alt=""><div class="msg them" style="animation-delay:2.8s"><small>Priya</small>Hot springs after? 😄</div></div>
          </div></div>
          <div class="chat-input">Message…<span><i class="ph-fill ph-paper-plane-right"></i></span></div>${tabbar('Chat')}</div>` },
    ],
  },
  {
    key: 'checkin', label: 'Check in', icon: 'map-pin',
    steps: [
      { t: 'Check in wherever you are', d: 'Search the place, pick a category and add a note. No signal? It saves and syncs later.',
        s: () => `${sbar()}<div class="scr"><div class="scr-body" style="bottom:0">
          ${navTitle('Check In', false, '<span style="font-family:var(--sans);font-size:11px;color:var(--copper);font-weight:600">Save</span>')}
          <div class="a-field"><label>Place</label><div class="a-input focus"><i class="ph ph-map-pin" style="color:var(--copper)"></i>${typed('La Fortuna Waterfall')}</div></div>
          <div class="a-field"><label>Category</label><div class="chips"><span class="chip on">Landmark</span><span class="chip">Restaurant</span><span class="chip">Bar</span><span class="chip">Activity</span><span class="chip">Stay</span></div></div>
          <div class="a-field"><label>Rating</label><div class="stars"><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i></div></div>
          <div class="a-field"><label>Note</label><div class="a-input" style="min-height:52px;align-items:flex-start">500 steps down, worth every one. Swim in the side pool, not under the falls.</div></div>
          </div></div>` },
      { t: 'Add photos and ratings', d: 'Shoot or pick photos. Food and drink ratings appear automatically for restaurants, bars and cafés.',
        s: () => `${sbar()}<div class="scr"><div class="scr-body" style="bottom:0">
          ${navTitle('Check In', false, '<span style="font-family:var(--sans);font-size:11px;color:var(--copper);font-weight:600">Save</span>')}
          <div class="a-field"><label>Place</label><div class="a-input"><i class="ph ph-map-pin" style="color:var(--copper)"></i>Soda in downtown La Fortuna</div></div>
          <div class="a-field"><label>Category</label><div class="chips"><span class="chip">Landmark</span><span class="chip on">Restaurant</span><span class="chip">Bar</span><span class="chip">Activity</span></div></div>
          <div class="a-field"><label>Overall</label><div class="stars"><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star off"></i></div></div>
          <div class="a-field" style="animation:pop .5s both .3s"><label>Food &amp; drink</label><div class="stars"><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i></div></div>
          <div class="a-field"><label>Photos</label><div class="thumbs"><img src="${IMG('food')}" alt="" style="animation-delay:.6s"><img src="${IMG('dinner')}" alt="" style="animation-delay:1s"><img src="${IMG('cocktail')}" alt="" style="animation-delay:1.4s"><div class="add"><i class="ph ph-camera-plus"></i></div></div></div>
          <div class="a-cta">Save check-in</div>
          </div></div>` },
      { t: 'Your journey builds itself', d: 'Every check-in lands in the trip, with a photo grid you can swipe through full-screen.',
        s: () => `${sbar()}<div class="scr"><div class="scr-body">
          ${navTitle('Arenal &amp; La Fortuna', true)}
          <div style="display:flex;gap:6px;margin-bottom:10px"><span class="a-pill p-gold">Costa Rica</span><span class="a-pill p-teal">21 check-ins</span><span class="a-pill p-coral">3 companions</span></div>
          <div class="pgrid">${['waterfall', 'arenal', 'rafting', 'jungle', 'food', 'dinner', 'hikers', 'bar2', 'hostel'].map((p, i) => `<img src="${IMG(p)}" alt="" style="animation:pop .4s both ${i * 0.08}s">`).join('')}</div>
          <div class="a-card" style="margin-top:10px;display:flex;gap:10px;align-items:center"><i class="ph-duotone ph-map-pin" style="font-size:20px;color:var(--copper)"></i><div><b style="font-size:11.5px">La Fortuna Waterfall</b><div style="font-size:9.5px;color:var(--ink-dim)">Landmark · ★★★★★ · 2 photos</div></div></div>
          </div>${tabbar('World')}</div>` },
      { t: 'Stamp your map', d: 'A new country gets a passport stamp on your scratch map, and your stats tick up.',
        s: () => worldScreen({ newStamp: true }) },
    ],
  },
  {
    key: 'plan', label: 'Plan with AI', icon: 'sparkle',
    steps: [
      { t: 'Tell it the basics', d: 'Destination, days, pace and what you\'re into. That\'s it.',
        s: () => `${sbar()}<div class="scr"><div class="scr-body" style="bottom:0">
          ${navTitle('Generate with AI')}
          <div class="a-field"><label>Destination</label><div class="a-input focus">${typed('Lisbon, Portugal')}</div></div>
          <div class="a-field"><label>How many days?</label><div class="stepper"><span>−</span><b>4 days</b><span>+</span></div></div>
          <div class="a-field"><label>Start date</label><div class="a-input">Fri, Nov 13</div></div>
          <div class="a-field"><label>Pace</label><div class="chips"><span class="chip">Relaxed</span><span class="chip on">Balanced</span><span class="chip">Packed</span></div></div>
          <div class="a-field"><label>Interests</label><div class="a-input" style="min-height:46px;align-items:flex-start">Street food, viewpoints, live music, one day trip</div></div>
          <div class="a-cta"><i class="ph-fill ph-sparkle"></i>Draft my itinerary</div>
          </div></div>` },
      { t: 'Get a day-by-day draft', d: 'Clearly marked as an AI draft. Edit or remove any day before anything is saved.',
        s: () => `${sbar()}<div class="scr ai-scr"><div class="scr-body" style="bottom:0">
          ${navTitle('Generate with AI')}
          <span class="a-pill p-gold" style="margin-bottom:9px"><i class="ph-fill ph-sparkle"></i>AI draft — review and edit before adding</span>
          ${[['Day 1 · Fri', 'Alfama on foot, Miradouro da Graça for sunset, fado dinner', 'Book fado ahead on weekends'],
             ['Day 2 · Sat', 'Tram 28 early, LX Factory, Time Out Market', ''],
             ['Day 3 · Sun', 'Belém: Jerónimos, pastéis de nata, riverside walk', 'Go before 10am to skip the line'],
             ['Day 4 · Mon', 'Day trip to Sintra: Pena Palace & Regaleira', 'Train from Rossio, 40 min']]
            .map(([l, w, n], i) => `<div class="a-card" style="animation:pop .5s both ${0.3 + i * 0.5}s"><div style="display:flex;justify-content:space-between"><span class="dlab">${l}</span><span style="font-size:9px;color:var(--rust);font-weight:600">Remove</span></div><div class="dtxt">${w}</div>${n ? `<div class="dnote">${n}</div>` : ''}</div>`).join('')}
          <div class="a-cta">Add 4 days to itinerary</div>
          </div></div>` },
      { t: 'Budget it in any currency', d: 'Log expenses in euros. Fjora converts back to your home currency and tracks it against your budget.',
        s: () => `${sbar()}<div class="scr"><div class="scr-body">
          ${navTitle('Budget', true)}
          <div class="a-card" style="display:flex;gap:14px;align-items:center"><div class="ring" style="--p:58;width:70px;height:70px"><span style="font-size:15px">58%</span></div><div><div style="font-size:9.5px;color:var(--ink-dim)">Spent of $1,800</div><div style="font-family:var(--serif);font-size:22px">$1,044</div><div style="font-size:9.5px;color:var(--teal);font-weight:600">$756 left · on track</div></div></div>
          ${[['ph-bed', 'Casa do Príncipe · 4 nights', '€412', '$447'], ['ph-train', 'Sintra train, return', '€9.30', '$10'], ['ph-fork-knife', 'Fado dinner, Alfama', '€68', '$74'], ['ph-ticket', 'Pena Palace tickets', '€20', '$22'], ['ph-coffee', 'Pastéis de Belém ×6', '€8.40', '$9']]
            .map(([ic, n, a, c], i) => `<div class="prow" style="animation:pop .4s both ${i * 0.15}s"><i class="ph-duotone ${ic}" style="font-size:16px;color:var(--teal)"></i><span style="flex:1">${n}</span><span style="text-align:right"><b>${a}</b><br><span style="font-size:9px;color:var(--ink-dim)">${c}</span></span></div>`).join('')}
          </div>${tabbar('World')}</div>` },
      { t: 'Pack from last time', d: 'Copy your packing list from a past trip in one tap, then check things off.',
        s: () => `${sbar()}<div class="scr"><div class="scr-body">
          ${navTitle('Packing · Lisbon', true, '<span style="font-family:var(--sans);font-size:10px;color:var(--copper);font-weight:600">Copy list</span>')}
          <div class="a-toast" style="position:static;margin-bottom:10px;animation-delay:.1s"><i class="ph-fill ph-copy"></i><span>Copied 9 items from <b>Kyoto in cherry season</b></span></div>
          ${['Passport', 'Comfortable walking shoes', 'Light rain jacket', 'Universal adapter (Type F)', 'Day pack', 'Sunglasses', 'Portable charger', 'Swimsuit', 'Earplugs for the hostel']
            .map((x, i) => `<div class="prow" data-tick="${i < 6 ? i : ''}"><span class="cb"></span><span>${x}</span></div>`).join('')}
          </div>${tabbar('World')}</div>` },
    ],
  },
  {
    key: 'safe', label: 'Stay safe', icon: 'shield-check',
    steps: [
      { t: 'Add a Trusted Contact once', d: 'Anyone with a phone number. They don\'t need the app.',
        s: () => `${sbar()}<div class="scr"><div class="scr-body">
          ${navTitle('Trusted Contacts', true)}
          <div class="priv-note" style="margin-bottom:12px"><i class="ph-duotone ph-shield-check"></i>When you join a Gather, we'll text your contact where you're going and when.</div>
          <div class="a-card contact"><span class="ini">L</span><div><b>Linda Chen (Mom)</b><span>+1 (512) •••-••14</span></div><i class="ph-fill ph-check-circle" style="margin-left:auto;color:var(--teal);font-size:18px"></i></div>
          <div class="a-field" style="margin-top:14px"><label>Add another</label><div class="a-input focus">${typed('Jess (sister)')}</div></div>
          <div class="a-input" style="margin-bottom:10px"><span class="hint">Phone number</span></div>
          <div class="a-cta outline"><i class="ph ph-plus"></i>Add contact</div>
          </div>${tabbar('World')}</div>` },
      { t: 'Join a Gather, they get a text', d: 'Place and time go straight to your contact\'s phone, with no app needed.',
        s: () => `<div class="island"></div><div class="sbar" style="color:#111"><span>6:12</span><span class="r"><i class="ph-fill ph-cell-signal-full"></i><i class="ph-fill ph-battery-full"></i></span></div>
          <div class="ios-msg"><div class="who"><div class="ini">F</div>Fjora Safety</div>
          <div class="ts">Today 6:12 PM</div>
          <div class="bub" style="animation-delay:.5s">Maya is meeting a Fjora group at <b>Lava Lounge, La Fortuna</b> at <b>7:00 PM</b> tonight. We'll check in with her after.</div></div>` },
      { t: '"Did you make it back safe?"', d: 'After the meetup, Fjora asks. One tap and you\'re done.',
        s: () => `${sbar('11:24')}<div class="scr"><div class="scr-body">
          <div class="a-head"><div><div class="a-eyebrow">Good evening, Maya</div><div class="a-title">Your World</div></div><img class="a-av" src="${P.maya.img}" alt="" style="width:34px;height:34px"></div>
          <div class="a-card" style="background:rgba(63,117,100,.08);border-color:rgba(63,117,100,.3);animation:pop .5s both .3s">
            <div style="display:flex;gap:8px;align-items:center"><i class="ph-duotone ph-house-line" style="font-size:22px;color:var(--teal)"></i><div><b style="font-size:12.5px">Did you make it back safe?</b><div style="font-size:9.5px;color:var(--ink-dim)">Sunset beers · Lava Lounge</div></div></div>
            <div style="display:flex;gap:6px;margin-top:10px"><div class="a-cta" style="flex:1;margin:0;background:var(--teal)">I'm back</div><div class="a-cta outline" style="flex:1;margin:0">Not yet</div></div>
          </div>
          <div class="mapbox" data-minimap></div>
          <div class="stats-row"><div><b>14</b><span>Countries</span></div><div><b>9</b><span>States</span></div><div><b>24</b><span>Companions</span></div><div><b>188</b><span>Check-ins</span></div></div>
          </div>${tap(98, 178)}${tabbar('World')}</div>` },
      { t: 'And if you don\'t answer…', d: 'Your contact is texted automatically once the grace period passes. The safety net works even if your phone dies.',
        s: () => `<div class="island"></div><div class="sbar" style="color:#111"><span>1:05</span><span class="r"><i class="ph-fill ph-cell-signal-full"></i><i class="ph-fill ph-battery-full"></i></span></div>
          <div class="ios-msg"><div class="who"><div class="ini">F</div>Fjora Safety</div>
          <div class="ts">Today 6:12 PM</div>
          <div class="bub" style="animation:none">Maya is meeting a Fjora group at <b>Lava Lounge, La Fortuna</b> at <b>7:00 PM</b> tonight. We'll check in with her after.</div>
          <div class="ts">Today 1:05 AM</div>
          <div class="bub" style="animation-delay:.5s">Maya hasn't confirmed she's back from her 7:00 PM meetup at Lava Lounge, La Fortuna. You may want to reach out to her.</div></div>` },
    ],
  },
];

const STEP_MS = 4600;
const demo = { d: 0, s: 0, playing: !reduceMotion, visible: false, t0: 0, elapsed: 0 };

$('#demoTabs').innerHTML = DEMOS.map((d, i) =>
  `<button class="demo-tab" data-i="${i}"><i class="ph-duotone ph-${d.icon}"></i>${d.label}</button>`).join('');
$$('.demo-tab').forEach(b => b.addEventListener('click', () => goDemo(+b.dataset.i, 0)));

function typeIn(root) {
  $$('[data-type]', root).forEach(el => {
    const text = el.dataset.type;
    if (reduceMotion) { el.textContent = text; return; }
    let i = 0;
    const iv = setInterval(() => {
      el.textContent = text.slice(0, ++i);
      if (i >= text.length || !el.isConnected) clearInterval(iv);
    }, Math.max(22, 1100 / text.length));
  });
  $$('[data-tick]', root).forEach(el => {
    if (el.dataset.tick === '') return;
    setTimeout(() => el.classList.add('done'), 700 + +el.dataset.tick * 380);
  });
}

function renderDemo() {
  const D = DEMOS[demo.d];
  $$('.demo-tab').forEach((b, i) => b.classList.toggle('active', i === demo.d));
  $('#demoSteps').innerHTML = D.steps.map((st, i) =>
    `<div class="d-step ${i === demo.s ? 'active' : ''}" data-i="${i}"><span class="n">${i + 1}</span><div><b>${st.t}</b><p>${st.d}</p></div><span class="bar"><i></i></span></div>`).join('');
  $$('.d-step').forEach(el => el.addEventListener('click', () => goDemo(demo.d, +el.dataset.i)));
  const scr = $('#demoScreen');
  scr.innerHTML = D.steps[demo.s].s();
  typeIn(scr);
  drawMiniMaps(scr);
}

function goDemo(d, s) {
  demo.d = d; demo.s = s; demo.elapsed = 0; demo.t0 = performance.now();
  renderDemo();
}

function tick(now) {
  if (demo.playing && demo.visible) {
    demo.elapsed += now - demo.t0;
    const bar = $('.d-step.active .bar i');
    if (bar) bar.style.width = Math.min(100, demo.elapsed / STEP_MS * 100) + '%';
    if (demo.elapsed >= STEP_MS) {
      const D = DEMOS[demo.d];
      if (demo.s < D.steps.length - 1) goDemo(demo.d, demo.s + 1);
      else goDemo((demo.d + 1) % DEMOS.length, 0);
    }
  }
  demo.t0 = now;
  requestAnimationFrame(tick);
}

function setPlaying(p) {
  demo.playing = p;
  $('#demoPlay').innerHTML = `<i class="ph-fill ph-${p ? 'pause' : 'play'}"></i>`;
  $('#demoPlay').setAttribute('aria-label', p ? 'Pause' : 'Play');
  $('#demoLabel').textContent = p ? 'Autoplay on' : 'Paused · tap a step to jump';
}
$('#demoPlay').addEventListener('click', () => setPlaying(!demo.playing));
new IntersectionObserver(es => es.forEach(e => { demo.visible = e.isIntersecting; }), { threshold: 0.3 }).observe($('#demo .demo'));
setPlaying(demo.playing);
goDemo(0, 0);
requestAnimationFrame(tick);

/* ==========================================================================
   Waitlist
   ========================================================================== */
async function submitEmail(email, msgEl) {
  const set = (t, err) => { msgEl.textContent = t; msgEl.style.color = err ? 'var(--coral)' : ''; };
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return set('Please enter a valid email.', true);
  set('Joining…');
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/waitlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ email }),
    });
    if (res.ok) return set('You\'re on the list. See you on launch day ✈︎');
    if (res.status === 409) return set('You\'re already on the list!');
    throw new Error('Request failed');
  } catch {
    set('Something went wrong. Please try again.', true);
  }
}
$$('[data-waitlist]').forEach(form => form.addEventListener('submit', e => {
  e.preventDefault();
  const input = $('input', form);
  submitEmail(input.value.trim(), form.nextElementSibling);
}));
