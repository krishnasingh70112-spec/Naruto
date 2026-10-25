/* EMBERBORN — The Path of the Warden
   Scroll-driven cinematic story. GSAP + ScrollTrigger timelines, canvas particles,
   canvas lightning, a lazily loaded Three.js vortex, and generated SVG art. */
(() => {
'use strict';

if (!window.gsap || !window.ScrollTrigger) { document.documentElement.classList.add('no-gsap'); return; }

/* ================= utilities ================= */
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const seg = (p, a, b) => clamp((p - a) / (b - a));
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarse = matchMedia('(pointer: coarse)').matches;
const lowPower = reduce || (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4 || innerWidth < 700;
const rnd = seed => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };

gsap.registerPlugin(ScrollTrigger);
if (window.ScrollToPlugin) gsap.registerPlugin(ScrollToPlugin);
ScrollTrigger.config({ ignoreMobileResize: true });
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
scrollTo(0, 0);

/* ================= generated art ================= */
function skyline(svg, o) {
  const { base = 700, color = '#0a0e1b', win = '#ffb347', seed = 1, minW = 50, maxW = 130, minH = 40, maxH = 160, density = .35, width = 1600, height = 900 } = o;
  const r = rnd(seed); let x = -20, out = '';
  while (x < width + 20) {
    const w = minW + r() * (maxW - minW), h = minH + r() * (maxH - minH), t = r(), y = base - h;
    out += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${(height - y).toFixed(1)}" fill="${color}"/>`;
    if (t < .5) out += `<polygon points="${x - 8},${y} ${x + w / 2},${y - w * .35} ${x + w + 8},${y}" fill="${color}"/>`;
    else {
      out += `<path d="M${x - 12} ${y} Q${x + w / 2} ${y - 26} ${x + w + 12} ${y} L${x + w} ${y + 8} L${x} ${y + 8}Z" fill="${color}"/>`;
      out += `<rect x="${x + w * .2}" y="${y - 22}" width="${w * .6}" height="22" fill="${color}"/><path d="M${x + w * .2 - 8} ${y - 22} Q${x + w / 2} ${y - 50} ${x + w * .8 + 8} ${y - 22}Z" fill="${color}"/>`;
    }
    for (let wy = y + 16; wy < base - 10; wy += 26)
      for (let wx = x + 10; wx < x + w - 14; wx += 22)
        if (r() < density) out += `<rect class="win" x="${wx.toFixed(1)}" y="${wy.toFixed(1)}" width="8" height="11" fill="${win}" style="animation-delay:-${(r() * 4).toFixed(2)}s"/>`;
    x += w + r() * 6;
  }
  svg.innerHTML = out;
}

function clouds(g, n, seed, fill) {
  const r = rnd(seed); let out = '';
  for (let i = 0; i < n; i++) {
    const y = 40 + r() * 380, s = .6 + r() * 1.3;
    out += `<g transform="translate(0 ${y.toFixed(0)}) scale(${s.toFixed(2)})"><g class="cloud" style="--dur:${(70 + r() * 70).toFixed(0)}s;--del:-${(r() * 130).toFixed(0)}s;opacity:${(.25 + r() * .4).toFixed(2)}" fill="${fill}">` +
      `<ellipse cx="0" cy="0" rx="120" ry="26"/><ellipse cx="-70" cy="10" rx="80" ry="22"/><ellipse cx="80" cy="8" rx="90" ry="24"/><ellipse cx="10" cy="-18" rx="70" ry="22"/></g></g>`;
  }
  g.innerHTML = out;
}

let FID = 0;
function figure(o = {}) {
  const c = Object.assign({
    skin: '#f0c9a6', coat: '#2b3550', trim: '#ff7a1a', hair: '#e6ecf7', style: 'spiky', scarf: '#ff6a1a', pants: '#141a28',
    eyes: '#ffffff', gem: '#ffb347', aura: null, cloak: null, cloakTrim: '#ff7a1a', mark: null, halo: null, collar: null,
    band: true, pose: 'stand', sil: false
  }, o);
  if (c.sil) { c.skin = c.coat = c.hair = c.trim = c.pants = c.cloak = '#05070d'; if (c.scarf) c.scarf = '#0a0c14'; c.eyes = c.gem = 'transparent'; c.aura = c.mark = c.halo = null; c.cloakTrim = '#05070d'; }
  const id = 'g' + (++FID);
  const hair = c.style === 'spiky'
    ? `<path d="M70 62 L58 30 L80 44 L84 14 L100 40 L114 8 L120 42 L144 24 L130 64 Q100 38 70 62Z" fill="${c.hair}"/>`
    : `<path d="M72 66 Q66 20 104 18 Q142 20 132 66 L124 46 L112 66 L100 44 L88 62 L80 48Z" fill="${c.hair}"/>`;
  const arms = c.pose === 'ready'
    ? `<path d="M70 104 L30 150 L40 164 L78 128Z" fill="${c.coat}"/><circle cx="35" cy="158" r="8" fill="${c.skin}"/><path d="M130 104 L186 146 L178 162 L124 130Z" fill="${c.coat}"/><circle cx="184" cy="154" r="9" fill="${c.skin}"/>`
    : `<path d="M70 104 L38 172 L50 182 L78 132Z" fill="${c.coat}"/><circle cx="44" cy="182" r="8" fill="${c.skin}"/><path d="M130 104 L162 172 L150 182 L122 132Z" fill="${c.coat}"/><circle cx="156" cy="182" r="8" fill="${c.skin}"/>`;
  return `<svg class="fig" viewBox="0 0 200 380" aria-hidden="true">` +
    (c.aura ? `<defs><radialGradient id="${id}a"><stop offset="0" stop-color="${c.aura}" stop-opacity=".9"/><stop offset=".6" stop-color="${c.aura}" stop-opacity=".25"/><stop offset="1" stop-color="${c.aura}" stop-opacity="0"/></radialGradient></defs><ellipse class="aura" cx="100" cy="190" rx="150" ry="230" fill="url(#${id}a)"/>` : '') +
    (c.halo ? `<g class="halo"><circle cx="100" cy="70" r="54" fill="none" stroke="${c.halo}" stroke-width="3"/><circle cx="100" cy="70" r="66" fill="none" stroke="${c.halo}" stroke-width="1.2" stroke-dasharray="4 9"/></g><g class="orbit" fill="${c.halo}"><circle cx="100" cy="70" r="5"/><circle cx="214" cy="190" r="6"/><circle cx="-14" cy="190" r="6"/><circle cx="100" cy="310" r="5"/></g>` : '') +
    (c.cloak ? `<path class="cloak" d="M62 96 Q-6 230 -26 372 L226 372 Q206 230 138 96Z" fill="${c.cloak}"/><path d="M-26 372 L226 372 L224 354 L-24 354Z" fill="${c.cloakTrim}"/>` : '') +
    `<path d="M64 198 L98 198 L94 336 L60 336Z M102 198 L136 198 L140 336 L106 336Z" fill="${c.pants}"/>` +
    `<path d="M54 330 L96 330 L98 354 L46 354Z M104 330 L146 330 L154 354 L102 354Z" fill="${c.sil ? c.pants : '#0b0e16'}"/>` +
    `<path d="M68 98 L132 98 L140 204 L60 204Z" fill="${c.coat}"/><path d="M96 98 L104 98 L106 204 L94 204Z" fill="${c.trim}"/><rect x="58" y="196" width="84" height="10" fill="${c.trim}"/>` +
    arms +
    (c.collar ? `<path d="M62 92 L100 118 L138 92 L150 128 L100 150 L50 128Z" fill="${c.collar}"/>` : '') +
    `<rect x="90" y="92" width="20" height="12" fill="${c.skin}"/><circle cx="100" cy="70" r="27" fill="${c.skin}"/>` +
    hair +
    (c.band ? `<rect x="72" y="54" width="56" height="9" rx="3" fill="${c.trim}"/><circle cx="100" cy="58.5" r="4.5" fill="${c.gem}"/>` : '') +
    `<ellipse cx="89" cy="74" rx="4" ry="3.2" fill="${c.eyes}"/><ellipse cx="111" cy="74" rx="4" ry="3.2" fill="${c.eyes}"/>` +
    (c.mark ? `<g class="glow" style="color:${c.mark}" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round"><path d="M52 150 L60 126 M148 150 L140 126 M100 112 L100 190 M90 82 L93 90 M110 82 L107 90"/></g>` : '') +
    (c.scarf ? `<path class="scarf" d="M80 98 Q100 112 122 98 L176 124 Q150 134 126 114 Q104 128 82 110Z" fill="${c.scarf}"/><path class="scarf tail" d="M118 104 Q170 130 190 190 Q150 160 112 118Z" fill="${c.scarf}"/>` : '') +
    `</svg>`;
}

function eyeMarkup() {
  let a = '', b = '', o = '';
  for (let i = 0; i < 8; i++) a += `<path d="M0 -104 L-16 -150 L0 -176 L16 -150Z" transform="rotate(${i * 45})" fill="#7a3dff" stroke="#e1cbff" stroke-width="1.5"/>`;
  for (let i = 0; i < 24; i++) b += `<line x1="0" y1="-98" x2="0" y2="-186" transform="rotate(${i * 15})" stroke="#e1cbff" stroke-width="${i % 2 ? 1 : 2.4}" opacity="${i % 2 ? .45 : .9}"/>`;
  for (let i = 0; i < 3; i++) o += `<path d="M0 -9 L7 0 L0 9 L-7 0Z" transform="rotate(${i * 120}) translate(0 -62)" fill="#fff"/>`;
  return `<svg viewBox="-200 -200 400 400"><defs><radialGradient id="ig"><stop offset="0" stop-color="#14041f"/><stop offset=".55" stop-color="#5a1b8f"/><stop offset=".85" stop-color="#d23bb0"/><stop offset="1" stop-color="#ff7ad0"/></radialGradient></defs>` +
    `<circle r="196" fill="#07030d" stroke="#6d3bd6" stroke-width="3"/>` +
    `<g class="ra">${a}<circle r="104" fill="none" stroke="#a97bff" stroke-width="2"/></g>` +
    `<g class="rb" opacity="0">${b}<circle r="188" fill="none" stroke="#e9d8ff" stroke-width="1.5" stroke-dasharray="3 9"/></g>` +
    `<circle r="96" fill="url(#ig)"/><g class="ob">${o}</g>` +
    `<circle class="pupil" r="30" fill="#000"/><circle r="30" fill="none" stroke="#fff" stroke-opacity=".5"/><ellipse cx="-10" cy="-10" rx="7" ry="4" fill="#fff" opacity=".8"/></svg>`;
}

function buildArt() {
  // Chapter I
  clouds($('#clouds1'), 9, 11, '#ffb88a');
  skyline($('#city1'), { base: 720, seed: 7, maxH: 170 });
  $('#heroFig1').innerHTML = figure({ sil: true });
  $('#hero1').classList.add('sil');
  // Chapter II
  let w = '', f = '', g = '';
  const r = rnd(5);
  for (let i = 0; i < 26; i++) w += `<rect x="${380 + i * 33}" y="${520 + (i % 2) * 70}" width="12" height="20" class="win"/>`;
  $('#academyWin').innerHTML = w;
  for (let x = 0; x < 1700; x += 34) f += `<path d="M${x} 640 V780"/>`;
  $('#fence').innerHTML = f;
  for (let x = 0; x < 1600; x += 18) g += `<path d="M${x} 830 q${(r() * 8 - 4).toFixed(1)} -${(14 + r() * 22).toFixed(0)} ${(r() * 12 - 6).toFixed(1)} -${(26 + r() * 22).toFixed(0)}"/>`;
  $('#grass').innerHTML = g;
  // Chapter III
  let bars = '';
  for (let k = 0; k < 12; k++) bars += `<rect x="${330 + k * 85}" y="-20" width="26" height="940" fill="#15151b" stroke="#30303b" stroke-width="2"/>`;
  $('#bars').innerHTML = bars;
  // Chapter IV
  const forms = [
    { n: 'The Initiate', o: { coat: '#2b3550' }, bg: '#0e1426' },
    { n: 'The Wanderer', o: { coat: '#1d2740', cloak: '#161c30', cloakTrim: '#3a4a7a', aura: '#59c8ff' }, bg: '#101a38' },
    { n: 'Mossbound', o: { coat: '#2f5a45', hair: '#cfe8c0', mark: '#9dff7a', aura: '#7dff9a', trim: '#b8ff7a' }, bg: '#0d2a22' },
    { n: 'Emberform', o: { coat: '#5a1d10', hair: '#ffd27a', mark: '#ff7a1a', aura: '#ff6a1a', trim: '#ffb23a', eyes: '#ffe28a' }, bg: '#3a0e06' },
    { n: 'Aurelian', o: { coat: '#f3e6b8', trim: '#d9a21b', hair: '#fff6c9', aura: '#ffd45a', halo: '#ffd45a', scarf: '#ffbf3a', eyes: '#fff' }, bg: '#3b2b08' },
    { n: 'The Warden', o: { coat: '#20263a', cloak: '#f2eee3', cloakTrim: '#ff6a1a', aura: '#ffd27a', scarf: '#ff6a1a' }, bg: '#26122a' }
  ];
  $('#figs4').innerHTML = forms.map(f => `<div class="f4">${figure(f.o)}</div>`).join('');
  $('#labels4').innerHTML = forms.map((f, i) => `<div class="fl"><span>0${i + 1} / 06</span><b>${f.n}</b></div>`).join('');
  $('#steps4').innerHTML = forms.map((f, i) => `<li${i ? '' : ' class="on"'}></li>`).join('');
  buildArt.forms = forms;
  // Chapter V
  const eye = eyeMarkup();
  $('#eyewrap').innerHTML = `<div class="eyeL c">${eye}</div><div class="eyeL r">${eye}</div><div class="eyeL m">${eye}</div>`;
  $('#rivalFig').innerHTML = figure({ style: 'swept', skin: '#ead9cb', hair: '#15122b', coat: '#241c40', trim: '#7b4dff', collar: '#17112e', band: false, eyes: '#d9bfff', scarf: null, cloak: '#14102a', cloakTrim: '#7b4dff', aura: '#8a5cff' });
  // Chapter VI
  $('#figL').innerHTML = figure({ pose: 'ready', aura: '#59c8ff', coat: '#2b3550' });
  $('#figR').innerHTML = figure({ pose: 'ready', style: 'swept', skin: '#ead9cb', hair: '#15122b', coat: '#241c40', trim: '#7b4dff', collar: '#17112e', band: false, eyes: '#d9bfff', scarf: null, aura: '#8a5cff' });
  $('#pair6').innerHTML = `<div class="fig-wrap sil">${figure({ sil: true })}</div><div class="fig-wrap sil">${figure({ sil: true, style: 'swept', scarf: null })}</div>`;
  // Chapter VII
  skyline($('#cityB7'), { base: 690, color: '#3a2448', win: '#ffd27a', seed: 21, width: 2400, minW: 70, maxW: 150, maxH: 150, density: .3 });
  skyline($('#cityF7'), { base: 800, color: '#120a1c', win: '#ffd27a', seed: 33, width: 2400, minW: 80, maxW: 170, minH: 60, maxH: 170, density: .35 });
  $('#heroFig7').innerHTML = figure({ cloak: '#f2eee3', cloakTrim: '#ff6a1a', coat: '#20263a', aura: '#ffd27a' });
}

/* ================= text splitting ================= */
function split(el) {
  const t = el.textContent.trim(); el.setAttribute('aria-label', t); el.textContent = '';
  const chars = [];
  t.split(' ').forEach((word, i, a) => {
    const ws = document.createElement('span'); ws.className = 'w'; ws.setAttribute('aria-hidden', 'true');
    [...word].forEach(ch => { const s = document.createElement('span'); s.className = 'ch'; s.textContent = ch; ws.appendChild(s); chars.push(s); });
    el.appendChild(ws); if (i < a.length - 1) el.appendChild(document.createTextNode(' '));
  });
  gsap.set(chars, { yPercent: 120 });
  return chars;
}

/* ================= particles ================= */
const fx = $('#fx'), fc = fx.getContext('2d');
let W = 0, H = 0, DPR = 1;
function fxResize() { DPR = Math.min(devicePixelRatio || 1, lowPower ? 1 : 1.6); W = innerWidth; H = innerHeight; fx.width = W * DPR; fx.height = H * DPR; }
const PAL = {
  ember: ['255,140,40', '255,200,90', '255,90,30'], leaves: ['210,110,40', '160,80,30', '230,150,60'],
  red: ['255,50,40', '255,110,60', '200,20,30'], gold: ['255,220,120', '255,240,170', '255,190,70'],
  violet: ['170,110,255', '120,150,255', '230,160,255'], petals: ['255,190,205', '255,215,225', '255,150,180'],
  blue: ['150,200,255', '190,225,255', '130,160,255']
};
let mode = 'ember', fxGlobal = reduce ? .6 : 0;
const COUNT = reduce ? 24 : lowPower ? 50 : 120;
const parts = Array.from({ length: COUNT }, () => ({}));
function spawn(p, init) {
  const m = mode; p.m = m; p.fo = 1; p.fade = false; p.age = init ? Math.random() * 120 : 0;
  p.c = PAL[m][(Math.random() * PAL[m].length) | 0]; p.rot = Math.random() * 6.28; p.ph = Math.random() * 6.28; p.shape = 'dot';
  const gold = () => { p.x = Math.random() * W; p.y = init ? Math.random() * H : H + 10; p.vx = (Math.random() - .5) * .5; p.vy = -(.3 + Math.random() * .8); p.s = 1.5 + Math.random() * 3; p.shape = 'dot'; p.c = PAL.gold[(Math.random() * 3) | 0]; };
  switch (m) {
    case 'leaves': p.x = Math.random() * W * 1.2 - W * .1; p.y = init ? Math.random() * H : -20; p.vx = .8 + Math.random() * 1.4; p.vy = .7 + Math.random() * 1.1; p.s = 5 + Math.random() * 6; p.shape = 'leaf'; break;
    case 'petals': if (Math.random() < .4) gold(); else { p.x = Math.random() * W * 1.2 - W * .1; p.y = init ? Math.random() * H : -20; p.vx = .5 + Math.random() * 1; p.vy = .5 + Math.random() * .8; p.s = 4 + Math.random() * 4; p.shape = 'leaf'; } break;
    case 'red': p.ang = Math.random() * 6.28; p.rad = (.08 + Math.random() * .75) * Math.max(W, H) * .6; p.s = 1.2 + Math.random() * 2.6; p.w = .004 + Math.random() * .01; break;
    case 'violet': p.x = Math.random() * W; p.y = Math.random() * H; p.vx = (Math.random() - .5) * 2; p.vy = (Math.random() - .5) * 2; p.s = 1 + Math.random() * 2; p.life = 40 + Math.random() * 80; break;
    case 'blue': p.x = Math.random() * W * 1.2; p.y = init ? Math.random() * H : -30; p.vx = -2; p.vy = 9 + Math.random() * 7; p.s = 1; p.shape = 'streak'; break;
    case 'gold': gold(); break;
    default: p.x = Math.random() * W; p.y = init ? Math.random() * H : H + 10; p.vx = (Math.random() - .5) * .5; p.vy = -(.35 + Math.random() * 1.2); p.s = 1 + Math.random() * 2.4;
  }
}
function setMode(m) { if (m === mode) return; mode = m; for (const p of parts) p.fade = true; }
function fxFrame() {
  fc.setTransform(DPR, 0, 0, DPR, 0, 0); fc.clearRect(0, 0, W, H);
  if (fxGlobal < .01) return;
  fc.globalCompositeOperation = 'lighter';
  for (let i = 0; i < COUNT; i++) {
    const p = parts[i]; if (!p.m) spawn(p, true);
    p.age++;
    if (p.fade) { p.fo *= .92; if (p.fo < .04) { spawn(p, false); continue; } }
    const a = Math.min(1, p.age / 30) * p.fo * fxGlobal;
    if (p.m === 'red') {
      p.ang += p.w; p.rad *= .9992; p.x = W / 2 + Math.cos(p.ang) * p.rad; p.y = H / 2 + Math.sin(p.ang) * p.rad * .62;
      if (p.rad < 30) { spawn(p, false); continue; }
    } else if (p.m === 'violet') {
      p.x += p.vx; p.y += p.vy; p.vx += (Math.random() - .5) * .6; p.vy += (Math.random() - .5) * .6; if (--p.life < 0) { spawn(p, false); continue; }
    } else {
      p.x += p.vx + Math.sin(p.age * .02 + p.ph) * (p.shape === 'leaf' ? .8 : .25); p.y += p.vy; p.rot += .03;
      if (p.y < -30 || p.y > H + 40 || p.x > W + 40 || p.x < -60) { spawn(p, false); continue; }
    }
    fc.fillStyle = `rgba(${p.c},${a * .85})`;
    if (p.shape === 'leaf') {
      fc.save(); fc.translate(p.x, p.y); fc.rotate(p.rot); fc.scale(1, .35 + Math.abs(Math.cos(p.age * .04 + p.ph)) * .65);
      fc.beginPath(); fc.ellipse(0, 0, p.s, p.s * .55, 0, 0, 6.283); fc.fill(); fc.restore();
    } else if (p.shape === 'streak') {
      fc.strokeStyle = `rgba(${p.c},${a * .35})`; fc.lineWidth = 1; fc.beginPath(); fc.moveTo(p.x, p.y); fc.lineTo(p.x + p.vx * 2, p.y + p.vy * 2); fc.stroke();
    } else {
      fc.beginPath(); fc.arc(p.x, p.y, p.s, 0, 6.283); fc.fill();
      fc.fillStyle = `rgba(${p.c},${a * .12})`; fc.beginPath(); fc.arc(p.x, p.y, p.s * 3.4, 0, 6.283); fc.fill();
    }
  }
}

/* ================= lightning ================= */
function jag(ctx, x1, y1, x2, y2, d) {
  if (d < 3) { ctx.lineTo(x2, y2); return; }
  const mx = (x1 + x2) / 2 + (Math.random() - .5) * d, my = (y1 + y2) / 2 + (Math.random() - .5) * d;
  jag(ctx, x1, y1, mx, my, d / 2); jag(ctx, mx, my, x2, y2, d / 2);
}
function strike(ctx, x1, y1, x2, y2, d, col, w) {
  ctx.beginPath(); ctx.moveTo(x1, y1); jag(ctx, x1, y1, x2, y2, d);
  ctx.strokeStyle = col; ctx.lineWidth = w * 2.6; ctx.globalAlpha = .35; ctx.shadowColor = col; ctx.shadowBlur = 16; ctx.stroke();
  ctx.globalAlpha = 1; ctx.lineWidth = w * .8; ctx.strokeStyle = '#fff'; ctx.shadowBlur = 0; ctx.stroke();
}
const boltLayers = [];
class BoltLayer {
  constructor(cv, chapter) { this.cv = cv; this.ctx = cv.getContext('2d'); this.chapter = chapter; this.em = []; this.sky = 0; this.skyT = 0; this.last = 0; this.onFlash = null; boltLayers.push(this); this.resize(); }
  resize() { const d = Math.min(devicePixelRatio || 1, lowPower ? 1 : 1.5); this.d = d; this.cv.width = Math.max(2, this.cv.clientWidth * d); this.cv.height = Math.max(2, this.cv.clientHeight * d); }
  draw(t) {
    if (t - this.last < 48) return; this.last = t;
    const { ctx, cv, d } = this; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.save(); ctx.scale(d, d); ctx.lineCap = 'round'; ctx.globalCompositeOperation = 'lighter';
    const cr = cv.getBoundingClientRect();
    for (const e of this.em) {
      const o = e(cr); if (!o || o.n < 1) continue;
      for (let i = 0; i < o.n; i++) {
        if (Math.random() < .25) continue;
        const a = Math.random() * 6.283, len = o.r * (.45 + Math.random() * .8);
        strike(ctx, o.x, o.y, o.x + Math.cos(a) * len, o.y + Math.sin(a) * len, len * .55, o.col || '#b99bff', 1 + (o.w || 1));
      }
    }
    if (this.sky > .02 && this.skyT <= 0 && Math.random() < this.sky * .09) { this.skyT = 4; if (this.onFlash) this.onFlash(); }
    if (this.skyT > 0) { this.skyT--; const w = cv.clientWidth, h = cv.clientHeight, x = w * (.15 + Math.random() * .7); strike(ctx, x, 0, x + (Math.random() - .5) * 220, h * .55, 170, '#cfd8ff', 3.4); }
    ctx.restore();
  }
}
const centerOf = (el, cr) => { const b = el.getBoundingClientRect(); return { x: b.left + b.width / 2 - cr.left, y: b.top + b.height / 2 - cr.top, w: b.width, h: b.height, l: b.left - cr.left, t: b.top - cr.top }; };

/* ================= Three.js vortex (lazy) ================= */
let tun = null, tunLoading = false;
function loadScript(src) { return new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.async = true; s.onload = res; s.onerror = rej; document.head.appendChild(s); }); }
async function initTunnel() {
  if (reduce || tun || tunLoading) return; tunLoading = true;
  try { await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'); } catch (e) { return; }
  if (!window.THREE) return;
  const cv = $('#tunnel');
  const renderer = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: !lowPower });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, lowPower ? 1 : 1.5));
  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(70, 1, .1, 300);
  const N = lowPower ? 28 : 48, gap = 5, L = N * gap;
  const geo = new THREE.TorusGeometry(7, .07, 6, lowPower ? 40 : 72);
  const rings = [];
  for (let i = 0; i < N; i++) {
    const m = new THREE.MeshBasicMaterial({ color: new THREE.Color().setHSL(.72 + (i % 7) * .02, .9, .62), transparent: true, opacity: .9, blending: THREE.AdditiveBlending, depthWrite: false });
    const mesh = new THREE.Mesh(geo, m); scene.add(mesh); rings.push(mesh);
  }
  const resize = () => { const w = cv.clientWidth || innerWidth, h = cv.clientHeight || innerHeight; renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); };
  resize(); addEventListener('resize', resize);
  tun = {
    render(p) {
      const dist = p * L * 2.4;
      for (let i = 0; i < N; i++) {
        const r = rings[i], z = -(((i * gap - dist) % L) + L) % L;
        r.position.set(Math.sin(i * .35 + p * 9) * 1.6, Math.cos(i * .28 + p * 7) * 1.2, z);
        r.rotation.z = i * .25 + p * 10; r.scale.setScalar(1 + .35 * Math.sin(i * .6 + p * 14));
        r.material.opacity = Math.max(0, .95 - (-z) / L);
      }
      cam.rotation.z = p * 7; renderer.render(scene, cam);
    }
  };
}

