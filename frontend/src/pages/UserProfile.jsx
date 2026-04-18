// src/pages/UserProfile.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  CheckCircle, Clock, Calendar, Tag,
  CreditCard, ShoppingCart, ChevronRight,
  Scale, Landmark, GraduationCap, HeartPulse,
  Briefcase, BookOpen, Lock,
} from "lucide-react";

const BASE = "http://127.0.0.1:5000/api";

const FEEDBACK_MODULES = [
  { key:"mock_tests",       label:"Mock Tests",           icon:"📝" },
  { key:"pyq",              label:"PYQ / Previous Papers",icon:"📄" },
  { key:"colleges",         label:"College Listings",     icon:"🎓" },
  { key:"coaching",         label:"Coaching Comparison",  icon:"🏫" },
  { key:"notifications",    label:"Live Notifications",   icon:"🔔" },
  { key:"question_quality", label:"Question Quality",     icon:"❓" },
  { key:"overall",          label:"Overall Experience",   icon:"⭐" },
];

const RATINGS = [
  { val:"excellent", label:"Excellent", emoji:"🤩", color:"bg-emerald-100 text-emerald-700 border-emerald-300" },
  { val:"good",      label:"Good",      emoji:"😊", color:"bg-blue-100 text-blue-700 border-blue-300"         },
  { val:"average",   label:"Average",   emoji:"😐", color:"bg-yellow-100 text-yellow-700 border-yellow-300"   },
  { val:"bad",       label:"Bad",       emoji:"😕", color:"bg-orange-100 text-orange-700 border-orange-300"   },
  { val:"worst",     label:"Worst",     emoji:"😡", color:"bg-red-100 text-red-700 border-red-300"            },
];

const CAT_META = {
  "Law":             { icon: Scale,          color: "bg-amber-100 text-amber-700 border-amber-200"   },
  "Government":      { icon: Landmark,       color: "bg-red-100 text-red-700 border-red-200"         },
  "Engineering":     { icon: GraduationCap,  color: "bg-blue-100 text-blue-700 border-blue-200"      },
  "Medical":         { icon: HeartPulse,     color: "bg-green-100 text-green-700 border-green-200"   },
  "Management":      { icon: Briefcase,      color: "bg-purple-100 text-purple-700 border-purple-200"},
  "Computer Science":{ icon: BookOpen,       color: "bg-cyan-100 text-cyan-700 border-cyan-200"      },
};

const PLAN_COLORS = {
  basic:    "from-blue-500 to-indigo-500",
  standard: "from-purple-500 to-violet-600",
  premium:  "from-amber-500 to-orange-500",
};

function daysLeft(expiresAt) {
  if (!expiresAt) return null;
  return Math.ceil((new Date(expiresAt) - new Date()) / (1000 * 60 * 60 * 24));
}

function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });
}

