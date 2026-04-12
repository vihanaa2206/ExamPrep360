import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Exams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/exams")
      .then((response) => {
        setExams(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error fetching exams", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="text-lg font-semibold">Loading exams...</div>
      </div>
    );
  }

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Explore Engineering Entrance Exams
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
        {exams.map((exam) => (
          <div
            key={exam._id}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition"
          >
            <Link to={`/exams/${exam.slug}`}>
              <h2 className="text-xl font-bold text-blue-600 hover:underline">
                {exam.name}
              </h2>
            </Link>

            <p className="text-gray-600 mt-2">
              <span className="font-semibold">Category:</span> {exam.category}
            </p>

            <p className="text-gray-500 mt-2 text-sm">
              Click to view full exam details, syllabus, pattern, mock tests and coaching comparison.
            </p>

            <div className="mt-4">
              <Link
                to={`/exams/${exam.slug}`}
                className="text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Exams;