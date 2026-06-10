import { useEffect, useState } from "react";

function injectThemeVars() {
  if (document.getElementById("af-theme-vars")) return;
  const style = document.createElement("style");
  style.id = "af-theme-vars";
  style.textContent = `
    :root {
      --af-bg:           #f4f5f7;
      --af-surface:      #ffffff;
      --af-surface2:     #f0f1f4;
      --af-border:       rgba(0,0,0,0.08);
      --af-border-hover: rgba(0,0,0,0.18);
      --af-text:         #111827;
      --af-text-muted:   #6b7280;
      --af-text-faint:   #9ca3af;
      --af-shadow:       0 2px 16px rgba(0,0,0,0.08);
      --af-shadow-hover: 0 8px 32px rgba(0,0,0,0.14);
      --af-input-bg:     #f9fafb;
      --af-header-from:  #ede9fe;
      --af-header-via:   #fdf4ff;
      --af-header-to:    #fff1f2;
      --af-accent:       #7c3aed;
      --af-shimmer1:     rgba(0,0,0,0.06);
      --af-shimmer2:     rgba(0,0,0,0.04);
    }
    .dark {
      --af-bg:           #0d0e14;
      --af-surface:      #12131a;
      --af-surface2:     #1a1b26;
      --af-border:       rgba(255,255,255,0.08);
      --af-border-hover: rgba(255,255,255,0.20);
      --af-text:         #f3f4f6;
      --af-text-muted:   #9ca3af;
      --af-text-faint:   #4b5563;
      --af-shadow:       0 2px 16px rgba(0,0,0,0.4);
      --af-shadow-hover: 0 8px 32px rgba(0,0,0,0.6);
      --af-input-bg:     rgba(255,255,255,0.05);
      --af-header-from:  rgba(109,40,217,0.30);
      --af-header-via:   rgba(192,38,211,0.18);
      --af-header-to:    rgba(219,39,119,0.10);
      --af-accent:       #a78bfa;
      --af-shimmer1:     rgba(255,255,255,0.06);
      --af-shimmer2:     rgba(255,255,255,0.03);
    }
    .af-root { color: var(--af-text); min-height: 100vh; }
    .af-surface  { background: var(--af-surface);  }
    .af-surface2 { background: var(--af-surface2); }
    .af-border   { border-color: var(--af-border); }
    @keyframes af-shimmer {
      0%   { background-position: -400px 0; }
      100% { background-position:  400px 0; }
    }
    .af-shimmer-bar {
      border-radius: 6px;
      background: linear-gradient(90deg, var(--af-shimmer1) 25%, var(--af-shimmer2) 50%, var(--af-shimmer1) 75%);
      background-size: 800px 100%;
      animation: af-shimmer 1.4s infinite linear;
    }
    .af-card {
      background: var(--af-surface);
      border: 1px solid var(--af-border);
      border-radius: 16px;
      transition: border-color .25s, box-shadow .25s, transform .2s;
      cursor: pointer;
    }
    .af-card:hover {
      border-color: var(--af-border-hover);
      box-shadow: var(--af-shadow-hover);
      transform: translateY(-2px);
    }
    .af-input {
      background: var(--af-input-bg);
      border: 1px solid var(--af-border);
      color: var(--af-text);
      border-radius: 12px;
      padding: 10px 16px;
      font-size: 13px;
      outline: none;
      transition: border-color .2s;
    }
    .af-input::placeholder { color: var(--af-text-faint); }
    .af-input:focus { border-color: var(--af-accent); }
    .af-input option { background: var(--af-surface); color: var(--af-text); }
    .af-debug {
      background: var(--af-surface2);
      border: 1px solid var(--af-border);
      border-radius: 12px;
      padding: 12px 16px;
      font-size: 11px;
      font-family: monospace;
      color: var(--af-text-muted);
      white-space: pre-wrap;
      word-break: break-all;
    }
    .af-del-btn {
      margin-top: 12px;
      width: 100%;
      padding: 7px 0;
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 8px;
      font-size: 12px;
      color: #dc2626;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: opacity .2s, background .2s;
    }
    .af-del-btn:hover:not(:disabled) { background: #fee2e2; }
    .af-del-btn:disabled { opacity: 0.5; cursor: not-allowed; }

    /* ── Modal overlay ── */
    @keyframes af-backdrop-in {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes af-modal-in {
      from { opacity: 0; transform: scale(0.88) translateY(20px); }
      to   { opacity: 1; transform: scale(1) translateY(0); }
    }
    .af-modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.55);
      backdrop-filter: blur(4px);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      animation: af-backdrop-in .2s ease;
    }
    .af-modal-box {
      background: var(--af-surface);
      border: 1px solid var(--af-border);
      border-radius: 20px;
      width: 100%;
      max-width: 560px;
      max-height: 85vh;
      overflow-y: auto;
      box-shadow: 0 24px 80px rgba(0,0,0,0.3);
      animation: af-modal-in .25s cubic-bezier(.34,1.56,.64,1);
      position: relative;
    }
    .af-modal-close {
      position: absolute;
      top: 14px;
      right: 14px;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 1px solid var(--af-border);
      background: var(--af-surface2);
      color: var(--af-text-muted);
      font-size: 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      transition: background .2s, color .2s;
    }
    .af-modal-close:hover { background: #fef2f2; color: #dc2626; border-color: #fecaca; }
  `;
  document.head.appendChild(style);
}

