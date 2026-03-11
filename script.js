// ═══════════════════════════
// MOTION PREFERENCE
// ═══════════════════════════
const motionOK = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ═══════════════════════════
// CURSOR — spring physics
// ═══════════════════════════
const cur = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = -100, my = -100, rx = -100, ry = -100, rvx = 0, rvy = 0;

if (motionOK) {
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cur.style.left = mx + 'px'; cur.style.top = my + 'px';
  });

  const stiff = 0.07, damp = 0.74;
  (function tickRing() {
    rvx = (rvx + (mx - rx) * stiff) * damp;
    rvy = (rvy + (my - ry) * stiff) * damp;
    rx += rvx; ry += rvy;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(tickRing);
  })();

  const hoverSel = 'a,button,.btn,.proj-card,.data-card,.sg-tag,.cert-card,.contact-card,.cmd-item,.agent-node';
  document.addEventListener('mouseover', e => { if (e.target.closest(hoverSel)) { cur.classList.add('hover'); ring.classList.add('hover'); } });
  document.addEventListener('mouseout', e => { if (e.target.closest(hoverSel)) { cur.classList.remove('hover'); ring.classList.remove('hover'); } });
}

// ═══════════════════════════
// SCROLL PROGRESS
// ═══════════════════════════
const progBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const h = document.documentElement.scrollHeight - window.innerHeight;
  progBar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
}, { passive: true });

// ═══════════════════════════
// NAV
// ═══════════════════════════
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 50), { passive: true });

// Active link
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
const secObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { threshold: 0.2, rootMargin: '-15% 0px -60% 0px' });
sections.forEach(s => secObs.observe(s));

// Mobile menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  hamburger.classList.remove('open'); mobileMenu.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false'); document.body.style.overflow = '';
}));

// ═══════════════════════════
// COMMAND PALETTE
// ═══════════════════════════
const cmdOverlay = document.getElementById('cmd-overlay');
const cmdInput = document.getElementById('cmd-input');
const cmdResults = document.getElementById('cmd-results');

const actions = [
  { l: 'About', d: 'Who I am', s: '#about' },
  { l: 'Experience', d: 'Work & education', s: '#experience' },
  { l: 'Projects', d: 'What I\'ve built', s: '#projects' },
  { l: 'Skills', d: 'Tech stack', s: '#skills' },
  { l: 'Contact', d: 'Get in touch', s: '#contact' },
  { l: 'Top', d: 'Back to start', s: '#hero' },
  { l: 'Email', d: 'nlnarasimhasai15@gmail.com', u: 'mailto:nlnarasimhasai15@gmail.com' },
  { l: 'GitHub', d: 'sainarne15', u: 'https://github.com/sainarne15' },
  { l: 'LinkedIn', d: 'sainarne15', u: 'https://www.linkedin.com/in/sainarne15/' },
  { l: 'Autonomy', d: 'Flagship project', u: 'https://github.com/sainarne15/Autonomy' },
  { l: 'Azure Cert', d: 'AZ-900 Credly', u: 'https://www.credly.com/badges/e8250dd8-4cc4-42b9-9451-d4c745042ac2/public_url' },
  { l: 'Terraform Cert', d: 'HashiCorp Credly', u: 'https://www.credly.com/badges/2d62f778-fa89-4026-a79b-e935c9426c2e/public_url' },
  { l: 'AWS Cert', d: 'Cloud Practitioner', u: 'https://www.credly.com/badges/510e837c-4f62-4c90-920c-8642f38e2be3/public_url' },
];

let cmdIdx = 0, cmdFiltered = [...actions];

