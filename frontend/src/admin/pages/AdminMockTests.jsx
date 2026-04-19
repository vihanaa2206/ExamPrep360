import { useState, useEffect } from "react";
import {
  Plus, Trash2, Edit3, Save, X, ChevronDown, ChevronUp,
  Search, BookOpen, RefreshCw, ClipboardList, CheckCircle,
  FileQuestion, PlusCircle, Filter,
} from "lucide-react";

const API = "https://examprep360-production.up.railway.app/api";

const EXAM_CATEGORIES = {
  Engineering:        ["JEE Main","JEE Advanced","BITSAT","VITEEE","SRMJEEE","WBJEE"],
  Medical:            ["NEET UG","NEET PG","JIPMER","AFMC"],
  Management:         ["CAT","XAT","CMAT","MAT","NMAT"],
  "Computer Science": ["GATE CS","NIMCET","CUET PG","IIT JAM","TANCET"],
  Law:                ["CLAT","AILET","DU LLB","AP LAWCET"],
  Government:         ["UPSC CSE","SSC CGL","IBPS PO","RRB NTPC"],
};

const ALL_EXAMS = Object.values(EXAM_CATEGORIES).flat();
const DIFFICULTIES = ["Easy","Medium","High"];

const CATEGORY_COLORS = {
  Engineering:        "bg-blue-100 text-blue-700 border-blue-200",
  Medical:            "bg-green-100 text-green-700 border-green-200",
  Management:         "bg-purple-100 text-purple-700 border-purple-200",
  "Computer Science": "bg-cyan-100 text-cyan-700 border-cyan-200",
  Law:                "bg-amber-100 text-amber-700 border-amber-200",
  Government:         "bg-rose-100 text-rose-700 border-rose-200",
};

const CATEGORY_BG = {
  Engineering:        "from-blue-500 to-indigo-600",
  Medical:            "from-green-500 to-emerald-600",
  Management:         "from-purple-500 to-violet-600",
  "Computer Science": "from-cyan-500 to-blue-500",
  Law:                "from-amber-500 to-orange-500",
  Government:         "from-rose-500 to-pink-600",
};

const DIFF_COLORS = {
  Easy:   "bg-green-100 text-green-700",
  Medium: "bg-yellow-100 text-yellow-700",
  High:   "bg-red-100 text-red-700",
};

function getCategoryForExam(examName) {
  for (const [cat, exams] of Object.entries(EXAM_CATEGORIES)) {
    if (exams.includes(examName)) return cat;
  }
  return null;
}

const BLANK_Q = {
  exam_name:"", test_no:1, subject:"", difficulty:"Medium",
  question_text:"", options:["","","",""], correct_option:"", timer_seconds:90,
};

