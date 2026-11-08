// Profile kit: PFP styles, banners, phone wallpapers, stickers and an email signature.
// Photos are read locally and never leave the device.
(() => {
  const S = window.SFM, D = window.Draw;
  const { $, $$ } = S;
  const { SIGN, F, rr, logo, circleLogo, cover, silhouette, capsule, lockGradient } = D;

  const kit = { style: "badge", img: null, wpStyle: "signature", wpDevice: "iphone", sticker: "pill", sig: "logo" };
  const PFP = ["badge", "ring", "neon", "delivered", "green"];
  const photo = (ctx, x, y, w, h) => (kit.img ? cover(ctx, kit.img, x, y, w, h) : silhouette(ctx, x, y, w, h));
  const clipCircle = (ctx, cx, cy, r, fn) => { ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip(); fn(); ctx.restore(); };
  function cornerBadge(ctx, Sz) {
    const cx = Sz * 0.725, cy = Sz * 0.725, r = Sz * 0.125;
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,0.28)"; ctx.shadowBlur = Sz * 0.03; ctx.shadowOffsetY = Sz * 0.008;
    ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.arc(cx, cy, r + Sz * 0.018, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    circleLogo(ctx, cx, cy, r);
  }
  function ringText(ctx, text, cx, cy, r, size, color) {
    ctx.save(); ctx.fillStyle = color; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    const circ = 2 * Math.PI * r;
    let chars, widths, total;
    for (;; size -= 1) {
      ctx.font = F(800, size); chars = [...text]; widths = chars.map((c) => ctx.measureText(c).width);
      total = widths.reduce((a, b) => a + b, 0);
      if (total <= circ * 0.9 || size < 10) break;
    }
    const extra = (circ - total) / chars.length;
    let a = -Math.PI / 2 - (widths[0] + extra) / 2 / r;
    chars.forEach((ch, i) => {
      const w = widths[i] + extra, mid = a + w / 2 / r;
      ctx.save(); ctx.translate(cx + Math.cos(mid) * r, cy + Math.sin(mid) * r); ctx.rotate(mid + Math.PI / 2);
      ctx.fillText(ch, 0, 0); ctx.restore();
      a += w / r;
    });
    ctx.restore();
  }

  // ---------- PFP styles (1000 × 1000, X and LinkedIn crop them to a circle)
  function drawBadge(ctx, Sz) { photo(ctx, 0, 0, Sz, Sz); cornerBadge(ctx, Sz); }
  function drawRing(ctx, Sz) {
    const c = Sz / 2;
    ctx.fillStyle = "#02f38f"; ctx.fillRect(0, 0, Sz, Sz);
    const g = ctx.createRadialGradient(c, c, Sz * 0.38, c, c, Sz * 0.5); g.addColorStop(0, "#02f38f"); g.addColorStop(1, "#00d97c");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(c, c, Sz * 0.5, 0, Math.PI * 2); ctx.fill();
    ringText(ctx, "SENT FROM MY PUMPFUN APP • SENT FROM MY PUMPFUN APP • ", c, c, Sz * 0.445, Sz * 0.056, "#04301d");
    ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.arc(c, c, Sz * 0.392, 0, Math.PI * 2); ctx.fill();
    clipCircle(ctx, c, c, Sz * 0.38, () => photo(ctx, c - Sz * 0.38, c - Sz * 0.38, Sz * 0.76, Sz * 0.76));
  }
  function drawNeon(ctx, Sz) {
    const c = Sz / 2;
    ctx.fillStyle = "#040806"; ctx.fillRect(0, 0, Sz, Sz);
    const g = ctx.createRadialGradient(c, c, Sz * 0.3, c, c, Sz * 0.5); g.addColorStop(0, "rgba(2,243,143,0.25)"); g.addColorStop(1, "rgba(2,243,143,0)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, Sz, Sz);
    clipCircle(ctx, c, c, Sz * 0.37, () => photo(ctx, c - Sz * 0.37, c - Sz * 0.37, Sz * 0.74, Sz * 0.74));
    ctx.save(); ctx.strokeStyle = "#02f38f"; ctx.lineCap = "round";
    for (const [blur, w, a] of [[Sz * 0.06, Sz * 0.03, 0.6], [Sz * 0.025, Sz * 0.018, 0.9], [0, Sz * 0.008, 1]]) {
      ctx.shadowColor = "#02f38f"; ctx.shadowBlur = blur; ctx.globalAlpha = a; ctx.lineWidth = w;
      ctx.beginPath(); ctx.arc(c, c, Sz * 0.405, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.restore();
    ctx.save(); ctx.strokeStyle = "#d9fbe9"; ctx.lineWidth = Sz * 0.004; ctx.beginPath(); ctx.arc(c, c, Sz * 0.405, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
    // pill on the ring, bottom right
    const a = Math.PI * 0.25, px = c + Math.cos(a) * Sz * 0.405, py = c + Math.sin(a) * Sz * 0.405, r = Sz * 0.085;
    ctx.save(); ctx.shadowColor = "#02f38f"; ctx.shadowBlur = Sz * 0.04; ctx.fillStyle = "#040806"; ctx.beginPath(); ctx.arc(px, py, r + Sz * 0.016, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    circleLogo(ctx, px, py, r);
  }
  function drawDeliveredPfp(ctx, Sz) {
    photo(ctx, 0, 0, Sz, Sz);
    const g = ctx.createLinearGradient(0, Sz * 0.45, 0, Sz); g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(1, "rgba(0,0,0,0.55)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, Sz, Sz);
    ctx.font = F(700, 74); const w1 = 16 + 118 + 30 + ctx.measureText("sent from my pumpfun app").width + 56;
    capsule(ctx, Sz / 2, Sz * 0.69, (Sz * 0.78) / w1);
  }
  function drawGreen(ctx, Sz) {
    photo(ctx, 0, 0, Sz, Sz);
    try {
      const im = ctx.getImageData(0, 0, Sz, Sz), px = im.data;
      for (let i = 0; i < px.length; i += 4) {
        let l = (0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2]) / 255;
        l = Math.min(1, Math.max(0, (l - 0.5) * 1.2 + 0.52));
        // duotone: deep green shadows → neon green highlights
        px[i] = 4 + l * (180 - 4); px[i + 1] = 40 + l * (255 - 40); px[i + 2] = 24 + l * (200 - 24);
      }
      ctx.putImageData(im, 0, 0);
    } catch {}
    cornerBadge(ctx, Sz);
  }

  // ---------- banners
  function drawHeader(ctx, W, H, k) {
    const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, "#1ff59a"); g.addColorStop(1, "#02c774");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    const glow = ctx.createRadialGradient(W * 0.8, H * 0.1, 10, W * 0.8, H * 0.1, W * 0.6);
    glow.addColorStop(0, "rgba(255,255,255,0.35)"); glow.addColorStop(1, "rgba(255,255,255,0)"); ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
    const text = "sent from my pumpfun app", ch = 150 * k, lg = 118 * k, padL = 16 * k, padR = 56 * k, gp = 30 * k;
    ctx.font = F(700, 74 * k); const tw = ctx.measureText(text).width;
    const cw = padL + lg + gp + tw + padR, cx = Math.min(W - cw - 60, W * 0.56 - cw / 2 + 60), cy = H / 2 - ch / 2 - 16 * k;
    ctx.save(); ctx.shadowColor = "rgba(4,48,29,0.25)"; ctx.shadowBlur = 40 * k; ctx.shadowOffsetY = 12 * k;
    ctx.fillStyle = "#ffffff"; rr(ctx, cx, cy, cw, ch, ch / 2); ctx.fill(); ctx.restore();
    const lx = cx + padL, ly = cy + (ch - lg) / 2;
    circleLogo(ctx, lx + lg / 2, ly + lg / 2, lg / 2);
    ctx.strokeStyle = "#e6e6e6"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(lx + lg / 2, ly + lg / 2, lg / 2, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = "#0b0b0b"; ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.font = F(700, 74 * k);
    ctx.fillText(text, lx + lg + gp, cy + ch / 2 + 2 * k);
    ctx.textBaseline = "alphabetic"; ctx.textAlign = "right"; ctx.fillStyle = "rgba(4,48,29,0.75)"; ctx.font = F(500, 30 * k);
    ctx.fillText("Delivered", cx + cw - 34 * k, cy + ch + 46 * k);
  }

  // ---------- phone wallpaper (top third left empty for the phone's own clock)
  function drawWallpaper(ctx, W, H) {
    lockGradient(ctx, W, H);
    ctx.font = F(700, 74); const w1 = 16 + 118 + 30 + ctx.measureText("sent from my pumpfun app").width + 56;
    const k = (W * 0.84) / w1;
    if (kit.wpStyle === "clock") {
      ctx.save(); ctx.textAlign = "center"; ctx.fillStyle = "rgba(255,255,255,0.10)"; ctx.font = F(800, W * 0.38);
      ctx.fillText("19:19", W / 2, H * 0.68); ctx.restore();
    }
    capsule(ctx, W / 2, H * (kit.wpStyle === "clock" ? 0.6 : 0.56), k);
    ctx.textAlign = "center"; ctx.fillStyle = "rgba(255,255,255,0.45)"; ctx.font = F(600, W * 0.026);
    ctx.fillText("$APP · EVERY CYCLE HAS A SIGNATURE", W / 2, H * 0.84);
  }

  // ---------- stickers (transparent PNG)
  function stickerCanvas() {
    const c = document.createElement("canvas"), g = c.getContext("2d");
    if (kit.sticker === "pill") {
      c.width = c.height = 900;
      g.save(); g.shadowColor = "rgba(0,0,0,0.3)"; g.shadowBlur = 30; g.shadowOffsetY = 10;
      g.fillStyle = "#ffffff"; rr(g, 50, 50, 800, 800, 210); g.fill(); g.restore();
      logo(g, 90, 90, 720, 175);
    } else if (kit.sticker === "capsule") {
      c.width = 1400; c.height = 470;
      g.save(); g.shadowColor = "rgba(0,0,0,0.25)"; g.shadowBlur = 30; g.shadowOffsetY = 8;
      g.fillStyle = "#ffffff"; rr(g, 30, 50, 1340, 210, 105); g.fill(); g.restore();
      g.font = F(700, 74); const w1 = 16 + 118 + 30 + g.measureText("sent from my pumpfun app").width + 56;
      capsule(g, 700, 155, 1290 / w1, { delivered: false, shadow: false });
      g.font = F(700, 52); const t = "Delivered ✓✓", tw = g.measureText(t).width + 80;
      g.fillStyle = "#ffffff"; rr(g, 1370 - tw - 20, 300, tw + 20, 120, 60); g.fill();
      g.fillStyle = "#0b0b0e"; rr(g, 1370 - tw - 10, 310, tw, 100, 50); g.fill();
      g.fillStyle = "#86efac"; g.textAlign = "center"; g.fillText(t, 1370 - 10 - tw / 2, 378);
    } else {
      c.width = 1300; c.height = 560;
      g.textAlign = "center"; g.textBaseline = "middle"; g.font = F(800, 380); g.lineJoin = "round";
      g.save(); g.shadowColor = "rgba(0,0,0,0.3)"; g.shadowBlur = 30; g.shadowOffsetY = 10;
      g.strokeStyle = "#ffffff"; g.lineWidth = 70; g.strokeText("19:19", 650, 290); g.restore();
      g.strokeStyle = "#02c774"; g.lineWidth = 26; g.strokeText("19:19", 650, 290);
      const gr = g.createLinearGradient(0, 120, 0, 460); gr.addColorStop(0, "#ffffff"); gr.addColorStop(1, "#d9fbe9");
      g.fillStyle = gr; g.fillText("19:19", 650, 290);
    }
    return c;
  }

  // ---------- render
  const kitOut = $("kitOut"), frame = $("kitFrame");
  let kitBlob = null, kitUrl = null;
  function buildCanvas() {
    const c = document.createElement("canvas"), g = c.getContext("2d");
    const st = kit.style;
    if (st === "header") { c.width = 1500; c.height = 500; drawHeader(g, 1500, 500, 1); }
    else if (st === "linkedin") { c.width = 1584; c.height = 396; drawHeader(g, 1584, 396, 0.86); }
    else if (st === "wallpaper") { const [W, H] = kit.wpDevice === "iphone" ? [1179, 2556] : [1080, 2400]; c.width = W; c.height = H; drawWallpaper(g, W, H); }
    else if (st === "sticker") return stickerCanvas();
    else { c.width = c.height = 1000; ({ badge: drawBadge, ring: drawRing, neon: drawNeon, delivered: drawDeliveredPfp, green: drawGreen })[st](g, 1000); }
    return c;
  }
  // render a style without changing what the user picked (used by the stories)
  S.renderKit = (style) => { const prev = kit.style; kit.style = style; try { return buildCanvas(); } finally { kit.style = prev; } };
  function renderKit() {
    if (kit.style === "email") return;
    buildCanvas().toBlob((blob) => {
      if (!blob) return;
      kitBlob = blob; kitExport.setReady(true);
      if (kitUrl) URL.revokeObjectURL(kitUrl);
      kitUrl = URL.createObjectURL(blob); kitOut.src = kitUrl;
      frame.classList.remove("swap"); void frame.offsetWidth; frame.classList.add("swap");
    }, "image/png");
  }
  const FILES = {
    header: "sent-from-my-pumpfun-app-x-banner.png", linkedin: "sent-from-my-pumpfun-app-linkedin-banner.png",
    wallpaper: () => `sent-from-my-pumpfun-app-wallpaper-${kit.wpDevice}.png`, sticker: () => `sticker-${kit.sticker}.png`
  };
  const kitExport = D.wireExport($("kitActions"), $("kitStatus"), {
    getBlob: () => kitBlob,
    filename: () => { const f = FILES[kit.style]; return typeof f === "function" ? f() : f || `pfp-sent-from-my-pumpfun-app-${kit.style}.png`; },
    getText: null
  });
  kitExport.setReady(false);

  const HINTS = {
    badge: "X and LinkedIn crop your picture into a circle. The badge sits inside it.",
    ring: "The signature wraps your picture. Made for a circle crop.",
    neon: "A neon ring that glows on dark mode. Best on X.",
    delivered: "Your photo, with the bubble everyone recognises.",
    green: "Your photo in $App green, with the badge.",
    header: "1500 × 500, the size X asks for. The signature sits clear of your PFP.",
    linkedin: "1584 × 396, the size LinkedIn asks for. The signature sits clear of your photo.",
    wallpaper: "Full resolution for your phone. The top stays clear for your clock.",
    sticker: "Transparent PNG. Drop it on screenshots, stories, Telegram.",
    email: "Your emails will say where they were sent from. Even the ones to your boss."
  };
  function syncKitUI() {
    const st = kit.style, banner = st === "header" || st === "linkedin";
    $("kitUpload").hidden = !PFP.includes(st);
    $("wpSeg").hidden = st !== "wallpaper";
    $("stSeg").hidden = st !== "sticker";
    $("emailSig").hidden = st !== "email";
    frame.hidden = st === "email";
    $("kitActions").hidden = st === "email";
    $("sigActions").hidden = st !== "email";
    frame.className = "frame " + (banner ? "wide-prev" : st === "wallpaper" ? "tall-prev" : st === "sticker" ? "sticker-prev" : "round-prev");
    kitOut.alt = banner ? "Banner with the signature" : st === "wallpaper" ? "Phone wallpaper" : st === "sticker" ? "Sticker" : "Your profile picture";
    $("kitHint").textContent = HINTS[st];
    if (st === "email") renderSig();
  }
  $$('input[name="kit"]').forEach((r) => r.addEventListener("change", () => { S.haptic(); kit.style = r.value; $("kitStatus").textContent = ""; syncKitUI(); renderKit(); }));
  $$('input[name="wpStyle"]').forEach((r) => r.addEventListener("change", () => { kit.wpStyle = r.value; renderKit(); }));
  $$('input[name="wpDevice"]').forEach((r) => r.addEventListener("change", () => { kit.wpDevice = r.value; renderKit(); }));
  $$('input[name="sticker"]').forEach((r) => r.addEventListener("change", () => { kit.sticker = r.value; renderKit(); }));
  const setKitImg = (file) => D.loadImageFile(file, (img) => { kit.img = img; $("kitDrop").querySelector("b").textContent = "Change your PFP"; renderKit(); });
  $("kitFile").addEventListener("change", (e) => setKitImg(e.target.files[0]));
  D.wireDrop($("kitDrop"), setKitImg);

  // ---------- email signature (rich text, pasted into Gmail / Outlook / Apple Mail)
  const sigHtml = (src) => kit.sig === "logo"
    ? `<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif"><tr><td style="padding-right:8px;vertical-align:middle"><img src="${src}" width="22" height="22" alt="" style="display:block;border-radius:11px"></td><td style="vertical-align:middle;font-size:13px;color:#6b7280"><a href="${S.SITE}" style="color:#6b7280;text-decoration:none">${SIGN}</a></td></tr></table>`
    : `<span style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#6b7280">${SIGN}</span>`;
  function renderSig() { $("sigPreview").innerHTML = sigHtml("assets/logo.png"); }
  $$('input[name="sigStyle"]').forEach((r) => r.addEventListener("change", () => { kit.sig = r.value; renderSig(); }));
  $("copySig").addEventListener("click", async () => {
    const html = sigHtml(S.SITE + "assets/logo.png");
    try {
      await navigator.clipboard.write([new ClipboardItem({ "text/html": new Blob([html], { type: "text/html" }), "text/plain": new Blob([SIGN], { type: "text/plain" }) })]);
      S.delivered("Signature copied · paste it in your mail settings");
    } catch {
      S.toast((await S.copyText(SIGN)) ? "Copied as plain text" : "Copy blocked");
    }
  });

  syncKitUI(); renderKit();
  const rerender = () => renderKit();
  if (D.LOGO.complete && D.LOGO.naturalWidth) setTimeout(rerender, 0); else D.LOGO.addEventListener("load", rerender, { once: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(rerender);
})();
