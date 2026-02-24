import { useEffect, useState } from "react";
import API from "../../services/api";

export default function AdminExams() {
  const [exams, setExams] = useState([]);

  const fetchExams = async () => {
    try {
      const res = await API.get("/exams");
      setExams(res.data);
    } catch (err) {
      console.error("Failed to fetch exams");
    }
  };

  const deleteExam = async (id) => {
    if (!window.confirm("Delete this exam?")) return;

    try {
      await API.delete(`/exams/${id}`);
      fetchExams();
    } catch (err) {
      alert("Delete failed");
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Exams</h2>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Title</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {exams.map((exam) => (
            <tr key={exam.id}>
              <td className="border p-2">{exam.title}</td>
              <td className="border p-2">{exam.category}</td>
              <td className="border p-2">
                <button
                  onClick={() => deleteExam(exam.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
