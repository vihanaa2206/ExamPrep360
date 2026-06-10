import { useState, useEffect } from "react";
import API from "../services/api";

// ── Direct base URL for ask routes (no /api prefix) ──────────────────────
const BASE = "https://examprep360.onrender.com";

export default function AskModal({ onClose }) {
  const [question, setQuestion]         = useState("");
  const [message, setMessage]           = useState("");
  const [error, setError]               = useState("");
  const [tab, setTab]                   = useState("ask");
  const [replies, setReplies]           = useState([]);
  const [loadingReplies, setLoadingReplies] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const wordCount = question.trim().split(/\s+/).filter(Boolean).length;

  // ── Fetch replies — using direct fetch (not API service) ─────────────
  const fetchReplies = () => {
    if (!user?.email) return;
    setLoadingReplies(true);
    fetch(`${BASE}/ask/my-replies?email=${encodeURIComponent(user.email)}`)
      .then(r => r.json())
      .then(data => setReplies(Array.isArray(data) ? data : []))
      .catch(() => setReplies([]))
      .finally(() => setLoadingReplies(false));
  };

  useEffect(() => {
    if (tab === "replies") {
      fetchReplies();
    }
  }, [tab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!user) {
      setError("Please login to ask a question");
      return;
    }
    if (wordCount > 100) {
      setError("Question must be within 100 words");
      return;
    }

    try {
      await API.post("/ask", {
        user: { name: user.name, email: user.email },
        question,
      });
      setMessage("Your question has been sent successfully ✅");
      setQuestion("");
    } catch (err) {
      setError("Unable to submit question");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg relative overflow-hidden">

        {/* Close */}
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 z-10">
          ✕
        </button>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setTab("ask")}
            className={`flex-1 py-3 text-sm font-semibold transition
              ${tab === "ask" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            Ask Question
          </button>
          <button
            onClick={() => setTab("replies")}
            className={`flex-1 py-3 text-sm font-semibold transition
              ${tab === "replies" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            My Replies
          </button>
        </div>

        <div className="p-6">

          {/* ── ASK TAB ─────────────────────────────────────────── */}
          {tab === "ask" && (
            <>
              <h2 className="text-xl font-bold mb-2">Ask Your Question</h2>
              <p className="text-sm text-gray-500 mb-4">
                Max 100 words. Admin will reply within 24 hours.
              </p>

              {error   && <div className="text-red-600 text-sm mb-2">{error}</div>}
              {message && <div className="text-green-600 text-sm mb-2">{message}</div>}

              <form onSubmit={handleSubmit}>
                <textarea
                  rows="5"
                  className="w-full border rounded-lg p-2"
                  placeholder="Write your problem here..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
                <div className="text-xs text-gray-500 mt-1">{wordCount}/100 words</div>
                <button type="submit" className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg">
                  Submit
                </button>
              </form>
            </>
          )}

          {/* ── REPLIES TAB ─────────────────────────────────────── */}
          {tab === "replies" && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">My Queries & Replies</h2>
                <button
                  onClick={fetchReplies}
                  className="text-xs text-blue-600 hover:underline"
                >
                  🔄 Refresh
                </button>
              </div>

              {!user ? (
                <p className="text-gray-500 text-sm text-center py-6">
                  Please login to see your replies.
                </p>
              ) : loadingReplies ? (
                <p className="text-gray-400 text-sm text-center py-6">Loading...</p>
              ) : replies.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-3xl mb-2">📭</p>
                  <p className="text-gray-500 text-sm">No queries yet. Ask a question first!</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {replies.map((q) => (
                    <div
                      key={q.id}
                      className={`border rounded-xl p-4
                        ${q.status === "answered"
                          ? "border-green-200 bg-green-50"
                          : "border-gray-200 bg-gray-50"}`}
                    >
                      <p className="font-semibold text-gray-900 text-sm mb-1">❓ {q.question}</p>
                      <p className="text-xs text-gray-400 mb-2">🕒 {q.created_at}</p>

                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full
                        ${q.status === "answered"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"}`}>
                        {q.status === "answered" ? "✅ Answered" : "⏳ Pending"}
                      </span>

                      {q.status === "answered" && q.answer && (
                        <div className="mt-3 bg-white border border-green-200 rounded-lg p-3">
                          <p className="text-xs font-bold text-green-700 mb-1">💬 Admin Reply:</p>
                          <p className="text-sm text-gray-800">{q.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}
