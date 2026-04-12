// src/pages/MockTestList.jsx
// Shows available tests for a specific exam
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, BookOpen, ChevronRight, Trophy, Target } from "lucide-react";

const API = "http://127.0.0.1:5000/api";

export default function MockTestList() {
  const { examName } = useParams();
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const decodedExam = decodeURIComponent(examName);

  useEffect(() => {
    fetch(`${API}/mock/tests/${encodeURIComponent(decodedExam)}`)
      .then(r => r.json())
      .then(data => { setTests(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [decodedExam]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => navigate("/free-tests")}
            className="flex items-center gap-2 text-blue-200 hover:text-white mb-4 transition text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to All Exams
          </button>
          <h1 className="text-3xl font-black">{decodedExam}</h1>
          <p className="text-blue-200 text-sm mt-1">
            {tests.length} Mock Test{tests.length !== 1 ? "s" : ""} Available
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Instructions box */}
        <div className="bg-white border border-blue-200 rounded-2xl p-5 mb-8 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-500" /> Test Instructions
          </h3>
          <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-600">
            {[
              "Each question has 4 options — select one answer",
              "You can navigate between questions freely",
              "Timer shown per question — track your speed",
              "Submit anytime to see your result",
              "Correct answers shown after submission",
              "Score, accuracy and time breakdown provided",
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-blue-500 font-bold flex-shrink-0">✓</span>
                {tip}
              </div>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading tests...</div>
        ) : (
          <div className="space-y-4">
            {tests.map(test => (
              <div key={test.test_no}
                className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm
                           hover:shadow-lg hover:border-blue-300 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Test number badge */}
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600
                                    flex items-center justify-center shadow-lg shadow-blue-200">
                      <span className="text-white font-black text-xl">{test.test_no}</span>
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900 text-lg">Mock Test {test.test_no}</h3>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3 text-blue-400" />
                          {test.question_count} Questions
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-orange-400" />
                          ~{Math.round(test.question_count * 1.5)} mins
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Trophy className="w-3 h-3 text-yellow-500" />
                          {test.question_count} marks
                        </span>
                      </div>
                      {/* Subjects */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {test.subjects.map(s => (
                          <span key={s}
                            className="text-[10px] font-semibold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/mock-test/${encodeURIComponent(decodedExam)}/${test.test_no}`)}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl
                               font-bold text-sm hover:bg-blue-700 transition shadow-lg shadow-blue-200 flex-shrink-0">
                    Start Test <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}