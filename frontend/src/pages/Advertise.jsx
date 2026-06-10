import { Send, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";

const API_BASE = "https://examprep360.onrender.com";

export default function Advertise() {
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", budget: "" });
  const [status, setStatus] = useState(null);
  const [errMsg, setErrMsg] = useState("");

  // ✅ NEW: My Replies section
  const [showReplies, setShowReplies] = useState(false);
  const [guestEmail, setGuestEmail] = useState("");
  const [myQueries, setMyQueries] = useState([]);
  const [repliesLoading, setRepliesLoading] = useState(false);
  const [repliesError, setRepliesError] = useState("");

  // ✅ NEW: Check logged in user
  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user")); }
    catch { return null; }
  })();

  // ✅ NEW: Auto fetch for logged in user
  useEffect(() => {
    if (showReplies && user?.email) {
      fetchMyQueries(user.email);
    }
  }, [showReplies]);

  // ✅ NEW: Fetch advertise queries by email
  const fetchMyQueries = async (email) => {
    if (!email) return;
    setRepliesLoading(true);
    setRepliesError("");
    try {
      const res = await fetch(`${API_BASE}/api/advertise/my-queries?email=${encodeURIComponent(email.toLowerCase())}`);
      const data = await res.json();
      setMyQueries(data);
      if (data.length === 0) setRepliesError("No enquiries found for this email.");
    } catch {
      setRepliesError("Failed to fetch. Make sure backend is running.");
    } finally {
      setRepliesLoading(false);
    }
  };

  const plans = [
    { name: "Starter", price: "₹900/month", features: ["Banner ads on 5 pages", "5,000 impressions/day", "Email support", "Monthly report"], color: "border-gray-200", btn: "bg-gray-100 text-gray-700 hover:bg-gray-200" },
    { name: "Growth", price: "₹2500/month", features: ["Ads on 20 pages", "25,000 impressions/day", "Featured in notifications", "Weekly analytics"], color: "border-blue-500", btn: "bg-blue-600 text-white hover:bg-blue-700", popular: true },
    { name: "Enterprise", price: "Custom", features: ["All pages coverage", "Unlimited impressions", "Dedicated account manager", "Real-time dashboard"], color: "border-purple-500", btn: "bg-purple-600 text-white hover:bg-purple-700" },
  ];

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus("loading");
    setErrMsg("");
    try {
      const res = await fetch(`${API_BASE}/api/advertise`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", company: "", email: "", phone: "", budget: "" });
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
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-black mb-3">Advertise with ExamPrep360</h1>
          <p className="text-amber-100 text-sm max-w-xl mx-auto">
            Reach 50 lakh+ students, parents, and educators actively preparing for competitive exams.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[["50L+", "Monthly Visitors"], ["18–28", "Target Age Group"], ["92%", "Organic Traffic"], ["28+", "States Covered"]].map(([v, l]) => (
            <div key={l} className="bg-white border border-gray-200 rounded-2xl p-5 text-center shadow-sm">
              <p className="text-2xl font-black text-orange-600">{v}</p>
              <p className="text-xs text-gray-500 mt-1">{l}</p>
            </div>
          ))}
        </div>

        {/* ✅ NEW: My Enquiries & Replies Section */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-2">
              <span className="text-orange-500">📋</span>
              <span className="font-bold text-gray-800">Check My Enquiries & Admin Replies</span>
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
                    placeholder="Enter the email you used in your enquiry"
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-100"
                  />
                  <button
                    onClick={() => fetchMyQueries(guestEmail)}
                    className="px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600"
                  >
                    Check
                  </button>
                </div>
              )}

              {user && (
                <p className="text-sm text-gray-500 mt-4">
                  Showing enquiries for <span className="font-semibold text-orange-500">{user.email}</span>
                </p>
              )}

              {repliesLoading && (
                <p className="text-sm text-gray-400 mt-4 text-center">Loading your enquiries...</p>
              )}

              {repliesError && !repliesLoading && (
                <p className="text-sm text-gray-400 mt-4 text-center">{repliesError}</p>
              )}

              {!repliesLoading && myQueries.length > 0 && (
                <div className="mt-4 space-y-4">
                  {myQueries.map((q) => (
                    <div key={q._id}
                      className={`border rounded-xl p-4 ${q.admin_reply ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50"}`}>

                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-gray-800 text-sm">🏢 {q.company}</p>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${q.status === "replied" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                          {q.status === "replied" ? "✅ Replied" : "⏳ Pending"}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-1">💰 Budget: {q.budget || "Not specified"}</p>
                      <p className="text-xs text-gray-400 mb-3">🕒 {q.created_at}</p>

                      {q.admin_reply ? (
                        <div className="bg-white border border-green-200 rounded-lg p-3">
                          <p className="text-xs font-bold text-green-700 mb-1">🛡 Admin Reply:</p>
                          <p className="text-sm text-gray-800">{q.admin_reply}</p>
                          <p className="text-xs text-gray-400 mt-1">🕒 {q.replied_at}</p>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 italic">Admin reply pending — our team will contact you within 24 hours.</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Plans */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Advertising Plans</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map(plan => (
              <div key={plan.name} className={`bg-white rounded-2xl border-2 ${plan.color} p-6 shadow-sm relative`}>
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                )}
                <h3 className="font-bold text-gray-900 text-lg">{plan.name}</h3>
                <p className="text-2xl font-black text-gray-900 my-3">{plan.price}</p>
                <ul className="space-y-2 mb-6">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-green-500 font-bold">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => {
                    document.getElementById("ad-enquiry-form")?.scrollIntoView({ behavior: "smooth" });
                    setForm(prev => ({ ...prev, budget: plan.price === "Custom" ? "Enterprise — Custom" : plan.price }));
                  }}
                  className={`block w-full text-center py-2.5 rounded-xl text-sm font-semibold transition ${plan.btn}`}>
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Enquiry Form — UNCHANGED */}
        <div id="ad-enquiry-form" className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <h2 className="font-bold text-gray-900 text-lg mb-2">Get in Touch with Our Ad Team</h2>
          <p className="text-sm text-gray-500 mb-6">Fill the form and our team will contact you within 24 hours.</p>

          {status === "success" && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-medium">
              ✅ Enquiry submitted! Our advertising team will contact you within 24 hours.
            </div>
          )}
          {status === "error" && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
              ❌ {errMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            {[["name", "Your Name *", true], ["company", "Company Name *", true], ["email", "Email Address *", true], ["phone", "Phone Number", false]].map(([f, p, r]) => (
              <input key={f} required={r} placeholder={p} value={form[f]} onChange={e => setForm({ ...form, [f]: e.target.value })}
                className="px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-100" />
            ))}
            <select value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })}
              className="px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-100 bg-white">
              <option value="">Monthly Budget</option>
              <option>Under ₹100</option>
              <option>₹100 – ₹25</option>
              <option>₹25,000 – ₹50,000</option>
              <option>₹500 – ₹1,00,000</option>
              <option>Above ₹1,00000</option>
            </select>
            <div className="md:col-span-2">
              <button type="submit" disabled={status === "loading"}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2
                  ${status === "loading" ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-orange-500 text-white hover:bg-orange-600"}`}>
                {status === "loading" ? <><span className="animate-spin">⏳</span> Submitting...</> : <><Send className="w-4 h-4" /> Submit Enquiry</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
