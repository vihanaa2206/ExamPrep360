import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Exams = () => {
  const [exams, setExams] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/exams")
      .then((response) => {
        setExams(response.data);
      })
      .catch((error) => {
        console.log("Error fetching exams", error);
      });
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">All Exams</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exams.map((exam) => (
          <div
            key={exam.exam_id}
            className="border rounded-lg p-6 shadow"
          >
            <Link to={`/exams/${exam.exam_id}`}>
  <h2 className="text-xl font-semibold text-blue-600 hover:underline">
    {exam.exam_name}
  </h2>
</Link>


            <p className="text-gray-600">
              Category: {exam.category}
            </p>

            <p className="text-sm mt-2">
              Eligibility: {exam.eligibility}
            </p>

            <p className="text-sm mt-1">
              Exam Date: {exam.exam_date}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Exams;
