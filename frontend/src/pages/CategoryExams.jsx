import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

const CATEGORY_EXAMS = {
  // Only these 9 Engineering Exams will be shown
  engineering: [
    { name: "JEE Main", slug: "jee-main", date: "Jan & Apr 2026", level: "National", rating: 4.8, status: "Open" },
    { name: "JEE Advanced", slug: "jee-advanced", date: "June 2026", level: "National", rating: 4.7, status: "Upcoming" },
    { name: "BITSAT", slug: "bitsat", date: "May 2026", level: "National", rating: 4.6, status: "Upcoming" },
    { name: "VITEEE", slug: "viteee", date: "April 2026", level: "University", rating: 4.5, status: "Upcoming" },
    { name: "SRMJEEE", slug: "srmjeee", date: "April 2026", level: "University", rating: 4.4, status: "Upcoming" },
    { name: "COMEDK UGET", slug: "comedk", date: "May 2026", level: "State", rating: 4.3, status: "Upcoming" },
    { name: "WBJEE", slug: "wbjee", date: "April 2026", level: "State", rating: 4.2, status: "Upcoming" },
    { name: "MHT CET", slug: "mht-cet", date: "May 2026", level: "State", rating: 4.4, status: "Upcoming" },
    { name: "KCET", slug: "kcet", date: "April 2026", level: "State", rating: 4.3, status: "Upcoming" },
  ],

  medical: [
    { name: "NEET UG", slug: "neet-ug", date: "May 2026", level: "National", rating: 4.9, status: "Upcoming" },
    { name: "NEET PG", slug: "neet-pg", date: "Jan 2026", level: "National", rating: 4.8, status: "Upcoming" },
  ],

  management: [
    { name: "CAT", slug: "cat", date: "Nov 2026", level: "National", rating: 4.9, status: "Upcoming" },
    { name: "XAT", slug: "xat", date: "Jan 2026", level: "National", rating: 4.7, status: "Upcoming" },
  ],

  "computer-science": [
    { name: "GATE CS", slug: "gate-cs", date: "Feb 2026", level: "National", rating: 4.8, status: "Upcoming" },
    { name: "NIMCET", slug: "nimcet", date: "June 2026", level: "National", rating: 4.6, status: "Upcoming" },
  ],

  law: [
    { name: "CLAT", slug: "clat", date: "Dec 2026", level: "National", rating: 4.8, status: "Upcoming" },
  ],

  commerce: [
    { name: "CA Foundation", slug: "ca-foundation", date: "June 2026", level: "National", rating: 4.7, status: "Upcoming" },
  ],

  design: [
    { name: "NIFT Entrance", slug: "nift", date: "Feb 2026", level: "National", rating: 4.8, status: "Upcoming" },
  ],

  "study-abroad": [
    { name: "IELTS", slug: "ielts", date: "All Year", level: "International", rating: 4.8, status: "Open" },
  ],
};

function CategoryExams() {
  const { category } = useParams();
  const exams = CATEGORY_EXAMS[category] || [];

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Dynamic Heading based on Category */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 capitalize mb-2">
            {category} Exams
          </h1>
          <div className="h-1 w-20 bg-blue-600 rounded"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {exams.map((exam) => (
            <div
              key={exam.slug}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] uppercase tracking-wider bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-bold">
                  {category}
                </span>
                <div className="flex items-center text-amber-500 font-bold">
                  <span className="text-sm">⭐ {exam.rating}</span>
                </div>
              </div>

              <h2 className="text-xl font-bold text-gray-800 mb-4">{exam.name}</h2>

              <div className="space-y-2 mb-6">
                <div className="flex items-center text-gray-600 text-sm">
                  <span className="mr-2">📅</span> {exam.date}
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <span className="mr-2">🌐</span> {exam.level}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${
                  exam.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {exam.status}
                </span>

                <Link
                  to={`/exam/${exam.slug}`}
                  className="text-blue-600 text-sm font-bold flex items-center hover:text-blue-800 transition"
                >
                  View Details
                  <span className="ml-1 text-lg">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {exams.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl shadow-inner">
            <p className="text-gray-500 text-lg">No exams found for this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryExams;