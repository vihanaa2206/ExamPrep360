import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  MessageCircleQuestion,
  Users
} from "lucide-react";

export default function AdminSidebar({ pendingCount }) {

  const linkClass =
    "flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700";

  const activeClass = "bg-gray-800 text-white";

  return (
    <aside className="w-64 bg-[#0f172a] text-gray-200 min-h-screen">
      <div className="px-4 py-5 text-lg font-bold border-b border-gray-700">
        Admin Panel
      </div>

      <nav className="mt-4 space-y-1 px-2">

        <NavLink to="/admin/dashboard" className={({ isActive }) =>
          `${linkClass} ${isActive ? activeClass : ""}`
        }>
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink to="/admin/exams" className={({ isActive }) =>
          `${linkClass} ${isActive ? activeClass : ""}`
        }>
          <BookOpen size={18} />
          Manage Exams
        </NavLink>

        <NavLink to="/admin/pyqs" className={({ isActive }) =>
          `${linkClass} ${isActive ? activeClass : ""}`
        }>
          <FileText size={18} />
          Previous Year Questions
        </NavLink>

        <NavLink to="/admin/queries" className={({ isActive }) =>
          `${linkClass} ${isActive ? activeClass : ""}`
        }>
          <MessageCircleQuestion size={18} />
          Ask Queries

          {pendingCount > 0 && (
            <span className="ml-auto bg-red-500 text-xs px-2 py-0.5 rounded-full">
              {pendingCount}
            </span>
          )}
        </NavLink>

        <NavLink to="/admin/users" className={({ isActive }) =>
          `${linkClass} ${isActive ? activeClass : ""}`
        }>
          <Users size={18} />
          Manage Users
        </NavLink>

      </nav>
    </aside>
  );
}
