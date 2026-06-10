import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";

const NAV_CARDS = [
  { title: "Manage Exams",            desc: "Add, edit, update status/level and delete exam records.",                    to: "/admin/exams",           icon: "📋", color: "from-blue-500 to-indigo-600",    light: "bg-blue-50 text-blue-700",       accent: "#6366f1" },
  { title: "Manage Coachings",        desc: "Add and update coaching institutes on the platform.",                        to: "/admin/coachings",       icon: "🏫", color: "from-teal-500 to-cyan-600",      light: "bg-teal-50 text-teal-700",       accent: "#14b8a6" },
  { title: "Manage Colleges",         desc: "Add, edit and remove college listings.",                                     to: "/admin/colleges",        icon: "🎓", color: "from-purple-500 to-violet-600",  light: "bg-purple-50 text-purple-700",   accent: "#8b5cf6" },
  { title: "Mock Tests",              desc: "Create and manage mock test questions for all exams.",                       to: "/admin/mock-tests",      icon: "📝", color: "from-orange-500 to-amber-500",   light: "bg-orange-50 text-orange-700",   accent: "#f97316" },
  { title: "Previous Year Questions", desc: "Upload and manage PYQ papers by exam and year.",                            to: "/admin/pyqs",            icon: "📚", color: "from-green-500 to-emerald-600",  light: "bg-green-50 text-green-700",     accent: "#10b981" },
  { title: "Ask Queries",             desc: "View and respond to questions asked by students.",                           to: "/admin/queries",         icon: "💬", color: "from-pink-500 to-rose-500",      light: "bg-pink-50 text-pink-700",       accent: "#f43f5e" },
  { title: "Manage Users",            desc: "View all users, change roles, block/unblock or delete.",                    to: "/admin/users",           icon: "👥", color: "from-slate-600 to-slate-800",    light: "bg-slate-100 text-slate-700",    accent: "#64748b" },
  { title: "User Feedbacks",          desc: "View all user ratings and suggestions submitted from the platform.",        to: "/admin/feedbacks",       icon: "⭐", color: "from-violet-500 to-fuchsia-500", light: "bg-violet-50 text-violet-700",   accent: "#a855f7" },
  { title: "Payment Records",         desc: "View all user payment transactions, orders and billing history.",           to: "/admin/payments", icon: "💳", color: "from-emerald-500 to-green-600",  light: "bg-emerald-50 text-emerald-700", accent: "#059669" },
  { title: "View Reports",            desc: "Analyse user mock test performance, attempt history and scores.",           to: "/admin/reports",         icon: "📊", color: "from-cyan-500 to-blue-600",      light: "bg-cyan-50 text-cyan-700",       accent: "#0891b2" },
  { title: "AI Chat Logs",            desc: "View all user conversations with the AI Mentor chatbot.",                  to: "/admin/ai-chat-logs",    icon: "🤖", color: "from-rose-500 to-pink-600",      light: "bg-rose-50 text-rose-700",       accent: "#e11d48" },
];

