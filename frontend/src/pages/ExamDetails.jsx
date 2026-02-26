import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

export default function ExamDetails() {
  const { slug } = useParams();
  const [exam, setExam] = useState(null);
  const [activeTab, setActiveTab] = useState("application");

  useEffect(() => {
    // FIX: baseURL handles the /api prefix
    API.get(`/exams/${slug}`)
      .then((res) => setExam(res.data))
      .catch((err) => console.error("Fetch Error:", err));
  }, [slug]);

  if (!exam) return <div className="p-20 text-center font-bold">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-10">
      <h1 className="text-4xl font-bold mb-6 uppercase tracking-tight">{exam.name}</h1>
      <div className="flex gap-2 overflow-x-auto pb-4 border-b">
        {Object.keys(exam.tabs || {}).map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-black uppercase ${activeTab === tab ? "bg-indigo-600 text-white" : "bg-gray-100"}`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="mt-6 p-10 bg-white border rounded-[2rem] shadow-xl min-h-[300px] whitespace-pre-line text-lg text-gray-700 leading-relaxed">
        {exam.tabs[activeTab]}
      </div>
    </div>
  );
}