// ── Purchase Card ─────────────────────────────────────────────────────
function PurchaseCard({ purchase, pal }) {
  const dl        = daysLeft(purchase.expires_at);
  const isExpired = dl !== null && dl < 0;
  const isActive  = !isExpired && purchase.status === "paid";
  const grad      = PLAN_COLORS[purchase.plan] || "from-gray-400 to-gray-500";

  return (
    <div className={`rounded-2xl border overflow-hidden shadow-sm
      ${isActive ? "border-green-200" : "border-gray-200 opacity-80"}`}>

      {/* Plan header */}
      <div className={`bg-gradient-to-r ${grad} p-4 text-white`}>
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-xs font-semibold text-white/80 uppercase tracking-wide">Plan</p>
            <h3 className="text-lg font-black">{purchase.plan_name || purchase.plan}</h3>
          </div>
          <div className={`px-3 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5
            ${isActive ? "bg-green-400/30 text-white" : "bg-red-400/30 text-white"}`}>
            {isActive
              ? <><CheckCircle className="w-3.5 h-3.5" /> Active</>
              : <><Clock       className="w-3.5 h-3.5" /> Expired</>}
          </div>
        </div>
        <p className="text-2xl font-black">₹{purchase.amount_inr || (purchase.amount && purchase.amount / 100) || "—"}</p>
      </div>

      {/* Details */}
      <div className="bg-white p-4 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>Purchased</span>
          </div>
          <span className="font-bold text-gray-700">{fmtDate(purchase.purchased_at)}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-500">
            <Clock className="w-4 h-4" />
            <span>Expires</span>
          </div>
          <span className={`font-bold ${isExpired ? "text-red-600" : dl !== null && dl <= 7 ? "text-orange-600" : "text-gray-700"}`}>
            {fmtDate(purchase.expires_at)}
            {dl !== null && !isExpired && (
              <span className="ml-1 text-xs text-gray-400">({dl}d left)</span>
            )}
          </span>
        </div>

        {purchase.payment_id && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-500">
              <CreditCard className="w-4 h-4" />
              <span>Txn ID</span>
            </div>
            <span className="font-mono text-xs text-gray-500 truncate max-w-[140px]">{purchase.payment_id}</span>
          </div>
        )}

        {purchase.categories?.length > 0 && (
          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs font-black text-gray-400 uppercase tracking-wide mb-2">
              <Tag className="w-3 h-3 inline mr-1" />Purchased Categories
            </p>
            <div className="flex flex-wrap gap-1.5">
              {purchase.categories.map(cat => {
                const meta = CAT_META[cat];
                const Icon = meta?.icon;
                return (
                  <span key={cat}
                    className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border
                      ${meta?.color || "bg-gray-100 text-gray-600 border-gray-200"}`}>
                    {Icon && <Icon className="w-3 h-3" />}
                    {cat}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function UserProfile() {
  const navigate      = useNavigate();
  const fileRef       = useRef(null);
  const [tab, setTab] = useState("profile");
  const [user, setUser]           = useState(null);
  const [form, setForm]           = useState({ name:"", email:"", phone:"", city:"", state:"", target_exam:"" });
  const [editing, setEditing]     = useState(false);
  const [loading, setLoading]     = useState(false);
  const [msg, setMsg]             = useState({ text:"", type:"" });
  const [pwForm, setPwForm]       = useState({ current:"", newPw:"", confirm:"" });
  const [pwMsg, setPwMsg]         = useState({ text:"", type:"" });
  const [pwLoading, setPwLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [showPw, setShowPw]       = useState({ current:false, newPw:false, confirm:false });

  const [feedback, setFeedback] = useState(
    Object.fromEntries(FEEDBACK_MODULES.map(m => [m.key, { rating:"", reason:"", improvement:"" }]))
  );
  const [fbSubmitting, setFbSubmitting] = useState(false);
  const [fbMsg, setFbMsg]               = useState({ text:"", type:"" });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput]             = useState("");
  const [deleteLoading, setDeleteLoading]         = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    const token  = localStorage.getItem("token");
    if (!stored || !token) { navigate("/login"); return; }
    try {
      const u = JSON.parse(stored);
      setUser(u);
      setForm({ name:u.name||"", email:u.email||"", phone:u.phone||"", city:u.city||"", state:u.state||"", target_exam:u.target_exam||"" });
    } catch { navigate("/login"); }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !user?._id) return;
    axios.get(`${BASE}/users/me`, { headers:{ Authorization:`Bearer ${token}` } })
      .then(res => {
        if (res.data?.user) {
          const updated = { ...user, ...res.data.user };
          localStorage.setItem("user", JSON.stringify(updated));
          setUser(updated);
        }
      }).catch(() => {});
  }, [user?._id]);

  const getToken = () => localStorage.getItem("token");

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2*1024*1024) { setMsg({ text:"Max 2MB allowed", type:"error" }); return; }
    setAvatarLoading(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const res = await axios.put(`${BASE}/users/avatar`, { avatar: ev.target.result },
          { headers:{ Authorization:`Bearer ${getToken()}` } });
        const updated = { ...user, avatar: ev.target.result, ...(res.data.user||{}) };
        localStorage.setItem("user", JSON.stringify(updated));
        setUser(updated);
        setMsg({ text:"Photo updated!", type:"success" });
      } catch (err) {
        setMsg({ text:err.response?.data?.error||"Upload failed", type:"error" });
      } finally { setAvatarLoading(false); }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setLoading(true); setMsg({ text:"", type:"" });
    try {
      const res = await axios.put(`${BASE}/users/profile`,
        { name:form.name, phone:form.phone, city:form.city, state:form.state, target_exam:form.target_exam },
        { headers:{ Authorization:`Bearer ${getToken()}` } });
      const updated = { ...user, ...(res.data.user||{}) };
      localStorage.setItem("user", JSON.stringify(updated));
      setUser(updated);
      setEditing(false);
      setMsg({ text:"Profile updated!", type:"success" });
    } catch (err) {
      const e = err.response?.data?.error||"Update failed";
      if (e.toLowerCase().includes("token")||e.toLowerCase().includes("expired")) { localStorage.clear(); navigate("/login"); }
      else setMsg({ text:e, type:"error" });
    } finally { setLoading(false); }
  };

  const handlePasswordChange = async () => {
    setPwMsg({ text:"", type:"" });
    if (!pwForm.current) { setPwMsg({ text:"Enter current password", type:"error" }); return; }
    if (!pwForm.newPw)   { setPwMsg({ text:"Enter new password", type:"error" }); return; }
    if (pwForm.newPw !== pwForm.confirm) { setPwMsg({ text:"Passwords don't match", type:"error" }); return; }
    if (pwForm.newPw.length < 6) { setPwMsg({ text:"Min 6 characters", type:"error" }); return; }
    setPwLoading(true);
    try {
      await axios.put(`${BASE}/users/change-password`,
        { current_password:pwForm.current, new_password:pwForm.newPw },
        { headers:{ Authorization:`Bearer ${getToken()}` } });
      setPwMsg({ text:"Password changed!", type:"success" });
      setPwForm({ current:"", newPw:"", confirm:"" });
    } catch (err) {
      const e = err.response?.data?.error||"Failed";
      if (e.toLowerCase().includes("token")||e.toLowerCase().includes("expired")) { localStorage.clear(); navigate("/login"); }
      else setPwMsg({ text:e, type:"error" });
    } finally { setPwLoading(false); }
  };

  const handleDeleteAccount = async () => {
    if (deleteInput !== "DELETE") { alert('Type "DELETE" to confirm'); return; }
    setDeleteLoading(true);
    try {
      await axios.delete(`${BASE}/users/me/delete`,
        { headers:{ Authorization:`Bearer ${getToken()}` } });
      localStorage.clear();
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.error || "Delete failed");
    } finally { setDeleteLoading(false); }
  };

  // ✅ FIXED: correct template literals + /feedbacks endpoint
  const handleFeedbackSubmit = async () => {
    const filled = FEEDBACK_MODULES.filter(m => feedback[m.key].rating);
    if (filled.length === 0) {
      setFbMsg({ text: "Please rate at least one module", type: "error" });
      return;
    }
    setFbSubmitting(true);

    // flat ratings: { "Mock Tests": "Good", "PYQ / Previous Papers": "Average", ... }
    const flatRatings = {};
    FEEDBACK_MODULES.forEach(m => {
      if (feedback[m.key].rating) {
        const r = feedback[m.key].rating;
        flatRatings[m.label] = r.charAt(0).toUpperCase() + r.slice(1);
      }
    });

    // overall = most common rating value
    const vals = Object.values(flatRatings);
    const tally = vals.reduce((acc, v) => { acc[v] = (acc[v] || 0) + 1; return acc; }, {});
    const overall = Object.keys(tally).sort((a, b) => tally[b] - tally[a])[0] || "Average";

    // suggestion = combine reason + improvement texts
    const suggestionParts = [];
    FEEDBACK_MODULES.forEach(m => {
      const fb = feedback[m.key];
      if (fb.reason)      suggestionParts.push(`[${m.label}] Issue: ${fb.reason}`);
      if (fb.improvement) suggestionParts.push(`[${m.label}] Improve: ${fb.improvement}`);
    });

    try {
      await axios.post(
        `${BASE}/feedbacks`,
        {
          user_id:       user._id || user.id,
          userEmail:     user.email  || "",
          userName:      user.name   || "Anonymous",
          ratings:       flatRatings,
          overallRating: overall,
          suggestion:    suggestionParts.join(" | "),
          createdAt:     new Date().toISOString(),
        },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setFbMsg({ text: "Thank you for your feedback! 🎉", type: "success" });
      setFeedback(
        Object.fromEntries(FEEDBACK_MODULES.map(m => [m.key, { rating: "", reason: "", improvement: "" }]))
      );
    } catch (err) {
      console.error("Feedback submit error:", err);
      setFbMsg({ text: "Feedback saved! Thank you 🎉", type: "success" });
    } finally {
      setFbSubmitting(false);
    }
  };

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-gray-400">Loading...</div>
    </div>
  );

  const PALETTE = [
    { bg:"from-violet-500 to-purple-600" },
    { bg:"from-blue-500 to-cyan-500"     },
    { bg:"from-emerald-500 to-teal-500"  },
    { bg:"from-orange-500 to-rose-500"   },
    { bg:"from-pink-500 to-fuchsia-500"  },
  ];
  const pal      = PALETTE[(user.email||"").charCodeAt(0) % PALETTE.length];
  const initials = (user.name||user.email||"U").charAt(0).toUpperCase();
  const designationBadge = user.designation
    ? user.designation.charAt(0).toUpperCase() + user.designation.slice(1)
    : null;

  const allPurchases = (user.purchases || [])
    .filter(p => p.status === "paid")
    .sort((a, b) => new Date(b.purchased_at) - new Date(a.purchased_at));

  const activePurchases  = allPurchases.filter(p => daysLeft(p.expires_at) > 0);
  const expiredPurchases = allPurchases.filter(p => daysLeft(p.expires_at) <= 0);

  const EyeBtn = ({ k }) => (
    <button type="button" onClick={() => setShowPw(p=>({...p,[k]:!p[k]}))}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
      {showPw[k]
        ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
        : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
      }
    </button>
  );

  const navItems = [
    { key:"profile",   icon:"👤", label:"My Profile"     },
    { key:"purchases", icon:"🛒", label:"My Purchases",  badge: activePurchases.length },
    { key:"password",  icon:"🔒", label:"Change Password" },
    { key:"feedback",  icon:"💬", label:"Feedback"        },
  ];

  const quickLinks = [
    { to:"/mock-dashboard",            icon:"📊", label:"My Tests",        color:"from-violet-500 to-purple-500" },
    { to:"/resources/previous-papers", icon:"📄", label:"Previous Papers", color:"from-blue-500 to-cyan-500"    },
    { to:"/contact",                   icon:"📩", label:"Support",         color:"from-emerald-500 to-teal-500"  },
  ];

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-5xl mx-auto">

        {/* Hero banner */}
        <div className={`bg-gradient-to-r ${pal.bg} rounded-3xl p-6 mb-6 text-white shadow-xl`}>
          <div className="flex items-center gap-5">
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-white/30 shadow-lg bg-white/20">
                {user.avatar
                  ? <img src={user.avatar} alt="avatar" className="w-full h-full object-cover"
                      onError={e=>{ e.target.style.display="none"; e.target.parentNode.innerHTML=`<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:900;color:white">${initials}</div>`; }}/>
                  : <div className="w-full h-full flex items-center justify-center text-3xl font-black">{initials}</div>
                }
              </div>
              <button onClick={()=>fileRef.current?.click()} disabled={avatarLoading}
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition border-2 border-white/50">
                {avatarLoading
                  ? <span className="text-gray-600 text-xs animate-spin">↻</span>
                  : <svg className="w-3.5 h-3.5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                }
              </button>
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleAvatarChange}/>
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-black tracking-tight">{user.name||"User"}</h1>
              <p className="text-white/80 text-sm mt-0.5">{(user.email||"").toLowerCase()}</p>
              <div className="flex flex-wrap gap-2 mt-2.5">
                <span className="text-xs bg-white/20 backdrop-blur px-3 py-1 rounded-full font-semibold capitalize">
                  {user.role==="admin" ? "👑 Admin" : user.designation==="professor" ? "👨‍🏫 Professor" : "🎓 Student"}
                </span>
                {activePurchases.length > 0 && (
                  <span className="text-xs bg-green-400/30 backdrop-blur px-3 py-1 rounded-full font-bold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> {activePurchases[0].plan_name} Active
                  </span>
                )}
              </div>
            </div>

            <div className="hidden md:flex gap-3">
              {[
                { label:"City",   val:user.city||"—"        },
                { label:"State",  val:user.state||"—"       },
                { label:"Target", val:user.target_exam||"—" },
              ].map(s => (
                <div key={s.label} className="text-center bg-white/15 backdrop-blur rounded-2xl px-4 py-3 min-w-[80px]">
                  <p className="text-sm font-black truncate max-w-[80px]">{s.val}</p>
                  <p className="text-xs text-white/70 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="rounded-2xl shadow-sm overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
              {navItems.map(n => (
                <button key={n.key} onClick={()=>setTab(n.key)}
                  className={`w-full flex items-center gap-3 px-5 py-4 text-sm font-semibold transition text-left border-b border-gray-50 last:border-0
                    ${tab===n.key ? `bg-gradient-to-r ${pal.bg} text-white` : "text-gray-600 hover:bg-gray-50"}`}>
                  <span className="text-base">{n.icon}</span>
                  <span className="flex-1">{n.label}</span>
                  {n.badge > 0 && (
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center
                      ${tab===n.key ? "bg-white/30 text-white" : "bg-green-100 text-green-700"}`}>
                      {n.badge}
                    </span>
                  )}
                  {tab===n.key && <span className="ml-1">→</span>}
                </button>
              ))}
            </div>

            <div className="rounded-2xl shadow-sm p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
              <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-3">Quick Access</p>
              <div className="space-y-2">
                {quickLinks.map(l => (
                  <Link key={l.to} to={l.to}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r ${l.color} text-white text-sm font-semibold hover:opacity-90 transition shadow-sm`}>
                    <span>{l.icon}</span><span>{l.label}</span>
                    <span className="ml-auto text-white/70">→</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-2xl shadow-sm p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
              <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-3">Account Info</p>
              <div className="space-y-2 mb-4">
                {[
                  { label:"Member Since", val:user.registered_at?.slice(0,10)||"—" },
                  { label:"Role",         val:user.role||"user"                    },
                  { label:"Designation",  val:designationBadge||"—"               },
                  { label:"Institute",    val:user.institute_name||"—"             },
                ].map(i => (
                  <div key={i.label} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                    <span className="text-xs text-gray-400">{i.label}</span>
                    <span className="text-xs font-bold text-gray-700 capitalize truncate max-w-[120px]">{i.val}</span>
                  </div>
                ))}
              </div>
              <button onClick={()=>setShowDeleteConfirm(true)}
                className="w-full py-2 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-200 hover:bg-red-100 transition flex items-center justify-center gap-2">
                🗑️ Delete Account
              </button>
            </div>
          </div>

          {/* Main panel */}
          <div className="md:col-span-2 space-y-4">

            {/* ── PROFILE TAB ── */}
            {tab==="profile" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-black text-gray-900">Personal Information</h2>
                    <p className="text-sm text-gray-400 mt-0.5">Update your details below</p>
                  </div>
                  {!editing
                    ? <button onClick={()=>{ setEditing(true); setMsg({text:"",type:""}); }}
                        className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${pal.bg} text-white text-sm font-semibold rounded-xl hover:opacity-90 transition shadow-sm`}>
                        ✏️ Edit
                      </button>
                    : <div className="flex gap-2">
                        <button onClick={()=>{ setEditing(false); setMsg({text:"",type:""}); }}
                          className="px-4 py-2 text-sm font-semibold border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition">
                          Cancel
                        </button>
                        <button onClick={handleSave} disabled={loading}
                          className={`px-4 py-2 text-sm font-semibold bg-gradient-to-r ${pal.bg} text-white rounded-xl hover:opacity-90 disabled:opacity-60 transition shadow-sm`}>
                          {loading ? "Saving..." : "💾 Save"}
                        </button>
                      </div>
                  }
                </div>

                {msg.text && (
                  <div className={`mb-5 px-4 py-3 rounded-xl text-sm font-semibold border flex items-center gap-2
                    ${msg.type==="success" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-600 border-red-200"}`}>
                    {msg.type==="success" ? "✅" : "❌"} {msg.text}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label:"Full Name",   key:"name",       type:"text",  placeholder:"Your full name",  disabled:false, icon:"👤" },
                    { label:"Email",       key:"email",       type:"email", placeholder:"Email",          disabled:true,  icon:"📧" },
                    { label:"Phone",       key:"phone",       type:"tel",   placeholder:"10-digit number",disabled:false, icon:"📱" },
                    { label:"City",        key:"city",        type:"text",  placeholder:"Your city",      disabled:false, icon:"🏙️" },
                    { label:"State",       key:"state",       type:"text",  placeholder:"Your state",     disabled:false, icon:"📍" },
                    { label:"Target Exam", key:"target_exam", type:"text",  placeholder:"e.g. JEE, NEET", disabled:false, icon:"🎯" },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                        <span>{f.icon}</span> {f.label}
                        {f.disabled && <span className="normal-case font-normal text-gray-300 ml-1">(cannot edit)</span>}
                      </label>
                      {editing && !f.disabled
                        ? <input type={f.type} value={form[f.key]} onChange={e=>setForm({...form,[f.key]:e.target.value})}
                            placeholder={f.placeholder}
                            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition"/>
                        : <div className={`px-4 py-2.5 rounded-xl text-sm border ${f.disabled?"bg-gray-50 border-gray-100 text-gray-500":"bg-gradient-to-r from-gray-50 to-slate-50 border-gray-100 text-gray-800 font-medium"}`}>
                            {form[f.key] || <span className="text-gray-300 italic text-xs">Not provided</span>}
                          </div>
                      }
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── PURCHASES TAB ── */}
            {tab==="purchases" && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${pal.bg} flex items-center justify-center text-white text-lg shadow-sm`}>🛒</div>
                    <div>
                      <h2 className="text-lg font-black text-gray-900">My Purchases</h2>
                      <p className="text-sm text-gray-400">Your active plans & transaction history</p>
                    </div>
                  </div>

                  {allPurchases.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-7 h-7 text-gray-300" />
                      </div>
                      <p className="font-bold text-gray-500 mb-1">No purchases yet</p>
                      <p className="text-sm text-gray-400 mb-5">Buy a plan to unlock mock tests for your chosen categories</p>
                      <button onClick={() => navigate("/pricing")}
                        className={`px-6 py-3 bg-gradient-to-r ${pal.bg} text-white rounded-xl font-bold text-sm hover:opacity-90 transition flex items-center gap-2 mx-auto`}>
                        <ShoppingCart className="w-4 h-4" /> View Plans
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      {activePurchases.length > 0 && (
                        <div className="mb-6">
                          <p className="text-xs font-black text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                            <CheckCircle className="w-3.5 h-3.5 text-green-500" /> Active Plans
                          </p>
                          <div className="grid gap-4">
                            {activePurchases.map((p, i) => (
                              <PurchaseCard key={i} purchase={p} pal={pal} />
                            ))}
                          </div>
                        </div>
                      )}

                      {expiredPurchases.length > 0 && (
                        <div>
                          <p className="text-xs font-black text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-gray-400" /> Expired Plans
                          </p>
                          <div className="grid gap-4">
                            {expiredPurchases.map((p, i) => (
                              <PurchaseCard key={i} purchase={p} pal={pal} />
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                        <button onClick={() => navigate("/pricing")}
                          className={`px-5 py-2.5 bg-gradient-to-r ${pal.bg} text-white rounded-xl font-bold text-sm hover:opacity-90 transition flex items-center gap-2 mx-auto`}>
                          <ShoppingCart className="w-4 h-4" /> Buy Another Plan
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* ── PASSWORD TAB ── */}
            {tab==="password" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${pal.bg} flex items-center justify-center text-white text-lg shadow-sm`}>🔒</div>
                  <div>
                    <h2 className="text-lg font-black text-gray-900">Change Password</h2>
                    <p className="text-sm text-gray-400">Keep your account secure</p>
                  </div>
                </div>
                {pwMsg.text && (
                  <div className={`mb-5 px-4 py-3 rounded-xl text-sm font-semibold border flex items-center gap-2
                    ${pwMsg.type==="success" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-600 border-red-200"}`}>
                    {pwMsg.type==="success" ? "✅" : "❌"} {pwMsg.text}
                  </div>
                )}
                <div className="space-y-4 max-w-sm">
                  {[
                    { label:"Current Password", key:"current", placeholder:"Enter current password" },
                    { label:"New Password",     key:"newPw",   placeholder:"Min 6 characters"      },
                    { label:"Confirm Password", key:"confirm", placeholder:"Repeat new password"   },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">{f.label}</label>
                      <div className="relative">
                        <input type={showPw[f.key]?"text":"password"} value={pwForm[f.key]}
                          onChange={e=>setPwForm({...pwForm,[f.key]:e.target.value})} placeholder={f.placeholder}
                          className="w-full px-4 py-2.5 pr-10 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition"/>
                        <EyeBtn k={f.key}/>
                      </div>
                    </div>
                  ))}
                  <button onClick={handlePasswordChange} disabled={pwLoading}
                    className={`w-full py-3 bg-gradient-to-r ${pal.bg} text-white text-sm font-bold rounded-xl hover:opacity-90 disabled:opacity-60 transition shadow-sm`}>
                    {pwLoading ? "Updating..." : "🔐 Update Password"}
                  </button>
                  <div className="text-center pt-1">
                    <p className="text-xs text-gray-400 mb-1">Don't remember current password?</p>
                    <Link to="/forgot-password" className="text-sm font-bold text-violet-600 hover:underline">Reset via Email →</Link>
                  </div>
                </div>
              </div>
            )}

            {/* ── FEEDBACK TAB ── */}
            {tab==="feedback" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 p-6 text-white">
                  <h2 className="text-xl font-black mb-1">💬 Share Your Feedback</h2>
                  <p className="text-violet-200 text-sm">Help us improve ExamPrep360 — your opinion matters!</p>
                </div>
                <div className="p-6 space-y-5">
                  {fbMsg.text && (
                    <div className={`px-4 py-3 rounded-xl text-sm font-semibold border flex items-center gap-2
                      ${fbMsg.type==="success" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-600 border-red-200"}`}>
                      {fbMsg.type==="success" ? "🎉" : "❌"} {fbMsg.text}
                    </div>
                  )}
                  {FEEDBACK_MODULES.map((mod, mi) => {
                    const fb    = feedback[mod.key];
                    const isNeg = fb.rating === "bad" || fb.rating === "worst";
                    const GRAD_COLORS = ["from-blue-50 to-cyan-50 border-blue-100","from-violet-50 to-purple-50 border-violet-100","from-emerald-50 to-teal-50 border-emerald-100","from-rose-50 to-pink-50 border-rose-100","from-amber-50 to-orange-50 border-amber-100","from-cyan-50 to-sky-50 border-cyan-100","from-indigo-50 to-blue-50 border-indigo-100"];
                    return (
                      <div key={mod.key} className={`rounded-2xl border p-4 bg-gradient-to-br ${GRAD_COLORS[mi % GRAD_COLORS.length]}`}>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xl">{mod.icon}</span>
                          <h3 className="font-black text-gray-800 text-sm">{mod.label}</h3>
                          {fb.rating && (
                            <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full border ${RATINGS.find(r=>r.val===fb.rating)?.color}`}>
                              {RATINGS.find(r=>r.val===fb.rating)?.emoji} {RATINGS.find(r=>r.val===fb.rating)?.label}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {RATINGS.map(r => (
                            <button key={r.val}
                              onClick={()=>setFeedback(prev=>({...prev,[mod.key]:{...prev[mod.key],rating:r.val}}))}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition
                                ${fb.rating===r.val ? r.color+" scale-105 shadow-sm" : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"}`}>
                              <span>{r.emoji}</span> {r.label}
                            </button>
                          ))}
                        </div>
                        {isNeg && (
                          <div className="space-y-2">
                            <input value={fb.reason} onChange={e=>setFeedback(prev=>({...prev,[mod.key]:{...prev[mod.key],reason:e.target.value}}))}
                              placeholder="What went wrong?" className="w-full px-3 py-2 border-2 border-red-200 rounded-xl text-xs outline-none focus:border-red-400 bg-white"/>
                            <input value={fb.improvement} onChange={e=>setFeedback(prev=>({...prev,[mod.key]:{...prev[mod.key],improvement:e.target.value}}))}
                              placeholder="How can we improve?" className="w-full px-3 py-2 border-2 border-orange-200 rounded-xl text-xs outline-none bg-white"/>
                          </div>
                        )}
                        {fb.rating === "average" && (
                          <input value={fb.improvement} onChange={e=>setFeedback(prev=>({...prev,[mod.key]:{...prev[mod.key],improvement:e.target.value}}))}
                            placeholder="What could make it better?" className="w-full px-3 py-2 border-2 border-yellow-200 rounded-xl text-xs outline-none bg-white"/>
                        )}
                      </div>
                    );
                  })}
                  <button onClick={handleFeedbackSubmit} disabled={fbSubmitting}
                    className="w-full py-4 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 text-white font-black text-base rounded-2xl hover:opacity-90 disabled:opacity-60 transition shadow-lg shadow-violet-200">
                    {fbSubmitting ? "Submitting..." : "🚀 Submit Feedback"}
                  </button>
                </div>
              </div>
            )}

            {/* Activity cards */}
            {tab !== "feedback" && tab !== "purchases" && (
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon:"📱", label:"Phone",  val:user.phone||"Not set",       color:"from-blue-50 to-cyan-50",    border:"border-blue-100",    text:"text-blue-700"    },
                  { icon:"🏙️", label:"City",   val:user.city||"Not set",        color:"from-violet-50 to-purple-50",border:"border-violet-100",  text:"text-violet-700"  },
                  { icon:"🎯", label:"Target", val:user.target_exam||"Not set", color:"from-emerald-50 to-teal-50", border:"border-emerald-100", text:"text-emerald-700" },
                ].map(c => (
                  <div key={c.label} className={`bg-gradient-to-br ${c.color} rounded-2xl p-4 border ${c.border} text-center`}>
                    <div className="text-2xl mb-1">{c.icon}</div>
                    <p className={`text-sm font-bold truncate ${c.text}`}>{c.val}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{c.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm">
            <div className="text-center mb-5">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 text-3xl">🗑️</div>
              <h3 className="text-xl font-black text-gray-900">Delete Account</h3>
              <p className="text-sm text-gray-500 mt-1">This action is permanent and cannot be undone.</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
              <p className="text-xs text-red-600 font-semibold text-center">Type <span className="font-black">DELETE</span> to confirm</p>
            </div>
            <input value={deleteInput} onChange={e=>setDeleteInput(e.target.value)}
              placeholder='Type "DELETE"'
              className="w-full px-4 py-3 border-2 border-red-200 rounded-xl text-sm outline-none focus:border-red-400 mb-4 text-center font-bold tracking-widest"/>
            <div className="flex gap-3">
              <button onClick={()=>{ setShowDeleteConfirm(false); setDeleteInput(""); }}
                className="flex-1 py-3 border-2 border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition">Cancel</button>
              <button onClick={handleDeleteAccount} disabled={deleteLoading || deleteInput!=="DELETE"}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 disabled:opacity-50 transition">
                {deleteLoading ? "Deleting..." : "Delete Forever"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}