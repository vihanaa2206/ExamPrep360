import { useEffect, useState } from "react";
import API from "../../services/api";

export default function AdminQueries() {
  const [queries, setQueries] = useState([]);
  const [answers, setAnswers] = useState({});

  const fetchQueries = async () => {
    try {
      const res = await API.get("/admin/queries");
      setQueries(res.data);
    } catch (err) {
      console.error("Error fetching queries", err);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  const submitAnswer = async (id) => {
    try {
      await API.post(`/admin/queries/${id}/answer`, {
        answer: answers[id],
      });
      setAnswers((prev) => ({ ...prev, [id]: "" }));
      fetchQueries();
    } catch (err) {
      console.error("Answer submit failed", err);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">User Queries</h2>

      {queries.length === 0 && (
        <p className="text-gray-500">No queries yet</p>
      )}

      {queries.map((q) => (
        <div
          key={q.id}
          className="bg-white border rounded p-4 mb-4"
        >
          <h4 className="font-semibold">❓ {q.question}</h4>

          <p className="text-sm text-gray-600">
            👤 {q.name} ({q.email})
          </p>

          <p className="text-sm text-gray-500">
            🕒 {q.created_at}
          </p>

          <p
            className={`mt-2 font-medium ${
              q.status === "answered"
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            Status: {q.status}
          </p>

          {q.status === "pending" ? (
            <>
              <textarea
                className="w-full border p-2 mt-3"
                placeholder="Type your answer..."
                value={answers[q.id] || ""}
                onChange={(e) =>
                  setAnswers({
                    ...answers,
                    [q.id]: e.target.value,
                  })
                }
              />

              <button
                onClick={() => submitAnswer(q.id)}
                className="mt-2 bg-indigo-600 text-white px-4 py-1 rounded"
              >
                Submit Answer
              </button>
            </>
          ) : (
            <div className="mt-3 bg-green-50 p-2 rounded">
              ✅ Answer: {q.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