/* ================= chrome: nav, progress, cursor ================= */
const chapters = [], colors = ['#ff9b3d', '#ffb347', '#ff4a2a', '#ffc94d', '#9a6bff', '#59c8ff', '#ffc94d'];
let activeIdx = 0;
function buildNav() {
  $('#nav ul').innerHTML = $$('.stage').map((s, i) => `<li><a href="#${s.id}" data-i="${i}"><em>${s.dataset.title}</em><span></span></a></li>`).join('');
  $$('#nav a').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    const st = chapters[+a.dataset.i]?.scrollTrigger; if (!st) return;
    const y = +a.dataset.i === 0 ? 0 : st.start + 2;
    if (window.ScrollToPlugin) gsap.to(window, { scrollTo: { y, autoKill: true }, duration: reduce ? .01 : 1.8, ease: 'power2.inOut' }); else scrollTo(0, y);
  }));
}
function setActive(i) {
  activeIdx = i; $$('#nav a').forEach((a, k) => a.classList.toggle('on', k === i));
  const ring = $('#cursor .ring'); if (ring) ring.style.setProperty('--c', colors[i] || '#ff9b3d');
}
function initCursor() {
  if (coarse) return; document.body.classList.add('has-cursor');
  const dot = $('#cursor .dot'), ring = $('#cursor .ring');
  gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });
  const xd = gsap.quickTo(dot, 'x', { duration: .08 }), yd = gsap.quickTo(dot, 'y', { duration: .08 });
  const xr = gsap.quickTo(ring, 'x', { duration: .4, ease: 'power3' }), yr = gsap.quickTo(ring, 'y', { duration: .4, ease: 'power3' });
  addEventListener('pointermove', e => { xd(e.clientX); yd(e.clientY); xr(e.clientX); yr(e.clientY); }, { passive: true });
  document.addEventListener('pointerover', e => ring.classList.toggle('hot', !!(e.target.closest && e.target.closest('a,button'))));
}

