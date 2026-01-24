import { useState } from "react";
import axios from "axios";

const AdminAddExam = () => {
  const [form, setForm] = useState({
    exam_name: "",
    category: "",
    eligibility: "",
    exam_date: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post("http://localhost:5000/api/exams", form);
    alert("Exam Added Successfully");
  };

  return (
    <div className="p-10 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add New Exam</h1>

      <input name="exam_name" placeholder="Exam Name" onChange={handleChange} className="border p-2 w-full mb-3" />
      <input name="category" placeholder="Category" onChange={handleChange} className="border p-2 w-full mb-3" />
      <input name="eligibility" placeholder="Eligibility" onChange={handleChange} className="border p-2 w-full mb-3" />
      <input name="exam_date" placeholder="Exam Date" onChange={handleChange} className="border p-2 w-full mb-3" />

      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        Add Exam
      </button>
    </div>
  );
};

export default AdminAddExam;
