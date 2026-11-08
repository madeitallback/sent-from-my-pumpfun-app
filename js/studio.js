// Meme studio: 18 templates drawn on a canvas in the browser. Nothing is uploaded.
(() => {
  const S = window.SFM, D = window.Draw;
  const { $, $$ } = S;
  const { SIGN, F, M, wrap, rr, fitScale, logo, circleLogo, magnifier, stack, linesItem, gap, wallpaper, star } = D;
  const BLUE = "#0a84ff";
  const EMOJI = (s) => `${Math.round(s)}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
  const dim = (ctx, W, H, a) => { ctx.fillStyle = `rgba(0,0,0,${a})`; ctx.fillRect(0, 0, W, H); };

  const SIZES = { square: [1080, 1080], portrait: [1080, 1350], landscape: [1600, 900] };
  const PAL = {
    light: { bg: "#ffffff", fg: "#111111", grey: "#8a8a8e", line: "#e4e4e8", accent: "#0fa968", field: "#f0f2f1", them: "#e9e9eb", me: "#16b874", meText: "#ffffff" },
    dark: { bg: "#000000", fg: "#f5f5f7", grey: "#8d8d93", line: "#2c2c2e", accent: "#2fe39a", field: "#1c1c1e", them: "#262629", me: "#13a868", meText: "#ffffff" }
  };
  const IDEAS = {
    mail: [
      { to: "Boss", subject: "Out of office", body: "I'm currently out of office.\nI'm in the trenches." },
      { to: "Mom", subject: "What I do for work", body: "I sent you the app." },
      { to: "Landlord", subject: "Rent", body: "It will be a little late.\nA runner just woke up." },
      { to: "Therapist", subject: "Thursday", body: "Can we move my session?\nMy streak can't miss a day." },
      { to: "HR", subject: "Two weeks notice", body: "Cross-chain is my career now." }
    ],
    text: [
      { contact: "Babe", them: "we need to talk", me: "can it wait? a runner just woke up" },
      { contact: "Mom", them: "where are you??", me: "day 58 of my streak. haven't seen the sun" },
      { contact: "Dad", them: "so what do you do for work", me: "I sent you the app" },
      { contact: "Unknown", them: "who is this?", me: "new phone. same app." },
      { contact: "Bank", them: "are you diversified?", me: "bought Nvidia and a dog coin in the same minute" }
    ],
    notif: [
      { time: "3:07", msg: "Your streak ends in 2h. Leave the wedding." },
      { time: "3:07", msg: "A runner just woke up. So did you." },
      { time: "3:07", msg: "One more. You said that 6 hours ago." },
      { time: "7:58", msg: "Good morning. You're up 4x. Still brush your teeth." },
      { time: "3:07", msg: "Cross-chain trade filled. You still haven't crossed the street." }
    ],
    airdrop: [
      { sender: "Sent from my Pumpfun App", item: "a runner" },
      { sender: "Your streak", item: "day 59" },
      { sender: "The trenches", item: "3 new callouts" },
      { sender: "Mom", item: "a photo of you outside" }
    ],
    receipt: [
      { store: "THE TRENCHES", items: "1x runner - 0.5 SOL\n1x one more - 0.5 SOL\n1x apology to mom - free\n1x sleep - sold out", total: "my rent" },
      { store: "3:07 AM MART", items: "1x callout - 0.2 SOL\n2x cross-chain - 1 SOL\n1x touch grass - refunded", total: "one more" },
      { store: "PUMPFUN APP", items: "1x runner - 0.5 SOL\n1x streak - 58 days\n1x personality - included", total: "priceless" }
    ],
    tweet: [
      { name: "anon", handle: "trench_resident", text: "I'm currently out of office.\nI'm in the trenches." },
      { name: "Dad", handle: "dad_irl", text: "my son says he works in \"the app\". proud of him I think" },
      { name: "streak_keeper", handle: "streak_keeper", text: "day 58 of my streak. haven't seen the sun" },
      { name: "anon", handle: "one_more", text: "checked the app before brushing my teeth. again." }
    ],
    screentime: [
      { total: "14h 32m", change: "300% from last week", apps: "Pumpfun App - 13h 58m\nMessages - 21m\nPhone - 8m\nCamera - 5m" },
      { total: "19h 19m", change: "1919% from last week", apps: "Pumpfun App - 19h 2m\nCalendar - 12m\nWeather - 5m" },
      { total: "9h 41m", change: "you said one more", apps: "Pumpfun App - 9h 30m\nAlarm - 11m" }
    ],
    call: [
      { caller: "A runner", sub: "is calling you..." },
      { caller: "Your streak", sub: "ends in 2 hours" },
      { caller: "The trenches", sub: "3 missed calls" },
      { caller: "Another chain", sub: "is calling you..." },
      { caller: "Mom", sub: "she found the app" }
    ],
    notes: [
      { title: "Things I sent from my Pumpfun App today", items: "a buy\na sell\nan x100 callout\nan apology\nmy rent" },
      { title: "New year's resolutions", items: "touch grass\nsleep before 3:07\ndiversify (stocks too)" },
      { title: "Grocery list", items: "milk\neggs\na runner" },
      { title: "Reasons to stay up", items: "the streak\none more\na runner at 3:07" }
    ],
    cal: [
      { title: "Check the app", time: "3:07 AM", place: "The trenches", note: "Before brushing teeth." },
      { title: "Wedding", time: "2:00 PM", place: "Church", note: "Streak ends at 4. Plan an exit." },
      { title: "Touch grass", time: "Cancelled", place: "Outside", note: "Moved to next cycle." },
      { title: "Explain the app to Mom", time: "Sunday lunch", place: "Mom's place", note: "Bring screenshots." }
    ],
    search: [
      { query: "sent from my", sugg: "iphone\npumpfun app\npumpfun app at 3am\npumpfun app sorry mom" },
      { query: "how to explain to my wife", sugg: "what a runner is\nwhy I'm up at 3am\nthe streak\ncross-chain" },
      { query: "is it normal to check the app", sugg: "before brushing my teeth\nat a wedding\nin my sleep" },
      { query: "why is my streak", sugg: "more important than sleep\nmy whole personality\nstill alive" }
    ],
    battery: [
      { percent: "1%", msg: "Close the app? Never." },
      { percent: "3%", msg: "A runner just woke up. Charge later." },
      { percent: "0%", msg: "Sent from my Pumpfun App anyway." }
    ],
    discord: [
      { channel: "general", user: "trench_resident", msg: "gm. haven't slept. sent it from the app." },
      { channel: "callouts", user: "anon", msg: "wife asked where the money went. I sent her the app." },
      { channel: "general", user: "one_more", msg: "one more. last one. for real this time." }
    ],
    weather: [
      { city: "The Trenches", temp: "19°", cond: "100% chance of runners" },
      { city: "3:07 AM", temp: "0°", cond: "Clear skies. Green candles." },
      { city: "Outside", temp: "?", cond: "Unknown. Haven't been." }
    ],
    review: [
      { title: "Changed my life", stars: "5", body: "Opened it to check one thing. That was 6 hours ago. Would send again.", author: "anon, 3:07 AM" },
      { title: "My mom uses it now", stars: "5", body: "I sent her the app. Now she sends me callouts.", author: "trench_resident" },
      { title: "Too good", stars: "4", body: "Minus one star because I haven't seen the sun since.", author: "streak_keeper" }
    ],
    nowplaying: [
      { song: "One More", artist: "The Trenches" },
      { song: "19:19", artist: "Sent from my Pumpfun App" },
      { song: "Runner (3 AM Mix)", artist: "Cross-Chain" }
    ],
    statement: [
      { text: "Every cycle has a signature." },
      { text: "Not a portfolio. A personality." },
      { text: "They asked for a whitepaper. We sent a signature." },
      { text: "Built by the users." },
      { text: "3:07 am. One more." }
    ],
    shot: [
      { caption: "Checked the app before brushing my teeth" },
      { caption: "Every cycle has a signature" },
      { caption: "Not a portfolio. A personality." }
    ]
  };
  const FIELDS = {
    mail: { to: "mailTo", subject: "mailSubject", body: "mailBody" },
    text: { contact: "textContact", them: "textThem", me: "textMe" },
    notif: { time: "notifTime", msg: "notifMsg" },
    airdrop: { sender: "adSender", item: "adItem" },
    receipt: { store: "rcStore", items: "rcItems", total: "rcTotal" },
    tweet: { name: "twName", handle: "twHandle", text: "twText" },
    screentime: { total: "stTotal", change: "stChange", apps: "stApps" },
    call: { caller: "callCaller", sub: "callSub" },
    notes: { title: "notesTitle", items: "notesItems" },
    cal: { title: "calTitle", time: "calTime", place: "calPlace", note: "calNote" },
    search: { query: "searchQuery", sugg: "searchSugg" },
    battery: { percent: "btPercent", msg: "btMsg" },
    discord: { channel: "dcChannel", user: "dcUser", msg: "dcMsg" },
    weather: { city: "wxCity", temp: "wxTemp", cond: "wxCond" },
    review: { title: "rvTitle", stars: "rvStars", body: "rvBody", author: "rvAuthor" },
    nowplaying: { song: "npSong", artist: "npArtist" },
    statement: { text: "statementText" },
    shot: { caption: "shotCaption" }
  };
  const starsOf = (d) => Math.max(1, Math.min(5, parseInt(d.stars, 10) || 5));
  const LINE = {
    mail: (d) => d.body, text: (d) => d.me, notif: (d) => d.msg,
    airdrop: (d) => `AirDrop: "${d.sender}" would like to share ${d.item}.`,
    receipt: (d) => `Receipt total: ${d.total}`,
    tweet: (d) => d.text,
    screentime: (d) => `Screen Time: ${d.total} a day. ${d.change}.`,
    call: (d) => `Incoming call: ${d.caller}`, notes: (d) => d.title,
    cal: (d) => `${d.title}. ${d.time}`, search: (d) => `${d.query}...`,
    battery: (d) => `${d.percent} battery. ${d.msg}`,
    discord: (d) => d.msg,
    weather: (d) => `${d.city}: ${d.temp}. ${d.cond}`,
    review: (d) => `${"★".repeat(starsOf(d))} "${d.title}". ${d.body}`,
    nowplaying: (d) => `Now playing: ${d.song} by ${d.artist}`,
    statement: (d) => d.text, shot: (d) => d.caption
  };
  const LABEL = { mail: "Email", text: "Text", notif: "Alert", airdrop: "AirDrop", receipt: "Receipt", tweet: "Post", screentime: "Screen Time", call: "Call", notes: "Notes", cal: "Calendar", search: "Search", battery: "Battery", discord: "Chat", weather: "Weather", review: "Review", nowplaying: "Music", statement: "Statement", shot: "Screenshot" };

  const state = { tpl: "mail", theme: "light", fmt: "square", post: "", postEdited: false };
  for (const k of Object.keys(IDEAS)) state[k] = { ...IDEAS[k][0] };
  state.shot.img = null;

  // =====================================================================
  // Original templates
  // =====================================================================
  function drawMail(ctx, W, H, p) {
    const d = state.mail, pad = W * 0.08, maxW = W - pad * 2;
    stack(H, pad, (s) => {
      ctx.font = F(700, 68 * s); const subj = wrap(ctx, d.subject || "(no subject)", maxW);
      ctx.font = F(400, 58 * s); const body = wrap(ctx, d.body || "", maxW);
      const meta = (label, value, accent) => ({ h: 58 * s, draw: (y) => {
        ctx.font = F(400, 40 * s); ctx.fillStyle = p.grey; ctx.textAlign = "left";
        const lw = ctx.measureText(label + ":  ").width;
        ctx.fillText(label + ":", pad, y + 42 * s);
        ctx.font = F(500, 40 * s); ctx.fillStyle = accent ? p.accent : p.fg;
        ctx.fillText(value, pad + lw, y + 42 * s);
      } });
      const rule = (h) => ({ h, draw: (y) => { ctx.fillStyle = p.line; ctx.fillRect(pad, y + h / 2, maxW, Math.max(1, 2 * s)); } });
      return [
        { h: 54 * s, draw: (y) => { ctx.font = F(500, 42 * s); ctx.fillStyle = p.accent; ctx.textAlign = "left"; ctx.fillText("‹ Inbox", pad, y + 42 * s); } },
        gap(26 * s), meta("From", "me"), meta("To", d.to || "Boss", true), rule(40 * s),
        linesItem(ctx, subj, F(700, 68 * s), 78 * s, p.fg, pad),
        { h: 50 * s, draw: (y) => { ctx.font = F(400, 34 * s); ctx.fillStyle = p.grey; ctx.fillText("Today at 3:07 AM", pad, y + 44 * s); } },
        rule(44 * s),
        linesItem(ctx, body, F(400, 58 * s), 78 * s, p.fg, pad),
        gap(84 * s),
        { h: 56 * s, draw: (y) => { ctx.font = F(400, 48 * s); ctx.fillStyle = p.grey; ctx.textAlign = "left"; ctx.fillText(SIGN, pad, y + 48 * s); } }
      ];
    });
  }
  function drawText(ctx, W, H, p) {
    const d = state.text, pad = W * 0.07;
    stack(H, pad, (s) => {
      const maxB = Math.min(W * 0.7, 760), fs = 54 * s, lh = 70 * s, px = 34 * s, py = 24 * s;
      ctx.font = F(400, fs);
      const them = wrap(ctx, d.them || "...", maxB - px * 2), me = wrap(ctx, d.me || "...", maxB - px * 2);
      const bw = (ls) => { ctx.font = F(400, fs); return Math.min(maxB, Math.max(...ls.map((l) => ctx.measureText(l).width)) + px * 2); };
      const wThem = bw(them), wMe = bw(me), r = 72 * s, cx = W / 2;
      const bubble = (lines, w, mine) => ({ h: lines.length * lh + py * 2, draw: (y) => {
        const x = mine ? W - pad - w : pad;
        ctx.fillStyle = mine ? p.me : p.them; rr(ctx, x, y, w, lines.length * lh + py * 2, 40 * s); ctx.fill();
        ctx.fillStyle = mine ? p.meText : p.fg; ctx.font = F(400, fs); ctx.textAlign = "left";
        lines.forEach((l, i) => ctx.fillText(l, x + px, y + py + (i + 0.76) * lh));
      } });
      return [
        { h: 230 * s, draw: (y) => {
          const g = ctx.createLinearGradient(cx, y, cx, y + r * 2); g.addColorStop(0, "#a7adb5"); g.addColorStop(1, "#7f858e");
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, y + r, r, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "#ffffff"; ctx.textAlign = "center"; ctx.font = F(600, 66 * s);
          ctx.fillText(((d.contact || "?").trim().charAt(0) || "?").toUpperCase(), cx, y + r + 23 * s);
          ctx.fillStyle = p.fg; ctx.font = F(500, 40 * s); ctx.fillText(d.contact || "Unknown", cx, y + r * 2 + 58 * s);
        } },
        gap(50 * s), bubble(them, wThem, false), gap(28 * s), bubble(me, wMe, true),
        { h: 66 * s, draw: (y) => { ctx.fillStyle = p.grey; ctx.font = F(500, 34 * s); ctx.textAlign = "right"; ctx.fillText(SIGN, W - pad - 8 * s, y + 50 * s); } }
      ];
    });
  }
  function drawNotif(ctx, W, H, dark) {
    const d = state.notif;
    wallpaper(ctx, W, H, dark);
    const pad = Math.min(W, H) * 0.06, cardW = Math.min(W - pad * 2, 980);
    const plan = (s) => {
      ctx.font = F(400, 46 * s);
      const lines = wrap(ctx, d.msg || "", cardW - 150 * s - 40 * s);
      return { s, lines, cardH: Math.max(160 * s, 96 * s + lines.length * 60 * s + 38 * s) };
    };
    const totalH = (P) => 46 * P.s + 230 * P.s + 70 * P.s + P.cardH;
    const s = fitScale((s) => totalH(plan(s)), H - pad * 2), P = plan(s);
    let y = Math.max(pad, (H - totalH(P)) / 2);
    const dateStr = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
    ctx.textAlign = "center"; ctx.fillStyle = "rgba(255,255,255,0.9)"; ctx.font = F(600, 40 * s);
    ctx.fillText(dateStr, W / 2, y + 40 * s);
    y += 46 * s;
    ctx.fillStyle = "#ffffff"; ctx.font = F(700, 210 * s);
    ctx.fillText(d.time || "3:07", W / 2, y + 200 * s);
    y += 300 * s;
    const x = (W - cardW) / 2;
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,0.18)"; ctx.shadowBlur = 40 * s; ctx.shadowOffsetY = 10 * s;
    ctx.fillStyle = dark ? "rgba(58,64,70,0.74)" : "rgba(255,255,255,0.8)";
    rr(ctx, x, y, cardW, P.cardH, 44 * s); ctx.fill(); ctx.restore();
    const isz = 92 * s, ix = x + 30 * s, iy = y + 30 * s;
    logo(ctx, ix, iy, isz, 22 * s);
    const tx = ix + isz + 26 * s, ink = dark ? "#ffffff" : "#111111", soft = dark ? "rgba(255,255,255,0.62)" : "rgba(0,0,0,0.5)";
    ctx.textAlign = "left"; ctx.fillStyle = ink; ctx.font = F(700, 40 * s); ctx.fillText(SIGN, tx, iy + 36 * s);
    ctx.textAlign = "right"; ctx.fillStyle = soft; ctx.font = F(400, 30 * s); ctx.fillText("now", x + cardW - 32 * s, iy + 34 * s);
    ctx.textAlign = "left"; ctx.fillStyle = ink; ctx.font = F(400, 46 * s);
    P.lines.forEach((l, i) => ctx.fillText(l, tx, iy + 36 * s + (i + 1) * 60 * s + 4 * s));
  }
  function handset(ctx, cx, cy, u) {
    const R = u * 0.6, a1 = Math.PI * 1.17, a2 = Math.PI * 1.83;
    const top = -R - u * 0.12, bottom = Math.sin(a1) * R + u * 0.2;
    const oy = -(top + bottom) / 2;
    ctx.save(); ctx.translate(cx, cy);
    ctx.strokeStyle = "#ffffff"; ctx.fillStyle = "#ffffff"; ctx.lineCap = "round";
    ctx.lineWidth = u * 0.24;
    ctx.beginPath(); ctx.arc(0, oy, R, a1, a2); ctx.stroke();
    for (const a of [a1, a2]) {
      const ex = Math.cos(a) * R, ey = oy + Math.sin(a) * R;
      ctx.save(); ctx.translate(ex, ey); ctx.rotate(a + Math.PI / 2);
      rr(ctx, -u * 0.2, -u * 0.12, u * 0.4, u * 0.3, u * 0.12); ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }
  function drawCall(ctx, W, H, dark) {
    const d = state.call;
    wallpaper(ctx, W, H, true);
    if (!dark) { ctx.fillStyle = "rgba(2,243,143,0.18)"; ctx.fillRect(0, 0, W, H); }
    const s = Math.min(W, H) / 1080;
    ctx.textAlign = "center"; ctx.fillStyle = "#ffffff";
    let fs = 96 * s; ctx.font = F(600, fs);
    while (ctx.measureText(d.caller || "Unknown").width > W * 0.86 && fs > 40 * s) { fs -= 4 * s; ctx.font = F(600, fs); }
    const top = H * 0.17;
    ctx.fillText(d.caller || "Unknown", W / 2, top + fs * 0.8);
    ctx.fillStyle = "rgba(255,255,255,0.75)"; ctx.font = F(400, 42 * s);
    ctx.fillText(d.sub || "", W / 2, top + fs * 0.8 + 66 * s);
    const av = 250 * s, ay = H * 0.45 - av / 2;
    circleLogo(ctx, W / 2, ay + av / 2, av / 2);
    const by = H * 0.72, br = 78 * s;
    [[W * 0.3, "#ff3b30", "Decline"], [W * 0.7, "#30d158", "Accept"]].forEach(([bx, col, label]) => {
      ctx.fillStyle = col; ctx.beginPath(); ctx.arc(bx, by, br, 0, Math.PI * 2); ctx.fill();
      handset(ctx, bx, by, br * 0.95);
      ctx.fillStyle = "#ffffff"; ctx.font = F(500, 34 * s); ctx.textAlign = "center";
      ctx.fillText(label, bx, by + br + 50 * s);
    });
    ctx.fillStyle = "rgba(255,255,255,0.7)"; ctx.font = F(500, 32 * s);
    ctx.fillText(SIGN, W / 2, H - 40 * s);
  }
  function drawNotes(ctx, W, H, p) {
    const d = state.notes, pad = W * 0.08, maxW = W - pad * 2;
    const items = String(d.items || "").split("\n").map((t) => t.trim()).filter(Boolean);
    stack(H, pad, (s) => {
      ctx.font = F(700, 72 * s); const title = wrap(ctx, d.title || "Untitled", maxW);
      const rows = items.map((t) => { ctx.font = F(400, 54 * s); return wrap(ctx, t, maxW - 86 * s); });
      const list = rows.map((ls) => ({ h: ls.length * 70 * s + 26 * s, draw: (y) => {
        ctx.strokeStyle = p.grey; ctx.lineWidth = 4 * s;
        ctx.beginPath(); ctx.arc(pad + 24 * s, y + 38 * s, 22 * s, 0, Math.PI * 2); ctx.stroke();
        ctx.font = F(400, 54 * s); ctx.fillStyle = p.fg; ctx.textAlign = "left";
        ls.forEach((l, i) => ctx.fillText(l, pad + 76 * s, y + (i + 0.8) * 70 * s));
      } }));
      return [
        { h: 60 * s, draw: (y) => { ctx.font = F(500, 42 * s); ctx.fillStyle = p.accent; ctx.textAlign = "left"; ctx.fillText("‹ Notes", pad, y + 42 * s); } },
        gap(34 * s),
        linesItem(ctx, title, F(700, 72 * s), 84 * s, p.fg, pad),
        { h: 64 * s, draw: (y) => { ctx.font = F(400, 32 * s); ctx.fillStyle = p.grey; ctx.fillText("Today at 3:07 AM", pad, y + 46 * s); } },
        gap(16 * s), ...list, gap(46 * s),
        { h: 56 * s, draw: (y) => { ctx.font = F(400, 46 * s); ctx.fillStyle = p.grey; ctx.textAlign = "left"; ctx.fillText(SIGN, pad, y + 46 * s); } }
      ];
    });
  }
  function drawCal(ctx, W, H, p) {
    const d = state.cal, pad = W * 0.08, maxW = W - pad * 2;
    const dateStr = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
    stack(H, pad, (s) => {
      ctx.font = F(700, 74 * s); const title = wrap(ctx, d.title || "Event", maxW - 40 * s);
      ctx.font = F(400, 48 * s); const note = wrap(ctx, d.note || "", maxW);
      const rule = (h) => ({ h, draw: (y) => { ctx.fillStyle = p.line; ctx.fillRect(pad, y + h / 2, maxW, Math.max(1, 2 * s)); } });
      const row = (label, value) => ({ h: 104 * s, draw: (y) => {
        ctx.textAlign = "left"; ctx.font = F(500, 34 * s); ctx.fillStyle = p.grey; ctx.fillText(label, pad, y + 36 * s);
        ctx.font = F(500, 48 * s); ctx.fillStyle = p.fg; ctx.fillText(value, pad, y + 92 * s);
      } });
      return [
        { h: 60 * s, draw: (y) => { ctx.font = F(500, 42 * s); ctx.fillStyle = p.accent; ctx.textAlign = "left"; ctx.fillText("‹ " + new Date().toLocaleDateString("en-US", { month: "long" }), pad, y + 42 * s); } },
        gap(34 * s),
        { h: title.length * 86 * s, draw: (y) => {
          ctx.fillStyle = p.accent; rr(ctx, pad, y + 12 * s, 14 * s, title.length * 86 * s - 10 * s, 7 * s); ctx.fill();
          ctx.font = F(700, 74 * s); ctx.fillStyle = p.fg; ctx.textAlign = "left";
          title.forEach((l, i) => ctx.fillText(l, pad + 40 * s, y + (i + 0.82) * 86 * s));
        } },
        { h: 64 * s, draw: (y) => { ctx.font = F(400, 40 * s); ctx.fillStyle = p.fg; ctx.fillText(dateStr, pad + 40 * s, y + 50 * s); } },
        { h: 56 * s, draw: (y) => { ctx.font = F(600, 40 * s); ctx.fillStyle = p.accent; ctx.fillText(d.time || "", pad + 40 * s, y + 44 * s); } },
        rule(44 * s), row("Location", d.place || ""), rule(40 * s), row("Alert", "5 minutes before"), rule(40 * s),
        { h: 50 * s, draw: (y) => { ctx.font = F(500, 34 * s); ctx.fillStyle = p.grey; ctx.fillText("Notes", pad, y + 36 * s); } },
        linesItem(ctx, note, F(400, 48 * s), 64 * s, p.fg, pad),
        gap(60 * s),
        { h: 52 * s, draw: (y) => { ctx.font = F(400, 42 * s); ctx.fillStyle = p.grey; ctx.textAlign = "left"; ctx.fillText(SIGN, pad, y + 42 * s); } }
      ];
    });
  }
  function drawSearch(ctx, W, H, p) {
    const d = state.search, pad = W * 0.07, maxW = W - pad * 2;
    const q = (d.query || "").trim();
    const sugg = String(d.sugg || "").split("\n").map((t) => t.trim()).filter(Boolean);
    stack(H, pad, (s) => {
      const fieldH = 128 * s, rowH = 104 * s;
      const field = { h: fieldH, draw: (y) => {
        ctx.fillStyle = p.field; rr(ctx, pad, y, maxW, fieldH, fieldH / 2); ctx.fill();
        magnifier(ctx, pad + 40 * s, y + fieldH / 2 - 24 * s, 48 * s, p.grey);
        ctx.font = F(400, 52 * s); ctx.fillStyle = p.fg; ctx.textAlign = "left";
        let text = q; const maxT = maxW - 150 * s;
        while (ctx.measureText(text).width > maxT && text.length > 1) text = text.slice(1);
        ctx.fillText(text, pad + 116 * s, y + fieldH / 2 + 18 * s);
        const cw = ctx.measureText(text).width;
        ctx.fillStyle = p.accent; ctx.fillRect(pad + 120 * s + cw, y + fieldH / 2 - 30 * s, 4 * s, 60 * s);
      } };
      const rows = sugg.map((t) => ({ h: rowH, draw: (y) => {
        magnifier(ctx, pad + 44 * s, y + rowH / 2 - 20 * s, 40 * s, p.grey);
        const lower = t.toLowerCase(), ql = q.toLowerCase();
        const head = lower.startsWith(ql) ? t.slice(0, q.length) : q;
        const tail = lower.startsWith(ql) ? t.slice(q.length) : (q ? " " : "") + t;
        let x = pad + 116 * s; const bx = pad + maxW;
        ctx.textAlign = "left"; ctx.font = F(400, 48 * s); ctx.fillStyle = p.fg;
        ctx.fillText(head, x, y + rowH / 2 + 17 * s); x += ctx.measureText(head).width;
        ctx.font = F(700, 48 * s);
        let tt = tail; while (x + ctx.measureText(tt).width > bx && tt.length > 1) tt = tt.slice(0, -2) + "…";
        ctx.fillText(tt, x, y + rowH / 2 + 17 * s);
        ctx.fillStyle = p.line; ctx.fillRect(pad + 116 * s, y + rowH - 2 * s, maxW - 116 * s, Math.max(1, 2 * s));
      } }));
      return [field, gap(26 * s), ...rows, gap(70 * s),
        { h: 52 * s, draw: (y) => { ctx.font = F(400, 42 * s); ctx.fillStyle = p.grey; ctx.textAlign = "left"; ctx.fillText(SIGN, pad, y + 42 * s); } }];
    });
  }
  function drawStatement(ctx, W, H, dark) {
    const d = state.statement;
    if (dark) {
      ctx.fillStyle = "#0b100e"; ctx.fillRect(0, 0, W, H);
      const g = ctx.createRadialGradient(W * 0.15, H * 0.1, 10, W * 0.15, H * 0.1, Math.max(W, H));
      g.addColorStop(0, "rgba(2,243,143,0.22)"); g.addColorStop(1, "rgba(0,0,0,0)"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    } else {
      const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, "#1ff59a"); g.addColorStop(1, "#02c774");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    }
    const s = Math.min(W, H) / 1080, pad = 90 * s;
    if (!dark) {
      ctx.save(); ctx.shadowColor = "rgba(4,48,29,0.28)"; ctx.shadowBlur = 24 * s; ctx.shadowOffsetY = 6 * s;
      ctx.fillStyle = "#ffffff"; rr(ctx, pad - 8 * s, pad - 8 * s, 136 * s, 136 * s, 36 * s); ctx.fill(); ctx.restore();
    }
    logo(ctx, pad, pad, 120 * s, 30 * s);
    const ink = dark ? "#eafff4" : "#04301d", soft = dark ? "rgba(234,255,244,0.6)" : "rgba(4,48,29,0.7)";
    const top = pad + 120 * s + 60 * s, bottom = H - pad - 80 * s, maxW = W - pad * 2;
    let fs = 170 * s, lines;
    for (; fs > 44 * s; fs -= 4 * s) {
      ctx.font = F(800, fs); lines = wrap(ctx, d.text || "", maxW);
      if (lines.length * fs * 1.08 <= bottom - top) break;
    }
    ctx.font = F(800, fs); ctx.fillStyle = ink; ctx.textAlign = "left";
    const blockH = lines.length * fs * 1.08, y0 = top + (bottom - top - blockH) / 2;
    lines.forEach((l, i) => ctx.fillText(l, pad, y0 + (i + 0.82) * fs * 1.08));
    ctx.font = F(500, 42 * s); ctx.fillStyle = soft; ctx.fillText(SIGN, pad, H - pad);
  }
  function shotLayout(ctx) {
    const W = 1080, pad = 64, img = state.shot.img;
    const iw = img ? img.naturalWidth : 1080, ih = img ? img.naturalHeight : 1300;
    const imgH = Math.min(Math.round(ih * (W / iw)), 2600);
    ctx.font = F(700, 50);
    const cap = (state.shot.caption || "").trim() ? wrap(ctx, state.shot.caption, W - pad * 2) : [];
    const capH = cap.length ? cap.length * 62 + 80 : 0;
    return { W, H: capH + imgH + 150, pad, cap, capH, imgH };
  }
  function drawShot(ctx, L, p) {
    const { W, H, pad, cap, capH, imgH } = L, img = state.shot.img;
    ctx.fillStyle = p.bg; ctx.fillRect(0, 0, W, H);
    if (cap.length) { ctx.fillStyle = p.fg; ctx.font = F(700, 50); ctx.textAlign = "left"; cap.forEach((l, i) => ctx.fillText(l, pad, 40 + (i + 0.85) * 62)); }
    if (img) {
      const sh = Math.min(img.naturalHeight, Math.round(imgH * img.naturalWidth / W));
      ctx.drawImage(img, 0, 0, img.naturalWidth, sh, 0, capH, W, imgH);
    } else {
      ctx.fillStyle = p.them; ctx.fillRect(0, capH, W, imgH);
      ctx.fillStyle = p.grey; ctx.textAlign = "center"; ctx.font = F(600, 44);
      ctx.fillText("Your screenshot goes here", W / 2, capH + imgH / 2 - 10);
      ctx.font = F(400, 32); ctx.fillText("Upload it or paste it", W / 2, capH + imgH / 2 + 44);
    }
    ctx.fillStyle = p.line; ctx.fillRect(0, capH + imgH, W, 2);
    ctx.fillStyle = p.grey; ctx.font = F(400, 40); ctx.textAlign = "left";
    ctx.fillText(SIGN, pad, capH + imgH + 92);
  }

  // =====================================================================
  // New templates
  // =====================================================================
  function footerSign(ctx, W, H, color) {
    const k = Math.min(W, H) / 1080;
    ctx.textAlign = "center"; ctx.fillStyle = color; ctx.font = F(500, 32 * k);
    ctx.fillText(SIGN, W / 2, H - 42 * k);
  }

  function drawAirdrop(ctx, W, H, dark) {
    const d = state.airdrop;
    wallpaper(ctx, W, H, dark); dim(ctx, W, H, dark ? 0.3 : 0.15);
    const cw = Math.min(W * 0.8, 860), x0 = (W - cw) / 2;
    const plan = (s) => {
      ctx.font = F(400, 44 * s);
      const body = wrap(ctx, `“${d.sender || "Someone"}” would like to share ${d.item || "something"}.`, cw - 110 * s);
      return { s, body, h: 60 * s + 120 * s + 34 * s + 60 * s + 18 * s + body.length * 58 * s + 40 * s + 190 * s + 50 * s + 120 * s };
    };
    const s = fitScale((s) => plan(s).h, H * 0.84), P = plan(s);
    let y = (H - P.h) / 2 - 24 * s;
    const top = y;
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,.32)"; ctx.shadowBlur = 60 * s; ctx.shadowOffsetY = 16 * s;
    ctx.fillStyle = dark ? "rgba(38,38,42,0.95)" : "rgba(246,246,248,0.97)"; rr(ctx, x0, y, cw, P.h, 56 * s); ctx.fill(); ctx.restore();
    const cx = W / 2, ink = dark ? "#ffffff" : "#111111", line = dark ? "rgba(255,255,255,.14)" : "rgba(0,0,0,.12)";
    y += 60 * s;
    const icy = y + 60 * s;
    ctx.fillStyle = BLUE; ctx.beginPath(); ctx.arc(cx, icy, 60 * s, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#fff"; ctx.lineWidth = 6.5 * s; ctx.lineCap = "round";
    for (const r of [17, 30, 43]) { ctx.beginPath(); ctx.arc(cx, icy + 8 * s, r * s, Math.PI / 2 + 0.8, Math.PI * 2.5 - 0.8); ctx.stroke(); }
    ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(cx, icy + 8 * s, 6 * s, 0, Math.PI * 2); ctx.fill();
    y += 120 * s + 34 * s;
    ctx.textAlign = "center"; ctx.fillStyle = ink; ctx.font = F(700, 52 * s); ctx.fillText("AirDrop", cx, y + 48 * s);
    y += 60 * s + 18 * s;
    ctx.font = F(400, 44 * s); P.body.forEach((l, i) => ctx.fillText(l, cx, y + (i + 0.8) * 58 * s));
    y += P.body.length * 58 * s + 40 * s;
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,.2)"; ctx.shadowBlur = 20 * s; logo(ctx, cx - 95 * s, y, 190 * s, 42 * s); ctx.restore();
    y += 190 * s + 50 * s;
    ctx.fillStyle = line; ctx.fillRect(x0, y, cw, 2 * s); ctx.fillRect(cx - s, y, 2 * s, top + P.h - y);
    ctx.font = F(400, 46 * s); ctx.fillStyle = BLUE; ctx.fillText("Decline", x0 + cw / 4, y + 76 * s);
    ctx.font = F(700, 46 * s); ctx.fillText("Accept", x0 + (cw * 3) / 4, y + 76 * s);
    footerSign(ctx, W, H, "rgba(255,255,255,.85)");
  }

  function seeded(seed) { let x = seed || 7; return () => ((x = (x * 16807) % 2147483647) / 2147483647); }
  function drawReceipt(ctx, W, H, dark) {
    const d = state.receipt;
    ctx.fillStyle = dark ? "#0d0d10" : "#e6e2d8"; ctx.fillRect(0, 0, W, H);
    if (dark) { const g = ctx.createRadialGradient(W / 2, H * 0.3, 10, W / 2, H * 0.3, W); g.addColorStop(0, "rgba(2,243,143,0.14)"); g.addColorStop(1, "rgba(0,0,0,0)"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
    const items = String(d.items || "").split("\n").map((t) => t.trim()).filter(Boolean).map((t) => { const m = t.split(/\s+-\s+/); return [m[0], m.slice(1).join(" - ")]; });
    const pw = Math.min(W * 0.64, 700);
    const hOf = (s) => 60 * s + 64 * s + 40 * s + 34 * s + items.length * 54 * s + 34 * s + 70 * s + 34 * s + 40 * s + 120 * s + 36 * s + 44 * s + 50 * s;
    const s = fitScale(hOf, H * 0.86), h = hOf(s);
    const x0 = (W - pw) / 2, y0 = (H - h) / 2, tooth = 22 * s;
    ctx.save();
    ctx.translate(W / 2, H / 2); ctx.rotate(-0.02); ctx.translate(-W / 2, -H / 2);
    ctx.shadowColor = "rgba(0,0,0,.28)"; ctx.shadowBlur = 50 * s; ctx.shadowOffsetY = 18 * s;
    ctx.beginPath(); ctx.moveTo(x0, y0);
    for (let x = x0; x < x0 + pw; x += tooth) { ctx.lineTo(x + tooth / 2, y0 + tooth / 2); ctx.lineTo(Math.min(x + tooth, x0 + pw), y0); }
    ctx.lineTo(x0 + pw, y0 + h);
    for (let x = x0 + pw; x > x0; x -= tooth) { ctx.lineTo(x - tooth / 2, y0 + h - tooth / 2); ctx.lineTo(Math.max(x - tooth, x0), y0 + h); }
    ctx.closePath(); ctx.fillStyle = "#fbfaf5"; ctx.fill(); ctx.shadowColor = "transparent";
    const ink = "#1c1c1c", grey = "#7a7a7a", px = x0 + 48 * s, rx = x0 + pw - 48 * s, cx = x0 + pw / 2;
    const dash = (y) => { ctx.save(); ctx.strokeStyle = "#9a9a9a"; ctx.setLineDash([10 * s, 8 * s]); ctx.lineWidth = 2.5 * s; ctx.beginPath(); ctx.moveTo(px, y); ctx.lineTo(rx, y); ctx.stroke(); ctx.restore(); };
    const fitText = (t, w, weight, size) => { let fs = size; ctx.font = M(weight, fs); while (ctx.measureText(t).width > w && fs > size * 0.5) { fs -= 1; ctx.font = M(weight, fs); } };
    let y = y0 + 60 * s;
    ctx.textAlign = "center"; ctx.fillStyle = ink; fitText(d.store || "STORE", pw - 96 * s, 700, 48 * s); ctx.fillText(d.store || "STORE", cx, y + 40 * s); y += 64 * s;
    ctx.font = M(500, 26 * s); ctx.fillStyle = grey;
    ctx.fillText(new Date().toLocaleDateString("en-GB") + "   19:19   #0019", cx, y + 22 * s); y += 40 * s;
    dash(y + 17 * s); y += 34 * s;
    for (const [name, pr] of items) {
      ctx.fillStyle = ink; ctx.textAlign = "right"; ctx.font = M(500, 32 * s); ctx.fillText(pr, rx, y + 38 * s);
      const pw2 = ctx.measureText(pr).width;
      ctx.textAlign = "left"; fitText(name, rx - px - pw2 - 24 * s, 500, 32 * s); ctx.fillText(name, px, y + 38 * s);
      y += 54 * s;
    }
    dash(y + 17 * s); y += 34 * s;
    ctx.fillStyle = ink; ctx.textAlign = "left"; ctx.font = M(700, 44 * s); ctx.fillText("TOTAL", px, y + 50 * s);
    const tw = ctx.measureText("TOTAL ").width;
    ctx.textAlign = "right"; fitText(d.total || "", rx - px - tw, 700, 44 * s); ctx.fillText(d.total || "", rx, y + 50 * s); y += 70 * s;
    dash(y + 17 * s); y += 34 * s;
    ctx.textAlign = "center"; ctx.font = M(500, 26 * s); ctx.fillStyle = grey; ctx.fillText("PAID WITH: ONE MORE", cx, y + 26 * s); y += 40 * s;
    const rnd = seeded(String(d.total).length * 97 + items.length * 13);
    let bx = px + 30 * s; ctx.fillStyle = ink;
    while (bx < rx - 30 * s) { const w = (rnd() < 0.5 ? 3 : 7) * s; ctx.fillRect(bx, y + 10 * s, w, 96 * s); bx += w + (rnd() * 8 + 3) * s; }
    y += 120 * s;
    ctx.font = M(500, 24 * s); ctx.fillStyle = grey; ctx.fillText("THANK YOU. SEE YOU AT 3:07", cx, y + 22 * s); y += 36 * s;
    ctx.font = M(700, 27 * s); ctx.fillStyle = "#0fa968"; ctx.fillText(SIGN.toUpperCase(), cx, y + 28 * s);
    ctx.restore();
  }

  function drawTweet(ctx, W, H, dark) {
    const d = state.tweet, pad = W * 0.08, maxW = W - pad * 2;
    const bg = dark ? "#000000" : "#ffffff", fg = dark ? "#e7e9ea" : "#0f1419", grey = dark ? "#71767b" : "#536471", line = dark ? "#2f3336" : "#eff3f4", blue = "#1d9bf0";
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    const date = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    stack(H, pad, (s) => {
      ctx.font = F(400, 62 * s); const body = wrap(ctx, d.text || "", maxW);
      const rule = (h) => ({ h, draw: (y) => { ctx.fillStyle = line; ctx.fillRect(pad, y + h / 2, maxW, Math.max(1, 2 * s)); } });
      return [
        { h: 130 * s, draw: (y) => {
          circleLogo(ctx, pad + 55 * s, y + 58 * s, 55 * s);
          ctx.textAlign = "left"; ctx.fillStyle = fg; ctx.font = F(700, 46 * s); ctx.fillText(d.name || "anon", pad + 136 * s, y + 50 * s);
          ctx.fillStyle = grey; ctx.font = F(400, 40 * s); ctx.fillText("@" + String(d.handle || "anon").replace(/^@/, ""), pad + 136 * s, y + 102 * s);
          ctx.fillStyle = grey; [0, 1, 2].forEach((i) => { ctx.beginPath(); ctx.arc(W - pad - 40 * s + i * 16 * s, y + 40 * s, 4.5 * s, 0, Math.PI * 2); ctx.fill(); });
        } },
        gap(24 * s),
        linesItem(ctx, body, F(400, 62 * s), 82 * s, fg, pad),
        gap(40 * s),
        { h: 56 * s, draw: (y) => {
          let fs = 36 * s; const a = `7:19 PM · ${date} · `;
          ctx.font = F(400, fs); while (ctx.measureText(a + SIGN).width > maxW && fs > 20 * s) { fs -= 1; ctx.font = F(400, fs); }
          ctx.textAlign = "left"; ctx.fillStyle = grey; ctx.fillText(a, pad, y + 40 * s);
          ctx.fillStyle = blue; ctx.fillText(SIGN, pad + ctx.measureText(a).width, y + 40 * s);
        } },
        rule(44 * s),
        { h: 56 * s, draw: (y) => {
          let x = pad; ctx.textAlign = "left";
          for (const [n, l] of [["1,919", "Reposts"], ["191", "Quotes"], ["19.1K", "Likes"]]) {
            ctx.font = F(700, 38 * s); ctx.fillStyle = fg; ctx.fillText(n, x, y + 40 * s); x += ctx.measureText(n + " ").width;
            ctx.font = F(400, 38 * s); ctx.fillStyle = grey; ctx.fillText(l, x, y + 40 * s); x += ctx.measureText(l).width + 40 * s;
          }
        } },
        rule(44 * s)
      ];
    });
  }

  const ICON_COLS = ["#34c759", "#0a84ff", "#ff9f0a", "#ff375f", "#bf5af2"];
  function drawScreenTime(ctx, W, H, p) {
    const d = state.screentime, pad = W * 0.08, maxW = W - pad * 2;
    const apps = String(d.apps || "").split("\n").map((t) => t.trim()).filter(Boolean).slice(0, 5).map((t) => {
      const [name, ...rest] = t.split(/\s+-\s+/), time = rest.join(" - ");
      const h = /(\d+)\s*h/.exec(time), m = /(\d+)\s*m/.exec(time);
      return { name, time, min: (h ? +h[1] * 60 : 0) + (m ? +m[1] : 0) };
    });
    const maxMin = Math.max(1, ...apps.map((a) => a.min));
    ctx.fillStyle = p.bg; ctx.fillRect(0, 0, W, H);
    stack(H, pad, (s) => {
      const rule = (h) => ({ h, draw: (y) => { ctx.fillStyle = p.line; ctx.fillRect(pad, y + h / 2, maxW, Math.max(1, 2 * s)); } });
      const days = ["S", "M", "T", "W", "T", "F", "S"], hts = [0.42, 0.55, 0.48, 0.7, 0.64, 0.86, 1];
      return [
        { h: 56 * s, draw: (y) => { ctx.textAlign = "center"; ctx.font = F(600, 40 * s); ctx.fillStyle = p.fg; ctx.fillText("Screen Time", W / 2, y + 40 * s); ctx.textAlign = "left"; ctx.fillStyle = p.accent; ctx.font = F(500, 38 * s); ctx.fillText("‹ Settings", pad, y + 40 * s); } },
        gap(24 * s),
        { h: 46 * s, draw: (y) => { ctx.textAlign = "left"; ctx.font = F(500, 34 * s); ctx.fillStyle = p.grey; ctx.fillText("Daily Average", pad, y + 34 * s); } },
        { h: 118 * s, draw: (y) => { ctx.font = F(700, 104 * s); ctx.fillStyle = p.fg; ctx.fillText(d.total || "", pad, y + 96 * s); } },
        { h: 52 * s, draw: (y) => { ctx.font = F(500, 34 * s); ctx.fillStyle = p.grey; ctx.fillText("▲ " + (d.change || ""), pad, y + 36 * s); } },
        gap(20 * s),
        { h: 250 * s, draw: (y) => {
          const bw = (maxW - 6 * 22 * s) / 7, base = y + 200 * s;
          hts.forEach((v, i) => {
            const bh = 190 * s * v, x = pad + i * (bw + 22 * s);
            ctx.fillStyle = i === 6 ? p.accent : (p.bg === "#000000" ? "#2c6e52" : "#9fe3c4"); rr(ctx, x, base - bh, bw, bh, 10 * s); ctx.fill();
            ctx.fillStyle = p.grey; ctx.font = F(500, 28 * s); ctx.textAlign = "center"; ctx.fillText(days[i], x + bw / 2, base + 44 * s);
          });
          ctx.save(); ctx.strokeStyle = p.grey; ctx.setLineDash([8 * s, 8 * s]); ctx.lineWidth = 2 * s; ctx.beginPath(); ctx.moveTo(pad, base - 190 * s * 0.66); ctx.lineTo(pad + maxW, base - 190 * s * 0.66); ctx.stroke(); ctx.restore();
        } },
        rule(30 * s),
        { h: 56 * s, draw: (y) => { ctx.textAlign = "left"; ctx.font = F(600, 30 * s); ctx.fillStyle = p.grey; ctx.fillText("MOST USED", pad, y + 38 * s); } },
        ...apps.map((a, i) => ({ h: 112 * s, draw: (y) => {
          const isz = 76 * s;
          if (i === 0) logo(ctx, pad, y + 14 * s, isz, 18 * s);
          else { ctx.fillStyle = ICON_COLS[i % ICON_COLS.length]; rr(ctx, pad, y + 14 * s, isz, isz, 18 * s); ctx.fill(); ctx.fillStyle = "#fff"; ctx.font = F(700, 38 * s); ctx.textAlign = "center"; ctx.fillText((a.name || "?")[0].toUpperCase(), pad + isz / 2, y + 14 * s + isz / 2 + 13 * s); }
          const tx = pad + isz + 28 * s, tw = maxW - isz - 28 * s;
          ctx.textAlign = "left"; ctx.font = F(500, 40 * s); ctx.fillStyle = p.fg; ctx.fillText(a.name || "", tx, y + 48 * s);
          ctx.textAlign = "right"; ctx.font = F(400, 36 * s); ctx.fillStyle = p.grey; ctx.fillText(a.time || "", pad + maxW, y + 48 * s);
          ctx.fillStyle = i === 0 ? p.accent : p.line; rr(ctx, tx, y + 72 * s, Math.max(14 * s, (tw * a.min) / maxMin), 12 * s, 6 * s); ctx.fill();
        } })),
        gap(30 * s),
        { h: 48 * s, draw: (y) => { ctx.textAlign = "left"; ctx.font = F(400, 38 * s); ctx.fillStyle = p.grey; ctx.fillText(SIGN, pad, y + 38 * s); } }
      ];
    });
  }

  function drawBattery(ctx, W, H, dark) {
    const d = state.battery;
    wallpaper(ctx, W, H, dark); dim(ctx, W, H, 0.35);
    const cw = Math.min(W * 0.74, 800), x0 = (W - cw) / 2;
    const msg = `${d.percent || "1%"} of battery remaining. ${d.msg || ""}`.trim();
    const plan = (s) => { ctx.font = F(400, 42 * s); const body = wrap(ctx, msg, cw - 110 * s); return { s, body, h: 56 * s + 76 * s + 34 * s + 58 * s + 16 * s + body.length * 56 * s + 50 * s + 116 * s }; };
    const s = fitScale((s) => plan(s).h, H * 0.8), P = plan(s);
    let y = (H - P.h) / 2; const top = y, cx = W / 2;
    const ink = dark ? "#ffffff" : "#111111", line = dark ? "rgba(255,255,255,.14)" : "rgba(0,0,0,.12)";
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,.35)"; ctx.shadowBlur = 60 * s; ctx.shadowOffsetY = 16 * s;
    ctx.fillStyle = dark ? "rgba(44,44,46,0.96)" : "rgba(242,242,247,0.97)"; rr(ctx, x0, y, cw, P.h, 44 * s); ctx.fill(); ctx.restore();
    y += 56 * s;
    const bw = 150 * s, bh = 70 * s, bx = cx - bw / 2;
    ctx.strokeStyle = ink; ctx.lineWidth = 6 * s; rr(ctx, bx, y, bw, bh, 16 * s); ctx.stroke();
    ctx.fillStyle = ink; rr(ctx, bx + bw + 6 * s, y + bh * 0.3, 10 * s, bh * 0.4, 4 * s); ctx.fill();
    const pc = Math.max(0.06, Math.min(1, (parseFloat(d.percent) || 1) / 100));
    ctx.fillStyle = "#ff3b30"; rr(ctx, bx + 12 * s, y + 12 * s, (bw - 24 * s) * pc, bh - 24 * s, 8 * s); ctx.fill();
    y += 76 * s + 34 * s;
    ctx.textAlign = "center"; ctx.fillStyle = ink; ctx.font = F(700, 50 * s); ctx.fillText("Low Battery", cx, y + 46 * s);
    y += 58 * s + 16 * s;
    ctx.font = F(400, 42 * s); P.body.forEach((l, i) => ctx.fillText(l, cx, y + (i + 0.8) * 56 * s));
    y += P.body.length * 56 * s + 50 * s;
    ctx.fillStyle = line; ctx.fillRect(x0, y, cw, 2 * s); ctx.fillRect(cx - s, y, 2 * s, top + P.h - y);
    ctx.fillStyle = BLUE; ctx.font = F(400, 42 * s); ctx.fillText("Close", x0 + cw / 4, y + 72 * s);
    ctx.font = F(600, 42 * s); ctx.fillText("Low Power Mode", x0 + (cw * 3) / 4, y + 72 * s);
    footerSign(ctx, W, H, "rgba(255,255,255,.85)");
  }

  function drawDiscord(ctx, W, H, dark) {
    const d = state.discord, pad = W * 0.06, maxW = W - pad * 2;
    const C = dark ? { bg: "#313338", fg: "#dbdee1", head: "#f2f3f5", mute: "#949ba4", name: "#86efac", pill: "#2b2d31", pillOn: "#3b405a", input: "#383a40", line: "#3f4147" }
      : { bg: "#ffffff", fg: "#313338", head: "#060607", mute: "#5c5e66", name: "#15803d", pill: "#f2f3f5", pillOn: "#e0e7ff", input: "#ebedef", line: "#e3e5e8" };
    ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
    const ind = 140;
    stack(H, pad, (s) => {
      ctx.font = F(400, 48 * s); const body = wrap(ctx, d.msg || "", maxW - ind * s);
      return [
        { h: 84 * s, draw: (y) => {
          ctx.textAlign = "left"; ctx.font = F(400, 58 * s); ctx.fillStyle = C.mute; ctx.fillText("#", pad, y + 56 * s);
          ctx.font = F(700, 46 * s); ctx.fillStyle = C.head; ctx.fillText(d.channel || "general", pad + 48 * s, y + 54 * s);
          ctx.fillStyle = C.line; ctx.fillRect(0, y + 82 * s, W, 2 * s);
        } },
        gap(50 * s),
        { h: 64 * s, draw: (y) => {
          circleLogo(ctx, pad + 52 * s, y + 46 * s, 52 * s);
          ctx.textAlign = "left"; ctx.font = F(600, 44 * s); ctx.fillStyle = C.name; const n = d.user || "anon";
          ctx.fillText(n, pad + ind * s, y + 44 * s);
          const nw = ctx.measureText(n).width;
          ctx.font = F(400, 30 * s); ctx.fillStyle = C.mute; ctx.fillText("Today at 7:19 PM", pad + ind * s + nw + 22 * s, y + 42 * s);
        } },
        linesItem(ctx, body, F(400, 48 * s), 64 * s, C.fg, pad + ind * s),
        gap(18 * s),
        { h: 76 * s, draw: (y) => {
          let x = pad + ind * s;
          [["💊", "19", true], ["🟢", "7"], ["🫡", "3"]].forEach(([e, n, on]) => {
            ctx.font = F(600, 32 * s); const w = 64 * s + ctx.measureText(n).width + 30 * s;
            ctx.fillStyle = on ? C.pillOn : C.pill; rr(ctx, x, y + 6 * s, w, 60 * s, 16 * s); ctx.fill();
            if (on) { ctx.strokeStyle = "#5865f2"; ctx.lineWidth = 2.5 * s; ctx.stroke(); }
            ctx.font = EMOJI(34 * s); ctx.textAlign = "left"; ctx.fillText(e, x + 16 * s, y + 48 * s);
            ctx.font = F(600, 32 * s); ctx.fillStyle = C.fg; ctx.fillText(n, x + 66 * s, y + 47 * s);
            x += w + 14 * s;
          });
        } },
        gap(10 * s),
        { h: 44 * s, draw: (y) => { ctx.textAlign = "left"; ctx.font = F(400, 30 * s); ctx.fillStyle = C.mute; ctx.fillText(SIGN, pad + ind * s, y + 32 * s); } },
        gap(60 * s),
        { h: 104 * s, draw: (y) => { ctx.fillStyle = C.input; rr(ctx, pad, y, maxW, 104 * s, 24 * s); ctx.fill(); ctx.textAlign = "left"; ctx.font = F(400, 38 * s); ctx.fillStyle = C.mute; ctx.fillText(`Message #${d.channel || "general"}`, pad + 40 * s, y + 64 * s); } }
      ];
    });
  }

  function drawWeather(ctx, W, H, dark) {
    const d = state.weather, pad = W * 0.08, maxW = W - pad * 2;
    const g = ctx.createLinearGradient(0, 0, 0, H);
    if (dark) { g.addColorStop(0, "#0b1730"); g.addColorStop(1, "#1d4064"); } else { g.addColorStop(0, "#2f7fd0"); g.addColorStop(1, "#86c8f2"); }
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    if (dark) { ctx.fillStyle = "rgba(255,255,255,.7)"; const r = seeded(19); for (let i = 0; i < 60; i++) { ctx.beginPath(); ctx.arc(r() * W, r() * H * 0.6, r() * 2.2 + 0.4, 0, Math.PI * 2); ctx.fill(); } }
    const hourly = [["Now", "🟢", d.temp || "19°"], ["20", "🟢", "19°"], ["21", "⚡", "21°"], ["22", "🚀", "24°"], ["23", "🌧", "17°"], ["00", "🟢", "19°"]];
    stack(H, pad, (s) => [
      { h: 74 * s, draw: (y) => { ctx.textAlign = "center"; ctx.fillStyle = "#fff"; ctx.font = F(500, 62 * s); ctx.fillText(d.city || "", W / 2, y + 60 * s); } },
      { h: 210 * s, draw: (y) => { ctx.font = F(400, 200 * s); ctx.fillText(d.temp || "", W / 2 + 20 * s, y + 182 * s); } },
      { h: 62 * s, draw: (y) => { ctx.font = F(500, 46 * s); ctx.fillText(d.cond || "", W / 2, y + 48 * s); } },
      { h: 58 * s, draw: (y) => { ctx.font = F(500, 40 * s); ctx.fillStyle = "rgba(255,255,255,.85)"; ctx.fillText("H:19°  L:3°", W / 2, y + 44 * s); } },
      gap(44 * s),
      { h: 290 * s, draw: (y) => {
        ctx.fillStyle = "rgba(255,255,255,.16)"; rr(ctx, pad, y, maxW, 290 * s, 40 * s); ctx.fill();
        ctx.textAlign = "left"; ctx.fillStyle = "rgba(255,255,255,.7)"; ctx.font = F(600, 26 * s); ctx.fillText("HOURLY FORECAST · SENT FROM THE APP", pad + 34 * s, y + 52 * s);
        ctx.fillStyle = "rgba(255,255,255,.25)"; ctx.fillRect(pad + 34 * s, y + 74 * s, maxW - 68 * s, 2 * s);
        const cw = (maxW - 68 * s) / hourly.length;
        hourly.forEach(([t, e, tp], i) => {
          const cx = pad + 34 * s + cw * (i + 0.5);
          ctx.textAlign = "center"; ctx.fillStyle = "#fff"; ctx.font = F(600, 32 * s); ctx.fillText(t, cx, y + 128 * s);
          ctx.font = EMOJI(54 * s); ctx.fillText(e, cx, y + 200 * s);
          ctx.font = F(600, 38 * s); ctx.fillText(tp, cx, y + 260 * s);
        });
      } },
      gap(40 * s),
      { h: 44 * s, draw: (y) => { ctx.textAlign = "center"; ctx.fillStyle = "rgba(255,255,255,.8)"; ctx.font = F(500, 34 * s); ctx.fillText(SIGN, W / 2, y + 34 * s); } }
    ]);
  }

  function drawReview(ctx, W, H, p) {
    const d = state.review, pad = W * 0.08, maxW = W - pad * 2, n = starsOf(d);
    ctx.fillStyle = p.bg; ctx.fillRect(0, 0, W, H);
    stack(H, pad, (s) => {
      ctx.font = F(400, 44 * s); const body = wrap(ctx, d.body || "", maxW - 90 * s);
      const cardH = 48 * s + 58 * s + 16 * s + 52 * s + 22 * s + body.length * 60 * s + 48 * s;
      return [
        { h: 170 * s, draw: (y) => {
          logo(ctx, pad, y, 150 * s, 34 * s);
          ctx.textAlign = "left"; ctx.fillStyle = p.fg; ctx.font = F(700, 56 * s); ctx.fillText("Pumpfun App", pad + 180 * s, y + 68 * s);
          ctx.fillStyle = p.grey; ctx.font = F(400, 38 * s); ctx.fillText("Ratings & Reviews", pad + 180 * s, y + 122 * s);
        } },
        gap(40 * s),
        { h: cardH, draw: (y) => {
          ctx.fillStyle = p.field; rr(ctx, pad, y, maxW, cardH, 40 * s); ctx.fill();
          const x = pad + 45 * s; let yy = y + 48 * s;
          ctx.textAlign = "left"; ctx.fillStyle = p.fg; ctx.font = F(700, 46 * s); ctx.fillText(d.title || "", x, yy + 42 * s);
          ctx.textAlign = "right"; ctx.fillStyle = p.grey; ctx.font = F(400, 32 * s); ctx.fillText("3:07 AM", pad + maxW - 45 * s, yy + 40 * s);
          yy += 58 * s + 16 * s;
          for (let i = 0; i < 5; i++) star(ctx, x + 22 * s + i * 50 * s, yy + 22 * s, 22 * s, i < n ? "#ff9f0a" : p.line);
          ctx.textAlign = "right"; ctx.fillStyle = p.grey; ctx.font = F(400, 32 * s); ctx.fillText(d.author || "", pad + maxW - 45 * s, yy + 34 * s);
          yy += 52 * s + 22 * s;
          ctx.textAlign = "left"; ctx.fillStyle = p.fg; ctx.font = F(400, 44 * s);
          body.forEach((l, i) => ctx.fillText(l, x, yy + (i + 0.8) * 60 * s));
        } },
        gap(50 * s),
        { h: 50 * s, draw: (y) => { ctx.textAlign = "left"; ctx.font = F(400, 38 * s); ctx.fillStyle = p.grey; ctx.fillText(SIGN, pad, y + 38 * s); } }
      ];
    });
  }

  function drawNowPlaying(ctx, W, H, dark) {
    const d = state.nowplaying;
    if (dark) { ctx.fillStyle = "#040806"; ctx.fillRect(0, 0, W, H); const g = ctx.createRadialGradient(W / 2, H * 0.35, 10, W / 2, H * 0.35, Math.max(W, H) * 0.8); g.addColorStop(0, "rgba(2,243,143,0.35)"); g.addColorStop(1, "rgba(0,0,0,0)"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
    else { const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, "#1ff59a"); g.addColorStop(1, "#02a865"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
    const ink = dark ? "#ffffff" : "#04301d", soft = dark ? "rgba(255,255,255,.65)" : "rgba(4,48,29,.7)", track = dark ? "rgba(255,255,255,.2)" : "rgba(4,48,29,.2)";
    const cx = W / 2;
    stack(H, Math.min(W, H) * 0.07, (s) => {
      const A = 500 * s;
      return [
        { h: A, draw: (y) => { ctx.save(); ctx.shadowColor = "rgba(0,0,0,.45)"; ctx.shadowBlur = 70 * s; ctx.shadowOffsetY = 26 * s; logo(ctx, cx - A / 2, y, A, 48 * s); ctx.restore(); } },
        gap(56 * s),
        { h: 70 * s, draw: (y) => { ctx.textAlign = "left"; ctx.fillStyle = ink; ctx.font = F(700, 56 * s); ctx.fillText(d.song || "", cx - A / 2, y + 54 * s); } },
        { h: 56 * s, draw: (y) => { ctx.fillStyle = soft; ctx.font = F(500, 42 * s); ctx.fillText(d.artist || "", cx - A / 2, y + 42 * s); } },
        gap(34 * s),
        { h: 70 * s, draw: (y) => {
          ctx.fillStyle = track; rr(ctx, cx - A / 2, y, A, 12 * s, 6 * s); ctx.fill();
          ctx.fillStyle = ink; rr(ctx, cx - A / 2, y, A * 0.36, 12 * s, 6 * s); ctx.fill();
          ctx.font = F(500, 28 * s); ctx.fillStyle = soft; ctx.textAlign = "left"; ctx.fillText("1:19", cx - A / 2, y + 54 * s);
          ctx.textAlign = "right"; ctx.fillText("-19:19", cx + A / 2, y + 54 * s);
        } },
        gap(26 * s),
        { h: 110 * s, draw: (y) => {
          const my = y + 55 * s, tri = (x, dir, sz) => { ctx.beginPath(); ctx.moveTo(x, my - sz); ctx.lineTo(x + dir * sz * 1.4, my); ctx.lineTo(x, my + sz); ctx.closePath(); ctx.fill(); };
          ctx.fillStyle = ink;
          tri(cx - 150 * s, -1, 26 * s); tri(cx - 186 * s, -1, 26 * s);
          rr(ctx, cx - 30 * s, my - 40 * s, 20 * s, 80 * s, 6 * s); ctx.fill(); rr(ctx, cx + 10 * s, my - 40 * s, 20 * s, 80 * s, 6 * s); ctx.fill();
          tri(cx + 150 * s, 1, 26 * s); tri(cx + 186 * s, 1, 26 * s);
        } },
        gap(24 * s),
        { h: 40 * s, draw: (y) => { ctx.textAlign = "center"; ctx.fillStyle = soft; ctx.font = F(500, 30 * s); ctx.fillText("Playing on · " + SIGN, cx, y + 30 * s); } }
      ];
    });
  }

  // =====================================================================
  // Render
  // =====================================================================
  function buildCanvas() {
    const c = document.createElement("canvas");
    const p = PAL[state.theme], dark = state.theme === "dark";
    if (state.tpl === "shot") {
      const L = shotLayout(c.getContext("2d"));
      c.width = L.W; c.height = L.H; drawShot(c.getContext("2d"), L, p);
      return c;
    }
    const [W, H] = SIZES[state.fmt];
    c.width = W; c.height = H;
    const g = c.getContext("2d");
    g.fillStyle = p.bg; g.fillRect(0, 0, W, H);
    ({
      mail: () => drawMail(g, W, H, p), text: () => drawText(g, W, H, p), notif: () => drawNotif(g, W, H, dark),
      airdrop: () => drawAirdrop(g, W, H, dark), receipt: () => drawReceipt(g, W, H, dark), tweet: () => drawTweet(g, W, H, dark),
      screentime: () => drawScreenTime(g, W, H, p), call: () => drawCall(g, W, H, dark), notes: () => drawNotes(g, W, H, p),
      cal: () => drawCal(g, W, H, p), search: () => drawSearch(g, W, H, p), battery: () => drawBattery(g, W, H, dark),
      discord: () => drawDiscord(g, W, H, dark), weather: () => drawWeather(g, W, H, dark), review: () => drawReview(g, W, H, p),
      nowplaying: () => drawNowPlaying(g, W, H, dark), statement: () => drawStatement(g, W, H, dark)
    })[state.tpl]();
    return c;
  }

  const studioOut = $("studioOut"), frame = $("studioFrame");
  let studioBlob = null, studioUrl = null, renderTimer = null, swapNext = false;
  function renderStudio() {
    buildCanvas().toBlob((blob) => {
      if (!blob) return;
      studioBlob = blob; studioExport.setReady(true);
      if (studioUrl) URL.revokeObjectURL(studioUrl);
      studioUrl = URL.createObjectURL(blob);
      studioOut.src = studioUrl;
      if (swapNext) { swapNext = false; frame.classList.remove("swap"); void frame.offsetWidth; frame.classList.add("swap"); }
    }, "image/png");
  }
  const scheduleStudio = () => { clearTimeout(renderTimer); renderTimer = setTimeout(renderStudio, 120); };
  function syncPost() {
    if (!state.postEdited) {
      state.post = `${(LINE[state.tpl](state[state.tpl]) || "").trim()}\n\n${SIGN}`.trim();
      $("post").value = state.post;
    }
    $("resetPost").hidden = !state.postEdited;
  }
  const studioExport = D.wireExport($("studioActions"), $("studioStatus"), {
    getBlob: () => studioBlob, filename: () => `sent-from-my-pumpfun-app-${state.tpl}.png`, getText: () => state.post
  });
  studioExport.setReady(false);

  for (const [tpl, map] of Object.entries(FIELDS)) {
    for (const [key, id] of Object.entries(map)) {
      const el = $(id);
      el.value = state[tpl][key];
      el.addEventListener("input", () => { state[tpl][key] = el.value; syncPost(); scheduleStudio(); });
    }
  }
  const fillFields = (tpl) => { for (const [key, id] of Object.entries(FIELDS[tpl])) $(id).value = state[tpl][key]; };
  function showTpl() {
    $$("#scr-studio .fields").forEach((f) => { f.hidden = f.dataset.for !== state.tpl; });
    $("fmtGroup").style.visibility = state.tpl === "shot" ? "hidden" : "visible";
  }
  const check = (name, value) => { const r = document.querySelector(`input[name="${name}"][value="${value}"]`); if (r) r.checked = true; return r; };
  function pickTpl(tpl) {
    const r = check("tpl", tpl);
    if (r) r.closest("label").scrollIntoView({ block: "nearest", inline: "center", behavior: S.reduce ? "auto" : "smooth" });
    state.tpl = tpl; showTpl(); syncPost(); swapNext = true;
  }
  $$('input[name="tpl"]').forEach((r) => r.addEventListener("change", () => { S.haptic(); state.tpl = r.value; swapNext = true; showTpl(); syncPost(); scheduleStudio(); }));
  $$('input[name="theme"]').forEach((r) => r.addEventListener("change", () => { state.theme = r.value; swapNext = true; scheduleStudio(); }));
  $$('input[name="fmt"]').forEach((r) => r.addEventListener("change", () => { state.fmt = r.value; swapNext = true; scheduleStudio(); }));
  $("idea").addEventListener("click", () => {
    S.haptic();
    const tpl = state.tpl, list = IDEAS[tpl], keys = Object.keys(FIELDS[tpl]);
    const cur = JSON.stringify(keys.map((k) => state[tpl][k]));
    let pick = list[Math.floor(Math.random() * list.length)];
    for (let i = 0; i < 8 && JSON.stringify(keys.map((k) => pick[k])) === cur; i++) pick = list[Math.floor(Math.random() * list.length)];
    Object.assign(state[tpl], pick); swapNext = true;
    fillFields(tpl); syncPost(); scheduleStudio();
  });
  $("post").addEventListener("input", (e) => { state.post = e.target.value; state.postEdited = true; syncPost(); });
  $("resetPost").addEventListener("click", () => { state.postEdited = false; syncPost(); });
  const setShot = (file) => D.loadImageFile(file, (img) => {
    state.shot.img = img; $("shotDrop").querySelector("b").textContent = "Change your screenshot"; scheduleStudio();
  });
  $("shotFile").addEventListener("change", (e) => setShot(e.target.files[0]));
  D.wireDrop($("shotDrop"), setShot);
  document.addEventListener("paste", (e) => {
    const item = [...(e.clipboardData?.items || [])].find((i) => i.type.startsWith("image/"));
    if (!item) return;
    e.preventDefault();
    if (S.isLocked && S.isLocked()) S.unlock("studio"); else S.go("studio");
    pickTpl("shot");
    setShot(item.getAsFile());
  });

  // "Make it a meme" from a post in the Signatures feed
  S.on("remix", (text) => {
    state.tweet.text = text; state.postEdited = false;
    fillFields("tweet"); pickTpl("tweet"); renderStudio();
    $("scr-studio").scrollTo({ top: 0 });
  });

  // =====================================================================
  // Trending: ready-made examples, tap to remix
  // =====================================================================
  const TRENDING = [
    { tpl: "airdrop", theme: "dark", fmt: "portrait", data: IDEAS.airdrop[0] },
    { tpl: "receipt", theme: "light", fmt: "portrait", data: IDEAS.receipt[0] },
    { tpl: "screentime", theme: "dark", fmt: "portrait", data: IDEAS.screentime[0] },
    { tpl: "mail", theme: "light", fmt: "square", data: IDEAS.mail[0] },
    { tpl: "call", theme: "dark", fmt: "portrait", data: IDEAS.call[1] },
    { tpl: "battery", theme: "dark", fmt: "square", data: IDEAS.battery[0] },
    { tpl: "weather", theme: "dark", fmt: "portrait", data: IDEAS.weather[0] },
    { tpl: "statement", theme: "light", fmt: "square", data: IDEAS.statement[1] }
  ];
  $("trending").innerHTML = TRENDING.map((t, i) => `<button type="button" class="trend" data-trend="${i}"><span class="t-img skel"></span><small>${LABEL[t.tpl]}</small></button>`).join("");
  // Render any preset without touching what the user is editing (used by the feed, stories, landing)
  function renderPreset(t, { width = 0, square = false } = {}) {
    const saved = { tpl: state.tpl, theme: state.theme, fmt: state.fmt }, keep = state[t.tpl];
    Object.assign(state, { tpl: t.tpl, theme: t.theme || "light", fmt: t.fmt || "square" }); state[t.tpl] = { ...keep, ...(t.data || {}) };
    let big;
    try { big = buildCanvas(); } finally { state[t.tpl] = keep; Object.assign(state, saved); }
    if (!width) return big;
    const c = document.createElement("canvas");
    const sw = square ? Math.min(big.width, big.height) : big.width, sh = square ? sw : big.height;
    c.width = width; c.height = Math.round((width * sh) / sw);
    c.getContext("2d").drawImage(big, (big.width - sw) / 2, (big.height - sh) / 2, sw, sh, 0, 0, c.width, c.height);
    return c;
  }
  function loadPreset(t) {
    state[t.tpl] = { ...state[t.tpl], ...(t.data || {}) }; state.theme = t.theme || state.theme; state.fmt = t.fmt || state.fmt; state.postEdited = false;
    check("theme", state.theme); check("fmt", state.fmt); fillFields(t.tpl); pickTpl(t.tpl); renderStudio();
    $("scr-studio").scrollTo({ top: 0 });
  }
  S.renderMeme = renderPreset;
  S.remixPreset = (t) => { S.go("studio"); loadPreset(t); };
  S.IDEAS = IDEAS;
  function renderThumbs() {
    const thumbs = [];
    TRENDING.forEach((t, i) => {
      const url = renderPreset(t, { width: 240, square: true }).toDataURL("image/jpeg", 0.82);
      thumbs.push(url);
      const slot = $("trending").children[i].firstElementChild;
      slot.classList.remove("skel"); slot.innerHTML = `<img src="${url}" alt="">`;
    });
    S.trendThumbs = thumbs;
    S.memesReady = true; S.emit("memes:ready");
  }
  $("trending").addEventListener("click", (e) => {
    const b = e.target.closest("[data-trend]"); if (!b) return;
    S.haptic(); loadPreset(TRENDING[b.dataset.trend]);
    frame.scrollIntoView({ block: "center", behavior: S.reduce ? "auto" : "smooth" });
  });

  // ---------- first renders (again once fonts and logo are in)
  showTpl(); syncPost(); renderStudio();
  let thumbsDone = false;
  const rerender = () => { renderStudio(); if (!thumbsDone) { thumbsDone = true; setTimeout(renderThumbs, 60); } };
  const whenLogo = (fn) => (D.LOGO.complete && D.LOGO.naturalWidth ? fn() : D.LOGO.addEventListener("load", fn, { once: true }));
  if (document.fonts && document.fonts.load) Promise.all([400, 500, 600, 700, 800].map((w) => document.fonts.load(F(w, 40))).concat([document.fonts.load(M(700, 40))])).then(() => whenLogo(rerender)).catch(rerender);
  else whenLogo(rerender);
})();