/* ================= chapter factory ================= */
function chapter(id, len, build, opts = {}) {
  const idx = chapters.length;
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: '#' + id, start: 'top top', end: '+=' + len + '%', pin: true, scrub: reduce ? .2 : .7, anticipatePin: 1, invalidateOnRefresh: true,
      onToggle: s => { if (s.isActive) { setActive(idx); if (opts.mode) setMode(opts.mode(s.progress)); } },
      onUpdate: s => { if (opts.mode) setMode(opts.mode(s.progress)); if (opts.update) opts.update(s.progress, s); }
    }
  });
  chapters.push(tl);
  build(tl);
  tl.to({}, { duration: .001 }, opts.total || 10);
  return tl;
}
const reveal = (tl, chars, t, stagger = .035) => tl.to(chars, { yPercent: 0, stagger, duration: .7, ease: 'power3.out' }, t);
const hide = (tl, chars, t) => tl.to(chars, { yPercent: -120, stagger: .01, duration: .4, ease: 'power2.in' }, t);

/* ================= build the story ================= */
function story() {
  const fade = (sel, t, d = 1) => (tl) => tl.to(sel, { opacity: 0, duration: d }, t);

  /* ---------- I · Lanternvale ---------- */
  const h1c = split($('#h1')), s1c = split($('#sub1'));
  gsap.set(['#q1', '#si > *'], { opacity: 0 });
  gsap.set('#in1', { opacity: 0 });
  gsap.set('#heroFig1', { opacity: 0, y: 50 });
  chapter('ch1', 250, tl => {
    tl.to('#w1', { scale: 2.5, transformOrigin: '50% 36%', duration: 10 }, 0)
      .to('#hero1', { yPercent: 75, scale: 2.4, xPercent: -14, transformOrigin: '30% 80%', duration: 7, ease: 'power1.in' }, 0)
      .to('#t1', { yPercent: -30, autoAlpha: 0, duration: 3 }, 0)
      .to('#si', { autoAlpha: 0, duration: 1 }, 0)
      .to('.fog1', { opacity: 1, duration: 6 }, 1)
      .to('#d1', { opacity: 1, duration: 3, ease: 'power1.in' }, 7);
  }, { mode: () => 'ember', total: 10 });

  // opening sequence (plays once on load)
  function intro() {
    const html = document.documentElement;
    if (reduce) { gsap.set('#intro', { autoAlpha: 0 }); gsap.set(['#in1', '#q1', '#si > *'], { opacity: 1 }); gsap.set(['#heroFig1'], { opacity: 1, y: 0 }); gsap.set([...h1c, ...s1c], { yPercent: 0 }); fxGlobal = .6; return; }
    html.style.overflow = 'hidden';
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' }, onComplete: () => { html.style.overflow = ''; } });
    tl.to({ v: 0 }, { v: 1, duration: 3, onUpdate() { fxGlobal = this.targets()[0].v; } }, 0)
      .to('#in1', { opacity: 1, duration: 4.5, ease: 'power1.inOut' }, 1.2)
      .to('#intro', { autoAlpha: 0, duration: 1.5 }, 1.2)
      .fromTo('.l-crest', { y: 40 }, { y: 0, duration: 5, ease: 'power1.out' }, 1.4)
      .to('#heroFig1', { opacity: 1, y: 0, duration: 2.2 }, 3.2)
      .to(h1c, { yPercent: 0, stagger: .09, duration: 1.2, ease: 'power4.out' }, 4)
      .to(s1c, { yPercent: 0, stagger: .03, duration: .9 }, 5)
      .to('#q1', { opacity: 1, duration: 1.4 }, 5.8)
      .to('#si > *', { opacity: 1, duration: 1 }, 6.6);
    gsap.to('#heroFig1', { y: -3, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 6 });
  }
  intro();

  /* ---------- II · The Lonely Child ---------- */
  const q2 = $('#q2'); gsap.set(q2, { opacity: 0, y: 24 });
  gsap.set('.p-far', { z: -320, scale: 1.4 }); gsap.set('.p-mid', { z: -120, scale: 1.12 }); gsap.set('.p-fore', { z: 120 });
  gsap.set('#ch2 .eyebrow', { opacity: 0 });
  const swing = { amp: 4 };
  gsap.set('.p-swing', { filter: 'drop-shadow(0 0 0px rgba(255,150,50,0))' });
  chapter('ch2', 320, tl => {
    tl.to('#d2', { opacity: 0, duration: 2 }, 0)
      .fromTo('#w2', { rotationY: -16 }, { rotationY: 16, duration: 10 }, 0)
      .to('.p-far', { x: -40, duration: 10 }, 0).to('.p-mid', { x: -140, duration: 10 }, 0).to('.p-swing', { x: -20, duration: 10 }, 0).to('.p-fore', { x: -300, duration: 10 }, 0)
      .to(swing, { amp: 15, duration: 10 }, 0)
      .to('#ch2 .eyebrow', { opacity: 1, duration: 1 }, 1.5)
      .to(q2, { opacity: 1, y: 0, duration: 1.5, ease: 'power2.out' }, 2)
      .to(q2, { opacity: 0, duration: 1 }, 6.3)
      .to('#d2', { opacity: .8, duration: 2.5 }, 6)
      .to('.p-swing', { filter: 'drop-shadow(0 0 36px rgba(255,150,50,.95))', duration: 2 }, 7)
      .fromTo('#emberGlow', { scale: 0, opacity: .2 }, { scale: 15, opacity: 1, duration: 3.2, ease: 'power2.in' }, 8.4);
  }, { mode: () => 'leaves', total: 12 });
  gsap.ticker.add(time => { if (activeIdx === 1) gsap.set('#swing', { rotation: swing.amp * Math.sin(time * 1.15), svgOrigin: '200 44' }); });

  /* ---------- III · The Fire Within ---------- */
  const h3c = split($('#h3')); gsap.set(['#q3', '#ch3 .eyebrow'], { opacity: 0 });
  let shake = 0;
  gsap.set('#beast', { svgOrigin: '800 450' });
  chapter('ch3', 380, tl => {
    tl.to('#d3', { opacity: 0, duration: 1.8 }, 0)
      .to('#eyes3', { opacity: 1, duration: 4 }, 1)
      .fromTo('#eyeGlow3', { opacity: .2, scale: .9 }, { opacity: 1, scale: 1.25, svgOrigin: '800 470', duration: 8 }, 2)
      .to('#gate', { opacity: 1, duration: 2 }, 2.5)
      .from('#chainL', { x: -700, duration: 3, ease: 'power2.out' }, 3).from('#chainR', { x: 700, duration: 3, ease: 'power2.out' }, 3).from('#chainT', { y: -600, duration: 3, ease: 'power2.out' }, 3.4)
      .to('#ch3 .eyebrow', { opacity: 1, duration: 1 }, 5)
      .call(() => { }, null, 5);
    reveal(tl, h3c, 5.2, .05);
    tl.to('#q3', { opacity: 1, duration: 1.2 }, 6.4)
      .to('#swirl3', { opacity: .8, rotation: 720, duration: 4, ease: 'power1.in' }, 8)
      .to('#t3', { opacity: 0, duration: 1 }, 9.5)
      .to('#gate', { scale: 8, svgOrigin: '800 450', duration: 5, ease: 'power2.in' }, 8.5)
      .to('#gate', { opacity: 0, duration: 1.4 }, 11.6)
      .to('#beast', { scale: 1.9, duration: 5, ease: 'power1.in' }, 8.5)
      .to('#wave3', { x: () => innerWidth * 2.3, duration: 3, ease: 'power1.inOut' }, 9.6)
      .to('#gold3', { opacity: 1, duration: 2, ease: 'power2.in' }, 12);
  }, {
    total: 14, mode: p => p < .66 ? 'red' : 'gold',
    update: p => {
      const amp = reduce ? 0 : seg(p, .55, .8) * (1 - seg(p, .86, .93)) * 9;
      if (amp > .05) gsap.set('#w3', { x: (Math.random() - .5) * amp * 2, y: (Math.random() - .5) * amp * 2, rotation: (Math.random() - .5) * amp * .12 });
      else if (shake) gsap.set('#w3', { x: 0, y: 0, rotation: 0 });
      shake = amp;
    }
  });

  /* ---------- IV · Evolution ---------- */
  const h4c = split($('#h4')); gsap.set(['#q4', '#ch4 .eyebrow'], { opacity: 0 });
  const forms = buildArt.forms, figs = $$('.f4'), labels = $$('.fl'), ticks = $$('#steps4 li');
  gsap.set(figs.slice(1), { opacity: 0, scale: .85 });
  gsap.set(labels.slice(1), { opacity: 0 });
  chapter('ch4', 620, tl => {
    tl.to('#d4', { opacity: 0, duration: 1.4 }, 0)
      .to('#ch4 .eyebrow', { opacity: 1, duration: .8 }, .6)
      .to('#figs4', { scale: 1.22, duration: 13, transformOrigin: '50% 80%' }, 0)
      .to('#rays4', { rotation: 180, duration: 13 }, 0).to('#ring4', { rotation: 0, scaleX: 1.15, duration: 13 }, 0);
    reveal(tl, h4c, .5, .03);
    for (let i = 1; i < forms.length; i++) {
      const T = i * 2 + 1;
      tl.fromTo('#burst4', { scale: .2, opacity: 0 }, { scale: 3, opacity: 1, duration: .5, ease: 'power2.out' }, T - .5)
        .to('#burst4', { opacity: 0, duration: .6 }, T)
        .to(figs[i - 1], { opacity: 0, scale: 1.18, duration: .5 }, T - .25)
        .fromTo(figs[i], { opacity: 0, scale: .82 }, { opacity: 1, scale: 1, duration: .8, ease: 'power2.out' }, T - .1)
        .to('#bg4', { backgroundColor: forms[i].bg, duration: 1 }, T - .5)
        .to(labels[i - 1], { opacity: 0, duration: .4 }, T - .3)
        .to(labels[i], { opacity: 1, duration: .6 }, T - .1)
        .call(() => { }, null, T);
    }
    tl.to('#q4', { opacity: 1, duration: 1.2 }, 11.2)
      .to('#d4e', { opacity: 1, duration: 1.2, ease: 'power1.in' }, 12.8);
  }, {
    total: 14, mode: p => p > .6 ? 'gold' : 'ember',
    update: p => { const k = Math.min(forms.length - 1, Math.max(0, Math.floor((p * 14 - 1) / 2))); ticks.forEach((t, i) => t.classList.toggle('on', i === k)); }
  });

  /* ---------- V · The Hollow Eye ---------- */
  const h5c = split($('#h5')); gsap.set(['#q5', '#ch5 .eyebrow', '#cap5'], { opacity: 0 });
  gsap.set('#eyewrap', { scale: .15, opacity: 0 });
  gsap.set('#rival5', { opacity: 0, scale: 1.5, rotation: 80 });
  const tunState = { p: 0 };
  const b5 = new BoltLayer($('#bolts5'), 4), rivalG = { v: 0 };
  b5.em.push(cr => { if (rivalG.v < .03) return null; const c = centerOf($('#rivalFig'), cr); return { x: c.x + c.w * .22, y: c.t + c.h * .4, r: c.h * .5, n: Math.ceil(rivalG.v * 4), col: '#b99bff', w: rivalG.v * 1.4 }; });
  b5.em.push(cr => { if (rivalG.v < .03) return null; const c = centerOf($('#rivalFig'), cr); return { x: c.x - c.w * .1, y: c.t + c.h * .46, r: c.h * .3, n: Math.ceil(rivalG.v * 3), col: '#8aa6ff', w: rivalG.v }; });
  chapter('ch5', 760, tl => {
    const eyes = $$('#eyewrap .eyeL'), main = $('#eyewrap .m'), rEye = $('#eyewrap .r'), cEye = $('#eyewrap .c');
    tl.to('#d5', { opacity: 0, duration: 1 }, 0)
      .to('#eyewrap', { scale: 1, opacity: 1, duration: 3, ease: 'power2.out' }, .4)
      .to('#cap5', { opacity: 1, duration: 1 }, 1.5)
      .to('#bg5b', { opacity: 1, duration: 6 }, 0)
      .to('#eyewrap .ra', { rotation: 1440, svgOrigin: '0 0', duration: 12 }, 0)
      .to('#eyewrap .rb', { rotation: -1440, svgOrigin: '0 0', duration: 12 }, 0)
      .to('#eyewrap .ob', { rotation: 2880, svgOrigin: '0 0', duration: 12 }, 0)
      .to('#eyewrap .rb', { opacity: 1, duration: 1.4 }, 4)              // the eye awakens: second ring blooms
      .fromTo(main, { filter: 'drop-shadow(0 0 40px rgba(154,107,255,.7))' }, { filter: 'drop-shadow(0 0 90px rgba(255,90,210,.95))', duration: 2 }, 4);
    // glitch
    tl.to(rEye, { opacity: .8, x: 22, duration: 1.2 }, 6).to(cEye, { opacity: .8, x: -22, duration: 1.2 }, 6)
      .to(rEye, { x: -34, duration: .6 }, 7.2).to(cEye, { x: 34, duration: .6 }, 7.2)
      .to('#cap5', { opacity: 0, duration: .6 }, 6.5)
      // dive into the eye
      .to('#eyewrap', { scale: 70, rotation: 180, duration: 6, ease: 'power3.in' }, 7)
      .to('#bg5', { backgroundColor: '#000', duration: 2 }, 11)
      .to('#spiral', { opacity: 1, rotation: 720, duration: 5 }, 10)
      .to('#tunnel', { opacity: 1, duration: 1.2 }, 11)
      .to(tunState, { p: 1, duration: 6 }, 11)
      .to('#eyewrap', { opacity: 0, duration: .8 }, 12.4)
      // vortex untwists into the Uchiha-style dark world: Kael appears
      .to('#tunnel', { opacity: 0, duration: 1.4 }, 16.4)
      .to('#spiral', { opacity: 0, duration: 1.4 }, 16.8)
      .to('#rival5', { opacity: 1, scale: 1, rotation: 0, duration: 3.2, ease: 'power3.out' }, 15.6)
      .to(rivalG, { v: 1, duration: 2.5 }, 17);
    tl.to('#ch5 .eyebrow', { opacity: 1, duration: 1 }, 17.8);
    reveal(tl, h5c, 18, .04);
    tl.to('#q5', { opacity: 1, duration: 1.2 }, 19.2)
      .to('#d5e', { opacity: 1, duration: 1 }, 21.2);
  }, {
    total: 22, mode: () => 'violet',
    update: () => { if (tun && tunState.p > 0 && tunState.p < 1) tun.render(tunState.p); }
  });
  // add a closing dark fade element for ch5 → ch6 hand-off
  ScrollTrigger.create({ trigger: '#ch4', start: 'top bottom', once: true, onEnter: initTunnel });

  /* ---------- VI · Brothers Beyond Blood ---------- */
  const h6c = split($('#h6')); gsap.set(['#q6', '#ch6 .eyebrow'], { opacity: 0 });
  const b6 = new BoltLayer($('#bolts6'), 5), G = { rival: 0, hero: 0, center: 0 };
  b6.em.push(cr => G.rival < .03 ? null : (c => ({ x: c.x, y: c.y, r: c.w * (.7 + G.rival * .6), n: Math.ceil(G.rival * 5), col: '#b99bff', w: G.rival * 1.5 }))(centerOf($('#orbR'), cr)));
  b6.em.push(cr => G.hero < .03 ? null : (c => ({ x: c.x, y: c.y, r: c.w * .7, n: Math.ceil(G.hero * 3), col: '#8fd6ff', w: G.hero }))(centerOf($('#orbL'), cr)));
  b6.em.push(cr => { if (G.center < .03) return null; const s = $('#ch6').getBoundingClientRect(); return { x: s.width / 2, y: s.height * .6, r: Math.min(s.width, s.height) * .55 * G.center, n: Math.ceil(G.center * 9), col: '#ffffff', w: 2.5 }; });
  b6.sky = .0; b6.onFlash = () => gsap.fromTo('#flashSky', { opacity: .75 }, { opacity: 0, duration: .55, ease: 'power2.out' });
  // rocks + sparks
  const rocksBox = $('#rocks'), rocks = [], sparks = [], vm = Math.min(innerWidth, innerHeight) / 100;
  for (let i = 0; i < (lowPower ? 14 : 26); i++) { const e = document.createElement('div'); e.className = 'rock'; const s = 8 + Math.random() * 26; e.style.width = s + 'px'; e.style.height = s * .8 + 'px'; rocksBox.appendChild(e); rocks.push(e); }
  for (let i = 0; i < (lowPower ? 20 : 44); i++) { const e = document.createElement('div'); e.className = 'spark'; rocksBox.appendChild(e); sparks.push(e); }
  gsap.set('#sunset6', { opacity: 0 });
  gsap.set(['#orbL', '#orbR'], { scale: 0 });
  gsap.set('#shock', { scale: 0, opacity: 0 });
  chapter('ch6', 900, tl => {
    const fL = $('#fL'), fR = $('#fR'), world = $('#w6');
    const shiftL = () => { const w = world.offsetWidth; return w / 2 - (fL.offsetLeft + fL.offsetWidth * .92) + 6; };
    const shiftR = () => { const w = world.offsetWidth; return w / 2 - (fR.offsetLeft + fR.offsetWidth * .08) - 6; };
    tl.to('#d6', { opacity: 0, duration: 1.5 }, 0)
      .to(b6, { sky: 1, duration: 3 }, 0.5)
      // charge
      .to('#orbL', { scale: 1, duration: 3.6, ease: 'power2.out' }, 1.2).to(G, { hero: 1, duration: 3 }, 1.4)
      .to('#orbR', { scale: 1, duration: 3.6, ease: 'power2.out' }, 1.8).to(G, { rival: 1, duration: 3 }, 2)
      .to('#fL', { y: -6, duration: 2, yoyo: true, repeat: 1, ease: 'sine.inOut' }, 1.2)
      // camera moves between the two
      .to('#w6', { x: '7vw', scale: 1.15, transformOrigin: '30% 70%', duration: 1.2, ease: 'power2.inOut' }, 3.4)
      .to('#w6', { x: '-7vw', transformOrigin: '70% 70%', duration: 1.6, ease: 'power2.inOut' }, 4.6)
      .to('#w6', { x: 0, scale: 1, transformOrigin: '50% 70%', duration: 1.2, ease: 'power2.inOut' }, 6.2)
      // rush, in slow motion
      .to(fL, { x: shiftL, duration: 3.6, ease: 'power4.in' }, 7)
      .to(fR, { x: shiftR, duration: 3.6, ease: 'power4.in' }, 7)
      .to('#w6', { scale: 1.45, transformOrigin: '50% 62%', duration: 3.6, ease: 'power3.in' }, 7)
      .to('.l-sky6, #valley, .rain6', { filter: 'blur(3px)', duration: 3 }, 7.4)
      .to(G, { center: 1, duration: .6 }, 10)
      // collision
      .to('#flash6', { opacity: 1, duration: .35, ease: 'power2.in' }, 10.3)
      .set(['#fL', '#fR', '#orbL', '#orbR'], { opacity: 0 }, 10.65)
      .set('#sunset6', { opacity: 1 }, 10.65)
      .set('.rain6', { opacity: 0 }, 10.65)
      .to(G, { center: 0, hero: 0, rival: 0, duration: .8 }, 10.7)
      .to(b6, { sky: 0, duration: .4 }, 10.5)
      .to('#shock', { scale: 12, opacity: 1, duration: .15 }, 10.4).to('#shock', { opacity: 0, scale: 16, duration: 2.4, ease: 'power2.out' }, 10.55)
      .to('#flash6', { opacity: 0, duration: 2.2, ease: 'power2.out' }, 10.9);
    rocks.forEach((e, i) => {
      const a = (i / rocks.length) * 6.283 + Math.random(), d = (30 + Math.random() * 60);
      tl.fromTo(e, { x: 0, y: 0, opacity: 0, rotation: 0 }, { x: Math.cos(a) * d * vm, y: (Math.sin(a) * d * .8 - 20) * vm, opacity: 1, rotation: Math.random() * 720 - 360, duration: 2.6, ease: 'power2.out' }, 10.4)
        .to(e, { opacity: 0, duration: .9 }, 12.2);
    });
    sparks.forEach((e, i) => {
      const a = Math.random() * 6.283, d = 20 + Math.random() * 70;
      tl.fromTo(e, { x: 0, y: 0, opacity: 0 }, { x: Math.cos(a) * d * vm, y: Math.sin(a) * d * .8 * vm, opacity: 1, duration: 1.4, ease: 'power3.out' }, 10.4)
        .to(e, { opacity: 0, duration: .8 }, 11.6);
    });
    // aftermath
    tl.to('#ch6 .eyebrow', { opacity: 1, duration: .8 }, 12.8);
    reveal(tl, h6c, 13, .04);
    tl.to('#q6', { opacity: 1, duration: 1.3 }, 14.4)
      .to('#d6e', { opacity: 1, duration: 1.4, ease: 'power1.in' }, 18.6);
  }, { total: 20, mode: p => p < .53 ? 'blue' : 'gold' });
  // ambient sky lightning is linked to scroll via b6.sky; reset blur / world state when scrubbing back is handled by tween reversal.

  /* ---------- VII · The Lantern Flame ---------- */
  const h7c = split($('#h7')), h7b = split($('#h7b')); gsap.set(['#q7', '#ch7 .eyebrow'], { opacity: 0 });
  gsap.set('#final7', { autoAlpha: 0 });
  gsap.set('#toTop', { opacity: 0 });
  gsap.set('#w7', { transformOrigin: '60% 85%' });
  chapter('ch7', 560, tl => {
    tl.to('#d7', { opacity: 0, duration: 2 }, 0)
      .to('#sky7b', { opacity: 1, duration: 6 }, .4)
      .fromTo('#sun7', { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 7 }, .6)
      .to('#cityB7', { x: '-8vw', duration: 9 }, 0).to('#cityF7', { x: '-18vw', duration: 9 }, 0)
      .to('#far7', { x: '-3vw', duration: 9 }, 0)
      .to('#ch7 .eyebrow', { opacity: 1, duration: 1 }, 3);
    reveal(tl, h7c, 3.2, .03);
    tl.to('#q7', { opacity: 1, duration: 1.4 }, 5)
      .to('#t7', { opacity: 0, duration: 1.2 }, 8.6)
      // the camera pulls away, revealing the whole village
      .to('#w7', { scale: .62, y: '-4vh', duration: 5, ease: 'power2.inOut' }, 8.8)
      .to('#cityB7', { x: '-2vw', duration: 5 }, 8.8).to('#cityF7', { x: '-4vw', duration: 5 }, 8.8)
      .to('#hero7', { y: '3vh', duration: 5 }, 8.8)
      .to('#final7', { autoAlpha: 1, duration: .5 }, 12);
    reveal(tl, h7b, 12, .07);
    tl.to('#toTop', { opacity: 1, duration: 1 }, 13.4);
  }, { total: 15, mode: () => 'petals', update: p => { $('#toTop').style.pointerEvents = p > .86 ? 'auto' : 'none'; } });
  $('#toTop').addEventListener('click', () => {
    if (window.ScrollToPlugin) gsap.to(window, { scrollTo: 0, duration: reduce ? .01 : 3.2, ease: 'power3.inOut' }); else scrollTo(0, 0);
  });
}

/* ================= boot ================= */
function boot() {
  fxResize(); addEventListener('resize', fxResize);
  buildArt();
  story();
  buildNav(); setActive(0); initCursor();
  gsap.to('#progress i', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: .2 } });
  gsap.ticker.add((time) => {
    fxFrame();
    const t = performance.now();
    for (const b of boltLayers) if (Math.abs(activeIdx - b.chapter) < 1) b.draw(t);
  });
  ScrollTrigger.addEventListener('refresh', () => boltLayers.forEach(b => b.resize()));
  // simplify heavy ambient effects when the tab is hidden
  document.addEventListener('visibilitychange', () => { document.hidden ? gsap.ticker.sleep() : gsap.ticker.wake(); });
  addEventListener('load', () => ScrollTrigger.refresh());
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
