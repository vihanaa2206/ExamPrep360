import { useState } from "react";
import { Calendar, Search, Clock, ExternalLink } from "lucide-react";

const EXAMS = [
  // Engineering
  { name:"JEE Main",        category:"Engineering", date:"Jan 22 – Apr 8, 2026",   status:"Ongoing",    link:"https://jeemain.nta.nic.in" },
  { name:"JEE Advanced",    category:"Engineering", date:"May 18, 2026",           status:"Upcoming",   link:"https://jeeadv.ac.in" },
  { name:"BITSAT",          category:"Engineering", date:"May 21 – Jun 3, 2026",   status:"Upcoming",   link:"https://bitsadmission.com" },
  { name:"VITEEE",          category:"Engineering", date:"Apr 17 – 26, 2026",      status:"Upcoming",   link:"https://viteee.vit.ac.in" },
  { name:"SRMJEEE",         category:"Engineering", date:"Apr 14 – 20, 2026",      status:"Upcoming",   link:"https://srmist.edu.in" },
  { name:"MHT CET",         category:"Engineering", date:"Apr 29 – May 14, 2026",  status:"Upcoming",   link:"https://mahacet.org" },
  { name:"KCET",            category:"Engineering", date:"Apr 16 – 17, 2026",      status:"Upcoming",   link:"https://kea.kar.nic.in" },
  { name:"WBJEE",           category:"Engineering", date:"Apr 20, 2026",           status:"Upcoming",   link:"https://wbjeeb.nic.in" },
  { name:"COMEDK UGET",     category:"Engineering", date:"May 10, 2026",           status:"Upcoming",   link:"https://comedk.org" },
  // Medical
  { name:"NEET UG",         category:"Medical",     date:"May 4, 2026",            status:"Upcoming",   link:"https://neet.nta.nic.in" },
  { name:"NEET PG",         category:"Medical",     date:"Jun 15, 2026",           status:"Upcoming",   link:"https://nbe.edu.in" },
  { name:"JIPMER",          category:"Medical",     date:"Jun 1, 2026",            status:"Upcoming",   link:"https://jipmer.edu.in" },
  { name:"AIIMS MBBS",      category:"Medical",     date:"Via NEET UG",            status:"Info",       link:"https://aiimsexams.ac.in" },
  // Management
  { name:"CAT",             category:"Management",  date:"Nov 24, 2026",           status:"Upcoming",   link:"https://iimcat.ac.in" },
  { name:"XAT",             category:"Management",  date:"Jan 5, 2026",            status:"Completed",  link:"https://xatonline.in" },
  { name:"CMAT",            category:"Management",  date:"Mar 22, 2026",           status:"Ongoing",    link:"https://nta.ac.in/cmat" },
  { name:"MAT",             category:"Management",  date:"Every 2 months",         status:"Ongoing",    link:"https://mat.aima.in" },
  { name:"NMAT",            category:"Management",  date:"Oct – Dec 2026",         status:"Upcoming",   link:"https://nmat.org" },
  // Law
  { name:"CLAT",            category:"Law",         date:"Dec 1, 2026",            status:"Upcoming",   link:"https://consortiumofnlus.ac.in" },
  { name:"AILET",           category:"Law",         date:"Dec 1, 2026",            status:"Upcoming",   link:"https://nludelhi.ac.in" },
  { name:"DU LLB",          category:"Law",         date:"Jun 14, 2026",           status:"Upcoming",   link:"https://legalaid.du.ac.in" },
  { name:"AP LAWCET",       category:"Law",         date:"May 2026",               status:"Upcoming",   link:"https://aplawcet.apcfss.in" },
  // CS
  { name:"GATE CS",         category:"Computer Science", date:"Feb 1 – 16, 2026",  status:"Completed",  link:"https://gate2026.iitr.ac.in" },
  { name:"NIMCET",          category:"Computer Science", date:"Jun 14, 2026",       status:"Upcoming",   link:"https://nimcet.in" },
  { name:"CUET PG",         category:"Computer Science", date:"Mar 13 – 31, 2026",  status:"Ongoing",    link:"https://cuet.nta.nic.in" },
  // Government
  { name:"UPSC CSE",        category:"Government",  date:"May 25, 2026 (Prelims)", status:"Upcoming",   link:"https://upsc.gov.in" },
  { name:"SSC CGL",         category:"Government",  date:"Sep – Oct 2026",         status:"Upcoming",   link:"https://ssc.nic.in" },
  { name:"IBPS PO",         category:"Government",  date:"Oct 2026",               status:"Upcoming",   link:"https://ibps.in" },
  { name:"RRB NTPC",        category:"Government",  date:"Apr – Jun 2026",         status:"Upcoming",   link:"https://rrbapply.gov.in" },
];

const STATUS_COLORS = {
  Upcoming:  "bg-blue-100 text-blue-700",
  Ongoing:   "bg-green-100 text-green-700",
  Completed: "bg-gray-100 text-gray-600",
  Info:      "bg-yellow-100 text-yellow-700",
};

const CATEGORIES = ["All","Engineering","Medical","Management","Law","Computer Science","Government"];

export default function ExamCalendar() {
  const [search, setSearch]     = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus]     = useState("All");

  const filtered = EXAMS.filter(e => {
    const matchCat    = category === "All" || e.category === category;
    const matchStatus = status   === "All" || e.status   === status;
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchStatus && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-700 text-white py-12 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <Calendar className="w-10 h-10 mx-auto mb-3 opacity-90" />
          <h1 className="text-3xl font-black mb-2">Exam Calendar 2026</h1>
          <p className="text-violet-100 text-sm max-w-xl mx-auto">
            All major entrance exams — dates, schedule and official links
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">

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
            {["All","Upcoming","Ongoing","Completed"].map(s=>(
              <button key={s} onClick={()=>setStatus(s)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition
                  ${status===s?"bg-gray-800 text-white":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
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
                className="grid grid-cols-12 gap-2 px-5 py-4 hover:bg-gray-50 transition items-center">
                <div className="col-span-4 font-semibold text-gray-900 text-sm">{exam.name}</div>
                <div className="col-span-2">
                  <span className="text-xs text-gray-500">{exam.category}</span>
                </div>
                <div className="col-span-3 flex items-center gap-1.5 text-sm text-gray-600">
                  <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0"/>
                  {exam.date}
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
      </div>
    </div>
  );
}