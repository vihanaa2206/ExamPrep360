import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const TABS = [
  "application",
  "eligibility",
  "syllabus",
  "pattern",
  "preparation",
  "mockTests",
  "pyqs",
  "coaching",
  "ai"
];

const ExamDetails = () => {

  const { slug } = useParams();

  const [examData, setExamData] = useState(null);
  const [activeTab, setActiveTab] = useState("application");
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");

  useEffect(() => {

    fetch(`http://localhost:8000/api/exam/${slug}`)
      .then(res => res.json())
      .then(data => setExamData(data));

  }, [slug]);

  /* ======================
     AI LOGIC
  ====================== */

  const askAI = () => {

    const q = aiQuestion.toLowerCase();

    if (q.includes("important"))
      setAiAnswer("Focus on Mechanics, Organic Chemistry, and Calculus.");

    else if (q.includes("coaching"))
      setAiAnswer("PW for budget, Allen for rank improvement.");

    else
      setAiAnswer("Focus on syllabus completion + PYQs + mocks.");
  };

  if (!examData) return <h2>Loading...</h2>;

  return (
    <div className="max-w-6xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">{slug}</h1>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3 mb-6">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* CONTENT */}

      <div className="bg-white p-6 shadow rounded">

        {/* NORMAL TABS */}
        {TABS.includes(activeTab) &&
          activeTab !== "pyqs" &&
          activeTab !== "coaching" &&
          activeTab !== "ai" && (

            <ul>
              {examData[activeTab]?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}

        {/* PYQ TAB */}
        {activeTab === "pyqs" && (

          <div>
            {examData.pyqs?.map(file => (
              <a
                key={file}
                href={`http://localhost:8000/api/pyq/${file}`}
                target="_blank"
                rel="noreferrer"
                className="block text-blue-600 underline"
              >
                {file}
              </a>
            ))}
          </div>
        )}

        {/* COACHING */}
        {activeTab === "coaching" && (

          <table className="w-full border">
            <thead>
              <tr>
                <th>Name</th>
                <th>Rating</th>
                <th>Fees</th>
              </tr>
            </thead>

            <tbody>
              {examData.coaching?.map((c, i) => (
                <tr key={i} className="border-t text-center">
                  <td>{c.name}</td>
                  <td>{c.rating}</td>
                  <td>{c.fees}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* AI */}
        {activeTab === "ai" && (

          <div>

            <input
              value={aiQuestion}
              onChange={(e) => setAiQuestion(e.target.value)}
              placeholder="Ask AI..."
              className="border p-2 w-full mb-3"
            />

            <button
              onClick={askAI}
              className="bg-blue-600 text-white px-4 py-2"
            >
              Ask AI
            </button>

            <p className="mt-4">{aiAnswer}</p>

          </div>
        )}

      </div>
    </div>
  );
};

export default ExamDetails;
