import { Calendar, Clock, ArrowRight, Star } from "lucide-react";

const FeaturedExams = () => {
  const exams = [
    {
      name: "JEE Main 2024",
      category: "Engineering",
      date: "January 24 - February 1, 2024",
      registrations: "Open",
      level: "National",
      rating: 4.8,
    },
    {
      name: "NEET UG 2024",
      category: "Medical",
      date: "May 5, 2024",
      registrations: "Opening Soon",
      level: "National",
      rating: 4.9,
    },
    {
      name: "CAT 2024",
      category: "Management",
      date: "November 24, 2024",
      registrations: "Opening Soon",
      level: "National",
      rating: 4.7,
    },
    {
      name: "GATE 2024",
      category: "Engineering",
      date: "February 3–11, 2024",
      registrations: "Closed",
      level: "National",
      rating: 4.8,
    },
    {
      name: "CUET UG 2024",
      category: "Undergraduate",
      date: "May 15–31, 2024",
      registrations: "Open",
      level: "National",
      rating: 4.6,
    },
    {
      name: "CLAT 2024",
      category: "Law",
      date: "December 3, 2024",
      registrations: "Open",
      level: "National",
      rating: 4.5,
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
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Featured Exams
            </h2>
            <p className="text-gray-600">
              Stay updated with upcoming competitive examinations
            </p>
          </div>

          <button className="hidden md:flex items-center gap-2 text-blue-600 font-medium hover:gap-3 transition-all">
            View All Exams <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              {/* Top */}
              <div className="flex items-start justify-between mb-4">
                <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-600 rounded-full">
                  {exam.category}
                </span>

                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-amber-500" />
                  <span className="text-sm font-medium">{exam.rating}</span>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                {exam.name}
              </h3>

              {/* Details */}
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

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                    exam.registrations
                  )}`}
                >
                  {exam.registrations}
                </span>

                <button className="text-sm font-medium text-blue-600 hover:underline">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Button */}
        <div className="mt-8 text-center md:hidden">
          <button className="inline-flex items-center gap-2 text-blue-600 font-medium">
            View All Exams <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};

export default FeaturedExams;
