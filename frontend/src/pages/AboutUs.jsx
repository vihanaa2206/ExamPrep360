import { Users, Target, Award, BookOpen, TrendingUp, Globe } from "lucide-react";
import { Link } from "react-router-dom";

export default function AboutUs() {
  const stats = [
    { label: "Students Helped",  value: "50 Lakh+", icon: <Users className="w-6 h-6 text-blue-500" /> },
    { label: "Exams Covered",    value: "100+",     icon: <BookOpen className="w-6 h-6 text-green-500" /> },
    { label: "Colleges Listed",  value: "500+",     icon: <Award className="w-6 h-6 text-purple-500" /> },
    { label: "States Covered",   value: "28+",      icon: <Globe className="w-6 h-6 text-orange-500" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-black mb-4">About ExamPrep360</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto leading-relaxed">
            India's most trusted exam preparation and career guidance platform,
            empowering millions of students to make informed educational decisions.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(s => (
            <div key={s.label} className="bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-sm">
              <div className="flex justify-center mb-3">{s.icon}</div>
              <p className="text-2xl font-black text-gray-900">{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-bold text-gray-900">Our Mission</h2>
          </div>
          <p className="text-gray-600 leading-relaxed text-sm">
            ExamPrep360 was founded with a single mission: to democratize access to quality exam
            preparation guidance for every student in India. We believe every student, regardless
            of background or location, deserves accurate, up-to-date information about competitive
            exams, college admissions, and career opportunities.
          </p>
          <p className="text-gray-600 leading-relaxed text-sm mt-3">
            From JEE Main to UPSC, from IIT Bombay to AIIMS Delhi — we cover every aspect of the
            Indian competitive examination ecosystem with detailed exam patterns, syllabuses,
            preparation tips, coaching comparisons, and real-time notifications.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-green-500" />
            <h2 className="text-xl font-bold text-gray-900">What We Offer</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              ["📚 Exam Information", "Detailed coverage of 100+ national and state-level entrance exams"],
              ["🏫 College Database", "Profiles of 500+ premier institutions with fees, cutoffs, and placements"],
              ["🔔 Live Notifications", "Real-time updates on admit cards, results, and application forms"],
              ["📊 Coaching Comparison", "Side-by-side comparison of coaching institutes for each exam"],
              ["📝 Previous Papers", "Official question papers from 1991 to present for all major exams"],
              ["🎯 Preparation Tips", "Expert-curated preparation strategies for each exam"],
            ].map(([title, desc]) => (
              <div key={title} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-semibold text-gray-800 text-sm mb-1">{title}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-2">Start Your Exam Journey Today</h3>
          <p className="text-blue-100 text-sm mb-6">Explore exams, colleges, and get the guidance you need</p>
          <Link to="/" className="bg-white text-blue-700 px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-50 transition">
            Explore ExamPrep360 →
          </Link>
        </div>
      </div>
    </div>
  );
}
