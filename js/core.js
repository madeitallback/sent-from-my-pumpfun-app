// Shared helpers used by every other script: constants, event bus, toast, clipboard,
// haptics, sounds, confetti, the "Delivered" pop, QR codes and number formatting.
window.SFM = (() => {
  const CA = "49nkLrXi8nCZBVKsShDNasEtPe4Vn1mx9Xbr3kTa8pTL";
  const POOL = "95xZPagGKdaZgFDeNx1dxfkUYzFVk53geU7mFa58qffW";
  const PUMP = "https://pump.fun/coin/" + CA;
  const SITE = "https://sentfrommypumpfun.app/";
  const $ = (id) => document.getElementById(id);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  // ---------- tiny event bus
  const handlers = {};
  const on = (name, fn) => (handlers[name] ||= []).push(fn);
  const emit = (name, data) => (handlers[name] || []).forEach((fn) => fn(data));

  // ---------- per-viewer preferences (best effort, the page works without storage)
  const store = {
    get(k, d) { try { const v = localStorage.getItem("sfm:" + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem("sfm:" + k, JSON.stringify(v)); } catch {} }
  };

  // ---------- feedback: the Dynamic Island when it's there (app.js), a toast otherwise
  let toastTimer;
  function toast(msg, opts) {
    if (api.notify) return api.notify({ title: msg, ...opts });
    const t = $("toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 1900);
  }
  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); return true; }
    catch {
      const ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      let ok = false; try { ok = document.execCommand("copy"); } catch {}
      ta.remove(); return ok;
    }
  }

  // ---------- haptics (Android browsers; silently ignored elsewhere)
  const haptic = (ms = 8) => { try { navigator.vibrate && navigator.vibrate(ms); } catch {} };

  // ---------- sounds, generated with Web Audio (off by default)
  let actx = null;
  const sound = {
    get on() { return store.get("sound", false); },
    set on(v) { store.set("sound", !!v); },
    play(kind) {
      if (!this.on) return;
      try {
        actx ||= new (window.AudioContext || window.webkitAudioContext)();
        const t = actx.currentTime;
        const tone = (freq, start, dur, type = "sine", gain = 0.12, to) => {
          const o = actx.createOscillator(), g = actx.createGain();
          o.type = type; o.frequency.setValueAtTime(freq, t + start);
          if (to) o.frequency.exponentialRampToValueAtTime(to, t + start + dur);
          g.gain.setValueAtTime(0.0001, t + start); g.gain.exponentialRampToValueAtTime(gain, t + start + 0.015);
          g.gain.exponentialRampToValueAtTime(0.0001, t + start + dur);
          o.connect(g).connect(actx.destination); o.start(t + start); o.stop(t + start + dur + 0.02);
        };
        if (kind === "sent") { tone(520, 0, 0.22, "sine", 0.1, 1500); tone(1320, 0.2, 0.18, "triangle", 0.06); }
        else if (kind === "trade") { tone(880, 0, 0.12, "sine", 0.07); tone(1175, 0.09, 0.16, "sine", 0.07); }
        else if (kind === "unlock") { tone(700, 0, 0.08, "triangle", 0.05, 1100); }
        else if (kind === "tick") { tone(1800, 0, 0.03, "square", 0.015); }
      } catch {}
    }
  };

  // ---------- after an export: the island says it went out, like a sent message
  function delivered(sub = "Sent from my Pumpfun App") {
    toast("Delivered", { sub, mark: "check" });
    sound.play("sent"); haptic([10, 40, 10]);
  }

  // ---------- QR code as an SVG string (uses assets/qrcode.js)
  function qr(text, { dark = "#0b0b0e", light = "#ffffff" } = {}) {
    if (!window.qrcode) return "";
    const q = qrcode(0, "M"); q.addData(text); q.make();
    const n = q.getModuleCount(); let d = "";
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.isDark(r, c)) d += `M${c} ${r}h1v1h-1z`;
    return `<svg viewBox="0 0 ${n} ${n}" shape-rendering="crispEdges"><rect width="${n}" height="${n}" fill="${light}"/><path d="${d}" fill="${dark}"/></svg>`;
  }

  // ---------- formatting
  const usd = (n) => {
    if (n == null || isNaN(n)) return "–";
    const a = Math.abs(n);
    if (a >= 1e9) return "$" + (n / 1e9).toFixed(2) + "B";
    if (a >= 1e6) return "$" + (n / 1e6).toFixed(2) + "M";
    if (a >= 1e3) return "$" + (n / 1e3).toFixed(1) + "K";
    if (a >= 1) return "$" + n.toFixed(0);
    return "$" + n.toFixed(2);
  };
  const price = (p) => {
    if (p == null || isNaN(p)) return "–";
    if (p >= 1) return "$" + p.toFixed(4);
    const z = Math.max(0, -Math.floor(Math.log10(p)) - 1);
    return "$" + p.toFixed(Math.min(z + 4, 14));
  };
  const pct = (n) => (n == null || isNaN(n) ? "–" : (n > 0 ? "+" : "") + n.toFixed(2) + "%");
  const short = (a) => (a ? a.slice(0, 4) + "…" + a.slice(-4) : "");
  const ago = (ts) => {
    const s = Math.max(0, Math.round((Date.now() - ts) / 1000));
    if (s < 45) return "now";
    if (s < 3600) return Math.round(s / 60) + "m ago";
    if (s < 86400) return Math.round(s / 3600) + "h ago";
    return Math.round(s / 86400) + "d ago";
  };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  // Odometer: digits roll to their new value
  function roll(el, text) {
    if (!el) return;
    if (reduce || el.dataset.v === undefined || el.dataset.v.length !== text.length) {
      el.innerHTML = [...text].map((ch) => /\d/.test(ch)
        // a % of the strip (10 digits) lands exactly on a digit, where em steps drift by sub-pixels
        ? `<span class="od-col"><span class="od-strip" style="transform:translateY(-${ch * 10}%)">${[...Array(10).keys()].map((d) => `<span>${d}</span>`).join("")}</span></span>`
        : `<span class="od-ch">${esc(ch)}</span>`).join("");
      if (!reduce && el.dataset.v === undefined) {
        // first paint: spin up from zero
        const strips = el.querySelectorAll(".od-strip");
        strips.forEach((s) => { const to = s.style.transform; s.style.transition = "none"; s.style.transform = "translateY(0)"; void s.offsetWidth; s.style.transition = ""; s.style.transform = to; });
      }
    } else {
      const cols = el.children;
      [...text].forEach((ch, i) => {
        const col = cols[i];
        if (/\d/.test(ch) && col && col.classList.contains("od-col")) col.firstChild.style.transform = `translateY(-${ch * 10}%)`;
        else if (col) col.textContent = ch;
      });
    }
    el.dataset.v = text;
  }
  function flash(el, dir) {
    if (!el || !dir) return;
    el.classList.remove("flash-up", "flash-down"); void el.offsetWidth; el.classList.add(dir > 0 ? "flash-up" : "flash-down");
  }

  // copy-the-CA buttons anywhere on the page
  document.addEventListener("click", async (e) => {
    const b = e.target.closest("[data-copy-ca]");
    if (!b) return;
    e.stopPropagation(); haptic();
    if (await copyText(CA)) toast("Address copied", { sub: "49nk…8pTL · paste it in the app", mark: "check" });
    else toast("Copy blocked", { sub: "Long-press the address to copy it" });
  });

  const api = { CA, POOL, PUMP, SITE, $, $$, reduce, wait, on, emit, store, toast, copyText, haptic, sound, delivered, qr, usd, price, pct, short, ago, esc, roll, flash, notify: null };
  return api;
})();
