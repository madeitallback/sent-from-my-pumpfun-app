// Refreshes data/callouts.json with the best $App callouts from pump.fun.
//
// pump.fun only lets its own site read callouts (no public API, no cross-site access),
// so this runs in YOUR browser, on pump.fun, with what you can already see there:
//   1. open https://pump.fun/coin/49nkLrXi8nCZBVKsShDNasEtPe4Vn1mx9Xbr3kTa8pTL
//   2. open the console (F12 > Console), paste this whole file, press Enter
//   3. a callouts.json downloads: put it in data/ and redeploy
(async () => {
  const CA = "49nkLrXi8nCZBVKsShDNasEtPe4Vn1mx9Xbr3kTa8pTL", KEEP = 24;
  const url = `https://frontend-api-v3.pump.fun/mint-positions/${CA}?sortBy=RANKED&withThesis=true&pageSize=50&platform=WEB`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("pump.fun answered " + res.status + ". Open the coin page first, then retry.");
  // mentions come as @[name](user-id); long posts are cut at 280 characters
  const clean = (s) => {
    s = (s || "").replace(/@\[([^\]]+)\]\([^)]*\)/g, "@$1").trim();
    return s.length > 280 ? s.slice(0, 277).replace(/\s+\S*$/, "") + "…" : s;
  };
  const list = (await res.json()).positions
    .filter((p) => p.callout && p.callout.thesis && !p.lowQuality)
    .slice(0, KEEP)
    .map((p, i) => {
      const c = p.callout;
      // the most liked follow-up post, for callouts whose thesis is only the signature
      const top = (c.updates || []).filter((u) => u.content).sort((a, b) => b.likeCount - a.likeCount)[0];
      return {
        rank: i + 1, id: c.calloutId, user: p.userName, x: p.xUsername || null,
        avatar: p.profileImage || null, wallet: p.walletAddress,
        thesis: clean(c.thesis), update: top ? clean(top.content) : null,
        at: c.calloutTimestamp, mcap: Math.round(c.calledOutAtMcap || 0),
        peak: +(c.maxMultiplier || 0).toFixed(1), likes: c.likes || 0, views: c.viewCount || 0, replies: c.replyCount || 0
      };
    });
  const json = JSON.stringify({ updated: new Date().toISOString(), mint: CA, callouts: list }, null, 1);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([json], { type: "application/json" }));
  a.download = "callouts.json"; a.click();
  console.log(`callouts.json: ${list.length} callouts`);
  return json;
})();
