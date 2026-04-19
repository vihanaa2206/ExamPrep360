import { useEffect, useState } from "react";
import API from "../../services/api";
import {
  MessageSquare, Building2, Clock, CheckCircle,
  Send, RefreshCw, ChevronDown, ChevronUp,
  Search, AlertCircle, TrendingUp,
} from "lucide-react";

const API_BASE = "https://examprep360-production.up.railway.app/api";

export default function AdminQueries() {
  // ── existing ask queries (unchanged) ─────────────────────
  const [queries,  setQueries]  = useState([]);
  const [answers,  setAnswers]  = useState({});

  // ── NEW: contact + advertise queries ─────────────────────
  const [contactQueries, setContactQueries] = useState([]);
  const [stats,          setStats]          = useState(null);
  const [activeTab,      setActiveTab]      = useState("ask"); // ask | contact | advertise
  const [expanded,       setExpanded]       = useState(null);
  const [replyText,      setReplyText]      = useState({});
  const [sending,        setSending]        = useState(null);
  const [search,         setSearch]         = useState("");
  const [statusFilter,   setStatusFilter]   = useState("all");
  const [toast,          setToast]          = useState(null);

  // ── fetch ask queries (existing logic) ───────────────────
  const fetchQueries = async () => {
    try {
      const res = await API.get("/admin/queries");
      setQueries(res.data);
    } catch (err) {
      console.error("Error fetching queries", err);
    }
  };

  // ── fetch contact+advertise queries ──────────────────────
  const fetchContactQueries = async () => {
    try {
      const [allRes, statsRes] = await Promise.all([
        fetch(`${API_BASE}/queries/all`),
        fetch(`${API_BASE}/queries/stats`),
      ]);
      const allData   = await allRes.json();
      const statsData = await statsRes.json();
      setContactQueries(Array.isArray(allData) ? allData : []);
      setStats(statsData);
    } catch (err) {
      console.error("Error fetching contact queries", err);
    }
  };

  useEffect(() => {
    fetchQueries();
    fetchContactQueries();
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── existing submit answer (unchanged) ───────────────────
  const submitAnswer = async (id) => {
    try {
      await API.post(`/admin/queries/${id}/answer`, { answer: answers[id] });
      setAnswers(prev => ({ ...prev, [id]: "" }));
      fetchQueries();
    } catch (err) {
      console.error("Answer submit failed", err);
    }
  };

  // ── NEW: reply to contact/advertise query ─────────────────
  const handleReply = async (query) => {
    const reply = replyText[query._id]?.trim();
    if (!reply) return showToast("Please write a reply first", "error");

    setSending(query._id);
    const endpoint = query.type === "advertise"
      ? `${API_BASE}/advertise/${query._id}/reply`
      : `${API_BASE}/contact/${query._id}/reply`;

    try {
      const res  = await fetch(endpoint, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ reply }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.email_sent
          ? `✅ Reply sent to ${query.email}`
          : `✅ Reply saved (check SMTP config for email)`
        );
        setReplyText(prev => ({ ...prev, [query._id]: "" }));
        fetchContactQueries();
      } else {
        showToast(data.error || "Failed", "error");
      }
    } catch {
      showToast("Network error", "error");
    } finally {
      setSending(null);
    }
  };

  // ── filter contact queries ────────────────────────────────
  const filteredContact = contactQueries.filter(q => {
    const matchType   = activeTab === "contact"   ? q.type === "contact"
                      : activeTab === "advertise" ? q.type === "advertise"
                      : true;
    const matchStatus = statusFilter === "all" || q.status === statusFilter;
    const matchSearch = !search.trim() ||
      q.name?.toLowerCase().includes(search.toLowerCase()) ||
      q.email?.toLowerCase().includes(search.toLowerCase()) ||
      q.subject?.toLowerCase().includes(search.toLowerCase()) ||
      q.company?.toLowerCase().includes(search.toLowerCase());
    return matchType && matchStatus && matchSearch;
  });

  const fmt = iso => {
    try { return new Date(iso).toLocaleString("en-IN", { day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" }); }
    catch { return iso || "—"; }
  };

  return (
    <div className="space-y-6">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-xl text-sm font-medium
          ${toast.type === "error" ? "bg-red-600 text-white" : "bg-green-600 text-white"}`}>
          {toast.msg}
        </div>
      )}

      <h2 className="text-xl font-semibold">User Queries</h2>

      {/* ── Tabs ─────────────────────────────────────────────── */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {[
          { key:"ask",       label:"Ask Queries",     count: queries.length },
          { key:"contact",   label:"Contact Us",      count: stats?.contact   || 0 },
          { key:"advertise", label:"Advertise",       count: stats?.advertise || 0 },
        ].map(tab => (
          <button key={tab.key} onClick={() => { setActiveTab(tab.key); setExpanded(null); }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-1.5
              ${activeTab === tab.key ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}>
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold
              ${activeTab === tab.key ? "bg-blue-100 text-blue-600" : "bg-gray-200 text-gray-500"}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════
          TAB: ASK QUERIES — existing code exactly same
      ══════════════════════════════════════════════════════ */}
      {activeTab === "ask" && (
        <div className="space-y-4">
          {queries.length === 0 && (
            <p className="text-gray-500">No queries yet</p>
          )}
          {queries.map((q) => (
            <div key={q.id} className="bg-white border rounded p-4 mb-4">
              <h4 className="font-semibold">❓ {q.question}</h4>
              <p className="text-sm text-gray-600">👤 {q.name} ({q.email})</p>
              <p className="text-sm text-gray-500">🕒 {q.created_at}</p>
              <p className={`mt-2 font-medium ${q.status === "answered" ? "text-green-600" : "text-red-500"}`}>
                Status: {q.status}
              </p>
              {q.status === "pending" ? (
                <>
                  <textarea
                    className="w-full border p-2 mt-3"
                    placeholder="Type your answer..."
                    value={answers[q.id] || ""}
                    onChange={e => setAnswers({ ...answers, [q.id]: e.target.value })}
                  />
                  <button
                    onClick={() => submitAnswer(q.id)}
                    className="mt-2 bg-indigo-600 text-white px-4 py-1 rounded">
                    Submit Answer
                  </button>
                </>
              ) : (
                <div className="mt-3 bg-green-50 p-2 rounded">
                  ✅ Answer: {q.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          TAB: CONTACT US + ADVERTISE
      ══════════════════════════════════════════════════════ */}
      {(activeTab === "contact" || activeTab === "advertise") && (
        <div className="space-y-4">

          {/* Stats row */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label:"Total",   value: activeTab==="contact" ? stats.contact : stats.advertise, color:"bg-blue-50" },
                { label:"Pending", value: contactQueries.filter(q=>q.type===activeTab&&q.status==="pending").length,  color:"bg-yellow-50" },
                { label:"Replied", value: contactQueries.filter(q=>q.type===activeTab&&q.status==="replied").length,  color:"bg-green-50" },
              ].map(s => (
                <div key={s.label} className={`${s.color} rounded-xl p-4 border border-gray-100`}>
                  <p className="text-xs text-gray-500 font-medium">{s.label}</p>
                  <p className="text-2xl font-black text-gray-900">{s.value ?? 0}</p>
                </div>
              ))}
            </div>
          )}

          {/* Search + Status filter */}
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input value={search} onChange={e=>setSearch(e.target.value)}
                placeholder="Search name, email, company..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100" />
            </div>
            <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1">
              {[["all","All"],["pending","Pending"],["replied","Replied"]].map(([v,l]) => (
                <button key={v} onClick={()=>setStatusFilter(v)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition
                    ${statusFilter===v?"bg-gray-800 text-white":"text-gray-600 hover:bg-gray-50"}`}>
                  {l}
                </button>
              ))}
            </div>
            <button onClick={fetchContactQueries}
              className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-50">
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>

          <p className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-800">{filteredContact.length}</span> entries
          </p>

          {/* Query cards */}
          {filteredContact.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
              <p className="text-3xl mb-2">📭</p>
              <p className="text-gray-500 font-semibold">No entries yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Submissions from {activeTab === "contact" ? "Contact Us" : "Advertise"} page will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredContact.map(query => (
                <div key={query._id}
                  className={`bg-white rounded-2xl border shadow-sm overflow-hidden
                    ${query.status==="pending" ? "border-yellow-200" : "border-gray-200"}`}>

                  {/* Summary row */}
                  <div
                    className="px-5 py-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition"
                    onClick={() => setExpanded(expanded===query._id ? null : query._id)}
                  >
                    <div className="flex flex-col gap-1 flex-shrink-0">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1
                        ${query.type==="contact" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>
                        {query.type === "contact" ? <MessageSquare className="w-3 h-3"/> : <Building2 className="w-3 h-3"/>}
                        {query.type === "contact" ? "Contact Us" : "Advertise"}
                      </span>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full
                        ${query.status==="pending" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>
                        {query.status==="pending" ? "⏳ Pending" : "✅ Replied"}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-gray-900 text-sm">{query.name}</p>
                        {query.company && (
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{query.company}</span>
                        )}
                      </div>
                      <p className="text-xs text-blue-600">{query.email}</p>
                      <p className="text-sm text-gray-700 truncate mt-0.5">
                        {query.subject || query.budget || "Advertising Enquiry"}
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0 hidden md:block">
                      <p className="text-xs text-gray-400 flex items-center gap-1 justify-end">
                        <Clock className="w-3 h-3"/> {fmt(query.created_at)}
                      </p>
                    </div>

                    {expanded===query._id
                      ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0"/>
                      : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0"/>
                    }
                  </div>

                  {/* Expanded detail + reply */}
                  {expanded === query._id && (
                    <div className="border-t border-gray-100 px-5 py-5 bg-gray-50 space-y-4">

                      {/* Details grid */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-xl border border-gray-200 p-4">
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">User Details</p>
                          <div className="space-y-2 text-sm">
                            {[
                              ["Name",    query.name],
                              ["Email",   query.email],
                              query.company && ["Company", query.company],
                              query.phone   && ["Phone",   query.phone],
                              query.budget  && ["Budget",  query.budget],
                              ["Submitted", fmt(query.created_at)],
                            ].filter(Boolean).map(([k,v]) => (
                              <div key={k} className="flex gap-2">
                                <span className="text-gray-400 w-20 flex-shrink-0 text-xs">{k}</span>
                                <span className="text-gray-800 font-medium text-xs">{v}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-4">
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Message</p>
                          {query.subject && <p className="font-semibold text-gray-900 text-sm mb-2">{query.subject}</p>}
                          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                            {query.message || "No message provided"}
                          </p>
                        </div>
                      </div>

                      {/* Previous reply */}
                      {query.admin_reply && (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                          <p className="text-xs font-bold text-green-700 mb-2 flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5"/> Admin Reply — {fmt(query.replied_at)}
                          </p>
                          <p className="text-sm text-gray-700 whitespace-pre-line">{query.admin_reply}</p>
                        </div>
                      )}

                      {/* Reply box */}
                      <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-3">
                          📧 {query.status==="replied" ? "Send Another Reply" : "Write Reply"} → will be emailed to {query.email}
                        </p>
                        <textarea rows={4}
                          value={replyText[query._id] || ""}
                          onChange={e => setReplyText(prev=>({...prev,[query._id]:e.target.value}))}
                          placeholder={`Write your reply to ${query.name}...`}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 resize-none mb-3"
                        />
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-400">Email: <strong>{query.email}</strong></p>
                          <button
                            onClick={() => handleReply(query)}
                            disabled={sending===query._id || !replyText[query._id]?.trim()}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition
                              ${sending===query._id || !replyText[query._id]?.trim()
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-blue-600 text-white hover:bg-blue-700"}`}>
                            {sending===query._id
                              ? <><RefreshCw className="w-4 h-4 animate-spin"/> Sending...</>
                              : <><Send className="w-4 h-4"/> Send Reply</>
                            }
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
