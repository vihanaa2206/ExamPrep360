import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

export default function AdminExams() {
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();

  const fetchExams = async () => {
    try {
      // FIX: baseURL mein /api pehle se hai, isliye yahan sirf /exams
      const res = await API.get("/exams");
      setExams(res.data);
    } catch (err) { 
      console.error("404 Error Check:", err); 
    }
  };

  const deleteExam = async (exam) => {
    const id = exam._id || exam.slug;
    if (!window.confirm("Delete this exam?")) return;
    try {
      await API.delete(`/exams/${id}`);
      fetchExams();
    } catch (err) { alert("Delete failed"); }
  };

  useEffect(() => { fetchExams(); }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Manage Exams</h2>
        <button onClick={() => navigate("/admin/add-exam")} className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg">+ Add Exam</button>
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-5 font-bold text-gray-600">Name</th>
              <th className="p-5 font-bold text-gray-600">Slug</th>
              <th className="p-4 font-bold text-gray-600">Category</th>
              <th className="p-4 font-bold text-gray-600">Level</th>
              <th className="p-5 font-bold text-gray-600 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {exams.length > 0 ? exams.map((e) => (
              <tr key={e._id} className="hover:bg-indigo-50/50 transition">
                <td className="p-5 font-bold text-gray-800">{e.name}</td>
                <td className="p-5 text-indigo-600 font-mono text-sm">{e.slug}</td>
                <td className="p-4"><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs font-black uppercase">{e.category || "General"}</span></td>
                <td className="p-4"><span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-xs font-black uppercase">{e.level || "National"}</span></td>
                <td className="p-5 text-center flex gap-3 justify-center">
                  <button onClick={() => navigate(`/admin/edit-exam/${e.slug}`)} className="text-amber-600 border-2 border-amber-500 px-4 py-1 rounded-xl font-bold">Update</button>
                  <button onClick={() => deleteExam(e)} className="text-red-600 border-2 border-red-500 px-4 py-1 rounded-xl font-bold">Delete</button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="5" className="p-20 text-center text-gray-400 italic">No Exams Found. Check Terminal.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}