import { useState, useEffect } from "react";
import { MapPin, Star, Award, BookOpen, SlidersHorizontal, X, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

import collegeIITDelhi  from "../assets/college-iit-delhi.jpg";
import collegeIITBombay from "../assets/college-iit-bombay.jpg";
import collegeAIIMS     from "../assets/college-aiims.jpg";
import collegeIIM       from "../assets/college-iim.jpg";
import bitcblog1        from "../assets/bitcblog1.jpg";
import nitTrichyImg     from "../assets/download.jpg";
import collegejipmer from "../assets/jipmer-puducherry.jpg";
import collegeIIMBangalore from "../assets/iim-bangalore.jpg";
import collegeNLSIU from "../assets/nlsiu-bangalore.jpg";
import collegeNLU from "../assets/nlu-delhi.jpg";
import collegeIISC from "../assets/iisc-bangalore.jpg";
import collegeIIITHyderabad from "../assets/iiit-hyderabad.jpg";
import collegeLbsna from "../assets/college-lbsnaa-mussoorie.jpg";
import collegeVIT from "../assets/vit-vellore.jpg";

const LOCAL_IMAGES = {
  "iit-delhi":     collegeIITDelhi,
  "iit-bombay":    collegeIITBombay,
  "aiims-delhi":   collegeAIIMS,
  "iim-ahmedabad": collegeIIM,
  "bits-pilani":   bitcblog1,
  "nit-trichy":    nitTrichyImg,
  "jipmer-puducherry": collegejipmer,
  "iim-bangalore": collegeIIMBangalore,
  "nlsiu-bangalore": collegeNLSIU,
  "nlu-delhi": collegeNLU,
  "iisc-bangalore": collegeIISC,
  "iiit-hyderabad": collegeIIITHyderabad,
  "lbsnaa-mussoorie": collegeLbsna,
  "vit-vellore": collegeVIT,
};

const CATEGORIES  = ["Engineering", "Medical", "Management", "Law", "Computer Science", "Government"];
const TYPES       = ["Government", "Private"];
const COURSES_MAP = ["B.Tech", "MBBS", "MBA", "LLB", "M.Tech", "PhD", "B.E."];
const EXAMS_MAP   = [
  { slug: "jee-main",     label: "JEE Main" },
  { slug: "jee-advanced", label: "JEE Advanced" },
  { slug: "neet-ug",      label: "NEET UG" },
  { slug: "cat",          label: "CAT" },
  { slug: "clat",         label: "CLAT" },
  { slug: "gate-cs",      label: "GATE CS" },
  { slug: "upsc",         label: "UPSC" },
];

const categoryColor = {
  Engineering:        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Medical:            "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Management:         "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  Law:                "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  "Computer Science": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  Government:         "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const AllColleges = () => {
  const [colleges, setColleges]       = useState([]);
  const [filtered, setFiltered]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: "", type: "", course: "", exam: "",
  });
  const navigate = useNavigate();

  // Auth guard
  const isLoggedIn = !!localStorage.getItem("user");

  useEffect(() => {
    if (!isLoggedIn) return; // don't fetch if not logged in
    fetch("http://127.0.0.1:5000/api/colleges")
      .then((r) => r.json())
      .then((data) => { setColleges(data); setFiltered(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [isLoggedIn]);

  useEffect(() => {
    let result = colleges;
    if (filters.category) result = result.filter((c) => c.category === filters.category);
    if (filters.type)     result = result.filter((c) => c.type === filters.type);
    if (filters.course)   result = result.filter((c) => c.courses.some((co) => co.toLowerCase().includes(filters.course.toLowerCase())));
    if (filters.exam)     result = result.filter((c) => c.exams_accepted.includes(filters.exam));
    setFiltered(result);
  }, [filters, colleges]);

  const clearFilter = (key) => setFilters((f) => ({ ...f, [key]: "" }));
  const clearAll = () => setFilters({ category: "", type: "", course: "", exam: "" });
  const activeCount = Object.values(filters).filter(Boolean).length;

  // ── AUTH WALL ──────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <Lock className="w-8 h-8 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
          <p className="text-gray-500 text-sm mb-6">
            Create a free account to explore all top colleges, filter by category, fees, courses & more.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-6 py-2.5 border border-blue-200 text-blue-600 font-bold rounded-full hover:bg-blue-50 transition"
            >
              Register Free
            </button>
          </div>
        </div>
      </div>
    );
  }
  // ──────────────────────────────────────────────────────────

  const FilterPanel = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-800 dark:text-gray-200">Filters</h3>
        {activeCount > 0 && (
          <button onClick={clearAll} className="text-xs text-red-500 hover:underline">
            Clear all ({activeCount})
          </button>
        )}
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Category</p>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio" name="category"
                checked={filters.category === cat}
                onChange={() => setFilters((f) => ({ ...f, category: f.category === cat ? "" : cat }))}
                className="accent-blue-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">College Type</p>
        <div className="space-y-1">
          {TYPES.map((t) => (
            <label key={t} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio" name="type"
                checked={filters.type === t}
                onChange={() => setFilters((f) => ({ ...f, type: f.type === t ? "" : t }))}
                className="accent-blue-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{t}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Exam Accepted</p>
        <div className="space-y-1">
          {EXAMS_MAP.map((ex) => (
            <label key={ex.slug} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio" name="exam"
                checked={filters.exam === ex.slug}
                onChange={() => setFilters((f) => ({ ...f, exam: f.exam === ex.slug ? "" : ex.slug }))}
                className="accent-blue-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{ex.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Course</p>
        <div className="space-y-1">
          {COURSES_MAP.map((co) => (
            <label key={co} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio" name="course"
                checked={filters.course === co}
                onChange={() => setFilters((f) => ({ ...f, course: f.course === co ? "" : co }))}
                className="accent-blue-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{co}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-1">Top Colleges in India</h1>
          <p className="text-blue-100 text-sm">
            Explore {colleges.length}+ premier institutions across Engineering, Medical, Management, Law & more
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.entries(filters).map(([key, val]) =>
              val ? (
                <span key={key} className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold px-3 py-1.5 rounded-full">
                  {val}
                  <button onClick={() => clearFilter(key)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ) : null
            )}
          </div>
        )}

        <div className="flex gap-6">
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 sticky top-24">
              <FilterPanel />
            </div>
          </aside>

          <div className="flex-1">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 mb-4 text-sm font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-gray-700 dark:text-gray-300"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters {activeCount > 0 && `(${activeCount})`}
            </button>

            {showFilters && (
              <div className="lg:hidden bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 mb-4">
                <FilterPanel />
              </div>
            )}

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Showing <span className="font-semibold text-gray-800 dark:text-gray-200">{filtered.length}</span> colleges
            </p>

            {loading ? (
              <div className="text-center py-20 text-gray-400">Loading...</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <p className="text-lg font-semibold mb-2">No colleges found</p>
                <button onClick={clearAll} className="text-blue-600 text-sm underline">Clear filters</button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((college) => {
                  const img = LOCAL_IMAGES[college.slug];
                  return (
                    <div
                      key={college.slug}
                      onClick={() => navigate(`/college/${college.slug}`)}
                      className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden
                                 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                    >
                      <div className="h-40 w-full overflow-hidden relative">
                        {img ? (
                          <img
                            src={img}
                            alt={college.short_name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                            <span className="text-white text-5xl font-black opacity-60 select-none">
                              {college.short_name?.charAt(0)}
                            </span>
                          </div>
                        )}
                        {college.nirf_ranking && (
                          <span className="absolute top-2 left-2 flex items-center gap-1 text-xs bg-white/90 dark:bg-gray-900/90 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-full font-semibold shadow-sm">
                            <Award className="w-3 h-3" /> #{college.nirf_ranking} in India
                          </span>
                        )}
                      </div>

                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColor[college.category] || "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"}`}>
                            {college.category}
                          </span>
                          <div className="flex items-center gap-1 text-amber-500">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{college.rating}</span>
                          </div>
                        </div>

                        <h3 className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-0.5">
                          {college.short_name}
                        </h3>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mb-2 line-clamp-1">{college.name}</p>

                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-2">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {college.location}
                          </span>
                          <span className={`px-2 py-0.5 rounded font-medium ${college.type === "Government" ? "bg-green-50 dark:bg-green-900/20 text-green-600" : "bg-orange-50 dark:bg-orange-900/20 text-orange-600"}`}>
                            {college.type}
                          </span>
                        </div>

                        {college.naac_grade && (
                          <span className="text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 px-2 py-1 rounded-full font-semibold mr-2">
                            NAAC {college.naac_grade}
                          </span>
                        )}

                        <div className="flex items-center gap-1 mt-2 mb-3 flex-wrap">
                          <BookOpen className="w-3 h-3 text-gray-400" />
                          {college.courses.slice(0, 3).map((c, i) => (
                            <span key={i} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded">{c}</span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                          <div>
                            <p className="text-xs text-gray-400 dark:text-gray-500">Fees Range</p>
                            <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{college.fees_range}</p>
                          </div>
                          <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold group-hover:underline">
                            View Details →
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllColleges;