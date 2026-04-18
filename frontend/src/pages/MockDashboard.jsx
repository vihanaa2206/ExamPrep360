// src/pages/MockDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trophy, Target, BookOpen,
  CheckCircle, BarChart3,
  ChevronRight, Trash2, ArrowLeft, Zap, X, Users,
} from "lucide-react";

/* ─── Radial Answer Card ─────────────────────────────────── */
function AnswerCard({ test, onClose }) {
  if (!test) return null;
  const answers = test.answers || [];
  const correct  = answers.filter(a => a.is_correct).length;
  const wrong    = answers.filter(a => !a.is_correct && a.selected_option).length;
  const skipped  = answers.filter(a => !a.selected_option).length;
  const pct = answers.length ? Math.round((correct / answers.length) * 100) : test.accuracy || 0;
  const color = pct >= 80 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#ef4444";
  const r = 45, circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        style={{ animation: "zoomIn .25s ease" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h3 className="font-black text-lg">{test.exam}</h3>
            <p className="text-blue-200 text-xs">Test {test.testNo} · {test.scheme} · {test.date ? new Date(test.date).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}) : "—"}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition"><X className="w-5 h-5"/></button>
        </div>

        {/* Radial summary */}
        <div className="flex items-center gap-6 px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <svg width="100" height="100" viewBox="0 0 120 120" className="flex-shrink-0">
            <circle cx="60" cy="60" r={r} fill="none" stroke="#f3f4f6" strokeWidth="10"/>
            <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="10"
              strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
              style={{transform:"rotate(-90deg)",transformOrigin:"60px 60px",transition:"stroke-dashoffset .8s ease"}}/>
            <text x="60" y="54" textAnchor="middle" fontSize="18" fontWeight="900" fill={color}>{pct}%</text>
            <text x="60" y="70" textAnchor="middle" fontSize="9" fill="#9ca3af">Accuracy</text>
          </svg>
          <div className="grid grid-cols-3 gap-4 flex-1">
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
            <p className="text-xl font-black text-gray-800">{test.score}/{test.maxScore}</p>
            <p className="text-xs text-gray-400">pts</p>
          </div>
        </div>

        {/* Q&A list */}
        <div className="overflow-y-auto flex-1 px-6 py-4 bg-gray-50">
          {answers.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No question-level data saved for this test.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-3">
              {answers.map((a, i) => {
                const isCorrect = a.is_correct;
                const isWrong   = !a.is_correct && a.selected_option;
                return (
                  <div key={i} className={`rounded-2xl border-2 p-4 text-sm shadow-sm ${
                    isCorrect ? "bg-green-50 border-green-400"
                    : isWrong ? "bg-red-50 border-red-400"
                    : "bg-gray-100 border-gray-300"
                  }`}>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <p className="font-bold text-gray-900 leading-snug line-clamp-3">Q{i+1}. {a.question_text || `Question ${i+1}`}</p>
                      <span className={`flex-shrink-0 px-2.5 py-1 rounded-full font-black text-xs whitespace-nowrap ${
                        isCorrect ? "bg-green-500 text-white"
                        : isWrong ? "bg-red-500 text-white"
                        : "bg-gray-500 text-white"
                      }`}>
                        {isCorrect ? "✓ Correct" : isWrong ? "✗ Wrong" : "— Skipped"}
                      </span>
                    </div>
                    <div className={`rounded-xl px-3 py-2 mb-2 ${isCorrect ? "bg-green-100" : isWrong ? "bg-red-100" : "bg-gray-200"}`}>
                      <span className="text-xs font-black text-gray-500 uppercase tracking-wide">Your Answer</span>
                      <p className={`font-black text-base mt-0.5 ${isCorrect ? "text-green-800" : isWrong ? "text-red-800" : "text-gray-600"}`}>
                        {a.selected_option || "Not answered"}
                      </p>
                    </div>
                    {!isCorrect && a.correct_option && (
                      <div className="bg-green-100 rounded-xl px-3 py-2">
                        <span className="text-xs font-black text-gray-500 uppercase tracking-wide">Correct Answer</span>
                        <p className="font-black text-base text-green-800 mt-0.5">{a.correct_option}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Leaderboard Popup — shows ALL users per exam ───────── */
function LeaderboardPopup({ exam, allHistory, currentUserId, onClose }) {
  // Keep BEST attempt per user for this exam
  const userMap = {};
  allHistory
    .filter(h => h.exam === exam)
    .forEach(h => {
      const uid  = h.userId || h.user_id || h.userEmail || "Unknown";
      const name = h.userName || h.name || h.userEmail || uid;
      const score = h.score || 0;
      const maxScore = h.maxScore || 100;
      const accuracy = h.accuracy || 0;
      if (!userMap[uid] || score > userMap[uid].score) {
        userMap[uid] = { uid, name, score, maxScore, accuracy };
      }
    });

  const board = Object.values(userMap).sort((a, b) => b.score - a.score || b.accuracy - a.accuracy);

  const medalEmoji = (i) => i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : null;
  const rankBg = (i) =>
    i === 0 ? "bg-yellow-50 border-yellow-300"
    : i === 1 ? "bg-slate-50 border-slate-300"
    : i === 2 ? "bg-orange-50 border-orange-300"
    : "bg-white border-gray-100";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-hidden flex flex-col"
        style={{ animation: "zoomIn .25s ease" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h3 className="font-black text-lg flex items-center gap-2"><Trophy className="w-5 h-5"/> Leaderboard</h3>
            <p className="text-yellow-100 text-xs">{exam} · {board.length} participant{board.length !== 1 ? "s" : ""}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition"><X className="w-5 h-5"/></button>
        </div>

        <div className="overflow-y-auto flex-1 px-4 py-3 space-y-2">
          {board.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No attempts recorded for this exam yet.</p>
          ) : board.map((u, i) => {
            const isMe = u.uid === currentUserId;
            return (
              <div key={u.uid} className={`rounded-2xl border-2 p-4 flex items-center gap-4 transition ${rankBg(i)} ${isMe ? "ring-2 ring-blue-400" : ""}`}>
                {/* Rank */}
                <div className="w-10 text-center flex-shrink-0">
                  {medalEmoji(i)
                    ? <span className="text-2xl">{medalEmoji(i)}</span>
                    : <span className="text-lg font-black text-gray-400">#{i+1}</span>
                  }
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-black text-gray-900 truncate">{u.name}</p>
                    {isMe && <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded-full font-bold flex-shrink-0">You</span>}
                  </div>
                  <p className="text-xs text-gray-400">{u.score}/{u.maxScore} pts</p>
                </div>

                {/* Score ring */}
                <div className="flex-shrink-0 text-right">
                  <p className={`text-2xl font-black ${u.accuracy >= 70 ? "text-green-600" : u.accuracy >= 50 ? "text-yellow-600" : "text-red-500"}`}>
                    {u.accuracy}%
                  </p>
                  <p className="text-xs text-gray-400">accuracy</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Dashboard ─────────────────────────────────────── */
export default function MockDashboard() {
  const [history, setHistory]           = useState([]);
  const [allHistory, setAllHistory]     = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [activeTab, setActiveTab]       = useState("overview");
  const [selectedTest, setSelectedTest] = useState(null);
  const [leaderboardExam, setLeaderboardExam] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const uid = currentUser._id || currentUser.id || currentUser.email;
    setCurrentUserId(uid);

    const raw = localStorage.getItem("mock_history");
    if (!raw) { setHistory([]); setAllHistory([]); return; }
    try {
      const all = JSON.parse(raw);
      if (!Array.isArray(all)) { setHistory([]); setAllHistory([]); return; }
      setAllHistory(all);
      const myHistory = all.filter(h => {
        const entryId = h.userId || h.user_id;
        if (!entryId) return false;
        return entryId === uid;
      });
      setHistory(myHistory);
    } catch { setHistory([]); setAllHistory([]); }
  }, []);

  const clearHistory = () => {
    if (!window.confirm("Clear all your test history?")) return;
    const raw = localStorage.getItem("mock_history");
    if (raw) {
      try {
        const all = JSON.parse(raw);
        const others = all.filter(h => { const id = h.userId || h.user_id; return id && id !== currentUserId; });
        others.length > 0 ? localStorage.setItem("mock_history", JSON.stringify(others)) : localStorage.removeItem("mock_history");
      } catch { localStorage.removeItem("mock_history"); }
    }
    setHistory([]);
  };

  const totalTests   = history.length;
  const avgAccuracy  = totalTests > 0 ? Math.round(history.reduce((s,h) => s + h.accuracy, 0) / totalTests) : 0;
  const totalQs      = history.reduce((s,h) => s + (h.total || 0), 0);
  const totalCorrect = history.reduce((s,h) => s + (h.correct || 0), 0);
  const bestScore    = totalTests > 0 ? Math.max(...history.map(h => h.accuracy)) : 0;

  const examStats = {};
  history.forEach(h => {
    if (!examStats[h.exam]) examStats[h.exam] = { attempts:0, totalAcc:0, best:0, scores:[] };
    examStats[h.exam].attempts++;
    examStats[h.exam].totalAcc += h.accuracy;
    examStats[h.exam].best = Math.max(examStats[h.exam].best, h.accuracy);
    examStats[h.exam].scores.push(h.accuracy);
  });

  const examList = Object.entries(examStats)
    .map(([exam,s]) => ({ exam, attempts:s.attempts, avgAcc:Math.round(s.totalAcc/s.attempts), best:s.best, scores:s.scores }))
    .sort((a,b) => b.attempts - a.attempts);

  const recentTests = [...history].slice(0,10).reverse();

  const grade = acc =>
    acc>=80 ? {label:"A+",color:"text-green-600",bg:"bg-green-100"}
  : acc>=65 ? {label:"A", color:"text-blue-600", bg:"bg-blue-100"}
  : acc>=50 ? {label:"B", color:"text-yellow-600",bg:"bg-yellow-100"}
  : acc>=35 ? {label:"C", color:"text-orange-600",bg:"bg-orange-100"}
  :           {label:"D", color:"text-red-600",   bg:"bg-red-100"};

  const MiniChart = ({ scores, maxH=60 }) => {
    if (!scores?.length) return null;
    return (
      <div className="flex items-end gap-1 h-14">
        {scores.map((s,i) => (
          <div key={i} className="flex flex-col items-center gap-0.5 flex-1">
            <div className={`w-full rounded-t-sm ${s>=70?"bg-green-400":s>=50?"bg-yellow-400":"bg-red-400"}`} style={{height:`${Math.max(4,(s/100)*maxH)}px`}}/>
            <span className="text-[8px] text-gray-400">{s}%</span>
          </div>
        ))}
      </div>
    );
  };

  const AccuracyRing = ({ value, size=120 }) => {
    const r=45, cx=60, cy=60, circ=2*Math.PI*r;
    const offset = circ-(value/100)*circ;
    const color = value>=70?"#22c55e":value>=50?"#f59e0b":"#ef4444";
    return (
      <svg width={size} height={size} viewBox="0 0 120 120">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f3f4f6" strokeWidth="10"/>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{transform:"rotate(-90deg)",transformOrigin:"60px 60px",transition:"stroke-dashoffset 1s ease"}}/>
        <text x={cx} y={cy-6} textAnchor="middle" fontSize="18" fontWeight="900" fill={color}>{value}%</text>
        <text x={cx} y={cy+12} textAnchor="middle" fontSize="10" fill="#9ca3af">Accuracy</text>
      </svg>
    );
  };

  const Sparkline = ({ data }) => {
    if (data.length < 2) return null;
    const w=200, h=50;
    const pts = data.map((v,i) => `${(i/(data.length-1))*w},${h-(v/100)*h}`).join(" ");
    const lastTrend = data[data.length-1]-data[data.length-2];
    return (
      <div className="flex items-center gap-3">
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
          <polyline points={pts} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          {data.map((v,i) => { const x=(i/(data.length-1))*w; const y=h-(v/100)*h; return <circle key={i} cx={x} cy={y} r="3" fill="#3b82f6"/>; })}
        </svg>
        <span className={`text-xs font-bold ${lastTrend>=0?"text-green-500":"text-red-500"}`}>{lastTrend>=0?"↑":"↓"} {Math.abs(lastTrend)}%</span>
      </div>
    );
  };

  if (totalTests === 0) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <BarChart3 className="w-16 h-16 text-slate-600 mx-auto mb-4"/>
          <h2 className="text-2xl font-black text-slate-300 mb-2">No Test History Yet</h2>
          <p className="text-slate-500 text-sm mb-6">Attempt a mock test to see your performance analytics here!</p>
          <button onClick={() => navigate("/free-tests")} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition">Start Mock Test →</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Popups */}
      {selectedTest && <AnswerCard test={selectedTest} onClose={() => setSelectedTest(null)}/>}
      {leaderboardExam && (
        <LeaderboardPopup
          exam={leaderboardExam}
          allHistory={allHistory}
          currentUserId={currentUserId}
          onClose={() => setLeaderboardExam(null)}
        />
      )}

      <style>{`@keyframes zoomIn{from{transform:scale(.85);opacity:0}to{transform:scale(1);opacity:1}}`}</style>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <button onClick={() => navigate("/free-tests")} className="flex items-center gap-2 text-blue-200 hover:text-white mb-4 text-sm transition">
            <ArrowLeft className="w-4 h-4"/> Back to Mock Tests
          </button>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-black mb-1">My Performance Dashboard</h1>
              <p className="text-blue-200 text-sm">{totalTests} tests attempted · {totalQs} questions solved</p>
            </div>
            <button onClick={clearHistory} className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition">
              <Trash2 className="w-4 h-4"/> Clear History
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {label:"Tests Attempted",value:totalTests,       icon:<BookOpen className="w-5 h-5"/>,   color:"text-blue-600",   bg:"bg-blue-50"},
            {label:"Avg Accuracy",   value:`${avgAccuracy}%`,icon:<Target className="w-5 h-5"/>,     color:"text-purple-600", bg:"bg-purple-50"},
            {label:"Best Score",     value:`${bestScore}%`,  icon:<Trophy className="w-5 h-5"/>,     color:"text-yellow-600", bg:"bg-yellow-50"},
            {label:"Qs Attempted",   value:totalQs,          icon:<CheckCircle className="w-5 h-5"/>,color:"text-green-600",  bg:"bg-green-50"},
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-2xl p-5 border border-gray-100 shadow-sm`}>
              <div className={`${s.color} mb-2`}>{s.icon}</div>
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5 font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 w-fit shadow-sm flex-wrap">
          {[{key:"overview",label:"Overview"},{key:"exams",label:"By Exam"},{key:"history",label:"Test History"},{key:"leaderboard",label:"🏆 Leaderboard"}].map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition ${activeTab===t.key?"bg-blue-600 text-white shadow-sm":"text-gray-600 hover:text-gray-900"}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex items-center gap-6">
              <AccuracyRing value={avgAccuracy}/>
              <div>
                <h3 className="font-black text-gray-900 text-lg mb-1">Overall Accuracy</h3>
                <p className="text-sm text-gray-500 mb-3">Across all {totalTests} tests</p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-green-500"/><span className="text-gray-600">{totalCorrect} correct out of {totalQs}</span></div>
                  <div className="flex items-center gap-2 text-sm"><Zap className="w-4 h-4 text-yellow-500"/><span className="text-gray-600">Best: {bestScore}%</span></div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-black text-gray-900 mb-1">Performance Trend</h3>
              <p className="text-xs text-gray-400 mb-4">Last {Math.min(recentTests.length,10)} tests</p>
              {recentTests.length >= 2
                ? <><Sparkline data={recentTests.map(t=>t.accuracy)}/><div className="flex justify-between mt-3 text-xs text-gray-400"><span>Oldest</span><span>Latest</span></div></>
                : <p className="text-gray-400 text-sm">Attempt more tests to see trend</p>}
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm md:col-span-2">
              <h3 className="font-black text-gray-900 mb-4">Overall Breakdown</h3>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {[
                  {label:"Correct",value:history.reduce((s,h)=>s+(h.correct||0),0), color:"bg-green-500",text:"text-green-700"},
                  {label:"Wrong",  value:history.reduce((s,h)=>s+(h.wrong||0),0),   color:"bg-red-400",  text:"text-red-700"},
                  {label:"Skipped",value:history.reduce((s,h)=>s+(h.skipped||0),0), color:"bg-gray-300", text:"text-gray-600"},
                ].map(b => (
                  <div key={b.label} className="text-center">
                    <p className={`text-2xl font-black ${b.text}`}>{b.value}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{b.label}</p>
                  </div>
                ))}
              </div>
              {totalQs > 0 && (
                <div className="h-4 rounded-full overflow-hidden flex">
                  {[
                    {val:history.reduce((s,h)=>s+(h.correct||0),0), color:"bg-green-500"},
                    {val:history.reduce((s,h)=>s+(h.wrong||0),0),   color:"bg-red-400"},
                    {val:history.reduce((s,h)=>s+(h.skipped||0),0), color:"bg-gray-300"},
                  ].map((b,i) => <div key={i} className={`${b.color} h-full`} style={{width:`${(b.val/totalQs)*100}%`}}/>)}
                </div>
              )}
            </div>
          </div>
        )}

        {/* BY EXAM */}
        {activeTab === "exams" && (
          <div className="space-y-3">
            {examList.map(e => {
              const g = grade(e.avgAcc);
              // Count all users for this exam from allHistory
              const usersForExam = new Set(allHistory.filter(h=>h.exam===e.exam).map(h=>h.userId||h.user_id||h.userEmail)).size;
              return (
                <div key={e.exam} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition cursor-pointer"
                  onClick={() => navigate(`/mock-test/${encodeURIComponent(e.exam)}`)}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${g.bg} flex items-center justify-center`}>
                        <span className={`font-black text-sm ${g.color}`}>{g.label}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{e.exam}</h3>
                        <p className="text-xs text-gray-400">{e.attempts} attempt{e.attempts>1?"s":""} · <span className="text-blue-500 font-bold">{usersForExam} user{usersForExam!==1?"s":""} competed</span></p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={ev => { ev.stopPropagation(); setLeaderboardExam(e.exam); }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-xl text-xs font-bold hover:bg-yellow-100 transition border border-yellow-200"
                      >
                        <Trophy className="w-3 h-3"/> Leaderboard
                      </button>
                      <div className="text-right">
                        <p className={`text-xl font-black ${g.color}`}>{e.avgAcc}%</p>
                        <p className="text-xs text-gray-400">avg · best {e.best}%</p>
                      </div>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                    <div className={`h-full rounded-full ${e.avgAcc>=70?"bg-green-500":e.avgAcc>=50?"bg-yellow-400":"bg-red-400"}`} style={{width:`${e.avgAcc}%`}}/>
                  </div>
                  {e.scores.length > 1 && <MiniChart scores={e.scores}/>}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-400">Click to attempt again</span>
                    <ChevronRight className="w-4 h-4 text-gray-300"/>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* HISTORY */}
        {activeTab === "history" && (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 font-medium">Click any card to see full answer breakdown</p>
            {history.map((h, i) => {
              const g = grade(h.accuracy);
              const answers = h.answers || [];
              const correct  = answers.length ? answers.filter(a=>a.is_correct).length : (h.correct||0);
              const wrong    = answers.length ? answers.filter(a=>!a.is_correct&&a.selected_option).length : (h.wrong||0);
              const skipped  = answers.length ? answers.filter(a=>!a.selected_option).length : (h.skipped||0);
              const r=35, circ=2*Math.PI*r;
              const offset=circ-(h.accuracy/100)*circ;
              const ringColor=h.accuracy>=70?"#22c55e":h.accuracy>=50?"#f59e0b":"#ef4444";

              return (
                <div key={i}
                  className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-lg transition cursor-pointer hover:scale-[1.01]"
                  style={{transition:"all .2s ease"}}
                  onClick={() => setSelectedTest(h)}
                >
                  <div className="flex items-center gap-4">
                    <svg width="80" height="80" viewBox="0 0 80 80" className="flex-shrink-0">
                      <circle cx="40" cy="40" r={r} fill="none" stroke="#f3f4f6" strokeWidth="7"/>
                      <circle cx="40" cy="40" r={r} fill="none" stroke={ringColor} strokeWidth="7"
                        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
                        style={{transform:"rotate(-90deg)",transformOrigin:"40px 40px"}}/>
                      <text x="40" y="37" textAnchor="middle" fontSize="13" fontWeight="900" fill={ringColor}>{h.accuracy}%</text>
                      <text x="40" y="50" textAnchor="middle" fontSize="8" fill="#9ca3af">accuracy</text>
                    </svg>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-black text-gray-900">{h.exam}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${g.bg} ${g.color}`}>{g.label}</span>
                      </div>
                      <p className="text-xs text-gray-400 mb-2">
                        Test {h.testNo} · {h.scheme} · {h.date ? new Date(h.date).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}) : "—"}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-green-600 font-bold">✓ {correct} correct</span>
                        <span className="text-red-500 font-bold">✗ {wrong} wrong</span>
                        <span className="text-gray-400 font-bold">— {skipped} skip</span>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className={`text-xl font-black ${g.color}`}>{h.score}/{h.maxScore} pts</p>
                      <div className="flex items-center gap-2 mt-2 justify-end">
                        <button
                          onClick={ev => { ev.stopPropagation(); setLeaderboardExam(h.exam); }}
                          className="p-1.5 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition border border-yellow-200"
                          title="Leaderboard"
                        >
                          <Trophy className="w-3.5 h-3.5"/>
                        </button>
                        <button
                          onClick={ev => { ev.stopPropagation(); navigate(`/mock-test/${encodeURIComponent(h.exam)}/${h.testNo}`); }}
                          className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition"
                        >
                          Retry
                        </button>
                      </div>
                    </div>
                  </div>

                  {(correct+wrong+skipped) > 0 && (
                    <div className="mt-3 h-2 rounded-full overflow-hidden flex">
                      <div className="bg-green-400 h-full" style={{width:`${(correct/(correct+wrong+skipped))*100}%`}}/>
                      <div className="bg-red-400 h-full" style={{width:`${(wrong/(correct+wrong+skipped))*100}%`}}/>
                      <div className="bg-gray-200 h-full" style={{width:`${(skipped/(correct+wrong+skipped))*100}%`}}/>
                    </div>
                  )}
                  <p className="text-xs text-gray-400 mt-2 text-center">Click to view full answer breakdown</p>
                </div>
              );
            })}
          </div>
        )}

        {/* LEADERBOARD TAB */}
        {activeTab === "leaderboard" && (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 font-medium">Click any exam card to view its full leaderboard — comparing all users who attempted</p>
            {examList.map(e => {
              const g = grade(e.avgAcc);
              // Build leaderboard preview for this exam from ALL users
              const userMap = {};
              allHistory.filter(h=>h.exam===e.exam).forEach(h => {
                const uid=h.userId||h.user_id||h.userEmail||"Unknown";
                const name=h.userName||h.name||h.userEmail||uid;
                if (!userMap[uid]||h.score>userMap[uid].score) userMap[uid]={uid,name,score:h.score||0,maxScore:h.maxScore||100,accuracy:h.accuracy||0};
              });
              const board = Object.values(userMap).sort((a,b)=>b.score-a.score||b.accuracy-a.accuracy);
              const medal = (i) => i===0?"🥇":i===1?"🥈":i===2?"🥉":`#${i+1}`;

              return (
                <div key={e.exam}
                  className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-lg cursor-pointer hover:scale-[1.01] transition"
                  onClick={() => setLeaderboardExam(e.exam)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${g.bg} flex items-center justify-center`}>
                        <Trophy className={`w-5 h-5 ${g.color}`}/>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{e.exam}</h3>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <Users className="w-3 h-3"/> {board.length} participant{board.length!==1?"s":""} · click to compare
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300"/>
                  </div>
                  {/* Top 3 preview */}
                  <div className="flex gap-2 flex-wrap">
                    {board.slice(0,3).map((u,i) => (
                      <div key={u.uid} className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs border ${
                        i===0?"bg-yellow-50 border-yellow-200":i===1?"bg-gray-50 border-gray-200":"bg-orange-50 border-orange-200"
                      }`}>
                        <span>{medal(i)}</span>
                        <span className={`font-black max-w-[80px] truncate ${u.uid===currentUserId?"text-blue-600":"text-gray-800"}`}>
                          {u.uid===currentUserId?"You":u.name}
                        </span>
                        <span className={`font-black ${u.accuracy>=70?"text-green-600":u.accuracy>=50?"text-yellow-600":"text-red-500"}`}>{u.accuracy}%</span>
                      </div>
                    ))}
                    {board.length === 0 && <p className="text-xs text-gray-400">No attempts recorded yet</p>}
                    {board.length > 3 && <span className="text-xs text-gray-400 self-center">+{board.length-3} more</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}