function renderCmd() {
  if (!cmdFiltered.length) { cmdResults.innerHTML = '<div class="cmd-empty">No results</div>'; return; }
  cmdResults.innerHTML = cmdFiltered.map((a, i) =>
    `<div class="cmd-item ${i === cmdIdx ? 'active' : ''}" data-i="${i}">
      <span class="cmd-item-dot"></span>
      <div><span>${a.l}</span><small>${a.d}</small></div>
    </div>`
  ).join('');
  cmdResults.querySelectorAll('.cmd-item').forEach(el => {
    el.addEventListener('click', () => execCmd(cmdFiltered[+el.dataset.i]));
    el.addEventListener('mouseenter', () => { cmdIdx = +el.dataset.i; updateCmdActive(); });
  });
}
function updateCmdActive() {
  cmdResults.querySelectorAll('.cmd-item').forEach((el, i) => el.classList.toggle('active', i === cmdIdx));
  cmdResults.querySelector('.active')?.scrollIntoView({ block: 'nearest' });
}
function execCmd(a) {
  closeCmd();
  if (a.u) window.open(a.u, a.u.startsWith('mailto:') || a.u.startsWith('tel:') ? '_self' : '_blank');
  else if (a.s) document.querySelector(a.s)?.scrollIntoView({ behavior: 'smooth' });
}
function openCmd() {
  cmdOverlay.classList.add('open'); cmdInput.value = '';
  cmdIdx = 0; cmdFiltered = [...actions]; renderCmd();
  setTimeout(() => cmdInput.focus(), 50); document.body.style.overflow = 'hidden';
}
function closeCmd() { cmdOverlay.classList.remove('open'); document.body.style.overflow = ''; }

document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); cmdOverlay.classList.contains('open') ? closeCmd() : openCmd(); }
  if (e.key === 'Escape' && cmdOverlay.classList.contains('open')) closeCmd();
});
cmdInput.addEventListener('input', () => {
  const q = cmdInput.value.toLowerCase().trim();
  cmdFiltered = actions.filter(a => a.l.toLowerCase().includes(q) || a.d.toLowerCase().includes(q));
  cmdIdx = 0; renderCmd();
});
cmdInput.addEventListener('keydown', e => {
  if (e.key === 'ArrowDown') { e.preventDefault(); cmdIdx = (cmdIdx + 1) % cmdFiltered.length; updateCmdActive(); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); cmdIdx = (cmdIdx - 1 + cmdFiltered.length) % cmdFiltered.length; updateCmdActive(); }
  else if (e.key === 'Enter') { e.preventDefault(); if (cmdFiltered[cmdIdx]) execCmd(cmdFiltered[cmdIdx]); }
});
cmdOverlay.addEventListener('click', e => { if (e.target === cmdOverlay) closeCmd(); });
document.getElementById('cmd-trigger').addEventListener('click', openCmd);

// ═══════════════════════════
// SCROLL REVEAL
// ═══════════════════════════
if (motionOK) {
  const revObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revObs.unobserve(e.target); } });
  }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
  document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
}

// ═══════════════════════════
// COUNTER ANIMATION
// ═══════════════════════════
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, t = +el.dataset.target;
    if (motionOK) {
      const start = performance.now(), dur = 1200;
      (function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        el.textContent = Math.round((1 - Math.pow(1 - p, 4)) * t);
        if (p < 1) requestAnimationFrame(tick);
      })(start);
    } else el.textContent = t;
    counterObs.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-target]').forEach(el => counterObs.observe(el));

// ═══════════════════════════
// ROTATING TEXT
// ═══════════════════════════
const rotateEl = document.getElementById('hero-rotate');
const rotateWords = ['intelligent systems.', 'cloud infrastructure.', 'the future.', 'multi-agent AI.'];
let rotateIdx = 0;
if (motionOK) {
  rotateEl.style.transition = 'opacity .3s, transform .3s var(--ease)';
  setInterval(() => {
    rotateEl.style.opacity = '0'; rotateEl.style.transform = 'translateY(6px)';
    setTimeout(() => {
      rotateIdx = (rotateIdx + 1) % rotateWords.length;
      rotateEl.textContent = rotateWords[rotateIdx];
      rotateEl.style.opacity = '1'; rotateEl.style.transform = 'translateY(0)';
    }, 200);
  }, 3000);
}

// ═══════════════════════════
// MAGNETIC BUTTONS
// ═══════════════════════════
if (motionOK) {
  document.querySelectorAll('.magnetic').forEach(btn => {
    const inner = btn.querySelector('.btn-inner');
    if (!inner) return;
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.1}px,${y * 0.1}px)`;
      inner.style.transform = `translate(${x * 0.05}px,${y * 0.05}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transition = 'transform .5s var(--spring)'; btn.style.transform = '';
      inner.style.transition = 'transform .5s var(--spring)'; inner.style.transform = '';
      setTimeout(() => { btn.style.transition = ''; inner.style.transition = ''; }, 500);
    });
  });
}

