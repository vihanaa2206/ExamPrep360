import { useEffect, useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell,
} from "recharts";
import {
  Users, TrendingUp, BookOpen, Award, Search,
  ChevronDown, ChevronUp, RefreshCw, Eye, RotateCcw, Target,
} from "lucide-react";

const BASE = "http://127.0.0.1:5000/api";
const COLORS = ["#6366f1","#10b981","#f59e0b","#ef4444","#8b5cf6","#06b6d4"];

const CAT_COLORS = {
  Engineering:        "bg-blue-100 text-blue-700",
  Medical:            "bg-green-100 text-green-700",
  Management:         "bg-purple-100 text-purple-700",
  "Computer Science": "bg-cyan-100 text-cyan-700",
  Law:                "bg-amber-100 text-amber-700",
  Government:         "bg-rose-100 text-rose-700",
};

function ScoreBadge({ score, total }) {
  const pct   = total ? Math.round((score / total) * 100) : 0;
  const color = pct >= 75 ? "bg-green-100 text-green-700"
              : pct >= 50 ? "bg-amber-100 text-amber-700"
              : "bg-red-100 text-red-700";
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${color}`}>
      {score}/{total} ({pct}%)
    </span>
  );
}

export default function AdminReports() {
  const [users, setUsers]             = useState([]);
  const [selUser, setSelUser]         = useState(null);
  const [reports, setReports]         = useState([]);
  const [loadingUsers, setLoadingUsers]   = useState(true);
  const [loadingReports, setLoadingReports] = useState(false);
  const [userSearch, setUserSearch]   = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [examFilter, setExamFilter]   = useState("all");
  const [expandedRow, setExpandedRow] = useState(null);
  const [activeTab, setActiveTab]     = useState("table");
  const [toast, setToast]             = useState(null);

  const token = localStorage.getItem("token");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Fetch all users ─────────────────────────────────────────────────
  useEffect(() => {
    setLoadingUsers(true);
    fetch(`${BASE}/users`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { setUsers(Array.isArray(data) ? data : []); setLoadingUsers(false); })
      .catch(() => setLoadingUsers(false));
  }, []);

  // ── Fetch reports for selected user ─────────────────────────────────
  const fetchReports = (userId) => {
    setLoadingReports(true);
    setReports([]);
    setExpandedRow(null);
    // ✅ FIXED URL — was /reports/user/... now correct
    fetch(`${BASE}/reports/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(data => {
        setReports(Array.isArray(data) ? data : []);
        setLoadingReports(false);
      })
      .catch(err => {
        showToast(`Failed to load reports: ${err.message}`, "error");
        setLoadingReports(false);
      });
  };

  const handleSelectUser = (user) => {
    setSelUser(user);
    setCategoryFilter("all");
    setExamFilter("all");
    setActiveTab("table");
    fetchReports(user._id || user.id);
  };

  // ── Filtered reports ────────────────────────────────────────────────
  const filteredReports = useMemo(() => {
    let list = [...reports];
    if (categoryFilter !== "all") list = list.filter(r => r.category === categoryFilter);
    if (examFilter     !== "all") list = list.filter(r => r.exam_name === examFilter);
    return list;
  }, [reports, categoryFilter, examFilter]);

  const examNames  = useMemo(() => [...new Set(reports.map(r => r.exam_name))], [reports]);
  const categories = useMemo(() => [...new Set(reports.map(r => r.category).filter(Boolean))], [reports]);

  // ── Stats ────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    if (!reports.length) return null;
    const total         = reports.length;
    const avgPct        = Math.round(reports.reduce((a, r) => {
      return a + (r.total_questions ? (r.score / r.total_questions) * 100 : 0);
    }, 0) / total);
    const examsAttempted = new Set(reports.map(r => r.exam_name)).size;
    const reattempts    = reports.filter(r => r.attempt_no > 1).length;
    const bestPct       = Math.max(...reports.map(r =>
      r.total_questions ? Math.round((r.score / r.total_questions) * 100) : 0
    ));
    return { total, avgPct, examsAttempted, reattempts, bestPct };
  }, [reports]);

  // ── Chart data ────────────────────────────────────────────────────────
  const timelineData = useMemo(() =>
    filteredReports
      .slice().sort((a,b) => new Date(a.attempted_at) - new Date(b.attempted_at))
      .map((r,i) => ({
        name: `#${i+1}`,
        pct:  r.total_questions ? Math.round((r.score/r.total_questions)*100) : 0,
        exam: r.exam_name,
      }))
  , [filteredReports]);

  const examAvgData = useMemo(() => {
    const map = {};
    reports.forEach(r => {
      if (!map[r.exam_name]) map[r.exam_name] = { total:0, count:0 };
      map[r.exam_name].total += r.total_questions ? (r.score/r.total_questions)*100 : 0;
      map[r.exam_name].count += 1;
    });
    return Object.entries(map).map(([name,v]) => ({
      name: name.length > 12 ? name.slice(0,12)+"…" : name,
      avg:  Math.round(v.total/v.count),
    }));
  }, [reports]);

  const categoryPieData = useMemo(() => {
    const map = {};
    reports.forEach(r => { const c = r.category||"Other"; map[c]=(map[c]||0)+1; });
    return Object.entries(map).map(([name,value]) => ({ name, value }));
  }, [reports]);

  const filteredUsers = useMemo(() => {
    if (!userSearch.trim()) return users;
    const q = userSearch.toLowerCase();
    return users.filter(u =>
      (u.name||"").toLowerCase().includes(q) ||
      (u.email||"").toLowerCase().includes(q)
    );
  }, [users, userSearch]);

  return (
    <div className="min-h-screen bg-slate-50 p-5">

      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-2xl shadow-2xl text-sm font-bold
          ${toast.type==="error" ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-indigo-500"/> View Reports
        </h1>
        <p className="text-slate-400 text-sm mt-0.5">Analyse user mock test performance, attempt history and scores</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-5">

        {/* LEFT: User list */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-400"/> Users
            </h3>
            <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-bold">{users.length}</span>
          </div>

          <div className="px-3 py-2.5 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400"/>
              <input value={userSearch} onChange={e=>setUserSearch(e.target.value)}
                placeholder="Search users..."
                className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-100"/>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[600px]">
            {loadingUsers ? (
              <div className="py-10 text-center"><RefreshCw className="w-5 h-5 animate-spin text-indigo-300 mx-auto"/></div>
            ) : filteredUsers.length === 0 ? (
              <p className="text-center text-slate-400 text-xs py-8">No users found</p>
            ) : filteredUsers.map(u => (
              <button key={u._id||u.id} onClick={() => handleSelectUser(u)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-slate-50 transition
                  ${selUser?._id===u._id||selUser?.id===u.id ? "bg-indigo-50" : "hover:bg-slate-50"}`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0
                  ${selUser?._id===u._id||selUser?.id===u.id ? "bg-indigo-500 text-white" : "bg-slate-200 text-slate-600"}`}>
                  {(u.name||u.email||"U")[0].toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{u.name||"Unnamed"}</p>
                  <p className="text-xs text-slate-400 truncate">{(u.email||"").toLowerCase()}</p>
                </div>
                {/* Show attempt count badge if any */}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: Reports */}
        <div className="lg:col-span-3 space-y-4">
          {!selUser ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center h-64">
              <Eye className="w-12 h-12 text-slate-200 mb-3"/>
              <p className="text-slate-500 font-semibold">Select a user to view their report</p>
              <p className="text-slate-400 text-sm mt-1">Click any user from the left panel</p>
            </div>
          ) : (
            <>
              {/* User banner */}
              <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-2xl p-4 text-white flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-xl font-black">
                    {(selUser.name||selUser.email||"U")[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-black text-lg">{selUser.name||"Unnamed"}</p>
                    <p className="text-indigo-200 text-sm">{(selUser.email||"").toLowerCase()}</p>
                  </div>
                </div>
                <button onClick={() => fetchReports(selUser._id||selUser.id)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-bold transition">
                  <RefreshCw className="w-4 h-4"/> Refresh
                </button>
              </div>

              {/* Stats */}
              {stats && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {[
                    { label:"Total Attempts",  value:stats.total,         icon:<BookOpen className="w-4 h-4"/>,  color:"text-indigo-600 bg-indigo-50"  },
                    { label:"Exams Attempted", value:stats.examsAttempted, icon:<Target className="w-4 h-4"/>,   color:"text-blue-600 bg-blue-50"      },
                    { label:"Avg Score %",     value:`${stats.avgPct}%`,   icon:<TrendingUp className="w-4 h-4"/>,color:"text-emerald-600 bg-emerald-50"},
                    { label:"Best Score %",    value:`${stats.bestPct}%`,  icon:<Award className="w-4 h-4"/>,    color:"text-amber-600 bg-amber-50"    },
                    { label:"Re-attempts",     value:stats.reattempts,     icon:<RotateCcw className="w-4 h-4"/>,color:"text-rose-600 bg-rose-50"      },
                  ].map(s => (
                    <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3 flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.color} flex-shrink-0`}>{s.icon}</div>
                      <div>
                        <div className="font-black text-slate-800 text-lg leading-tight">{s.value}</div>
                        <div className="text-[11px] text-slate-500">{s.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Filter bar + tabs */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-wrap gap-3 items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                  <select value={categoryFilter} onChange={e=>{setCategoryFilter(e.target.value);setExamFilter("all");}}
                    className="px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none bg-white">
                    <option value="all">All Categories</option>
                    {categories.map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                  <select value={examFilter} onChange={e=>setExamFilter(e.target.value)}
                    className="px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none bg-white">
                    <option value="all">All Exams</option>
                    {examNames.map(e=><option key={e} value={e}>{e}</option>)}
                  </select>
                  <span className="text-xs text-slate-400 self-center">{filteredReports.length} records</span>
                </div>
                <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
                  {["table","charts"].map(t=>(
                    <button key={t} onClick={()=>setActiveTab(t)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition
                        ${activeTab===t ? "bg-white shadow text-indigo-600" : "text-slate-500 hover:text-slate-700"}`}>
                      {t==="table" ? "📋 Table" : "📊 Charts"}
                    </button>
                  ))}
                </div>
              </div>

              {/* TABLE */}
              {activeTab==="table" && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  {loadingReports ? (
                    <div className="py-16 text-center">
                      <RefreshCw className="w-8 h-8 text-indigo-300 animate-spin mx-auto mb-2"/>
                      <p className="text-slate-400 text-sm">Loading reports...</p>
                    </div>
                  ) : filteredReports.length===0 ? (
                    <div className="py-16 text-center">
                      <BookOpen className="w-12 h-12 text-slate-200 mx-auto mb-3"/>
                      <p className="text-slate-500 font-semibold">No attempts found</p>
                      <p className="text-slate-400 text-sm mt-1">This user hasn't attempted any mock tests yet</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-slate-800 text-white">
                            {["#","Exam","Test No","Attempt","Score","Date","Details"].map(h=>(
                              <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredReports.map((r,i) => (
                            <>
                              <tr key={r._id||i} className="hover:bg-slate-50 transition cursor-pointer"
                                onClick={()=>setExpandedRow(expandedRow===i?null:i)}>
                                <td className="px-4 py-3.5 text-xs text-slate-400 font-mono">{i+1}</td>
                                <td className="px-4 py-3.5">
                                  <div className="font-bold text-slate-800 text-sm">{r.exam_name}</div>
                                  {r.category && (
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${CAT_COLORS[r.category]||"bg-slate-100 text-slate-600"}`}>
                                      {r.category}
                                    </span>
                                  )}
                                </td>
                                <td className="px-4 py-3.5 text-sm text-slate-600">Test {r.test_no}</td>
                                <td className="px-4 py-3.5">
                                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold
                                    ${r.attempt_no>1 ? "bg-purple-100 text-purple-700" : "bg-slate-100 text-slate-600"}`}>
                                    {r.attempt_no>1 ? `Re-attempt #${r.attempt_no}` : "1st attempt"}
                                  </span>
                                </td>
                                <td className="px-4 py-3.5">
                                  <ScoreBadge score={r.score||0} total={r.total_questions||0}/>
                                </td>
                                <td className="px-4 py-3.5 text-xs text-slate-400">
                                  {r.attempted_at ? new Date(r.attempted_at).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}) : "—"}
                                </td>
                                <td className="px-4 py-3.5 text-center">
                                  <button className="p-1.5 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition">
                                    {expandedRow===i ? <ChevronUp className="w-4 h-4"/> : <ChevronDown className="w-4 h-4"/>}
                                  </button>
                                </td>
                              </tr>

                              {expandedRow===i && (
                                <tr key={`exp-${i}`}>
                                  <td colSpan={7} className="px-4 py-4 bg-indigo-50/50 border-b border-indigo-100">
                                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-3">Question-wise Breakdown</p>
                                    {r.answers?.length > 0 ? (
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                                        {r.answers.map((ans,qi) => (
                                          <div key={qi} className={`p-3 rounded-xl border text-xs
                                            ${ans.is_correct ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                                            <div className="flex items-start justify-between gap-2">
                                              <p className="font-medium text-slate-800 line-clamp-2">
                                                Q{qi+1}. {ans.question_text||`Question ${qi+1}`}
                                              </p>
                                              <span className={`flex-shrink-0 px-2 py-0.5 rounded-full font-bold text-[10px]
                                                ${ans.is_correct ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>
                                                {ans.is_correct ? "✓ Correct" : "✗ Wrong"}
                                              </span>
                                            </div>
                                            <div className="mt-1.5 space-y-0.5">
                                              <p className="text-slate-600">
                                                <span className="font-semibold">Your answer:</span>{" "}
                                                <span className={ans.is_correct ? "text-green-700" : "text-red-600"}>
                                                  {ans.selected_option||"Not answered"}
                                                </span>
                                              </p>
                                              {!ans.is_correct && (
                                                <p className="text-slate-600">
                                                  <span className="font-semibold">Correct:</span>{" "}
                                                  <span className="text-green-700">{ans.correct_option}</span>
                                                </p>
                                              )}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <p className="text-slate-400 text-xs">No question-level data for this attempt.</p>
                                    )}
                                  </td>
                                </tr>
                              )}
                            </>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* CHARTS */}
              {activeTab==="charts" && (
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-indigo-500"/> Score Trend
                    </h4>
                    <ResponsiveContainer width="100%" height={220}>
                      <LineChart data={timelineData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                        <XAxis dataKey="name" tick={{fontSize:11}}/>
                        <YAxis domain={[0,100]} tickFormatter={v=>`${v}%`} tick={{fontSize:11}}/>
                        <Tooltip formatter={v=>[`${v}%`,"Score %"]}/>
                        <Line type="monotone" dataKey="pct" stroke="#6366f1" strokeWidth={2.5} dot={{r:4}} activeDot={{r:6}}/>
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                      <h4 className="font-bold text-slate-800 mb-4">Avg Score per Exam</h4>
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={examAvgData} barSize={28}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                          <XAxis dataKey="name" tick={{fontSize:10}}/>
                          <YAxis domain={[0,100]} tickFormatter={v=>`${v}%`} tick={{fontSize:10}}/>
                          <Tooltip formatter={v=>[`${v}%`,"Avg"]}/>
                          <Bar dataKey="avg" fill="#6366f1" radius={[6,6,0,0]}/>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                      <h4 className="font-bold text-slate-800 mb-4">Attempts by Category</h4>
                      {categoryPieData.length===0 ? (
                        <p className="text-center text-slate-400 text-sm py-8">No data</p>
                      ) : (
                        <ResponsiveContainer width="100%" height={200}>
                          <PieChart>
                            <Pie data={categoryPieData} cx="50%" cy="50%"
                              innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                              {categoryPieData.map((_,i)=>(
                                <Cell key={i} fill={COLORS[i%COLORS.length]}/>
                              ))}
                            </Pie>
                            <Tooltip/>
                          </PieChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}