export default function AdminDashboard() {
  const { isDark } = useTheme();
  const [stats, setStats] = useState({ exams: 0, users: 0, openExams: 0, upcomingExams: 0, feedbacks: 0 });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const authHeader = { Authorization: `Bearer ${token}` };
    Promise.allSettled([
      fetch("https://examprep360.onrender.com/api/exams").then(r => r.json()),
      fetch("https://examprep360.onrender.com/api/users", { headers: authHeader }).then(r => r.json()),
      fetch("https://examprep360.onrender.com/api/feedbacks", { headers: authHeader }).then(r => r.json()),
    ]).then(([examsRes, usersRes, feedbacksRes]) => {
      const examsData     = examsRes.status     === "fulfilled" && Array.isArray(examsRes.value)     ? examsRes.value     : [];
      const usersData     = usersRes.status     === "fulfilled" && Array.isArray(usersRes.value)     ? usersRes.value     : [];
      const feedbacksData = feedbacksRes.status === "fulfilled" && Array.isArray(feedbacksRes.value) ? feedbacksRes.value : [];
      setStats({
        exams:         examsData.length,
        users:         usersData.length,
        openExams:     examsData.filter(e => e.status === "Open").length,
        upcomingExams: examsData.filter(e => e.status === "Upcoming").length,
        feedbacks:     feedbacksData.length,
      });
      setLoadingStats(false);
    });
  }, []);

  const STAT_CARDS = [
    { label: "Total Exams",     value: stats.exams,         color: "#6366f1", icon: "📋" },
    { label: "Total Users",     value: stats.users,         color: "#a855f7", icon: "👥" },
    { label: "Open Exams",      value: stats.openExams,     color: "#10b981", icon: "✅" },
    { label: "Upcoming Exams",  value: stats.upcomingExams, color: "#f59e0b", icon: "⏳" },
    { label: "Total Feedbacks", value: stats.feedbacks,     color: "#ec4899", icon: "⭐" },
  ];

  const cardBg = isDark
    ? { backgroundColor: "#1e1e38", border: "1px solid rgba(255,255,255,0.07)" }
    : { backgroundColor: "#ffffff", border: "1px solid #e2e8f0" };

  const labelColor = isDark ? "#a89060" : "#64748b";
  const valueColor = isDark ? "#fde68a" : "#0f172a";

  return (
    <div style={{ backgroundColor: isDark ? "#1a1a2e" : "#f8fafc", minHeight: "100vh", padding: "1.5rem" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

        {/* Welcome banner */}
        <div style={{
          background: "linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)",
          borderRadius: 20, padding: "24px 28px", color: "#fff",
          boxShadow: "0 8px 32px rgba(79,70,229,0.3)",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16,
        }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 900, margin: 0 }}>Welcome back, Admin 👋</h2>
            <p style={{ color: "#c7d2fe", marginTop: 4, fontSize: 13, margin: "4px 0 0" }}>Manage your entire ExamPrep 360 platform from here.</p>
          </div>
          <div style={{ fontSize: 48, opacity: 0.8 }}>🎛️</div>
        </div>

        {/* Quick stats */}
        <div>
          <p style={{ color: isDark ? "#7a6840" : "#94a3b8", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
            Platform Overview
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 14 }}>
            {STAT_CARDS.map(s => (
              <div key={s.label} style={{
                ...cardBg,
                borderRadius: 18,
                padding: "18px 16px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}>
                <div style={{
                  position: "absolute", top: -20, right: -20,
                  width: 80, height: 80, borderRadius: "50%",
                  background: `radial-gradient(circle, ${s.color}30 0%, transparent 70%)`,
                  pointerEvents: "none",
                }} />
                <div style={{
                  width: 46, height: 46, borderRadius: 14, flexShrink: 0,
                  background: `radial-gradient(circle at 30% 30%, ${s.color}ee, ${s.color}99)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20,
                  boxShadow: `0 4px 14px ${s.color}50`,
                }}>
                  {s.icon}
                </div>
                <div>
                  <div style={{ color: valueColor, fontSize: 24, fontWeight: 900, lineHeight: 1 }}>
                    {loadingStats
                      ? <span style={{ display: "inline-block", width: 32, height: 22, borderRadius: 6, background: isDark ? "#2a2a4a" : "#e2e8f0", animation: "pulse 1.5s infinite" }} />
                      : s.value}
                  </div>
                  <div style={{ color: labelColor, fontSize: 11, fontWeight: 600, marginTop: 3 }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nav cards */}
        <div>
          <p style={{ color: isDark ? "#7a6840" : "#94a3b8", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
            Quick Access
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 18 }}>
            {NAV_CARDS.map(card => (
              <Link
                key={card.to}
                to={card.to}
                style={{
                  textDecoration: "none",
                  display: "block",
                  ...cardBg,
                  borderRadius: 20,
                  overflow: "hidden",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  transition: "transform .2s, box-shadow .2s",
                  position: "relative",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = `0 12px 32px ${card.accent}30`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)";
                }}
              >
                <div style={{
                  position: "absolute", top: 0, right: 0,
                  width: 140, height: 140, borderRadius: "50%",
                  background: `radial-gradient(circle at 70% 30%, ${card.accent}22 0%, transparent 65%)`,
                  pointerEvents: "none",
                }} />
                <div style={{
                  height: 4, width: "100%",
                  background: `linear-gradient(90deg, ${card.accent}, ${card.accent}88)`,
                }} />
                <div style={{ padding: "18px 20px", position: "relative" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                    <div style={{
                      width: 50, height: 50, borderRadius: 14, flexShrink: 0,
                      background: isDark
                        ? `radial-gradient(circle at 30% 30%, ${card.accent}55, ${card.accent}22)`
                        : `radial-gradient(circle at 30% 30%, ${card.accent}22, ${card.accent}08)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 24,
                      border: `1px solid ${card.accent}30`,
                      boxShadow: `0 2px 10px ${card.accent}20`,
                    }}>
                      {card.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        color: isDark ? "#fde68a" : "#1e293b",
                        fontWeight: 800, fontSize: 15, margin: "0 0 4px",
                      }}>
                        {card.title}
                      </h3>
                      <p style={{ color: isDark ? "#a89060" : "#64748b", fontSize: 12, lineHeight: 1.5, margin: 0 }}>
                        {card.desc}
                      </p>
                    </div>
                  </div>
                  <div style={{ marginTop: 16 }}>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      padding: "5px 12px", borderRadius: 999, fontSize: 12, fontWeight: 700,
                      background: isDark ? `${card.accent}25` : `${card.accent}12`,
                      color: isDark ? "#fde68a" : card.accent,
                      border: `1px solid ${card.accent}30`,
                      transition: "background .2s",
                    }}>
                      Go to {card.title} →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
