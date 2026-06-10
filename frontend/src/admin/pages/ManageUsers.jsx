import { useEffect, useState, useMemo } from "react";
import api from "../../utils/axiosConfig";

const STATUS_CONFIG = {
  active:    { label: "Active",    bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
  blocked:   { label: "Blocked",   bg: "bg-red-100",     text: "text-red-700",     dot: "bg-red-500"     },
  suspended: { label: "Suspended", bg: "bg-orange-100",  text: "text-orange-700",  dot: "bg-orange-500"  },
  inactive:  { label: "Inactive",  bg: "bg-gray-100",    text: "text-gray-600",    dot: "bg-gray-400"    },
};

const ROLE_CONFIG = {
  admin: { bg: "bg-violet-100", text: "text-violet-700" },
  user:  { bg: "bg-blue-100",   text: "text-blue-700"   },
};

const getUserStatus = (user) => {
  if (user.is_blocked) return "blocked";
  if (user.status)     return user.status.toLowerCase();
  return "active";
};

const getInitials = (name, email) => {
  if (name) return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  return (email || "U")[0].toUpperCase();
};

const AVATAR_COLORS = [
  "bg-blue-500","bg-violet-500","bg-emerald-500",
  "bg-rose-500","bg-amber-500","bg-cyan-500","bg-indigo-500",
];
const getAvatarColor = (str) => AVATAR_COLORS[(str || "").charCodeAt(0) % AVATAR_COLORS.length];

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.active;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
      {cfg.label}
    </span>
  );
};

