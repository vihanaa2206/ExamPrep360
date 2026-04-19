// src/admin/pages/AdminPayments.jsx
import { useState, useEffect, useMemo } from "react";
import {
  IndianRupee, TrendingUp, Users, Clock,
  CheckCircle2, XCircle, Search, Filter,
  Download, RefreshCw, ChevronDown, Eye,
  CreditCard, Calendar, Tag, Wallet,
  BarChart3, Sparkles,
  AlertCircle, Trash2,
} from "lucide-react";

const API = "https://examprep360-production.up.railway.app/api";

const PLAN_META = {
  basic:    { label: "Basic",    color: "bg-blue-100 text-blue-700 border-blue-200",       dot: "bg-blue-500"   },
  standard: { label: "Standard", color: "bg-purple-100 text-purple-700 border-purple-200", dot: "bg-purple-500" },
  premium:  { label: "Premium",  color: "bg-amber-100 text-amber-700 border-amber-200",    dot: "bg-amber-500"  },
};

const STATUS_META = {
  paid:    { label: "Paid",    color: "bg-emerald-100 text-emerald-700 border-emerald-200", dot: "bg-emerald-500", icon: CheckCircle2 },
  pending: { label: "Pending", color: "bg-orange-100 text-orange-700 border-orange-200",   dot: "bg-orange-500",  icon: Clock        },
  failed:  { label: "Failed",  color: "bg-red-100 text-red-700 border-red-200",            dot: "bg-red-500",     icon: XCircle      },
};

function fmtIST(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
}

function fmtISTDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit", month: "short", year: "numeric",
  });
}