// ═══════════════════════════
// CARD SPOTLIGHT EFFECT
// ═══════════════════════════
if (motionOK) {
  const spotSel = '.proj-card,.data-card,.tl-card,.skill-group,.contact-card,.edu-card';
  document.addEventListener('mousemove', e => {
    document.querySelectorAll(spotSel).forEach(card => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      card.style.setProperty('--spot-x', x + '%');
      card.style.setProperty('--spot-y', y + '%');
    });
  });
}

// ═══════════════════════════
// SMOOTH SCROLL
// ═══════════════════════════
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(a.getAttribute('href'))?.scrollIntoView({ behavior: motionOK ? 'smooth' : 'auto' });
  });
});

// ═══════════════════════════
// FULL-PAGE NEURAL NETWORK CANVAS
// Living, breathing neural network background
// ═══════════════════════════
const canvas = document.getElementById('neural-bg');
const ctx = canvas.getContext('2d');
const dpr = Math.min(window.devicePixelRatio || 1, 2);
let nodes = [], W, H, animId;

const CYAN = { r: 0, g: 240, b: 255 };
const AMBER = { r: 255, g: 184, b: 0 };

function resize() {
  W = window.innerWidth; H = window.innerHeight;
  canvas.width = W * dpr; canvas.height = H * dpr;
  canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

class Node {
  constructor() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.18;
    this.vy = (Math.random() - 0.5) * 0.18;
    this.r = Math.random() * 1.2 + 0.4;
    this.o = Math.random() * 0.25 + 0.05;
    this.isAmber = Math.random() > 0.88;
    // Pulse phase for breathing effect
    this.phase = Math.random() * Math.PI * 2;
    this.pulseSpeed = 0.005 + Math.random() * 0.01;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
    this.phase += this.pulseSpeed;
    this.currentO = this.o * (0.6 + 0.4 * Math.sin(this.phase));
  }
  draw() {
    const c = this.isAmber ? AMBER : CYAN;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${this.currentO})`;
    ctx.fill();
  }
}

function initNodes() {
  const area = W * H;
  const count = motionOK ? Math.min(Math.floor(area / 18000), 60) : 0;
  nodes = Array.from({ length: count }, () => new Node());
}

let nmx = -999, nmy = -999;
document.addEventListener('mousemove', e => { nmx = e.clientX; nmy = e.clientY; });

function drawFrame() {
  ctx.clearRect(0, 0, W, H);

  // Scroll-based vertical offset for parallax feel
  const scrollRatio = window.scrollY / (document.documentElement.scrollHeight - H || 1);

  // Ambient glows that shift with scroll
  const g1 = ctx.createRadialGradient(W * 0.2, H * (0.3 - scrollRatio * 0.2), 0, W * 0.2, H * (0.3 - scrollRatio * 0.2), W * 0.4);
  g1.addColorStop(0, 'rgba(0,240,255,0.015)');
  g1.addColorStop(1, 'transparent');
  ctx.fillStyle = g1;
  ctx.fillRect(0, 0, W, H);

  const g2 = ctx.createRadialGradient(W * 0.8, H * (0.7 + scrollRatio * 0.1), 0, W * 0.8, H * (0.7 + scrollRatio * 0.1), W * 0.3);
  g2.addColorStop(0, 'rgba(255,184,0,0.008)');
  g2.addColorStop(1, 'transparent');
  ctx.fillStyle = g2;
  ctx.fillRect(0, 0, W, H);

  // Update nodes
  for (const n of nodes) { n.update(); n.draw(); }

  // Connections
  const maxDist = 100;
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < maxDist) {
        const opacity = (1 - dist / maxDist) * 0.06;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.strokeStyle = `rgba(0,240,255,${opacity})`;
        ctx.lineWidth = 0.4;
        ctx.stroke();
      }
    }
  }

  // Mouse synapses — cyan lines to cursor
  if (nmx > 0) {
    for (const n of nodes) {
      const dx = n.x - nmx, dy = n.y - nmy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 130) {
        const opacity = (1 - dist / 130) * 0.15;
        ctx.beginPath();
        ctx.moveTo(n.x, n.y);
        ctx.lineTo(nmx, nmy);
        ctx.strokeStyle = `rgba(0,240,255,${opacity})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }

  animId = requestAnimationFrame(drawFrame);
}

