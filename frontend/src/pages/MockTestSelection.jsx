import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, GraduationCap, HeartPulse, Briefcase,
  Laptop, Scale, Landmark, BookOpen, Zap, ChevronRight,
  BarChart3, Lock,
} from "lucide-react";

const API = "https://examprep360.onrender.com/api";

const EXAM_META = {
  "JEE Main":     { cat:"Engineering", gradient:"from-blue-500 to-indigo-600",    light:"bg-blue-50",   text:"text-blue-600",   icon:<GraduationCap className="w-6 h-6"/> },
  "JEE Advanced": { cat:"Engineering", gradient:"from-blue-600 to-violet-600",    light:"bg-blue-50",   text:"text-blue-600",   icon:<GraduationCap className="w-6 h-6"/> },
  "BITSAT":       { cat:"Engineering", gradient:"from-sky-500 to-blue-600",       light:"bg-sky-50",    text:"text-sky-600",    icon:<GraduationCap className="w-6 h-6"/> },
  "VITEEE":       { cat:"Engineering", gradient:"from-cyan-500 to-blue-500",      light:"bg-cyan-50",   text:"text-cyan-600",   icon:<GraduationCap className="w-6 h-6"/> },
  "SRMJEEE":      { cat:"Engineering", gradient:"from-blue-400 to-cyan-500",      light:"bg-blue-50",   text:"text-blue-600",   icon:<GraduationCap className="w-6 h-6"/> },
  "WBJEE":        { cat:"Engineering", gradient:"from-indigo-500 to-blue-600",    light:"bg-indigo-50", text:"text-indigo-600", icon:<GraduationCap className="w-6 h-6"/> },
  "NEET UG":      { cat:"Medical",     gradient:"from-green-500 to-emerald-600",  light:"bg-green-50",  text:"text-green-600",  icon:<HeartPulse className="w-6 h-6"/> },
  "NEET PG":      { cat:"Medical",     gradient:"from-emerald-500 to-teal-600",   light:"bg-emerald-50",text:"text-emerald-600",icon:<HeartPulse className="w-6 h-6"/> },
  "JIPMER":       { cat:"Medical",     gradient:"from-teal-500 to-green-600",     light:"bg-teal-50",   text:"text-teal-600",   icon:<HeartPulse className="w-6 h-6"/> },
  "AFMC":         { cat:"Medical",     gradient:"from-green-600 to-cyan-600",     light:"bg-green-50",  text:"text-green-600",  icon:<HeartPulse className="w-6 h-6"/> },
  "CAT":          { cat:"Management",  gradient:"from-purple-500 to-violet-600",  light:"bg-purple-50", text:"text-purple-600", icon:<Briefcase className="w-6 h-6"/> },
  "XAT":          { cat:"Management",  gradient:"from-violet-500 to-purple-600",  light:"bg-violet-50", text:"text-violet-600", icon:<Briefcase className="w-6 h-6"/> },
  "CMAT":         { cat:"Management",  gradient:"from-fuchsia-500 to-purple-500", light:"bg-fuchsia-50",text:"text-fuchsia-600",icon:<Briefcase className="w-6 h-6"/> },
  "MAT":          { cat:"Management",  gradient:"from-purple-400 to-pink-500",    light:"bg-purple-50", text:"text-purple-600", icon:<Briefcase className="w-6 h-6"/> },
  "NMAT":         { cat:"Management",  gradient:"from-pink-500 to-purple-500",    light:"bg-pink-50",   text:"text-pink-600",   icon:<Briefcase className="w-6 h-6"/> },
  "GATE CS":      { cat:"CS",          gradient:"from-cyan-500 to-teal-600",      light:"bg-cyan-50",   text:"text-cyan-600",   icon:<Laptop className="w-6 h-6"/> },
  "NIMCET":       { cat:"CS",          gradient:"from-teal-500 to-cyan-600",      light:"bg-teal-50",   text:"text-teal-600",   icon:<Laptop className="w-6 h-6"/> },
  "CUET PG":      { cat:"CS",          gradient:"from-sky-500 to-cyan-500",       light:"bg-sky-50",    text:"text-sky-600",    icon:<Laptop className="w-6 h-6"/> },
  "IIT JAM":      { cat:"CS",          gradient:"from-cyan-600 to-blue-600",      light:"bg-cyan-50",   text:"text-cyan-600",   icon:<Laptop className="w-6 h-6"/> },
  "TANCET":       { cat:"CS",          gradient:"from-blue-500 to-cyan-500",      light:"bg-blue-50",   text:"text-blue-600",   icon:<Laptop className="w-6 h-6"/> },
  "CLAT":         { cat:"Law",         gradient:"from-amber-500 to-orange-500",   light:"bg-amber-50",  text:"text-amber-600",  icon:<Scale className="w-6 h-6"/> },
  "AILET":        { cat:"Law",         gradient:"from-orange-500 to-amber-600",   light:"bg-orange-50", text:"text-orange-600", icon:<Scale className="w-6 h-6"/> },
  "DU LLB":       { cat:"Law",         gradient:"from-yellow-500 to-orange-500",  light:"bg-yellow-50", text:"text-yellow-600", icon:<Scale className="w-6 h-6"/> },
  "AP LAWCET":    { cat:"Law",         gradient:"from-amber-600 to-yellow-600",   light:"bg-amber-50",  text:"text-amber-600",  icon:<Scale className="w-6 h-6"/> },
  "UPSC CSE":     { cat:"Government",  gradient:"from-red-500 to-rose-600",       light:"bg-red-50",    text:"text-red-600",    icon:<Landmark className="w-6 h-6"/> },
  "SSC CGL":      { cat:"Government",  gradient:"from-rose-500 to-red-600",       light:"bg-rose-50",   text:"text-rose-600",   icon:<Landmark className="w-6 h-6"/> },
  "IBPS PO":      { cat:"Government",  gradient:"from-red-600 to-pink-600",       light:"bg-red-50",    text:"text-red-600",    icon:<Landmark className="w-6 h-6"/> },
  "RRB NTPC":     { cat:"Government",  gradient:"from-pink-500 to-red-500",       light:"bg-pink-50",   text:"text-pink-600",   icon:<Landmark className="w-6 h-6"/> },
};