function daysLeft(expiresAt) {
  if (!expiresAt) return null;
  return Math.ceil((new Date(expiresAt) - new Date()) / (1000 * 60 * 60 * 24));
}

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-0.5">{label}</p>
        <p className="text-2xl font-black text-gray-900">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function PlanBar({ breakdown, total }) {
  const plans = [
    { key: "basic",    label: "Basic",    color: "bg-blue-500"   },
    { key: "standard", label: "Standard", color: "bg-purple-500" },
    { key: "premium",  label: "Premium",  color: "bg-amber-500"  },
  ];
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-4 h-4 text-gray-400" />
        <p className="text-sm font-black text-gray-900">Plan Distribution</p>
      </div>
      <div className="flex h-3 rounded-full overflow-hidden gap-0.5 mb-3">
        {plans.map(p => {
          const count = breakdown[p.key] || 0;
          const pct   = total ? (count / total) * 100 : 0;
          return pct > 0 ? (
            <div key={p.key} className={`${p.color} transition-all`} style={{ width: `${pct}%` }} title={`${p.label}: ${count}`} />
          ) : null;
        })}
        {total === 0 && <div className="bg-gray-100 w-full rounded-full" />}
      </div>
      <div className="flex gap-4">
        {plans.map(p => (
          <div key={p.key} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full ${p.color}`} />
            <span className="text-xs text-gray-500">{p.label}: <span className="font-bold text-gray-700">{breakdown[p.key] || 0}</span></span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DetailModal({ payment, onClose }) {
  if (!payment) return null;
  const plan      = PLAN_META[payment.plan]     || { label: payment.plan,   color: "bg-gray-100 text-gray-700 border-gray-200" };
  const status    = STATUS_META[payment.status] || { label: payment.status, color: "bg-gray-100 text-gray-700 border-gray-200" };
  const StatusIcon = status.icon || CheckCircle2;
  const dl = daysLeft(payment.expires_at);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <span className={`text-xs font-black px-3 py-1 rounded-full border ${status.color}`}>
              <StatusIcon className="w-3 h-3 inline mr-1" />{status.label}
            </span>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition">
              <XCircle className="w-5 h-5" />
            </button>
          </div>
          <h2 className="text-lg font-black">{payment.user_name || "Unknown User"}</h2>
          <p className="text-slate-400 text-sm">{payment.user_email || payment.user_id}</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Tag,         label: "Plan",          val: <span className={`text-xs font-black px-2 py-0.5 rounded-full border ${plan.color}`}>{plan.label}</span> },
              { icon: IndianRupee, label: "Amount",        val: <span className="font-black text-gray-900">₹{payment.amount ? payment.amount / 100 : "—"}</span> },
              { icon: CreditCard,  label: "Payment ID",    val: <span className="text-xs font-mono text-gray-600 break-all">{payment.payment_id || "—"}</span> },
              { icon: Wallet,      label: "Order ID",      val: <span className="text-xs font-mono text-gray-600 break-all">{payment.order_id || "—"}</span> },
              { icon: Calendar,    label: "Paid At (IST)", val: fmtIST(payment.paid_at || payment.created_at) },
              { icon: Clock,       label: "Expires",       val: payment.expires_at ? (
                  <span className={dl !== null && dl < 0 ? "text-red-600 font-bold" : dl !== null && dl <= 7 ? "text-orange-600 font-bold" : "text-gray-700"}>
                    {fmtISTDate(payment.expires_at)}{dl !== null && ` (${dl > 0 ? `${dl}d left` : "Expired"})`}
                  </span>
                ) : "—" },
            ].map(({ icon: Icon, label, val }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className="w-3.5 h-3.5 text-gray-400" />
                  <p className="text-xs text-gray-400 font-semibold">{label}</p>
                </div>
                <div className="text-sm">{val}</div>
              </div>
            ))}
          </div>
          {payment.categories?.length > 0 && (
            <div className="bg-indigo-50 rounded-xl p-3">
              <p className="text-xs text-indigo-500 font-black uppercase tracking-wide mb-2">Categories Purchased</p>
              <div className="flex flex-wrap gap-1.5">
                {payment.categories.map(c => (
                  <span key={c} className="text-xs bg-indigo-100 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full font-bold">{c}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DeleteModal({ payment, onConfirm, onClose, loading }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6">
        <div className="text-center mb-5">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Trash2 className="w-6 h-6 text-red-500" />
          </div>
          <h3 className="text-lg font-black text-gray-900">Delete Record?</h3>
          <p className="text-sm text-gray-500 mt-1">Permanently delete payment record for</p>
          <p className="text-sm font-bold text-gray-800 mt-1">{payment?.user_name || payment?.user_email || "this user"}</p>
          <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-xs text-amber-700 font-semibold">
            ⚠️ Only the record is deleted. User's access is NOT revoked.
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-3 border-2 border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading}
            className="flex-1 py-3 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 disabled:opacity-60 transition flex items-center justify-center gap-2">
            {loading
              ? <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />Deleting...</>
              : <><Trash2 className="w-3.5 h-3.5" />Delete</>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminPayments() {
  const [payments,      setPayments]      = useState([]);
  const [stats,         setStats]         = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [search,        setSearch]        = useState("");
  const [planFilter,    setPlanFilter]    = useState("all");
  const [statusFilter,  setStatusFilter]  = useState("all");
  const [detail,        setDetail]        = useState(null);
  const [deleteTarget,  setDeleteTarget]  = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast,         setToast]         = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadAll = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const [pRes, sRes] = await Promise.all([
        fetch(`${API}/payment/all`, { headers }),
        fetch(`${API}/payment/stats`, { headers }),
      ]);
      const pData = await pRes.json();
      const sData = await sRes.json();
      setPayments(Array.isArray(pData) ? pData : []);
      setStats(sData);
    } catch {
      showToast("Failed to load payment data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`${API}/payment/delete/${deleteTarget.order_id}`, { method: "DELETE", headers });
      if (res.ok) {
        setPayments(prev => prev.filter(p => p.order_id !== deleteTarget.order_id));
        showToast("Record deleted successfully");
        setDeleteTarget(null);
        fetch(`${API}/payment/stats`).then(r => r.json()).then(setStats).catch(() => {});
      } else {
        const d = await res.json().catch(() => ({}));
        showToast(d.error || "Delete failed", "error");
      }
    } catch {
      showToast("Network error", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return payments.filter(p => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        (p.user_name  || "").toLowerCase().includes(q) ||
        (p.user_email || "").toLowerCase().includes(q) ||
        (p.payment_id || "").toLowerCase().includes(q) ||
        (p.order_id   || "").toLowerCase().includes(q) ||
        (p.user_id    || "").toLowerCase().includes(q);
      const matchPlan   = planFilter   === "all" || p.plan   === planFilter;
      const matchStatus = statusFilter === "all" || p.status === statusFilter;
      return matchSearch && matchPlan && matchStatus;
    });
  }, [payments, search, planFilter, statusFilter]);

  const handleExport = () => {
    const rows = [
      ["Name","Email","Plan","Amount (₹)","Status","Transaction ID","Order ID","Paid At (IST)","Expires At","Categories"],
      ...filtered.map(p => [
        p.user_name || "", p.user_email || "", p.plan || "",
        p.amount ? p.amount / 100 : "", p.status || "",
        p.payment_id || "", p.order_id || "",
        fmtIST(p.paid_at || p.created_at),
        p.expires_at ? fmtISTDate(p.expires_at) : "",
        (p.categories || []).join("; "),
      ]),
    ];
    const csv  = rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type:"text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = `payments_${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
    showToast("CSV exported! ✅");
  };

  const totalRevenue = stats?.total_revenue      || 0;
  const totalTxn     = stats?.total_transactions || 0;
  const pendingCount = stats?.pending_count      || 0;
  const breakdown    = stats?.plan_breakdown     || {};

  return (
    <div className="space-y-6 p-6">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-2xl shadow-2xl text-sm font-bold flex items-center gap-2
          ${toast.type === "error" ? "bg-red-500 text-white" : "bg-emerald-500 text-white"}`}>
          {toast.type === "error" ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {detail       && <DetailModal payment={detail} onClose={() => setDetail(null)} />}
      {deleteTarget && <DeleteModal payment={deleteTarget} onConfirm={handleDelete} onClose={() => setDeleteTarget(null)} loading={deleteLoading} />}

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <IndianRupee className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-black text-gray-900">Payment Records</h1>
            <span className="bg-indigo-100 text-indigo-700 text-xs font-black px-2 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Live
            </span>
          </div>
          <p className="text-sm text-gray-400 ml-10">All transactions · Times shown in IST (Indian Standard Time)</p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadAll}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 bg-white rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition shadow-sm">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
          <button onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-bold hover:opacity-90 transition shadow-lg shadow-indigo-200">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={IndianRupee} label="Total Revenue"  value={`₹${totalRevenue.toLocaleString("en-IN")}`} sub="All successful transactions"  color="bg-gradient-to-br from-emerald-400 to-teal-500"  />
        <StatCard icon={TrendingUp}  label="Total Payments" value={totalTxn}       sub="Successful transactions"   color="bg-gradient-to-br from-indigo-400 to-blue-500"    />
        <StatCard icon={Clock}       label="Pending Orders" value={pendingCount}   sub="Awaiting payment"          color="bg-gradient-to-br from-orange-400 to-amber-500"   />
        <StatCard icon={Users}       label="Active Plans"   value={totalTxn}       sub="Users with access"         color="bg-gradient-to-br from-purple-400 to-pink-500"    />
      </div>

      <PlanBar breakdown={breakdown} total={totalTxn} />

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, email, transaction ID…"
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300" />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
            <select value={planFilter} onChange={e => setPlanFilter(e.target.value)}
              className="pl-8 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm outline-none bg-white appearance-none focus:ring-2 focus:ring-indigo-100 cursor-pointer">
              <option value="all">All Plans</option>
              <option value="basic">Basic</option>
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-2.5 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="pl-4 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm outline-none bg-white appearance-none focus:ring-2 focus:ring-indigo-100 cursor-pointer">
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-2.5 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>
          <span className="text-xs text-gray-400 font-semibold ml-auto">{filtered.length} of {payments.length} records</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-sm text-gray-400 font-semibold">Loading payment records…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <CreditCard className="w-14 h-14 text-gray-200" />
            <p className="font-bold text-gray-400">No payment records found</p>
            <p className="text-sm text-gray-300">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            {/* Header row */}
            <div className="grid grid-cols-[2fr_1.3fr_0.8fr_0.8fr_1.6fr_1.3fr_0.9fr_80px] gap-3 px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-black text-gray-400 uppercase tracking-wide">
              <span>User</span>
              <span>Transaction ID</span>
              <span>Plan</span>
              <span>Amount</span>
              <span>Paid At (IST)</span>
              <span>Expires</span>
              <span>Status</span>
              <span>Actions</span>
            </div>

            <div className="divide-y divide-gray-50 max-h-[520px] overflow-y-auto">
              {filtered.map((p, i) => {
                const plan       = PLAN_META[p.plan]     || { label: p.plan,   color: "bg-gray-100 text-gray-600 border-gray-200", dot: "bg-gray-400" };
                const status     = STATUS_META[p.status] || { label: p.status, color: "bg-gray-100 text-gray-600 border-gray-200", dot: "bg-gray-400", icon: AlertCircle };
                const StatusIcon = status.icon;
                const dl         = daysLeft(p.expires_at);

                return (
                  <div key={i}
                    className="grid grid-cols-[2fr_1.3fr_0.8fr_0.8fr_1.6fr_1.3fr_0.9fr_80px] gap-3 px-5 py-3.5 items-center hover:bg-indigo-50/30 transition-colors group">

                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{p.user_name || <span className="text-gray-400 italic">Unknown</span>}</p>
                      <p className="text-xs text-gray-400 truncate">{p.user_email || p.user_id}</p>
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-mono text-gray-600 truncate">{p.payment_id || <span className="text-gray-300">—</span>}</p>
                      <p className="text-xs font-mono text-gray-300 truncate">{p.order_id}</p>
                    </div>

                    <div>
                      <span className={`inline-flex items-center gap-1 text-xs font-black px-2.5 py-1 rounded-full border ${plan.color}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${plan.dot}`} />{plan.label}
                      </span>
                    </div>

                    <div>
                      <p className="text-sm font-black text-gray-900">{p.amount ? `₹${p.amount / 100}` : "—"}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-700 font-medium">{fmtIST(p.paid_at || p.created_at)}</p>
                    </div>

                    <div>
                      {p.expires_at ? (
                        <>
                          <p className="text-xs text-gray-600">{fmtISTDate(p.expires_at)}</p>
                          <p className={`text-xs font-bold ${dl === null ? "text-gray-300" : dl < 0 ? "text-red-500" : dl <= 7 ? "text-orange-500" : "text-emerald-600"}`}>
                            {dl !== null && (dl < 0 ? "Expired" : `${dl}d left`)}
                          </p>
                        </>
                      ) : <span className="text-gray-300 text-xs">—</span>}
                    </div>

                    <div>
                      <span className={`inline-flex items-center gap-1 text-xs font-black px-2.5 py-1 rounded-full border ${status.color}`}>
                        <StatusIcon className="w-3 h-3" />{status.label}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button onClick={() => setDetail(p)}
                        title="View details"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteTarget(p)}
                        title="Delete record"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Footer summary */}
      {!loading && filtered.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-5 text-white flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-indigo-200 text-sm font-semibold">Filtered Revenue</p>
            <p className="text-3xl font-black">
              ₹{filtered.filter(p => p.status === "paid").reduce((s, p) => s + (p.amount || 0), 0) / 100}
            </p>
          </div>
          <div className="flex gap-6 text-center">
            {["paid","pending","failed"].map(s => (
              <div key={s}>
                <p className="text-2xl font-black">{filtered.filter(p => p.status === s).length}</p>
                <p className="text-indigo-200 text-xs capitalize font-semibold">{s}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}