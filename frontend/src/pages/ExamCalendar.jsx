import { useState, useEffect } from "react";
import { Calendar, Search, Clock, ExternalLink, RefreshCw } from "lucide-react";

// ─── Exam Data (dates only — status computed dynamically) ───────────────────
// dateRange: { start: "YYYY-MM-DD", end: "YYYY-MM-DD" }
// If exam is single day: start === end
// If no fixed date yet: start/end = null, displayDate used for UI only
const EXAMS = [
  // Engineering
  { name:"JEE Main",        category:"Engineering",      start:"2026-01-22", end:"2026-04-08",  displayDate:"Jan 22 – Apr 8, 2026",   link:"https://jeemain.nta.nic.in" },
  { name:"JEE Advanced",    category:"Engineering",      start:"2026-05-18", end:"2026-05-18",  displayDate:"May 18, 2026",           link:"https://jeeadv.ac.in" },
  { name:"BITSAT",          category:"Engineering",      start:"2026-05-21", end:"2026-06-03",  displayDate:"May 21 – Jun 3, 2026",   link:"https://bitsadmission.com" },
  { name:"VITEEE",          category:"Engineering",      start:"2026-04-17", end:"2026-04-26",  displayDate:"Apr 17 – 26, 2026",      link:"https://viteee.vit.ac.in" },
  { name:"SRMJEEE",         category:"Engineering",      start:"2026-04-14", end:"2026-04-20",  displayDate:"Apr 14 – 20, 2026",      link:"https://srmist.edu.in" },
  { name:"MHT CET",         category:"Engineering",      start:"2026-04-29", end:"2026-05-14",  displayDate:"Apr 29 – May 14, 2026",  link:"https://mahacet.org" },
  { name:"KCET",            category:"Engineering",      start:"2026-04-16", end:"2026-04-17",  displayDate:"Apr 16 – 17, 2026",      link:"https://kea.kar.nic.in" },
  { name:"WBJEE",           category:"Engineering",      start:"2026-04-20", end:"2026-04-20",  displayDate:"Apr 20, 2026",           link:"https://wbjeeb.nic.in" },
  { name:"COMEDK UGET",     category:"Engineering",      start:"2026-05-10", end:"2026-05-10",  displayDate:"May 10, 2026",           link:"https://comedk.org" },
  // Medical
  { name:"NEET UG",         category:"Medical",          start:"2026-05-04", end:"2026-05-04",  displayDate:"May 4, 2026",            link:"https://neet.nta.nic.in" },
  { name:"NEET PG",         category:"Medical",          start:"2026-06-15", end:"2026-06-15",  displayDate:"Jun 15, 2026",           link:"https://nbe.edu.in" },
  { name:"JIPMER",          category:"Medical",          start:"2026-06-01", end:"2026-06-01",  displayDate:"Jun 1, 2026",            link:"https://jipmer.edu.in" },
  { name:"AIIMS MBBS",      category:"Medical",          start:null,          end:null,          displayDate:"Via NEET UG",            link:"https://aiimsexams.ac.in" },
  // Management
  { name:"CAT",             category:"Management",       start:"2026-11-24", end:"2026-11-24",  displayDate:"Nov 24, 2026",           link:"https://iimcat.ac.in" },
  { name:"XAT",             category:"Management",       start:"2026-01-05", end:"2026-01-05",  displayDate:"Jan 5, 2026",            link:"https://xatonline.in" },
  { name:"CMAT",            category:"Management",       start:"2026-03-22", end:"2026-03-22",  displayDate:"Mar 22, 2026",           link:"https://nta.ac.in/cmat" },
  { name:"MAT",             category:"Management",       start:null,          end:null,          displayDate:"Every 2 months",         link:"https://mat.aima.in" },
  { name:"NMAT",            category:"Management",       start:"2026-10-01", end:"2026-12-31",  displayDate:"Oct – Dec 2026",         link:"https://nmat.org" },
  // Law
  { name:"CLAT",            category:"Law",              start:"2026-12-01", end:"2026-12-01",  displayDate:"Dec 1, 2026",            link:"https://consortiumofnlus.ac.in" },
  { name:"AILET",           category:"Law",              start:"2026-12-01", end:"2026-12-01",  displayDate:"Dec 1, 2026",            link:"https://nludelhi.ac.in" },
  { name:"DU LLB",          category:"Law",              start:"2026-06-14", end:"2026-06-14",  displayDate:"Jun 14, 2026",           link:"https://legalaid.du.ac.in" },
  { name:"AP LAWCET",       category:"Law",              start:"2026-05-01", end:"2026-05-31",  displayDate:"May 2026",               link:"https://aplawcet.apcfss.in" },
  // Computer Science
  { name:"GATE CS",         category:"Computer Science", start:"2026-02-01", end:"2026-02-16",  displayDate:"Feb 1 – 16, 2026",       link:"https://gate2026.iitr.ac.in" },
  { name:"NIMCET",          category:"Computer Science", start:"2026-06-14", end:"2026-06-14",  displayDate:"Jun 14, 2026",           link:"https://nimcet.in" },
  { name:"CUET PG",         category:"Computer Science", start:"2026-03-13", end:"2026-03-31",  displayDate:"Mar 13 – 31, 2026",      link:"https://cuet.nta.nic.in" },
  // Government
  { name:"UPSC CSE",        category:"Government",       start:"2026-05-25", end:"2026-05-25",  displayDate:"May 25, 2026 (Prelims)", link:"https://upsc.gov.in" },
  { name:"SSC CGL",         category:"Government",       start:"2026-09-01", end:"2026-10-31",  displayDate:"Sep – Oct 2026",         link:"https://ssc.nic.in" },
  { name:"IBPS PO",         category:"Government",       start:"2026-10-01", end:"2026-10-31",  displayDate:"Oct 2026",               link:"https://ibps.in" },
  { name:"RRB NTPC",        category:"Government",       start:"2026-04-01", end:"2026-06-30",  displayDate:"Apr – Jun 2026",         link:"https://rrbapply.gov.in" },
];

// ─── Dynamic status from real today's date ──────────────────────────────────
function getStatus(start, end) {
  if (!start || !end) return "Info";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const s = new Date(start);
  const e = new Date(end);
  e.setHours(23, 59, 59, 999); // include full end day
  if (today < s) return "Upcoming";
  if (today > e) return "Completed";
  return "Ongoing";
}

const STATUS_COLORS = {
  Upcoming:  "bg-blue-100 text-blue-700",
  Ongoing:   "bg-green-100 text-green-700",
  Completed: "bg-gray-100 text-gray-500 line-through-none",
  Info:      "bg-yellow-100 text-yellow-700",
};

const CATEGORIES = ["All","Engineering","Medical","Management","Law","Computer Science","Government"];

export default function ExamCalendar() {
  const [search, setSearch]     = useState("");
  const [category, setCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [now, setNow]           = useState(new Date());

  // Refresh status every minute (handles day boundary)
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  // Attach live status to each exam
  const exams = EXAMS.map(e => ({ ...e, status: getStatus(e.start, e.end) }));

  const filtered = exams.filter(e => {
    const matchCat    = category === "All"     || e.category === category;
    const matchStatus = statusFilter === "All" || e.status   === statusFilter;
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchStatus && matchSearch;
  });

  const todayStr = now.toLocaleDateString("en-IN", { weekday:"long", year:"numeric", month:"long", day:"numeric" });

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-700 text-white py-12 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <Calendar className="w-10 h-10 mx-auto mb-3 opacity-90" />
          <h1 className="text-3xl font-black mb-2">Exam Calendar 2026</h1>
          <p className="text-violet-100 text-sm max-w-xl mx-auto mb-3">
            All major entrance exams — dates, schedule and official links
          </p>
          <div className="inline-flex items-center gap-1.5 bg-white/20 rounded-full px-4 py-1.5 text-xs font-semibold">
            <RefreshCw className="w-3 h-3" />
            Status auto-updates · Today: {todayStr}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Status legend */}
        <div className="flex flex-wrap gap-3 mb-6">
          {[
            { label:"Upcoming",  color:"bg-blue-100 text-blue-700",  desc:"Exam not yet started" },
            { label:"Ongoing",   color:"bg-green-100 text-green-700",desc:"Exam happening today/this window" },
            { label:"Completed", color:"bg-gray-100 text-gray-500",  desc:"Exam window passed" },
            { label:"Info",      color:"bg-yellow-100 text-yellow-700",desc:"No fixed date announced" },
          ].map(s => (
            <span key={s.label} title={s.desc}
              className={`text-xs font-bold px-3 py-1 rounded-full cursor-help ${s.color}`}>
              {s.label}
            </span>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-3 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="Search exam..."
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-violet-100"/>
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={()=>setCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition
                  ${category===cat?"bg-violet-600 text-white":"bg-gray-100 text-gray-600 hover:bg-violet-50 hover:text-violet-600"}`}>
                {cat}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {["All","Upcoming","Ongoing","Completed","Info"].map(s=>(
              <button key={s} onClick={()=>setStatusFilter(s)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition
                  ${statusFilter===s?"bg-gray-800 text-white":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm text-gray-400 mb-4">
          Showing <span className="font-bold text-gray-700">{filtered.length}</span> exams
        </p>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 gap-2 px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wide">
            <div className="col-span-4">Exam</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-3">Date / Schedule</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1">Link</div>
          </div>

          <div className="divide-y divide-gray-100">
            {filtered.map((exam,i)=>(
              <div key={i}
                className={`grid grid-cols-12 gap-2 px-5 py-4 hover:bg-gray-50 transition items-center
                  ${exam.status==="Completed"?"opacity-60":""}`}>
                <div className="col-span-4 font-semibold text-gray-900 text-sm">{exam.name}</div>
                <div className="col-span-2">
                  <span className="text-xs text-gray-500">{exam.category}</span>
                </div>
                <div className="col-span-3 flex items-center gap-1.5 text-sm text-gray-600">
                  <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0"/>
                  {exam.displayDate}
                </div>
                <div className="col-span-2">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_COLORS[exam.status]||"bg-gray-100 text-gray-600"}`}>
                    {exam.status}
                  </span>
                </div>
                <div className="col-span-1">
                  <a href={exam.link} target="_blank" rel="noreferrer"
                    className="text-violet-600 hover:text-violet-800 transition">
                    <ExternalLink className="w-4 h-4"/>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {filtered.length===0&&(
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 mt-4">
            <p className="text-2xl mb-2">🔍</p>
            <p className="text-gray-500 font-semibold">No exams found</p>
          </div>
        )}

        <p className="text-center text-xs text-gray-400 mt-6">
          Status computed from today's date automatically. No manual update needed.
        </p>
      </div>
    </div>
  );
}