export default function AdminMockTests() {
  const [exams, setExams]         = useState([]);
  const [selExam, setSelExam]     = useState("");
  const [selTest, setSelTest]     = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading]     = useState(false);
  const [search, setSearch]       = useState("");
  const [examSearch, setExamSearch] = useState("");
  const [selCategory, setSelCategory] = useState("all");
  const [toast, setToast]         = useState(null);
  const [expandedQ, setExpandedQ] = useState(null);
  const [saving, setSaving]       = useState(false);
  const [showAddQ, setShowAddQ]       = useState(false);
  const [showAddTest, setShowAddTest] = useState(false);
  const [editQ, setEditQ]             = useState(null);
  const [newQ, setNewQ]               = useState({...BLANK_Q});
  const [newTestExam, setNewTestExam] = useState("");
  const [newTestNo, setNewTestNo]     = useState("");

  const showToast = (msg, type="success") => {
    setToast({msg,type});
    setTimeout(()=>setToast(null),3000);
  };

  const fetchExams = () => {
    fetch(`${API}/mock/exams`)
      .then(r=>r.json()).then(setExams).catch(()=>{});
  };

  const fetchQuestions = (exam, test) => {
    if(!exam||!test) return;
    setLoading(true);
    fetch(`${API}/mock/questions/${encodeURIComponent(exam)}/${test}`)
      .then(r=>r.json())
      .then(data=>{setQuestions(data);setLoading(false);})
      .catch(()=>setLoading(false));
  };

  useEffect(()=>{fetchExams();},[]);

  const examTests = exams.find(e=>e.exam_name===selExam);
  const testCount = examTests?.test_count || 0;

  // ✅ Filter exams list by category + search
  const filteredExams = exams.filter(e => {
    const cat = getCategoryForExam(e.exam_name);
    const matchCat = selCategory === "all" || cat === selCategory;
    const matchSearch = !examSearch || e.exam_name.toLowerCase().includes(examSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  const filteredQuestions = questions.filter(q =>
    !search || q.question_text?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddQ = async () => {
    if (!newQ.exam_name||!newQ.question_text||!newQ.correct_option)
      return showToast("Fill all required fields","error");
    if (!newQ.options.every(o=>o.trim()))
      return showToast("All 4 options required","error");
    setSaving(true);
    try {
      const res = await fetch(`${API}/mock/questions/add`,{
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({...newQ, test_no:parseInt(newQ.test_no), timer_seconds:parseInt(newQ.timer_seconds)}),
      });
      if(res.ok){
        showToast("Question added!");
        setShowAddQ(false); setNewQ({...BLANK_Q});
        if(selExam===newQ.exam_name&&selTest===parseInt(newQ.test_no))
          fetchQuestions(selExam,selTest);
        fetchExams();
      } else showToast("Failed","error");
    } catch { showToast("Network error","error"); }
    setSaving(false);
  };

  const handleEditQ = async () => {
    if(!editQ.question_text||!editQ.correct_option)
      return showToast("Fill all required fields","error");
    setSaving(true);
    try {
      const res = await fetch(`${API}/mock/questions/${editQ.question_id}/update`,{
        method:"PUT", headers:{"Content-Type":"application/json"},
        body:JSON.stringify(editQ),
      });
      if(res.ok){
        showToast("Updated!"); setEditQ(null);
        fetchQuestions(selExam,selTest);
      } else showToast("Failed","error");
    } catch { showToast("Network error","error"); }
    setSaving(false);
  };

  const handleDeleteQ = async (q) => {
    if(!window.confirm(`Delete question ${q.question_id}?`)) return;
    try {
      const res = await fetch(`${API}/mock/questions/${q.question_id}/delete`,{
        method:"DELETE", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({exam_name:q.exam_name,test_no:q.test_no}),
      });
      if(res.ok){showToast("Deleted!"); fetchQuestions(selExam,selTest); fetchExams();}
      else showToast("Failed","error");
    } catch { showToast("Network error","error"); }
  };

  const handleDeleteTest = async () => {
    if(!window.confirm(`Delete ALL questions from ${selExam} Test ${selTest}?`)) return;
    try {
      const res = await fetch(`${API}/mock/test/delete`,{
        method:"DELETE", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({exam_name:selExam,test_no:selTest}),
      });
      if(res.ok){
        showToast("Test deleted!");
        setSelTest(null); setQuestions([]);
        fetchExams();
      } else showToast("Failed","error");
    } catch { showToast("Network error","error"); }
  };

  const QForm = ({data, setData, onSave, onCancel, title}) => (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <h3 className="font-black text-lg">{title}</h3>
          <button onClick={onCancel}><X className="w-5 h-5"/></button>
        </div>
        <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">Exam *</label>
              <select value={data.exam_name} onChange={e=>setData({...data,exam_name:e.target.value})}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100">
                <option value="">Select exam</option>
                {Object.entries(EXAM_CATEGORIES).map(([cat, exs]) => (
                  <optgroup key={cat} label={cat}>
                    {exs.map(e=><option key={e} value={e}>{e}</option>)}
                  </optgroup>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">Test No *</label>
              <input type="number" min="1" value={data.test_no}
                onChange={e=>setData({...data,test_no:e.target.value})}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100"/>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">Subject</label>
              <input value={data.subject} onChange={e=>setData({...data,subject:e.target.value})}
                placeholder="e.g. Physics"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100"/>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">Difficulty</label>
              <select value={data.difficulty} onChange={e=>setData({...data,difficulty:e.target.value})}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100">
                {DIFFICULTIES.map(d=><option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block">Question Text *</label>
            <textarea rows={3} value={data.question_text}
              onChange={e=>setData({...data,question_text:e.target.value})}
              placeholder="Enter full question..."
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 resize-none"/>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 mb-2 block">Options (A, B, C, D) *</label>
            <div className="space-y-2">
              {["A","B","C","D"].map((lbl,i)=>(
                <div key={i} className="flex items-center gap-2">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0
                    ${data.correct_option===(data.options[i]||"")&&data.options[i]
                      ?"bg-green-500 text-white":"bg-blue-100 text-blue-600"}`}>{lbl}</span>
                  <input value={data.options[i]||""} placeholder={`Option ${lbl}`}
                    onChange={e=>{
                      const opts=[...(data.options||["","","",""])];
                      opts[i]=e.target.value; setData({...data,options:opts});
                    }}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100"/>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block">
              Explanation <span className="text-gray-400 font-normal">(shown after submission)</span>
            </label>
            <textarea rows={2} value={data.reason||""}
              onChange={e=>setData({...data,reason:e.target.value})}
              placeholder="Brief explanation why this answer is correct..."
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 resize-none"/>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">Correct Answer *</label>
              <select value={data.correct_option} onChange={e=>setData({...data,correct_option:e.target.value})}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100">
                <option value="">Select correct option</option>
                {(data.options||[]).filter(o=>o.trim()).map((o,i)=>(
                  <option key={i} value={o}>{o.slice(0,50)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">Timer (seconds)</label>
              <input type="number" value={data.timer_seconds}
                onChange={e=>setData({...data,timer_seconds:e.target.value})}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100"/>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3 bg-gray-50">
          <button onClick={onCancel}
            className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-white transition">
            Cancel
          </button>
          <button onClick={onSave} disabled={saving}
            className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl
                       text-sm font-bold hover:opacity-90 flex items-center justify-center gap-2">
            {saving ? <RefreshCw className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>}
            {saving ? "Saving..." : "Save Question"}
          </button>
        </div>
      </div>
    </div>
  );

  const selectedCategory = getCategoryForExam(selExam);
  const catGrad = selectedCategory ? CATEGORY_BG[selectedCategory] : "from-blue-500 to-indigo-600";

  return (
    <div className="space-y-6">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-2xl shadow-2xl text-sm font-bold flex items-center gap-2
          ${toast.type==="error"?"bg-red-500 text-white":"bg-green-500 text-white"}`}>
          {toast.type==="error"?<X className="w-4 h-4"/>:<CheckCircle className="w-4 h-4"/>}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <ClipboardList className="w-7 h-7 text-blue-500"/> Mock Test Management
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">{exams.length} exams · {exams.reduce((a,e)=>a+(e.total_questions||0),0)} total questions</p>
        </div>
        <button onClick={()=>{setNewQ({...BLANK_Q});setShowAddQ(true);}}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600
                     text-white rounded-xl text-sm font-bold hover:opacity-90 transition shadow-lg shadow-blue-200">
          <Plus className="w-4 h-4"/> Add Question
        </button>
      </div>

      {/* Category filter chips */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelCategory("all")}
          className={`px-4 py-2 rounded-xl text-xs font-bold border transition
            ${selCategory === "all" ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"}`}
        >
          All Categories
        </button>
        {Object.keys(EXAM_CATEGORIES).map(cat => (
          <button key={cat}
            onClick={() => setSelCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition
              ${selCategory === cat
                ? `${CATEGORY_COLORS[cat]} border-current`
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Exam + Test selector */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wide flex items-center gap-1">
              <Filter className="w-3 h-3"/> Select Exam
              {selCategory !== "all" && (
                <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] ${CATEGORY_COLORS[selCategory]}`}>
                  {selCategory}
                </span>
              )}
            </label>

            {/* Exam search */}
            <div className="relative mb-2">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400"/>
              <input
                value={examSearch}
                onChange={e => setExamSearch(e.target.value)}
                placeholder="Search exam..."
                className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Exam list as scrollable cards */}
            <div className="max-h-52 overflow-y-auto space-y-1.5 pr-1">
              {filteredExams.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-4">No exams found</p>
              ) : filteredExams.map(e => {
                const cat = getCategoryForExam(e.exam_name);
                const isSelected = selExam === e.exam_name;
                return (
                  <button
                    key={e.exam_name}
                    onClick={() => { setSelExam(e.exam_name); setSelTest(null); setQuestions([]); }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border transition text-left
                      ${isSelected
                        ? "border-blue-400 bg-blue-50"
                        : "border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50/50"}`}
                  >
                    <div className="flex items-center gap-2">
                      {cat && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${CATEGORY_COLORS[cat]}`}>
                          {cat}
                        </span>
                      )}
                      <span className={`text-sm font-semibold ${isSelected ? "text-blue-700" : "text-gray-800"}`}>
                        {e.exam_name}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0">
                      {e.test_count} test{e.test_count>1?"s":""} · {e.total_questions} Qs
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {selExam && (
            <div>
              <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wide">
                Select Test — <span className="text-blue-600">{selExam}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {Array.from({length:testCount},(_,i)=>i+1).map(t=>(
                  <button key={t} onClick={()=>{setSelTest(t);fetchQuestions(selExam,t);}}
                    className={`px-4 py-2.5 rounded-xl text-sm font-bold transition border-2
                      ${selTest===t
                        ? `bg-gradient-to-r ${catGrad} text-white border-transparent shadow-md`
                        : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"}`}>
                    Test {t}
                  </button>
                ))}
                <button onClick={()=>setShowAddTest(true)}
                  className="px-4 py-2.5 rounded-xl text-sm font-bold border-2 border-dashed border-gray-300
                             text-gray-500 hover:border-blue-400 hover:text-blue-500 transition flex items-center gap-1.5">
                  <PlusCircle className="w-4 h-4"/> New Test
                </button>
              </div>

              {/* Selected exam summary */}
              {examTests && (
                <div className={`mt-4 p-3 rounded-xl bg-gradient-to-r ${catGrad} text-white`}>
                  <div className="text-xs font-bold opacity-80 uppercase tracking-wide">{selExam}</div>
                  <div className="flex gap-4 mt-1">
                    <span className="text-sm font-black">{examTests.test_count} Tests</span>
                    <span className="text-sm font-black">{examTests.total_questions} Questions</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Questions panel */}
      {selExam && selTest && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className={`px-5 py-4 bg-gradient-to-r ${catGrad} text-white`}>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center font-black text-sm">
                  {selTest}
                </div>
                <div>
                  <h2 className="font-black">{selExam} — Test {selTest}</h2>
                  <p className="text-xs opacity-80">{filteredQuestions.length} questions</p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-white/60"/>
                  <input value={search} onChange={e=>setSearch(e.target.value)}
                    placeholder="Search questions..."
                    className="pl-8 pr-3 py-2 bg-white/20 border border-white/30 rounded-lg text-xs outline-none text-white placeholder-white/60 w-44"/>
                </div>
                <button onClick={()=>fetchQuestions(selExam,selTest)}
                  className="p-2 bg-white/20 border border-white/30 rounded-lg hover:bg-white/30 transition">
                  <RefreshCw className="w-4 h-4 text-white"/>
                </button>
                <button onClick={handleDeleteTest}
                  className="flex items-center gap-1.5 px-3 py-2 bg-red-500 text-white rounded-lg text-xs font-bold hover:bg-red-600 transition">
                  <Trash2 className="w-3.5 h-3.5"/> Delete Test
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <RefreshCw className="w-8 h-8 text-blue-300 animate-spin mx-auto mb-2"/>
              <p className="text-gray-400 text-sm">Loading questions...</p>
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="text-center py-16">
              <FileQuestion className="w-12 h-12 text-gray-200 mx-auto mb-3"/>
              <p className="text-gray-500 font-semibold">No questions found</p>
              <button onClick={()=>{setNewQ({...BLANK_Q,exam_name:selExam,test_no:selTest});setShowAddQ(true);}}
                className="mt-3 text-sm text-blue-600 hover:underline">
                + Add first question
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 max-h-[550px] overflow-y-auto">
              {filteredQuestions.map((q,i)=>(
                <div key={i} className="hover:bg-gray-50 transition">
                  <div className="px-5 py-4 flex items-start gap-3">
                    <span className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5
                      bg-gradient-to-br ${catGrad} text-white`}>
                      {q.question_id||i+1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        {q.subject && (
                          <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-medium">
                            {q.subject}
                          </span>
                        )}
                        {q.difficulty && (
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${DIFF_COLORS[q.difficulty]||"bg-gray-100 text-gray-600"}`}>
                            {q.difficulty}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-900 font-medium leading-relaxed line-clamp-2">
                        {q.question_text}
                      </p>
                      {expandedQ===i && (
                        <div className="mt-3 grid grid-cols-1 gap-1.5">
                          {(q.options||[]).map((opt,oi)=>(
                            <div key={oi} className={`text-xs px-3 py-2 rounded-lg border
                              ${opt===q.correct_option
                                ?"bg-green-50 border-green-300 text-green-800 font-semibold"
                                :"bg-white border-gray-200 text-gray-600"}`}>
                              {opt===q.correct_option&&"✓ "}{opt}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={()=>setExpandedQ(expandedQ===i?null:i)}
                        className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition">
                        {expandedQ===i?<ChevronUp className="w-4 h-4"/>:<ChevronDown className="w-4 h-4"/>}
                      </button>
                      <button onClick={()=>setEditQ({...q})}
                        className="p-1.5 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition">
                        <Edit3 className="w-4 h-4"/>
                      </button>
                      <button onClick={()=>handleDeleteQ(q)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                        <Trash2 className="w-4 h-4"/>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
            <p className="text-xs text-gray-400">{questions.length} total questions</p>
            <button
              onClick={()=>{setNewQ({...BLANK_Q,exam_name:selExam,test_no:selTest});setShowAddQ(true);}}
              className="flex items-center gap-1.5 text-xs text-blue-600 font-bold hover:underline">
              <Plus className="w-3.5 h-3.5"/> Add Question to Test {selTest}
            </button>
          </div>
        </div>
      )}

      {/* Add Test Modal */}
      {showAddTest && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <h3 className="font-black text-gray-900 text-lg mb-1">Add New Test</h3>
            <p className="text-sm text-gray-400 mb-4">Create a new mock test for an exam</p>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Exam</label>
                <select value={newTestExam} onChange={e=>setNewTestExam(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100">
                  <option value="">Select exam</option>
                  {Object.entries(EXAM_CATEGORIES).map(([cat, exs]) => (
                    <optgroup key={cat} label={cat}>
                      {exs.map(e=><option key={e} value={e}>{e}</option>)}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Test Number</label>
                <input type="number" min="1" value={newTestNo}
                  onChange={e=>setNewTestNo(e.target.value)}
                  placeholder="e.g. 4"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100"/>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={()=>{setShowAddTest(false);setNewTestExam("");setNewTestNo("");}}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600">
                Cancel
              </button>
              <button onClick={()=>{
                if(!newTestExam||!newTestNo) return showToast("Select exam and test number","error");
                setNewQ({...BLANK_Q,exam_name:newTestExam,test_no:parseInt(newTestNo)});
                setSelExam(newTestExam);
                setSelTest(parseInt(newTestNo));
                setShowAddTest(false);
                setShowAddQ(true);
                setNewTestExam(""); setNewTestNo("");
              }}
                className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700">
                Create & Add Questions
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddQ && <QForm title="Add New Question" data={newQ} setData={setNewQ} onSave={handleAddQ} onCancel={()=>setShowAddQ(false)}/>}
      {editQ     && <QForm title="Edit Question"   data={editQ} setData={setEditQ} onSave={handleEditQ} onCancel={()=>setEditQ(null)}/>}
    </div>
  );
}