import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap, HeartPulse, Briefcase, Laptop,
  Scale, Landmark, ChevronRight, BookOpen,
  FileText, PenTool, Bell,
} from "lucide-react";

const STREAMS = [
  {
    name: "Engineering", slug: "engineering",
    icon: GraduationCap, color: "bg-blue-100 text-blue-600",
    exams: [
      { label: "JEE Main",     slug: "jee-main" },
      { label: "JEE Advanced", slug: "jee-advanced" },
      { label: "BITSAT",       slug: "bitsat" },
      { label: "VITEEE",       slug: "viteee" },
      { label: "MHT CET",      slug: "mht-cet" },
      { label: "KCET",         slug: "kcet" },
      { label: "WBJEE",        slug: "wbjee" },
      { label: "COMEDK UGET",  slug: "comedk-uget" },
    ],
  },
  {
    name: "Medical", slug: "medical",
    icon: HeartPulse, color: "bg-green-100 text-green-600",
    exams: [
      { label: "NEET UG", slug: "neet-ug" },
      { label: "NEET PG", slug: "neet-pg" },
      { label: "AFMC",    slug: "afmc" },
      { label: "JIPMER",  slug: "jipmer-puducherry" },
    ],
  },
  {
    name: "Management", slug: "management",
    icon: Briefcase, color: "bg-purple-100 text-purple-600",
    exams: [
      { label: "CAT",  slug: "cat" },
      { label: "XAT",  slug: "xat" },
      { label: "MAT",  slug: "mat" },
      { label: "CMAT", slug: "cmat" },
      { label: "NMAT", slug: "nmat" },
    ],
  },
  {
    name: "Computer Science", slug: "computer-science",
    icon: Laptop, color: "bg-cyan-100 text-cyan-600",
    exams: [
      { label: "GATE CS",  slug: "gate-cs" },
      { label: "NIMCET",   slug: "nimcet" },
      { label: "CUET PG",  slug: "cuet-pg" },
      { label: "TANCET",   slug: "tancet" },
      { label: "IIT JAM",  slug: "jam" },
    ],
  },
  {
    name: "Law", slug: "law",
    icon: Scale, color: "bg-amber-100 text-amber-600",
    exams: [
      { label: "CLAT",      slug: "clat" },
      { label: "AILET",     slug: "ailet" },
      { label: "DU LLB",    slug: "du-llb" },
      { label: "AP LAWCET", slug: "ap-lawcet" },
    ],
  },
  {
    name: "Government", slug: "government",
    icon: Landmark, color: "bg-red-100 text-red-600",
    exams: [
      { label: "UPSC CSE", slug: "upsc" },
      { label: "SSC CGL",  slug: "ssc-cgl" },
      { label: "IBPS PO",  slug: "ibps-po" },
      { label: "RRB NTPC", slug: "rrb-ntpc" },
    ],
  },
];

const QUICK_LINKS = [
  { icon: BookOpen, label: "Exam Calendar",   path: "/resources/exam-calendar" },
  { icon: FileText, label: "Previous Papers", path: "/resources/previous-papers" },
  { icon: PenTool,  label: "All Colleges",    path: "/colleges" },
  { icon: Bell,     label: "Notifications",   path: "/notifications" },
];

// ── Login check helper ────────────────────────────────────────
const isLoggedIn = () => {
  try {
    const user = localStorage.getItem("user");
    return !!user && !!JSON.parse(user)?._id || !!JSON.parse(user)?.id || !!JSON.parse(user)?.email;
  } catch { return false; }
};

export default function BrowseDropdown() {
  const navigate = useNavigate();
  const [active, setActive] = useState(STREAMS[0]);

  // ── Guard: redirect to login if not logged in ─────────────
  const guardedNavigate = (path) => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }
    navigate(path);
  };

  return (
    <div
      className="absolute top-full left-0 mt-1 bg-white shadow-2xl rounded-2xl z-50
                 border border-gray-100 overflow-hidden"
      style={{ width: "720px" }}
    >
      <div className="flex">

        {/* ── LEFT: stream tabs ──────────────────────────────────── */}
        <div className="w-48 bg-gray-50 border-r border-gray-100 py-3 flex-shrink-0">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-4 mb-2">
            Streams
          </p>
          {STREAMS.map((stream) => {
            const Icon = stream.icon;
            const isActive = active.slug === stream.slug;
            return (
              <button
                key={stream.slug}
                onMouseEnter={() => setActive(stream)}
                onClick={() => guardedNavigate(`/stream/${stream.slug}`)}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium
                  transition-all text-left
                  ${isActive
                    ? "bg-white text-blue-600 border-r-2 border-blue-600 shadow-sm"
                    : "text-gray-600 hover:bg-white hover:text-gray-900"}`}
              >
                <div className={`w-6 h-6 rounded-md flex items-center justify-center
                                 flex-shrink-0 ${stream.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span>{stream.name}</span>
                {isActive && <ChevronRight className="w-3 h-3 ml-auto flex-shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* ── RIGHT: exam list + quick links ─────────────────────── */}
        <div className="flex-1 p-5">

          {/* Active stream exams */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              {(() => {
                const Icon = active.icon;
                return (
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center ${active.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                );
              })()}
              <h3 className="font-bold text-gray-900 text-sm">{active.name} Exams</h3>
            </div>

            <div className="grid grid-cols-2 gap-0.5">
              {active.exams.map((exam) => (
                <button
                  key={exam.slug}
                  onClick={() => guardedNavigate(`/exam/${exam.slug}`)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700
                             hover:bg-blue-50 hover:text-blue-600 transition-colors text-left group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300
                                   group-hover:bg-blue-400 transition-colors flex-shrink-0" />
                  {exam.label}
                </button>
              ))}
              <button
                onClick={() => guardedNavigate(`/stream/${active.slug}`)}
                className="col-span-2 flex items-center gap-1 px-3 py-2 rounded-lg text-xs
                           text-blue-600 font-semibold hover:bg-blue-50 transition-colors text-left mt-1"
              >
                View all {active.name} exams →
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
              Quick Access
            </p>
            <div className="grid grid-cols-2 gap-1">
              {QUICK_LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <button
                    key={link.label}
                    onClick={() => guardedNavigate(link.path)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600
                               hover:bg-gray-100 hover:text-gray-900 transition-colors text-left"
                  >
                    <Icon className="w-3.5 h-3.5 text-gray-400" />
                    {link.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5
                      flex items-center justify-between">
        <p className="text-white text-xs font-medium">
          Explore 100+ exams across 6 streams
        </p>
        <button
          onClick={() => guardedNavigate("/notifications")}
          className="text-xs text-blue-200 hover:text-white font-semibold transition-colors"
        >
          🔔 Latest Notifications →
        </button>
      </div>
    </div>
  );
}

export { STREAMS };