function normalizeRating(raw) {
  if (!raw) return "Average";
  const map = {
    excellent: "Excellent", good: "Good", average: "Average", bad: "Bad", worst: "Worst",
  };
  return map[raw.toLowerCase().trim()] || "Average";
}

function parseDate(fb) {
  const raw = fb.createdAt || fb.created_at || fb.timestamp || fb.date || fb.submittedAt;
  if (raw) { const d = new Date(raw); if (!isNaN(d)) return d; }
  if (fb._id && typeof fb._id === "string" && fb._id.length >= 8) {
    try { const ts = parseInt(fb._id.substring(0, 8), 16) * 1000; const d = new Date(ts); if (!isNaN(d)) return d; } catch (_) {}
  }
  return null;
}

function formatDate(fb) {
  const d = parseDate(fb);
  if (!d) return "Date unknown";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

const RATING_META = {
  Excellent: { emoji: "😍", score: 5, accent: "#10b981" },
  Good:      { emoji: "😊", score: 4, accent: "#3b82f6" },
  Average:   { emoji: "😐", score: 3, accent: "#f59e0b" },
  Bad:       { emoji: "😠", score: 2, accent: "#f97316" },
  Worst:     { emoji: "🤬", score: 1, accent: "#ef4444" },
};

const FILTER_OPTIONS = ["All Ratings", "Excellent", "Good", "Average", "Bad", "Worst"];

function Shimmer() {
  return (
    <div className="af-card p-5 space-y-3">
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div className="af-shimmer-bar" style={{ width: 40, height: 40, borderRadius: "50%" }} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
          <div className="af-shimmer-bar" style={{ height: 11, width: "35%" }} />
          <div className="af-shimmer-bar" style={{ height: 9, width: "25%" }} />
        </div>
        <div className="af-shimmer-bar" style={{ height: 24, width: 80, borderRadius: 999 }} />
      </div>
      <div className="af-shimmer-bar" style={{ height: 10, width: "100%" }} />
      <div className="af-shimmer-bar" style={{ height: 10, width: "70%" }} />
    </div>
  );
}

function RatingPill({ rating }) {
  const normalized = normalizeRating(rating);
  const m = RATING_META[normalized] || RATING_META.Average;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 999,
      fontSize: 11, fontWeight: 700, border: "1px solid",
      borderColor: m.accent + "40", color: m.accent, background: m.accent + "18",
      whiteSpace: "nowrap",
    }}>
      {m.emoji} {normalized}
    </span>
  );
}

function StatCard({ rating, count, total }) {
  const m = RATING_META[rating];
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  const r = 20, circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div className="af-card" style={{ padding: "16px 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, cursor: "default" }}>
      <div style={{ position: "relative", width: 56, height: 56 }}>
        <svg viewBox="0 0 50 50" style={{ width: 56, height: 56, transform: "rotate(-90deg)" }}>
          <circle cx="25" cy="25" r={r} fill="none" stroke="var(--af-border)" strokeWidth="5" />
          <circle cx="25" cy="25" r={r} fill="none" stroke={m.accent} strokeWidth="5"
            strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
            style={{ transition: "stroke-dasharray 1s ease" }} />
        </svg>
        <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
          {m.emoji}
        </span>
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: "var(--af-text)" }}>{count}</div>
        <div style={{ fontSize: 11, color: "var(--af-text-muted)", fontWeight: 600 }}>{rating}</div>
        <div style={{ fontSize: 11, color: "var(--af-text-faint)" }}>{pct}%</div>
      </div>
    </div>
  );
}

