import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Star, Lock } from "lucide-react";

import collegeIITDelhi  from "../assets/college-iit-delhi.jpg";
import collegeIITBombay from "../assets/college-iit-bombay.jpg";
import collegeAIIMS     from "../assets/college-aiims.jpg";
import collegeIIM       from "../assets/college-iim.jpg";
import bitcblog1 from "../assets/bitcblog1.jpg";
import nitTrichyImg from "../assets/download.jpg";
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
  "vit-vellore":   collegeVIT,
  "jipmer-puducherry": collegejipmer,
  "iim-bangalore": collegeIIMBangalore,
  "nlsiu-bangalore": collegeNLSIU,
  "nlu-delhi": collegeNLU,
  "iisc-bangalore": collegeIISC,
  "iiit-hyderabad": collegeIIITHyderabad,
  "college-lbsnaa-mussoorie": collegeLbsna,
};

const categoryColor = {
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
  const isLoggedIn = !!localStorage.getItem("user");

  useEffect(() => {
    fetch("https://examprep360-production.up.railway.app/api/colleges")
      .then((r) => r.json())
      .then((data) => setColleges(data.slice(0, 4)))
      .catch(() => {});
  }, []);

  const handleViewAll = () => {
    isLoggedIn ? navigate("/colleges") : navigate("/login");
  };

  return (
    <section className="py-10 px-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Top Colleges</h2>
        <button
          onClick={handleViewAll}
          className="text-sm text-blue-600 font-semibold hover:underline flex items-center gap-1"
        >
          {!isLoggedIn && <Lock className="w-3 h-3" />}
          View All Colleges →
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {colleges.map((college) => {
          const img = LOCAL_IMAGES[college.slug];
          return (
            <div
              key={college.slug}
              onClick={() => navigate(`/college/${college.slug}`)}
              className="group flex bg-white border border-gray-200 rounded-2xl overflow-hidden
                         hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <div className="w-40 flex-shrink-0 relative overflow-hidden">
                {img ? (
                  <img src={img} alt={college.short_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-white text-4xl font-black opacity-60 select-none">{college.short_name?.charAt(0)}</span>
                  </div>
                )}
                {college.nirf_ranking && (
                  <span className="absolute top-2 left-2 text-xs bg-white/90 text-blue-700 px-2 py-0.5 rounded-full font-bold shadow-sm">
                    #{college.nirf_ranking} in India
                  </span>
                )}
              </div>

              <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${categoryColor[college.category] || "bg-gray-100 text-gray-700"}`}>
                      {college.category}
                    </span>
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="text-xs font-bold text-gray-700">{college.rating}</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors text-base mt-1 mb-0.5">{college.short_name}</h3>
                  <p className="text-xs text-gray-400 line-clamp-1 mb-2">{college.name}</p>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {college.location}</span>
                    <span className={`px-2 py-0.5 rounded font-medium ${college.type === "Government" ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"}`}>{college.type}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {college.naac_grade && (
                      <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-semibold">NAAC {college.naac_grade}</span>
                    )}
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{college.courses?.slice(0, 3).join(", ")}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-2">
                  <p className="text-sm font-bold text-gray-800">{college.fees_range}</p>
                  <span className="text-xs text-blue-600 font-semibold group-hover:underline">View Details →</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TopColleges;