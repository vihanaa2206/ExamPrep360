import { Calendar, Clock, Star, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AllExamsPage = () => {
  const navigate = useNavigate();

  const allExams = [
    // Featured ones (already on home)
    {
      name: "JEE Main 2026",
      slug: "jee-main",
      category: "Engineering",
      date: "January 24 - February 1, 2026",
      registrations: "Open",
      level: "National",
    },
    {
      name: "NEET UG",
      slug: "neet-ug",
      category: "Medical",
      date: "May 5, 2026",
      registrations: "Opening Soon",
      level: "National",
    },
    {
      name: "CAT 2026",
      slug: "cat",
      category: "Management",
      date: "November 24, 2026",
      registrations: "Opening Soon",
      level: "National",
    },
    {
      name: "GATE CS",
      slug: "gate-cs",
      category: "Engineering",
      date: "February 3–11, 2026",
      registrations: "Closed",
      level: "National",
    },
    {
      name: "CUET PG 2026",
      slug: "cuet-pg",
      category: "Undergraduate",
      date: "May 15–31, 2026",
      registrations: "Open",
      level: "National",
    },
    {
      name: "CLAT 2026",
      slug: "clat",
      category: "Law",
      date: "December 3, 2026",
      registrations: "Open",
      level: "National",
    },
    // Extra exams (only visible on this page)
    {
      name: "JEE Advanced 2026",
      slug: "jee-advanced",
      category: "Engineering",
      date: "May 18, 2026",
      registrations: "Opening Soon",
      level: "National",
    },
    {
      name: "BITSAT 2026",
      slug: "bitsat",
      category: "Engineering",
      date: "May 21–30, 2026",
      registrations: "Opening Soon",
      level: "National",
    },
    
    {
      name: "NEET PG 2026",
      slug: "neet-pg",
      category: "Medical",
      date: "June 15, 2026",
      registrations: "Opening Soon",
      level: "National",
    },
    {
      name: "XAT 2026",
      slug: "xat",
      category: "Management",
      date: "January 5, 2026",
      registrations: "Closed",
      level: "National",
    },
    
    {
      name: "CUET UG 2026",
      slug: "cuet-ug",
      category: "Undergraduate",
      date: "May 8 – June 1, 2026",
      registrations: "Open",
      level: "National",
    },
    
   
    {
      name: "VITEEE 2026",
      slug: "viteee",
      category: "Engineering",
      date: "April 19–30, 2026",
      registrations: "Open",
      level: "National",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Open":
        return "bg-green-100 text-green-700";
      case "Opening Soon":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 text-gray-500 hover:text-blue-600 text-sm mb-3 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              All Exams
            </h1>
            <p className="text-gray-500 mt-1">
              {allExams.length} exams available across all categories
            </p>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allExams.map((exam, index) => (
            <div
              key={index}
              onClick={() => navigate(`/exam/${exam.slug}`)}
              className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-600 rounded-full">
                  {exam.category}
                </span>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-amber-500" />
                  <span className="text-sm font-medium">{exam.rating}</span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                {exam.name}
              </h3>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{exam.date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{exam.level} Level Exam</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(exam.registrations)}`}>
                  {exam.registrations}
                </span>
                <button className="text-sm font-medium text-blue-600 hover:underline">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AllExamsPage;