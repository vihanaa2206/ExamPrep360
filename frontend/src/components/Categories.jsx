import { Link } from "react-router-dom";
import { 
  GraduationCap, 
  Stethoscope, 
  Briefcase, 
  Code, 
  Scale, 
  Building2,
  PenTool,
  Plane
} from "lucide-react";

const Categories = () => {
  const categories = [
    {
      icon: GraduationCap,
      label: "Engineering",
      slug: "engineering",
      count: "9 Top Exams", // Updated as per your 9 cards requirement
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: Stethoscope,
      label: "Medical",
      slug: "medical",
      count: "80+ Exams",
      color: "bg-red-50 text-red-600",
    },
    {
      icon: Briefcase,
      label: "Management",
      slug: "management",
      count: "120+ Exams",
      color: "bg-purple-50 text-purple-600",
    },
    {
      icon: Code,
      label: "Computer Science",
      slug: "computer-science",
      count: "90+ Exams",
      color: "bg-green-50 text-green-600",
    },
    {
      icon: Scale,
      label: "Law",
      slug: "law",
      count: "45+ Exams",
      color: "bg-amber-50 text-amber-600",
    },
    {
      icon: Building2,
      label: "Commerce",
      slug: "commerce",
      count: "60+ Exams",
      color: "bg-cyan-50 text-cyan-600",
    },
    {
      icon: PenTool,
      label: "Design",
      slug: "design",
      count: "35+ Exams",
      color: "bg-pink-50 text-pink-600",
    },
    {
      icon: Plane,
      label: "Study Abroad",
      slug: "study-abroad",
      count: "25+ Exams",
      color: "bg-indigo-50 text-indigo-600",
    },
  ];

  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explore by Category
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover verified competitive exams and colleges for your career [cite: 61]
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={`/category/${category.slug}`}
              className="block"
            >
              <div className="bg-white rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg shadow-sm">
                
                <div
                  className={`w-14 h-14 rounded-xl ${category.color} flex items-center justify-center mb-4`}
                >
                  <category.icon className="w-7 h-7" />
                </div>

                <h3 className="font-semibold text-gray-900 mb-1">
                  {category.label}
                </h3>
                <p className="text-sm text-gray-600">
                  {category.count}
                </p>

              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Categories;