// src/admin/components/AdminSidebar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, BookOpen, GraduationCap, School,
  ClipboardList, FileText, MessageSquare, Users,
  TrendingUp, LogOut, CreditCard, Bot,
} from "lucide-react";

const NAV = [
  { to: "/admin/dashboard",      label: "Dashboard",               icon: LayoutDashboard },
  { to: "/admin/exams",          label: "Manage Exams",            icon: BookOpen },
  { to: "/admin/coachings",      label: "Manage Coachings",        icon: School },
  { to: "/admin/colleges",       label: "Manage Colleges",         icon: GraduationCap },
  { to: "/admin/mock-tests",     label: "Mock Tests",              icon: ClipboardList },
  { to: "/admin/pyqs",           label: "Previous Year Questions", icon: FileText },
  { to: "/admin/queries",        label: "Ask Queries",             icon: MessageSquare, badge: true },
  { to: "/admin/users",          label: "Manage Users",            icon: Users },
  { to: "/admin/reports",        label: "View Reports",            icon: TrendingUp },
  { to: "/admin/payments",       label: "Payment Records",         icon: CreditCard },
  { to: "/admin/feedbacks",      label: "User Feedbacks",          icon: MessageSquare, badge: true },
  { to: "/admin/ai-chat-logs",   label: "AI Chat Logs",            icon: Bot },
];

export default function AdminSidebar({ pendingCount }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="w-56 min-h-screen bg-slate-200 text-slate-800 flex flex-col">

      {/* Brand */}
      <div className="px-5 py-5 border-b border-slate-300">
        <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">
          Admin Panel
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ to, label, icon: Icon, badge }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
               ${isActive
                 ? "bg-indigo-600 text-white shadow-lg"
                 : "text-slate-700 hover:bg-slate-300 hover:text-black"}`
            }
          >
            <div className="flex items-center gap-3">
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{label}</span>
            </div>

            {badge && pendingCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                {pendingCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-slate-300">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                     text-slate-700 hover:bg-red-100 hover:text-red-600 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}