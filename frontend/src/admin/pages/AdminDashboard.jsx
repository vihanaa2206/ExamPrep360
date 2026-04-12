import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const NAV_CARDS = [
  {
    title: "Manage Exams",
    desc: "Add, edit, update status/level and delete exam records.",
    to: "/admin/exams",
    icon: "📋",
    color: "from-blue-500 to-indigo-600",
    light: "bg-blue-50 text-blue-700",
  },
  {
    title: "Manage Coachings",
    desc: "Add and update coaching institutes on the platform.",
    to: "/admin/coachings",
    icon: "🏫",
    color: "from-teal-500 to-cyan-600",
    light: "bg-teal-50 text-teal-700",
  },
  {
    title: "Manage Colleges",
    desc: "Add, edit and remove college listings.",
    to: "/admin/colleges",
    icon: "🎓",
    color: "from-purple-500 to-violet-600",
    light: "bg-purple-50 text-purple-700",
  },
  {
    title: "Mock Tests",
    desc: "Create and manage mock test questions for all exams.",
    to: "/admin/mock-tests",
    icon: "📝",
    color: "from-orange-500 to-amber-500",
    light: "bg-orange-50 text-orange-700",
  },
  {
    title: "Previous Year Questions",
    desc: "Upload and manage PYQ papers by exam and year.",
    to: "/admin/pyqs",
    icon: "📚",
    color: "from-green-500 to-emerald-600",
    light: "bg-green-50 text-green-700",
  },
  {
    title: "Ask Queries",
    desc: "View and respond to questions asked by students.",
    to: "/admin/queries",
    icon: "💬",
    color: "from-pink-500 to-rose-500",
    light: "bg-pink-50 text-pink-700",
  },
  {
    title: "Manage Users",
    desc: "View all users, change roles, block/unblock or delete.",
    to: "/admin/users",
    icon: "👥",
    color: "from-slate-600 to-slate-800",
    light: "bg-slate-100 text-slate-700",
  },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    exams: 0,
    users: 0,
    openExams: 0,
    upcomingExams: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      fetch("http://127.0.0.1:5000/api/exams").then(r => r.json()),
      fetch("http://127.0.0.1:5000/api/users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }).then(r => r.json()),
    ]).then(([examsRes, usersRes]) => {
      const examsData = examsRes.status === "fulfilled" ? examsRes.value : [];
      const usersData = usersRes.status === "fulfilled" ? usersRes.value : [];
      setStats({
        exams:         Array.isArray(examsData) ? examsData.length : 0,
        users:         Array.isArray(usersData) ? usersData.length : 0,
        openExams:     Array.isArray(examsData) ? examsData.filter(e => e.status === "Open").length : 0,
        upcomingExams: Array.isArray(examsData) ? examsData.filter(e => e.status === "Upcoming").length : 0,
      });
      setLoadingStats(false);
    });
  }, []);

  const STAT_CARDS = [
    { label: "Total Exams",     value: stats.exams,         color: "bg-blue-500",    icon: "📋" },
    { label: "Total Users",     value: stats.users,         color: "bg-purple-500",  icon: "👥" },
    { label: "Open Exams",      value: stats.openExams,     color: "bg-emerald-500", icon: "✅" },
    { label: "Upcoming Exams",  value: stats.upcomingExams, color: "bg-amber-500",   icon: "⏳" },
  ];

  return (
    <div className="space-y-8">

      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-2xl p-6 text-white shadow-lg shadow-indigo-100">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-black">Welcome back, Admin 👋</h2>
            <p className="text-indigo-100 mt-1 text-sm">
              Manage your entire ExamPrep 360 platform from here.
            </p>
          </div>
          <div className="text-5xl opacity-80">🎛️</div>
        </div>
      </div>

      {/* Quick stats */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
          Platform Overview
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STAT_CARDS.map(s => (
            <div
              key={s.label}
              className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-4"
            >
              <div className={`w-12 h-12 rounded-xl ${s.color} flex items-center justify-center text-xl flex-shrink-0`}>
                {s.icon}
              </div>
              <div>
                <div className="text-2xl font-black text-slate-800">
                  {loadingStats ? (
                    <span className="inline-block w-8 h-6 bg-slate-200 rounded animate-pulse" />
                  ) : s.value}
                </div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nav cards */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
          Quick Access
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {NAV_CARDS.map(card => (
            <Link
              key={card.to}
              to={card.to}
              className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden"
            >
              {/* colored top bar */}
              <div className={`h-1.5 w-full bg-gradient-to-r ${card.color}`} />
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl ${card.light} flex items-center justify-center text-2xl flex-shrink-0`}>
                    {card.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition text-base">
                      {card.title}
                    </h3>
                    <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                </div>
                <div className={`mt-4 text-xs font-bold ${card.light} inline-flex items-center gap-1 px-3 py-1.5 rounded-lg`}>
                  Go to {card.title} →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}