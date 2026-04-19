import { useState, useEffect } from "react";
import { Clock, ArrowRight, ChevronRight, Building2, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

import newsExam    from "../assets/news-exam.jpg";
import newsSchool  from "../assets/news-school.jpg";
import newsBanking from "../assets/news-banking.jpg";

const FALLBACK_IMAGES = [newsExam, newsSchool, newsBanking];

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

const NewsSection = () => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://examprep360-production.up.railway.app/api/notifications")
      .then((r) => r.json())
      .then((data) => {
        // Show mix: 2 is_new exam + 1 is_new college on homepage
        const newOnes = data.filter((n) => n.is_new).slice(0, 3);
        setNotifications(newOnes.length >= 3 ? newOnes : data.slice(0, 3));
      })
      .catch(() => setNotifications([]));
  }, []);

  return (
    <section className="py-14 bg-gray-100">
      <div className="container mx-auto px-4">

        {/* Heading */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Latest News and Notifications
          </h2>
          <button
            onClick={() => navigate("/notifications")}
            className="flex items-center gap-2 text-blue-600 font-medium hover:gap-3 transition-all"
          >
            View All <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="relative">
          <div className="grid md:grid-cols-3 gap-6">
            {notifications.map((item, index) => (
              <div
                key={item.id}
                onClick={() => window.open(item.official_link, "_blank", "noopener,noreferrer")}
                className="bg-white rounded-xl p-4 flex gap-4 border border-gray-200
                           hover:shadow-lg hover:-translate-y-1 transition-all duration-300
                           cursor-pointer group"
              >
                {/* Thumbnail */}
                <div className="w-24 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                  <img
                    src={FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">

                    {/* NEW badge */}
                    {item.is_new && (
                      <span className="flex items-center gap-1 text-xs font-medium text-red-500">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        Live
                      </span>
                    )}

                    {/* Update type badge */}
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${UPDATE_TYPE_COLORS[item.update_type] || "bg-gray-100 text-gray-700"}`}>
                      {item.update_type}
                    </span>
                  </div>

                  {/* Exam or College name */}
                  <div className="flex items-center gap-1 mb-1">
                    {item.type === "college" ? (
                      <span className="flex items-center gap-1 text-xs font-semibold text-teal-600">
                        <Building2 className="w-3 h-3" /> {item.college_name}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-semibold text-blue-600">
                        <BookOpen className="w-3 h-3" /> {item.exam_name}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600
                                 transition-colors line-clamp-2 mb-1">
                    {item.title}
                  </h3>

                  {/* Date */}
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />{item.date}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={() => navigate("/notifications")}
            className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10
                       bg-white border border-gray-300 rounded-full shadow
                       flex items-center justify-center hover:bg-gray-100 transition"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
