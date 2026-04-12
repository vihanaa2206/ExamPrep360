import { useState, useEffect } from "react";
import { MapPin, Star, ArrowRight, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

import collegeIITDelhi  from "../assets/college-iit-delhi.jpg";
import collegeIITBombay from "../assets/college-iit-bombay.jpg";
import collegeAIIMS     from "../assets/college-aiims.jpg";
import collegeIIM       from "../assets/college-iim.jpg";

const LOCAL_IMAGES = {
  "iit-delhi":     collegeIITDelhi,
  "iit-bombay":    collegeIITBombay,
  "aiims-delhi":   collegeAIIMS,
  "iim-ahmedabad": collegeIIM,
};

// Category-wise gradient for colleges without local images
const CAT_GRADIENT = {
  "Engineering":        "from-blue-500 to-indigo-600",
  "Medical":            "from-green-500 to-teal-600",
  "Management":         "from-purple-500 to-violet-600",
  "Law":                "from-amber-500 to-orange-600",
  "Computer Science":   "from-cyan-500 to-blue-600",
  "Government":         "from-red-500 to-rose-600",
};

const categoryBadgeColor = {
  Engineering:        "bg-blue-100 text-blue-700",
  Medical:            "bg-green-100 text-green-700",
  Management:         "bg-purple-100 text-purple-700",
  Law:                "bg-amber-100 text-amber-700",
  "Computer Science": "bg-cyan-100 text-cyan-700",
  Government:         "bg-red-100 text-red-700",
};

const TopColleges = () => {
  const [colleges, setColleges] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/colleges")
      .then((r) => r.json())
      .then((data) => setColleges(data.slice(0, 4)))
      .catch(() => {
        setColleges([
          { slug: "iit-bombay",    short_name: "IIT Bombay",    name: "Indian Institute of Technology Bombay",    location: "Powai, Mumbai, Maharashtra", type: "Government", category: "Engineering", rating: 4.9, nirf_ranking: 3,  naac_grade: "A++", courses: ["B.Tech", "M.Tech", "MBA (SJMSOM)"], fees_range: "₹2.2L – ₹4L/year" },
          { slug: "iit-delhi",     short_name: "IIT Delhi",     name: "Indian Institute of Technology Delhi",     location: "Hauz Khas, New Delhi — 110016", type: "Government", category: "Engineering", rating: 4.9, nirf_ranking: 2,  naac_grade: "A++", courses: ["B.Tech", "M.Tech", "MBA"], fees_range: "₹2.2L – ₹4L/year" },
          { slug: "nit-trichy",    short_name: "NIT Trichy",    name: "National Institute of Technology Tiruchirappalli", location: "Tiruchirappalli, Tamil Nadu — 620015", type: "Government", category: "Engineering", rating: 4.7, nirf_ranking: 8,  naac_grade: "A++", courses: ["B.Tech", "M.Tech", "MBA"], fees_range: "₹1.5L – ₹3L/year" },
          { slug: "bits-pilani",   short_name: "BITS Pilani",   name: "Birla Institute of Technology and Science Pilani", location: "Vidya Vihar, Pilani, Rajasthan — 333031", type: "Private", category: "Engineering", rating: 4.6, nirf_ranking: 25, naac_grade: "A",   courses: ["B.E.", "B.Pharm", "M.E."], fees_range: "₹4.5L – ₹6L/year" },
        ]);
      });
  }, []);

  return (
    <section className="py-14 bg-gray-100">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Top Colleges</h2>
          <button
            onClick={() => navigate("/colleges")}
            className="flex items-center gap-2 text-blue-600 font-medium hover:gap-3 transition-all text-sm"
          >
            View All Colleges <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 2-column grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {colleges.map((college) => {
            const localImg = LOCAL_IMAGES[college.slug];
            const grad     = CAT_GRADIENT[college.category] || "from-blue-500 to-indigo-600";

            return (
              <div
                key={college.slug}
                onClick={() => navigate(`/college/${college.slug}`)}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-200
                           cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="flex">

                  {/* ── IMAGE ── */}
                  <div className="w-36 h-36 md:w-44 md:h-44 flex-shrink-0 relative overflow-hidden">

                    {/* Ranking badge */}
                    <div className="absolute top-2 left-2 z-10 bg-white/90 backdrop-blur-sm
                                    text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full shadow">
                      #{college.nirf_ranking} in India
                    </div>

                    {localImg ? (
                      <img
                        src={localImg}
                        alt={college.short_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      /* Gradient placeholder with college initial */
                      <div className={`w-full h-full bg-gradient-to-br ${grad}
                                      flex items-center justify-center`}>
                        <span className="text-white text-5xl font-black opacity-80">
                          {college.short_name?.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* ── CONTENT ── */}
                  <div className="flex-1 p-4 md:p-5">

                    {/* Name + Rating */}
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                          {college.short_name}
                        </h3>
                        <p className="text-xs text-gray-400 line-clamp-1">{college.name}</p>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500 flex-shrink-0 ml-2">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-semibold text-gray-700">{college.rating}</span>
                      </div>
                    </div>

                    {/* Location + Type */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2 mt-2">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="text-xs">{college.location}</span>
                      <span className="text-gray-300">•</span>
                      <span className={`text-xs font-semibold ${
                        college.type === "Government" ? "text-green-600" : "text-orange-600"
                      }`}>
                        {college.type}
                      </span>
                    </div>

                    {/* Badges */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
                        ${categoryBadgeColor[college.category] || "bg-gray-100 text-gray-700"}`}>
                        {college.category}
                      </span>
                      {college.naac_grade && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-semibold">
                          NAAC {college.naac_grade}
                        </span>
                      )}
                    </div>

                    {/* Courses */}
                    <div className="text-xs text-gray-500 mb-3">
                      {college.courses?.slice(0, 3).join(", ")}
                    </div>

                    {/* Fees + CTA */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <span className="text-sm font-bold text-gray-900">{college.fees_range}</span>
                      <span className="text-sm text-blue-600 group-hover:underline font-medium">
                        View Details
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TopColleges;