import { useParams, useNavigate, Link } from "react-router-dom";
import { BookOpen, GraduationCap, FileText, PenTool, Building2, Bell, ChevronRight, ExternalLink } from "lucide-react";

const STREAM_DATA = {
  engineering: {
    title: "Engineering",
    description: "Explore top engineering entrance exams, colleges, syllabus, and preparation resources.",
    color: "from-blue-600 to-indigo-700",
    exams: [
      { name:"JEE Main",    slug:"jee-main",    body:"NTA",          level:"National",   seats:"31 NITs + 26 IIITs" },
      { name:"JEE Advanced",slug:"jee-advanced",body:"IIT",          level:"National",   seats:"16,000 IIT seats" },
      { name:"BITSAT",      slug:"bitsat",       body:"BITS Pilani",  level:"University", seats:"2200 seats" },
      { name:"VITEEE",      slug:"viteee",       body:"VIT University",level:"University",seats:"5000+ seats" },
      { name:"SRMJEEE",     slug:"srmjeee",      body:"SRM Institute",level:"University", seats:"7000+ seats" },
      { name:"COMEDK UGET", slug:"comedk-uget",  body:"COMEDK",       level:"State",      seats:"20000+ Karnataka seats" },
      { name:"WBJEE",       slug:"wbjee",        body:"WBJEEB",       level:"State",      seats:"Top WB colleges" },
      { name:"MHT CET",     slug:"mht-cet",      body:"CET Cell MH",  level:"State",      seats:"Maharashtra colleges" },
      { name:"KCET",        slug:"kcet",         body:"KEA Karnataka", level:"State",      seats:"Karnataka colleges" },
    ],
    colleges: [
      { name:"IIT Bombay",  slug:"iit-bombay",  rank:"NIRF #3",  type:"Government" },
      { name:"IIT Delhi",   slug:"iit-delhi",   rank:"NIRF #2",  type:"Government" },
      { name:"NIT Trichy",  slug:"nit-trichy",  rank:"NIRF #8",  type:"Government" },
      { name:"BITS Pilani", slug:"bits-pilani", rank:"NIRF #25", type:"Private" },
      { name:"VIT Vellore", slug:"vit-vellore", rank:"NIRF #11", type:"Private" },
    ],
    tips: ["Master NCERT books for Physics, Chemistry, Mathematics before moving to advanced books",
           "Solve previous 10 years' papers — JEE Main patterns repeat",
           "Attempt at least 2 full mock tests per week from January onwards",
           "Focus on high-weightage chapters: Calculus, Mechanics, Organic Chemistry"],
  },
  medical: {
    title: "Medical",
    description: "Everything you need for NEET UG, NEET PG, and medical college admissions.",
    color: "from-green-600 to-teal-700",
    exams: [
      { name:"NEET UG",  slug:"neet-ug",  body:"NTA",      level:"National",   seats:"1.08 lakh MBBS seats" },
      { name:"NEET PG",  slug:"neet-pg",  body:"NBE",      level:"National",   seats:"50,000+ PG seats" },
      { name:"AFMC",     slug:"afmc",     body:"AFMC Pune",level:"National",   seats:"150 MBBS seats" },
      { name:"JIPMER",   slug:"jipmer-puducherry",body:"JIPMER",level:"National",seats:"150 MBBS seats" },
    ],
    colleges: [
      { name:"AIIMS Delhi",   slug:"aiims-delhi",    rank:"NIRF #1 Medical", type:"Government" },
      { name:"JIPMER",        slug:"jipmer-puducherry",rank:"NIRF #4",       type:"Government" },
      { name:"AFMC Pune",     slug:"afmc-pune",      rank:"NIRF #7",         type:"Government" },
    ],
    tips: ["NCERT Biology (Class 11+12) is THE most important — read every word and diagram",
           "Biology carries 360/720 marks — master it completely",
           "Attempt 30+ full NEET mock tests from January to May",
           "Practice previous year NEET papers from 2013 onwards"],
  },
  management: {
    title: "Management",
    description: "CAT, XAT, and all MBA entrance exams — preparation guides and college info.",
    color: "from-purple-600 to-violet-700",
    exams: [
      { name:"CAT",  slug:"cat",  body:"IIMs",  level:"National",   seats:"5000+ IIM seats" },
      { name:"XAT",  slug:"xat",  body:"XLRI",  level:"National",   seats:"XLRI + 150 institutes" },
      { name:"CMAT", slug:"cmat", body:"NTA",   level:"National",   seats:"1000+ institutes" },
      { name:"MAT",  slug:"mat",  body:"AIMA",  level:"National",   seats:"600+ institutes" },
      { name:"NMAT", slug:"nmat", body:"GMAC",  level:"National",   seats:"NMIMS + top MBAs" },
    ],
    colleges: [
      { name:"IIM Ahmedabad", slug:"iim-ahmedabad",  rank:"NIRF #1 Management",type:"Government" },
      { name:"IIM Bangalore", slug:"iim-bangalore",  rank:"NIRF #2",           type:"Government" },
      { name:"XLRI Jamshedpur",slug:"xlri-jamshedpur",rank:"NIRF #8",          type:"Private" },
    ],
    tips: ["Read 2 editorials daily from The Hindu for Reading Comprehension",
           "DILR is most unpredictable — practice diverse puzzle types",
           "Attempt 30-40 CAT mocks from August to November",
           "Analyze every mock for at least 2 hours after attempting"],
  },
  "computer-science": {
    title: "Computer Science",
    description: "GATE CS, NIMCET, and all CS/IT postgraduate entrance exams.",
    color: "from-cyan-600 to-blue-700",
    exams: [
      { name:"GATE CS", slug:"gate-cs", body:"IIT/IISc", level:"National",   seats:"M.Tech at IITs + PSU jobs" },
      { name:"NIMCET",  slug:"nimcet",  body:"NITs",     level:"National",   seats:"MCA at 11 NITs" },
      { name:"CUET PG", slug:"cuet-pg", body:"NTA",      level:"National",   seats:"250+ Central Universities" },
      { name:"TANCET",  slug:"tancet",  body:"Anna University",level:"State",seats:"TN colleges" },
      { name:"IIT JAM", slug:"jam",     body:"IITs",     level:"National",   seats:"M.Sc at IITs" },
    ],
    colleges: [
      { name:"IISc Bangalore",  slug:"iisc-bangalore",  rank:"NIRF #1 Overall",type:"Government" },
      { name:"IIIT Hyderabad",  slug:"iiit-hyderabad",  rank:"NIRF #40",       type:"Private" },
    ],
    tips: ["Master all GATE CS topics — no topic can be skipped",
           "Solve GATE previous 15 years' papers — patterns repeat deeply",
           "Algorithms and TOC are high-weightage, high-difficulty — prepare thoroughly",
           "Join a GATE test series for regular benchmarking"],
  },
  law: {
    title: "Law",
    description: "CLAT, AILET and all law entrance exams for NLU admissions.",
    color: "from-amber-600 to-orange-700",
    exams: [
      { name:"CLAT",      slug:"clat",      body:"Consortium of NLUs",level:"National",  seats:"2800 UG seats, 22 NLUs" },
      { name:"AILET",     slug:"ailet",     body:"NLU Delhi",         level:"University",seats:"110 BA LLB seats" },
      { name:"DU LLB",    slug:"du-llb",    body:"Delhi University",  level:"University",seats:"300+ LLB seats" },
      { name:"AP LAWCET", slug:"ap-lawcet", body:"APSCHE",            level:"State",     seats:"AP law colleges" },
    ],
    colleges: [
      { name:"NLSIU Bangalore",slug:"nlsiu-bangalore",rank:"NIRF #1 Law",type:"Government" },
      { name:"NLU Delhi",      slug:"nlu-delhi",      rank:"NIRF #2",    type:"Government" },
    ],
    tips: ["Read The Hindu daily for 6–12 months for Current Affairs",
           "CLAT is a reading test — improve comprehension speed above all",
           "Practice only passage-based questions from CLAT 2020–2024 papers",
           "Join CLATapult or LegalEdge mock test series"],
  },
  government: {
    title: "Government",
    description: "UPSC, SSC, Banking, and Railway recruitment exams — complete guide.",
    color: "from-red-600 to-rose-700",
    exams: [
      { name:"UPSC CSE", slug:"upsc",     body:"UPSC",  level:"National",seats:"~1000 IAS/IPS/IFS vacancies" },
      { name:"SSC CGL",  slug:"ssc-cgl",  body:"SSC",   level:"National",seats:"14,582 Group B/C posts" },
      { name:"IBPS PO",  slug:"ibps-po",  body:"IBPS",  level:"National",seats:"3,995 bank PO vacancies" },
      { name:"RRB NTPC", slug:"rrb-ntpc", body:"RRB",   level:"National",seats:"11,558 railway posts" },
    ],
    colleges: [
      { name:"LBSNAA Mussoorie",slug:"lbsnaa-mussoorie",rank:"Premier IAS Academy",type:"Government" },
    ],
    tips: ["NCERT books (Class 6–12) are the foundation for UPSC preparation",
           "Read The Hindu or Indian Express daily — current affairs are crucial",
           "SSC CGL Tier I: aim for 150+/200 to ensure shortlisting",
           "For IBPS, practice Reasoning puzzles and DI daily — they are the differentiators"],
  },
};