resize();
initNodes();
if (motionOK) drawFrame();

window.addEventListener('resize', () => { resize(); initNodes(); });

// ═══════════════════════════
// HERO TERMINAL — auto-start
// ═══════════════════════════
if (document.getElementById('term-body')) {
  const termObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { startTerminal(); termObs.disconnect(); }
  }, { threshold: 0.3 });
  termObs.observe(document.getElementById('hero-visual') || document.getElementById('term-body'));
}

// ═══════════════════════════
// TERMINAL — boot sequence + interactive shell
// ═══════════════════════════
let termStarted = false;
function startTerminal() {
  if (termStarted) return;
  termStarted = true;
  const body = document.getElementById('term-body');
  const inputRow = document.getElementById('term-input-row');
  const input = document.getElementById('term-input');
  if (!body) return;

  const bootLines = [
    { type: 'output', text: 'Initializing Autonomy v2.1...', delay: 400 },
    { type: 'success', text: '[OK] LangGraph runtime loaded', delay: 300 },
    { type: 'success', text: '[OK] LiteLLM provider connected', delay: 250 },
    { type: 'success', text: '[OK] E2B sandbox ready', delay: 200 },
    { type: 'output', text: '', delay: 100 },
    { type: 'amber', text: '> Dispatching agents...', delay: 500 },
    { type: 'success', text: '  [1/9] Orchestrator ........ ONLINE', delay: 200 },
    { type: 'success', text: '  [2/9] Planner ............. ONLINE', delay: 150 },
    { type: 'success', text: '  [3/9] Backend ............. ONLINE', delay: 150 },
    { type: 'success', text: '  [4/9] Frontend ............ ONLINE', delay: 150 },
    { type: 'success', text: '  [5/9] Database ............ ONLINE', delay: 120 },
    { type: 'success', text: '  [6/9] QA .................. ONLINE', delay: 120 },
    { type: 'success', text: '  [7/9] Reviewer ............ ONLINE', delay: 120 },
    { type: 'success', text: '  [8/9] Git ................. ONLINE', delay: 120 },
    { type: 'success', text: '  [9/9] DevOps .............. ONLINE', delay: 120 },
    { type: 'output', text: '', delay: 150 },
    { type: 'success', text: '✓ All 9 agents operational. System ready.', delay: 300 },
    { type: 'output', text: '', delay: 100 },
    { type: 'output', text: 'Type "help" for available commands.', delay: 200 },
  ];

  function appendLine(type, text) {
    const div = document.createElement('div');
    div.className = 'term-line';
    if (type === 'cmd') div.innerHTML = `<span class="term-prompt">$</span> <span class="term-cmd">${text}</span>`;
    else if (type === 'success') div.innerHTML = `<span class="term-success">${text}</span>`;
    else if (type === 'amber') div.innerHTML = `<span class="term-amber">${text}</span>`;
    else if (type === 'cyan') div.innerHTML = `<span class="term-cmd">${text}</span>`;
    else div.innerHTML = `<span class="term-output">${text}</span>`;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
  }

  // Boot sequence
  let bi = 0;
  function bootTick() {
    if (bi >= bootLines.length) {
      enableShell();
      return;
    }
    const l = bootLines[bi];
    appendLine(l.type, l.text);
    bi++;
    setTimeout(bootTick, l.delay);
  }
  setTimeout(bootTick, 500);

  // Interactive shell
  const cmdHistory = [];
  let histIdx = -1;

  // Obfuscated data (ROT13 + reverse)
  const _r13 = s => s.replace(/[a-zA-Z]/g, c => {
    const b = c <= 'Z' ? 65 : 97;
    return String.fromCharCode(((c.charCodeAt(0) - b + 13) % 26) + b);
  });
  const _rv = s => s.split('').reverse().join('');
  const _k = _r13(_rv('nlanenF'));

  const shellCmds = {
    help: () => [
      { t: 'amber', v: 'Available commands:' },
      { t: 'output', v: '' },
      { t: 'success', v: '  about        — Who I am' },
      { t: 'success', v: '  skills       — Tech stack' },
      { t: 'success', v: '  experience   — Work history' },
      { t: 'success', v: '  projects     — What I\'ve built' },
      { t: 'success', v: '  contact      — Get in touch' },
      { t: 'success', v: '  certs        — Certifications' },
      { t: 'success', v: '  autonomy     — About the flagship project' },
      { t: 'success', v: '  clear        — Clear terminal' },
      { t: 'output', v: '' },
      { t: 'output', v: '  ...and maybe some hidden ones.' },
    ],
    about: () => [
      { t: 'amber', v: '> cat about.txt' },
      { t: 'output', v: '' },
      { t: 'output', v: '  Sai Narne' },
      { t: 'output', v: '  Software Engineer | MS CS, University of Houston' },
      { t: 'output', v: '' },
      { t: 'output', v: '  I build systems at the intersection of AI, cloud,' },
      { t: 'output', v: '  and full-stack development. I believe the best' },
      { t: 'output', v: '  software is built by systems that think in layers.' },
    ],
    skills: () => [
      { t: 'amber', v: '> ls ~/skills/' },
      { t: 'output', v: '' },
      { t: 'success', v: '  Languages   Python, Java, C#, C++, JavaScript, R' },
      { t: 'success', v: '  Web         React, TypeScript, ASP.NET Core, FastAPI' },
      { t: 'success', v: '  Cloud       AWS, Azure, GCP, Terraform, Docker' },
      { t: 'success', v: '  AI/ML       LangGraph, LiteLLM, NLP, Neural Networks' },
      { t: 'success', v: '  Data        BigQuery, SQL, Airflow, Firestore' },
    ],
    experience: () => [
      { t: 'amber', v: '> git log --oneline career' },
      { t: 'output', v: '' },
      { t: 'success', v: '  2023  Teaching Assistant — University of Houston' },
      { t: 'success', v: '  2022  Research Assistant — University of Houston' },
      { t: 'success', v: '  2021  Programmer Analyst Trainee — Cognizant' },
      { t: 'success', v: '  2020  ML Intern — Cognibot' },
    ],
    projects: () => [
      { t: 'amber', v: '> find ~/projects -type d' },
      { t: 'output', v: '' },
      { t: 'success', v: '  Autonomy                Multi-agent AI dev system' },
      { t: 'success', v: '  Return Order Mgmt       4 microservices at Cognizant' },
      { t: 'success', v: '  Feedback Analysis       LSTM sentiment analysis' },
      { t: 'success', v: '  Image Processing        15+ CV algorithms' },
      { t: 'success', v: '  RoleFit Resume          AI resume analyzer (LIVE)' },
      { t: 'success', v: '  Cricbuzz Pipeline        GCP data engineering' },
      { t: 'success', v: '  Fuel Rate Prediction    ASP.NET full-stack' },
    ],
    contact: () => [
      { t: 'amber', v: '> cat ~/.contact' },
      { t: 'output', v: '' },
      { t: 'success', v: '  Email     nlnarasimhasai15@gmail.com' },
      { t: 'success', v: '  GitHub    github.com/sainarne15' },
      { t: 'success', v: '  LinkedIn  linkedin.com/in/sainarne15' },
    ],
    certs: () => [
      { t: 'amber', v: '> cat ~/certifications.json' },
      { t: 'output', v: '' },
      { t: 'success', v: '  [1] Azure Fundamentals (AZ-900)' },
      { t: 'success', v: '  [2] Terraform Associate (HashiCorp)' },
      { t: 'success', v: '  [3] AWS Cloud Practitioner' },
    ],
    autonomy: () => [
      { t: 'amber', v: '> autonomy --info' },
      { t: 'output', v: '' },
      { t: 'output', v: '  9 AI agents collaborate to turn a single sentence' },
      { t: 'output', v: '  into a fully built, tested, and deployed app.' },
      { t: 'output', v: '' },
      { t: 'success', v: '  Stack: Python, LangGraph, React, TypeScript' },
      { t: 'success', v: '         LiteLLM, E2B, Firestore, GCP' },
      { t: 'output', v: '' },
      { t: 'output', v: '  github.com/sainarne15/Autonomy' },
    ],
    whoami: () => [{ t: 'success', v: 'sai@portfolio' }],
    pwd: () => [{ t: 'success', v: '/home/sai/portfolio' }],
    date: () => [{ t: 'success', v: '  ' + new Date().toString() }],
    uptime: () => [{ t: 'success', v: '  ' + Math.floor(performance.now() / 1000) + 's since page load' }],
    echo: (args) => [{ t: 'output', v: '  ' + args }],
    sudo: () => [{ t: 'amber', v: '  Nice try. Access denied.' }],
    neofetch: () => [
      { t: 'output', v: '' },
      { t: 'cyan', v: '   ███████╗ ███╗   ██╗' },
      { t: 'cyan', v: '   ██╔════╝ ████╗  ██║' },
      { t: 'cyan', v: '   ███████╗ ██╔██╗ ██║    sai@portfolio' },
      { t: 'cyan', v: '   ╚════██║ ██║╚██╗██║    OS: Neural Mission Control' },
      { t: 'cyan', v: '   ███████║ ██║ ╚████║    Shell: custom-js' },
      { t: 'cyan', v: '   ╚══════╝ ╚═╝  ╚═══╝    Uptime: since you got here' },
      { t: 'output', v: '' },
    ],
  };

  function processCmd(raw) {
    const trimmed = raw.trim().toLowerCase();
    const parts = trimmed.split(/\s+/);
    const cmd = parts[0];
    const args = raw.trim().slice(cmd.length).trim();

    if (!cmd) return [];
    if (cmd === 'clear') return 'CLEAR';

    // Hidden: check against obfuscated key
    if (raw.trim().toLowerCase() === _k.toLowerCase()) {
      return [
        { t: 'output', v: '' },
        { t: 'amber', v: '  ♥' },
        { t: 'output', v: '' },
        { t: 'output', v: '  The most important person in my world.' },
        { t: 'output', v: '  Everything I build, I build for us.' },
        { t: 'output', v: '' },
        { t: 'amber', v: '  — forever and always.' },
        { t: 'output', v: '' },
      ];
    }

    if (shellCmds[cmd]) return shellCmds[cmd](args);
    return [{ t: 'amber', v: `  command not found: ${cmd}. Try "help"` }];
  }

  function enableShell() {
    if (!inputRow || !input) return;
    inputRow.style.display = 'flex';
    input.focus();

    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const val = input.value;
        input.value = '';
        if (val.trim()) cmdHistory.unshift(val);
        histIdx = -1;

        appendLine('cmd', val);
        const result = processCmd(val);
        if (result === 'CLEAR') {
          body.innerHTML = '';
        } else {
          result.forEach(r => appendLine(r.t, r.v));
        }
        body.scrollTop = body.scrollHeight;
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (histIdx < cmdHistory.length - 1) { histIdx++; input.value = cmdHistory[histIdx]; }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (histIdx > 0) { histIdx--; input.value = cmdHistory[histIdx]; }
        else { histIdx = -1; input.value = ''; }
      }
    });

    // Click anywhere in terminal to focus input
    body.parentElement.addEventListener('click', () => input.focus());
  }
}

