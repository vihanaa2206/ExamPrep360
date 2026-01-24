import { MapPin, Star, ArrowRight } from "lucide-react";
import collegeIITDelhi from "../assets/college-iit-delhi.jpg";
import collegeIITBombay from "../assets/college-iit-bombay.jpg";
import collegeAIIMS from "../assets/college-aiims.jpg";
import collegeIIM from "../assets/college-iim.jpg";

const TopColleges = () => {
  const colleges = [
    {
      shortName: "IIT Delhi",
      location: "New Delhi",
      rating: 4.9,
      ranking: "#1",
      type: "Government",
      courses: "B.Tech, M.Tech, PhD",
      fees: "₹2.2L - ₹4L/year",
      image: collegeIITDelhi,
    },
    {
      shortName: "IIT Bombay",
      location: "Mumbai",
      rating: 4.9,
      ranking: "#2",
      type: "Government",
      courses: "B.Tech, M.Tech, MBA",
      fees: "₹2.2L - ₹4L/year",
      image: collegeIITBombay,
    },
    {
      shortName: "AIIMS Delhi",
      location: "New Delhi",
      rating: 4.9,
      ranking: "#1",
      type: "Government",
      courses: "MBBS, MD, MS",
      fees: "₹1.6K/year",
      image: collegeAIIMS,
    },
    {
      shortName: "IIM Ahmedabad",
      location: "Ahmedabad",
      rating: 4.8,
      ranking: "#1",
      type: "Government",
      courses: "MBA, PGDM, PhD",
      fees: "₹23L/year",
      image: collegeIIM,
    },
  ];

  return (
    /* 👇 FORCE GREY BACKGROUND */
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Top Colleges
            </h2>
            <p className="text-gray-600">
              Discover India's premier educational institutions
            </p>
          </div>

          <button className="hidden md:flex items-center gap-2 text-blue-600 font-medium hover:gap-3 transition-all">
            View All Colleges <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {colleges.map((college, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl overflow-hidden
                         border border-gray-200 cursor-pointer
                         transition-all duration-300 ease-out
                         hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex">
                
                {/* Image */}
                <div className="w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
                  <img
                    src={college.image}
                    alt={college.shortName}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 p-4 md:p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="inline-block px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-600 rounded mb-1">
                        {college.ranking} in India
                      </span>
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {college.shortName}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium">{college.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <MapPin className="w-4 h-4" />
                    {college.location}
                    <span className="text-gray-300">•</span>
                    <span className="text-green-600 font-medium">
                      {college.type}
                    </span>
                  </div>

                  <div className="text-xs text-gray-600 mb-3">
                    {college.courses}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <span className="text-sm font-semibold text-gray-900">
                      {college.fees}
                    </span>
                    <button className="text-sm font-medium text-blue-600 hover:underline">
                      View Details
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <button className="inline-flex items-center gap-2 text-blue-600 font-medium">
            View All Colleges <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};

export default TopColleges;
