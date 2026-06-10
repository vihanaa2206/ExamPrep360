import { useNavigate } from "react-router-dom";
import {
  GraduationCap,
  Stethoscope,
  Briefcase,
  Code,
  Scale,
  Building2,
} from "lucide-react";

const Categories = () => {
  const navigate = useNavigate();

  const categories = [
    {
      icon: GraduationCap,
      label: "Engineering",
      slug: "engineering",
      count: "2+ Exams",
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: Stethoscope,
      label: "Medical",
      slug: "medical",
      count: "2+ Exams",
      color: "bg-red-50 text-red-600",
    },
    {
      icon: Code,
      label: "Computer Science",
      slug: "computer-science",
      count: "2+ Exams",
      color: "bg-green-50 text-green-600",
    },
    {
      icon: Scale,
      label: "LAW",
      slug: "law",
      count: "2+ Exams",
      color: "bg-amber-50 text-amber-600",
    },
    {
      icon: Briefcase,
      label: "Management",
      slug: "management",
      count: "2+ Exams",
      color: "bg-purple-50 text-purple-600",
    },
    {
      icon: Building2,
      label: "Government Exam",
      slug: "government-exam",
      count: "1+ Exams",
      color: "bg-indigo-50 text-indigo-600",
    },
  ];

  const handleCategoryClick = (index, slug) => {
    if (index === 0) {
      navigate(`/category/${slug}`);
      return;
    }
    const user = localStorage.getItem("user");
    if (user) {
      navigate(`/category/${slug}`);
    } else {
      navigate("/login");
    }
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explore by Category
          </h2>
          <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full mb-6"></div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover exams and colleges across various fields of study
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {categories.map((category, index) => {
            const isLocked = index !== 0 && !localStorage.getItem("user");
            return (
              <div
                key={index}
                onClick={() => handleCategoryClick(index, category.slug)}
                className="block group cursor-pointer relative"
              >
                <div className="bg-white rounded-3xl p-8 border border-gray-100 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:-translate-y-2 relative overflow-hidden">

                  {/* Lock overlay for non-first cards when not logged in */}
                  {isLocked && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] rounded-3xl z-10 flex flex-col items-center justify-center gap-2">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <span className="text-xs font-semibold text-gray-500">Login to Explore</span>
                    </div>
                  )}

                  <div
                    className={`w-16 h-16 rounded-2xl ${category.color} flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}
                  >
                    <category.icon className="w-8 h-8" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {category.label}
                  </h3>
                  <p className="text-gray-500 font-medium">{category.count}</p>

                  <div className="mt-6 flex items-center text-blue-600 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    {isLocked ? "Login Required" : "Explore Now"}{" "}
                    <span className="ml-2">→</span>
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

export default Categories;
