// Landing around the phone (tablet and desktop). On desktop, scrolling drives the phone
// (lock → feed → market → studio → kit), the phone straightens out of its hero tilt,
// and each section shows one signature detail fed by the live data.
(() => {
  const S = window.SFM;
  const { $, $$, reduce, usd, ago } = S;
  if (!matchMedia("(min-width: 720px) and (min-height: 640px)").matches) return;

  // ---------- the brand goes back to the top (tablet and desktop)
  let lenis = null;
  const toTop = () => (lenis ? lenis.scrollTo(0) : scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }));
  document.querySelector(".lnav-brand").addEventListener("click", (e) => { e.preventDefault(); toTop(); });

  if (!S.landing) return; // tablet stops here: header + headline + the phone, nothing scroll-driven

  // ---------- three Studio memes fanned out next to the Create section
  const FAN = [["mail", "light", 0], ["airdrop", "dark", 0], ["statement", "light", 1]]
    .map(([tpl, theme, i]) => ({ tpl, theme, fmt: "square", data: (S.IDEAS[tpl] || [])[i] }));
  const jpeg = (t, w) => new Promise((res) => S.renderMeme(t, { width: w }).toBlob((b) => res(b ? URL.createObjectURL(b) : ""), "image/jpeg", 0.85));
  async function buildVisuals() {
    if ($("sigFan").children.length) return;
    $("sigFan").innerHTML = (await Promise.all(FAN.map((t) => jpeg(t, 264)))).map((u) => `<img src="${u}" alt="">`).join("");
  }
  if (S.memesReady) buildVisuals(); else S.on("memes:ready", buildVisuals);

  // ---------- smooth scroll (Lenis), never inside the phone: it scrolls its own screens
  if (window.Lenis && !reduce) {
    lenis = new Lenis({ lerp: 0.1, prevent: (node) => !!(node.closest && node.closest("#device")) });
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
  const scrollToEl = (el) => (lenis ? lenis.scrollTo(el, { offset: -40 }) : el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" }));

  // ---------- each section tells the phone which screen to show
  const sections = $$("[data-phone]"), rail = $$(".l-rail span"), links = $$(".lnav-links [data-step]");
  let active = null;
  function activate(sec) {
    if (active === sec) return;
    active = sec;
    const i = sections.indexOf(sec), target = sec.dataset.phone;
    sections.forEach((s) => s.classList.toggle("active", s === sec));
    rail.forEach((r, j) => r.classList.toggle("on", j === i));
    links.forEach((a) => a.classList.toggle("on", a.dataset.step === target));
    if (target === "lock") S.relock();
    else if (S.isLocked()) S.unlock(target);
    else S.go(target);
  }
  const io = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) activate(e.target); }), { rootMargin: "-45% 0px -45% 0px" });
  sections.forEach((s) => io.observe(s));
  // text appears as soon as a section comes into view, and never dims again
  const reveal = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("seen"); reveal.unobserve(e.target); } }), { rootMargin: "0px 0px -15% 0px" });
  $$(".l-step").forEach((s) => reveal.observe(s));
  rail.forEach((r, i) => r.addEventListener("click", () => scrollToEl(sections[i])));
  links.forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); scrollToEl(sections.find((s) => s.dataset.phone === a.dataset.step)); }));

  // ---------- the phone: tilted in the hero, straight once you scroll, flat when you reach for it
  const phone = $("phone"), device = $("device");
  let over = false, mx = 0, my = 0, queued = false;
  function pose() {
    queued = false;
    if (reduce) return;
    if (over) { phone.style.transform = "perspective(1800px)"; return; }
    const t = Math.min(1, scrollY / (innerHeight * 0.55)), k = 1 - t;
    const ry = -16 * k - mx * 5, rx = 7 * k + my * 3, rz = 4 * k;
    // a touch smaller while tilted, so the turned corners stay inside the viewport
    phone.style.transform = `perspective(1800px) rotateY(${ry.toFixed(2)}deg) rotateX(${rx.toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg) scale(${(1 - 0.09 * k).toFixed(3)})`;
  }
  const queue = () => { if (!queued) { queued = true; requestAnimationFrame(pose); } };
  device.addEventListener("pointerenter", () => { over = true; queue(); });
  device.addEventListener("pointerleave", () => { over = false; queue(); });
  addEventListener("pointermove", (e) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; queue(); }, { passive: true });
  addEventListener("scroll", queue, { passive: true });
  pose();

  // ---------- signature details, fed by the live data
  S.on("trades:init", (list) => { const t = list.find((x) => x.kind === "buy"); if (t) notif(t); });
  S.on("trade", (t) => { if (t.kind === "buy") notif(t); });
  function notif(t) {
    $("sigNotifMsg").textContent = `New buy: ${t.sol.toFixed(2)} SOL (${usd(t.usd)}). Sent from their app.`;
    $("sigNotifTime").textContent = ago(t.ts);
  }
  S.on("stats", (s) => {
    if (!s.mcap) return;
    // same log scale as the Market screen's road (a straight % of $1B would read 0.00%)
    const R = S.road; if (!R) return;
    const next = R.nextStop(s.mcap);
    $("sigRoadTitle").textContent = "Road to $1B";
    $("sigRoadPct").textContent = next ? `Next ${R.label(next)}` : "Sent.";
    $("sigRoadFill").style.width = Math.max(2, R.pos(s.mcap) * 100) + "%";
  });
})();
