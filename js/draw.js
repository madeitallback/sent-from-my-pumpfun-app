// Canvas helpers shared by the Studio and the Profile kit, and the export buttons
// (share on phones, copy image on computers, download, post on X).
window.Draw = (() => {
  const S = window.SFM;
  const SIGN = "Sent from my Pumpfun App";
  const LOGO = new Image();
  LOGO.src = "assets/logo.png";
  const F = (w, s) => `${w} ${Math.round(s)}px Inter, "Helvetica Neue", Arial, sans-serif`;
  const M = (w, s) => `${w} ${Math.round(s)}px "Geist Mono", ui-monospace, Menlo, Consolas, monospace`;

  function wrap(ctx, text, maxW) {
    const lines = [];
    for (const para of String(text).split("\n")) {
      if (!para.trim()) { lines.push(""); continue; }
      let line = "";
      for (const word of para.split(/\s+/)) {
        const t = line ? line + " " + word : word;
        if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = word; }
        else line = t;
      }
      lines.push(line);
    }
    return lines;
  }
  function rr(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  function fitScale(measure, avail) {
    for (let s = 1; s >= 0.42; s -= 0.04) if (measure(s) <= avail) return s;
    return 0.42;
  }
  function logo(ctx, x, y, size, radius) {
    ctx.save(); rr(ctx, x, y, size, size, radius); ctx.clip();
    if (LOGO.complete && LOGO.naturalWidth) ctx.drawImage(LOGO, x, y, size, size);
    else { ctx.fillStyle = "#02f38f"; ctx.fillRect(x, y, size, size); }
    ctx.restore();
  }
  function circleLogo(ctx, cx, cy, r) {
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip(); logo(ctx, cx - r, cy - r, r * 2, 0); ctx.restore();
  }
  function magnifier(ctx, x, y, size, color) {
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = size * 0.13; ctx.lineCap = "round";
    ctx.beginPath(); ctx.arc(x + size * 0.42, y + size * 0.42, size * 0.3, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + size * 0.64, y + size * 0.64); ctx.lineTo(x + size * 0.92, y + size * 0.92); ctx.stroke();
    ctx.restore();
  }
  // Lay out a vertical list of blocks, shrinking everything until it fits, centred.
  function stack(H, pad, plan) {
    const s = fitScale((s) => plan(s).reduce((a, b) => a + b.h, 0), H - pad * 1.6);
    const items = plan(s), total = items.reduce((a, b) => a + b.h, 0);
    let y = Math.max(pad * 0.8, (H - total) / 2);
    for (const it of items) { if (it.draw) it.draw(y); y += it.h; }
  }
  const linesItem = (ctx, lines, font, lh, color, x, align = "left") => ({ h: lines.length * lh, draw: (y) => {
    ctx.font = font; ctx.fillStyle = color; ctx.textAlign = align;
    lines.forEach((l, i) => ctx.fillText(l, x, y + (i + 0.8) * lh));
  } });
  const gap = (h) => ({ h });
  function wallpaper(ctx, W, H, dark) {
    const g = ctx.createLinearGradient(0, 0, W * 0.4, H);
    if (dark) { g.addColorStop(0, "#0a1220"); g.addColorStop(0.55, "#0f252a"); g.addColorStop(1, "#0b3f2a"); }
    else { g.addColorStop(0, "#7cf3c0"); g.addColorStop(0.5, "#18d98a"); g.addColorStop(1, "#079a5e"); }
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    const glow = ctx.createRadialGradient(W * 0.7, H * 0.25, 10, W * 0.7, H * 0.25, Math.max(W, H) * 0.8);
    glow.addColorStop(0, dark ? "rgba(2,243,143,0.22)" : "rgba(255,255,255,0.35)"); glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
  }
  // The lock screen gradient from the site, for wallpapers
  function lockGradient(ctx, W, H) {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#0b1730"); g.addColorStop(0.42, "#10314a"); g.addColorStop(0.78, "#0e5440"); g.addColorStop(1, "#0b6a47");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    const blob = (x, y, rx, ry, col) => {
      ctx.save(); ctx.translate(x, y); ctx.scale(1, ry / rx);
      const r = ctx.createRadialGradient(0, 0, 0, 0, 0, rx); r.addColorStop(0, col); r.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = r; ctx.fillRect(-rx, -rx, rx * 2, rx * 2); ctx.restore();
    };
    blob(W * 0.85, H * 0.08, W * 0.7, H * 0.45, "rgba(120,170,255,0.22)");
    blob(W * 0.15, H, W * 0.9, H * 0.55, "rgba(2,243,143,0.42)");
    blob(W * 0.9, H * 0.95, W * 0.7, H * 0.4, "rgba(2,243,143,0.25)");
  }
  // The white "sent from my pumpfun app" capsule, centred on (cx, cy)
  function capsule(ctx, cx, cy, k, { delivered = true, shadow = true } = {}) {
    const text = "sent from my pumpfun app", ch = 150 * k, lg = 118 * k, padL = 16 * k, padR = 56 * k, gp = 30 * k;
    ctx.font = F(700, 74 * k); const tw = ctx.measureText(text).width;
    const cw = padL + lg + gp + tw + padR, x = cx - cw / 2, y = cy - ch / 2;
    ctx.save();
    if (shadow) { ctx.shadowColor = "rgba(0,0,0,0.28)"; ctx.shadowBlur = 40 * k; ctx.shadowOffsetY = 12 * k; }
    ctx.fillStyle = "#ffffff"; rr(ctx, x, y, cw, ch, ch / 2); ctx.fill(); ctx.restore();
    const lx = x + padL, ly = y + (ch - lg) / 2;
    circleLogo(ctx, lx + lg / 2, ly + lg / 2, lg / 2);
    ctx.strokeStyle = "#e6e6e6"; ctx.lineWidth = 2 * k; ctx.beginPath(); ctx.arc(lx + lg / 2, ly + lg / 2, lg / 2, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = "#0b0b0b"; ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.font = F(700, 74 * k);
    ctx.fillText(text, lx + lg + gp, y + ch / 2 + 2 * k);
    ctx.textBaseline = "alphabetic";
    if (delivered) { ctx.textAlign = "right"; ctx.fillStyle = "rgba(255,255,255,0.8)"; ctx.font = F(500, 32 * k); ctx.fillText("Delivered", x + cw - 34 * k, y + ch + 50 * k); }
    return { x, y, w: cw, h: ch };
  }
  function cover(ctx, img, x, y, w, h) {
    const r = Math.max(w / img.naturalWidth, h / img.naturalHeight), sw = w / r, sh = h / r;
    ctx.drawImage(img, (img.naturalWidth - sw) / 2, (img.naturalHeight - sh) / 2, sw, sh, x, y, w, h);
  }
  function silhouette(ctx, x, y, w, h) {
    const g = ctx.createLinearGradient(x, y, x, y + h); g.addColorStop(0, "#3a3a42"); g.addColorStop(1, "#24242a");
    ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = "#6b6b75";
    ctx.beginPath(); ctx.arc(x + w / 2, y + h * 0.4, w * 0.17, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(x + w / 2, y + h * 0.95, w * 0.33, h * 0.3, 0, Math.PI, 0); ctx.fill();
  }
  function star(ctx, cx, cy, r, fill) {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, rad = i % 2 ? r * 0.45 : r; ctx.lineTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad); }
    ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
  }
  function loadImageFile(file, done) {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => { const img = new Image(); img.onload = () => done(img); img.src = reader.result; };
    reader.readAsDataURL(file);
  }
  function wireDrop(el, onFile) {
    ["dragenter", "dragover"].forEach((ev) => el.addEventListener(ev, (e) => { e.preventDefault(); el.classList.add("over"); }));
    ["dragleave", "drop"].forEach((ev) => el.addEventListener(ev, (e) => { e.preventDefault(); el.classList.remove("over"); }));
    el.addEventListener("drop", (e) => onFile(e.dataTransfer.files[0]));
  }

  // ---------- export buttons
  const coarse = matchMedia("(pointer: coarse)").matches;
  const canShareFiles = (() => {
    try { return !!(navigator.canShare && navigator.canShare({ files: [new File([new Blob(["x"], { type: "image/png" })], "x.png", { type: "image/png" })] })); }
    catch { return false; }
  })();
  const canCopyImg = !!(window.ClipboardItem && navigator.clipboard && navigator.clipboard.write);
  function wireExport(root, statusEl, { getBlob, filename, getText }) {
    const btn = (a) => root.querySelector(`[data-act="${a}"]`);
    let statusTimer;
    const status = (nodes) => {
      statusEl.replaceChildren(...(Array.isArray(nodes) ? nodes : [nodes]));
      clearTimeout(statusTimer); statusTimer = setTimeout(() => statusEl.replaceChildren(), 9000);
    };
    const shareFirst = canShareFiles && (coarse || !canCopyImg);
    const share = btn("share"), copyimg = btn("copyimg"), dl = btn("download"), copytext = btn("copytext"), x = btn("x");
    share.hidden = !canShareFiles;
    copyimg.hidden = !canCopyImg || shareFirst;
    (shareFirst ? share : canCopyImg ? copyimg : dl).classList.add("primary");
    if (shareFirst) root.prepend(share);

    share.addEventListener("click", async () => {
      const blob = getBlob(); if (!blob) return;
      const file = new File([blob], filename(), { type: "image/png" });
      const data = { files: [file] }; const text = getText && getText(); if (text) data.text = text;
      try { await navigator.share(data); S.delivered(); }
      catch (e) { if (!e || e.name !== "AbortError") status("Sharing is blocked here. Use Download instead."); }
    });
    copyimg.addEventListener("click", async () => {
      const blob = getBlob(); if (!blob) return;
      try { await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]); S.delivered("Image copied · paste it anywhere"); }
      catch { status("Copying images is blocked in this browser. Use Download instead."); }
    });
    dl.addEventListener("click", () => {
      const blob = getBlob(); if (!blob) return;
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = filename();
      document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 5000);
      S.delivered("Saved to your downloads");
    });
    if (copytext) copytext.addEventListener("click", async () => {
      if (await S.copyText(getText())) S.toast("Post text copied");
      else status("Copy is blocked here. Select the post text and copy it by hand.");
    });
    if (x) x.addEventListener("click", async () => {
      // copy the image first (while the click still counts as a user action), then open X with the text
      const blob = getBlob(), text = (getText && getText()) || SIGN;
      let copied = false;
      if (blob && canCopyImg && !coarse) { try { await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]); copied = true; } catch {} }
      const w = window.open("https://x.com/intent/post?text=" + encodeURIComponent(text), "_blank");
      if (w) w.opener = null;
      if (copied) S.toast("Image copied", { sub: "Paste it in the post on X", mark: "check" });
      if (!w) {
        const a = document.createElement("a"); a.href = "https://x.com/intent/post?text=" + encodeURIComponent(text); a.target = "_blank"; a.rel = "noopener"; a.textContent = "Open X";
        status([a, copied ? ", then paste the image." : "."]);
      }
    });
    return { setReady: (ok) => root.querySelectorAll("button").forEach((b) => { b.disabled = !ok; }) };
  }

  return { SIGN, LOGO, F, M, wrap, rr, fitScale, logo, circleLogo, magnifier, stack, linesItem, gap, wallpaper, lockGradient, capsule, cover, silhouette, star, loadImageFile, wireDrop, wireExport };
})();