const GRAD_PAIRS = [
  ["#7c3aed", "#a855f7"], ["#0ea5e9", "#6366f1"], ["#10b981", "#14b8a6"],
  ["#f97316", "#ec4899"], ["#ef4444", "#f43f5e"],
];

// ─── Shared inner content (used in both card & modal) ───────────────────────
function FeedbackContent({ fb, index, onDelete, isModal = false }) {
  const [deleting, setDeleting] = useState(false);
  const initials = fb.userName ? fb.userName.slice(0, 2).toUpperCase() : "??";
  const date = formatDate(fb);
  const [g1, g2] = GRAD_PAIRS[index % GRAD_PAIRS.length];
  const overallRating = normalizeRating(fb.overallRating);

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this feedback? This cannot be undone.")) return;
    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://examprep360.onrender.com/api/feedbacks/${fb._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) { onDelete(fb._id); }
      else { const data = await res.json(); alert("Delete failed: " + (data?.error || res.statusText)); }
    } catch (err) { alert("Delete failed: " + err.message); }
    finally { setDeleting(false); }
  };

  const suggestionParts = fb.suggestion
    ? fb.suggestion.split(" | ").map((part, i) => {
        const match = part.match(/^\[(.+?)\]\s*(Issue|Improve):\s*(.+)$/i);
        if (match) return { mod: match[1], type: match[2], text: match[3], key: i };
        return { mod: null, type: null, text: part.trim(), key: i };
      }).filter(p => p.text)
    : [];

  return (
    <div style={{ overflow: "hidden", borderRadius: isModal ? 20 : 16 }}>
      <div style={{ height: 3, background: `linear-gradient(90deg, ${g1}, ${g2})` }} />
      <div style={{ padding: "16px 18px" }}>
        {/* user row */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
            background: `linear-gradient(135deg, ${g1}, ${g2})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 900, fontSize: 13,
          }}>
            {initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: isModal ? 15 : 13, color: "var(--af-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {fb.userName || "Anonymous"}
            </div>
            <div style={{ fontSize: 11, color: "var(--af-text-faint)", marginTop: 2 }}>
              {fb.userEmail || ""}{fb.userEmail ? " · " : ""}{date}
            </div>
          </div>
          <div style={{ flexShrink: 0 }}>
            <RatingPill rating={overallRating} />
          </div>
        </div>

        {/* ratings grid */}
        {fb.ratings && Object.keys(fb.ratings).length > 0 && (
          <div style={{
            display: "grid",
            gridTemplateColumns: isModal ? "repeat(auto-fill, minmax(140px, 1fr))" : "repeat(auto-fill, minmax(120px, 1fr))",
            gap: 6, marginBottom: 12,
          }}>
            {Object.entries(fb.ratings).map(([cat, ratingObj]) => {
              const ratingVal = typeof ratingObj === "object" ? ratingObj?.rating : ratingObj;
              return (
                <div key={cat} style={{
                  background: "var(--af-surface2)", borderRadius: 8,
                  padding: "6px 8px", display: "flex",
                  alignItems: "center", justifyContent: "space-between", gap: 4,
                }}>
                  <span style={{ fontSize: 11, color: "var(--af-text-muted)", flex: 1, minWidth: 0, overflowWrap: "break-word" }}>
                    {cat}
                  </span>
                  <RatingPill rating={ratingVal} />
                </div>
              );
            })}
          </div>
        )}

        {/* suggestions */}
        {suggestionParts.length > 0 && (
          <div>
            <p style={{
              fontSize: 10, fontWeight: 700, color: "var(--af-text-faint)",
              textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6,
            }}>
              💬 Suggestion
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {suggestionParts.map(p => (
                <div key={p.key} style={{
                  background: "var(--af-surface2)", borderRadius: 8,
                  borderLeft: `2px solid ${g1}`, padding: "8px 10px",
                }}>
                  {p.mod && (
                    <p style={{ fontSize: 10, fontWeight: 700, color: "var(--af-text-faint)", marginBottom: 3 }}>
                      {p.mod}{p.type ? ` — ${p.type}` : ""}
                    </p>
                  )}
                  <p style={{ fontSize: isModal ? 13 : 12, color: "var(--af-text-muted)", lineHeight: 1.55, margin: 0 }}>
                    {p.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <button className="af-del-btn" onClick={handleDelete} disabled={deleting}>
          🗑 {deleting ? "Deleting..." : "Delete feedback"}
        </button>
      </div>
    </div>
  );
}

// ─── Modal ───────────────────────────────────────────────────────────────────
function FeedbackModal({ fb, index, onClose, onDelete }) {
  // close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleDelete = (id) => {
    onDelete(id);
    onClose();
  };

  return (
    <div
      className="af-modal-backdrop"
      onClick={onClose}
    >
      <div
        className="af-modal-box"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="af-modal-close" onClick={onClose} title="Close (Esc)">✕</button>
        <FeedbackContent fb={fb} index={index} onDelete={handleDelete} isModal={true} />
      </div>
    </div>
  );
}

// ─── FeedbackCard ────────────────────────────────────────────────────────────
function FeedbackCard({ fb, index, onDelete, onOpen }) {
  return (
    <div
      className="af-card"
      style={{ overflow: "hidden" }}
      onClick={() => onOpen(fb, index)}
      title="Click to expand"
    >
      <FeedbackContent fb={fb} index={index} onDelete={onDelete} isModal={false} />
    </div>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────
export default function AdminFeedbacks() {
  injectThemeVars();

  const [feedbacks, setFeedbacks]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [debugLog, setDebugLog]     = useState([]);
  const [showDebug, setShowDebug]   = useState(false);

  const [search, setSearch]             = useState("");
  const [filterRating, setFilterRating] = useState("All Ratings");
  const [sort, setSort]                 = useState("newest");

  // ── Modal state ──
  const [modalFb, setModalFb]       = useState(null);
  const [modalIndex, setModalIndex] = useState(0);

  const log = (msg) => setDebugLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    log(`Token present: ${!!token}`);
    log(`Fetching: https://examprep360.onrender.com/api/feedbacks`);

    fetch("https://examprep360.onrender.com/api/feedbacks", {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
      .then(async (r) => {
        log(`HTTP status: ${r.status} ${r.statusText}`);
        const text = await r.text();
        log(`Raw response (first 300 chars): ${text.slice(0, 300)}`);
        try {
          const data = JSON.parse(text);
          if (Array.isArray(data)) {
            const normalized = data.map(fb => ({ ...fb, overallRating: normalizeRating(fb.overallRating) }));
            log(`✅ Got ${normalized.length} feedback(s)`);
            if (normalized.length > 0) log(`Sample keys: ${Object.keys(normalized[0]).join(", ")}`);
            setFeedbacks(normalized);
          } else if (data?.error) {
            log(`❌ API error: ${data.error}`);
            setFetchError(data.error);
          } else {
            log(`⚠️ Unexpected shape: ${JSON.stringify(data).slice(0, 200)}`);
            setFetchError("Unexpected response format from server.");
          }
        } catch (e) {
          log(`❌ JSON parse failed: ${e.message}`);
          setFetchError(`Could not parse server response: ${e.message}`);
        }
      })
      .catch((err) => {
        log(`❌ Fetch failed: ${err.message}`);
        setFetchError(`Network error: ${err.message}`);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = (id) => setFeedbacks(prev => prev.filter(f => f._id !== id));

  const total = feedbacks.length;
  const ratingCounts = Object.fromEntries(
    Object.keys(RATING_META).map(r => [r, feedbacks.filter(f => f.overallRating === r).length])
  );
  const avgScore = total > 0
    ? (feedbacks.reduce((s, f) => s + (RATING_META[f.overallRating]?.score || 3), 0) / total).toFixed(1)
    : "—";

  let filtered = feedbacks.filter(f => {
    const q = search.toLowerCase();
    const matchSearch = !search || f.userName?.toLowerCase().includes(q) || f.userEmail?.toLowerCase().includes(q) || f.suggestion?.toLowerCase().includes(q);
    const matchRating = filterRating === "All Ratings" || f.overallRating === filterRating;
    return matchSearch && matchRating;
  });

  if (sort === "newest") filtered = [...filtered].sort((a, b) => { const da = parseDate(a), db = parseDate(b); if (!da && !db) return 0; if (!da) return 1; if (!db) return -1; return db - da; });
  if (sort === "oldest") filtered = [...filtered].sort((a, b) => { const da = parseDate(a), db = parseDate(b); if (!da && !db) return 0; if (!da) return 1; if (!db) return -1; return da - db; });
  if (sort === "best")  filtered = [...filtered].sort((a, b) => (RATING_META[b.overallRating]?.score || 3) - (RATING_META[a.overallRating]?.score || 3));
  if (sort === "worst") filtered = [...filtered].sort((a, b) => (RATING_META[a.overallRating]?.score || 3) - (RATING_META[b.overallRating]?.score || 3));

  return (
    <div className="af-root" style={{ padding: "0 0 48px", display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Modal */}
      {modalFb && (
        <FeedbackModal
          fb={modalFb}
          index={modalIndex}
          onClose={() => setModalFb(null)}
          onDelete={handleDelete}
        />
      )}

      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, var(--af-header-from), var(--af-header-via), var(--af-header-to))`,
        border: "1px solid var(--af-border)", borderRadius: 20,
        padding: "24px 28px", position: "relative", overflow: "hidden",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, position: "relative", zIndex: 1 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 22 }}>💬</span>
              <h1 style={{ fontSize: 22, fontWeight: 900, color: "var(--af-text)", margin: 0 }}>User Feedback</h1>
            </div>
            <p style={{ fontSize: 13, color: "var(--af-text-muted)", margin: 0 }}>
              All platform feedback submitted by users — ratings, suggestions & more.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: "var(--af-text)" }}>{avgScore}</div>
              <div style={{ fontSize: 11, color: "var(--af-text-faint)" }}>Avg Score</div>
            </div>
            <div style={{ width: 1, height: 36, background: "var(--af-border)" }} />
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: "var(--af-text)" }}>{total}</div>
              <div style={{ fontSize: 11, color: "var(--af-text-faint)" }}>Total</div>
            </div>
            <button
              onClick={() => setShowDebug(d => !d)}
              style={{
                background: "var(--af-surface2)", border: "1px solid var(--af-border)",
                borderRadius: 8, padding: "5px 10px", fontSize: 11,
                color: "var(--af-text-muted)", cursor: "pointer",
              }}
              title="Toggle debug log"
            >
              🐛 Debug
            </button>
          </div>
        </div>
      </div>

      {showDebug && <div className="af-debug">{debugLog.length === 0 ? "No logs yet…" : debugLog.join("\n")}</div>}

      {fetchError && !loading && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 14, padding: "14px 18px", display: "flex", gap: 10, alignItems: "flex-start" }}>
          <span style={{ fontSize: 18 }}>⚠️</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: "#dc2626" }}>Could not load feedbacks</div>
            <div style={{ fontSize: 12, color: "#b91c1c", marginTop: 3 }}>{fetchError}</div>
            <div style={{ fontSize: 11, color: "#6b7280", marginTop: 6 }}>
              Check: Flask running on port 5000 · CORS enabled · token in localStorage · collection name "feedback" not "feedbacks"
            </div>
          </div>
        </div>
      )}

      {/* Rating distribution */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--af-text-faint)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
          Rating Distribution
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
          {Object.keys(RATING_META).map(r => (
            <StatCard key={r} rating={r} count={ratingCounts[r] || 0} total={total} />
          ))}
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
        <div style={{ position: "relative", flex: "1 1 220px" }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "var(--af-text-faint)", pointerEvents: "none" }}>🔍</span>
          <input
            type="text"
            placeholder="Search by name, email or keyword…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="af-input"
            style={{ width: "100%", paddingLeft: 36, boxSizing: "border-box" }}
          />
        </div>
        <select value={filterRating} onChange={e => setFilterRating(e.target.value)} className="af-input" style={{ cursor: "pointer" }}>
          {FILTER_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <select value={sort} onChange={e => setSort(e.target.value)} className="af-input" style={{ cursor: "pointer" }}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="best">Best Rating</option>
          <option value="worst">Worst Rating</option>
        </select>
        <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--af-text-faint)" }}>
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Cards */}
      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
          {Array.from({ length: 6 }).map((_, i) => <Shimmer key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 0", color: "var(--af-text-faint)", gap: 12 }}>
          <span style={{ fontSize: 48 }}>🤷</span>
          <p style={{ fontSize: 13, margin: 0 }}>
            {total === 0
              ? "No feedback found in database. Click 🐛 Debug above to inspect the API response."
              : "No feedback matches your current filters."}
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
          {filtered.map((fb, i) => (
            <FeedbackCard
              key={fb._id || i}
              fb={fb}
              index={i}
              onDelete={handleDelete}
              onOpen={(fb, idx) => { setModalFb(fb); setModalIndex(idx); }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
