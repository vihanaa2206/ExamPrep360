import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin, Star, Award, Globe, Users, BookOpen,
  Building2, GraduationCap, IndianRupee, Wifi,
  Dumbbell, HeartPulse, Bus, ShoppingBag, Mic2,
  ChevronLeft, ExternalLink, Library, Mail,
} from "lucide-react";

/* ── local image map ───────────────────────────────────────── */
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
  "bits-pilani": bitcblog1,
  "nit-trichy": nitTrichyImg,
  "jipmer-puducherry": collegejipmer,
  "iim-bangalore": collegeIIMBangalore,
  "nlsiu-bangalore": collegeNLSIU,
  "nlu-delhi": collegeNLU,
  "iisc-bangalore": collegeIISC,
  "iiit-hyderabad": collegeIIITHyderabad,
  "college-lbsnaa-mussoorie": collegeLbsna,
  "vit-vellore": collegeVIT,
};

/* ── tab list ──────────────────────────────────────────────── */
const TABS = [
  { key: "overview",       label: "Overview",            icon: Building2 },
  { key: "courses",        label: "Courses",             icon: BookOpen },
  { key: "departments",    label: "Departments",         icon: GraduationCap },
  { key: "fees",           label: "Fees Structure",      icon: IndianRupee },
  { key: "campus",         label: "Campus & Facilities", icon: Wifi },
  { key: "administration", label: "Administration",      icon: Users },
];

/* ── category colour map ───────────────────────────────────── */
const CAT_COLOR = {
  Engineering:        "from-blue-600 to-indigo-700",
  Medical:            "from-green-600 to-teal-700",
  Management:         "from-purple-600 to-violet-700",
  Law:                "from-amber-600 to-orange-700",
  "Computer Science": "from-cyan-600 to-blue-700",
  Government:         "from-red-600 to-rose-700",
};

/* ════════════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════════════ */
const CollegeDetails = () => {
  const { slug }      = useParams();
  const navigate      = useNavigate();
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    setLoading(true);
    fetch(`https://examprep360.onrender.com/api/colleges/${slug}`)
      .then((r) => r.json())
      .then((d) => {
        console.log("SLUG FROM BACKEND:", d.slug);
        setCollege(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">
      Loading college details…
    </div>
  );

  if (!college) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-xl font-bold text-gray-700">College not found</p>
      <button onClick={() => navigate("/colleges")}
        className="text-blue-600 underline text-sm">← Back to Colleges</button>
    </div>
  );

  const heroImg   = LOCAL_IMAGES[college.slug] || null;
  const gradient  = CAT_COLOR[college.category] || "from-blue-600 to-indigo-700";

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── HERO BANNER ─────────────────────────────────────── */}
      <div className={`relative bg-gradient-to-r ${gradient} text-white overflow-hidden`}>

        {heroImg && (
          <img src={heroImg} alt={college.short_name}
            className="absolute inset-0 w-full h-full object-cover opacity-40" />
        )}

        <div className="relative max-w-7xl mx-auto px-4 py-10">

          <button onClick={() => navigate("/colleges")}
            className="flex items-center gap-1 text-white/70 hover:text-white text-sm mb-6 transition">
            <ChevronLeft className="w-4 h-4" /> All Colleges
          </button>

          <div className="flex flex-col md:flex-row gap-6 items-start">

            {/* college image box */}
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden
                            border-4 border-white/30 flex-shrink-0 shadow-xl bg-white/10">
              {heroImg ? (
                <img src={heroImg} alt={college.short_name}
                  className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-white text-4xl font-black">
                    {college.short_name?.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* college info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="bg-white/20 backdrop-blur text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {college.category}
                </span>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full
                  ${college.type === "Government" ? "bg-green-500/80" : "bg-orange-500/80"}`}>
                  {college.type}
                </span>
                {college.naac_grade && college.naac_grade !== "N/A" && (
                  <span className="bg-purple-500/80 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    NAAC {college.naac_grade}
                  </span>
                )}
                {college.nirf_ranking && (
                  <span className="bg-blue-500/80 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    NIRF #{college.nirf_ranking}
                  </span>
                )}
              </div>

              <h1 className="text-2xl md:text-3xl font-black text-white mb-1 leading-tight">
                {college.short_name}
              </h1>
              <p className="text-white/70 text-sm mb-3">{college.name}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {college.location}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                  {college.rating}/5.0
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {college.total_students?.toLocaleString()} students
                </span>
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-4 h-4" />
                  Est. {college.established}
                </span>
                {college.website && (
                  <a href={college.website} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-white transition">
                    <Globe className="w-4 h-4" /> Official Website
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            {/* quick stats box */}
            <div className="hidden lg:grid grid-cols-2 gap-3 flex-shrink-0">
              {[
                { label: "Courses",     value: college.courses?.length || "—" },
                { label: "Departments", value: college.departments?.length || "—" },
                { label: "Faculty",     value: college.total_faculty || "—" },
                { label: "Campus",      value: college.campus_area || "—" },
              ].map((s) => (
                <div key={s.label}
                  className="bg-white/10 backdrop-blur rounded-xl px-4 py-3 text-center min-w-[90px]">
                  <p className="text-white font-black text-xl">{s.value}</p>
                  <p className="text-white/60 text-xs">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── PLACEMENT STRIP ────────────────────────────────── */}
      {college.placements && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
            <Award className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span className="text-sm font-semibold text-gray-700">Placements:</span>
            <span className="text-sm text-gray-600">{college.placements}</span>
          </div>
        </div>
      )}

      {/* ── TABS ────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto">
          <div className="flex gap-0 min-w-max">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-5 py-4 text-sm font-medium
                    border-b-2 transition-colors whitespace-nowrap
                    ${activeTab === tab.key
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
                    }`}>
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── TAB CONTENT ─────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === "overview"       && <OverviewTab       college={college} />}
        {activeTab === "courses"        && <CoursesTab        college={college} />}
        {activeTab === "departments"    && <DepartmentsTab    college={college} />}
        {activeTab === "fees"           && <FeesTab           college={college} />}
        {activeTab === "campus"         && <CampusTab         college={college} />}
        {activeTab === "administration" && <AdministrationTab college={college} />}
      </div>

    </div>
  );
};

