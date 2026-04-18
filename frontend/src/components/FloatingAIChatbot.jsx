import { useState, useEffect, useRef } from "react";
import { X, Send } from "lucide-react";

const FloatingAIChatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "ai",
      text: "Hi 👋 I'm your AI Mentor. Ask me about exams, careers, preparation or courses.",
      time: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const sessionId = useRef(`session_${Date.now()}_${Math.random().toString(36).slice(2)}`);
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  // Save session to localStorage whenever messages change
  useEffect(() => {
    if (messages.length <= 1) return; // Don't save if only initial AI greeting
    try {
      const raw = localStorage.getItem("ai_chat_logs");
      const allSessions = raw ? JSON.parse(raw) : [];

      // Get user info from localStorage if available
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;

      const thisSession = {
        id: sessionId.current,
        userName: user?.name || user?.username || null,
        userEmail: user?.email || null,
        startedAt: messages[0]?.time || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: messages,
      };

      const idx = allSessions.findIndex(s => s.id === sessionId.current);
      if (idx >= 0) {
        allSessions[idx] = thisSession;
      } else {
        allSessions.push(thisSession);
      }

      // Keep last 200 sessions max
      const trimmed = allSessions.slice(-200);
      localStorage.setItem("ai_chat_logs", JSON.stringify(trimmed));
    } catch {}
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = {
      from: "user",
      text: input.trim(),
      time: new Date().toISOString(),
    };

    const aiMsg = {
      from: "ai",
      text: "That's a great question 👍 You can explore exams by category, check eligibility, syllabus, PYQs, and coaching comparisons on ExamPrep360.",
      time: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg, aiMsg]);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Avatar */}
      <div
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center cursor-pointer shadow-lg hover:scale-105 transition z-50"
        style={{ boxShadow: "0 8px 24px rgba(99,102,241,0.4)" }}
      >
        <span className="text-white text-xl">🤖</span>
        {!open && messages.length > 1 && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-white" />
        )}
      </div>

      {/* Chat Window */}
      {open && (
        <div
          className="fixed bottom-24 right-6 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 flex flex-col overflow-hidden"
          style={{ maxHeight: 480, animation: "slideUpChat .2s ease" }}
        >
          <style>{`@keyframes slideUpChat { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>

          {/* Header */}
          <div className="flex justify-between items-center px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center text-base">🤖</div>
              <div>
                <p className="font-bold text-sm leading-tight">AI Mentor</p>
                <p className="text-blue-200 text-xs">ExamPrep 360</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-7 h-7 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition"
            >
              <X size={14} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-sm bg-slate-50" style={{ minHeight: 0 }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.from === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold
                  ${msg.from === "ai" ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white" : "bg-gradient-to-br from-slate-600 to-slate-700 text-white"}`}>
                  {msg.from === "ai" ? "🤖" : "U"}
                </div>
                <div className={`px-3 py-2 rounded-2xl max-w-[80%] text-xs leading-relaxed
                  ${msg.from === "ai"
                    ? "bg-white text-gray-800 border border-gray-100 shadow-sm rounded-tl-sm"
                    : "bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-sm"}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-100 flex gap-2 flex-shrink-0 bg-white">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your question..."
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-xl flex items-center justify-center hover:opacity-90 disabled:opacity-40 transition flex-shrink-0"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingAIChatbot;