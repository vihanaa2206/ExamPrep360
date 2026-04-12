import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, BookOpen, Building2, SlidersHorizontal, X } from "lucide-react";

// Static exam data for search
const ALL_EXAMS = [
  { _id:"1", name:"JEE Main",       slug:"jee-main",       category:"Engineering",     level:"National",     body:"NTA" },
  { _id:"2", name:"JEE Advanced",   slug:"jee-advanced",   category:"Engineering",     level:"National",     body:"IIT" },
  { _id:"3", name:"BITSAT",         slug:"bitsat",         category:"Engineering",     level:"University",   body:"BITS Pilani" },
  { _id:"4", name:"VITEEE",         slug:"viteee",         category:"Engineering",     level:"University",   body:"VIT" },
  { _id:"5", name:"SRMJEEE",        slug:"srmjeee",        category:"Engineering",     level:"University",   body:"SRM" },
  { _id:"6", name:"COMEDK UGET",    slug:"comedk-uget",    category:"Engineering",     level:"State",        body:"COMEDK" },
  { _id:"7", name:"WBJEE",          slug:"wbjee",          category:"Engineering",     level:"State",        body:"WBJEEB" },
  { _id:"8", name:"MHT CET",        slug:"mht-cet",        category:"Engineering",     level:"State",        body:"CET Cell MH" },
  { _id:"9", name:"KCET",           slug:"kcet",           category:"Engineering",     level:"State",        body:"KEA" },
  { _id:"10",name:"NEET UG",        slug:"neet-ug",        category:"Medical",         level:"National",     body:"NTA" },
  { _id:"11",name:"NEET PG",        slug:"neet-pg",        category:"Medical",         level:"National",     body:"NBE" },
  { _id:"12",name:"AFMC",           slug:"afmc",           category:"Medical",         level:"National",     body:"AFMC Pune" },
  { _id:"13",name:"GATE CS",        slug:"gate-cs",        category:"Computer Science",level:"National",     body:"IIT" },
  { _id:"14",name:"NIMCET",         slug:"nimcet",         category:"Computer Science",level:"National",     body:"NITs" },
  { _id:"15",name:"CUET PG",        slug:"cuet-pg",        category:"Computer Science",level:"National",     body:"NTA" },
  { _id:"16",name:"IIT JAM",        slug:"jam",            category:"Computer Science",level:"National",     body:"IIT" },
  { _id:"17",name:"TANCET",         slug:"tancet",         category:"Computer Science",level:"State",        body:"Anna University" },
  { _id:"18",name:"CLAT",           slug:"clat",           category:"Law",             level:"National",     body:"Consortium NLUs" },
  { _id:"19",name:"AILET",          slug:"ailet",          category:"Law",             level:"University",   body:"NLU Delhi" },
  { _id:"20",name:"DU LLB",         slug:"du-llb",         category:"Law",             level:"University",   body:"Delhi University" },
  { _id:"21",name:"CAT",            slug:"cat",            category:"Management",      level:"National",     body:"IIMs" },
  { _id:"22",name:"XAT",            slug:"xat",            category:"Management",      level:"National",     body:"XLRI" },
  { _id:"23",name:"MAT",            slug:"mat",            category:"Management",      level:"National",     body:"AIMA" },
  { _id:"24",name:"CMAT",           slug:"cmat",           category:"Management",      level:"National",     body:"NTA" },
  { _id:"25",name:"NMAT",           slug:"nmat",           category:"Management",      level:"National",     body:"GMAC" },
  { _id:"26",name:"UPSC CSE",       slug:"upsc",           category:"Government",      level:"National",     body:"UPSC" },
  { _id:"27",name:"SSC CGL",        slug:"ssc-cgl",        category:"Government",      level:"National",     body:"SSC" },
  { _id:"28",name:"IBPS PO",        slug:"ibps-po",        category:"Government",      level:"National",     body:"IBPS" },
  { _id:"29",name:"RRB NTPC",       slug:"rrb-ntpc",       category:"Government",      level:"National",     body:"RRB" },
];

const ALL_COLLEGES = [
  { _id:"c1", name:"IIT Bombay",     slug:"iit-bombay",     category:"Engineering",     type:"Government" },
  { _id:"c2", name:"IIT Delhi",      slug:"iit-delhi",      category:"Engineering",     type:"Government" },
  { _id:"c3", name:"NIT Trichy",     slug:"nit-trichy",     category:"Engineering",     type:"Government" },
  { _id:"c4", name:"BITS Pilani",    slug:"bits-pilani",    category:"Engineering",     type:"Private" },
  { _id:"c5", name:"VIT Vellore",    slug:"vit-vellore",    category:"Engineering",     type:"Private" },
  { _id:"c6", name:"AIIMS Delhi",    slug:"aiims-delhi",    category:"Medical",         type:"Government" },
  { _id:"c7", name:"JIPMER",         slug:"jipmer-puducherry",category:"Medical",       type:"Government" },
  { _id:"c8", name:"IIM Ahmedabad",  slug:"iim-ahmedabad",  category:"Management",      type:"Government" },
  { _id:"c9", name:"IIM Bangalore",  slug:"iim-bangalore",  category:"Management",      type:"Government" },
  { _id:"c10",name:"XLRI Jamshedpur",slug:"xlri-jamshedpur",category:"Management",      type:"Private" },
  { _id:"c11",name:"NLSIU Bangalore",slug:"nlsiu-bangalore",category:"Law",             type:"Government" },
  { _id:"c12",name:"NLU Delhi",      slug:"nlu-delhi",      category:"Law",             type:"Government" },
  { _id:"c13",name:"IISc Bangalore", slug:"iisc-bangalore", category:"Computer Science",type:"Government" },
  { _id:"c14",name:"IIIT Hyderabad", slug:"iiit-hyderabad", category:"Computer Science",type:"Private" },
  { _id:"c15",name:"LBSNAA Mussoorie",slug:"lbsnaa-mussoorie",category:"Government",    type:"Government" },
];