/* ════════════════════════════════════════════════════════════
   TAB — OVERVIEW
════════════════════════════════════════════════════════════ */
const OverviewTab = ({ college }) => (
  <div className="space-y-6">

    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
        <Building2 className="w-5 h-5 text-blue-500" /> About {college.short_name}
      </h2>
      <p className="text-gray-600 leading-relaxed">{college.description}</p>
    </div>

    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Facts</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <tbody className="divide-y divide-gray-100">
            {[
              ["Full Name",         college.name],
              ["Location",          college.location],
              ["Established",       college.established],
              ["Type",              college.type],
              ["Affiliation",       college.affiliation],
              ["NAAC Grade",        college.naac_grade],
              ["NIRF Ranking",      college.nirf_ranking ? `#${college.nirf_ranking}` : "N/A"],
              ["Total Students",    college.total_students?.toLocaleString()],
              ["Total Faculty",     college.total_faculty],
              ["Campus Area",       college.campus_area],
              ["Total Seats",       college.seats],
              ["Fees Range",        college.fees_range],
              ["Official Website",  college.website],
            ].map(([label, value]) => (
              <tr key={label} className="hover:bg-gray-50">
                <td className="py-3 pr-6 font-semibold text-gray-500 w-44 whitespace-nowrap">
                  {label}
                </td>
                <td className="py-3 text-gray-800">
                  {label === "Official Website" ? (
                    <a href={value} target="_blank" rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1">
                      {value} <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : value || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {college.exams_accepted?.length > 0 && (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Exams Accepted</h2>
        <div className="flex flex-wrap gap-2">
          {college.exams_accepted.map((ex) => (
            <span key={ex}
              className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold border border-blue-100">
              {ex.toUpperCase().replace(/-/g, " ")}
            </span>
          ))}
        </div>
      </div>
    )}
  </div>
);

/* ════════════════════════════════════════════════════════════
   TAB — COURSES
════════════════════════════════════════════════════════════ */
const CoursesTab = ({ college }) => (
  <div className="space-y-6">

    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {college.courses?.map((c, i) => (
        <div key={i}
          className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm text-center hover:border-blue-300 hover:shadow-md transition">
          <BookOpen className="w-6 h-6 text-blue-500 mx-auto mb-2" />
          <p className="text-sm font-bold text-gray-800">{c}</p>
        </div>
      ))}
    </div>

    {college.courses_detail?.length > 0 && (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">
            Detailed Course Information ({college.courses_detail.length} programs)
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-6 py-4 font-semibold text-gray-600">#</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-600">Program</th>
                <th className="text-center px-4 py-4 font-semibold text-gray-600">Duration</th>
                <th className="text-center px-4 py-4 font-semibold text-gray-600">Seats</th>
                <th className="text-right px-6 py-4 font-semibold text-gray-600">Fees/Year</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-600">Entrance Exam</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {college.courses_detail.map((course, i) => (
                <tr key={i} className={`hover:bg-blue-50/40 transition ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                  <td className="px-6 py-4 text-gray-400 font-medium">{i + 1}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{course.name}</td>
                  <td className="px-4 py-4 text-center text-gray-700">{course.duration}</td>
                  <td className="px-4 py-4 text-center">
                    <span className="seats-badge bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">
                      {course.seats}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-green-700">{course.fees_per_year}</td>
                  <td className="px-6 py-4">
                    <span className="exam-badge bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded">
                      {course.exam}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}
  </div>
);

/* ════════════════════════════════════════════════════════════
   TAB — DEPARTMENTS
════════════════════════════════════════════════════════════ */
const DepartmentsTab = ({ college }) => (
  <div className="space-y-6">

    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">
          All Departments
        </h2>
        <span className="dept-count-badge bg-blue-100 text-blue-700 text-sm font-bold px-3 py-1 rounded-full">
          {college.departments?.length || 0} Departments
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-6 py-4 font-semibold text-gray-600 w-16">#</th>
              <th className="text-left px-6 py-4 font-semibold text-gray-600">Department Name</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {college.departments?.map((dept, i) => (
              <tr key={i} className={`hover:bg-blue-50/40 transition ${i % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}>
                <td className="px-6 py-3.5 text-gray-400 font-medium">{i + 1}</td>
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                    <span className="font-medium text-gray-800">{dept}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

/* ════════════════════════════════════════════════════════════
   TAB — FEES STRUCTURE
════════════════════════════════════════════════════════════ */
const FeesTab = ({ college }) => {
  const fees = college.fees_structure;
  if (!fees) return <p className="text-gray-500">Fees information not available.</p>;

  const rows = [
    { label: "Tuition Fee",    value: fees.tuition_fee,    icon: "📚", color: "bg-blue-50 border-blue-200" },
    { label: "Hostel Fee",     value: fees.hostel_fee,     icon: "🏠", color: "bg-orange-50 border-orange-200" },
    { label: "Mess / Food Fee",value: fees.mess_fee,       icon: "🍽️", color: "bg-green-50 border-green-200" },
    { label: "Other Charges",  value: fees.other_charges,  icon: "📋", color: "bg-yellow-50 border-yellow-200" },
    { label: "Total Per Year", value: fees.total_per_year, icon: "💰", color: "bg-purple-50 border-purple-200" },
    { label: "SC/ST / Reserved Category", value: fees.sc_st_fee, icon: "🎓", color: "bg-teal-50 border-teal-200" },
  ];

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {rows.slice(0, 3).map((r) => (
          <div key={r.label} className={`border rounded-2xl p-5 ${r.color}`}>
            <p className="text-2xl mb-2">{r.icon}</p>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{r.label}</p>
            <p className="font-bold text-gray-900 text-sm">{r.value || "—"}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Complete Fees Breakdown</h2>
          <p className="text-xs text-gray-400 mt-0.5">All amounts are approximate and may vary by year</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-6 py-4 font-semibold text-gray-600">Fee Component</th>
                <th className="text-right px-6 py-4 font-semibold text-gray-600">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((r, i) => (
                <tr key={i} className={`hover:bg-gray-50 ${r.label === "Total Per Year" ? "font-bold" : ""}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{r.icon}</span>
                      <span className={`${r.label === "Total Per Year" ? "text-gray-900 font-bold" : "text-gray-700"}`}>
                        {r.label}
                      </span>
                    </div>
                  </td>
                  <td className={`px-6 py-4 text-right font-semibold
                    ${r.label === "Total Per Year" ? "text-purple-700 text-base" : "text-gray-800"}`}>
                    {r.value || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <span className="font-semibold">📌 Note:</span> Fees mentioned are indicative and may vary per academic year.
        Always verify from the official college website before applying.
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════
   TAB — CAMPUS & FACILITIES
════════════════════════════════════════════════════════════ */
const CampusTab = ({ college }) => {
  const cf = college.campus_facilities;
  if (!cf) return <p className="text-gray-500">Campus information not available.</p>;

  const facilityItems = [
    { label: "Total Campus Area",   value: cf.total_area,      icon: <Building2 className="w-5 h-5 text-blue-500" /> },
    { label: "Hostels",             value: cf.hostels,         icon: <Building2 className="w-5 h-5 text-orange-500" /> },
    { label: "Hostel Capacity",     value: cf.hostel_capacity, icon: <Users className="w-5 h-5 text-purple-500" /> },
    { label: "Library",             value: cf.library,         icon: <Library className="w-5 h-5 text-red-500" /> },
    { label: "Sports Facilities",   value: cf.sports,          icon: <Dumbbell className="w-5 h-5 text-green-500" /> },
    { label: "Medical / Hospital",  value: cf.medical,         icon: <HeartPulse className="w-5 h-5 text-red-500" /> },
    { label: "Transport",           value: cf.transport,       icon: <Bus className="w-5 h-5 text-yellow-600" /> },
    { label: "Internet & Network",  value: cf.internet,        icon: <Wifi className="w-5 h-5 text-cyan-500" /> },
    { label: "Banks & ATMs",        value: cf.banks,           icon: <IndianRupee className="w-5 h-5 text-green-600" /> },
    { label: "Shopping & Dining",   value: cf.shopping,        icon: <ShoppingBag className="w-5 h-5 text-pink-500" /> },
    { label: "Auditorium / Events", value: cf.auditorium,      icon: <Mic2 className="w-5 h-5 text-indigo-500" /> },
  ].filter(f => f.value);

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Campus Area", value: cf.total_area,                          bg: "bg-blue-50",   text: "text-blue-700" },
          { label: "Hostels",     value: cf.hostels?.split("(")[0].trim(),       bg: "bg-orange-50", text: "text-orange-700" },
          { label: "Capacity",    value: cf.hostel_capacity,                     bg: "bg-purple-50", text: "text-purple-700" },
          { label: "Sports",      value: cf.sports?.split(",")[0] + "…",         bg: "bg-green-50",  text: "text-green-700" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4 border border-gray-200`}>
            <p className={`text-xs font-semibold uppercase tracking-wide ${s.text} mb-1`}>{s.label}</p>
            <p className="text-sm font-bold text-gray-900">{s.value || "—"}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Campus Facilities — Detailed</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-6 py-4 font-semibold text-gray-600 w-52">Facility</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-600">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {facilityItems.map((item, i) => (
                <tr key={i} className={`hover:bg-gray-50 transition ${i % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span className="font-semibold text-gray-700">{item.label}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 leading-relaxed">{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════
   TAB — ADMINISTRATION
════════════════════════════════════════════════════════════ */
const AdministrationTab = ({ college }) => {
  const admins = college.administration;
  if (!admins?.length) return <p className="text-gray-500">Administration data not available.</p>;

  return (
    <div className="space-y-6">

      {/* Top leadership cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {admins.slice(0, 3).map((person, i) => (
          <div key={i}
            className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600
                            flex items-center justify-center text-white text-xl font-black mb-4">
              {person.name?.charAt(0)}
            </div>
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">
              {person.designation}
            </p>
            <h3 className="font-bold text-gray-900 mb-1">{person.name}</h3>
            <p className="text-xs text-gray-500 mb-3">{person.department}</p>
            {person.email && (
              <a href={`mailto:${person.email}`}
                className="flex items-center gap-2 text-xs text-gray-500 hover:text-blue-600 transition">
                <Mail className="w-3.5 h-3.5" />
                {person.email}
              </a>
            )}
          </div>
        ))}
      </div>

      {/* Full administration table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Complete Administration Directory</h2>
          <span className="members-badge bg-blue-100 text-blue-700 text-sm font-bold px-3 py-1 rounded-full">
            {admins.length} Members
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-6 py-4 font-semibold text-gray-600">#</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-600">Designation</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-600">Name</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-600">Department</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-600">Email</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {admins.map((person, i) => (
                <tr key={i} className={`hover:bg-blue-50/30 transition ${i % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}>
                  <td className="px-6 py-4 text-gray-400 font-medium">{i + 1}</td>
                  <td className="px-6 py-4">
                    <span className="designation-badge bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded">
                      {person.designation}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{person.name}</td>
                  <td className="px-6 py-4 text-gray-600">{person.department}</td>
                  <td className="px-6 py-4">
                    {person.email ? (
                      <a href={`mailto:${person.email}`}
                        className="flex items-center gap-1 text-blue-600 hover:underline">
                        <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                        {person.email}
                      </a>
                    ) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CollegeDetails;
