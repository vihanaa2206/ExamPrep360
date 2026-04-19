import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Calendar, Globe, Star, Lock } from "lucide-react";

const CATEGORY_MAP = {
  "engineering":      "Engineering",
  "medical":          "Medical",
  "computer-science": "Computer Science",
  "law":              "Law",
  "management":       "Management",
  "government":       "Government",
  "government-exam":  "Government",
};

const STATUS_COLORS = {
  Open:     "bg-green-100 text-green-700",
  Upcoming: "bg-blue-100 text-blue-700",
  Closed:   "bg-red-100 text-red-600",
};

function CategoryExams() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [exams, setExams]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);

  const isLoggedIn = !!localStorage.getItem("user");

  const normalized = category
    ?.toLowerCase()
    ?.replace("exams", "")
    ?.replace("exam", "")
    ?.replace(/-$/, "");

  const categoryName = CATEGORY_MAP[normalized] || "";

  useEffect(() => {
    if (!categoryName) { setLoading(false); return; }
    setLoading(true);
    setError(false);

    fetch(`http://127.0.0.1:5000/api/exams?category=${encodeURIComponent(categoryName)}`)
      .then(r => {
        if (!r.ok) throw new Error("fetch failed");
        return r.json();
      })
      .then(data => {
        const mapped = (data || []).map(e => ({
          name:   e.name,
          slug:   e.slug,
          date:   e.exam_date || e.date || "2026",
          level:  e.level  || "National",
          status: e.status || "Upcoming",
          category: e.category || categoryName,
        }));
        setExams(mapped);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [categoryName]);

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">

        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 capitalize mb-2">
            {categoryName} Exams
          </h1>
          <div className="h-1 w-20 bg-blue-600 rounded" />
          {!loading && (
            <p className="text-gray-500 mt-2 text-sm">{exams.length} exams found</p>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
                <div className="h-6 bg-gray-200 rounded w-2/3 mb-4" />
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-inner">
            <p className="text-red-500 text-lg font-semibold">Failed to load exams.</p>
            <p className="text-gray-400 text-sm mt-1">Please check your connection and try again.</p>
          </div>
        ) : exams.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {exams.map((exam, index) => {
                const isLocked = index !== 0 && !isLoggedIn;

                if (isLocked) {
                  return (
                    <div
                      key={exam.slug}
                      onClick={() => navigate("/login")}
                      className="relative bg-white rounded-xl border border-gray-200 p-6 shadow-sm cursor-pointer overflow-hidden"
                    >
                      {/* Blurred content behind */}
                      <div className="filter blur-sm select-none pointer-events-none">
                        <div className="flex justify-between items-start mb-4">
                          <span className="text-[10px] uppercase tracking-wider bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-bold">
                            {exam.category}
                          </span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-4">{exam.name}</h2>
                        <div className="space-y-2 mb-6">
                          <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <Calendar className="w-4 h-4 text-gray-400" /> {exam.date}
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <Globe className="w-4 h-4 text-gray-400" /> {exam.level}
                          </div>
                        </div>
                      </div>

                      {/* Lock overlay */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-[1px] gap-3">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center shadow">
                          <Lock className="w-6 h-6 text-blue-500" />
                        </div>
                        <p className="text-sm font-bold text-gray-700">Login to View</p>
                        <button className="px-4 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-full hover:bg-blue-700 transition">
                          Login / Register
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={exam.slug}
                    className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] uppercase tracking-wider bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-bold">
                        {exam.category}
                      </span>
                      <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                        <Star className="w-3.5 h-3.5 fill-amber-500" /> {exam.rating}
                      </div>
                    </div>

                    <h2 className="text-xl font-bold text-gray-800 mb-4">{exam.name}</h2>

                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" /> {exam.date}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Globe className="w-4 h-4 text-gray-400" /> {exam.level}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${STATUS_COLORS[exam.status] || "bg-gray-100 text-gray-600"}`}>
                        {exam.status}
                      </span>
                      <Link
                        to={`/exam/${exam.slug}`}
                        className="text-blue-600 text-sm font-bold hover:text-blue-800 transition"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Banner below if not logged in and more than 1 exam */}
            {!isLoggedIn && exams.length > 1 && (
              <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white text-center">
                <h3 className="text-xl font-bold mb-2">
                  {exams.length - 1} more exam{exams.length - 1 > 1 ? "s" : ""} hidden
                </h3>
                <p className="text-blue-100 text-sm mb-4">
                  Register free to access all {exams.length} exams, full details, previous year papers & more.
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => navigate("/register")}
                    className="px-6 py-2 bg-white text-blue-600 font-bold rounded-full text-sm hover:bg-blue-50 transition"
                  >
                    Register Free
                  </button>
                  <button
                    onClick={() => navigate("/login")}
                    className="px-6 py-2 border border-white/50 text-white font-semibold rounded-full text-sm hover:bg-white/10 transition"
                  >
                    Login
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-inner">
            <p className="text-gray-500 text-lg">No exams found for this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryExams;