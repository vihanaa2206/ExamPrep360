// src/admin/pages/AdminAIChatLogs.jsx
import { useState, useEffect } from "react";
import { MessageSquare, X, Bot, User, Search, Trash2, Clock, ChevronRight } from "lucide-react";

export default function AdminAIChatLogs() {
  const [sessions, setSessions] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = () => {
    try {
      const raw = localStorage.getItem("ai_chat_logs");
      const data = raw ? JSON.parse(raw) : [];
      // Sort newest first
      setSessions(data.sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt)));
    } catch {
      setSessions([]);
    }
  };

  const deleteSession = (id, e) => {
    e.stopPropagation();
    try {
      const raw = localStorage.getItem("ai_chat_logs");
      const data = raw ? JSON.parse(raw) : [];
      const updated = data.filter(s => s.id !== id);
      localStorage.setItem("ai_chat_logs", JSON.stringify(updated));
      setSessions(updated.sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt)));
      if (selectedSession?.id === id) setSelectedSession(null);
    } catch {}
  };

  const clearAll = () => {
    localStorage.removeItem("ai_chat_logs");
    setSessions([]);
    setSelectedSession(null);
  };

  const filtered = sessions.filter(s => {
    const q = search.toLowerCase();
    return !q ||
      (s.userName || "").toLowerCase().includes(q) ||
      (s.userEmail || "").toLowerCase().includes(q) ||
      s.messages.some(m => m.text.toLowerCase().includes(q));
  });

  const fmtTime = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit", hour12: true,
    });
  };

  const totalMessages = sessions.reduce((a, s) => a + s.messages.length, 0);
  const userMessages = sessions.reduce((a, s) => a + s.messages.filter(m => m.from === "user").length, 0);

  return (
    <div className="min-h-screen bg-slate-50 p-5">
      <style>{`
        @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
        .chat-popup { animation: slideUp .25s ease; }
        .msg-bubble { animation: fadeIn .2s ease; }
      `}</style>

      {/* Chat Detail Popup */}
      {selectedSession && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(15,23,42,0.7)", backdropFilter: "blur(6px)" }}
          onClick={() => setSelectedSession(null)}
        >
          <div
            className="chat-popup bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Popup Header */}
            <div className="bg-gradient-to-r from-rose-500 to-pink-600 px-6 py-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center text-xl">🤖</div>
                <div>
                  <p className="font-black text-white text-base leading-tight">{selectedSession.userName || "Anonymous User"}</p>
                  <p className="text-rose-200 text-xs">{selectedSession.userEmail || "No email"} · {fmtTime(selectedSession.startedAt)}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSession(null)}
                className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Stats bar */}
            <div className="flex items-center gap-4 px-6 py-2.5 bg-rose-50 border-b border-rose-100 flex-shrink-0">
              <span className="text-xs text-rose-600 font-bold">
                💬 {selectedSession.messages.length} messages
              </span>
              <span className="text-xs text-rose-400">·</span>
              <span className="text-xs text-rose-600 font-bold">
                👤 {selectedSession.messages.filter(m => m.from === "user").length} from user
              </span>
              <span className="text-xs text-rose-400">·</span>
              <span className="text-xs text-rose-600 font-bold">
                🤖 {selectedSession.messages.filter(m => m.from === "ai").length} from AI
              </span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {selectedSession.messages.map((msg, i) => (
                <div key={i} className={`msg-bubble flex gap-2.5 ${msg.from === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  {/* Avatar */}
                  <div className={`w-7 h-7 rounded-xl flex-shrink-0 flex items-center justify-center text-sm font-bold
                    ${msg.from === "ai" ? "bg-gradient-to-br from-rose-500 to-pink-600 text-white" : "bg-gradient-to-br from-indigo-500 to-blue-600 text-white"}`}>
                    {msg.from === "ai" ? "🤖" : (selectedSession.userName?.[0] || "U").toUpperCase()}
                  </div>

                  {/* Bubble */}
                  <div className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed
                    ${msg.from === "ai"
                      ? "bg-slate-100 text-slate-800 rounded-tl-sm"
                      : "bg-gradient-to-br from-indigo-500 to-blue-600 text-white rounded-tr-sm"}`}>
                    {msg.text}
                    {msg.time && (
                      <p className={`text-[10px] mt-1 ${msg.from === "ai" ? "text-slate-400" : "text-blue-200"}`}>
                        {new Date(msg.time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center text-base">🤖</div>
            <h1 className="text-2xl font-black text-slate-900">AI Chat Logs</h1>
          </div>
          <p className="text-sm text-slate-400 ml-10">All user conversations with AI Mentor chatbot</p>
        </div>
        {sessions.length > 0 && (
          <button onClick={clearAll}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition">
            <Trash2 className="w-4 h-4" /> Clear All Logs
          </button>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Sessions", value: sessions.length, icon: "💬", color: "from-rose-400 to-pink-500" },
          { label: "Total Messages", value: totalMessages,   icon: "📨", color: "from-indigo-400 to-blue-500" },
          { label: "User Messages",  value: userMessages,    icon: "👤", color: "from-violet-400 to-purple-500" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center text-xl flex-shrink-0`}>
              {s.icon}
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{s.label}</p>
              <p className="text-2xl font-black text-gray-900">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by user name, email or message content…"
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300"
          />
        </div>
      </div>

      {/* Session Cards */}
      {sessions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-20 gap-3">
          <div className="text-6xl">🤖</div>
          <p className="font-bold text-gray-400 text-lg">No chat logs yet</p>
          <p className="text-sm text-gray-300">Conversations will appear here once users start chatting with AI Mentor</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-16 gap-3">
          <MessageSquare className="w-12 h-12 text-gray-200" />
          <p className="font-bold text-gray-400">No results found</p>
          <p className="text-sm text-gray-300">Try a different search query</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(session => {
            const userMsgs = session.messages.filter(m => m.from === "user");
            const aiMsgs   = session.messages.filter(m => m.from === "ai");
            const lastMsg  = session.messages[session.messages.length - 1];
            const initials = (session.userName || session.userEmail || "A")[0].toUpperCase();

            return (
              <div
                key={session.id}
                onClick={() => setSelectedSession(session)}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group overflow-hidden"
              >
                {/* Top accent */}
                <div className="h-1 w-full bg-gradient-to-r from-rose-500 to-pink-500" />

                <div className="p-5">
                  {/* User info row */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-slate-800 truncate text-sm">{session.userName || "Anonymous"}</p>
                      <p className="text-xs text-slate-400 truncate">{session.userEmail || "No email"}</p>
                    </div>
                    <button
                      onClick={e => deleteSession(session.id, e)}
                      className="w-7 h-7 rounded-xl opacity-0 group-hover:opacity-100 bg-red-50 hover:bg-red-100 flex items-center justify-center transition text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Message count pills */}
                  <div className="flex gap-2 mb-4">
                    <span className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold border border-indigo-100">
                      <User className="w-3 h-3" /> {userMsgs.length}
                    </span>
                    <span className="flex items-center gap-1 px-2.5 py-1 bg-rose-50 text-rose-600 rounded-lg text-xs font-bold border border-rose-100">
                      <Bot className="w-3 h-3" /> {aiMsgs.length}
                    </span>
                    <span className="flex items-center gap-1 px-2.5 py-1 bg-slate-50 text-slate-500 rounded-lg text-xs font-bold border border-slate-100 ml-auto">
                      <Clock className="w-3 h-3" /> {session.messages.length} total
                    </span>
                  </div>

                  {/* Last message preview */}
                  {lastMsg && (
                    <div className={`rounded-xl p-3 text-xs leading-relaxed mb-3
                      ${lastMsg.from === "ai" ? "bg-slate-50 text-slate-600" : "bg-indigo-50 text-indigo-700"}`}>
                      <span className="font-bold mr-1">{lastMsg.from === "ai" ? "🤖 AI:" : "👤 User:"}</span>
                      <span className="line-clamp-2">{lastMsg.text}</span>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{fmtTime(session.startedAt)}</span>
                    </div>
                    <span className="text-xs text-rose-500 font-bold flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition">
                      View full <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}