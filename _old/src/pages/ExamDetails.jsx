import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const ExamDetails = () => {
  const { id } = useParams();
  const [exam, setExam] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/exams/${id}`)
      .then((res) => setExam(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  if (!exam) return <p className="p-10">Loading...</p>;

  return (
    <div className="p-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{exam.exam_name}</h1>

      <p className="mb-2">
        <strong>Category:</strong> {exam.category}
      </p>

      <p className="mb-2">
        <strong>Eligibility:</strong> {exam.eligibility}
      </p>

      <p className="mb-2">
        <strong>Syllabus:</strong> {exam.syllabus}
      </p>

      <p className="mb-2">
        <strong>Exam Pattern:</strong> {exam.exam_pattern}
      </p>

      <p className="mb-2">
        <strong>Exam Date:</strong> {exam.exam_date}
      </p>
    </div>
  );
};

export default ExamDetails;
