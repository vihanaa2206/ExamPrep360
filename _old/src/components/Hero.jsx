import { Search, Play } from "lucide-react";
import heroStudents from "../assets/hero-students.jpg";

const Hero = () => {
  const popularTools = [
  { label: "Free Mock Tests", badge: "NEW", color: "bg-orange-500" },
  { label: "Previous Year Papers", badge: "POPULAR", color: "bg-blue-500" },
];


  return (
    <section className="bg-gradient-to-b from-sky-50 to-white py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-8">
              Empowering Students.
              <span className="block">Building Futures.</span>
            </h1>

            {/* Search Box */}
            <div className="relative mb-8">
              <input
                type="text"
                placeholder="Search Colleges, Exams, Courses & more"
                className="w-full px-5 py-4 pr-12 text-foreground placeholder:text-muted-foreground bg-white border border-border rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-primary hover:text-primary/80 transition-colors">
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Popular Tools */}
            <div className="flex flex-wrap gap-4">
              {popularTools.map((tool, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 px-4 py-3 bg-white border border-border rounded-lg cursor-pointer hover:border-primary/30 hover:shadow-md transition-all"
                >
                  <span className={`px-2 py-0.5 text-xs font-bold text-white rounded ${tool.color}`}>
                     {tool.badge}
                  </span>

                  <span className="text-sm font-medium text-foreground">{tool.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Promo Banner */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500">
              {/* Background Image */}
              <div className="absolute inset-0">
                <img 
                  src={heroStudents} 
                  alt="Students learning" 
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 via-purple-800/60 to-transparent" />
              </div>

              {/* Content */}
              <div className="relative p-8 min-h-[320px] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-white/80 text-sm font-medium tracking-wide">STREAMING NOW</span>
                    <div className="h-4 w-px bg-white/40" />
                    <span className="text-white font-bold">ExamPrep360</span>
                  </div>
                  
                  <div className="mb-6">
                    <span className="text-white/60 text-sm tracking-wider">THE INDIAN</span>
                    <h3 className="text-3xl font-black text-white tracking-tight">
                      EDTECH<br />STORY
                    </h3>
                  </div>

                  <h4 className="text-xl font-bold text-white mb-2">
                    Every Student Matters: <span className="font-normal">Driving the Future of Education</span>
                  </h4>
                  <p className="text-white/70 text-sm max-w-sm">
                    Watch how we underline the importance of informed choices that help shape academic and career success.
                  </p>
                </div>

                <button className="mt-6 inline-flex items-center gap-3 px-6 py-3 bg-white text-foreground font-semibold rounded-full hover:bg-white/90 transition-colors w-fit shadow-lg">
                  <Play className="w-5 h-5 fill-current" />
                  <span>Play</span>
                  <span className="text-muted-foreground">S2 E4</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
