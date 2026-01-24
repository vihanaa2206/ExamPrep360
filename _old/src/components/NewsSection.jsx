import { Clock, ArrowRight, ChevronRight } from "lucide-react";
import newsExam from "../assets/news-exam.jpg";
import newsSchool from "../assets/news-school.jpg";
import newsBanking from "../assets/news-banking.jpg";

const NewsSection = () => {
  const news = [
    {
      category: "CBSE",
      title: "CBSE 2026 Admit Card LIVE: CBSE Class 10, 12 hall...",
      time: "January 20, 2026, 01:41 PM IST",
      live: true,
      image: newsExam,
    },
    {
      category: "State News",
      title: "TN Assembly: School breakfast, scholarships, SSA funds – spec...",
      time: "January 20, 2026, 01:37 PM IST",
      live: false,
      image: newsSchool,
    },
    {
      category: "Banking",
      title: "IBPS RRB Clerk Prelims Result 2025 LIVE: How to...",
      time: "January 20, 2026, 01:35 PM IST",
      live: true,
      image: newsBanking,
    },
  ];

  return (
    <section className="py-14 bg-gray-100">
      <div className="container mx-auto px-4">
        
        {/* Heading */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Latest News and Notifications
          </h2>
          <button className="flex items-center gap-2 text-blue-600 font-medium hover:gap-3 transition-all">
            View All <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="relative">
          <div className="grid md:grid-cols-3 gap-6">
            {news.map((item, index) => (
              
              /* 🔹 GRAY CARD */
              <div
                key={index}
                className="bg-white rounded-xl p-4 flex gap-4
                           border border-gray-200
                           hover:shadow-lg hover:-translate-y-1
                           transition-all duration-300 cursor-pointer group"
              >
                {/* Thumbnail */}
                <div className="w-24 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {item.live && (
                      <span className="flex items-center gap-1 text-xs font-medium text-red-500">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        Live
                      </span>
                    )}
                    <span className="text-sm font-medium text-gray-700">
                      {item.category}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">
                    {item.title}
                  </h3>

                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Next Button */}
          <button className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10
                             bg-white border border-gray-300 rounded-full shadow
                             flex items-center justify-center hover:bg-gray-100 transition">
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
