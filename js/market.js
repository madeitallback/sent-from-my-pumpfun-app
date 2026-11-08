// Live market data: DexScreener (stats, activity, age), GeckoTerminal (candles, trades,
// holders), plus everything that shows it: KPIs, Road to $1B, activity, holders, trades, chart.
(() => {
  const S = window.SFM;
  const { $, $$, usd, price, pct, short, ago, esc, roll, flash, POOL, CA } = S;
  const GT = "https://api.geckoterminal.com/api/v2/networks/solana";
  const state = (S.state = {});
  let factor = null; // market cap / price, to show candles as market cap

  const setStat = (key, text, cls) => $$(`[data-stat="${key}"]`).forEach((el) => {
    el.textContent = text; el.classList.remove("up", "down"); if (cls) el.classList.add(cls);
  });
  const dirCls = (n) => (n > 0 ? "up" : n < 0 ? "down" : "");

  // ---------- DexScreener: price, market cap, volume, activity, age
  async function loadStats() {
    try {
      const r = await fetch("https://api.dexscreener.com/latest/dex/pairs/solana/" + POOL);
      const p = (await r.json()).pairs[0];
      const pu = parseFloat(p.priceUsd), mc = p.marketCap || p.fdv;
      if (mc && pu) factor = mc / pu;
      const prev = state.mcap;
      Object.assign(state, {
        mcap: mc, price: pu, chg: p.priceChange && p.priceChange.h24, vol: p.volume && p.volume.h24,
        liq: p.liquidity && p.liquidity.usd, created: p.pairCreatedAt, txns: p.txns || {}, volumes: p.volume || {}, changes: p.priceChange || {},
        buys24: p.txns && p.txns.h24 && p.txns.h24.buys, sells24: p.txns && p.txns.h24 && p.txns.h24.sells
      });
      roll($("mcapOdo"), usd(mc));
      if (prev) flash($("mcapOdo"), mc - prev);
      setStat("mcap", usd(mc));
      setStat("price", price(pu));
      setStat("chg", pct(state.chg), dirCls(state.chg));
      setStat("vol", usd(state.vol));
      setStat("liq", usd(state.liq));
      if (state.created) {
        const days = Math.max(1, Math.floor((Date.now() - state.created) / 86400000));
        setStat("age", `Born ${days}d ago`); setStat("age2", `${days} days`);
      }
      renderActivity(); renderRoad(prev); renderAth();
      S.emit("stats", state);
    } catch { /* keep the last values */ }
  }

  // ---------- GeckoTerminal: holders and how the supply is spread
  async function loadInfo() {
    try {
      const r = await fetch(`${GT}/tokens/${CA}/info`);
      const h = (await r.json()).data.attributes.holders;
      if (!h || !h.count) return;
      state.holders = h.count; state.dist = h.distribution_percentage || {};
      setStat("holders", h.count.toLocaleString("en-US"));
      const parts = [["Top 10", state.dist.top_10, "#86efac"], ["11–20", state.dist["11_20"], "#4ade80"], ["21–40", state.dist["21_40"], "#15803d"], ["Everyone else", state.dist.rest, "#3f3f46"]]
        .map(([n, v, c]) => [n, parseFloat(v) || 0, c]);
      $("dist").innerHTML = parts.map(([, v, c]) => `<span style="background:${c}" data-w="${v}"></span>`).join("");
      requestAnimationFrame(() => $$("#dist span").forEach((s) => { s.style.width = s.dataset.w + "%"; }));
      $("distLegend").innerHTML = parts.map(([n, v, c]) => `<span><i style="background:${c}"></i>${n}<b>${v.toFixed(1)}%</b></span>`).join("");
      S.emit("stats", state);
    } catch {}
  }

  // ---------- candles
  const TF = { "15m": ["minute", 15], "1h": ["hour", 1], "4h": ["hour", 4], "1d": ["day", 1] };
  async function fetchCandles(tf) {
    const [unit, agg] = TF[tf];
    const r = await fetch(`${GT}/pools/${POOL}/ohlcv/${unit}?aggregate=${agg}&limit=300&currency=usd`);
    if (!r.ok) throw new Error("ohlcv " + r.status);
    const list = (await r.json()).data.attributes.ohlcv_list || [];
    const tz = -new Date().getTimezoneOffset() * 60;
    // the API sometimes repeats a candle; the chart library throws on duplicate or unsorted times
    const byTime = new Map();
    for (const [t, o, h, l, c, v] of list) if (!byTime.has(t)) byTime.set(t, { time: t + tz, open: o, high: h, low: l, close: c, value: v });
    return [...byTime.values()].sort((a, b) => a.time - b.time);
  }

  // All-time high from daily candles (the coin's whole life fits in 300 days)
  let athPrice = null;
  async function loadAth() {
    try { const d = await fetchCandles("1d"); athPrice = Math.max(...d.map((c) => c.high)); renderAth(); renderRoad(); } catch {}
  }
  function renderAth() {
    if (!athPrice || !factor) return;
    state.athMcap = Math.max(athPrice * factor, state.mcap || 0);
    const from = state.mcap ? (state.mcap / state.athMcap - 1) * 100 : null;
    setStat("ath", usd(state.athMcap));
    $("roadAthTxt").textContent = from != null && from < -0.5 ? `${from.toFixed(0)}% from the ATH` : "At the ATH";
  }

  // ---------- Road to $1B (log scale from $10K, so every 10x is the same step on the bar).
  // The bar shows the big 10x marks; "next stop" and the milestone toasts use finer steps so they keep coming.
  const GOAL = 1e9, FLOOR = 1e4;
  const label = (v) => v >= 1e9 ? "$" + +(v / 1e9).toFixed(1) + "B" : v >= 1e6 ? "$" + +(v / 1e6).toFixed(1) + "M" : "$" + Math.round(v / 1e3) + "K";
  const pos = (v) => Math.max(0, Math.min(1, (Math.log10(v) - Math.log10(FLOOR)) / (Math.log10(GOAL) - Math.log10(FLOOR))));
  const TICKS = [100e3, 1e6, 10e6, 100e6, 1e9];
  const STOPS = [25e3, 50e3, 100e3, 250e3, 500e3, 1e6, 2.5e6, 5e6, 10e6, 25e6, 50e6, 100e6, 250e6, 500e6, 1e9];
  const nextStop = (mc) => STOPS.find((v) => v > mc);
  S.road = { pos, label, nextStop, GOAL };
  $("roadTicks").innerHTML = TICKS.map((v) => `<span style="left:${pos(v) * 100}%" data-v="${v}">${label(v)}</span>`).join("");
  function renderRoad(prev) {
    const mc = state.mcap; if (!mc) return;
    $("roadFill").style.width = pos(mc) * 100 + "%";
    if (state.athMcap) { const a = $("roadAth"); a.style.left = pos(state.athMcap) * 100 + "%"; a.style.opacity = 1; }
    $$("#roadTicks span").forEach((s) => s.classList.toggle("passed", mc >= +s.dataset.v));
    const next = nextStop(mc);
    state.nextStop = next;
    $("roadNext").textContent = next ? `Next stop ${label(next)} · ${(next / mc).toFixed(1)}x` : "Past $1B. Sent.";
    $("roadPct").textContent = mc < GOAL ? `${Math.round(GOAL / mc).toLocaleString("en-US")}x to $1B` : "$1B reached";
    const passed = prev && STOPS.filter((v) => prev < v && mc >= v).pop();
    if (passed) { S.toast("Milestone reached", { sub: `$App passed ${label(passed)} market cap`, mark: "check", ms: 4000 }); S.emit("milestone", label(passed)); }
  }

  // ---------- Activity (buys / sells per period)
  let actTf = "h24";
  function renderActivity() {
    const t = (state.txns || {})[actTf] || {}, b = t.buys || 0, s = t.sells || 0;
    $("actBuys").textContent = b; $("actSells").textContent = s;
    $("actBar").style.width = (b + s ? (b / (b + s)) * 100 : 50) + "%";
    const share = b + s ? Math.round((b / (b + s)) * 100) : null;
    const span = { m5: "5 minutes", h1: "hour", h6: "6 hours", h24: "24 hours" }[actTf];
    $("actNote").textContent = share == null ? `No trades in the last ${span}.` : `${share}% of trades in the last ${span} were buys.`;
  }
  $$("[data-act-tf]").forEach((btn) => btn.addEventListener("click", () => {
    actTf = btn.dataset.actTf; S.haptic();
    $$("[data-act-tf]").forEach((x) => x.setAttribute("aria-pressed", String(x === btn)));
    renderActivity();
  }));

  // ---------- Live trades (every 15 s)
  const seen = new Set();
  let trades = [], firstTrades = true, tradesAt = 0;
  function parseTrade(d) {
    const a = d.attributes, buy = a.kind === "buy";
    return {
      id: a.tx_hash, kind: buy ? "buy" : "sell", ts: Date.parse(a.block_timestamp),
      sol: parseFloat(buy ? a.from_token_amount : a.to_token_amount) || 0,
      usd: parseFloat(a.volume_in_usd) || 0, from: a.tx_from_address
    };
  }
  // if the API asks us to slow down, skip a few rounds instead of hammering it
  let skip = 0, backoff = 1;
  async function loadTrades() {
    if (skip > 0) { skip--; return; }
    try {
      const r = await fetch(`${GT}/pools/${POOL}/trades`);
      if (!r.ok) throw new Error(r.status);
      backoff = 1;
      const list = (await r.json()).data.map(parseTrade).filter((t) => t.usd >= 1).sort((a, b) => b.ts - a.ts);
      const fresh = list.filter((t) => !seen.has(t.id));
      list.forEach((t) => seen.add(t.id));
      trades = list.slice(0, 40); tradesAt = Date.now();
      renderTrades(firstTrades ? new Set() : new Set(fresh.map((t) => t.id)));
      if (firstTrades) { firstTrades = false; S.emit("trades:init", trades); }
      else fresh.slice(0, 3).reverse().forEach((t, i) => setTimeout(() => S.emit("trade", t), i * 4800));
    } catch { skip = backoff; backoff = Math.min(backoff * 2, 8); }
  }
  function renderTrades(freshIds = new Set()) {
    if (!trades.length) { $("trades").innerHTML = '<p class="fine">No trades over $1 lately. Be the next one.</p>'; return; }
    $("trades").innerHTML = trades.map((t) => `
      <a class="trade ${freshIds.has(t.id) ? "fresh" : ""}" href="https://solscan.io/tx/${esc(t.id)}" target="_blank" rel="noopener">
        <span class="kind ${t.kind}">${t.kind}</span>
        <span class="who"><b>${t.sol.toFixed(t.sol >= 10 ? 1 : 3)} SOL</b><small>${short(t.from)}</small></span>
        <span class="usd"><b class="${t.kind === "buy" ? "up" : "down"}">${usd(t.usd)}</b><small data-ts="${t.ts}">${ago(t.ts)}</small></span>
      </a>`).join("");
  }
  setInterval(() => {
    $$("#trades [data-ts]").forEach((el) => { el.textContent = ago(+el.dataset.ts); });
    if (tradesAt) $("tradesUpdated").textContent = `Updated ${ago(tradesAt) === "now" ? "just now" : ago(tradesAt)}`;
  }, 5000);

  // ---------- last 48 hourly closes (the Live story draws them)
  function drawSpark(candles) {
    const pts = candles.slice(-48).map((c) => c.close);
    if (pts.length < 2) return;
    state.spark = pts;
    S.emit("spark", pts);
  }
  async function loadSpark() { try { drawSpark(await fetchCandles("1h")); } catch {} }

  // ---------- Full chart (TradingView Lightweight Charts), built the first time Chart opens
  const chartApi = (() => {
    const area = $("chartArea"), msg = $("chartMsg");
    let tf = "1h", mode = "mcap", candles = [], chart = null, candle = null, vol = null, started = false;
    const showMsg = (html) => { msg.innerHTML = html; msg.hidden = false; };
    const fail = '<span>The chart is taking a break. <a href="https://dexscreener.com/solana/' + POOL + '" target="_blank" rel="noopener">Open it on DexScreener</a>.</span>';
    const volColor = (c) => c.close >= c.open ? "rgba(74,222,128,.28)" : "rgba(248,113,113,.28)";
    const k = () => (mode === "mcap" && factor ? factor : 1);
    const bar = (c) => ({ time: c.time, open: c.open * k(), high: c.high * k(), low: c.low * k(), close: c.close * k() });
    function draw() {
      if (!candle) return;
      candle.applyOptions({ priceFormat: { type: "custom", minMove: 1e-12, formatter: mode === "mcap" && factor ? usd : price } });
      candle.setData(candles.map(bar));
      vol.setData(candles.map((c) => ({ time: c.time, value: c.value, color: volColor(c) })));
      if (candles.length) { chart.timeScale().fitContent(); msg.hidden = true; } else showMsg("No trades on this timeframe yet.");
    }
    let tries = 0;
    async function refresh(full) {
      if (!started) return;
      try {
        const hadData = candles.length > 0;
        candles = await fetchCandles(tf);
        if (tf === "1h") drawSpark(candles);
        // a chart that never got data (API was busy) draws in full on the next refresh
        if (full || !hadData) draw();
        else {
          const last = candles[candles.length - 1];
          if (last) { candle.update(bar(last)); vol.update({ time: last.time, value: last.value, color: volColor(last) }); }
        }
        tries = 0;
      } catch {
        if (candles.length) return;
        if (++tries < 4) setTimeout(() => refresh(true), 4000 * tries);
        else showMsg(fail);
      }
    }
    function start() {
      if (started) return; started = true;
      if (!window.LightweightCharts) { showMsg(fail); return; }
      chart = LightweightCharts.createChart(area, {
        autoSize: true,
        localization: { locale: "en-US" },
        layout: { background: { type: "solid", color: "#0b0b0e" }, textColor: "#71717a", fontFamily: "Geist, -apple-system, sans-serif", fontSize: 11 },
        grid: { vertLines: { color: "rgba(255,255,255,.035)" }, horzLines: { color: "rgba(255,255,255,.035)" } },
        rightPriceScale: { borderColor: "rgba(255,255,255,.07)", scaleMargins: { top: 0.1, bottom: 0.25 } },
        timeScale: { borderColor: "rgba(255,255,255,.07)", timeVisible: true, secondsVisible: false },
        crosshair: { mode: 0 },
        // the wheel scrolls the screen, not the chart (zoom stays on pinch and on dragging the axes)
        handleScroll: { mouseWheel: false, vertTouchDrag: false, pressedMouseMove: true, horzTouchDrag: true },
        handleScale: { mouseWheel: false, pinch: true, axisPressedMouseMove: true }
      });
      candle = chart.addCandlestickSeries({ upColor: "#4ade80", downColor: "#f87171", wickUpColor: "#4ade80", wickDownColor: "#f87171", borderVisible: false });
      vol = chart.addHistogramSeries({ priceFormat: { type: "volume" }, priceScaleId: "", lastValueVisible: false, priceLineVisible: false });
      chart.priceScale("").applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } });
      refresh(true);
    }
    $$("[data-tf]").forEach((b) => b.addEventListener("click", async () => {
      tf = b.dataset.tf; S.haptic();
      $$("[data-tf]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      if (!chart) return;
      showMsg('<span class="spinner"></span>');
      try { candles = await fetchCandles(tf); draw(); } catch { showMsg(fail); }
    }));
    $$("[data-mode]").forEach((b) => b.addEventListener("click", () => {
      mode = b.dataset.mode; S.haptic();
      $$("[data-mode]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      draw();
    }));
    return { start, refresh, get started() { return started; } };
  })();
  S.on("screen", (n) => { if (n === "market") chartApi.start(); });
  if (S.current && S.current() === "market") chartApi.start();

  // ---------- schedule
  S.refreshAll = () => Promise.all([loadStats(), loadTrades(), chartApi.started ? chartApi.refresh(false) : loadSpark()]);
  loadStats().then(() => { loadAth(); loadInfo(); });
  loadSpark(); loadTrades();
  setInterval(() => { if (!document.hidden) { loadStats(); chartApi.started ? chartApi.refresh(false) : loadSpark(); } }, 60000);
  setInterval(() => { if (!document.hidden) loadTrades(); }, 15000);
  setInterval(() => { if (!document.hidden) loadInfo(); }, 300000);
})();