const RoleBadge = ({ role }) => {
  const cfg = ROLE_CONFIG[role] || ROLE_CONFIG.user;
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${cfg.bg} ${cfg.text}`}>
      {role}
    </span>
  );
};

const ManageUsers = () => {
  const [users, setUsers]               = useState([]);
  const [loadingId, setLoadingId]       = useState(null);
  const [toast, setToast]               = useState(null);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [userDetails, setUserDetails]   = useState({});
  const [detailLoading, setDetailLoading] = useState(false);

  // Filters
  const [search, setSearch]       = useState("");
  const [roleFilter, setRoleFilter]     = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy]             = useState("newest");

  // Pagination
  const [page, setPage]           = useState(1);
  const PER_PAGE = 10;

  const token = localStorage.getItem("token");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.filter((u) => u.email));
    } catch {
      showToast("Unable to load users", "error");
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // ── Filtered + sorted list ──────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...users];

    // Search — name, email, unique id
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(u =>
        (u.name  || "").toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q) ||
        (u._id   || u.id || "").toLowerCase().includes(q)
      );
    }

    // Role filter
    if (roleFilter !== "all") list = list.filter(u => u.role === roleFilter);

    // Status filter
    if (statusFilter !== "all") list = list.filter(u => getUserStatus(u) === statusFilter);

    // Sort
    if (sortBy === "newest") list.sort((a, b) => (b.registered_at || "").localeCompare(a.registered_at || ""));
    if (sortBy === "oldest") list.sort((a, b) => (a.registered_at || "").localeCompare(b.registered_at || ""));
    if (sortBy === "name")   list.sort((a, b) => (a.name || a.email).localeCompare(b.name || b.email));

    return list;
  }, [users, search, roleFilter, statusFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Reset page when filters change
  useEffect(() => setPage(1), [search, roleFilter, statusFilter, sortBy]);

  // ── Actions ──────────────────────────────────────────────────────────────
  const handleExpandUser = async (user) => {
    const uid = user._id || user.id;
    if (expandedUserId === uid) { setExpandedUserId(null); return; }
    setExpandedUserId(uid);
    if (userDetails[uid]) return;
    setDetailLoading(true);
    try {
      const res = await api.get(`/users/${uid}/details`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserDetails(prev => ({ ...prev, [uid]: res.data }));
    } catch {
      setUserDetails(prev => ({ ...prev, [uid]: null }));
    } finally {
      setDetailLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user permanently?")) return;
    setLoadingId(id);
    try {
      await api.delete(`/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      showToast("User deleted successfully");
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.error || "Delete failed", "error");
    } finally { setLoadingId(null); }
  };

  const handleRoleChange = async (user) => {
    const uid     = user._id || user.id;
    const newRole = user.role === "admin" ? "user" : "admin";
    setLoadingId(uid);
    try {
      await api.put(`/users/${uid}/role`, { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } });
      showToast(`Role changed to ${newRole}`);
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.error || "Role update failed", "error");
    } finally { setLoadingId(null); }
  };

  const handleStatusChange = async (user, newStatus) => {
    const uid = user._id || user.id;
    setLoadingId(uid);
    try {
      await api.put(`/users/${uid}/status`,
        { is_blocked: newStatus === "blocked", status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast(`Status updated to ${newStatus}`);
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.error || "Status update failed", "error");
    } finally { setLoadingId(null); }
  };

  // ── Detail Panel ─────────────────────────────────────────────────────────
  const UserDetailPanel = ({ uid }) => {
    const detail = userDetails[uid];
    if (detailLoading && !detail) return (
      <tr><td colSpan="7" className="bg-slate-50 px-8 py-6 text-center text-sm text-slate-400">
        Loading details...
      </td></tr>
    );
    if (!detail) return (
      <tr><td colSpan="7" className="bg-red-50 px-8 py-4 text-center text-sm text-red-400">
        Failed to load details.
      </td></tr>
    );

    const EMPTY = ["", "—", "none", "null", "undefined"];
    const fields = [
      { label: "Full Name",         value: detail.name },
      { label: "Email",             value: (detail.email||"").toLowerCase() },
      { label: "Phone",             value: detail.phone },
      { label: "City",              value: detail.city },
      { label: "State",             value: detail.state },
      { label: "Target Exam",       value: detail.target_exam },
      { label: "Designation",       value: detail.designation },
      { label: "Profession",        value: detail.profession },
      { label: "Institute/College", value: detail.institute_name },
      { label: "Student Type",      value: detail.student_type },
      { label: "User ID",           value: detail._id || detail.id },
      { label: "Registered At",     value: detail.registered_at?.slice(0, 19) },
      { label: "Last Seen",         value: detail.last_seen?.slice(0, 19) },
    ].filter(f => f.value && !EMPTY.includes((f.value || "").toString().trim().toLowerCase()));

    return (
      <tr>
        <td colSpan="7" className="bg-gradient-to-br from-slate-50 to-blue-50 border-t border-slate-200">
          <div className="px-8 py-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${getAvatarColor(detail.email)}`}>
                {getInitials(detail.name, detail.email)}
              </div>
              <div>
                <h3 className="font-bold text-slate-800">{detail.name || detail.email}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`w-2 h-2 rounded-full ${detail.is_online ? "bg-emerald-500" : "bg-slate-300"}`}></span>
                  <span className="text-xs text-slate-500">{detail.is_online ? "Online now" : "Offline"}</span>
                </div>
              </div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              {fields.map(f => (
                <div key={f.label} className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm">
                  <p className="text-xs text-slate-400 font-medium mb-1">{f.label}</p>
                  <p className="text-sm font-semibold text-slate-800 break-all capitalize">{f.value}</p>
                </div>
              ))}
            </div>

            {/* Status changer */}
            <div className="flex items-center gap-3 mb-5 p-3 bg-white rounded-xl border border-slate-100">
              <span className="text-xs font-semibold text-slate-500 uppercase">Change Status:</span>
              {["active", "inactive", "blocked", "suspended"].map(s => {
                const cfg = STATUS_CONFIG[s];
                const current = getUserStatus(detail);
                return (
                  <button key={s} onClick={() => handleStatusChange(detail, s)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition
                      ${current === s
                        ? `${cfg.bg} ${cfg.text} border-current`
                        : "bg-white text-slate-500 border-slate-200 hover:border-slate-400"
                      }`}>
                    {cfg.label}
                  </button>
                );
              })}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Login History */}
              <div>
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">Login History (Last 10)</p>
                {detail.login_history?.length > 0 ? (
                  <div className="bg-white border border-slate-100 rounded-xl overflow-hidden">
                    <table className="w-full text-xs">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-slate-500">#</th>
                          <th className="px-3 py-2 text-left text-slate-500">Time</th>
                          <th className="px-3 py-2 text-left text-slate-500">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detail.login_history.slice(0, 10).map((log, i) => (
                          <tr key={i} className="border-t border-slate-50">
                            <td className="px-3 py-2 text-slate-400">{i + 1}</td>
                            <td className="px-3 py-2 text-slate-700">{log.login_time}</td>
                            <td className="px-3 py-2">
                              <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">{log.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : <p className="text-xs text-slate-400 italic">No login history yet</p>}
              </div>

              {/* Password History */}
              <div>
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">Password Change History</p>
                {detail.password_change_history?.length > 0 ? (
                  <div className="bg-white border border-slate-100 rounded-xl overflow-hidden">
                    <table className="w-full text-xs">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-slate-500">#</th>
                          <th className="px-3 py-2 text-left text-slate-500">Changed At</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detail.password_change_history.map((log, i) => (
                          <tr key={i} className="border-t border-slate-50">
                            <td className="px-3 py-2 text-slate-400">{i + 1}</td>
                            <td className="px-3 py-2 text-slate-700">{log.changed_at}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : <p className="text-xs text-slate-400 italic">No password changes yet</p>}
              </div>
            </div>
          </div>
        </td>
      </tr>
    );
  };

  // ── Stats ─────────────────────────────────────────────────────────────────
  const stats = useMemo(() => ({
    total:     users.length,
    active:    users.filter(u => getUserStatus(u) === "active").length,
    blocked:   users.filter(u => getUserStatus(u) === "blocked").length,
    admins:    users.filter(u => u.role === "admin").length,
  }), [users]);

  return (
    <div className="min-h-screen bg-slate-50 p-6">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-2xl shadow-2xl text-sm font-semibold flex items-center gap-2
          ${toast.type === "error" ? "bg-red-500 text-white" : "bg-emerald-500 text-white"}`}>
          {toast.type === "error" ? "✗" : "✓"} {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-black text-slate-800">User Management</h1>
        <p className="text-slate-500 mt-1">Manage all users — control access, assign roles, and monitor activity.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Users",    value: stats.total,   color: "bg-blue-500"    },
          { label: "Active",         value: stats.active,  color: "bg-emerald-500" },
          { label: "Blocked",        value: stats.blocked, color: "bg-red-500"     },
          { label: "Admins",         value: stats.admins,  color: "bg-violet-500"  },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center text-white font-black text-lg`}>
              {s.value}
            </div>
            <span className="text-sm font-semibold text-slate-600">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Filters bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-4 flex flex-wrap gap-3 items-center">

        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <svg className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"/>
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email or user ID..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Role filter */}
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 bg-white">
          <option value="all">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        {/* Status filter */}
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 bg-white">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="blocked">Blocked</option>
          <option value="suspended">Suspended</option>
        </select>

        {/* Sort */}
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 bg-white">
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="name">Name A-Z</option>
        </select>

        <span className="text-xs text-slate-400 ml-auto">{filtered.length} users found</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-800 text-white">
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide">User</th>
              <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wide">Email</th>
              <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wide">Role</th>
              <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wide">Status</th>
              <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wide">Joined</th>
              <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wide text-center">Actions</th>
              <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wide text-center">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-16 text-center text-slate-400">
                  <div className="text-4xl mb-2">🔍</div>
                  <div className="font-semibold">No users found</div>
                  <div className="text-sm mt-1">Try changing your search or filters</div>
                </td>
              </tr>
            ) : (
              paginated.map((user) => {
                const uid      = user._id || user.id;
                const status   = getUserStatus(user);
                const isExpanded = expandedUserId === uid;
                const isLoading  = loadingId === uid;

                return (
                  <>
                    <tr key={uid} className="hover:bg-slate-50 transition">
                      {/* Avatar + Name */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${getAvatarColor(user.email)}`}>
                            {getInitials(user.name, user.email)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{user.name || "—"}</p>
                            <p className="text-xs text-slate-400 font-mono">{(uid || "").slice(-8)}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-600">{(user.email||"").toLowerCase()}</td>
                      <td className="px-4 py-4"><RoleBadge role={user.role} /></td>
                      <td className="px-4 py-4"><StatusBadge status={status} /></td>
                      <td className="px-4 py-4 text-xs text-slate-400">
                        {user.registered_at ? user.registered_at.slice(0, 10) : "—"}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4">
                        <div className="flex gap-2 justify-center flex-wrap">
                          <button disabled={isLoading} onClick={() => handleRoleChange(user)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-violet-100 text-violet-700 hover:bg-violet-200 disabled:opacity-50 transition">
                            {user.role === "admin" ? "Make User" : "Make Admin"}
                          </button>
                          <button disabled={isLoading} onClick={() => handleStatusChange(user, status === "blocked" ? "active" : "blocked")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-50 transition
                              ${status === "blocked"
                                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                                : "bg-orange-100 text-orange-700 hover:bg-orange-200"}`}>
                            {status === "blocked" ? "Unblock" : "Block"}
                          </button>
                          <button disabled={isLoading} onClick={() => handleDelete(uid)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-100 text-red-600 hover:bg-red-200 disabled:opacity-50 transition">
                            Delete
                          </button>
                        </div>
                      </td>

                      {/* Details toggle */}
                      <td className="px-4 py-4 text-center">
                        <button onClick={() => handleExpandUser(user)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition
                            ${isExpanded
                              ? "bg-slate-800 text-white"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                          {isExpanded ? "▲ Hide" : "▼ View"}
                        </button>
                      </td>
                    </tr>

                    {isExpanded && <UserDetailPanel uid={uid} />}
                  </>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-sm text-slate-500">
              Page {page} of {totalPages} &nbsp;·&nbsp; {filtered.length} total users
            </span>
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
};

export default ManageUsers;
