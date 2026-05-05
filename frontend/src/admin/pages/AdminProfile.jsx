import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const BASE = "https://examprep360-production.up.railway.app/api";

export default function AdminProfile() {
  const navigate  = useNavigate();
  const fileRef   = useRef(null);
  const [tab, setTab] = useState("profile");

  const [user, setUser]       = useState(null);
  const [form, setForm]       = useState({ name:"", email:"", phone:"", city:"", state:"" });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg]         = useState({ text:"", type:"" });

  const [pwForm, setPwForm]       = useState({ current:"", newPw:"", confirm:"" });
  const [pwMsg, setPwMsg]         = useState({ text:"", type:"" });
  const [pwLoading, setPwLoading] = useState(false);
  const [showPw, setShowPw]       = useState({ current:false, newPw:false, confirm:false });

  const [avatarLoading, setAvatarLoading] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput]             = useState("");
  const [deleteLoading, setDeleteLoading]         = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    const token  = localStorage.getItem("token");
    if (!stored || !token) { navigate("/login"); return; }
    try {
      const u = JSON.parse(stored);
      if (u.role !== "admin") { navigate("/profile"); return; }
      setUser(u);
      setForm({ name:u.name||"", email:u.email||"", phone:u.phone||"", city:u.city||"", state:u.state||"" });
    } catch { navigate("/login"); }
  }, [navigate]);

  const getToken = () => localStorage.getItem("token");

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setMsg({ text:"Max 2MB allowed", type:"error" }); return; }
    setAvatarLoading(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const res = await axios.put(`${BASE}/users/avatar`,
          { avatar: ev.target.result },
          { headers: { Authorization: `Bearer ${getToken()}` } });
        const updated = { ...user, avatar: ev.target.result, ...(res.data.user || {}) };
        localStorage.setItem("user", JSON.stringify(updated));
        setUser(updated);
        setMsg({ text:"Photo updated!", type:"success" });
      } catch (err) {
        setMsg({ text: err.response?.data?.error || "Upload failed", type:"error" });
      } finally { setAvatarLoading(false); }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setLoading(true); setMsg({ text:"", type:"" });
    try {
      const res = await axios.put(`${BASE}/users/profile`,
        { name: form.name, phone: form.phone, city: form.city, state: form.state },
        { headers: { Authorization: `Bearer ${getToken()}` } });
      const updated = { ...user, ...(res.data.user || {}) };
      localStorage.setItem("user", JSON.stringify(updated));
      setUser(updated);
      setEditing(false);
      setMsg({ text:"Profile updated!", type:"success" });
    } catch (err) {
      const e = err.response?.data?.error || "Update failed";
      if (e.toLowerCase().includes("token") || e.toLowerCase().includes("expired")) {
        localStorage.clear(); navigate("/login");
      } else setMsg({ text: e, type:"error" });
    } finally { setLoading(false); }
  };

  const handlePasswordChange = async () => {
    setPwMsg({ text:"", type:"" });
    if (!pwForm.current) { setPwMsg({ text:"Enter current password", type:"error" }); return; }
    if (!pwForm.newPw)   { setPwMsg({ text:"Enter new password",     type:"error" }); return; }
    if (pwForm.newPw !== pwForm.confirm) { setPwMsg({ text:"Passwords don't match", type:"error" }); return; }
    if (pwForm.newPw.length < 6)         { setPwMsg({ text:"Min 6 characters",      type:"error" }); return; }
    setPwLoading(true);
    try {
      await axios.put(`${BASE}/users/change-password`,
        { current_password: pwForm.current, new_password: pwForm.newPw },
        { headers: { Authorization: `Bearer ${getToken()}` } });
      setPwMsg({ text:"Password changed successfully! ✅", type:"success" });
      setPwForm({ current:"", newPw:"", confirm:"" });
    } catch (err) {
      const e = err.response?.data?.error || "Failed";
      if (e.toLowerCase().includes("token") || e.toLowerCase().includes("expired")) {
        localStorage.clear(); navigate("/login");
      } else setPwMsg({ text: e, type:"error" });
    } finally { setPwLoading(false); }
  };

  const handleDeleteAccount = async () => {
    if (deleteInput !== "DELETE") { alert('Type "DELETE" to confirm'); return; }
    setDeleteLoading(true);
    try {
      await axios.delete(`${BASE}/users/me/delete`,
        { headers: { Authorization: `Bearer ${getToken()}` } });
      localStorage.clear();
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.error || "Delete failed");
    } finally { setDeleteLoading(false); }
  };

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
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
  const pal      = PALETTE[(user.email || "").charCodeAt(0) % PALETTE.length];
  const initials = (user.name || user.email || "A").charAt(0).toUpperCase();

  // ── OAuth user check ──
  const isOAuthUser = user.has_password === false;

  const EyeBtn = ({ k }) => (
    <button type="button"
      onClick={() => setShowPw(p => ({ ...p, [k]: !p[k] }))}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300">
      {showPw[k]
        ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
          </svg>
        : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
          </svg>
      }
    </button>
  );

  const navItems = [
    { key:"profile",  icon:"👤", label:"My Profile"     },
    { key:"password", icon:"🔒", label:"Change Password" },
  ];

  return (
    <div className="min-h-screen bg-transparent py-8 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Hero Banner */}
        <div className={`bg-gradient-to-r ${pal.bg} rounded-3xl p-6 mb-6 text-white shadow-xl`}>
          <div className="flex items-center gap-5">
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-white/30 shadow-lg bg-white/20">
                {user.avatar
                  ? <img src={user.avatar} alt="avatar" className="w-full h-full object-cover"
                      onError={e => {
                        e.target.style.display = "none";
                        e.target.parentNode.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:900;color:white">${initials}</div>`;
                      }}/>
                  : <div className="w-full h-full flex items-center justify-center text-3xl font-black">{initials}</div>
                }
              </div>
              <button onClick={() => fileRef.current?.click()} disabled={avatarLoading}
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition border-2 border-white/50">
                {avatarLoading
                  ? <span className="text-gray-600 text-xs animate-spin">↻</span>
                  : <svg className="w-3.5 h-3.5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                }
              </button>
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp"
                className="hidden" onChange={handleAvatarChange}/>
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-black tracking-tight">{user.name || "Admin"}</h1>
              <p className="text-white/80 text-sm mt-0.5">{user.email}</p>
              <div className="flex flex-wrap gap-2 mt-2.5">
                <span className="text-xs bg-white/20 backdrop-blur px-3 py-1 rounded-full font-semibold">👑 Admin</span>
                {isOAuthUser && (
                  <span className="text-xs bg-white/20 backdrop-blur px-3 py-1 rounded-full font-semibold">🔗 Google Account</span>
                )}
              </div>
            </div>

            <div className="hidden md:flex gap-3">
              {[
                { label:"City",  val: user.city  || "—" },
                { label:"State", val: user.state || "—" },
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
            <div className="bg-white/10 dark:bg-slate-800 rounded-2xl shadow-sm border border-white/10 overflow-hidden">
              {navItems.map(n => (
                <button key={n.key} onClick={() => setTab(n.key)}
                  className={`w-full flex items-center gap-3 px-5 py-4 text-sm font-semibold transition text-left border-b border-white/10 last:border-0
                    ${tab === n.key
                      ? `bg-gradient-to-r ${pal.bg} text-white`
                      : "text-gray-300 hover:bg-white/10"}`}>
                  <span className="text-base">{n.icon}</span>
                  <span>{n.label}</span>
                  {tab === n.key && <span className="ml-auto">→</span>}
                </button>
              ))}
            </div>

            <div className="bg-white/10 dark:bg-slate-800 rounded-2xl shadow-sm border border-white/10 p-4">
              <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-3">Account Info</p>
              <div className="space-y-2 mb-4">
                {[
                  { label:"Member Since", val: user.registered_at ? new Date(user.registered_at).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }) : "—" },
                  { label:"Role",         val: "Admin"},
                  { label:"Status",       val: user.status || "Active" },
                ].map(i => (
                  <div key={i.label} className="flex items-center justify-between py-1.5 border-b border-white/10 last:border-0">
                    <span className="text-xs text-gray-400">{i.label}</span>
                    <span className="text-xs font-bold text-gray-200 capitalize">{i.val}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setShowDeleteConfirm(true)}
                className="w-full py-2 bg-red-500/10 text-red-400 text-xs font-bold rounded-xl border border-red-500/30 hover:bg-red-500/20 transition flex items-center justify-center gap-2">
                🗑️ Delete Account
              </button>
            </div>
          </div>

          {/* Main Panel */}
          <div className="md:col-span-2 space-y-4">

            {/* PROFILE TAB */}
            {tab === "profile" && (
              <div className="bg-white/10 dark:bg-slate-800 rounded-2xl shadow-sm border border-white/10 p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-black text-white">Personal Information</h2>
                    <p className="text-sm text-gray-400 mt-0.5">Update your details below</p>
                  </div>
                  {!editing
                    ? <button onClick={() => { setEditing(true); setMsg({ text:"", type:"" }); }}
                        className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${pal.bg} text-white text-sm font-semibold rounded-xl hover:opacity-90 transition shadow-sm`}>
                        ✏️ Edit
                      </button>
                    : <div className="flex gap-2">
                        <button onClick={() => { setEditing(false); setMsg({ text:"", type:"" }); }}
                          className="px-4 py-2 text-sm font-semibold border border-white/20 rounded-xl text-gray-300 hover:bg-white/10 transition">
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
                    ${msg.type === "success"
                      ? "bg-green-500/10 text-green-400 border-green-500/30"
                      : "bg-red-500/10 text-red-400 border-red-500/30"}`}>
                    {msg.type === "success" ? "✅" : "❌"} {msg.text}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label:"Full Name", key:"name",  type:"text",  placeholder:"Your full name",  disabled:false, icon:"👤" },
                    { label:"Email",     key:"email", type:"email", placeholder:"Email",           disabled:true,  icon:"📧" },
                    { label:"Phone",     key:"phone", type:"tel",   placeholder:"10-digit number", disabled:false, icon:"📱" },
                    { label:"City",      key:"city",  type:"text",  placeholder:"Your city",       disabled:false, icon:"🏙️" },
                    { label:"State",     key:"state", type:"text",  placeholder:"Your state",      disabled:false, icon:"📍" },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="flex items-center gap-1.5 text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wide">
                        <span>{f.icon}</span> {f.label}
                        {f.disabled && <span className="normal-case font-normal text-gray-500 ml-1">(cannot edit)</span>}
                      </label>
                      {editing && !f.disabled
                        ? <input type={f.type} value={form[f.key]}
                            onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                            placeholder={f.placeholder}
                            className="w-full px-4 py-2.5 border-2 border-white/20 bg-slate-700 text-white rounded-xl text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 transition placeholder-gray-400"/>
                        : <div className={`px-4 py-2.5 rounded-xl text-sm border
                            ${f.disabled
                              ? "bg-white/5 border-white/10 text-gray-500"
                              : "bg-white/5 border-white/10 text-gray-200 font-medium"}`}>
                            {form[f.key] || <span className="text-gray-600 italic text-xs">Not provided</span>}
                          </div>
                      }
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PASSWORD TAB */}
            {tab === "password" && (
              <div className="bg-white/10 dark:bg-slate-800 rounded-2xl shadow-sm border border-white/10 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${pal.bg} flex items-center justify-center text-white text-lg shadow-sm`}>🔒</div>
                  <div>
                    <h2 className="text-lg font-black text-white">Change Password</h2>
                    <p className="text-sm text-gray-400">Keep your account secure</p>
                  </div>
                </div>

                {/* ── OAuth warning ── */}
                {isOAuthUser ? (
                  <div className="px-4 py-4 rounded-xl text-sm font-semibold border bg-amber-500/10 text-amber-400 border-amber-500/30 flex flex-col gap-3">
                    <p>⚠️ You signed up via <strong>Google</strong>. Password change is not available for Google accounts.</p>
                    <Link to="/forgot-password"
                      className="inline-flex items-center gap-1 text-sm font-bold text-violet-400 hover:underline">
                      Set a password via Email Reset →
                    </Link>
                  </div>
                ) : (
                  <>
                    {pwMsg.text && (
                      <div className={`mb-5 px-4 py-3 rounded-xl text-sm font-semibold border flex items-center gap-2
                        ${pwMsg.type === "success"
                          ? "bg-green-500/10 text-green-400 border-green-500/30"
                          : "bg-red-500/10 text-red-400 border-red-500/30"}`}>
                        {pwMsg.type === "success" ? "✅" : "❌"} {pwMsg.text}
                      </div>
                    )}
                    <div className="space-y-4 max-w-sm">
                      {[
                        { label:"Current Password", key:"current", placeholder:"Enter current password" },
                        { label:"New Password",      key:"newPw",  placeholder:"Min 6 characters"       },
                        { label:"Confirm Password",  key:"confirm",placeholder:"Repeat new password"    },
                      ].map(f => (
                        <div key={f.key}>
                          <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wide">{f.label}</label>
                          <div className="relative">
                            <input
                              type={showPw[f.key] ? "text" : "password"}
                              value={pwForm[f.key]}
                              onChange={e => setPwForm({ ...pwForm, [f.key]: e.target.value })}
                              placeholder={f.placeholder}
                              className="w-full px-4 py-2.5 pr-10 border-2 border-white/20 bg-slate-700 text-white rounded-xl text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 transition placeholder-gray-400"
                            />
                            <EyeBtn k={f.key}/>
                          </div>
                        </div>
                      ))}
                      <button onClick={handlePasswordChange} disabled={pwLoading}
                        className={`w-full py-3 bg-gradient-to-r ${pal.bg} text-white text-sm font-bold rounded-xl hover:opacity-90 disabled:opacity-60 transition shadow-sm`}>
                        {pwLoading ? "Updating..." : "🔐 Update Password"}
                      </button>
                      <div className="text-center pt-1">
                        <p className="text-xs text-gray-500 mb-1">Don't remember current password?</p>
                        <Link to="/forgot-password" className="text-sm font-bold text-violet-400 hover:underline">Reset via Email →</Link>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Summary cards */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon:"📱", label:"Phone", val: user.phone || "Not set", color:"from-blue-500/10 to-cyan-500/10",    border:"border-blue-500/20",   text:"text-blue-400"   },
                { icon:"🏙️", label:"City",  val: user.city  || "Not set", color:"from-violet-500/10 to-purple-500/10",border:"border-violet-500/20", text:"text-violet-400" },
              ].map(c => (
                <div key={c.label} className={`bg-gradient-to-br ${c.color} rounded-2xl p-4 border ${c.border} text-center`}>
                  <div className="text-2xl mb-1">{c.icon}</div>
                  <p className={`text-sm font-bold truncate ${c.text}`}>{c.val}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{c.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-white/10 rounded-3xl shadow-2xl p-6 w-full max-w-sm">
            <div className="text-center mb-5">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3 text-3xl">🗑️</div>
              <h3 className="text-xl font-black text-white">Delete Account</h3>
              <p className="text-sm text-gray-400 mt-1">This action is permanent and cannot be undone.</p>
            </div>
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4">
              <p className="text-xs text-red-400 font-semibold text-center">Type <span className="font-black">DELETE</span> to confirm</p>
            </div>
            <input value={deleteInput} onChange={e => setDeleteInput(e.target.value)}
              placeholder='Type "DELETE"'
              className="w-full px-4 py-3 border-2 border-red-500/30 bg-slate-700 text-white rounded-xl text-sm outline-none focus:border-red-400 mb-4 text-center font-bold tracking-widest placeholder-gray-500"/>
            <div className="flex gap-3">
              <button onClick={() => { setShowDeleteConfirm(false); setDeleteInput(""); }}
                className="flex-1 py-3 border-2 border-white/20 rounded-xl text-sm font-bold text-gray-300 hover:bg-white/10 transition">
                Cancel
              </button>
              <button onClick={handleDeleteAccount} disabled={deleteLoading || deleteInput !== "DELETE"}
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