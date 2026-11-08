// Phones: a short intro before the app. The phone mock-up slides in from the side tilted,
// straightens as you scroll, and grows into the full-screen app when you tap it.
(() => {
  const S = window.SFM, root = document.documentElement;
  if (!root.classList.contains("m-landing")) return;
  const { $, reduce, haptic } = S;
  const stage = $("stage"), phone = $("phone"), device = $("device");
  const FRAME_W = 412, FRAME_H = 866; // the 390 × 844 screen plus the frame
  const ease = (t) => 1 - Math.pow(2, -10 * t); // exponential ease-out
  let scale = 1, entry = reduce ? 0 : 1, opened = false, queued = false;

  function size() {
    scale = Math.min(1, (innerWidth - 56) / FRAME_W);
    stage.style.setProperty("--stage-h", Math.round(FRAME_H * scale + 28 + 70) + "px");
  }
  function pose() {
    queued = false;
    if (opened) return;
    // k = 1 while the phone sits low on the screen, 0 once it has risen into view
    const top = stage.getBoundingClientRect().top;
    const k = reduce ? 0 : Math.min(1, Math.max(0, (top - innerHeight * 0.06) / (innerHeight * 0.32)));
    const e = entry;
    const ry = -18 * k - 34 * e, rx = 8 * k, rz = 5 * k + 8 * e;
    phone.style.transform = `translateX(-50%) translateX(${(e * 70).toFixed(1)}vw) perspective(1600px) rotateY(${ry.toFixed(2)}deg) rotateX(${rx.toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg) scale(${(scale * (1 - 0.07 * k)).toFixed(3)})`;
    phone.style.opacity = (1 - e).toFixed(3);
  }
  const queue = () => { if (!queued) { queued = true; requestAnimationFrame(pose); } };

  // the phone arrives from the right side of the screen
  function slideIn() {
    const t0 = performance.now(), D = 1300;
    const step = (now) => {
      entry = 1 - ease(Math.min(1, (now - t0) / D));
      pose();
      if (entry > 0.001 && !opened) requestAnimationFrame(step); else { entry = 0; pose(); }
    };
    requestAnimationFrame(step);
  }

  // tap: the mock-up grows into the full-screen app, lock screen first
  function open() {
    if (opened) return;
    opened = true; haptic(12);
    const from = device.getBoundingClientRect();
    root.classList.add("m-app");
    phone.style.transform = ""; phone.style.opacity = "";
    scrollTo(0, 0);
    const to = device.getBoundingClientRect();
    if (reduce || !to.width) return;
    device.animate([
      { transformOrigin: "0 0", transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})`, borderRadius: "54px" },
      { transformOrigin: "0 0", transform: "none", borderRadius: "0px" }
    ], { duration: 650, easing: "cubic-bezier(.16, 1, .3, 1)" });
  }
  document.addEventListener("click", (e) => { if (e.target.closest("[data-m-open]")) open(); });

  size(); pose();
  addEventListener("scroll", queue, { passive: true });
  addEventListener("resize", () => { size(); queue(); });
  setTimeout(slideIn, 250);
})();
