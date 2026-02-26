import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";

export default function AdminEditExam() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    // FIX: baseURL mein /api pehle se hai, isliye yahan sirf /exams/${slug}
    API.get(`/exams/${slug}`)
      .then((res) => {
        // Syncing backend 'fullData' to 'tabs' state for the form
        setFormData({
          ...res.data,
          tabs: res.data.fullData || res.data.tabs || {}
        });
      })
      .catch((err) => {
        console.error("Error loading exam data:", err);
        alert("Failed to fetch exam data. Check terminal for 404.");
      });
  }, [slug]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // FIX: Yahan bhi path se /api hata diya gaya hai
      await API.put(`/exams/${formData._id}`, {
        name: formData.name,
        category: formData.category,
        level: formData.level,
        tabs: formData.tabs
      });
      alert("✅ Update Successful! Database Synchronized.");
      navigate("/admin/exams");
    } catch (err) {
      console.error("Update Error:", err);
      alert("❌ Update Failed. Check Backend Connection.");
    }
  };

  // Agar data fetch nahi hua toh ye dikhega, 
  // par naye path se ye turant hat kar form dikhayega.
  if (!formData) return <div className="p-20 text-center font-bold text-indigo-600 italic animate-pulse">🔄 Syncing with Database...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto min-screen-h">
      <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 border border-gray-100">
        <h2 className="text-3xl font-black mb-8 border-b-4 border-indigo-600 pb-4 inline-block uppercase tracking-tighter text-gray-800">
          Edit Exam: {formData.name}
        </h2>
        
        <form onSubmit={handleUpdate} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-black text-gray-400 mb-2 uppercase">Exam Name</label>
              <input 
                className="w-full border-4 border-gray-50 p-4 rounded-2xl text-xl font-bold focus:border-indigo-400 outline-none transition"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-black text-gray-400 mb-2 uppercase">Category</label>
              <input 
                className="w-full border-4 border-gray-50 p-4 rounded-2xl text-xl font-bold focus:border-indigo-400 outline-none transition"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-6">
            {Object.keys(formData.tabs).map((tab) => (
              <div key={tab} className="p-6 bg-indigo-50/30 rounded-[2rem] border border-indigo-50">
                <label className="block text-sm font-black text-indigo-600 mb-2 uppercase tracking-widest">{tab} Content</label>
                <textarea 
                  className="w-full border-2 border-white p-5 rounded-2xl h-48 focus:ring-8 focus:ring-indigo-100 outline-none transition text-gray-700 font-medium"
                  value={formData.tabs[tab] || ""}
                  onChange={(e) => setFormData({
                    ...formData,
                    tabs: { ...formData.tabs, [tab]: e.target.value }
                  })}
                />
              </div>
            ))}
          </div>

          <div className="flex gap-4 pt-4">
            <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-800 text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-95 text-xl uppercase tracking-widest">
              Save Professional Changes
            </button>
            <button type="button" onClick={() => navigate("/admin/exams")} className="px-10 bg-gray-200 text-gray-500 font-bold py-5 rounded-2xl hover:bg-gray-300 transition">
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}