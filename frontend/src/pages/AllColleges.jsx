import { useState, useEffect } from "react";
import { MapPin, Star, Award, BookOpen, SlidersHorizontal, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CATEGORIES  = ["Engineering", "Medical", "Management", "Law", "Computer Science", "Government"];
const TYPES       = ["Government", "Private"];
const COURSES_MAP = ["B.Tech", "MBBS", "MBA", "LLB", "M.Tech", "PhD", "B.E."];
const EXAMS_MAP   = [
  { slug: "jee-main",    label: "JEE Main" },
  { slug: "jee-advanced",label: "JEE Advanced" },
  { slug: "neet-ug",     label: "NEET UG" },
  { slug: "cat",         label: "CAT" },
  { slug: "clat",        label: "CLAT" },
  { slug: "gate-cs",     label: "GATE CS" },
  { slug: "upsc",        label: "UPSC" },
];

const categoryColor = {
  Engineering:      "bg-blue-100 text-blue-700",
  Medical:          "bg-green-100 text-green-700",
  Management:       "bg-purple-100 text-purple-700",
  Law:              "bg-amber-100 text-amber-700",
  "Computer Science": "bg-cyan-100 text-cyan-700",
  Government:       "bg-red-100 text-red-700",
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

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/colleges")
      .then((r) => r.json())
      .then((data) => { setColleges(data); setFiltered(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

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

  const FilterPanel = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-800">Filters</h3>
        {activeCount > 0 && (
          <button onClick={clearAll} className="text-xs text-red-500 hover:underline">
            Clear all ({activeCount})
          </button>
        )}
      </div>

      {/* Category */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Category</p>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio" name="category"
                checked={filters.category === cat}
                onChange={() => setFilters((f) => ({ ...f, category: f.category === cat ? "" : cat }))}
                className="accent-blue-600"
              />
              <span className="text-sm text-gray-700">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Type */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">College Type</p>
        <div className="space-y-1">
          {TYPES.map((t) => (
            <label key={t} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio" name="type"
                checked={filters.type === t}
                onChange={() => setFilters((f) => ({ ...f, type: f.type === t ? "" : t }))}
                className="accent-blue-600"
              />
              <span className="text-sm text-gray-700">{t}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Exam */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Exam Accepted</p>
        <div className="space-y-1">
          {EXAMS_MAP.map((ex) => (
            <label key={ex.slug} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio" name="exam"
                checked={filters.exam === ex.slug}
                onChange={() => setFilters((f) => ({ ...f, exam: f.exam === ex.slug ? "" : ex.slug }))}
                className="accent-blue-600"
              />
              <span className="text-sm text-gray-700">{ex.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Course */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Course</p>
        <div className="space-y-1">
          {COURSES_MAP.map((co) => (
            <label key={co} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio" name="course"
                checked={filters.course === co}
                onChange={() => setFilters((f) => ({ ...f, course: f.course === co ? "" : co }))}
                className="accent-blue-600"
              />
              <span className="text-sm text-gray-700">{co}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-1">Top Colleges in India</h1>
          <p className="text-blue-100 text-sm">
            Explore {colleges.length}+ premier institutions across Engineering, Medical, Management, Law & more
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Active filters */}
        {activeCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.entries(filters).map(([key, val]) =>
              val ? (
                <span key={key} className="flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full">
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
          {/* Sidebar — desktop */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-2xl p-5 sticky top-24">
              <FilterPanel />
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 mb-4 text-sm font-medium bg-white border border-gray-200 rounded-xl px-4 py-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters {activeCount > 0 && `(${activeCount})`}
            </button>

            {showFilters && (
              <div className="lg:hidden bg-white border border-gray-200 rounded-2xl p-5 mb-4">
                <FilterPanel />
              </div>
            )}

            {/* Results count */}
            <p className="text-sm text-gray-500 mb-4">
              Showing <span className="font-semibold text-gray-800">{filtered.length}</span> colleges
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
                {filtered.map((college) => (
                  <div
                    key={college.slug}
                    onClick={() => navigate(`/college/${college.slug}`)}
                    className="group bg-white border border-gray-200 rounded-2xl overflow-hidden
                               hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                  >
                    <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600" />
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColor[college.category] || "bg-gray-100 text-gray-700"}`}>
                          {college.category}
                        </span>
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="text-xs font-bold text-gray-700">{college.rating}</span>
                        </div>
                      </div>

                      <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                        {college.short_name}
                      </h3>
                      <p className="text-xs text-gray-400 mb-3 line-clamp-1">{college.name}</p>

                      <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {college.location}
                        </span>
                        <span className={`px-2 py-0.5 rounded font-medium ${college.type === "Government" ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"}`}>
                          {college.type}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        {college.nirf_ranking && (
                          <span className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-semibold">
                            <Award className="w-3 h-3" /> NIRF #{college.nirf_ranking}
                          </span>
                        )}
                        {college.naac_grade && (
                          <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full font-semibold">
                            NAAC {college.naac_grade}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 mb-4 flex-wrap">
                        <BookOpen className="w-3 h-3 text-gray-400" />
                        {college.courses.slice(0, 3).map((c, i) => (
                          <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{c}</span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div>
                          <p className="text-xs text-gray-400">Fees Range</p>
                          <p className="text-sm font-bold text-gray-800">{college.fees_range}</p>
                        </div>
                        <span className="text-xs text-blue-600 font-semibold group-hover:underline">
                          View Details →
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

export default AllColleges;