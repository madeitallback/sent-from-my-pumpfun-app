// GET /api/leaderboard?period=day|week|all
// -> { configured, period, updated, rows: [{ rank, username, name, avatar, count }] }
const { configured, db, leaderboard, PERIODS } = require("./_lib");

module.exports = async (req, res) => {
  const period = PERIODS[req.query.period] ? req.query.period : "week";
  if (!configured()) return res.status(200).json({ configured: false, period, rows: [] });
  try {
    const since = period === "all" ? null : new Date(Date.now() - PERIODS[period]).toISOString();
    const cols = "author_id,username,name,avatar,author_created,created_at,text_norm";
    // read in pages of 1000 (Supabase's default cap)
    const rows = [];
    for (let from = 0; from < 50000; from += 1000) {
      const page = await db(`posts?select=${cols}&order=created_at.asc&offset=${from}&limit=1000${since ? "&created_at=gte." + since : ""}`);
      rows.push(...page);
      if (page.length < 1000) break;
    }
    res.setHeader("Cache-Control", "public, s-maxage=600, stale-while-revalidate=3600");
    res.status(200).json({ configured: true, period, updated: new Date().toISOString(), rows: leaderboard(rows, period) });
  } catch (e) {
    res.status(500).json({ configured: true, period, rows: [], error: String(e.message || e) });
  }
};
