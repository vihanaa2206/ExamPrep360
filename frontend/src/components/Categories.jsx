import { Link } from "react-router-dom";
import { 
  GraduationCap, 
  Stethoscope, 
  Briefcase, 
  Code, 
  Scale, 
  Building2 
} from "lucide-react";

const Categories = () => {
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

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Heading Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explore by Category
          </h2>
          <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full mb-6"></div> {/* Added accent line */}
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover exams and colleges across various fields of study
          </p>
        </div>

        {/* Standard Grid Layout: 3 Columns on Desktop (3x2 Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={`/category/${category.slug}`}
              className="block group"
            >
              <div className="bg-white rounded-3xl p-8 border border-gray-100 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:-translate-y-2">
                
                <div
                  className={`w-16 h-16 rounded-2xl ${category.color} flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}
                >
                  <category.icon className="w-8 h-8" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {category.label}
                </h3>
                <p className="text-gray-500 font-medium">
                  {category.count}
                </p>

                {/* Subtle arrow for extra 'Standard' feel */}
                <div className="mt-6 flex items-center text-blue-600 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore Now <span className="ml-2">→</span>
                </div>

              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Categories;