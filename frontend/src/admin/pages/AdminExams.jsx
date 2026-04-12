import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

const CATEGORY_COLORS = {
  Engineering:       "bg-blue-100 text-blue-700",
  Medical:           "bg-green-100 text-green-700",
  "Computer Science":"bg-cyan-100 text-cyan-700",
  Law:               "bg-amber-100 text-amber-700",
  Management:        "bg-purple-100 text-purple-700",
  Government:        "bg-rose-100 text-rose-700",
};

const STATUS_COLORS = {
  Upcoming: "bg-amber-100 text-amber-700",
  Open:     "bg-emerald-100 text-emerald-700",
  Closed:   "bg-red-100 text-red-700",
};

const LEVEL_COLORS = {
  National:   "bg-violet-100 text-violet-700",
  State:      "bg-sky-100 text-sky-700",
  University: "bg-teal-100 text-teal-700",
};

export default function AdminExams() {
  const [exams, setExams]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter]     = useState("all");
  const [levelFilter, setLevelFilter]       = useState("all");
  const [sortBy, setSortBy]           = useState("name");
  const [page, setPage]               = useState(1);
  const [toast, setToast]             = useState(null);
  const PER_PAGE = 10;
  const navigate = useNavigate();

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchExams = async () => {
    setLoading(true);
    try {
      const res = await API.get("/exams");
      setExams(res.data);
    } catch {
      showToast("Failed to load exams", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchExams(); }, []);
  useEffect(() => setPage(1), [search, categoryFilter, statusFilter, levelFilter, sortBy]);

  const filtered = useMemo(() => {
    let list = [...exams];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(e =>
        (e.name || "").toLowerCase().includes(q) ||
        (e.slug || "").toLowerCase().includes(q)
      );
    }
    if (categoryFilter !== "all") list = list.filter(e => (e.category||"").toLowerCase() === categoryFilter.toLowerCase());
    if (statusFilter   !== "all") list = list.filter(e => (e.status  ||"").toLowerCase() === statusFilter.toLowerCase());
    if (levelFilter    !== "all") list = list.filter(e => (e.level   ||"").toLowerCase() === levelFilter.toLowerCase());

    if (sortBy === "name")   list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    if (sortBy === "rating") list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (sortBy === "status") list.sort((a, b) => (a.status || "").localeCompare(b.status || ""));

    return list;
  }, [exams, search, categoryFilter, statusFilter, levelFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const deleteExam = async (exam) => {
    if (!window.confirm(`Delete "${exam.name}"? This cannot be undone.`)) return;
    try {
      await API.delete(`/exams/${exam._id}`);
      showToast("Exam deleted successfully");
      fetchExams();
    } catch {
      showToast("Delete failed", "error");
    }
  };

  // Stats — case-insensitive, null-safe
  const stats = useMemo(() => {
    const s = (v) => (v || "").toLowerCase();
    return {
      total:    exams.length,
      open:     exams.filter(e => s(e.status) === "open").length,
      upcoming: exams.filter(e => s(e.status) === "upcoming" || !e.status).length,
      closed:   exams.filter(e => s(e.status) === "closed").length,
    };
  }, [exams]);

  return (
    <div className="min-h-screen bg-slate-50 p-6">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-2xl shadow-2xl text-sm font-semibold
          ${toast.type === "error" ? "bg-red-500 text-white" : "bg-emerald-500 text-white"}`}>
          {toast.type === "error" ? "✗" : "✓"} {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800">Manage Exams</h1>
          <p className="text-slate-500 mt-1">Add, edit and manage all exam records on the platform.</p>
        </div>
        <button onClick={() => navigate("/admin/add-exam")}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-200 transition">
          + Add Exam
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Exams", value: stats.total,    color: "bg-indigo-500" },
          { label: "Open",        value: stats.open,     color: "bg-emerald-500" },
          { label: "Upcoming",    value: stats.upcoming, color: "bg-amber-500" },
          { label: "Closed",      value: stats.closed,   color: "bg-red-500" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center text-white font-black text-lg`}>
              {s.value}
            </div>
            <span className="text-sm font-semibold text-slate-600">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-4 flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <svg className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"/>
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or slug..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-100" />
        </div>

        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none bg-white focus:ring-2 focus:ring-indigo-100">
          <option value="all">All Categories</option>
          {["Engineering","Medical","Computer Science","Law","Management","Government"].map(c => (
            <option key={c} value={c.toLowerCase()}>{c}</option>
          ))}
        </select>

        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none bg-white focus:ring-2 focus:ring-indigo-100">
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="upcoming">Upcoming</option>
          <option value="closed">Closed</option>
        </select>

        <select value={levelFilter} onChange={e => setLevelFilter(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none bg-white focus:ring-2 focus:ring-indigo-100">
          <option value="all">All Levels</option>
          <option value="national">National</option>
          <option value="state">State</option>
          <option value="university">University</option>
        </select>

        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none bg-white focus:ring-2 focus:ring-indigo-100">
          <option value="name">Sort: Name</option>
          <option value="rating">Sort: Rating</option>
          <option value="status">Sort: Status</option>
        </select>

        <span className="text-xs text-slate-400 ml-auto">{filtered.length} exams found</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400">
            <div className="text-3xl mb-2 animate-pulse">⏳</div>
            <div>Loading exams...</div>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-800 text-white">
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide">#</th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide">Exam Name</th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide">Slug</th>
                <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wide">Category</th>
                <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wide">Level</th>
                <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wide">Status</th>
                <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wide">Rating</th>
                <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wide text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-16 text-center text-slate-400">
                    <div className="text-4xl mb-2">📭</div>
                    <div className="font-semibold">No exams found</div>
                    <div className="text-sm mt-1">Try changing filters or add a new exam</div>
                  </td>
                </tr>
              ) : (
                paginated.map((e, idx) => (
                  <tr key={e._id} className="hover:bg-slate-50 transition">
                    <td className="px-5 py-4 text-sm text-slate-400 font-mono">
                      {(page - 1) * PER_PAGE + idx + 1}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-800">{e.name}</div>
                      {e.exam_date && <div className="text-xs text-slate-400 mt-0.5">📅 {e.exam_date}</div>}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-indigo-600 font-mono text-xs bg-indigo-50 px-2 py-1 rounded-lg">{e.slug}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${CATEGORY_COLORS[e.category] || "bg-slate-100 text-slate-600"}`}>
                        {e.category || "General"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${LEVEL_COLORS[e.level] || "bg-slate-100 text-slate-600"}`}>
                        {e.level || "National"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[e.status] || "bg-slate-100 text-slate-600"}`}>
                        {e.status || "Upcoming"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <span className="text-amber-500 text-sm">★</span>
                        <span className="text-sm font-semibold text-slate-700">{e.rating || "—"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2 justify-center">
                        <button onClick={() => navigate(`/admin/edit-exam/${e.slug}`)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-100 text-amber-700 hover:bg-amber-200 transition">
                          ✏️ Edit
                        </button>
                        <button onClick={() => deleteExam(e)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-100 text-red-600 hover:bg-red-200 transition">
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-sm text-slate-500">Page {page} of {totalPages} · {filtered.length} total</span>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(1)} disabled={page === 1}
                className="px-2 py-1 rounded-lg text-xs text-slate-500 hover:bg-slate-100 disabled:opacity-30">«</button>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-2 py-1 rounded-lg text-xs text-slate-500 hover:bg-slate-100 disabled:opacity-30">‹</button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const p = Math.max(1, Math.min(page - 2 + i, totalPages - 4 + i));
                return (
                  <button key={p} onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold transition
                      ${page === p ? "bg-slate-800 text-white" : "text-slate-600 hover:bg-slate-100"}`}>
                    {p}
                  </button>
                );
              })}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-2 py-1 rounded-lg text-xs text-slate-500 hover:bg-slate-100 disabled:opacity-30">›</button>
              <button onClick={() => setPage(totalPages)} disabled={page === totalPages}
                className="px-2 py-1 rounded-lg text-xs text-slate-500 hover:bg-slate-100 disabled:opacity-30">»</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}