export default function StreamPage() {
  const { streamName } = useParams();
  const navigate = useNavigate();

  const stream = STREAM_DATA[streamName];

  if (!stream) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-2xl font-bold text-gray-700">Stream not found</p>
        <button onClick={() => navigate("/")}
          className="text-blue-600 underline text-sm">← Go Home</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className={`bg-gradient-to-r ${stream.color} text-white py-12 px-4`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-white/60 text-sm mb-3">
            <Link to="/" className="hover:text-white transition">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">{stream.title}</span>
          </div>
          <h1 className="text-3xl font-black mb-2">{stream.title} Exams & Colleges</h1>
          <p className="text-white/80 text-sm max-w-xl">{stream.description}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

        {/* EXAMS TABLE */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-500" />
              <h2 className="font-bold text-gray-900">
                {stream.title} Entrance Exams ({stream.exams.length})
              </h2>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-6 py-3 font-semibold text-gray-600">#</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-600">Exam</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Conducting Body</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Level</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Seats / Scope</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stream.exams.map((exam, i) => (
                  <tr key={exam.slug}
                    className="hover:bg-blue-50/30 transition cursor-pointer"
                    onClick={() => navigate(`/exam/${exam.slug}`)}>
                    <td className="px-6 py-3.5 text-gray-400">{i + 1}</td>
                    <td className="px-6 py-3.5 font-semibold text-gray-900">{exam.name}</td>
                    <td className="px-4 py-3.5 text-gray-600">{exam.body}</td>
                    <td className="px-4 py-3.5">
                      <span className="level-badge text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">
                        {exam.level}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-gray-600 text-xs">{exam.seats}</td>
                    <td className="px-4 py-3.5">
                      <span className="view-details-link text-xs text-blue-600 font-semibold hover:underline">
                        View Details →
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {/* TOP COLLEGES */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-green-500" />
              <h2 className="font-bold text-gray-900">Top {stream.title} Colleges</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {stream.colleges.map((college) => (
                <div key={college.slug}
                  onClick={() => navigate(`/college/${college.slug}`)}
                  className="px-6 py-4 flex items-center justify-between cursor-pointer
                             hover:bg-gray-50 transition group">
                  <div>
                    <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-sm">
                      {college.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-400">{college.rank}</span>
                      <span className={`text-xs font-medium ${college.type === "Government" ? "text-green-600" : "text-orange-600"}`}>
                        {college.type}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition" />
                </div>
              ))}
              <div className="px-6 py-3">
                <button onClick={() => navigate(`/colleges?category=${stream.title}`)}
                  className="text-sm text-blue-600 font-semibold hover:underline">
                  View all {stream.title} colleges →
                </button>
              </div>
            </div>
          </div>

          {/* PREPARATION TIPS */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <PenTool className="w-5 h-5 text-yellow-500" />
              <h2 className="font-bold text-gray-900">Preparation Tips</h2>
            </div>
            <div className="p-5 space-y-3">
              {stream.tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold
                                  flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
            <div className="px-5 pb-4">
              <button
                onClick={() => navigate("/resources/previous-papers")}
                className="w-full py-2.5 bg-blue-50 text-blue-600 rounded-xl text-sm font-semibold
                           hover:bg-blue-100 transition flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" />
                Download Previous Year Papers
              </button>
            </div>
          </div>
        </div>

        {/* Quick links row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Bell,         label: "Latest Notifications", path: "/notifications" },
            { icon: FileText,     label: "Previous Papers",      path: "/resources/previous-papers" },
            { icon: BookOpen,     label: "Exam Calendar",        path: "/resources/exam-calendar" },
            { icon: Building2,    label: "All Colleges",         path: "/colleges" },
          ].map(item => {
            const Icon = item.icon;
            return (
              <button key={item.label}
                onClick={() => navigate(item.path)}
                className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3
                           hover:border-blue-300 hover:shadow-sm transition text-left group">
                <Icon className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}