import { useEffect, useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell,
} from "recharts";
import {
  Users, TrendingUp, BookOpen, Award, Search,
  RefreshCw, Eye, RotateCcw, Target, X,
} from "lucide-react";

const BASE = "https://examprep360.onrender.com/api";
const COLORS = ["#6366f1","#10b981","#f59e0b","#ef4444","#8b5cf6","#06b6d4"];

const CAT_COLORS = {
  Engineering:        "bg-blue-600 text-white",
  Medical:            "bg-emerald-600 text-white",
  Management:         "bg-purple-600 text-white",
  "Computer Science": "bg-cyan-600 text-white",
  Law:                "bg-amber-600 text-white",
  Government:         "bg-rose-600 text-white",
};

function ScoreBadge({ score, totalMarks, totalQuestions }) {
  const denominator = totalMarks || totalQuestions || 1;
  const pct = Math.round((score / denominator) * 100);
  const color = pct >= 75 ? "bg-green-500 text-white"
              : pct >= 50 ? "bg-amber-500 text-white"
              : "bg-red-500 text-white";
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${color}`}>
      {score}/{denominator} ({pct}%)
    </span>
  );
}

/* ─── Report Detail Popup (radial card) ─────────────────── */
function ReportDetailPopup({ report, onClose }) {
  if (!report) return null;
  const answers = report.answers || [];
  const correct  = answers.filter(a => a.is_correct).length;
  const wrong    = answers.filter(a => !a.is_correct && a.selected_option).length;
  const skipped  = answers.filter(a => !a.selected_option).length;
  const denom    = report.total_marks || report.total_questions || 1;
  const pct      = Math.min(100, Math.round((report.score / denom) * 100));
  const color    = pct >= 75 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#ef4444";
  const r = 45, circ = 2 * Math.PI * r, offset = circ - (pct / 100) * circ;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        style={{ animation: "zoomIn .25s ease" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h3 className="font-black text-lg">{report.exam_name}</h3>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              {report.category && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${CAT_COLORS[report.category] || "bg-white/20 text-white"}`}>{report.category}</span>
              )}
              <span className="text-indigo-200 text-xs">Test {report.test_no} · {report.attempt_no > 1 ? `Re-attempt #${report.attempt_no}` : "1st attempt"}</span>
              {report.attempted_at && (
                <span className="text-indigo-200 text-xs">· {new Date(report.attempted_at).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}</span>
              )}
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition"><X className="w-5 h-5"/></button>
        </div>

        {/* Radial summary */}
        <div className="flex items-center gap-6 px-6 py-4 border-b border-gray-100 flex-shrink-0 flex-wrap">
          <svg width="100" height="100" viewBox="0 0 120 120" className="flex-shrink-0">
            <circle cx="60" cy="60" r={r} fill="none" stroke="#f3f4f6" strokeWidth="10"/>
            <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="10"
              strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
              style={{transform:"rotate(-90deg)",transformOrigin:"60px 60px",transition:"stroke-dashoffset .8s ease"}}/>
            <text x="60" y="54" textAnchor="middle" fontSize="18" fontWeight="900" fill={color}>{pct}%</text>
            <text x="60" y="70" textAnchor="middle" fontSize="9" fill="#9ca3af">Score</text>
          </svg>
          <div className="grid grid-cols-3 gap-4 flex-1 min-w-0">
            <div className="text-center">
              <p className="text-2xl font-black text-green-600">{correct}</p>
              <p className="text-xs text-gray-400">Correct</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-red-500">{wrong}</p>
              <p className="text-xs text-gray-400">Wrong</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-gray-400">{skipped}</p>
              <p className="text-xs text-gray-400">Skipped</p>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-xl font-black text-gray-800">{report.score}/{denom}</p>
            <p className="text-xs text-gray-400">pts</p>
          </div>
        </div>

        {/* Q&A */}
        <div className="overflow-y-auto flex-1 px-6 py-4">
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-3">Question-wise Breakdown</p>
          {answers.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No question-level data for this attempt.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-3">
              {answers.map((a, qi) => (
                <div key={qi} className={`rounded-2xl border p-3 text-xs ${a.is_correct ? "bg-green-50 border-green-200" : a.selected_option ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-200"}`}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="font-semibold text-slate-800 line-clamp-2">Q{qi+1}. {a.question_text || `Question ${qi+1}`}</p>
                    <span className={`flex-shrink-0 px-2 py-0.5 rounded-full font-bold text-[10px] ${a.is_correct ? "bg-green-500 text-white" : a.selected_option ? "bg-red-500 text-white" : "bg-gray-400 text-white"}`}>
                      {a.is_correct ? "✓ Correct" : a.selected_option ? "✗ Wrong" : "— Skip"}
                    </span>
                  </div>
                  <p className="text-slate-700">
                    <span className="font-semibold">Your: </span>
                    <span className={a.is_correct ? "text-green-700 font-bold" : "text-red-600 font-bold"}>{a.selected_option || "Not answered"}</span>
                  </p>
                  {!a.is_correct && a.correct_option && (
                    <p className="text-slate-700 mt-0.5">
                      <span className="font-semibold">Correct: </span>
                      <span className="text-green-700 font-bold">{a.correct_option}</span>
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminReports() {
  const [users, setUsers]           = useState([]);
  const [selUser, setSelUser]       = useState(null);
  const [reports, setReports]       = useState([]);
  const [loadingUsers, setLoadingUsers]     = useState(true);
  const [loadingReports, setLoadingReports] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [examFilter, setExamFilter] = useState("all");
  const [selectedReport, setSelectedReport] = useState(null);
  const [activeTab, setActiveTab]   = useState("table");
  const [toast, setToast]           = useState(null);

  const token = localStorage.getItem("token");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    setLoadingUsers(true);
    fetch(`${BASE}/users`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { setUsers(Array.isArray(data) ? data : []); setLoadingUsers(false); })
      .catch(() => setLoadingUsers(false));
  }, []);

  const fetchReports = (userId) => {
    setLoadingReports(true);
    setReports([]);
    setSelectedReport(null);
    fetch(`${BASE}/reports/user/${userId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(data => { setReports(Array.isArray(data) ? data : []); setLoadingReports(false); })
      .catch(err => { showToast(`Failed to load reports: ${err.message}`, "error"); setLoadingReports(false); });
  };

  const handleSelectUser = (user) => {
    setSelUser(user);
    setCategoryFilter("all");
    setExamFilter("all");
    setActiveTab("table");
    fetchReports(user._id || user.id);
  };

  const filteredReports = useMemo(() => {
    let list = [...reports];
    if (categoryFilter !== "all") list = list.filter(r => r.category === categoryFilter);
    if (examFilter     !== "all") list = list.filter(r => r.exam_name === examFilter);
    return list;
  }, [reports, categoryFilter, examFilter]);

  const examNames  = useMemo(() => [...new Set(reports.map(r => r.exam_name))], [reports]);
  const categories = useMemo(() => [...new Set(reports.map(r => r.category).filter(Boolean))], [reports]);

  const stats = useMemo(() => {
    if (!reports.length) return null;
    const total = reports.length;
    const avgPct = Math.round(reports.reduce((a,r) => { const d=r.total_marks||r.total_questions||1; return a+(r.score/d)*100; }, 0) / total);
    const examsAttempted = new Set(reports.map(r => r.exam_name)).size;
    const reattempts = reports.filter(r => r.attempt_no > 1).length;
    const bestPct = Math.max(...reports.map(r => { const d=r.total_marks||r.total_questions||1; return Math.round((r.score/d)*100); }));
    return { total, avgPct, examsAttempted, reattempts, bestPct };
  }, [reports]);

  const timelineData = useMemo(() =>
    filteredReports.slice().sort((a,b)=>new Date(a.attempted_at)-new Date(b.attempted_at))
      .map((r,i) => { const d=r.total_marks||r.total_questions||1; return {name:`#${i+1}`,pct:Math.min(100,Math.round((r.score/d)*100)),exam:r.exam_name}; })
  , [filteredReports]);

  const examAvgData = useMemo(() => {
    const map = {};
    reports.forEach(r => { const d=r.total_marks||r.total_questions||1; if (!map[r.exam_name]) map[r.exam_name]={total:0,count:0}; map[r.exam_name].total+=(r.score/d)*100; map[r.exam_name].count+=1; });
    return Object.entries(map).map(([name,v]) => ({name:name.length>12?name.slice(0,12)+"…":name,avg:Math.min(100,Math.round(v.total/v.count))}));
  }, [reports]);

  const categoryPieData = useMemo(() => {
    const map = {};
    reports.forEach(r => { const c=r.category||"Other"; map[c]=(map[c]||0)+1; });
    return Object.entries(map).map(([name,value]) => ({name,value}));
  }, [reports]);

  const filteredUsers = useMemo(() => {
    if (!userSearch.trim()) return users;
    const q = userSearch.toLowerCase();
    return users.filter(u => (u.name||"").toLowerCase().includes(q) || (u.email||"").toLowerCase().includes(q));
  }, [users, userSearch]);

  return (
    <div className="min-h-screen bg-slate-50 p-5">
      <style>{`@keyframes zoomIn{from{transform:scale(.85);opacity:0}to{transform:scale(1);opacity:1}}`}</style>

      {/* Popup */}
      {selectedReport && <ReportDetailPopup report={selectedReport} onClose={() => setSelectedReport(null)}/>}

      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-2xl shadow-2xl text-sm font-bold ${toast.type==="error"?"bg-red-500 text-white":"bg-green-500 text-white"}`}>
          {toast.msg}
        </div>
      )}

      <div className="mb-5">
        <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-indigo-500"/> View Reports
        </h1>
        <p className="text-slate-400 text-sm mt-0.5">Analyse user mock test performance, attempt history and scores</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-5">

        {/* Left: User list */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5"><Users className="w-4 h-4 text-indigo-400"/> Users</h3>
            <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-bold">{users.length}</span>
          </div>
          <div className="px-3 py-2.5 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400"/>
              <input value={userSearch} onChange={e=>setUserSearch(e.target.value)} placeholder="Search users..."
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
                className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-slate-50 transition ${selUser?._id===u._id||selUser?.id===u.id?"bg-indigo-50":"hover:bg-slate-50"}`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0 ${selUser?._id===u._id||selUser?.id===u.id?"bg-indigo-500 text-white":"bg-slate-200 text-slate-600"}`}>
                  {(u.name||u.email||"U")[0].toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{u.name||"Unnamed"}</p>
                  <p className="text-xs text-slate-400 truncate">{(u.email||"").toLowerCase()}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Reports */}
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
                    {label:"Total Attempts", value:stats.total,          icon:<BookOpen className="w-4 h-4"/>,   color:"text-indigo-600 bg-indigo-50"},
                    {label:"Exams Attempted",value:stats.examsAttempted, icon:<Target className="w-4 h-4"/>,     color:"text-blue-600 bg-blue-50"},
                    {label:"Avg Score %",    value:`${stats.avgPct}%`,   icon:<TrendingUp className="w-4 h-4"/>, color:"text-emerald-600 bg-emerald-50"},
                    {label:"Best Score %",   value:`${stats.bestPct}%`,  icon:<Award className="w-4 h-4"/>,      color:"text-amber-600 bg-amber-50"},
                    {label:"Re-attempts",    value:stats.reattempts,     icon:<RotateCcw className="w-4 h-4"/>,  color:"text-rose-600 bg-rose-50"},
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

              {/* Filter + tabs */}
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
                  {["table","charts"].map(t => (
                    <button key={t} onClick={()=>setActiveTab(t)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition ${activeTab===t?"bg-white shadow text-indigo-600":"text-slate-500 hover:text-slate-700"}`}>
                      {t==="table"?"📋 Table":"📊 Charts"}
                    </button>
                  ))}
                </div>
              </div>

              {/* TABLE — now card-based, click → popup */}
              {activeTab === "table" && (
                <div className="space-y-3">
                  {loadingReports ? (
                    <div className="bg-white rounded-2xl border border-slate-200 py-16 text-center">
                      <RefreshCw className="w-8 h-8 text-indigo-300 animate-spin mx-auto mb-2"/>
                      <p className="text-slate-400 text-sm">Loading reports...</p>
                    </div>
                  ) : filteredReports.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-200 py-16 text-center">
                      <BookOpen className="w-12 h-12 text-slate-200 mx-auto mb-3"/>
                      <p className="text-slate-500 font-semibold">No attempts found</p>
                      <p className="text-slate-400 text-sm mt-1">This user hasn't attempted any mock tests yet</p>
                    </div>
                  ) : (
                    <>
                      <p className="text-xs text-slate-400 font-medium">Click any card to see full question-wise breakdown</p>
                      {filteredReports.map((r, i) => {
                        const denom = r.total_marks || r.total_questions || 1;
                        const pct = Math.min(100, Math.round((r.score / denom) * 100));
                        const ringColor = pct >= 75 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#ef4444";
                        const circR = 35, circ = 2 * Math.PI * circR, offset = circ - (pct/100)*circ;
                        const answers = r.answers || [];
                        const correct  = answers.filter(a=>a.is_correct).length;
                        const wrong    = answers.filter(a=>!a.is_correct&&a.selected_option).length;
                        const skipped  = answers.filter(a=>!a.selected_option).length;

                        return (
                          <div key={r._id||i}
                            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-lg cursor-pointer hover:scale-[1.01] transition"
                            style={{transition:"all .2s ease"}}
                            onClick={() => setSelectedReport(r)}
                          >
                            <div className="flex items-center gap-4">
                              {/* Radial ring */}
                              <svg width="80" height="80" viewBox="0 0 80 80" className="flex-shrink-0">
                                <circle cx="40" cy="40" r={circR} fill="none" stroke="#f1f5f9" strokeWidth="7"/>
                                <circle cx="40" cy="40" r={circR} fill="none" stroke={ringColor} strokeWidth="7"
                                  strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
                                  style={{transform:"rotate(-90deg)",transformOrigin:"40px 40px"}}/>
                                <text x="40" y="37" textAnchor="middle" fontSize="13" fontWeight="900" fill={ringColor}>{pct}%</text>
                                <text x="40" y="50" textAnchor="middle" fontSize="8" fill="#9ca3af">score</text>
                              </svg>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                  <h3 className="font-black text-slate-800">{r.exam_name}</h3>
                                  {r.category && (
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${CAT_COLORS[r.category]||"bg-slate-600 text-white"}`}>{r.category}</span>
                                  )}
                                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${r.attempt_no>1?"bg-purple-100 text-purple-700":"bg-slate-100 text-slate-600"}`}>
                                    {r.attempt_no>1?`Re-attempt #${r.attempt_no}`:"1st attempt"}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-400 mb-2">
                                  Test {r.test_no} · {r.attempted_at ? new Date(r.attempted_at).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}) : "—"}
                                </p>
                                {answers.length > 0 ? (
                                  <div className="flex items-center gap-4 text-sm">
                                    <span className="text-green-600 font-bold">✓ {correct} correct</span>
                                    <span className="text-red-500 font-bold">✗ {wrong} wrong</span>
                                    <span className="text-gray-400 font-bold">— {skipped} skip</span>
                                  </div>
                                ) : (
                                  <p className="text-xs text-slate-400">No question breakdown data</p>
                                )}
                              </div>

                              <div className="text-right flex-shrink-0">
                                <ScoreBadge score={r.score||0} totalMarks={r.total_marks} totalQuestions={r.total_questions}/>
                                <p className="text-xs text-slate-400 mt-1">Click for details</p>
                              </div>
                            </div>

                            {/* Mini breakdown bar */}
                            {answers.length > 0 && (
                              <div className="mt-3 h-2 rounded-full overflow-hidden flex">
                                <div className="bg-green-400 h-full" style={{width:`${(correct/answers.length)*100}%`}}/>
                                <div className="bg-red-400 h-full" style={{width:`${(wrong/answers.length)*100}%`}}/>
                                <div className="bg-gray-200 h-full" style={{width:`${(skipped/answers.length)*100}%`}}/>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              )}

              {/* CHARTS */}
              {activeTab === "charts" && (
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-indigo-500"/> Score Trend</h4>
                    <p className="text-xs text-slate-400 mb-4">Percentage score across all attempts (chronological)</p>
                    {timelineData.length === 0 ? (
                      <p className="text-center text-slate-400 text-sm py-8">No data to display</p>
                    ) : (
                      <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={timelineData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                          <XAxis dataKey="name" tick={{fontSize:11}}/>
                          <YAxis domain={[0,100]} tickFormatter={v=>`${v}%`} tick={{fontSize:11}}/>
                          <Tooltip formatter={(v,_,props)=>[`${v}%`,props.payload.exam]} labelFormatter={l=>`Attempt ${l}`}/>
                          <Line type="monotone" dataKey="pct" stroke="#6366f1" strokeWidth={2.5} dot={{r:4}} activeDot={{r:6}}/>
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                      <h4 className="font-bold text-slate-800 mb-1">Avg Score per Exam</h4>
                      <p className="text-xs text-slate-400 mb-4">Average % score across all attempts per exam</p>
                      {examAvgData.length === 0 ? <p className="text-center text-slate-400 text-sm py-8">No data</p> : (
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart data={examAvgData} barSize={28}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                            <XAxis dataKey="name" tick={{fontSize:10}}/>
                            <YAxis domain={[0,100]} tickFormatter={v=>`${v}%`} tick={{fontSize:10}}/>
                            <Tooltip formatter={v=>[`${v}%`,"Avg Score"]}/>
                            <Bar dataKey="avg" fill="#6366f1" radius={[6,6,0,0]}/>
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                      <h4 className="font-bold text-slate-800 mb-1">Attempts by Category</h4>
                      <p className="text-xs text-slate-400 mb-4">How many tests attempted per exam category</p>
                      {categoryPieData.length === 0 ? <p className="text-center text-slate-400 text-sm py-8">No data</p> : (
                        <>
                          <ResponsiveContainer width="100%" height={170}>
                            <PieChart>
                              <Pie data={categoryPieData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                                {categoryPieData.map((_,i) => <Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
                              </Pie>
                              <Tooltip formatter={(v,n)=>[v,n]}/>
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center mt-2">
                            {categoryPieData.map((d,i) => (
                              <div key={i} className="flex items-center gap-1.5 text-xs text-slate-600">
                                <div className="w-2.5 h-2.5 rounded-full" style={{background:COLORS[i%COLORS.length]}}/>
                                {d.name} ({d.value})
                              </div>
                            ))}
                          </div>
                        </>
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
