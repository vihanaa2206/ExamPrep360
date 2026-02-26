import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

export default function AdminAddExam() {
  const navigate = useNavigate();
  const [exam, setExam] = useState({
    name: "",
    slug: "",
    category: "Engineering",
    level: "National",
    tabs: {
      application: "",
      eligibility: "",
      syllabus: "",
      pattern: "",
      preparation: "",
      mockTests: "",
      pyqs: "",
      coaching: ""
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // baseURL handles /api, so we use /exams
      const res = await API.post("/exams", exam);
      if (res.status === 201) {
        alert("✅ Exam with all Details Added Successfully!");
        navigate("/admin/exams");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error: Check if Slug is unique and Backend is running.");
    }
  };

  const handleTabChange = (tabName, value) => {
    setExam({
      ...exam,
      tabs: { ...exam.tabs, [tabName]: value }
    });
  };

  return (
    <div className="p-8 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <h2 className="text-4xl font-black mb-8 text-gray-800 border-b-4 border-indigo-600 pb-2 inline-block uppercase">
        Create Full Exam Entry
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100">
        
        {/* BASIC DETAILS SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="font-bold text-gray-600 uppercase text-xs tracking-widest">Exam Full Name</label>
            <input 
              className="w-full border-4 border-gray-50 p-4 rounded-2xl focus:border-indigo-400 outline-none transition text-lg font-bold" 
              placeholder="e.g. JEE MAIN 2026" 
              onChange={e => setExam({...exam, name: e.target.value})} 
              required 
            />
          </div>
          <div className="space-y-2">
            <label className="font-bold text-gray-600 uppercase text-xs tracking-widest">Slug (Unique ID)</label>
            <input 
              className="w-full border-4 border-gray-50 p-4 rounded-2xl focus:border-indigo-400 outline-none transition text-lg font-mono" 
              placeholder="e.g. jee-main" 
              onChange={e => setExam({...exam, slug: e.target.value})} 
              required 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="font-bold text-gray-600 uppercase text-xs tracking-widest">Category</label>
            <select 
              className="w-full border-4 border-gray-50 p-4 rounded-2xl focus:border-indigo-400 outline-none font-bold"
              onChange={e => setExam({...exam, category: e.target.value})}
            >
              <option value="Engineering">Engineering</option>
              <option value="Medical">Medical</option>
              <option value="Management">Management</option>
              <option value="Law">Law</option>
              <option value="UPSC">UPSC/Govt</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="font-bold text-gray-600 uppercase text-xs tracking-widest">Level</label>
            <select 
              className="w-full border-4 border-gray-50 p-4 rounded-2xl focus:border-indigo-400 outline-none font-bold"
              onChange={e => setExam({...exam, level: e.target.value})}
            >
              <option value="National">National</option>
              <option value="State">State</option>
              <option value="International">International</option>
            </select>
          </div>
        </div>

        <hr className="border-2 border-gray-50" />

        {/* DETAILED CONTENT SECTION (8 TABS) */}
        <h3 className="text-xl font-black text-indigo-600 uppercase tracking-widest">Detailed Tab Content</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.keys(exam.tabs).map((tabKey) => (
            <div key={tabKey} className="space-y-2">
              <label className="font-black text-gray-400 uppercase text-[10px] tracking-widest">{tabKey} Section</label>
              <textarea 
                className="w-full border-2 border-gray-50 p-4 rounded-2xl h-40 focus:ring-4 focus:ring-indigo-50 outline-none transition font-medium text-gray-700"
                placeholder={`Enter details for ${tabKey}...`}
                onChange={e => handleTabChange(tabKey, e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="pt-6">
          <button 
            type="submit" 
            className="w-full bg-indigo-600 hover:bg-indigo-800 text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-indigo-200 transition-all active:scale-95 text-2xl uppercase tracking-widest"
          >
            🚀 Publish Exam to Live Portal
          </button>
        </div>
      </form>
    </div>
  );
}