import { useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function AddExam() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const navigate = useNavigate();

  const submitExam = async (e) => {
    e.preventDefault();

    await API.post(
      "/admin/exams",
      { name, category },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    navigate("/admin/exams");
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Add New Exam</h2>

      <form onSubmit={submitExam} className="space-y-4 max-w-md">
        <input
          type="text"
          placeholder="Exam Name"
          className="w-full border p-2"
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Category"
          className="w-full border p-2"
          onChange={(e) => setCategory(e.target.value)}
          required
        />

        <button className="bg-indigo-600 text-white px-4 py-2 rounded">
          Add Exam
        </button>
      </form>
    </div>
  );
}