const CATEGORIES = ["All","Engineering","Medical","Management","CS","Law","Government"];

const CAT_COLORS = {
  Engineering: "bg-blue-100 text-blue-700",
  Medical:     "bg-green-100 text-green-700",
  Management:  "bg-purple-100 text-purple-700",
  CS:          "bg-cyan-100 text-cyan-700",
  Law:         "bg-amber-100 text-amber-700",
  Government:  "bg-red-100 text-red-700",
};

export default function MockTestSelection() {
  const [exams, setExams]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [activeCat, setActiveCat] = useState("All");
  const navigate = useNavigate();

  // ── Login check ───────────────────────────────────────────────────────
  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user")); }
    catch { return null; }
  })();

  useEffect(() => {
    fetch(`${API}/mock/exams`)
      .then(r => r.json())
      .then(data => { setExams(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = exams.filter(e => {
    const meta     = EXAM_META[e.exam_name] || {};
    const matchCat = activeCat === "All" || meta.cat === activeCat;
    const matchQ   = e.exam_name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchQ;
  });

  // ── NOT LOGGED IN — show lock screen ─────────────────────────────────
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700
                      flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <Lock className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Login Required</h2>
          <p className="text-gray-500 text-sm mb-6">
            Please login to access Free Mock Tests and track your performance.
          </p>
          <div className="flex gap-3">
            <button onClick={() => navigate("/login")}
              className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition">
              Login
            </button>
            <button onClick={() => navigate("/register")}
              className="flex-1 py-3 border-2 border-blue-600 text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-50 transition">
              Register
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 text-white py-14 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-4 py-1.5 rounded-full text-sm font-semibold mb-5">
            🏆 Free Mock Tests
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-3 tracking-tight">
            Practice. Improve. <span className="text-yellow-300">Excel.</span>
          </h1>
          <p className="text-blue-100 text-base mb-8 max-w-lg mx-auto">
            Real exam-pattern questions · 28 exams · 2594+ questions · Instant results
          </p>
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search exam — JEE, NEET, CAT, UPSC..."
              className="w-full pl-11 pr-4 py-3.5 rounded-xl text-gray-900 text-sm outline-none shadow-lg"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* My Performance button */}
        <div className="flex justify-end mb-4">
          <button onClick={() => navigate("/mock-dashboard")}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200
                       rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition shadow-sm">
            <BarChart3 className="w-4 h-4 text-blue-500" /> My Performance
          </button>
        </div>

        {/* Stats — removed FREE/No Registration */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {[
            { value:"28+",   label:"Exams Available", color:"text-blue-600" },
            { value:"2594+", label:"Total Questions",  color:"text-indigo-600" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5 text-center shadow-sm hover:shadow-md transition">
              <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-1 font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCat(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all
                ${activeCat === cat
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600"}`}>
              {cat}
            </button>
          ))}
        </div>

        <p className="text-sm text-gray-400 mb-5 font-medium">
          Showing <span className="text-gray-700 font-bold">{filtered.length}</span> exams
        </p>

        {/* Cards */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-xl mb-4" />
                <div className="h-5 bg-gray-200 rounded w-2/3 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/2 mb-6" />
                <div className="h-10 bg-gray-200 rounded-xl" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(exam => {
              const meta = EXAM_META[exam.exam_name] || {
                cat:"Other", gradient:"from-gray-400 to-gray-500",
                light:"bg-gray-50", text:"text-gray-600",
                icon:<BookOpen className="w-6 h-6"/>
              };
              const catColor = CAT_COLORS[meta.cat] || "bg-gray-100 text-gray-600";
              return (
                <div key={exam.exam_name}
                  onClick={() => navigate(`/mock-test/${encodeURIComponent(exam.exam_name)}`)}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden
                             cursor-pointer hover:shadow-xl hover:-translate-y-1
                             transition-all duration-300 group">
                  <div className={`h-1.5 bg-gradient-to-r ${meta.gradient}`} />
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl ${meta.light} flex items-center justify-center ${meta.text}`}>
                        {meta.icon}
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${catColor}`}>
                        {meta.cat}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {exam.exam_name}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-5">
                      <span className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-yellow-400" />
                        {exam.test_count} Test{exam.test_count > 1 ? "s" : ""}
                      </span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full" />
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-blue-400" />
                        {exam.total_questions} Qs
                      </span>
                    </div>
                    <button className={`w-full py-3 bg-gradient-to-r ${meta.gradient} text-white rounded-xl
                                       text-sm font-bold flex items-center justify-center gap-2
                                       group-hover:opacity-90 transition-all shadow-sm`}>
                      Start Mock Test
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-lg font-bold text-gray-700">No exams found</p>
            <p className="text-sm text-gray-400 mt-1">Try a different search or category</p>
          </div>
        )}
      </div>
    </div>
  );
}
