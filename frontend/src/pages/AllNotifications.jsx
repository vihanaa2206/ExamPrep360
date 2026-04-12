import { useState, useEffect } from "react";
import { Clock, ExternalLink, SlidersHorizontal, X, Zap, Building2, BookOpen } from "lucide-react";

import newsExam    from "../assets/news-exam.jpg";
import newsSchool  from "../assets/news-school.jpg";
import newsBanking from "../assets/news-banking.jpg";

const UPDATE_TYPES = ["Application Form","Admit Card","Result","Answer Key","Notification","Exam Date","Admissions Open","Cutoff","Rankings","Placements"];
const CATEGORIES   = ["Engineering","Medical","Management","Law","Computer Science","Government"];
const NOTIF_TYPES  = [
  { value: "",        label: "All (Exams + Colleges)" },
  { value: "exam",    label: "Exam Notifications Only" },
  { value: "college", label: "College Notifications Only" },
];

const UPDATE_TYPE_COLORS = {
  "Application Form": "bg-blue-100 text-blue-700",
  "Admit Card":       "bg-orange-100 text-orange-700",
  "Result":           "bg-green-100 text-green-700",
  "Answer Key":       "bg-purple-100 text-purple-700",
  "Notification":     "bg-gray-100 text-gray-700",
  "Exam Date":        "bg-red-100 text-red-700",
  "Admissions Open":  "bg-teal-100 text-teal-700",
  "Cutoff":           "bg-yellow-100 text-yellow-700",
  "Rankings":         "bg-indigo-100 text-indigo-700",
  "Placements":       "bg-pink-100 text-pink-700",
};

const FALLBACK_IMAGES = [newsExam, newsSchool, newsBanking];

const AllNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filtered, setFiltered]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [showFilters, setShowFilters]     = useState(false);
  const [filters, setFilters] = useState({
    category: "", update_type: "", notif_type: "",
  });

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/notifications")
      .then((r) => r.json())
      .then((data) => { setNotifications(data); setFiltered(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = notifications;
    if (filters.category)    result = result.filter((n) => n.category === filters.category);
    if (filters.update_type) result = result.filter((n) => n.update_type === filters.update_type);
    if (filters.notif_type)  result = result.filter((n) => (n.type || "exam") === filters.notif_type);
    setFiltered(result);
  }, [filters, notifications]);

  const clearAll    = () => setFilters({ category: "", update_type: "", notif_type: "" });
  const activeCount = Object.values(filters).filter(Boolean).length;

  const FilterPanel = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-800">Filters</h3>
        {activeCount > 0 && (
          <button onClick={clearAll} className="text-xs text-red-500 hover:underline">Clear all</button>
        )}
      </div>

      {/* Type — Exam or College */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Notification Type</p>
        <div className="space-y-1.5">
          {NOTIF_TYPES.map((t) => (
            <label key={t.value} className="flex items-center gap-2 cursor-pointer group">
              <input type="radio" name="notif_type"
                checked={filters.notif_type === t.value}
                onChange={() => setFilters((f) => ({ ...f, notif_type: t.value }))}
                className="accent-blue-600" />
              <span className="text-sm text-gray-700 group-hover:text-blue-600">{t.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Category */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Category</p>
        <div className="space-y-1.5">
          {CATEGORIES.map((cat) => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer group">
              <input type="radio" name="category"
                checked={filters.category === cat}
                onChange={() => setFilters((f) => ({ ...f, category: f.category === cat ? "" : cat }))}
                className="accent-blue-600" />
              <span className="text-sm text-gray-700 group-hover:text-blue-600">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Update Type */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Update Type</p>
        <div className="space-y-1.5">
          {UPDATE_TYPES.map((t) => (
            <label key={t} className="flex items-center gap-2 cursor-pointer group">
              <input type="radio" name="update_type"
                checked={filters.update_type === t}
                onChange={() => setFilters((f) => ({ ...f, update_type: f.update_type === t ? "" : t }))}
                className="accent-blue-600" />
              <span className="text-sm text-gray-700 group-hover:text-blue-600">{t}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-1">Latest Exam & College Notifications</h1>
          <p className="text-indigo-100 text-sm">
            Real-time updates on exams, admissions, placements, cutoffs, rankings & more
          </p>

          {/* Quick type toggle */}
          <div className="flex gap-3 mt-4">
            {NOTIF_TYPES.map((t) => (
              <button key={t.value}
                onClick={() => setFilters((f) => ({ ...f, notif_type: t.value }))}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition
                  ${filters.notif_type === t.value
                    ? "bg-white text-indigo-700"
                    : "bg-white/20 text-white hover:bg-white/30"
                  }`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Active chips */}
        {activeCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.entries(filters).map(([key, val]) =>
              val ? (
                <span key={key}
                  className="flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                  {val}
                  <button onClick={() => setFilters((f) => ({ ...f, [key]: "" }))}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ) : null
            )}
          </div>
        )}

        <div className="flex gap-6">

          {/* Sidebar */}
          <aside className="hidden lg:block w-60 flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-2xl p-5 sticky top-24">
              <FilterPanel />
            </div>
          </aside>

          <div className="flex-1">

            {/* Mobile toggle */}
            <button onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 mb-4 text-sm font-medium bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm">
              <SlidersHorizontal className="w-4 h-4" />
              Filters {activeCount > 0 && `(${activeCount})`}
            </button>

            {showFilters && (
              <div className="lg:hidden bg-white border border-gray-200 rounded-2xl p-5 mb-4">
                <FilterPanel />
              </div>
            )}

            <p className="text-sm text-gray-500 mb-5">
              Showing <span className="font-semibold text-gray-800">{filtered.length}</span> notifications
            </p>

            {loading ? (
              <div className="text-center py-20 text-gray-400">Loading...</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <p className="text-lg font-semibold mb-2">No notifications found</p>
                <button onClick={clearAll} className="text-blue-600 text-sm underline">Clear filters</button>
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map((item, index) => (
                  <div key={item.id}
                    onClick={() => window.open(item.official_link, "_blank", "noopener,noreferrer")}
                    className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4
                               hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300
                               cursor-pointer group">

                    {/* Thumbnail */}
                    <div className="w-24 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                      <img
                        src={FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]}
                        alt={item.exam_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">

                      {/* Top row */}
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${UPDATE_TYPE_COLORS[item.update_type] || "bg-gray-100 text-gray-700"}`}>
                          {item.update_type}
                        </span>
                        {item.is_new && (
                          <span className="flex items-center gap-1 text-xs font-bold text-red-500">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                            NEW
                          </span>
                        )}

                        {/* Exam or College tag */}
                        {item.type === "college" ? (
                          <span className="flex items-center gap-1 text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
                            <Building2 className="w-3 h-3" />
                            {item.college_name}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                            <BookOpen className="w-3 h-3" />
                            {item.exam_name}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">
                        {item.title}
                      </h3>

                      {/* Summary */}
                      <p className="text-xs text-gray-500 line-clamp-2 mb-2">{item.summary}</p>

                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />{item.date}
                        </p>
                        <span className="flex items-center gap-1 text-xs text-blue-600 font-semibold">
                          {item.official_source} <ExternalLink className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllNotifications;