const CAT_COLOR = {
  Engineering:       "bg-blue-100 text-blue-700",
  Medical:           "bg-green-100 text-green-700",
  Management:        "bg-purple-100 text-purple-700",
  Law:               "bg-amber-100 text-amber-700",
  "Computer Science":"bg-cyan-100 text-cyan-700",
  Government:        "bg-red-100 text-red-700",
};

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();

  const query = searchParams.get("q") || "";
  const [inputVal, setInputVal] = useState(query);

  const q = query.toLowerCase().trim();

  const examResults = q
    ? ALL_EXAMS.filter(e =>
        e.name.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        e.body.toLowerCase().includes(q)
      )
    : ALL_EXAMS;

  const collegeResults = q
    ? ALL_COLLEGES.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      )
    : ALL_COLLEGES;

  const totalResults = examResults.length + collegeResults.length;

  const handleSearch = (e) => {
    if (e.key === "Enter" && inputVal.trim()) {
      setSearchParams({ q: inputVal.trim() });
    }
  };

  const showExams    = activeTab === "all" || activeTab === "exams";
  const showColleges = activeTab === "all" || activeTab === "colleges";

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Search bar */}
      <div className="bg-white border-b border-gray-200 py-4 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Search Colleges, Exams, Schools & more"
              className="w-full pl-12 pr-12 py-3.5 bg-gray-100 rounded-xl text-sm outline-none
                         focus:ring-2 focus:ring-blue-200 focus:bg-white transition"
            />
            {inputVal && (
              <button onClick={() => { setInputVal(""); setSearchParams({}); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* Result summary + tabs */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div>
            {query ? (
              <h2 className="text-lg font-bold text-gray-900">
                {totalResults} results for{" "}
                <span className="text-blue-600">"{query}"</span>
              </h2>
            ) : (
              <h2 className="text-lg font-bold text-gray-900">All Exams & Colleges</h2>
            )}
            <p className="text-sm text-gray-500">
              {examResults.length} exams · {collegeResults.length} colleges
            </p>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
            {[
              { key: "all",      label: "All Results" },
              { key: "exams",    label: `Exams (${examResults.length})` },
              { key: "colleges", label: `Colleges (${collegeResults.length})` },
            ].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition
                  ${activeTab === tab.key
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"}`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {totalResults === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-xl font-bold text-gray-700 mb-2">No results found</p>
            <p className="text-gray-400 text-sm">Try different keywords or browse by stream</p>
            <button onClick={() => navigate("/")}
              className="mt-6 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition">
              Go to Home
            </button>
          </div>
        ) : (
          <div className="space-y-6">

            {/* EXAMS section */}
            {showExams && examResults.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-4 h-4 text-blue-500" />
                  <h3 className="font-bold text-gray-900">Exams</h3>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                    {examResults.length}
                  </span>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {examResults.map(exam => (
                    <div key={exam._id}
                      onClick={() => navigate(`/exam/${exam.slug}`)}
                      className="bg-white border border-gray-200 rounded-xl p-4 cursor-pointer
                                 hover:shadow-md hover:border-blue-200 transition-all group">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {exam.name}
                        </h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ml-2
                          ${CAT_COLOR[exam.category] || "bg-gray-100 text-gray-700"}`}>
                          {exam.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{exam.body}</span>
                        <span>•</span>
                        <span>{exam.level} Level</span>
                      </div>
                      <p className="text-xs text-blue-600 font-medium mt-2 group-hover:underline">
                        View Details →
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* COLLEGES section */}
            {showColleges && collegeResults.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="w-4 h-4 text-green-500" />
                  <h3 className="font-bold text-gray-900">Colleges</h3>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                    {collegeResults.length}
                  </span>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {collegeResults.map(college => (
                    <div key={college._id}
                      onClick={() => navigate(`/college/${college.slug}`)}
                      className="bg-white border border-gray-200 rounded-xl p-4 cursor-pointer
                                 hover:shadow-md hover:border-green-200 transition-all group">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                          {college.name}
                        </h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ml-2
                          ${CAT_COLOR[college.category] || "bg-gray-100 text-gray-700"}`}>
                          {college.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className={`font-medium ${college.type === "Government" ? "text-green-600" : "text-orange-600"}`}>
                          {college.type}
                        </span>
                      </div>
                      <p className="text-xs text-green-600 font-medium mt-2 group-hover:underline">
                        View College →
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
