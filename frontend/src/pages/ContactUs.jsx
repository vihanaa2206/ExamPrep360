import { Mail, Phone, MapPin, Send, MessageSquare, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";

const API_BASE = "https://examprep360.onrender.com";

export default function ContactUs() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState(null);
  const [errMsg, setErrMsg] = useState("");

  // ✅ NEW: My Replies section
  const [showReplies, setShowReplies] = useState(false);
  const [guestEmail, setGuestEmail] = useState("");
  const [myQueries, setMyQueries] = useState([]);
  const [repliesLoading, setRepliesLoading] = useState(false);
  const [repliesError, setRepliesError] = useState("");

  // ✅ NEW: Check if user is logged in
  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user")); }
    catch { return null; }
  })();

  // ✅ NEW: Auto-fetch if logged in user opens replies
  useEffect(() => {
    if (showReplies && user?.email) {
      fetchMyQueries(user.email);
    }
  }, [showReplies]);

  // ✅ NEW: Fetch queries by email
  const fetchMyQueries = async (email) => {
    if (!email) return;
    setRepliesLoading(true);
    setRepliesError("");
    try {
      const res = await fetch(`${API_BASE}/api/contact/my-queries?email=${encodeURIComponent(email.toLowerCase())}`);
      const data = await res.json();
      setMyQueries(data);
      if (data.length === 0) setRepliesError("No messages found for this email.");
    } catch {
      setRepliesError("Failed to fetch. Make sure backend is running.");
    } finally {
      setRepliesLoading(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus("loading");
    setErrMsg("");
    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
        setErrMsg(data.error || "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setErrMsg("Network error — make sure backend is running.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-teal-600 to-cyan-700 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <MessageSquare className="w-10 h-10 mx-auto mb-3" />
          <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
          <p className="text-teal-100 text-sm">Have a question or feedback? We'd love to hear from you.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">

        {/* ✅ NEW: My Messages & Replies Section */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-teal-600" />
              <span className="font-bold text-gray-800">Check My Messages & Admin Replies</span>
            </div>
            {showReplies ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>

          {showReplies && (
            <div className="px-6 pb-6 border-t border-gray-100">

              {/* Guest email input */}
              {!user && (
                <div className="flex gap-2 mt-4">
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={e => setGuestEmail(e.target.value)}
                    placeholder="Enter the email you used to contact us"
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-100"
                  />
                  <button
                    onClick={() => fetchMyQueries(guestEmail)}
                    className="px-4 py-2 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700"
                  >
                    Check
                  </button>
                </div>
              )}

              {user && (
                <p className="text-sm text-gray-500 mt-4">
                  Showing messages for <span className="font-semibold text-teal-600">{user.email}</span>
                </p>
              )}

              {/* Loading */}
              {repliesLoading && (
                <p className="text-sm text-gray-400 mt-4 text-center">Loading your messages...</p>
              )}

              {/* Error */}
              {repliesError && !repliesLoading && (
                <p className="text-sm text-gray-400 mt-4 text-center">{repliesError}</p>
              )}

              {/* Messages List */}
              {!repliesLoading && myQueries.length > 0 && (
                <div className="mt-4 space-y-4">
                  {myQueries.map((q) => (
                    <div key={q._id}
                      className={`border rounded-xl p-4 ${q.admin_reply ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50"}`}>

                      {/* Subject + Status */}
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-gray-800 text-sm">📌 {q.subject}</p>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${q.status === "replied" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                          {q.status === "replied" ? "✅ Replied" : "⏳ Pending"}
                        </span>
                      </div>

                      {/* User message */}
                      <p className="text-sm text-gray-600 mb-1">💬 {q.message}</p>
                      <p className="text-xs text-gray-400 mb-3">🕒 {q.created_at}</p>

                      {/* Admin Reply */}
                      {q.admin_reply ? (
                        <div className="bg-white border border-green-200 rounded-lg p-3">
                          <p className="text-xs font-bold text-green-700 mb-1">🛡 Admin Reply:</p>
                          <p className="text-sm text-gray-800">{q.admin_reply}</p>
                          <p className="text-xs text-gray-400 mt-1">🕒 {q.replied_at}</p>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 italic">Admin reply pending — we'll respond within 24 hours.</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Original Contact Form — UNCHANGED */}
        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Get In Touch</h3>
              <div className="space-y-4">
                {[
                  { icon: <Mail className="w-5 h-5 text-blue-600" />, label: "Email", content: <><a href="mailto:info@examprep360.com" className="text-sm text-blue-600 hover:underline block">info@examprep360.com</a><a href="mailto:support@examprep360.com" className="text-sm text-blue-600 hover:underline block">support@examprep360.com</a></> },
                  { icon: <Phone className="w-5 h-5 text-green-600" />, label: "Phone", content: <><p className="text-sm text-gray-800">1800-123-4567 (Toll Free)</p><p className="text-xs text-gray-400">Mon–Sat, 9 AM – 6 PM IST</p></> },
                  { icon: <MapPin className="w-5 h-5 text-orange-600" />, label: "Office", content: <p className="text-sm text-gray-800">123, Connaught Place<br />New Delhi — 110001</p> },
                  { icon: <Clock className="w-5 h-5 text-purple-600" />, label: "Hours", content: <><p className="text-sm text-gray-800">Monday – Saturday</p><p className="text-sm text-gray-800">9:00 AM – 6:00 PM IST</p></> },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-0.5">{item.label}</p>
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-6">Send Us a Message</h3>

              {status === "success" && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-medium">
                  ✅ Message sent! We'll respond within 24 hours.
                </div>
              )}
              {status === "error" && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
                  ❌ {errMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Your Name *</label>
                    <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Rahul Sharma"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-100" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address *</label>
                    <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@email.com"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-100" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Subject *</label>
                  <select required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-100 bg-white">
                    <option value="">Select a subject</option>
                    <option>Exam Information Query</option>
                    <option>College Admission Query</option>
                    <option>Technical Issue</option>
                    <option>Content Correction</option>
                    <option>Partnership / Advertising</option>
                    <option>Feedback / Suggestion</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Message *</label>
                  <textarea required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder="Describe your query..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-100 resize-none" />
                </div>
                <button type="submit" disabled={status === "loading"}
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2
                    ${status === "loading" ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-teal-600 text-white hover:bg-teal-700"}`}>
                  {status === "loading" ? <><span className="animate-spin">⏳</span> Sending...</> : <><Send className="w-4 h-4" /> Send Message</>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
