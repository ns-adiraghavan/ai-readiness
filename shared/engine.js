// ─────────────────────────────────────────────────────────────────────────────
// ASSESSMENT ENGINE — shared across all industry variants
// window.INDUSTRY_KEY must be set before this script loads
// ─────────────────────────────────────────────────────────────────────────────

(function() {
  const cfg = window.INDUSTRY_CONFIGS[window.INDUSTRY_KEY || 'base'];

  // ── Intro card ──────────────────────────────────────────────────────────────
  const introCard = document.getElementById('intro-card');
  if (introCard) {
    introCard.innerHTML = `
      <div class="badge">${cfg.badgeText}</div>
      <h1 class="intro-h1">${cfg.heroHeadline}?<span class="red-dot"></span></h1>
      <p class="intro-sub">${cfg.heroSub}</p>
      <div class="meta-strip">
        <div class="meta-item"><div class="meta-label">Questions</div><div class="meta-val">10</div></div>
        <div class="meta-item"><div class="meta-label">Dimensions</div><div class="meta-val">7</div></div>
        <div class="meta-item"><div class="meta-label">Time</div><div class="meta-val">3 min</div></div>
      </div>
      <div class="dim-list">
        ${cfg.dimNames.map((n,i) => `
          <div class="dim-chip" ${i===6?'style="grid-column:span 2"':''}>
            <div class="dim-chip-num">${i+1}</div>
            <div class="dim-chip-name">${n}</div>
          </div>`).join('')}
      </div>
      <button class="btn-primary full" onclick="startAssessment()">Start the benchmark →</button>`;
  }

  // ── Question screens (5 screens, 2 questions each) ──────────────────────────
  const qs = cfg.questions;
  const screens = [
    { label: cfg.dimNames[0], mixed:false, questions:[{...qs[0],idx:0},{...qs[1],idx:1}] },
    { label: cfg.dimNames[1], mixed:false, questions:[{...qs[2],idx:2},{...qs[3],idx:3}] },
    { label: cfg.dimNames[2], mixed:false, questions:[{...qs[4],idx:4},{...qs[5],idx:5}] },
    { label: cfg.dimNames[3]+' & '+cfg.dimNames[4], mixed:true, questions:[{...qs[6],idx:6},{...qs[7],idx:7}] },
    { label: cfg.dimNames[5]+' & '+cfg.dimNames[6], mixed:true, questions:[{...qs[8],idx:8},{...qs[9],idx:9}] },
  ];

  const scaleOpts = [
    {v:1,lbl:"Not in place"},
    {v:2,lbl:"Early stages"},
    {v:3,lbl:"In progress"},
    {v:4,lbl:"Well established"},
    {v:5,lbl:"Fully embedded"},
  ];

  const stages = [
    {n:1,name:"Exploring", color:"#C9252B",bg:"#FFF0F0",desc:"AI is on the agenda but foundational readiness is limited. Prioritise strategic clarity, data quality, and basic governance before further investment."},
    {n:2,name:"Building",  color:"#D97706",bg:"#FFFBEB",desc:"Structure is forming but critical gaps remain in data foundation, governance, and operational integration. Address these before scaling."},
    {n:3,name:"Scaling",   color:"#005F86",bg:"#E8F4F8",desc:"AI is working in specific areas. The challenge is systematic expansion — embedding AI across the business with consistent governance and operational discipline."},
    {n:4,name:"Leading",   color:"#2C3E7A",bg:"#EEF0FB",desc:"AI is a competitive differentiator. Focus shifts to governance sophistication, continuous improvement, and ecosystem leadership."},
  ];

  const dimQCount = [2,2,2,1,1,1,1];

  let cur = 0;
  let answers = new Array(10).fill(0);

  function show(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    window.scrollTo(0, 0);
  }

  window.startAssessment = function() {
    cur = 0;
    answers = new Array(10).fill(0);
    renderScreen();
    show('s-questions');
  };

  function renderScreen() {
    const s = screens[cur];
    document.getElementById('prog-label').textContent = `Screen ${cur+1} of 5`;
    document.getElementById('prog-dim-label').textContent = s.label;
    document.getElementById('prog-fill').style.width = `${((cur+1)/5)*100}%`;

    const card = document.getElementById('q-card');
    card.innerHTML = '';

    // Dimension header (for non-mixed screens)
    if (!s.mixed) {
      const q = s.questions[0];
      card.innerHTML += `
        <div class="screen-dim-header">
          <div class="screen-dim-tag">
            <div class="dim-circle">${q.dim}</div>
            <span class="dim-title">${q.dimName}</span>
          </div>
        </div>`;
    }

    // Question blocks
    s.questions.forEach((q, qi) => {
      const isLast = qi === s.questions.length - 1;
      card.innerHTML += `
        <div class="question-block${isLast?' last':''}">
          ${s.mixed ? `<div class="q-dim-mini"><div class="q-dim-mini-circle">${q.dim}</div><span class="q-dim-mini-name">${q.dimName}</span></div>` : ''}
          <p class="q-text">${q.text}</p>
          <div class="scale-h" id="scale-${qi}">
            ${scaleOpts.map(opt => `
              <div class="scale-h-opt ${answers[q.idx]===opt.v?'sel':''}" onclick="pick(${qi},${opt.v},${q.idx})">
                <div class="scale-h-num">${opt.v}</div>
                <div class="scale-h-lbl">${opt.lbl}</div>
              </div>`).join('')}
          </div>
        </div>`;
    });

    const bothAnswered = s.questions.every(q => answers[q.idx] > 0);
    card.innerHTML += `
      <div class="nav">
        <button class="btn-back" style="visibility:${cur===0?'hidden':'visible'}" onclick="prevScreen()">← Back</button>
        <button class="btn-primary" id="btn-next" onclick="nextScreen()" ${bothAnswered?'':'disabled'}>
          ${cur===4 ? 'See results →' : 'Next →'}
        </button>
      </div>`;
  }

  window.pick = function(qi, val, idx) {
    answers[idx] = val;
    document.getElementById(`scale-${qi}`).querySelectorAll('.scale-h-opt').forEach((el, i) => {
      el.classList.toggle('sel', scaleOpts[i].v === val);
    });
    document.getElementById('btn-next').disabled =
      !screens[cur].questions.every(q => answers[q.idx] > 0);
  };

  window.nextScreen = function() {
    if (cur < 4) { cur++; renderScreen(); } else { show('s-gate'); }
  };
  window.prevScreen = function() {
    if (cur > 0) { cur--; renderScreen(); }
  };

  window.submitGate = function() {
    const name  = document.getElementById('f-name').value.trim();
    const email = document.getElementById('f-email').value.trim();
    if (!name || !email) { alert('Please enter your name and email to continue.'); return; }

    // Scoring
    const dimRaw = [
      answers[0]+answers[1],
      answers[2]+answers[3],
      answers[4]+answers[5],
      answers[6], answers[7], answers[8], answers[9],
    ];
    const total = dimRaw.reduce((a,b) => a+b, 0);
    const si    = total<=20?0 : total<=30?1 : total<=40?2 : 3;
    const stage = stages[si];
    // Normalise to /10 (single-question dims ×2)
    const dimNorm = dimRaw.map((v,i) => dimQCount[i]===2 ? v : v*2);

    // Stage box
    const sb = document.getElementById('stage-box');
    sb.style.background = stage.bg;
    sb.innerHTML = `
      <div class="stage-eyebrow" style="color:${stage.color}">Your AI Readiness Stage</div>
      <div class="stage-big" style="color:${stage.color}">Stage ${stage.n}</div>
      <div class="stage-name" style="color:${stage.color}">${stage.name}</div>
      <div class="stage-score">Score: ${total} / 50</div>
      <div class="stage-desc" style="color:#555">${stage.desc}</div>`;

    // Dimension bars
    const dr = document.getElementById('dim-rows');
    dr.innerHTML = '';
    dimNorm.forEach((v, i) => {
      const pct = (v/10)*100;
      const c   = v<=4?'#C9252B' : v<=6?'#D97706' : '#005F86';
      dr.innerHTML += `
        <div class="dim-row">
          <div class="dim-row-label">${cfg.dimNames[i]}</div>
          <div class="dim-bar-wrap"><div class="dim-bar" style="width:${pct}%;background:${c}"></div></div>
          <div class="dim-val" style="color:${c}">${v}/10</div>
        </div>`;
    });

    // Top 2 gaps
    const sorted = dimNorm.map((v,i) => ({v,i})).sort((a,b) => a.v-b.v);
    const gb = document.getElementById('gap-blocks');
    gb.innerHTML = '';
    sorted.slice(0,2).forEach(({v,i}) => {
      gb.innerHTML += `
        <div class="gap-block">
          <div class="gap-tag">Priority gap — ${cfg.dimNames[i]} (${v}/10)</div>
          <div class="gap-text">${cfg.gapMessages[i]}</div>
        </div>`;
    });

    show('s-results');
  };
})();
