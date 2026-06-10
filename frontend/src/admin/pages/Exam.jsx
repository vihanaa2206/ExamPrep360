import { useEffect, useState } from "react";
import API from "../../services/api";

export default function Exams() {
  const [exams, setExams] = useState([]);

  const fetchExams = async () => {
    const res = await API.get("/admin/exams", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setExams(res.data);
  };

  const deleteExam = async (id) => {
    await API.delete(`/admin/exams/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    fetchExams();
  };

  useEffect(() => {
    fetchExams();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">All Exams</h2>

      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Name</th>
            <th className="p-2">Category</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {exams.map((exam) => (
            <tr key={exam.id} className="border-t">
              <td className="p-2">{exam.name}</td>
              <td className="p-2">{exam.category}</td>
              <td className="p-2">
                <button
                  onClick={() => deleteExam(exam.id)}
                  className="text-red-600"
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

