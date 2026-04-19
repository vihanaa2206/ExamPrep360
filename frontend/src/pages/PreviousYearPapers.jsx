import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Search, BookOpen } from 'lucide-react';
import SidebarFilters from '../components/SidebarFilters';

const API = "https://examprep360-production.up.railway.app/api";

const CATEGORY_MAP = {
  "COMEDK UGET":        "Engineering",
  "Jee Advanced":       "Engineering",
  "Jee Main":           "Engineering",
  "Jee Main With Solutions": "Engineering",
  "KCET":               "Engineering",
  "MHT CET":            "Engineering",
  "SRMJEEE":            "Engineering",
  "VITEEE":             "Engineering",
  "WBJEE":              "Engineering",
  "NEET UG":            "Medical",
  "NEET PG":            "Medical",
  "JIPMER":             "Medical",
  "AFMC":               "Medical",
  "GATE CS":            "Computer Science",
  "NIMCET":             "Computer Science",
  "CUET PG":            "Computer Science",
  "IIT JAM":            "Computer Science",
  "TANCET":             "Computer Science",
  "CLAT":               "Law",
  "AILET":              "Law",
  "DU LLB":             "Law",
  "AP LAWCET":          "Law",
  "CAT":                "Management",
  "CMAT":               "Management",
  "MAT":                "Management",
  "NMAT":               "Management",
  "XAT":                "Management",
  "IBPS PO":            "Government Exams",
  "RRB NTPC":           "Government Exams",
  "SSC CGL":            "Government Exams",
  "UPSC CSE":           "Government Exams",
};

const PreviousYearPapers = () => {
  const [exams, setExams]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("All");
  const [search, setSearch]   = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API}/pyq/exams`)
      .then(r => r.json())
      .then(data => { setExams(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = exams.filter(exam => {
    const cat = CATEGORY_MAP[exam] || "Other";
    const matchFilter = filter === "All" || cat === filter;
    const matchSearch = exam.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="flex bg-gradient-to-br from-blue-50/50 to-white min-h-screen">
      <SidebarFilters setFilter={setFilter} activeFilter={filter} />

      <main className="flex-1 p-8 ml-4">

        {/* Header */}
        <div className="mb-8 p-8 bg-white rounded-3xl shadow-sm border border-blue-100">
          <div className="flex items-center gap-4 mb-4">
            <FileText className="w-10 h-10 text-blue-600" />
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                Previous Year Papers
              </h1>
              <p className="text-gray-500 font-medium mt-1">
                Download official question papers · Showing:{" "}
                <span className="text-blue-600 font-bold">{filter}</span>
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-3 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search exam..."
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200
                         rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl p-8 border border-gray-100 animate-pulse">
                <div className="w-14 h-14 bg-gray-200 rounded-2xl mb-4" />
                <div className="h-5 bg-gray-200 rounded w-2/3 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-xl font-bold text-gray-500">No exams found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((exam) => (
              <div
                key={exam}
                onClick={() => navigate(`/pyp-list/${encodeURIComponent(exam)}`)}
                className="p-8 bg-white rounded-3xl shadow-sm border border-gray-100 group
                           cursor-pointer hover:border-blue-500 hover:shadow-2xl
                           hover:-translate-y-2 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center
                                mb-5 group-hover:bg-blue-600 transition-colors">
                  <span className="font-black text-2xl text-blue-600 group-hover:text-white">
                    {exam.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">{exam}</h3>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-5">
                  {CATEGORY_MAP[exam] || "Other"}
                </p>
                <div className="flex items-center text-blue-600 font-bold text-sm">
                  View All Papers
                  <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default PreviousYearPapers;