// ═══════════════════════════
// KONAMI CODE EASTER EGG
// ═══════════════════════════
const konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let ki = 0;
document.addEventListener('keydown', e => {
  if (e.key === konami[ki]) { ki++; if (ki === konami.length) { ki = 0; easterEgg(); } } else ki = 0;
});
function easterEgg() {
  document.documentElement.style.setProperty('--cyan', '#ff4444');
  document.documentElement.style.setProperty('--cyan-rgb', '255,68,68');
  document.documentElement.style.setProperty('--amber', '#44ff44');
  document.documentElement.style.setProperty('--amber-rgb', '68,255,68');
}

// ═══════════════════════════
// EASTER EGG: SECRET COMMANDS
// ═══════════════════════════
const secretCmds = [
  { l: 'Matrix', d: 'Take the red pill', secret: true },
  { l: 'Party', d: 'Time to celebrate', secret: true },
  { l: 'Hack', d: 'Access granted', secret: true },
  { l: 'Reset', d: 'Back to normal', secret: true },
];

// Patch the command palette search to include secrets
const origInputHandler = cmdInput.oninput;
cmdInput.addEventListener('input', () => {
  const q = cmdInput.value.toLowerCase().trim();
  const matched = secretCmds.filter(a => a.l.toLowerCase() === q);
  if (matched.length) {
    cmdFiltered = [...cmdFiltered, ...matched];
    renderCmd();
  }
});

// Override execCmd to handle secrets
const _origExecCmd = execCmd;
execCmd = function(a) {
  if (a.secret) {
    closeCmd();
    if (a.l === 'Matrix') matrixMode();
    else if (a.l === 'Party') partyMode();
    else if (a.l === 'Hack') hackMode();
    else if (a.l === 'Reset') resetTheme();
    return;
  }
  _origExecCmd(a);
};

function matrixMode() {
  const mc = document.createElement('canvas');
  mc.id = 'matrix-rain';
  mc.style.cssText = 'position:fixed;inset:0;z-index:9998;pointer-events:none;opacity:0;transition:opacity 1s';
  document.body.appendChild(mc);
  requestAnimationFrame(() => mc.style.opacity = '0.7');

  const mctx = mc.getContext('2d');
  mc.width = window.innerWidth; mc.height = window.innerHeight;
  const cols = Math.floor(mc.width / 14);
  const drops = Array(cols).fill(1);
  const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789';

  const matrixId = setInterval(() => {
    mctx.fillStyle = 'rgba(0,0,0,0.05)';
    mctx.fillRect(0, 0, mc.width, mc.height);
    mctx.fillStyle = '#0f0';
    mctx.font = '12px monospace';
    for (let i = 0; i < drops.length; i++) {
      mctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * 14, drops[i] * 14);
      if (drops[i] * 14 > mc.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }, 40);

  setTimeout(() => {
    mc.style.opacity = '0';
    setTimeout(() => { clearInterval(matrixId); mc.remove(); }, 1000);
  }, 8000);
}

function partyMode() {
  const colors = ['#ff0055','#00f0ff','#ffb800','#00ff88','#aa44ff','#ff4444','#44ff44'];
  let pi = 0;
  const partyId = setInterval(() => {
    const c = colors[pi % colors.length];
    document.documentElement.style.setProperty('--cyan', c);
    const hex = c.replace('#','');
    const r = parseInt(hex.substr(0,2),16), g = parseInt(hex.substr(2,2),16), b = parseInt(hex.substr(4,2),16);
    document.documentElement.style.setProperty('--cyan-rgb', `${r},${g},${b}`);
    pi++;
  }, 200);

  setTimeout(() => { clearInterval(partyId); resetTheme(); }, 6000);
}

function hackMode() {
  document.documentElement.style.setProperty('--cyan', '#00ff41');
  document.documentElement.style.setProperty('--cyan-rgb', '0,255,65');
  document.documentElement.style.setProperty('--amber', '#00ff41');
  document.documentElement.style.setProperty('--amber-rgb', '0,255,65');
  document.documentElement.style.setProperty('--text', '#00ff41');
  document.documentElement.style.setProperty('--text2', 'rgba(0,255,65,0.7)');
  document.documentElement.style.setProperty('--bg', '#000000');
  document.body.style.fontFamily = '"Courier New", monospace';

  setTimeout(resetTheme, 8000);
}

function resetTheme() {
  const props = ['--cyan','--cyan-rgb','--amber','--amber-rgb','--text','--text2','--bg'];
  props.forEach(p => document.documentElement.style.removeProperty(p));
  document.body.style.fontFamily = '';
}

// ═══════════════════════════
// EASTER EGG: CONSOLE MESSAGE
// ═══════════════════════════
console.log(
  '%c\n' +
  '   ╔══════════════════════════════════════╗\n' +
  '   ║                                      ║\n' +
  '   ║   Hey, you opened the console.       ║\n' +
  '   ║   I like that. You\'re curious.       ║\n' +
  '   ║                                      ║\n' +
  '   ║   Zero dependencies.                 ║\n' +
  '   ║   Pure HTML, CSS & JS.               ║\n' +
  '   ║   Every pixel, intentional.          ║\n' +
  '   ║                                      ║\n' +
  '   ║   Try Ctrl+K and type "matrix"       ║\n' +
  '   ║                                      ║\n' +
  '   ║   — Sai Narne                        ║\n' +
  '   ║                                      ║\n' +
  '   ╚══════════════════════════════════════╝\n',
  'color: #00f0ff; font-size: 13px; font-family: monospace; line-height: 1.4;'
);
console.log(
  '%cLooking for the source? It\'s all right here — no build step, no bundler, no secrets.',
  'color: #ffb800; font-size: 11px; font-family: monospace;'
);
