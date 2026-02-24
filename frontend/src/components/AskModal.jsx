import { useState } from "react";
import API from "../services/api";

export default function AskModal({ onClose }) {
  const [question, setQuestion] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const wordCount = question.trim().split(/\s+/).filter(Boolean).length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!user) {
      setError("Please login to ask a question");
      return;
    }

    if (wordCount > 100) {
      setError("Question must be within 100 words");
      return;
    }

    try {
      await API.post("/api/ask", {
  user: {
    name: user.name,
    email: user.email,
  },
  question,
});


      setMessage("Your question has been sent successfully ✅");
      setQuestion("");
    } catch (err) {
      setError("Unable to submit question");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-lg relative">

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-2">Ask Your Question</h2>
        <p className="text-sm text-gray-500 mb-4">
          Max 100 words. Admin will reply within 24 hours.
        </p>

        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        {message && <div className="text-green-600 text-sm mb-2">{message}</div>}

        <form onSubmit={handleSubmit}>
          <textarea
            rows="5"
            className="w-full border rounded-lg p-2"
            placeholder="Write your problem here..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          <div className="text-xs text-gray-500 mt-1">
            {wordCount}/100 words
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
