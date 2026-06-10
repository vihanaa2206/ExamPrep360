import { Play, BookOpen, ClipboardList, Bell, CalendarDays } from "lucide-react";
import { useState } from "react";
import heroStudents from "../assets/hero-students.jpg";
import VideoModal from "./VideoModal";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  const [showVideo, setShowVideo] = useState(false);

  const tools = [
    {
      label: "Mock Tests",
      sub: "Practice & improve",
      badge: "NEW",
      badgeColor: "bg-orange-500",
      path: "/free-tests",
      iconBg: "from-orange-500 to-orange-400",
      cardBorder: "border-orange-200 hover:border-orange-400",
      Icon: ClipboardList,
    },
    {
      label: "Previous Year Papers",
      sub: "Solved PYQs",
      badge: "POPULAR",
      badgeColor: "bg-blue-500",
      path: "/previous-year-papers",
      iconBg: "from-blue-500 to-blue-400",
      cardBorder: "border-blue-200 hover:border-blue-400",
      Icon: BookOpen,
    },
    {
      label: "Exam Calendar",
      sub: "Upcoming dates",
      badge: null,
      path: "/resources/exam-calendar",
      iconBg: "from-violet-500 to-purple-400",
      cardBorder: "border-purple-200 hover:border-purple-400",
      Icon: CalendarDays,
      glassy: true,
    },
    {
      label: "Notifications",
      sub: "Live updates & news",
      badge: null,
      path: "/notifications",
      iconBg: "from-green-500 to-emerald-400",
      cardBorder: "border-green-200 hover:border-green-400",
      Icon: Bell,
    },
  ];

  return (
    <>
      <section className="py-12 md:py-16" style={{ backgroundColor: "var(--bg-primary)" }}>
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-center">

            {/* Left */}
            <div className="max-w-xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-10">
                Empowering Students.
                <span className="block">Building Futures.</span>
              </h1>

              {/* 2x2 Feature Cards */}
              <div className="grid grid-cols-2 gap-4">
                {tools.map((tool, i) => (
                  <button
                    key={i}
                    onClick={() => navigate(tool.path)}
                    className={`relative flex items-center gap-3 px-4 py-4 rounded-2xl border transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 text-left group ${tool.cardBorder}`}
                    style={{ backgroundColor: "var(--bg-card)" }}
                  >
                    {tool.badge && (
                      <span className={`absolute top-2 right-2 px-1.5 py-0.5 text-[10px] font-bold text-white rounded-full ${tool.badgeColor}`}>
                        {tool.badge}
                      </span>
                    )}

                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.iconBg} flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-105 transition-transform relative`}>
                      {tool.glassy && (
                        <div className="absolute inset-1 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30" />
                      )}
                      <tool.Icon className="w-6 h-6 text-white relative z-10" />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-foreground leading-tight">{tool.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{tool.sub}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right — Promo Banner */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500">
                <div className="absolute inset-0">
                  <img
                    src={heroStudents}
                    alt="Students learning"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 via-purple-800/60 to-transparent" />
                </div>
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
                      Every Student Matters:{" "}
                      <span className="font-normal">Driving the Future of Education</span>
                    </h4>
                    <p className="text-white/70 text-sm max-w-sm">
                      Watch how we underline the importance of informed choices
                      that help shape academic and career success.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowVideo(true)}
                    className="mt-6 inline-flex items-center gap-3 px-6 py-3 bg-white text-foreground font-semibold rounded-full hover:bg-white/90 transition-colors w-fit shadow-lg"
                  >
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

      <VideoModal isOpen={showVideo} onClose={() => setShowVideo(false)} />
    </>
  );
};

export default Hero;
