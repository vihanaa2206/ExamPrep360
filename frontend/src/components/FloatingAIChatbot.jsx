// PATH: frontend/src/components/FloatingAIChatbot.jsx
// REPLACE existing file completely

import { useState, useEffect, useRef } from "react";
import { X, Send } from "lucide-react";

// ✅ Same port as tera backend (Flask default 5000)
const AI_BASE = "https://examprep360-production.up.railway.app";

const CATEGORIES = [
  { icon: "📚", label: "Exam Pattern" },
  { icon: "📝", label: "Important Topics" },
  { icon: "❓", label: "PYQ Questions" },
  { icon: "💡", label: "Study Tips" },
  { icon: "📖", label: "Subject Doubts" },
];

const FloatingAIChatbot = () => {
  const [open, setOpen]               = useState(false);
  const [messages, setMessages]       = useState([]);
  const [input, setInput]             = useState("");
  const [loading, setLoading]         = useState(false);
  const [showCategories, setShowCategories] = useState(true);
  const sessionId    = useRef(`session_${Date.now()}_${Math.random().toString(36).slice(2)}`);
  const messagesEnd  = useRef(null);
  const saveTimer    = useRef(null);

  const getUser = () => {
    try { return JSON.parse(localStorage.getItem("user") || "{}"); } catch { return {}; }
  };

  // Auto-scroll
  useEffect(() => {
    if (open) messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  // Welcome message on first open
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{
        role: "bot",
        text: "👋 Hello! I'm your AI Study Assistant.\n\nAsk me about exam patterns, syllabus, negative marking, important topics, or study tips!",
        time: new Date().toISOString(),
      }]);
    }
  }, [open]);

  // Debounced session save
  useEffect(() => {
    if (messages.length <= 1) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(saveSession, 2000);
    return () => clearTimeout(saveTimer.current);
  }, [messages]);

  const saveSession = async () => {
    try {
      const user = getUser();
      await fetch(`${AI_BASE}/api/ai-chat/save-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId:  sessionId.current,
          userId:     user._id || user.id || null,
          userName:   user.name || user.username || null,
          userEmail:  user.email || null,
          messages,
          startedAt:  messages[0]?.time || new Date().toISOString(),
          updatedAt:  new Date().toISOString(),
        }),
      });
    } catch {
      // Fallback localStorage
      try {
        const user = getUser();
        const raw  = localStorage.getItem("ai_chat_logs");
        const all  = raw ? JSON.parse(raw) : [];
        const sess = {
          id: sessionId.current,
          userName:  user.name || null,
          userEmail: user.email || null,
          startedAt: messages[0]?.time || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          messages,
        };
        const idx = all.findIndex(s => s.id === sessionId.current);
        idx >= 0 ? (all[idx] = sess) : all.push(sess);
        localStorage.setItem("ai_chat_logs", JSON.stringify(all.slice(-200)));
      } catch {}
    }
  };

  const sendMessage = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;

    setMessages(prev => [...prev, { role: "user", text: msg, time: new Date().toISOString() }]);
    setInput("");
    setLoading(true);
    setShowCategories(false);

    try {
      const res  = await fetch(`${AI_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        role: "bot",
        text: data.reply || "Sorry, I couldn't find an answer. Please rephrase your question.",
        time: new Date().toISOString(),
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: "bot",
        text: "⚠️ Connection error. Please check if the AI server is running.",
        time: new Date().toISOString(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const formatText = (text) =>
    text.split("\n").map((line, i, arr) => (
      <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
    ));

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <div
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform z-50"
          style={{ boxShadow: "0 8px 24px rgba(99,102,241,0.45)" }}
        >
          <span className="text-white text-2xl">🤖</span>
          {messages.length > 1 && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
          )}
        </div>
      )}

      {/* Chat Window */}
      {open && (
        <div
          className="fixed bottom-6 right-6 bg-white rounded-3xl shadow-2xl border border-gray-100 z-50 flex flex-col overflow-hidden"
          style={{ width: 360, maxHeight: 560, animation: "slideUpChat .25s ease" }}
        >
          <style>{`
            @keyframes slideUpChat {
              from { transform: translateY(20px) scale(0.95); opacity: 0; }
              to   { transform: translateY(0) scale(1); opacity: 1; }
            }
            @keyframes dot { 0%,80%,100%{transform:scale(.8);opacity:.4} 40%{transform:scale(1.2);opacity:1} }
            .d1{animation:dot 1.2s infinite 0s}
            .d2{animation:dot 1.2s infinite .2s}
            .d3{animation:dot 1.2s infinite .4s}
          `}</style>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-2xl flex items-center justify-center text-lg">🤖</div>
              <div>
                <p className="font-black text-white text-sm leading-tight">AI Study Assistant</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <p className="text-blue-200 text-xs">Online · Always Here</p>
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition text-white">
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-slate-50" style={{ minHeight: 0 }}>

            {/* Category chips */}
            {showCategories && messages.length <= 1 && (
              <div className="flex flex-wrap gap-2 pb-1">
                {CATEGORIES.map(c => (
                  <button key={c.label} onClick={() => sendMessage(c.label)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-indigo-100 text-indigo-700 rounded-xl text-xs font-semibold hover:bg-indigo-50 hover:border-indigo-300 transition shadow-sm">
                    {c.icon} {c.label}
                  </button>
                ))}
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`w-7 h-7 rounded-xl flex-shrink-0 flex items-center justify-center text-xs font-bold self-end
                  ${msg.role === "bot"
                    ? "bg-gradient-to-br from-blue-600 to-indigo-700 text-white"
                    : "bg-gradient-to-br from-slate-600 to-slate-700 text-white"}`}>
                  {msg.role === "bot" ? "🤖" : (getUser().name?.[0] || "U").toUpperCase()}
                </div>
                <div className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed
                  ${msg.role === "bot"
                    ? "bg-white text-gray-800 border border-gray-100 shadow-sm rounded-tl-sm"
                    : "bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-tr-sm"}`}>
                  {formatText(msg.text)}
                  {msg.time && (
                    <p className={`text-[9px] mt-1.5 ${msg.role === "bot" ? "text-gray-400" : "text-blue-200"}`}>
                      {new Date(msg.time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-xs flex-shrink-0">🤖</div>
                <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5 items-center">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full d1" />
                  <div className="w-2 h-2 bg-indigo-400 rounded-full d2" />
                  <div className="w-2 h-2 bg-indigo-400 rounded-full d3" />
                </div>
              </div>
            )}
            <div ref={messagesEnd} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-gray-100 bg-white flex-shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Write your query..."
                disabled={loading}
                className="flex-1 border border-gray-200 rounded-2xl px-3.5 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 disabled:opacity-60 bg-slate-50"
              />
              <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
                className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-xl flex items-center justify-center hover:opacity-90 disabled:opacity-40 transition flex-shrink-0">
                <Send size={13} />
              </button>
            </div>
            <p className="text-center text-[9px] text-gray-400 mt-1.5">Enter to send · Shift+Enter for new line</p>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingAIChatbot;