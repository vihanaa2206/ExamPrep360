// src/pages/MockDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trophy, Target, BookOpen,
  CheckCircle, BarChart3,
  ChevronRight, Trash2, ArrowLeft, Zap,
} from "lucide-react";

export default function MockDashboard() {
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  useEffect(() => {
    const raw = localStorage.getItem("mock_history");
    if (!raw) { setHistory([]); return; }
    try {
      const allHistory = JSON.parse(raw);
      if (!Array.isArray(allHistory) || allHistory.length === 0) {
        setHistory([]);
        return;
      }
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      const currentUserId = currentUser._id || currentUser.id || currentUser.email;

      // ✅ Only show THIS user's entries — entries without userId are hidden
      const myHistory = allHistory.filter(h => {
        const entryId = h.userId || h.user_id;
        if (!entryId) return false;
        return entryId === currentUserId;
      });
      setHistory(myHistory);
    } catch {
      setHistory([]);
    }
  }, []);

  const clearHistory = () => {
    if (!window.confirm("Clear all your test history?")) return;
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const currentUserId = currentUser._id || currentUser.id || currentUser.email;
    const raw = localStorage.getItem("mock_history");
    if (raw) {
      try {
        const allHistory = JSON.parse(raw);
        const otherHistory = allHistory.filter(h => {
          const entryId = h.userId || h.user_id;
          return entryId && entryId !== currentUserId;
        });
        if (otherHistory.length > 0) {
          localStorage.setItem("mock_history", JSON.stringify(otherHistory));
        } else {
          localStorage.removeItem("mock_history");
        }
      } catch {
        localStorage.removeItem("mock_history");
      }
    }
    setHistory([]);
  };

  const totalTests   = history.length;
  const avgAccuracy  = totalTests > 0 ? Math.round(history.reduce((s, h) => s + h.accuracy, 0) / totalTests) : 0;
  const totalQs      = history.reduce((s, h) => s + (h.total || 0), 0);
  const totalCorrect = history.reduce((s, h) => s + (h.correct || 0), 0);
  const bestScore    = totalTests > 0 ? Math.max(...history.map(h => h.accuracy)) : 0;

  const examStats = {};
  history.forEach(h => {
    if (!examStats[h.exam]) {
      examStats[h.exam] = { attempts: 0, totalAcc: 0, best: 0, scores: [] };
    }
    examStats[h.exam].attempts++;
    examStats[h.exam].totalAcc += h.accuracy;
    examStats[h.exam].best = Math.max(examStats[h.exam].best, h.accuracy);
    examStats[h.exam].scores.push(h.accuracy);
  });

  const examList = Object.entries(examStats)
    .map(([exam, s]) => ({
      exam,
      attempts: s.attempts,
      avgAcc: Math.round(s.totalAcc / s.attempts),
      best: s.best,
      scores: s.scores,
    }))
    .sort((a, b) => b.attempts - a.attempts);

  const recentTests = [...history].slice(0, 10).reverse();

  const grade = (acc) =>
    acc >= 80 ? { label: "A+", color: "text-green-600",  bg: "bg-green-100"  }
  : acc >= 65 ? { label: "A",  color: "text-blue-600",   bg: "bg-blue-100"   }
  : acc >= 50 ? { label: "B",  color: "text-yellow-600", bg: "bg-yellow-100" }
  : acc >= 35 ? { label: "C",  color: "text-orange-600", bg: "bg-orange-100" }
  :             { label: "D",  color: "text-red-600",    bg: "bg-red-100"    };

  const MiniChart = ({ scores, maxH = 60 }) => {
    if (!scores?.length) return null;
    return (
      <div className="flex items-end gap-1 h-14">
        {scores.map((s, i) => (
          <div key={i} className="flex flex-col items-center gap-0.5 flex-1">
            <div
              className={`w-full rounded-t-sm transition-all ${s >= 70 ? "bg-green-400" : s >= 50 ? "bg-yellow-400" : "bg-red-400"}`}
              style={{ height: `${Math.max(4, (s / 100) * maxH)}px` }}
            />
            <span className="text-[8px] text-gray-400">{s}%</span>
          </div>
        ))}
      </div>
    );
  };

  const AccuracyRing = ({ value, size = 120 }) => {
    const r = 45, cx = 60, cy = 60;
    const circ = 2 * Math.PI * r;
    const offset = circ - (value / 100) * circ;
    const color = value >= 70 ? "#22c55e" : value >= 50 ? "#f59e0b" : "#ef4444";
    return (
      <svg width={size} height={size} viewBox="0 0 120 120">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f3f4f6" strokeWidth="10" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transform: "rotate(-90deg)", transformOrigin: "60px 60px", transition: "stroke-dashoffset 1s ease" }} />
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="18" fontWeight="900" fill={color}>{value}%</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="10" fill="#9ca3af">Accuracy</text>
      </svg>
    );
  };

  const Sparkline = ({ data }) => {
    if (data.length < 2) return null;
    const w = 200, h = 50;
    const pts = data.map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - (v / 100) * h;
      return `${x},${y}`;
    }).join(" ");
    const lastTrend = data[data.length - 1] - data[data.length - 2];
    return (
      <div className="flex items-center gap-3">
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
          <polyline points={pts} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {data.map((v, i) => {
            const x = (i / (data.length - 1)) * w;
            const y = h - (v / 100) * h;
            return <circle key={i} cx={x} cy={y} r="3" fill="#3b82f6" />;
          })}
        </svg>
        <span className={`text-xs font-bold ${lastTrend >= 0 ? "text-green-500" : "text-red-500"}`}>
          {lastTrend >= 0 ? "↑" : "↓"} {Math.abs(lastTrend)}%
        </span>
      </div>
    );
  };

  // ── Empty state ──────────────────────────────────────────────────────
  if (totalTests === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-gray-700 mb-2">No Test History Yet</h2>
          <p className="text-gray-400 text-sm mb-6">
            Attempt a mock test to see your performance analytics here!
          </p>
          <button
            onClick={() => navigate("/free-tests")}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition"
          >
            Start Mock Test →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => navigate("/free-tests")}
            className="flex items-center gap-2 text-blue-200 hover:text-white mb-4 text-sm transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Mock Tests
          </button>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-black mb-1">My Performance Dashboard</h1>
              <p className="text-blue-200 text-sm">{totalTests} tests attempted · {totalQs} questions solved</p>
            </div>
            <button
              onClick={clearHistory}
              className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition"
            >
              <Trash2 className="w-4 h-4" /> Clear History
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Tests Attempted", value: totalTests,        icon: <BookOpen className="w-5 h-5" />,    color: "text-blue-600",   bg: "bg-blue-50"   },
            { label: "Avg Accuracy",    value: `${avgAccuracy}%`, icon: <Target className="w-5 h-5" />,      color: "text-purple-600", bg: "bg-purple-50" },
            { label: "Best Score",      value: `${bestScore}%`,   icon: <Trophy className="w-5 h-5" />,      color: "text-yellow-600", bg: "bg-yellow-50" },
            { label: "Qs Attempted",    value: totalQs,           icon: <CheckCircle className="w-5 h-5" />, color: "text-green-600",  bg: "bg-green-50"  },
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-2xl p-5 border border-gray-100 shadow-sm`}>
              <div className={`${s.color} mb-2`}>{s.icon}</div>
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5 font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 w-fit shadow-sm">
          {[
            { key: "overview", label: "Overview"     },
            { key: "exams",    label: "By Exam"      },
            { key: "history",  label: "Test History" },
          ].map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition
                ${activeTab === t.key ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:text-gray-900"}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex items-center gap-6">
              <AccuracyRing value={avgAccuracy} />
              <div>
                <h3 className="font-black text-gray-900 text-lg mb-1">Overall Accuracy</h3>
                <p className="text-sm text-gray-500 mb-3">Across all {totalTests} tests</p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-600">{totalCorrect} correct out of {totalQs}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="text-gray-600">Best: {bestScore}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-black text-gray-900 mb-1">Performance Trend</h3>
              <p className="text-xs text-gray-400 mb-4">Last {Math.min(recentTests.length, 10)} tests</p>
              {recentTests.length >= 2
                ? <>
                    <Sparkline data={recentTests.map(t => t.accuracy)} />
                    <div className="flex justify-between mt-3 text-xs text-gray-400">
                      <span>Oldest</span><span>Latest</span>
                    </div>
                  </>
                : <p className="text-gray-400 text-sm">Attempt more tests to see trend</p>
              }
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm md:col-span-2">
              <h3 className="font-black text-gray-900 mb-4">Overall Breakdown</h3>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {[
                  { label: "Correct", value: history.reduce((s, h) => s + (h.correct || 0), 0),  color: "bg-green-500", text: "text-green-700" },
                  { label: "Wrong",   value: history.reduce((s, h) => s + (h.wrong || 0), 0),    color: "bg-red-400",   text: "text-red-700"  },
                  { label: "Skipped", value: history.reduce((s, h) => s + (h.skipped || 0), 0),  color: "bg-gray-300",  text: "text-gray-600" },
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
                    { val: history.reduce((s, h) => s + (h.correct || 0), 0), color: "bg-green-500" },
                    { val: history.reduce((s, h) => s + (h.wrong || 0), 0),   color: "bg-red-400"   },
                    { val: history.reduce((s, h) => s + (h.skipped || 0), 0), color: "bg-gray-300"  },
                  ].map((b, i) => (
                    <div key={i} className={`${b.color} h-full`} style={{ width: `${(b.val / totalQs) * 100}%` }} />
                  ))}
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
              return (
                <div key={e.exam}
                  className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition cursor-pointer"
                  onClick={() => navigate(`/mock-test/${encodeURIComponent(e.exam)}`)}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${g.bg} flex items-center justify-center`}>
                        <span className={`font-black text-sm ${g.color}`}>{g.label}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{e.exam}</h3>
                        <p className="text-xs text-gray-400">{e.attempts} attempt{e.attempts > 1 ? "s" : ""}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-xl font-black ${g.color}`}>{e.avgAcc}%</p>
                      <p className="text-xs text-gray-400">avg · best {e.best}%</p>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full ${e.avgAcc >= 70 ? "bg-green-500" : e.avgAcc >= 50 ? "bg-yellow-400" : "bg-red-400"}`}
                      style={{ width: `${e.avgAcc}%` }}
                    />
                  </div>
                  {e.scores.length > 1 && <MiniChart scores={e.scores} />}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-400">Click to attempt again</span>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* HISTORY */}
        {activeTab === "history" && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="font-black text-gray-900">All Tests ({totalTests})</h3>
            </div>
            <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
              {history.map((h, i) => {
                const g = grade(h.accuracy);
                return (
                  <div key={i} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition">
                    <div className={`w-10 h-10 rounded-xl ${g.bg} flex items-center justify-center flex-shrink-0`}>
                      <span className={`font-black text-sm ${g.color}`}>{g.label}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-sm truncate">{h.exam}</p>
                      <p className="text-xs text-gray-400">
                        Test {h.testNo} · {h.scheme} ·{" "}
                        {h.date ? new Date(h.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`font-black text-base ${g.color}`}>{h.accuracy}%</p>
                      <p className="text-xs text-gray-400">{h.score}/{h.maxScore} pts</p>
                    </div>
                    <div className="hidden md:flex items-center gap-3 text-xs flex-shrink-0">
                      <span className="text-green-600 font-semibold">✓{h.correct || 0}</span>
                      <span className="text-red-500 font-semibold">✗{h.wrong || 0}</span>
                      <span className="text-gray-400">—{h.skipped || 0}</span>
                    </div>
                    <button
                      onClick={() => navigate(`/mock-test/${encodeURIComponent(h.exam)}/${h.testNo}`)}
                      className="flex-shrink-0 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition"
                    >
                      Retry
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}