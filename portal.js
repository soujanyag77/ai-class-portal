(function (global) {
  const STORE_KEY = "ai_classroom_portal_v1";

  const BADGE_CATALOG = [
    { id: "c7_detective", icon: "🕵️", title: "AI Detective (C7)", desc: "Scored 6+ in Is it AI?" },
    { id: "c7_predictor", icon: "🔮", title: "Pattern Hunter (C7)", desc: "Solved Train & Predict" },
    { id: "c7_pixel", icon: "🎨", title: "Pixel Master (C7)", desc: "Completed a Mystery Picture" },
    { id: "c7_trainer", icon: "🧠", title: "Robot Teacher (C7)", desc: "Evaluated your own ML model" },
    { id: "c7_builder", icon: "🤖", title: "Robot Maker (C7)", desc: "Woke up the AI Robot" },
    { id: "c7_doodle", icon: "✏️", title: "Doodle Duelist (C7)", desc: "Played Doodle Studio" },
    { id: "c9_strategist", icon: "🎯", title: "Arena Strategist (C9)", desc: "Completed a Class 9 Battle" },
    { id: "c9_ml", icon: "🧪", title: "ML Engineer (C9)", desc: "Finished the 4-step ML Lab" },
    { id: "c9_ethics", icon: "⚖️", title: "Ethics Guardian (C9)", desc: "Nailed an Ethics fix" },
    { id: "c9_pyq", icon: "🌍", title: "SDG & Data Ace (C9)", desc: "Mastered SDGs & Data Literacy" },
    { id: "c9_nlp_cv", icon: "🔢", title: "Math & Cycle Pro (C9)", desc: "Solved Math for AI & Project Cycle" },
    { id: "c9_boss", icon: "✨", title: "GenAI Creator (C9)", desc: "Completed Generative AI Studio" },
    { id: "all_class", icon: "🙋", title: "Whole-Class Hero", desc: "Used Student Picker or Class Poll" }
  ];

  const defaultState = () => ({
    sound: true,
    theme: "auto",
    c7Stars: 0,
    c9Games: 0,
    c9Best: 0,
    badges: [],
    rosters: {
      "7": { count: 35, names: [], picked: [], noRepeat: true },
      "9": { count: 35, names: [], picked: [], noRepeat: true }
    },
    history: []
  });

  function loadState() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      const def = defaultState();
      return {
        ...def,
        ...parsed,
        rosters: {
          "7": { ...def.rosters["7"], ...(parsed.rosters && parsed.rosters["7"]) },
          "9": { ...def.rosters["9"], ...(parsed.rosters && parsed.rosters["9"]) }
        }
      };
    } catch (_) {
      return defaultState();
    }
  }

  function saveState(st) {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(st));
    } catch (_) {}
  }

  let state = loadState();

  function applyTheme() {
    const root = document.documentElement;
    if (state.theme === "dark" || state.theme === "light") {
      root.setAttribute("data-theme", state.theme);
    } else {
      root.removeAttribute("data-theme");
    }
    const btn = document.getElementById("p-theme-btn");
    if (btn) {
      btn.textContent = state.theme === "dark" ? "🌙 Dark" : state.theme === "light" ? "☀️ Light" : "🌓 Auto";
    }
  }

  function toggleTheme() {
    const order = ["auto", "light", "dark"];
    state.theme = order[(order.indexOf(state.theme) + 1) % order.length];
    saveState(state);
    applyTheme();
  }

  /* ---------- Web Audio Sound Engine ---------- */
  let actx = null;
  function getCtx() {
    if (!state.sound) return null;
    if (!actx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) actx = new AC();
    }
    if (actx && actx.state === "suspended") actx.resume().catch(() => {});
    return actx;
  }

  function tone(freq, dur, type = "sine", vol = 0.12, delay = 0) {
    const c = getCtx();
    if (!c) return;
    const now = c.currentTime + delay;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, now);
    g.gain.setValueAtTime(0.001, now);
    g.gain.exponentialRampToValueAtTime(vol, now + 0.015);
    g.gain.exponentialRampToValueAtTime(0.001, now + dur);
    o.connect(g);
    g.connect(c.destination);
    o.start(now);
    o.stop(now + dur + 0.02);
  }

  const SFX = {
    pop() { tone(540, 0.08, "triangle", 0.1); },
    tick() { tone(880, 0.04, "square", 0.04); },
    spin() { tone(420 + Math.random() * 280, 0.05, "triangle", 0.07); },
    good() {
      tone(523.25, 0.12, "triangle", 0.14, 0);
      tone(659.25, 0.12, "triangle", 0.14, 0.08);
      tone(783.99, 0.22, "triangle", 0.15, 0.16);
    },
    bad() {
      tone(240, 0.16, "sawtooth", 0.09, 0);
      tone(175, 0.26, "sawtooth", 0.09, 0.12);
    },
    box() {
      [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.14, "sine", 0.12, i * 0.07));
    },
    win() {
      [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5].forEach((f, i) =>
        tone(f, i === 5 ? 0.35 : 0.13, "triangle", 0.15, i * 0.1)
      );
    }
  };

  function toggleSound() {
    state.sound = !state.sound;
    saveState(state);
    const btn = document.getElementById("p-sound-btn");
    if (btn) btn.textContent = state.sound ? "🔊 Sound" : "🔇 Muted";
    if (state.sound) SFX.pop();
  }

  /* ---------- UI Effects ---------- */
  function confetti(n = 28, set = ["🎉", "⭐", "✨", "🎈"]) {
    for (let i = 0; i < n; i++) {
      const s = document.createElement("span");
      s.className = "fly";
      s.textContent = set[(Math.random() * set.length) | 0];
      s.style.left = Math.random() * 100 + "vw";
      s.style.animationDuration = 1.4 + Math.random() * 1.6 + "s";
      s.style.fontSize = 18 + Math.random() * 22 + "px";
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 3200);
    }
  }

  let toastTimer = null;
  function toast(msg) {
    let el = document.getElementById("p-toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "p-toast";
      el.className = "p-toast";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.display = "block";
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.style.display = "none"; }, 2600);
  }

  function unlockBadge(id) {
    if (!state.badges.includes(id)) {
      state.badges.push(id);
      saveState(state);
      const b = BADGE_CATALOG.find(x => x.id === id);
      if (b) {
        SFX.box();
        toast(`🏅 Badge Unlocked: ${b.icon} ${b.title}!`);
      }
    }
  }

  function addC7Stars(n) {
    state.c7Stars = Math.max(0, (state.c7Stars || 0) + n);
    saveState(state);
  }

  function recordC9Match(name0, s0, name1, s1) {
    state.c9Games = (state.c9Games || 0) + 1;
    state.c9Best = Math.max(state.c9Best || 0, s0, s1);
    const winner = s0 === s1 ? "Tie" : s0 > s1 ? name0 : name1;
    state.history.unshift({
      cls: "Class 9",
      summary: `${name0} ${s0} – ${s1} ${name1} (${winner})`,
      at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    });
    state.history = state.history.slice(0, 8);
    saveState(state);
  }

  function recordC9Quest(summary, topScore = 0) {
    state.c9Games = (state.c9Games || 0) + 1;
    state.c9Best = Math.max(state.c9Best || 0, topScore);
    state.history.unshift({
      cls: "Class 9 · PYQ Quest",
      summary,
      at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    });
    state.history = state.history.slice(0, 8);
    saveState(state);
  }

  function recordC7Milestone(summary) {
    state.history.unshift({
      cls: "Class 7",
      summary,
      at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    });
    state.history = state.history.slice(0, 8);
    saveState(state);
  }

  /* ---------- Modal Scaffolding ---------- */
  function ensureModal() {
    let bg = document.getElementById("p-modal-bg");
    if (!bg) {
      bg = document.createElement("div");
      bg.id = "p-modal-bg";
      bg.className = "p-modal-bg hide";
      bg.innerHTML = `<div class="p-modal" id="p-modal"></div>`;
      bg.addEventListener("click", (e) => {
        if (e.target === bg) closeModal();
      });
      document.body.appendChild(bg);
    }
    return bg;
  }

  function closeModal() {
    const bg = document.getElementById("p-modal-bg");
    if (bg) bg.classList.add("hide");
  }

  /* ---------- Classroom Student Picker ---------- */
  function getRosterList(cls) {
    const r = state.rosters[cls] || state.rosters["7"];
    if (r.names && r.names.length > 0) return r.names;
    const n = Math.max(2, Math.min(100, Number(r.count) || 35));
    return Array.from({ length: n }, (_, i) => `Roll No. ${i + 1}`);
  }

  function openPicker(cls = "7", onPick = null) {
    const bg = ensureModal();
    const modal = document.getElementById("p-modal");
    let activeCls = String(cls);
    let spinning = false;
    let lastPicked = "";

    function render(showSetup = false) {
      const r = state.rosters[activeCls];
      const list = getRosterList(activeCls);
      const remaining = r.noRepeat ? list.filter(x => !r.picked.includes(x)) : list;
      modal.innerHTML = `
        <div class="p-modal-hd">
          <h2>🎲 Student Spotlight Picker</h2>
          <button class="p-close" id="pk-close">✕</button>
        </div>
        <div class="p-tabs">
          <button class="p-tab ${activeCls === "7" ? "on" : ""}" id="pk-c7">Class 7</button>
          <button class="p-tab ${activeCls === "9" ? "on" : ""}" id="pk-c9">Class 9</button>
          <button class="p-tab ${showSetup ? "on" : ""}" id="pk-cfg-btn">⚙️ Roster (${list.length})</button>
        </div>
        ${showSetup ? `
          <div style="text-align:left;margin-bottom:12px">
            <label style="font-weight:700;display:block;margin-bottom:4px">Class Strength (if using Roll Numbers):</label>
            <input class="p-input" id="pk-cnt" type="number" min="2" max="100" value="${r.count || 35}" style="max-width:140px">
            <label style="font-weight:700;display:block;margin:10px 0 4px">Or paste Student Names (comma or new line separated):</label>
            <textarea class="p-textarea" id="pk-names" placeholder="Aarav, Diya, Kabir, Meera...">${(r.names || []).join(", ")}</textarea>
            <div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap;align-items:center">
              <label style="display:flex;align-items:center;gap:6px;font-weight:700;cursor:pointer">
                <input type="checkbox" id="pk-norep" ${r.noRepeat ? "checked" : ""}> No-repeat until everyone gets a turn
              </label>
              <button class="p-pill primary" id="pk-save">💾 Save Roster</button>
            </div>
          </div>
        ` : ""}
        <div class="spot-box">
          <div class="spot-sub">Called so far: <b>${r.picked.length}</b> / ${list.length} · Available pool: <b>${remaining.length}</b></div>
          <div class="spot-name" id="pk-res">${lastPicked || "Ready to spin!"}</div>
          <div class="spot-sub" id="pk-note">Pick 1 student for the board, or 2 challengers for a duel!</div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center">
          <button class="p-pill primary" id="pk-one">🎤 Pick 1 Student</button>
          <button class="p-pill warm" id="pk-two">⚔️ Pick 2 Challengers</button>
          <button class="p-pill" id="pk-three">👥 Pick Squad of 3</button>
          <button class="p-pill" id="pk-reset">🔄 Reset Turn Cycle</button>
        </div>
      `;

      document.getElementById("pk-close").onclick = closeModal;
      document.getElementById("pk-c7").onclick = () => { activeCls = "7"; lastPicked = ""; render(showSetup); };
      document.getElementById("pk-c9").onclick = () => { activeCls = "9"; lastPicked = ""; render(showSetup); };
      document.getElementById("pk-cfg-btn").onclick = () => render(!showSetup);

      if (showSetup) {
        document.getElementById("pk-save").onclick = () => {
          const cnt = Math.max(2, Math.min(100, Number(document.getElementById("pk-cnt").value) || 35));
          const rawNames = document.getElementById("pk-names").value
            .split(/[\n,]+/)
            .map(s => s.trim())
            .filter(Boolean);
          state.rosters[activeCls] = {
            count: cnt,
            names: rawNames,
            picked: [],
            noRepeat: document.getElementById("pk-norep").checked
          };
          saveState(state);
          SFX.good();
          toast("Roster saved!");
          render(false);
        };
      }

      function spinPick(howMany) {
        if (spinning) return;
        spinning = true;
        unlockBadge("all_class");
        const rr = state.rosters[activeCls];
        const all = getRosterList(activeCls);
        let pool = rr.noRepeat ? all.filter(x => !rr.picked.includes(x)) : [...all];
        if (pool.length < howMany) {
          rr.picked = [];
          pool = [...all];
          toast("Everyone had a turn! Starting a fresh cycle.");
        }
        const resEl = document.getElementById("pk-res");
        let ticks = 0;
        const iv = setInterval(() => {
          SFX.spin();
          const preview = [];
          for (let i = 0; i < howMany; i++) {
            preview.push(all[(Math.random() * all.length) | 0]);
          }
          resEl.textContent = preview.join("  vs  ");
          ticks++;
          if (ticks > 14) {
            clearInterval(iv);
            // Fisher-Yates pick
            const shuffled = [...pool];
            for (let i = shuffled.length - 1; i > 0; i--) {
              const j = (Math.random() * (i + 1)) | 0;
              [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            const chosen = shuffled.slice(0, howMany);
            if (rr.noRepeat) {
              chosen.forEach(c => {
                if (!rr.picked.includes(c)) rr.picked.push(c);
              });
              saveState(state);
            }
            lastPicked = howMany === 2 ? `🔴 ${chosen[0]}  ⚔️  🔵 ${chosen[1]}` : chosen.join(" · ");
            resEl.textContent = lastPicked;
            SFX.good();
            confetti(18, ["🎤", "⭐", "🎉"]);
            spinning = false;
            if (typeof onPick === "function") onPick(lastPicked, chosen);
            // Update counts without erasing result
            const sub = modal.querySelector(".spot-sub");
            const leftPool = rr.noRepeat ? all.filter(x => !rr.picked.includes(x)).length : all.length;
            if (sub) sub.innerHTML = `Called so far: <b>${rr.picked.length}</b> / ${all.length} · Available pool: <b>${leftPool}</b>`;
          }
        }, 75);
      }

      document.getElementById("pk-one").onclick = () => spinPick(1);
      document.getElementById("pk-two").onclick = () => spinPick(2);
      document.getElementById("pk-three").onclick = () => spinPick(3);
      document.getElementById("pk-reset").onclick = () => {
        state.rosters[activeCls].picked = [];
        saveState(state);
        lastPicked = "";
        SFX.pop();
        toast("Turn cycle reset!");
        render(showSetup);
      };
    }

    render(false);
    bg.classList.remove("hide");
  }

  /* ---------- Whole-Class Audience Poll ---------- */
  function openPoll(question, options, onDone = null) {
    const bg = ensureModal();
    const modal = document.getElementById("p-modal");
    const counts = options.map(() => 0);
    unlockBadge("all_class");

    function render() {
      const total = counts.reduce((a, b) => a + b, 0);
      const maxVal = Math.max(...counts, 0);
      modal.innerHTML = `
        <div class="p-modal-hd">
          <h2>🙋 Hands-Up Class Poll</h2>
          <button class="p-close" id="pl-close">✕</button>
        </div>
        <p style="font-weight:800;font-size:1.1rem;margin:4px 0 12px">${question}</p>
        <p style="font-size:0.9rem;color:var(--mut);margin:0 0 10px">Ask the whole class to raise hands for each option and tap <b>+1</b> (or <b>+5</b> for rows)!</p>
        <div>
          ${options.map((opt, i) => {
            const pct = total ? Math.round((counts[i] / total) * 100) : 0;
            const win = total > 0 && counts[i] === maxVal;
            return `
              <div class="poll-row" style="${win ? "border-color:var(--ok)" : ""}">
                <div class="poll-lbl">${opt}</div>
                <div class="poll-bar-wrap"><div class="poll-bar-fill" style="width:${pct}%;background:${win ? "var(--ok)" : "var(--a)"}"></div></div>
                <div class="poll-cnt">${counts[i]} (${pct}%)</div>
                <button class="poll-btn" data-add="${i}" data-v="1">+1</button>
                <button class="poll-btn" style="background:var(--b)" data-add="${i}" data-v="5">+5</button>
              </div>
            `;
          }).join("")}
        </div>
        <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:14px">
          <button class="p-pill" id="pl-clear">🗑️ Clear Votes</button>
          <button class="p-pill primary" id="pl-done">✅ Use Class Result (${total} votes)</button>
        </div>
      `;
      document.getElementById("pl-close").onclick = closeModal;
      modal.querySelectorAll("[data-add]").forEach(btn => {
        btn.onclick = () => {
          const idx = Number(btn.dataset.add);
          const v = Number(btn.dataset.v);
          counts[idx] += v;
          SFX.pop();
          render();
        };
      });
      document.getElementById("pl-clear").onclick = () => {
        counts.fill(0);
        render();
      };
      document.getElementById("pl-done").onclick = () => {
        const bestIdx = counts.indexOf(Math.max(...counts));
        closeModal();
        if (typeof onDone === "function" && total > 0) {
          onDone(options[bestIdx], counts, total);
        }
      };
    }

    render();
    bg.classList.remove("hide");
  }

  /* ---------- Shared Header Bar ---------- */
  function mountBar(containerId, opts = {}) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const cls = opts.cls || "7";
    el.className = "p-bar";
    el.innerHTML = `
      <a class="p-brand" href="index.html">🏫 AI Class Portal</a>
      <a class="p-pill ${opts.active === "home" ? "primary" : ""}" href="index.html">🏠 Hub</a>
      <a class="p-pill ${opts.active === "7" ? "primary" : ""}" href="class7.html">🧪 Class 7</a>
      <a class="p-pill ${opts.active === "9" ? "primary" : ""}" href="class9.html">⚔️ C9 Arena</a>
      <a class="p-pill ${opts.active === "9q" ? "primary" : ""}" href="class9_quest.html">🎮 C9 Concept Quest</a>
      <button class="p-pill warm" id="p-pick-btn">🎲 Pick Student</button>
      <button class="p-pill" id="p-sound-btn">${state.sound ? "🔊 Sound" : "🔇 Muted"}</button>
      <button class="p-pill" id="p-theme-btn">🌓 Auto</button>
      <button class="p-pill" id="p-fs-btn" title="Fullscreen">⛶</button>
    `;
    document.getElementById("p-pick-btn").onclick = () => openPicker(cls, opts.onPick || null);
    document.getElementById("p-sound-btn").onclick = toggleSound;
    document.getElementById("p-theme-btn").onclick = toggleTheme;
    document.getElementById("p-fs-btn").onclick = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen && document.documentElement.requestFullscreen();
      } else {
        document.exitFullscreen && document.exitFullscreen();
      }
    };
    applyTheme();
  }

  applyTheme();

  global.Portal = {
    BADGE_CATALOG,
    getState: () => state,
    resetStats() {
      const rosters = state.rosters;
      state = defaultState();
      state.rosters = rosters;
      saveState(state);
    },
    SFX,
    confetti,
    toast,
    unlockBadge,
    addC7Stars,
    recordC9Match,
    recordC9Quest,
    recordC7Milestone,
    openPicker,
    openPoll,
    mountBar
  };
})(window);
