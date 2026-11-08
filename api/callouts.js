// GET /api/callouts -> the best $App callouts, live from pump.fun, in the same shape as data/callouts.json.
// Cached 5 minutes at Vercel's edge, so pump.fun gets at most one request per 5 minutes whatever the traffic.
// If pump.fun gave you an API key or a header to send, put it in PUMPFUN_API_HEADER as "Name: value".
const CA = "49nkLrXi8nCZBVKsShDNasEtPe4Vn1mx9Xbr3kTa8pTL", KEEP = 24;
const URL_ = `https://frontend-api-v3.pump.fun/mint-positions/${CA}?sortBy=RANKED&withThesis=true&pageSize=50&platform=WEB`;

// mentions come as @[name](user-id); long posts are cut at 280 characters
const clean = (s) => {
  s = (s || "").replace(/@\[([^\]]+)\]\([^)]*\)/g, "@$1").trim();
  return s.length > 280 ? s.slice(0, 277).replace(/\s+\S*$/, "") + "…" : s;
};

function shape(positions) {
  return positions
    .filter((p) => p.callout && p.callout.thesis && !p.lowQuality)
    .slice(0, KEEP)
    .map((p, i) => {
      const c = p.callout;
      const top = (c.updates || []).filter((u) => u.content).sort((a, b) => b.likeCount - a.likeCount)[0];
      return {
        rank: i + 1, id: c.calloutId, user: p.userName, x: p.xUsername || null,
        avatar: p.profileImage || null, wallet: p.walletAddress,
        thesis: clean(c.thesis), update: top ? clean(top.content) : null,
        at: c.calloutTimestamp, mcap: Math.round(c.calledOutAtMcap || 0),
        peak: +(c.maxMultiplier || 0).toFixed(1), likes: c.likes || 0, views: c.viewCount || 0, replies: c.replyCount || 0
      };
    });
}

module.exports = async (req, res) => {
  const headers = { Accept: "application/json" };
  const extra = (process.env.PUMPFUN_API_HEADER || "").trim();
  if (extra.includes(":")) { const i = extra.indexOf(":"); headers[extra.slice(0, i).trim()] = extra.slice(i + 1).trim(); }
  try {
    const r = await fetch(URL_, { headers });
    const type = r.headers.get("content-type") || "";
    if (!r.ok || !type.includes("json")) throw new Error(`pump.fun ${r.status}${r.headers.get("cf-mitigated") ? " (cloudflare: " + r.headers.get("cf-mitigated") + ")" : ""}`);
    const callouts = shape((await r.json()).positions || []);
    if (!callouts.length) throw new Error("no callouts");
    res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=3600");
    res.status(200).json({ live: true, updated: new Date().toISOString(), mint: CA, callouts });
  } catch (e) {
    // the page falls back to data/callouts.json
    res.setHeader("Cache-Control", "public, s-maxage=60");
    res.status(502).json({ live: false, error: String(e.message || e) });
  }
};
